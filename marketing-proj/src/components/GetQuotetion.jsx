// app/components/GetQuotetion
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quotations/`, {
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
    "w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#344CB7] focus:outline-none";

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-[#344CB7]">Get a Quotation</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClass}
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className={inputClass}
        />

        {/* Contact */}
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
          className={inputClass}
        />

        {/* Unit */}
        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="mm">Millimeter (mm)</option>
          <option value="inch">Inches</option>
          <option value="ft">Feet (ft)</option>
        </select>

        {/* Dimensions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="number"
            name="length"
            placeholder="Length"
            value={formData.length}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            type="number"
            name="width"
            placeholder="Width"
            value={formData.width}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            type="number"
            name="height"
            placeholder="Height"
            value={formData.height}
            onChange={handleChange}
            required
            className={inputClass}
          />
          <input
            type="number"
            name="thickness"
            placeholder="Thickness"
            value={formData.thickness}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        {/* Services Dropdown */}
        <select
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="">Select Service</option>
          {services.map((srv) => (
            <option key={srv.slug} value={srv.name}>
              {srv.name}
            </option>
          ))}
        </select>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.p
              key={message.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`p-2 rounded-lg text-sm ${
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#344CB7] text-white py-2 rounded-lg hover:bg-[#2a3a91] transition-colors disabled:opacity-50"
        >
          {loading ? "Sending..." : "Submit Quotation"}
        </button>
      </form>
    </motion.div>
  );
}
