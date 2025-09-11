"use client";
import { useState } from "react";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access");
    const res = await fetch("http://127.0.0.1:8000/accounts/change-password/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
    const data = await res.json();
    if (res.ok) alert("Password changed!");
    else alert(JSON.stringify(data));
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form onSubmit={handleChange} className="bg-white p-8 rounded-2xl shadow w-96">
        <h1 className="text-xl font-bold mb-4">Change Password</h1>
        <input className="w-full p-2 mb-3 border rounded" type="password" placeholder="Old Password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} />
        <input className="w-full p-2 mb-3 border rounded" type="password" placeholder="New Password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
        <button className="w-full bg-orange-600 text-white p-2 rounded">Change</button>
      </form>
    </div>
  );
}
