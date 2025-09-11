"use client";

import { Settings } from "lucide-react";

export default function AdminSidebar({
  connected,
  onlineUsers = [],
  activeChat,
  unread = {},
  onUserClick,
  onLogout,
}) {
  return (
    <div className="w-64 flex flex-col bg-white dark:bg-gray-800 border-r shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200">Admin</h2>
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-500" />
      </div>

      {/* Connection Status */}
      {!connected && (
        <div className="bg-red-500 text-white text-center text-sm py-1">
          Disconnected
        </div>
      )}

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {onlineUsers.length === 0 ? (
          <p className="p-4 text-gray-500 dark:text-gray-400">No users online</p>
        ) : (
          onlineUsers.map((user) => (
            <div
              key={user}
              onClick={() => onUserClick(user)}
              className={`flex justify-between items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                activeChat === user ? "bg-gray-200 dark:bg-gray-700 font-semibold" : ""
              }`}
            >
              <span>{user}</span>
              {unread[user] > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unread[user]}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="p-3 m-4 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}
