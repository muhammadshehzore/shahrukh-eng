"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function useChatWebSocket(username, token = null) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [hasHistory, setHasHistory] = useState(false);

  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  // Decide protocol
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";

  // If NEXT_PUBLIC_API_URL is defined, use it directly (full host:port string).
  // Otherwise, default to current hostname with port 8000.
  const backendHost =
    process.env.NEXT_PUBLIC_API_URL ||
    `${window.location.hostname}:8000`;

  const WS_URL =
    username === "admin"
      ? `${protocol}://${backendHost}/ws/admin/?token=${token || ""}`
      : `${protocol}://${backendHost}/ws/user/${encodeURIComponent(username)}/`;

  const connect = useCallback(() => {
    if (wsRef.current) wsRef.current.close();

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS connected");
      setConnected(true);
      clearTimeout(reconnectRef.current);

      if (!hasHistory && username !== "admin") {
        ws.send(JSON.stringify({ type: "init" }));
        setHasHistory(true);
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "chat_message":
            setMessages((prev) => [
              ...prev,
              {
                sender: data.sender,
                text: data.message || data.content,
                timestamp: data.timestamp || new Date().toISOString(),
              },
            ]);
            break;

          case "history":
            if (Array.isArray(data.messages)) {
              const history = data.messages.map((msg) => ({
                sender: msg.sender,
                text: msg.message || msg.content,
                timestamp: msg.timestamp || new Date().toISOString(),
              }));
              setMessages(history);
            }
            break;

          case "users_update":
            if (Array.isArray(data.users)) setOnlineUsers(data.users);
            break;

          case "user_status":
            setOnlineUsers((prev) => {
              const updated = new Set(prev);
              if (data.online) updated.add(data.user);
              else updated.delete(data.user);
              return Array.from(updated);
            });
            break;

          default:
            break;
        }
      } catch (err) {
        console.error("WS message parse error:", err);
      }
    };

    ws.onclose = (e) => {
      console.warn("❌ WS disconnected, reconnecting...", e.code);
      setConnected(false);
      reconnectRef.current = setTimeout(connect, 2000);
    };

    ws.onerror = (err) => {
      console.error("WS error:", err);
      ws.close();
    };
  }, [WS_URL, username, hasHistory]);

  const sendMessage = useCallback(
    (text, target = null) => {
      if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

      const payload = { type: "chat_message", sender: username, content: text };
      if (target) payload.target = target;

      wsRef.current.send(JSON.stringify(payload));
      setMessages((prev) => [...prev, { sender: username, text }]);
    },
    [username]
  );

  const loadHistory = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "init" }));
      setHasHistory(true);
    }
  }, []);

  useEffect(() => {
    if (!username) return;
    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
      clearTimeout(reconnectRef.current);
    };
  }, [connect, username]);

  return { connected, messages, sendMessage, loadHistory, onlineUsers, hasHistory };
}
