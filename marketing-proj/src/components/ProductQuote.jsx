// src/components/ProductQuote.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ProductQuote({ productTitle }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    product: productTitle || "",
  });

  const [status, setStatus] = useState(null);

  // Update product field if prop changes dynamically
  useEffect(() => {
    setForm((prev) => ({ ...prev, product: productTitle || "" }));
  }, [productTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          product: form.product,  // ✅ Send product
          service: "",           // ✅ Keep service blank
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        product: productTitle || "",
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto bg-gradient-to-r from-[#1a2c7c] to-[#0f1a4d] p-8 rounded-3xl shadow-2xl relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
        Request a Quote
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-[#FFD700] transition"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-[#FFD700] transition"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Contact Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-[#FFD700] transition"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-[#FFD700] transition"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3 bg-gradient-to-r from-[#FFD700]/80 to-[#FFD700] hover:from-[#FFD700] hover:to-[#FFC700] text-black font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all"
        >
          {status === "loading" ? "Submitting..." : "Submit Quote"}
        </button>

        {status === "success" && (
          <p className="text-green-400 text-center mt-2">Quote submitted successfully!</p>
        )}
        {status === "error" && (
          <p className="text-red-400 text-center mt-2">Something went wrong. Try again.</p>
        )}
      </form>

      {/* Animated Glow */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-yellow-400/30 blur-[100px] animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-blue-500/30 blur-[100px] animate-pulse" />
    </motion.div>
  );
}
