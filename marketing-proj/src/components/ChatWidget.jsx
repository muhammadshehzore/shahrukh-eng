// // // src/components/ChatWidget.jsx
// // "use client";
// // import { useState, useRef, useEffect } from "react";
// // import useUserChat from "@/hooks/useUserChat";

// // /**
// //  * A floating chat widget:
// //  * - First shows a form (name required, email optional)
// //  * - If email is entered, history is saved & loaded on revisit
// //  * - Non-white UI + info note inside chat box
// //  */
// // export default function ChatWidget() {
// //   const [started, setStarted] = useState(false);
// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");

// //   // Only connect when started
// //   const { connected, messages, sendMessage } = useUserChat(started ? name : null, started ? email : null);

// //   const [input, setInput] = useState("");
// //   const messagesEndRef = useRef(null);

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   const startChat = (e) => {
// //     e.preventDefault();
// //     if (!name.trim()) return;
// //     setStarted(true);
// //   };

// //   const handleSend = (e) => {
// //     e.preventDefault();
// //     if (!input.trim()) return;
// //     sendMessage(input);
// //     setInput("");
// //   };

// //   return (
// //     <div className="fixed bottom-5 right-5 w-96 max-w-[95vw]">
// //       <div className="rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900/90 backdrop-blur-sm">
// //         {/* Header */}
// //         <div className="px-4 py-3 bg-slate-800 text-slate-100 flex items-center justify-between">
// //           <div className="font-semibold">Support Chat</div>
// //           <div className={`text-xs ${connected ? "text-green-400" : "text-slate-400"}`}>
// //             {started ? (connected ? "online" : "connecting…") : ""}
// //           </div>
// //         </div>

// //         {/* Body */}
// //         <div className="p-4">
// //           {!started ? (
// //             <form onSubmit={startChat} className="space-y-3">
// //               <div className="text-slate-200 text-sm">
// //                 Start a conversation with our team.
// //               </div>
// //               <input
// //                 type="text"
// //                 placeholder="Your name *"
// //                 className="w-full rounded-lg bg-slate-800 text-slate-100 placeholder-slate-400 px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 value={name}
// //                 onChange={(e) => setName(e.target.value)}
// //                 required
// //               />
// //               <input
// //                 type="email"
// //                 placeholder="Your email (optional)"
// //                 className="w-full rounded-lg bg-slate-800 text-slate-100 placeholder-slate-400 px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //               />
// //               <p className="text-[11px] leading-4 text-slate-300/80 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
// //                 If you enter your email, your chat history will be saved for future visits.
// //               </p>
// //               <button
// //                 type="submit"
// //                 className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 transition"
// //               >
// //                 Start chat
// //               </button>
// //             </form>
// //           ) : (
// //             <>
// //               <div className="h-80 overflow-y-auto space-y-2 pr-1 custom-scroll">
// //                 {messages.map((m, i) => {
// //                   const mine = m.sender === "user";
// //                   return (
// //                     <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
// //                       <div
// //                         className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
// //                           mine
// //                             ? "bg-blue-600 text-white rounded-br-sm"
// //                             : "bg-slate-700 text-slate-100 rounded-bl-sm"
// //                         }`}
// //                       >
// //                         <div>{m.text}</div>
// //                         <div className="text-[10px] mt-1 opacity-80 text-right">{m.time}</div>
// //                       </div>
// //                     </div>
// //                   );
// //                 })}
// //                 <div ref={messagesEndRef} />
// //               </div>

// //               <form onSubmit={handleSend} className="mt-3 flex gap-2">
// //                 <input
// //                   type="text"
// //                   placeholder="Type a message…"
// //                   className="flex-1 rounded-lg bg-slate-800 text-slate-100 placeholder-slate-400 px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   value={input}
// //                   onChange={(e) => setInput(e.target.value)}
// //                 />
// //                 <button
// //                   type="submit"
// //                   className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 transition"
// //                 >
// //                   Send
// //                 </button>
// //               </form>
// //             </>
// //           )}
// //         </div>
// //       </div>

// //       <style jsx global>{`
// //         .custom-scroll::-webkit-scrollbar {
// //           width: 8px;
// //         }
// //         .custom-scroll::-webkit-scrollbar-thumb {
// //           background: #475569;
// //           border-radius: 8px;
// //         }
// //         .custom-scroll::-webkit-scrollbar-track {
// //           background: #0f172a;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }
// "use client";
// import { useState, useRef, useEffect } from "react";
// import useUserChat from "@/hooks/useUserChat";
// import { X, MessageCircle } from "lucide-react";

// export default function ChatWidget() {
//   const [started, setStarted] = useState(false);
//   const [collapsed, setCollapsed] = useState(true);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");

//   const { connected, messages, sendMessage, onlineUsers, wsError } = useUserChat(
//     started ? name : null,
//     started ? email : null
//   );

//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const startChat = (e) => {
//     e.preventDefault();
//     if (!name.trim()) {
//       setError("Name is required.");
//       return;
//     }
//     if (name.includes(" ")) {
//       setError("Name cannot contain spaces. Enter without spaces.");
//       return;
//     }
//     setError("");
//     setStarted(true);
//     setCollapsed(false);
//   };

//   const handleSend = (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;
//     sendMessage(input);
//     setInput("");
//   };

//   const toggleCollapse = () => setCollapsed(!collapsed);

//   if (collapsed) {
//     return (
//       <button
//         className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
//         onClick={toggleCollapse}
//       >
//         <MessageCircle className="w-5 h-5" />
//       </button>
//     );
//   }

//   return (
//     <div className="fixed bottom-5 right-5 w-96 max-w-[95vw] z-50">
//       <div className="rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900/90 backdrop-blur-sm">
//         {/* Header */}
//         <div className="px-4 py-3 bg-slate-800 text-slate-100 flex items-center justify-between">
//           <div className="font-semibold">Support Chat</div>
//           <div className="flex items-center gap-2">
//             <div className={`text-xs ${connected ? "text-green-400" : "text-slate-400"}`}>
//               {started ? (connected ? "online" : "connecting…") : ""}
//             </div>
//             <button onClick={toggleCollapse}>
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="p-4">
//           {!started ? (
//             <form onSubmit={startChat} className="space-y-3">
//               <input
//                 type="text"
//                 placeholder="Your name *"
//                 className="w-full rounded-lg bg-slate-800 text-slate-100 px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder="Your email (optional)"
//                 className="w-full rounded-lg bg-slate-800 text-slate-100 px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               {error && (
//                 <div className="text-red-400 text-sm">{error}</div>
//               )}
//               <button
//                 type="submit"
//                 className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 transition"
//               >
//                 Start chat
//               </button>
//             </form>
//           ) : (
//             <>
//               {/* Online users */}
//               {onlineUsers.length > 0 && (
//                 <div className="mb-2 text-xs text-slate-300">
//                   Online: {onlineUsers.join(", ")}
//                 </div>
//               )}

//               {/* Error banner */}
//               {wsError && (
//                 <div className="mb-2 p-2 text-xs bg-red-600 text-white rounded">
//                   {wsError}
//                 </div>
//               )}

//               {/* Messages */}
//               <div className="h-80 overflow-y-auto space-y-2 pr-1 custom-scroll">
//                 {messages.map((m, i) => (
//                   <div
//                     key={i}
//                     className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
//                   >
//                     <div
//                       className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
//                         m.sender === "user"
//                           ? "bg-blue-600 text-white rounded-br-sm"
//                           : "bg-slate-700 text-slate-100 rounded-bl-sm"
//                       }`}
//                     >
//                       <div>{m.text}</div>
//                       <div className="text-[10px] mt-1 opacity-80 text-right">
//                         {m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : ""}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Input */}
//               <form onSubmit={handleSend} className="mt-3 flex gap-2">
//                 <input
//                   type="text"
//                   placeholder="Type a message…"
//                   className="flex-1 rounded-lg bg-slate-800 text-slate-100 px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 transition"
//                 >
//                   Send
//                 </button>
//               </form>
//             </>
//           )}
//         </div>
//       </div>

//       <style jsx global>{`
//         .custom-scroll::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scroll::-webkit-scrollbar-thumb {
//           background: #475569;
//           border-radius: 8px;
//         }
//         .custom-scroll::-webkit-scrollbar-track {
//           background: #0f172a;
//         }
//       `}</style>
//     </div>
//   );
// }
"use client";
import { useState, useRef, useEffect } from "react";
import useUserChat from "@/hooks/useUserChat";
import { X, MessageCircle } from "lucide-react";

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

  // -----------------------------
  // Live validation for name input
  // -----------------------------
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);

    // Check for empty after trimming
    if (!value.trim()) {
      setError("Name is required.");
    } 
    // Check spaces anywhere, including leading/trailing
    else if (/\s/.test(value)) {
      setError("Name cannot contain spaces.");
    } 
    // Only allow letters & numbers
    else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      setError("Name can only contain letters and numbers.");
    } 
    else {
      setError("");
    }
  };

  // -----------------------------
  // Start chat
  // -----------------------------
  const startChat = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    if (/\s/.test(name)) { // check raw name for spaces
      setError("Name cannot contain spaces.");
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      setError("Name can only contain letters and numbers.");
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

  if (collapsed) {
    return (
      <button
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
        onClick={toggleCollapse}
      >
        <MessageCircle className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-96 max-w-[95vw] z-50">
      <div className="rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900/90 backdrop-blur-sm">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-800 text-slate-100 flex items-center justify-between">
          <div className="font-semibold">Support Chat</div>
          <div className="flex items-center gap-2">
            <div className={`text-xs ${connected ? "text-green-400" : "text-slate-400"}`}>
              {started ? (connected ? "online" : "connecting…") : ""}
            </div>
            <button onClick={toggleCollapse}>
              <X className="w-5 h-5" />
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
                onChange={handleNameChange} // live validation
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
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 transition"
                disabled={!!error} // disables button if name invalid
              >
                Start chat
              </button>
            </form>
          ) : (
            <>
              {/* Online users */}
              {(onlineUsers || []).length > 0 && (
                <div className="mb-2 text-xs text-slate-300">
                  Online: {(onlineUsers || []).join(", ")}
                </div>
              )}

              {/* Error banner */}
              {wsError && (
                <div className="mb-2 p-2 text-xs bg-red-600 text-white rounded">{wsError}</div>
              )}

              {/* Messages */}
              <div className="h-80 overflow-y-auto space-y-2 pr-1 custom-scroll">
                {(messages || []).map((m, i) => (
                  <div
                    key={m.id || i}
                    className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                        m.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-slate-700 text-slate-100 rounded-bl-sm"
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

              {/* Input */}
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
      </div>

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
