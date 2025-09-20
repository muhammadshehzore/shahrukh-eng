// app/components/GetQuotetion
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GetQuotetion({ onClose }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    unit: "inch",
    length: "",
    width: "",
    height: "",
    thickness: "",
    service: "",
  });
  const [message, setMessage] = useState(null);

  // Fetch services from Django API
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/`)
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send quotation request");

      setMessage({ type: "success", text: "Quotation request sent successfully!" });
      setFormData({
        name: "",
        email: "",
        contact: "",
        unit: "inch",
        length: "",
        width: "",
        height: "",
        thickness: "",
        service: "",
      });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FFD700] focus:outline-none bg-white/10 text-white placeholder-white/70 transition-all duration-300 hover:scale-105";

  return (
    <motion.div
      className="relative w-full bg-gradient-to-br from-[#0f1a4d] via-[#1a2c7c] to-[#0a0f24] p-6 rounded-3xl shadow-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background Glows */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-yellow-400/30 blur-[120px] animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-blue-500/30 blur-[120px] animate-pulse"></div>

      <h2 className="text-2xl font-bold mb-6 text-center text-white drop-shadow-lg">Get a Quotation</h2>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        {/* Name */}
        <motion.input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClass}
          whileFocus={{ scale: 1.02, boxShadow: "0 0 15px #FFD700" }}
        />

        {/* Email */}
        <motion.input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className={inputClass}
          whileFocus={{ scale: 1.02, boxShadow: "0 0 15px #FFD700" }}
        />

        {/* Contact */}
        <motion.input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
          className={inputClass}
          whileFocus={{ scale: 1.02, boxShadow: "0 0 15px #FFD700" }}
        />

        {/* Unit */}
        <motion.select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className={inputClass}
          whileFocus={{ scale: 1.02, boxShadow: "0 0 15px #FFD700" }}
        >
          <option value="mm">Millimeter (mm)</option>
          <option value="inch">Inches</option>
          <option value="ft">Feet (ft)</option>
        </motion.select>

        {/* Dimensions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["length", "width", "height", "thickness"].map((dim) => (
            <motion.input
              key={dim}
              type="number"
              name={dim}
              placeholder={dim.charAt(0).toUpperCase() + dim.slice(1)}
              value={formData[dim]}
              onChange={handleChange}
              required
              className={inputClass}
              whileFocus={{ scale: 1.02, boxShadow: "0 0 15px #FFD700" }}
            />
          ))}
        </div>

        {/* Services Dropdown */}
        <motion.select
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
          className={inputClass}
          whileFocus={{ scale: 1.02, boxShadow: "0 0 15px #FFD700" }}
        >
          <option value="">Select Service</option>
          {services.map((srv) => (
            <option key={srv.slug} value={srv.slug}>
              {srv.name}
            </option>
          ))}
        </motion.select>

        {/* Messages */}
        <AnimatePresence>
          {message && (
            <motion.p
              key={message.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`p-2 rounded-lg text-sm text-center font-semibold ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#FFD700]/80 to-[#FFD700] text-black py-2 rounded-xl shadow-lg hover:shadow-2xl transition-all disabled:opacity-50"
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px #FFD700" }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Sending..." : "Submit Quotation"}
        </motion.button>
      </form>
    </motion.div>
  );
}
