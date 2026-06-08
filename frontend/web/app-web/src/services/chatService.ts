/// <reference types="vite/client" />
// Servicio de mensajería: obtención de conversaciones, envío de mensajes y marcado de lectura.
import { api } from './api';
import { dbService } from './mockDb';
import { Chat, Message, UserRole } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ── Servicio ───────────────────────────────────────────────────────────────────

export const chatService = {
  getChats: async (userId: string): Promise<Chat[]> => {
    if (USE_MOCK) {
      await delay(400);
      return dbService.getChats(userId);
    }
    const convList = await api.get('/conversations');
    return (convList ?? []).map((conv: any) => {
      // Construir un objeto Message mínimo para el último mensaje mostrado en la lista
      const lastMsg: Message | undefined = conv.lastMessage
        ? {
            id: '',
            senderId: '',
            senderName: conv.participantName,
            receiverId: userId,
            receiverName: '',
            content: conv.lastMessage,
            timestamp: conv.lastMessageTime ?? '',
            // Se considera leído cuando el contador de no leídos es cero
            read: conv.unreadCount === 0,
          }
        : undefined;
      return {
        id: conv.id,
        participantId: conv.participantId,
        participantName: conv.participantName,
        // El backend no expone el rol del participante en este endpoint
        participantRole: 'farmer' as UserRole,
        // Los mensajes completos se cargan al abrir la conversación
        messages: [],
        lastMessage: lastMsg,
      } satisfies Chat;
    });
  },

  sendMessage: async (senderId: string, receiverId: string, content: string): Promise<Message> => {
    if (USE_MOCK) {
      await delay(200);
      return dbService.sendMessage(senderId, receiverId, content);
    }
    // Obtener o crear la conversación antes de enviar el mensaje (el backend es idempotente aquí)
    const conv = await api.post('/conversations', { participant_id: parseInt(receiverId) });
    const raw = await api.post(`/conversations/${conv.id}/messages`, { text: content });
    return {
      id: raw.id?.toString() ?? '',
      senderId,
      senderName: '',
      receiverId,
      receiverName: '',
      content: raw.text ?? raw.content ?? '',
      timestamp: raw.timestamp?.toString() ?? '',
      read: raw.read ?? false,
    };
  },

  markAsRead: async (chatId: string, _currentUserId: string): Promise<void> => {
    if (USE_MOCK) {
      dbService.markAsRead(chatId, _currentUserId);
      return;
    }
    await api.patch(`/conversations/${chatId}/read`);
  },
};
