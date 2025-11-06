"use client";

import { useState, useEffect, useRef } from "react";
import { Send, MessageSquare } from "lucide-react";
import { getLocalUserId, getLocalUserName } from "@/lib/local-user";

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}

interface ChatComponentProps {
  activityId: string;
}

export default function ChatComponent({ activityId }: ChatComponentProps) {
  const userId = getLocalUserId();
  const userName = getLocalUserName();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    // Simular atualizações em tempo real (em produção, usar Firebase Realtime Database)
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [activityId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/atividades/chat?activityId=${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch("/api/atividades/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId,
          userId,
          userName,
          message: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage("");
        loadMessages();
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <div className="bg-steam-darker border border-steam-blue rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-6 h-6 text-steam-blueLight" />
        <h3 className="text-xl font-bold text-white">Chat da Atividade</h3>
      </div>

      {/* Mensagens */}
      <div className="bg-steam-dark rounded-lg p-4 h-64 overflow-y-auto mb-4 space-y-3">
        {loading ? (
          <div className="text-center text-gray-400 py-8">Carregando mensagens...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Nenhuma mensagem ainda. Seja o primeiro a comentar!
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.userId === userId;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isOwn
                      ? "bg-steam-blueLight text-white"
                      : "bg-steam-dark text-gray-300 border border-steam-blue"
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">{msg.userName}</div>
                  <div>{msg.message}</div>
                  <div className="text-xs opacity-75 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-steam-dark border border-steam-blue rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-steam-blueLight"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="px-6 py-2 bg-steam-blueLight hover:bg-steam-blue text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

