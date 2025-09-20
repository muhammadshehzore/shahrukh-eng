"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductQuote({ productTitle, serviceName }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    product: productTitle || null,
    service: serviceName || null,
  });
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrors({});

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Quote API response:", data);

      if (res.ok && data.success) {
        setStatus("success");
        setForm({
          name: "",
          email: "",
          phone: "",
          message: "",
          product: productTitle || null,
          service: serviceName || null,
        });
      } else {
        setStatus("error");
        setErrors(data.errors || { general: ["Something went wrong"] });
      }
    } catch (err) {
      setStatus("error");
      setErrors({ general: ["Network error, try again"] });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 rounded-2xl shadow-xl p-8 md:p-10"
    >
      <h3 className="text-2xl font-bold text-[#FFD700] mb-6">Request a Quote</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg px-4 py-3 bg-black/50 border border-gray-700 text-white placeholder-gray-400 focus:border-[#FFD700] focus:ring focus:ring-[#FFD700]/30 outline-none transition"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg px-4 py-3 bg-black/50 border border-gray-700 text-white placeholder-gray-400 focus:border-[#FFD700] focus:ring focus:ring-[#FFD700]/30 outline-none transition"
        />
        <input
          type="text"
          name="phone"
          placeholder="Your Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full rounded-lg px-4 py-3 bg-black/50 border border-gray-700 text-white placeholder-gray-400 focus:border-[#FFD700] focus:ring focus:ring-[#FFD700]/30 outline-none transition"
        />
        <textarea
          name="message"
          rows="4"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          className="w-full rounded-lg px-4 py-3 bg-black/50 border border-gray-700 text-white placeholder-gray-400 focus:border-[#FFD700] focus:ring focus:ring-[#FFD700]/30 outline-none transition"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Send Request"}
        </button>
      </form>

      {status === "success" && (
        <p className="text-green-400 mt-4">✅ Request sent successfully!</p>
      )}
      {status === "error" &&
        Object.keys(errors).map((key) => (
          <p key={key} className="text-red-400 mt-2">
            ❌ {Array.isArray(errors[key])
              ? errors[key].join(", ")
              : errors[key]}
          </p>
        ))}
    </motion.div>
  );
}
