// -------------------------
// useAdminChat.js
// -------------------------
"use client";
import useWebSocket from "@/utils/useWebSocket";
import { useState, useCallback, useEffect } from "react";

export default function useAdminChat(token) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chats, setChats] = useState({});
  const [unread, setUnread] = useState({});
  const [typingUsers, setTypingUsers] = useState({});

  const { connected, sendMessage, endChat } = useWebSocket("admin", (data) => {
    if (!data) return;

    switch (data.type) {
      case "online_users":
        setOnlineUsers(data.users || []);
        break;

      case "chat_message": {
        const chatUser = data.sender === "admin" ? data.target : data.sender;
        const messageWithDisplay = {
          ...data,
          displayName: data.sender === "admin" ? "Admin" : data.sender,
        };

        setChats((prev) => {
          const userChats = prev[chatUser] || [];
          if (userChats.find((m) => m.id === data.id)) return prev;
          return {
            ...prev,
            [chatUser]: [...userChats, messageWithDisplay].sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            ),
          };
        });

        if (data.sender !== "admin") {
          setUnread((prev) => ({
            ...prev,
            [chatUser]: (prev[chatUser] || 0) + 1,
          }));
        }
        break;
      }

      case "previous_messages": {
        if (Array.isArray(data.messages)) {
          data.messages.forEach((msg) => {
            const chatUser = msg.sender === "admin" ? msg.target : msg.sender;
            const messageWithDisplay = {
              ...msg,
              displayName: msg.sender === "admin" ? "Admin" : msg.sender,
            };

            setChats((prev) => {
              const userChats = prev[chatUser] || [];
              if (userChats.find((m) => m.id === msg.id)) return prev;
              return {
                ...prev,
                [chatUser]: [...userChats, messageWithDisplay].sort(
                  (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                ),
              };
            });

            if (msg.sender !== "admin") {
              setUnread((prev) => ({
                ...prev,
                [chatUser]: (prev[chatUser] || 0) + 1,
              }));
            }
          });
        }
        break;
      }

      case "user_typing": {
        const { user, typing } = data;
        setTypingUsers((prev) => ({ ...prev, [user]: typing }));
        break;
      }

      case "end_chat": {
        const room = data.sender || data.room;
        setChats((prev) => {
          const copy = { ...prev };
          delete copy[room];
          return copy;
        });
        setUnread((prev) => {
          const copy = { ...prev };
          delete copy[room];
          return copy;
        });
        break;
      }

      case "user_status":
        if (data.user) {
          setOnlineUsers((prev) => {
            const exists = prev.includes(data.user);
            if (data.online && !exists) return [...prev, data.user];
            if (!data.online) return prev.filter((u) => u !== data.user);
            return prev;
          });
        }
        break;

      default:
        break;
    }
  });

  // Fetch offline/pending messages after connection
  useEffect(() => {
    if (connected) {
      sendMessage({ type: "fetch_pending_messages" });
    }
  }, [connected, sendMessage]);

  const sendAdminMessage = useCallback(
    (user, content) => {
      if (!user || !content.trim()) return;
      const payload = {
        type: "chat_message",
        sender: "admin",
        target: user,
        content,
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID(),
      };
      sendMessage(payload);
    },
    [sendMessage]
  );

  const sendTypingStatus = useCallback(
    (user, typing) => {
      if (!user) return;
      sendMessage({ type: "user_typing", user, typing });
    },
    [sendMessage]
  );

  const resetUnread = useCallback((user) => {
    setUnread((prev) => {
      const copy = { ...prev };
      delete copy[user];
      return copy;
    });
  }, []);

  return {
    connected,
    onlineUsers,
    chats,
    unread,
    typingUsers,
    sendAdminMessage,
    sendTypingStatus,
    resetUnread,
    endChat,
  };
}
