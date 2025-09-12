
"use client";

import { useState, useEffect, useCallback } from "react";
import useWebSocket from "@/utils/useWebSocket";

const SESSION_KEY = "chat_session";

export default function useUserChat(userName, userEmail) {
  const [messages, setMessages] = useState([]);
  const [hasHistory, setHasHistory] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);

  // -----------------------------
  // Username validation (no spaces)
  // -----------------------------
  useEffect(() => {
    if (!userName) return;
    if (/\s/.test(userName)) {
      setError("Username must not contain spaces");
      return;
    }
    setError(null);
  }, [userName]);

  // -----------------------------
  // Generate/load session
  // -----------------------------
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(SESSION_KEY)) || {};
    const now = Date.now();

    if (stored.id && stored.start && now - stored.start < 24 * 60 * 60 * 1000) {
      setSessionId(stored.id);
    } else {
      const newId = crypto.randomUUID();
      setSessionId(newId);
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ id: newId, start: now, email: userEmail || "" })
      );
    }
  }, [userEmail]);

  // -----------------------------
  // WebSocket connection
  // -----------------------------
  const { sendMessage, connected, disconnect } = useWebSocket(
    !error ? userName : null,
    (data) => {
      if (!data) return;

      // -----------------------------
      // Content normalization
      // -----------------------------
      const getContent = (msg) => msg.content || msg.message || msg.msg || msg.text || "";

      switch (data.type) {
        case "chat_message":
          setMessages((prev) => {
            const normalizedMsg = {
              id: data.id || crypto.randomUUID(),
              sender: data.sender === userName ? "user" : "admin",
              content: getContent(data),
              timestamp: data.timestamp || new Date().toISOString(),
            };
            if (prev.find((m) => m.id === normalizedMsg.id)) return prev;
            return [...prev, normalizedMsg].sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );
          });
          break;

        case "previous_messages":
          if (Array.isArray(data.messages)) {
            const history = data.messages.map((msg) => ({
              id: msg.id || crypto.randomUUID(),
              sender: msg.sender === userName ? "user" : "admin",
              content: getContent(msg),
              timestamp: msg.timestamp,
            }));
            setMessages(history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
            setHasHistory(history.length > 0);
          }
          break;

        default:
          break;
      }
    }
  );

  // -----------------------------
  // Send user message
  // -----------------------------
  const sendUserMessage = useCallback(
    (content) => {
      if (!content || !sessionId || error) return;

      const payload = {
        type: "chat_message",
        sender: userName,
        target: "admin",
        content,
        timestamp: new Date().toISOString(),
        id: crypto.randomUUID(),
      };

      sendMessage(payload);
    },
    [sendMessage, userName, sessionId, error]
  );

  // -----------------------------
  // Send typing indicator
  // -----------------------------
  const sendTyping = useCallback(() => {
    if (!sessionId || error) return;
    sendMessage({ type: "typing", sender: userName, sessionId });
  }, [sendMessage, userName, sessionId, error]);

  // -----------------------------
  // End chat
  // -----------------------------
  const endChat = useCallback(() => {
    if (sessionId) sendMessage({ type: "end_chat", sessionId });
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
    setMessages([]);
  }, [sendMessage, sessionId]);

  // -----------------------------
  // Load chat history manually
  // -----------------------------
  const loadHistory = useCallback(async () => {
    if (!sessionId || error) return;
    try {
      const res = await fetch(`/api/chat/history/${sessionId}/`);
      const data = await res.json();
      const getContent = (msg) => msg.content || msg.message || msg.msg || msg.text || "";
      const history = data.map((msg) => ({
        id: msg.id || crypto.randomUUID(),
        sender: msg.sender === userName ? "user" : "admin",
        content: getContent(msg),
        timestamp: msg.timestamp,
      }));
      setMessages(history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
      setHasHistory(history.length > 0);
    } catch (err) {
      console.error("History load failed:", err);
    }
  }, [sessionId, error, userName]);

  return {
    messages,
    connected,
    sendMessage: sendUserMessage,
    sendTyping,
    hasHistory,
    sessionId,
    endChat,
    disconnect,
    setMessages,
    username: userName,
    loadHistory,
    error,
  };
}
