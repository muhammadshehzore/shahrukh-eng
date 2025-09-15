"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import Particles from "react-tsparticles";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: "easeOut" },
  }),
};

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("http://127.0.0.1:8000/api/contact/messages/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        setFormData({ name: "", email: "", message: "" }); // clear form
      } else {
        setStatus("❌ Failed to send message");
      }
    } catch (err) {
      setStatus("⚠️ Error connecting to server");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1A2A6C] via-[#344CB7] to-[#2E8BC0] text-white overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative h-screen bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2019/05/10/12/36/contact-us-4193401_1280.jpg')",
        }}
      >
        {/* Particles */}
        <Particles
          id="tsparticles"
          options={{
            fullScreen: { enable: false },
            background: { color: { value: "transparent" } },
            particles: {
              number: { value: 50, density: { enable: true, area: 800 } },
              color: { value: "#FFD700" },
              shape: { type: "circle" },
              opacity: { value: 0.5 },
              size: { value: { min: 2, max: 6 } },
              move: {
                enable: true,
                speed: 0.8,
                direction: "none",
                outModes: "bounce",
              },
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
                onClick: { enable: true, mode: "push" },
              },
              modes: {
                repulse: { distance: 80, duration: 0.4 },
                push: { quantity: 4 },
              },
            },
            detectRetina: true,
          }}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: "easeOut" }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-white text-4xl md:text-6xl font-extrabold tracking-wide drop-shadow-xl"
          >
            Contact Us
          </motion.h1>
        </motion.div>
      </section>

      {/* Contact Info & Form */}
      <section className="max-w-7xl mx-auto py-20 px-4 grid md:grid-cols-2 gap-14">
        {/* Contact Details */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          className="space-y-8"
        >
          <motion.h2
            variants={fadeUp}
            custom={0}
            className="text-4xl font-bold text-[#FFD700] mb-6"
          >
            Get In Touch
          </motion.h2>

          {[
            { icon: Phone, title: "Phone", text: "+92 305 26463127" },
            {
              icon: Mail,
              title: "Email",
              text: "info@mshahrukhengineeringworks.com",
            },
            {
              icon: MapPin,
              title: "Address",
              text: "Plot # 55-C 15th Commercial St, D.H.A. Phase 2 Commercial Area Defence Housing Authority, Karachi, 77550",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i + 1}
              className="flex items-start space-x-4 group"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                className="p-3 bg-[#FFD700] text-[#1A2A6C] rounded-full shadow-lg"
              >
                <item.icon size={24} />
              </motion.div>
              <div>
                <h4 className="font-semibold text-lg">{item.title}</h4>
                <p className="text-gray-200">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl space-y-5 border border-white/20"
        >
          <motion.input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full p-4 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FFD700] shadow-sm transition-all duration-300 hover:shadow-md"
            required
          />

          <motion.input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full p-4 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FFD700] shadow-sm transition-all duration-300 hover:shadow-md"
            required
          />

          <motion.textarea
            rows="5"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full p-4 rounded-lg bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#FFD700] shadow-sm transition-all duration-300 hover:shadow-md"
            required
          ></motion.textarea>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative w-full bg-gradient-to-r from-[#FFD700] to-[#FFC300] text-[#1A2A6C] px-6 py-4 rounded-lg shadow-lg font-semibold overflow-hidden"
          >
            <span className="relative z-10">Send Message</span>
            <motion.span
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.2 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-white"
            />
          </motion.button>

          {status && <p className="mt-3 text-sm">{status}</p>}
        </motion.form>
      </section>

      {/* Google Map */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="h-[350px] overflow-hidden rounded-t-3xl shadow-inner"
      >
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.89647!2d67.0680403!3d24.8329177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33dfeb3844dff%3A0x3cc4b0344da0f597!2sM.Shahrukh%20Engineering%20Works!5e0!3m2!1sen!2s!4v1694190000000!5m2!1sen!2s"
          className="w-full h-full border-0"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </motion.section>
    </div>
  );
}
