"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false); // hydration-safe
  const dropdownRef = useRef(null);

  // Set mounted to true after client render
  useEffect(() => setMounted(true), []);

  // Fetch services only on client
  useEffect(() => {
    if (!mounted) return;
    async function fetchServices() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/`);
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data);
        setFilteredServices(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchServices();
  }, [mounted]);

  // Filter services based on search
  useEffect(() => {
    setFilteredServices(
      searchTerm
        ? services.filter((s) =>
            (s.name || s.title).toLowerCase().includes(searchTerm.toLowerCase())
          )
        : services
    );
  }, [searchTerm, services]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Render a minimal nav on server to avoid hydration mismatch
  if (!mounted)
    return <nav className="fixed top-0 w-full z-50 h-16 bg-[#1B3B6F]" />;

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-r from-[#0D1B2A] via-[#1B3B6F] to-[#12274D] backdrop-blur-md shadow-xl">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent"
          >
            MSEW
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 text-white font-medium">
            <Link href="/" className="hover:text-yellow-400 transition">Home</Link>

            {/* Services Dropdown */}
            <div
              className="relative z-50"
              ref={dropdownRef}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-yellow-400 transition">
                Services <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="absolute left-0 mt-3 bg-[#1B3B6F] text-white rounded-2xl shadow-2xl w-[520px] p-6 grid grid-cols-2 gap-4 border border-white/20"
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
                        <motion.div whileHover={{ scale: 1.05 }} key={service.slug}>
                          <Link
                            href={`/services/${service.slug}`}
                            className="block p-3 rounded-xl bg-gradient-to-r from-[#1B3B6F] via-[#12274D] to-[#0D1B2A] hover:from-[#2E8BC0] hover:via-[#344CB7] hover:to-[#1A2A6C] transition shadow-lg"
                          >
                            <p className="font-semibold text-gray-100">
                              {service.name || service.title}
                            </p>
                            <p className="text-sm text-gray-300">
                              {service.tagline || "Learn more"}
                            </p>
                          </Link>
                        </motion.div>
                      ))
                    ) : (
                      <p className="col-span-2 text-center text-sm text-gray-400">
                        No services found
                      </p>
                    )}

                    <div className="col-span-2 mt-3 text-center">
                      <Link
                        href="/services"
                        className="text-sm font-semibold text-yellow-400 hover:underline"
                      >
                        View All Services →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/products" className="hover:text-yellow-400 transition">Products</Link>
            <Link href="/contact" className="hover:text-yellow-400 transition">Contact</Link>
                <Link href="/about" className="hover:text-yellow-400 transition">About</Link>

            {/* Animated Get Quote */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 8px rgba(255, 215, 0, 0.4)",
                  "0 0 18px rgba(255, 215, 0, 0.7)",
                  "0 0 8px rgba(255, 215, 0, 0.4)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Link
                href="/get-quote"
                className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-yellow-500/50 transition"
              >
                Get Quote
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0D1B2A] text-white flex flex-col p-6 space-y-6 z-50"
          >
            <button onClick={() => setMenuOpen(false)} className="self-end text-white">
              <X size={28} />
            </button>
            <Link href="/" className="text-lg hover:text-yellow-400">Home</Link>

            {/* Mobile Services */}
            <div>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex justify-between items-center w-full text-lg hover:text-yellow-400"
              >
                Services <ChevronDown className={`${servicesOpen ? "rotate-180" : ""} transition-transform`} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pl-4 mt-2 space-y-2"
                  >
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 mb-2">
                      <Search size={16} className="text-gray-300" />
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-300"
                      />
                    </div>

                    {filteredServices.map((service) => (
                      <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="block text-white hover:text-yellow-400 transition"
                      >
                        {service.name || service.title}
                      </Link>
                    ))}

                    <Link href="/services" className="block text-sm text-yellow-400 hover:underline mt-2">
                      View All Services →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/projects" className="text-lg hover:text-yellow-400">Products</Link>
            <Link href="/contact" className="text-lg hover:text-yellow-400">Contact</Link>
            <Link href="/about" className="text-lg hover:text-yellow-400">About</Link>

            {/* Mobile Get Quote */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                boxShadow: [
                  "0 0 8px rgba(255, 215, 0, 0.4)",
                  "0 0 18px rgba(255, 215, 0, 0.7)",
                  "0 0 8px rgba(255, 215, 0, 0.4)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-auto"
            >
              <Link
                href="/get-quote"
                className="block bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-yellow-500/50 transition text-center"
              >
                Get Quote
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
