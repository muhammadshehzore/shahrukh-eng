"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { getToken, refreshTokenIfNeeded } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";

// ----- Singleton Admin WS -----
let adminSocket = null;
let adminConnected = false;
let adminReconnectRef = null;
let adminReconnectAttempts = 0;
let adminTokenCache = null;

// ----- Singleton User WS -----
let userSocket = null;
let userConnected = false;
let userReconnectRef = null;
let userReconnectAttempts = 0;

export default function useWebSocket(username, onMessage) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const maxRetries = 10;
  const baseDelay = 2000;
  const backendHost = "127.0.0.1:8000";

  // --- Get valid admin token ---
  const getValidAdminToken = useCallback(async () => {
    let token = getToken("access");
    if (!token) return null;

    try {
      const { exp } = jwtDecode(token);
      if (!exp || Date.now() / 1000 >= exp - 30) {
        token = await refreshTokenIfNeeded();
      }
    } catch (e) {
      console.warn("JWT decode failed:", e);
    }
    return token;
  }, []);

  // --- Connect Function ---
  const connect = useCallback(
    async (cachedToken = null) => {
      if (!username) return;

      if (
        (username === "admin" && adminSocket?.readyState === WebSocket.OPEN) ||
        (username !== "admin" && userSocket?.readyState === WebSocket.OPEN)
      ) {
        console.log("⚠️ Already connected, skipping new connect()");
        return;
      }

      let token = cachedToken;
      if (username === "admin" && !token) {
        token = await getValidAdminToken();
        if (!token) {
          console.warn("Admin token invalid, aborting WS connect");
          return;
        }
        adminTokenCache = token;
      }

      const protocol = window.location.protocol === "https:" ? "wss" : "ws";
      const baseUrl = `${protocol}://${backendHost}/ws/chat/`;

      const url =
        username === "admin"
          ? `${baseUrl}admin/?token=${encodeURIComponent(token)}`
          : `${baseUrl}user/${encodeURIComponent(username)}/`;

      const ws = new WebSocket(url);

      if (username === "admin") adminSocket = ws;
      else userSocket = ws;

      socketRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WS connected:", url);
        setConnected(true);
        setError(null);

        const sessionRoom = localStorage.getItem("chat_room");
        if (sessionRoom) {
          ws.send(
            JSON.stringify({
              type: "join_room",
              room: sessionRoom,
              sender: username,
            })
          );
        }

        if (username === "admin") {
          adminConnected = true;
          adminReconnectAttempts = 0;
          if (adminReconnectRef) clearTimeout(adminReconnectRef);
        } else {
          userConnected = true;
          userReconnectAttempts = 0;
          if (userReconnectRef) clearTimeout(userReconnectRef);
        }
      };

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          onMessage?.(data);
        } catch (e) {
          console.error("WS parse error:", e);
        }
      };

      ws.onclose = async (e) => {
        console.log("WS Closed", e.code, e.reason);
        setConnected(false);

        if (username === "admin") adminSocket = null;
        else userSocket = null;

        if (e.code === 1000) {
          console.log("✅ Normal close, not reconnecting.");
          return;
        }

        const attempts =
          username === "admin" ? adminReconnectAttempts : userReconnectAttempts;

        if (attempts < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempts);
          console.warn(`❌ WS disconnected, retrying in ${delay / 1000}s...`);

          const timer = setTimeout(async () => {
            const newToken =
              username === "admin" ? await getValidAdminToken() : null;

            if (username === "admin") {
              adminReconnectAttempts += 1;
              connect(newToken);
              adminReconnectRef = null;
            } else {
              userReconnectAttempts += 1;
              connect(newToken);
              userReconnectRef = null;
            }
          }, delay);

          if (username === "admin") adminReconnectRef = timer;
          else userReconnectRef = timer;
        } else {
          console.error("❌ WS max retry attempts reached. No further reconnects.");
          setError("Connection lost. Please refresh the page.");
        }
      };

      ws.onerror = (err) => {
        console.error("WS error:", err);
      };
    },
    [username, onMessage, getValidAdminToken]
  );

  // --- Init Connection ---
  useEffect(() => {
    const init = async () => {
      if (username === "admin") {
        if (adminSocket) {
          socketRef.current = adminSocket;
          setConnected(adminConnected);
        } else {
          const token = await getValidAdminToken();
          if (token) connect(token);
        }
      } else {
        if (userSocket) {
          socketRef.current = userSocket;
          setConnected(userConnected);
        } else {
          connect();
        }
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounted");
        socketRef.current = null;
      }
      if (username === "admin") {
        if (adminReconnectRef) clearTimeout(adminReconnectRef);
      } else {
        if (userReconnectRef) clearTimeout(userReconnectRef);
      }
    };
  }, [username]);

  // --- Send Message ---
  const sendMessage = useCallback((message, target = null) => {
    if (socketRef.current?.readyState !== WebSocket.OPEN) {
      console.warn("WS not open, message not sent:", message);
      return;
    }

    let payload;
    if (typeof message === "string") {
      payload = { type: "chat_message", message };
      if (target) payload.target = target;
    } else if (typeof message === "object") {
      payload = message;
    } else {
      console.error("Invalid message type:", message);
      return;
    }

    socketRef.current.send(JSON.stringify(payload));
  }, []);

  // --- End Chat (Admin side helper) ---
  const endChat = useCallback(
    (roomId) => {
      if (!roomId) return;
      sendMessage({ type: "end_chat", room: roomId, sender: "admin" });
    },
    [sendMessage]
  );

  // --- Disconnect manually ---
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close(1000, "Manual disconnect");
      socketRef.current = null;
    }

    if (username === "admin") {
      if (adminReconnectRef) clearTimeout(adminReconnectRef);
      adminSocket = null;
      adminConnected = false;
      adminTokenCache = null;
      adminReconnectAttempts = 0;
    } else {
      if (userReconnectRef) clearTimeout(userReconnectRef);
      userSocket = null;
      userConnected = false;
      userReconnectAttempts = 0;
    }

    setConnected(false);
  }, [username]);

  return { connected, error, sendMessage, endChat, disconnect };
}
