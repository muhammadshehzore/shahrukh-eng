"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserList from "./UserList";
import useAdminChat from "@/hooks/useAdminChat";

export default function OnlineUsers({ token }) {
  const router = useRouter();
  const { onlineUsers, unread, resetUnread } = useAdminChat(token);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectUser = (username) => {
    setSelectedUser(username);
    resetUnread(username); // reset unread count when admin opens chat
    router.push(`/admin/chat/${username}`);
  };

  return (
    <div className="flex flex-col">
      <UserList users={onlineUsers} onSelect={handleSelectUser} unread={unread} />
      {selectedUser && (
        <div className="mt-2 p-2 border rounded shadow">
          <p className="text-sm text-gray-500">
            Chatting with <strong>{selectedUser}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
