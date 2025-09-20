"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

// ...existing imports
export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setServices(data);
        setFilteredServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    }
    fetchServices();
  }, []);

  // filter by search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredServices(services);
    } else {
      setFilteredServices(
        services.filter((s) =>
          (s.name || s.title)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, services]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#12274D] via-[#1B3B6F] to-[#2E4A7F] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center mb-6"
        >
          Our Services
        </motion.h1>

        {/* Company Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-gray-300 max-w-3xl mx-auto mb-10"
        >
          At M. Shahrukh Engineering Works, we design and manufacture high-temperature removable insulation jackets, covers, pads, and blankets for all types of industrial equipment. Our insulation solutions are reusable, fireproof, and custom-made to reduce heat loss, save energy, and ensure workplace safety.
          <br /><br />
          From generators and turbines to boilers, pipelines, pumps, valves, and plastic processing machines, our products are trusted in power plants, refineries, chemical factories, textile units, and manufacturing industries across Pakistan and abroad.
        </motion.p>

        {/* Search */}
        <div className="flex items-center bg-white/10 rounded-lg px-4 py-3 max-w-lg mx-auto mb-10">
          <Search size={20} className="text-gray-300" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none px-2 text-white placeholder-gray-400"
          />
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, i) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden group hover:shadow-yellow-400/40 transition"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image || "/placeholder-service.jpg"}
                    alt={service.name || service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    {service.name || service.title}
                  </h2>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                    {service.tagline ||
                      service.description ||
                      "Learn more about this service."}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-block text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition"
                  >
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300 mt-10">
            No services available.
          </p>
        )}
      </div>
    </section>
  );
}
