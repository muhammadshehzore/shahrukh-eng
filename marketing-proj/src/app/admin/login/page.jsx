// src/app/admin/login/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/auth";
import { setToken, getToken, removeTokens } from "@/lib/auth";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect if already logged in (access token valid)
    const check = async () => {
      const access = getToken("access");
      if (!access) return;
      try {
        const jwt_decode = (await import("jwt-decode")).default;
        const decoded = jwt_decode(access);
        if (decoded.exp * 1000 > Date.now()) router.replace("/admin/dashboard");
        else removeTokens();
      } catch {
        removeTokens();
      }
    };
    check();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_BASE}/admin-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");

      // Store tokens
      setToken("access", data.access, rememberMe);
      setToken("refresh", data.refresh, rememberMe);

      // 🔹 Store admin token separately for WebSocket
      localStorage.setItem("admin_token", data.access);

      router.replace("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      <div className="bg-white/10 backdrop-blur-2xl shadow-2xl rounded-2xl p-10 w-[420px] text-center border border-white/20">
        <h1 className="text-3xl font-extrabold mb-6 text-white drop-shadow-md">Admin Login</h1>

        {error && (
          <div className="mb-4 text-red-300 text-sm font-medium bg-red-900/40 p-2 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg"
          />
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-200">
            <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
            Remember Me
          </label>
          <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-3 rounded-xl">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
