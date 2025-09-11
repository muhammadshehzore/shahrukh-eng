"use client";
import { useState, useEffect, useRef } from "react";
import { Send, X } from "lucide-react";
import useAdminChat from "@/hooks/useAdminChat";

export default function AdminChat({ token }) {
  const [activeChat, setActiveChat] = useState(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const {
    onlineUsers,
    chats,
    unread,
    typingUsers,
    sendAdminMessage,
    sendTypingStatus,
    resetUnread,
    connected,
  } = useAdminChat(token);

  const currentMessages = activeChat ? chats[activeChat] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  useEffect(() => {
    if (activeChat) resetUnread(activeChat);
  }, [activeChat, resetUnread]);

  const handleSend = () => {
    if (!input.trim() || !activeChat) return;
    sendAdminMessage(activeChat, input.trim());
    setInput("");
    sendTypingStatus(activeChat, false);
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        >
          Chat
        </button>
      )}

      {open && (
        <div className="flex flex-col h-[500px] w-80 border rounded-2xl shadow-2xl bg-white overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-blue-600 text-white font-bold">
            <span>{activeChat ? `Chat with ${activeChat}` : "Admin Chat"}</span>
            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex">
            {/* Sidebar */}
            <div className="w-1/3 border-r p-2 overflow-y-auto">
              <h4 className="font-semibold mb-2">Online Users</h4>
              {onlineUsers.length === 0 && <p className="text-xs text-gray-500">No users online</p>}
              {onlineUsers.map((user) => (
                <button
                  key={user}
                  className={`w-full text-left p-1 rounded hover:bg-gray-200 ${
                    activeChat === user ? "bg-gray-300" : ""
                  }`}
                  onClick={() => setActiveChat(user)}
                >
                  {user}
                  {unread[user] ? <span className="ml-2 text-xs text-red-500">({unread[user]})</span> : null}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-2 overflow-y-auto space-y-2 bg-gray-100">
                {activeChat ? (
                  currentMessages.length > 0 ? (
                    currentMessages.map((msg) => {
                      const isAdmin = msg.sender === "admin";
                      return (
                        <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                          <div className={`px-3 py-2 rounded-2xl max-w-[75%] text-sm break-words ${
                            isAdmin ? "bg-blue-500 text-white animate-slide-in-right" : "bg-gray-200 text-gray-800 animate-slide-in-left"
                          }`}>
                            <div className="font-semibold text-xs mb-1">{msg.displayName}</div>
                            <div>{msg.message || msg.content || msg.text}</div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-gray-500 text-sm">No messages yet with {activeChat}.</p>
                  )
                ) : (
                  <p className="text-center text-gray-500 text-sm">Select a user to start chatting.</p>
                )}

                {activeChat && typingUsers[activeChat] && (
                  <div className="text-gray-500 text-sm italic mb-2">{activeChat} is typing...</div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {activeChat && (
                <div className="flex border-t p-2 gap-2 bg-white">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      sendTypingStatus(activeChat, e.target.value.length > 0);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={connected ? "Type a message..." : "Connecting..."}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    disabled={!connected}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!connected}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
