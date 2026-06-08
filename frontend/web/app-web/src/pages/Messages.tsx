// Pagina de mensajeria en tiempo real: lista de chats, visualizacion de mensajes y envio mediante Socket.io.
import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';
import { Chat, Message, UserRole } from '../types';
import { MessageSquare, Send, User, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Ref para acceder al chat activo dentro del handler del socket sin que quede capturado en el closure inicial
  const activeChatRef = useRef<Chat | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Mantener la ref siempre sincronizada con el estado actual para evitar stale closures en el socket
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  // Recargar la lista de chats cada vez que cambia el usuario activo
  useEffect(() => {
    loadChats();
  }, [user]);

  // Conexion Socket.io para recibir mensajes entrantes en tiempo real
  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem('agro_token');
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

    // Conectar al namespace /messages del servidor con el token JWT en el handshake
    const socket = io(`${apiUrl}/messages`, {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      // Unirse a la sala personal del usuario para recibir solo sus mensajes
      socket.emit('join', Number(user.id));
    });

    socket.on('new_message', (msg: any) => {
      const incoming: Message = {
        id: msg.id ?? '',
        senderId: msg.senderId ?? '',
        senderName: '',
        receiverId: user.id,
        receiverName: user.name ?? '',
        content: msg.text ?? '',
        timestamp: msg.timestamp ?? new Date().toISOString(),
        read: false,
      };

      setChats(prev => prev.map(chat => {
        if (chat.id === msg.conversationId) {
          const updated = { ...chat, messages: [...chat.messages, incoming], lastMessage: incoming };
          // Se usa activeChatRef (no activeChat) para evitar leer un closure obsoleto
          if (activeChatRef.current?.id === chat.id) {
            setActiveChat(updated);
          }
          return updated;
        }
        return chat;
      }));
    });

    // Desconectar el socket al desmontar para liberar recursos
    return () => { socket.disconnect(); };
  }, [user]);

  // Seleccionar automaticamente el chat del vendedor cuando se llega desde el Marketplace
  useEffect(() => {
    if (chats.length === 0) return;

    const state = location.state as { selectParticipantId?: string } | null;
    if (state && state.selectParticipantId) {
      const targetChat = chats.find(c => c.participantId === state.selectParticipantId);
      if (targetChat) {
        setActiveChat(targetChat);
        // Limpiar el estado de la ruta para que una recarga no vuelva a forzar la seleccion
        window.history.replaceState({}, document.title);
      }
    }
  }, [chats, location.state]);

  // Desplazar el scroll al ultimo mensaje cada vez que llega uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const loadChats = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await chatService.getChats(user.id);
      setChats(data);
      
      // If we already have an active chat, refresh its contents from the new data
      if (activeChat) {
        const refreshed = data.find(c => c.id === activeChat.id);
        if (refreshed) {
          setActiveChat(refreshed);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeChat || !typedMessage.trim()) return;

    const textToSend = typedMessage.trim();
    setTypedMessage('');

    try {
      const sentMsg = await chatService.sendMessage(user.id, activeChat.participantId, textToSend);

      // Actualizacion optimista: añadir el mensaje enviado al estado local sin esperar a recargar los chats
      const updatedMessages = [...activeChat.messages, sentMsg];
      const updatedActiveChat = {
        ...activeChat,
        messages: updatedMessages,
        lastMessage: sentMsg,
      };
      
      setActiveChat(updatedActiveChat);
      
      // Mover el chat activo al principio de la lista (como WhatsApp/Telegram)
      setChats(prev => {
        const otherChats = prev.filter(c => c.id !== activeChat.id);
        return [updatedActiveChat, ...otherChats];
      });

      // En modo mock se simula una respuesta automatica del otro participante tras 1.5 segundos
      if (import.meta.env.VITE_USE_MOCK_API === 'true') {
        simulateResponse(activeChat.participantId, activeChat.participantName, textToSend);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Genera una respuesta contextual automatica del otro usuario para hacer la demo mas realista
  const simulateResponse = (receiverId: string, receiverName: string, userMsg: string) => {
    setTimeout(async () => {
      if (!user) return;

      // Seleccionar la replica segun palabras clave del mensaje del usuario
      let reply = 'Hola. He recibido tu mensaje. Lo reviso y te comento en breve.';
      const lower = userMsg.toLowerCase();
      
      if (lower.includes('disponible') || lower.includes('stock') || lower.includes('tienes')) {
        reply = 'Hola. Sí, el producto sigue estando disponible en las cantidades indicadas en la publicación. ¿Qué cantidad estarías buscando comprar?';
      } else if (lower.includes('precio') || lower.includes('cuesta') || lower.includes('descuento')) {
        reply = 'El precio base es el publicado, pero si la compra es en gran volumen, podríamos negociar una rebaja o la inclusión del porte de transporte.';
      } else if (lower.includes('envio') || lower.includes('transporte') || lower.includes('recoger')) {
        reply = 'Podemos coordinar la recogida en mi dirección o bien puedo contratar un camión por mi zona si pagas los gastos de envío.';
      } else if (lower.includes('hola') || lower.includes('buenas')) {
        reply = '¡Hola! Gracias por contactarme. ¿En qué puedo ayudarte en relación al anuncio?';
      }

      try {
        // El mensaje simulado se envia en sentido inverso (el otro participante al usuario actual)
        const receivedMsg = await chatService.sendMessage(receiverId, user.id, reply);

        const data = await chatService.getChats(user.id);
        setChats(data);

        // Solo actualizar la ventana activa si el usuario no ha cambiado de chat durante el timeout
        setActiveChat(prev => {
          if (prev && prev.participantId === receiverId) {
            return {
              ...prev,
              messages: [...prev.messages, receivedMsg],
              lastMessage: receivedMsg,
            };
          }
          return prev;
        });
      } catch (err) {
        console.error(err);
      }
    }, 1500);
  };

  // Abre un chat y marca como leidos todos los mensajes del otro participante
  const handleSelectChat = async (chat: Chat) => {
    if (!user) return;
    setActiveChat(chat);

    try {
      await chatService.markAsRead(chat.id, user.id);

      // Actualizar el indicador de no leidos en la barra lateral sin recargar todos los chats
      setChats(prev =>
        prev.map(c => {
          if (c.id === chat.id) {
            return {
              ...c,
              messages: c.messages.map(m => m.senderId === chat.participantId ? { ...m, read: true } : m)
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleLabel = (role: UserRole) => {
    const roles: Record<UserRole, string> = {
      farmer: 'Agricultor',
      distributor: 'Distribuidor',
      supplier: 'Proveedor',
      admin: 'Administrador',
    };
    return roles[role] || role;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Devuelve true si hay mensajes del participante que aun no han sido leidos
  const hasUnread = (chat: Chat) => {
    if (!user) return false;
    return chat.messages.some(m => m.senderId === chat.participantId && !m.read);
  };

  return (
    <div className="fade-in">
      <div className="chat-layout">
        
        {/* Chats Sidebar */}
        <div className="chat-sidebar-pane">
          <div className="chat-pane-header">
            <MessageSquare size={18} />
            <span style={{ display: 'none', md: 'block' } as any}>Mis Mensajes</span>
          </div>

          <div className="chat-list-container">
            {loading && chats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                Cargando...
              </div>
            ) : chats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No tienes chats activos.
              </div>
            ) : (
              chats.map(chat => (
                <div 
                  key={chat.id} 
                  className={`chat-item-row ${activeChat?.id === chat.id ? 'active' : ''}`}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className="chat-item-avatar">
                    {getInitials(chat.participantName)}
                  </div>
                  <div className="chat-item-content">
                    <div className="chat-item-meta">
                      <span className="chat-item-name" style={{ fontWeight: hasUnread(chat) ? 800 : 600 }}>
                        {chat.participantName.split(' (')[0]}
                      </span>
                      {chat.lastMessage && (
                        <span className="chat-item-time">
                          {formatTime(chat.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="chat-item-meta" style={{ marginTop: '2px' }}>
                      <span 
                        className="chat-item-lastmsg" 
                        style={{ 
                          fontWeight: hasUnread(chat) ? 700 : 400,
                          color: hasUnread(chat) ? 'var(--text)' : 'var(--text-muted)'
                        }}
                      >
                        {chat.lastMessage ? chat.lastMessage.content : 'Sin mensajes'}
                      </span>
                      {hasUnread(chat) && (
                        <span style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: 'var(--primary-light)',
                          borderRadius: '50%',
                          display: 'inline-block'
                        }} />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Active Panel */}
        <div className="chat-main-pane">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="chat-active-header">
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                    {activeChat.participantName.split(' (')[0]}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--primary-light)', borderRadius: '50%' }} />
                    En línea • {getRoleLabel(activeChat.participantRole)}
                  </div>
                </div>
              </div>

              {/* Message Stream */}
              <div className="chat-messages-stream">
                {activeChat.messages.map(msg => {
                  const isSent = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`msg-row ${isSent ? 'sent' : 'received'}`}>
                      <div className={`msg-bubble ${isSent ? 'sent' : 'received'}`}>
                        {msg.content}
                      </div>
                      <span className="msg-timestamp">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input composer */}
              <form onSubmit={handleSendMessage} className="chat-composer">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Escribe un mensaje..."
                  value={typedMessage}
                  onChange={(e) => setTypedMessage(e.target.value)}
                  style={{ height: '42px' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem', height: '42px' }}>
                  <Send size={18} />
                  <span style={{ display: 'none', md: 'inline' } as any}>Enviar</span>
                </button>
              </form>
            </>
          ) : (
            /* Empty State */
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <h4>Bandeja de Entrada</h4>
              <p style={{ fontSize: '0.9rem', marginTop: '0.25rem', maxWidth: '300px' }}>
                Selecciona una conversación del lateral izquierdo para ver tus mensajes o inicia un chat desde el marketplace.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
