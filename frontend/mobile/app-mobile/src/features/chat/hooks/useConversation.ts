// src/features/chat/hooks/useConversation.ts
// Encapsula la lógica de una conversación individual: carga de mensajes,
// envío, y conexión en tiempo real via Socket.io.

import { useState, useCallback, useRef, useEffect } from "react";
import { FlatList } from "react-native";
import { io, Socket } from "socket.io-client";
import { ChatMessage } from "../types/chat.types";
import { useChat } from "./useChat";
import { useAuth } from "../../auth/hooks/useAuth";
import { getToken } from "../../auth/utils/tokenStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";
const isMockMode = () => __DEV__ && process.env.EXPO_PUBLIC_USE_MOCK === "true";

export const useConversation = (conversationId: string) => {
  const { getMessages, sendMessage, markAsRead } = useChat();
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [inputText, setInputText] = useState("");
  const listRef = useRef<FlatList>(null);
  const socketRef = useRef<Socket | null>(null);

  // Scroll al final de la lista con un pequeño retardo para que FlatList haya renderizado
  const scrollToEnd = (animated = false) => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated }), 80);
  };

  // En modo mock no se conecta al WebSocket (no hay token real ni backend activo)
  useEffect(() => {
    if (isMockMode()) return;

    let socket: Socket;

    (async () => {
      const token = await getToken();
      if (!token) return;
      socket = io(`${API_URL}/messages`, {
        auth: { token },
        transports: ["websocket"],
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        if (user?.id) socket.emit("join", Number(user.id));
      });

      // Solo procesamos mensajes que pertenezcan a esta conversación
      socket.on("new_message", (msg: any) => {
        if (msg.conversationId === conversationId) {
          setMessages((prev) => [...prev, {
            id: msg.id,
            senderId: msg.senderId,
            text: msg.text,
            timestamp: msg.timestamp,
            read: msg.read ?? false,
          }]);
          scrollToEnd(true);
        }
      });
    })();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [conversationId, user?.id]);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMessages(conversationId);
      setMessages(data);
      scrollToEnd(false);
    } finally {
      setLoading(false);
    }
    await markAsRead(conversationId);
  }, [conversationId]);

  const send = async () => {
    const text = inputText.trim();
    if (!text || sending) return;

    setInputText("");
    setSending(true);
    try {
      const newMsg = await sendMessage(conversationId, text);
      setMessages((prev) => [...prev, newMsg]);
      scrollToEnd(true);
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    loading,
    sending,
    inputText,
    setInputText,
    listRef,
    loadMessages,
    send,
  };
};