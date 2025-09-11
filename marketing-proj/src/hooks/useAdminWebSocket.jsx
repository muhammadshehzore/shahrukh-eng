"use client";

import { useEffect, useRef, useState } from "react";
import { getValidAdminToken } from "@/lib/auth"; // helper to refresh token

export default function useAdminWebSocket(initialToken) {
  const ws = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const subscribers = useRef(new Set());

  // Subscribe / Unsubscribe
  const subscribe = (callback) => {
    subscribers.current.add(callback);
    return () => subscribers.current.delete(callback);
  };

  // Disconnect manually
  const disconnect = () => {
    if (ws.current) ws.current.close();
  };

  // Send message
  const sendMessage = (msg) => {
    if (ws.current && connected) {
      ws.current.send(JSON.stringify(msg));
      setMessages((prev) => [...prev, msg]);
    }
  };

  useEffect(() => {
    if (!initialToken) return;

    const connectWS = async () => {
      const token = await getValidAdminToken();
      if (!token) {
        console.error("❌ No valid admin token available");
        return;
      }

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      // 👇 Force Django/Daphne port 8000
      const wsUrl = `${protocol}://localhost:8000/ws/chat/admin/?token=${token}`;

      console.log("🔗 Connecting admin WebSocket to:", wsUrl);

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("✅ Admin WS connected");
        setConnected(true);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          subscribers.current.forEach((cb) => cb(data));
          setMessages((prev) => [...prev, data]);
        } catch (err) {
          console.error("Invalid JSON message", err);
        }
      };

      ws.current.onclose = (e) => {
        console.warn("❌ Admin WS disconnected", e.code, e.reason || "");
        setConnected(false);
        setTimeout(connectWS, 3000);
      };

      ws.current.onerror = (err) => {
        console.error("Admin WS error:", err);
        ws.current.close();
      };
    };

    connectWS();

    return () => {
      if (ws.current) ws.current.close();
      subscribers.current.clear();
    };
  }, [initialToken]);

  return { connected, messages, sendMessage, subscribe, disconnect };
}
