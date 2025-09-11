"use client";
import { useEffect, useRef, useState, useCallback } from "react";

let wsInstance = null;
let listeners = new Set();

export default function useUserWebSocket(name) {
  const [connected, setConnected] = useState(false);

  const sendMessage = useCallback((msg) => {
    if (wsInstance?.readyState === WebSocket.OPEN) wsInstance.send(JSON.stringify(msg));
    else console.warn("WS not open, message not sent:", msg);
  }, []);

  useEffect(() => {
    if (!name) return;

    if (!wsInstance || wsInstance.readyState === WebSocket.CLOSED) {
      wsInstance = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${name}/`);

      wsInstance.onopen = () => {
        console.log("✅ User WS connected");
        setConnected(true);
      };

      wsInstance.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          listeners.forEach(fn => fn(data));
        } catch (e) { console.error("WS parse error:", e); }
      };

      wsInstance.onclose = (event) => {
        console.log("❌ User WS disconnected", event.code);
        setConnected(false);
        if (!event.wasClean) setTimeout(() => wsInstance = null, 5000);
      };

      wsInstance.onerror = (err) => {
        console.error("WS error:", err);
        wsInstance.close();
      };
    }

    return () => listeners.clear();
  }, [name]);

  const subscribe = useCallback((callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }, []);

  return { connected, sendMessage, subscribe };
}
