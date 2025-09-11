"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchServices } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Facebook, Twitter, Linkedin, Instagram, ChevronDown, Search } from "lucide-react";

export default function Footer() {
  const [services, setServices] = useState([]);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchServices().then((data) => {
      setServices(data);
      setFilteredServices(data);
    });
  }, []);

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

  return (
    <footer className="relative bg-gradient-to-t from-[#1A2A6C] via-[#344CB7] to-[#2E8BC0] text-white overflow-hidden pt-16">
      {/* Decorative circles */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full animate-pulse"></div>

      {/* Main Footer Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12"
      >
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="MSHAHRUKH"
              width={48}
              height={48}
              className="rounded-full shadow-lg"
            />
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-500">
              MSHAHRUKH
            </span>
          </div>
          <p className="text-gray-200 mb-5">
            Providing top-quality industrial services with excellence and dedication.
          </p>


          {/* Social Media Links */}
          <div className="flex items-center gap-4 mt-6">
            <Link href="https://www.facebook.com/m.shahrukhengineering" target="_blank" className="hover:text-yellow-400 transition transform hover:scale-110"><Facebook size={20} /></Link>
            {/* <Link href="https://twitter.com" target="_blank" className="hover:text-yellow-400 transition transform hover:scale-110"><Twitter size={20} /></Link> */}
            <Link href="https://www.linkedin.com/in/m-shahrukh-khan-550068a3" target="_blank" className="hover:text-yellow-400 transition transform hover:scale-110"><Linkedin size={20} /></Link>
            <Link href="https://www.instagram.com/industrialinsulationjacket.pk/" target="_blank" className="hover:text-yellow-400 transition transform hover:scale-110"><Instagram size={20} /></Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-5 border-b border-white/20 pb-2">Quick Links</h3>
          <div className="space-y-3 text-gray-200 hover:text-yellow-300 transition">
            <Link href="/" className="block">Home</Link>
            <Link href="/about" className="block">About</Link>
            <Link href="/contact" className="block">Contact</Link>
            <Link href="/blogs" className="block">Blog</Link>
            <Link href="/products" className="block">Products</Link>
          </div>
        </div>

        {/* Services Dropdown */}
        <div ref={dropdownRef}>
          <h3
            className="text-lg font-semibold mb-5 border-b border-white/20 pb-2 flex items-center justify-between cursor-pointer"
            onClick={() => setServicesOpen(!servicesOpen)}
          >
            Services <ChevronDown className={`${servicesOpen ? "rotate-180" : ""} transition-transform`} />
          </h3>
          <AnimatePresence>
            {servicesOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="bg-[#1B3B6F] text-white rounded-2xl shadow-2xl p-4 space-y-2 border border-white/20"
              >
                <div className="flex items-center gap-2 bg-[#12274D] rounded-lg px-3 py-2 mb-3">
                  <Search size={16} className="text-gray-300" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-400"
                  />
                </div>
                {filteredServices.length > 0 ? filteredServices.map(srv => (
                  <Link key={srv.slug} href={`/services/${srv.slug}`} className="block hover:text-yellow-400 transition">
                    {srv.name}
                  </Link>
                )) : <p className="text-sm text-gray-400">No services found</p>}
                <Link href="/services" className="block text-sm text-yellow-400 hover:underline mt-2">View All Services →</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-5 border-b border-white/20 pb-2">Contact Info</h3>
          <p className="text-gray-300 mb-3">For inquiries, quotes, or support, reach out to us anytime.</p>
          <ul className="space-y-2 text-gray-200">
            <li className="flex items-center gap-2"><MapPin size={18} /> Plot # 55-C 15th Commercial St, D.H.A. Phase 2 Commercial Area Defence Housing Authority, Karachi, 77550</li>
            <li className="flex items-center gap-2"><Phone size={18} /> +92 305 26463127</li>
          </ul>
        </div>
      </motion.div>

      {/* Animated SVG Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-[calc(100%+1.3px)] h-32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C600,100 600,0 1200,100 L1200,120 L0,120 Z" className="fill-gradient-to-t from-[#2E8BC0] via-[#344CB7] to-[#1A2A6C] opacity-80 animate-pulse" />
        </svg>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20 py-6 text-center text-gray-300 text-sm relative">
        <span>© {new Date().getFullYear()} MSHAHRUKH. All rights reserved.</span>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-full mt-[-0.5rem] opacity-60 animate-pulse"></div>
      </div>
    </footer>
  );
}
