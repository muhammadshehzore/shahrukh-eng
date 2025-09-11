"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/accounts/forgot-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    alert(data.msg || data.error || "Check your email (console in dev mode)");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleForgot} className="bg-white p-8 rounded-2xl shadow w-96">
        <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
        <input className="w-full p-2 mb-3 border rounded" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <button className="w-full bg-purple-600 text-white p-2 rounded">Send Reset Link</button>
      </form>
    </div>
  );
}
