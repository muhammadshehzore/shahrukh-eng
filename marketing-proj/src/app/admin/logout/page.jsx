// marketing-proj\src\app\admin\logout\page.jsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeTokens } from "@/lib/auth";
import { API_BASE } from "@/lib/auth";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      const refresh = getToken("refresh");
      if (refresh) {
        try {
          await fetch(`${API_BASE}/logout/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken("access")}` },
            body: JSON.stringify({ refresh }),
          });
        } catch {}
      }
      removeTokens();
      router.replace("/admin/login");
    };
    doLogout();
  }, [router]);

  return <div className="p-6">Logging out…</div>;
}
