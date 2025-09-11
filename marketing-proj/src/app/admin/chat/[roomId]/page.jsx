"use client";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminChat from "@/components/admin/AdminChat";

export default function AdminChatPage() {
  const { roomId } = useParams();

  return (
    <AdminLayout>
      <AdminChat roomName={roomId} />
    </AdminLayout>
  );
}
