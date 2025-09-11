"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchServices, createQuotation } from "@/lib/api";

export default function QuoteForm() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    size_unit: "inch",
    height: "",
    width: "",
    length: "",
    thickness: "",
    service: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(null);

  // Fetch services from API
  useEffect(() => {
    fetchServices().then(setServices).catch(() => setServices([]));
  }, []);

  // Handle input changes
  const onChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  // Submit form
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSent(null);

    try {
      if (!form.service) throw new Error("Please select a service");

      const payload = {
        ...form,
        height: form.height === "" ? null : Number(form.height),
        width: form.width === "" ? null : Number(form.width),
        length: form.length === "" ? null : Number(form.length),
        thickness: form.thickness === "" ? null : Number(form.thickness),
      };

      await createQuotation(payload);

      setSent({ ok: true, msg: "✅ Your quote request was sent successfully!" });

      setForm({
        name: "",
        email: "",
        phone: "",
        size_unit: "inch",
        height: "",
        width: "",
        length: "",
        thickness: "",
        service: "",
        message: "",
      });
    } catch (err) {
      setSent({ ok: false, msg: `❌ ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative max-w-5xl mx-auto mt-28 p-0 overflow-hidden rounded-2xl shadow-2xl z-10"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#344CB7] via-[#4A6CF7] to-[#0F172A]"></div>
      <div className="relative z-10 grid md:grid-cols-2">
        <div className="p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Request a Quote</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <input type="text" name="name" value={form.name} onChange={onChange} placeholder="Your Name" required className="w-full p-3 rounded-lg bg-white/10 placeholder-white/70 border border-white/20 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 outline-none transition"/>
            <input type="email" name="email" value={form.email} onChange={onChange} placeholder="Your Email" required className="w-full p-3 rounded-lg bg-white/10 placeholder-white/70 border border-white/20 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 outline-none transition"/>
            <input type="tel" name="phone" value={form.phone} onChange={onChange} placeholder="+92 300 1234567" required className="w-full p-3 rounded-lg bg-white/10 placeholder-white/70 border border-white/20 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 outline-none transition"/>

            <div className="grid grid-cols-2 gap-4">
              <select name="service" value={form.service} onChange={onChange} required className="p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 outline-none transition">
                <option value="" disabled>-- Select a Service --</option>
                {services.map((s, index) => (
                  <option key={s.id ?? s.slug ?? index} value={s.slug}>{s.name}</option>
                ))}
              </select>

              <select name="size_unit" value={form.size_unit} onChange={onChange} className="p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 outline-none transition">
                <option value="inch">Inch</option>
                <option value="ft">Feet</option>
                <option value="mm">Millimeter</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="height" value={form.height} onChange={onChange} placeholder="Height" required className="p-3 rounded-lg bg-white/10 placeholder-white/70 border border-white/20 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 outline-none transition"/>
              <input type="number" name="width" value={form.width} onChange={onChange} placeholder="Width" required className="p-3 rounded-lg bg-white/10 placeholder-white/70 border border-white/20 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 outline-none transition"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="length" value={form.length} onChange={onChange} placeholder="Length" required className="p-3 rounded-lg bg-white/10 placeholder-white/70 border border-white/20 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 outline-none transition"/>
              <input type="number" name="thickness" value={form.thickness} onChange={onChange} placeholder="Thickness" required className="p-3 rounded-lg bg-white/10 placeholder-white/70 border border-white/20 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 outline-none transition"/>
            </div>

            <textarea name="message" value={form.message} onChange={onChange} placeholder="Message" rows={4} required className="w-full p-3 rounded-lg bg-white/10 placeholder-white/70 border border-white/20 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300 outline-none transition"/>

            <motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.03 }} type="submit" disabled={loading} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-yellow-500/50 transition disabled:opacity-50">
              {loading ? "Sending..." : "🚀 Submit Request"}
            </motion.button>
          </form>

          <AnimatePresence>
            {sent && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className={`mt-4 p-3 rounded-lg ${sent.ok ? "bg-green-500" : "bg-red-500"}`}>
                {sent.msg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="hidden md:block relative">
          <img src="/form-picture.png" alt="Request a Quote" className="h-full w-full object-cover" />
        </motion.div>
      </div>
    </motion.div>
  );
}
