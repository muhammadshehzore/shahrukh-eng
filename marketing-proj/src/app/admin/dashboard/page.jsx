"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import useAdminChat from "@/hooks/useAdminChat";
import { getToken, removeTokens, logout } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminChatSection from "@/components/admin/AdminChatSection";

export default function AdminDashboard() {
  const router = useRouter();

  // ✅ token is client-only
  const [token, setToken] = useState(null);
  useEffect(() => {
    const t = getToken("access");
    if (!t) {
      router.replace("/admin/login");
    } else {
      setToken(t);
    }
  }, [router]);

  const {
    connected = false,
    onlineUsers = [],
    chats = {},
    unread = {},
    sendAdminMessage,
    resetUnread,
    endChat,
  } = useAdminChat(token) || {}; // fallback to empty values

  const [activeChat, setActiveChat] = useState(null);

  // handle user click from sidebar
  const handleUserClick = (user) => {
    setActiveChat(user);
    if (resetUnread && user) resetUnread(user);
  };

  // Logout admin (tokens + API)
  const handleLogout = async () => {
    try {
      await logout(); // backend logout + remove tokens
    } catch (err) {
      console.error("Logout failed:", err);
      removeTokens(); // fallback
    }
    router.replace("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar
        connected={connected}
        onlineUsers={onlineUsers || []}
        activeChat={activeChat}
        unread={unread || {}}
        onUserClick={handleUserClick}
        onLogout={handleLogout}
      />

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="h-14 bg-white dark:bg-gray-800 border-b px-6 flex items-center justify-between shadow-sm">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {activeChat ? `Chat with ${activeChat}` : "Admin Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Welcome, Admin
            </span>
            <Settings className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-500" />
          </div>
        </div>

        {/* Connection status */}
        {!connected && (
          <div className="bg-red-500 text-white text-center py-2 text-sm">
            Disconnected from server. Trying to reconnect...
          </div>
        )}

        {/* Chat Section */}
        <AdminChatSection
          activeChat={activeChat}
          chats={chats || {}}
          sendAdminMessage={sendAdminMessage}
          endChat={endChat}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
}
