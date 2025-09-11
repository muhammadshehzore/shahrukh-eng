"use client";
import { useState, useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import useAdminChat from "@/hooks/useAdminChat";

export default function AdminChatWindow({ username, handleLogout }) {
  const { chats, sendAdminMessage, connected } = useAdminChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const messages = chats[username] || [];

  // scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendAdminMessage(username, input);
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-800 p-3 border-b">
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          Chat with {username}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-500 hover:text-red-700"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100 dark:bg-gray-900">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-xs px-4 py-2 rounded-2xl shadow ${
              msg.sender === "admin"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-gray-800 self-start"
            }`}
          >
            <span>{msg.message}</span>
            <span className="text-xs mt-1 text-right text-gray-500">
              {msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex p-3 border-t gap-2 bg-gray-200 dark:bg-gray-800"
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
          disabled={!connected}
          className="px-4 py-2 bg-blue-500 text-white rounded-2xl"
        >
          Send
        </button>
      </form>
    </div>
  );
}
