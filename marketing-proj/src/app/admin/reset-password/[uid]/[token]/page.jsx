"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { uid, token } = useParams(); // <- dynamic values

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://127.0.0.1:8000/accounts/reset-password/${uid}/${token}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, password2 }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Password reset successfully!");
      router.push("/admin/login");
    } else {
      alert(JSON.stringify(data));
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleReset} className="bg-white p-8 rounded-2xl shadow w-96">
        <h1 className="text-xl font-bold mb-4">Reset Password</h1>
        <input
          className="w-full p-2 mb-3 border rounded"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 border rounded"
          type="password"
          placeholder="Confirm Password"
          value={password2}
          onChange={(e)=>setPassword2(e.target.value)}
        />
        <button className="w-full bg-red-600 text-white p-2 rounded">Reset</button>
      </form>
    </div>
  );
}
