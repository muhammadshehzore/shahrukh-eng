// src/components/UserChatWindow.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { X, MessageCircle } from "lucide-react";
import useChatWebSocket from "@/hooks/useChatWebSocket";

export default function UserChatWindow({ username }) {
  const { connected, sendMessage, subscribe } = useChatWebSocket(username);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(true);
  const messagesEndRef = useRef(null);

  // Subscribe to incoming messages
  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      if (data.type === "chat" || data.type === "history") {
        if (data.type === "history") setMessages(data.messages);
        else setMessages((prev) => [...prev, data]);
      }
    });
    return unsubscribe;
  }, [subscribe]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ message: input });
    setInput("");
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg text-white"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 flex flex-col h-[500px] bg-gray-100 dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="py-3 px-4 border-b bg-gray-200 dark:bg-gray-800 flex items-center justify-between text-gray-800 dark:text-gray-200">
        <span className="font-semibold">Chat with Admin</span>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow ${
              msg.sender === "admin"
                ? "bg-gray-300 text-gray-800 self-start"
                : "bg-blue-500 text-white self-end"
            }`}
          >
            <span>{msg.content || msg.message}</span>
            <span
              className={`text-xs mt-1 text-right ${
                msg.sender === "admin" ? "text-gray-500" : "text-white/80"
              }`}
            >
              {msg.timestamp || ""}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex p-4 bg-gray-200 dark:bg-gray-800 border-t gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={connected ? "Type a message..." : "Connecting..."}
          className="flex-1 px-4 py-2 rounded-2xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={!connected}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl shadow-md"
          disabled={!connected}
        >
          Send
        </button>
      </form>
    </div>
  );
}
