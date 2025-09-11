// src/app/components/admin/AdminLayout.jsx

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated, logout } from "@/utils/auth";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminAuthenticated()) router.push("/admin/login");
    else setLoading(false);
  }, [router]);

  if (loading) return <div className="p-6">Checking authentication...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button onClick={()=>{logout(); router.push("/admin/login")}} className="bg-red-500 px-3 py-1 rounded">Logout</button>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

