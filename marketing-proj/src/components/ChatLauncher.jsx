// \src\components\ChatLauncher.jsx
"use client";
import { useState } from "react";
import useUserChat from "@/hooks/useUserChat";

export default function ChatLauncher() {
  const [started, setStarted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { connected, messages, sendMessage } = useUserChat(started ? name : null, started ? email : null);

  const [input, setInput] = useState("");

  const handleStart = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name is required!");
    setStarted(true);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-gray-100 rounded-2xl shadow-lg p-4">
      {!started ? (
        <form onSubmit={handleStart} className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold">Start Chat</h2>
          <input
            type="text"
            placeholder="Enter your name"
            className="p-2 rounded bg-gray-200 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter your email (optional)"
            className="p-2 rounded bg-gray-200 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-xs text-gray-600">
            If you enter your email, your chat history will be saved for future visits.
          </p>
          <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Start Chat
          </button>
        </form>
      ) : (
        <div className="flex flex-col h-96">
          <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.sender === "user" ? "bg-blue-200 self-end" : "bg-gray-300 self-start"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-[10px] text-gray-600">{msg.time}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex mt-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-l bg-gray-200 focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
