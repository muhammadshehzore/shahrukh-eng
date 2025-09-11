"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { X, Send } from "lucide-react";
import useUserChat from "@/hooks/useUserChat";

export default function Chat({ roomName, onClose }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const {
    connected,
    messages,
    sendMessage,
    loadHistory,
    hasHistory,
    disconnect,
    endChat,
    setMessages,
    username,
  } = useUserChat(roomName, "");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleClose = () => {
    onClose?.();
    disconnect();
    setMessages([]);
  };

  const handleEndChat = async () => {
    endChat();
    disconnect();
    setMessages([]);
  };

  return (
    <motion.div className="fixed bottom-6 right-6 w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border z-50">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex justify-between items-center text-white font-semibold text-lg">
        Chat with Admin
        <button onClick={handleClose}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-2">
        {hasHistory && (
          <button
            onClick={loadHistory}
            className="block mx-auto mb-2 px-4 py-2 text-sm text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200"
          >
            Load Previous Messages
          </button>
        )}

        {messages.map((msg) => {
          const isAdmin = msg.sender === "admin";
          return (
            <div
              key={msg.id}
              className={`max-w-[75%] p-3 rounded-2xl shadow mb-1 flex flex-col ${
                isAdmin
                  ? "self-start bg-gray-200 text-gray-800"
                  : "self-end bg-blue-100 text-blue-900"
              }`}
            >
              <div className="font-semibold text-xs mb-1">{isAdmin ? "Admin" : "You"}</div>
              <div>{msg.content}</div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex gap-2 bg-gray-100">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={connected ? "Type your message..." : "Connecting..."}
          className="flex-1 p-3 rounded-2xl border border-gray-300 bg-gray-100 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-600"
          disabled={!connected}
        />
        <button
          onClick={handleSend}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-2xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition"
          disabled={!connected}
        >
          <Send className="w-4 h-4" />
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={handleEndChat}
        >
          End Chat
        </button>
      </div>
    </motion.div>
  );
}
