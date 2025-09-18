// src/components/Navbar.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenuPortal from "./MobileMenuPortal"; // Import the portal component

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showDesktopServices, setShowDesktopServices] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchServices() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/`);
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    }
    fetchServices();
  }, []);

  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDesktopServices(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredServices = searchTerm
    ? services.filter((s) =>
        (s.name || s.title).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : services;

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
  }, [menuOpen]);

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-[99999] h-16 bg-gradient-to-r from-[#0D1B2A] to-[#12274D]" />
    );
  }

  const mobileMenuVariants = {
    hidden: { y: "-100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "tween", ease: "easeOut", staggerChildren: 0.1 },
    },
  };
  const navLinkVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <nav className="fixed top-0 w-full z-[99999] bg-gradient-to-r from-[#0D1B2A] via-[#1B3B6F] to-[#12274D] backdrop-blur-md shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent"
          >
            MSEW
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-white font-medium">
            <Link href="/" className="hover:text-yellow-400 transition-colors duration-300">
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setShowDesktopServices(true)}
              onMouseLeave={() => setShowDesktopServices(false)}
            >
              <button className="flex items-center gap-1 hover:text-yellow-400 transition-colors duration-300">
                Services
                <ChevronDown
                  size={16}
                  className={`${showDesktopServices ? "rotate-180" : ""} transition-transform duration-300`}
                />
              </button>
              <AnimatePresence>
                {showDesktopServices && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 mt-3 bg-[#1B3B6F] text-white rounded-2xl shadow-2xl p-6 grid grid-cols-2 gap-4 border border-white/20 w-[calc(100vw-2rem)] md:w-[520px] max-w-lg z-[100000]"
                  >
                    {/* Search */}
                    <div className="col-span-2 flex items-center gap-2 bg-[#12274D] rounded-lg px-3 py-2 mb-3">
                      <Search size={16} className="text-gray-300" />
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-400"
                      />
                    </div>
                    {filteredServices.length > 0 ? (
                      filteredServices.map((service) => (
                        <Link
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          className="block p-3 rounded-xl bg-gradient-to-r from-[#1B3B6F] via-[#12274D] to-[#0D1B2A] hover:from-[#2E8BC0] hover:via-[#344CB7] hover:to-[#1A2A6C] transition shadow-lg"
                          onClick={() => setShowDesktopServices(false)}
                        >
                          <p className="font-semibold text-gray-100">
                            {service.name || service.title}
                          </p>
                          <p className="text-sm text-gray-300">
                            {service.tagline || "Learn more"}
                          </p>
                        </Link>
                      ))
                    ) : (
                      <p className="col-span-2 text-center text-sm text-gray-400">No services found</p>
                    )}
                    <div className="col-span-2 mt-3 text-center">
                      <Link
                        href="/services"
                        className="text-sm font-semibold text-yellow-400 hover:underline"
                        onClick={() => setShowDesktopServices(false)}
                      >
                        View All Services →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/products" className="hover:text-yellow-400 transition-colors duration-300">
              Products
            </Link>
            <Link href="/contact" className="hover:text-yellow-400 transition-colors duration-300">
              Contact
            </Link>
            <Link href="/about" className="hover:text-yellow-400 transition-colors duration-300">
              About
            </Link>

            <Link
              href="/get-quote"
              className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-yellow-500/50 transition-all duration-300"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors z-[100001]"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Portal */}
      <MobileMenuPortal>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100002]"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setMenuOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={mobileMenuVariants}
                className="absolute inset-0 flex flex-col items-center justify-center gap-8 text-center bg-gradient-to-b from-[#0D1B2A] to-[#1B3B6F] text-white p-8 overflow-y-auto"
              >
                <button
                  onClick={() => setMenuOpen(false)}
                  className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={28} />
                </button>
                {["Home", "Services", "Products", "Contact", "About"].map((link, i) => (
                  <motion.div key={link} variants={navLinkVariants} transition={{ delay: i * 0.1 }}>
                    <Link
                      href={`/${link.toLowerCase() === "home" ? "" : link.toLowerCase()}`}
                      className="text-3xl font-bold hover:text-yellow-400 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link}
                    </Link>
                  </motion.div>
                ))}
                <Link
                  href="/get-quote"
                  className="mt-8 inline-block bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black px-8 py-4 text-lg rounded-full font-bold shadow-lg hover:scale-105 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Quote
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </MobileMenuPortal>
    </nav>
  );
}