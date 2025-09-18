// src/components/ChatWidget.jsx
"use client";
import { useState, useRef, useEffect } from "react";
import useUserChat from "@/hooks/useUserChat";
import { X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [started, setStarted] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { connected, messages = [], sendMessage, onlineUsers = [], wsError } = useUserChat(
    started ? name : null,
    started ? email : null
  );

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (!value.trim()) {
      setError("Name is required.");
    } else if (/\s/.test(value)) {
      setError("Name cannot contain spaces.");
    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      setError("Name can only contain letters and numbers.");
    } else {
      setError("");
    }
  };

  const startChat = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || /\s/.test(name) || !/^[a-zA-Z0-9]+$/.test(name)) {
      setError("Please enter a valid name with no spaces or special characters.");
      return;
    }
    setError("");
    setStarted(true);
    setCollapsed(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    // Corrected responsive positioning and z-index
    <div className="fixed bottom-5 right-5 z-[99]">
      <AnimatePresence>
        {collapsed ? (
          <motion.button
            key="chat-button"
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
            onClick={toggleCollapse}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MessageCircle className="w-7 h-7" />
          </motion.button>
        ) : (
          <motion.div
            key="chat-widget"
            className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900/90 backdrop-blur-sm"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-slate-800 text-slate-100 flex items-center justify-between">
              <div className="font-semibold">Support Chat</div>
              <div className="flex items-center gap-2">
                <div className={`text-xs ${connected ? "text-green-400" : "text-slate-400"}`}>
                  {started ? (connected ? "online" : "connecting…") : ""}
                </div>
                <button onClick={toggleCollapse} aria-label="Close chat">
                  <X className="w-5 h-5 text-white hover:text-red-400 transition" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4">
              {!started ? (
                <form onSubmit={startChat} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your name *"
                    className="w-full rounded-lg bg-slate-800 text-slate-100 px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your email (optional)"
                    className="w-full rounded-lg bg-slate-800 text-slate-100 px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error && <div className="text-red-400 text-sm">{error}</div>}
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 transition disabled:bg-blue-800 disabled:opacity-50"
                    disabled={!!error}
                  >
                    Start chat
                  </button>
                </form>
              ) : (
                <>
                  {(onlineUsers || []).length > 0 && (
                    <div className="mb-2 text-xs text-slate-300">
                      Online: {(onlineUsers || []).join(", ")}
                    </div>
                  )}
                  {wsError && (
                    <div className="mb-2 p-2 text-xs bg-red-600 text-white rounded">{wsError}</div>
                  )}
                  <div className="h-80 overflow-y-auto space-y-2 pr-1 custom-scroll">
                    {(messages || []).map((m, i) => (
                      <div key={m.id || i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                            m.sender === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-slate-700 text-slate-100 rounded-bl-sm"
                          }`}
                        >
                          <div>{m.content}</div>
                          <div className="text-[10px] mt-1 opacity-80 text-right">
                            {m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSend} className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message…"
                      className="flex-1 rounded-lg bg-slate-800 text-slate-100 px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 transition"
                    >
                      Send
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #0f172a;
        }
      `}</style>
    </div>
  );
}