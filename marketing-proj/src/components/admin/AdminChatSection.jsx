"use client";
import { useState, useRef, useEffect } from "react";
import { Send, XCircle } from "lucide-react";

export default function AdminChatSection({
  activeChat,
  chats,
  sendAdminMessage,
  endChat,
  handleLogout,
}) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const currentMessages = activeChat ? chats[activeChat] || [] : [];

  // Scroll to bottom when new messages come
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSend = () => {
    if (input.trim() && activeChat) {
      sendAdminMessage(activeChat, input.trim());
      setInput("");
    }
  };

  const handleEndChat = () => {
    if (activeChat) {
      endChat(activeChat);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100 dark:bg-gray-800">
        {activeChat ? (
          currentMessages.length > 0 ? (
            currentMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "admin" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                    msg.sender === "admin"
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {msg.message || msg.content}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm">
              No messages yet with {activeChat}.
            </p>
          )
        ) : (
          <p className="text-center text-gray-500 text-sm">
            Select a user from the sidebar to start chatting.
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input + End Chat */}
      {activeChat && (
        <div className="border-t p-3 flex items-center gap-2 bg-white dark:bg-gray-900">
          {/* End Chat button */}
          <button
            onClick={handleEndChat}
            className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm"
          >
            <XCircle className="w-4 h-4" />
            End Chat
          </button>

          {/* Input field */}
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
