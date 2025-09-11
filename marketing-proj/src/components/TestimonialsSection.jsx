"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "John Doe",
    company: "Acme Corp",
    text: "Their engineering expertise transformed our project. Highly professional and innovative!",
  },
  {
    name: "Jane Smith",
    company: "Tech Solutions",
    text: "Amazing team! Delivered exactly what we needed, on time and beyond expectations.",
  },
  {
    name: "Robert Brown",
    company: "Global Industries",
    text: "Innovative, precise, and reliable. I highly recommend them for any technical project.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative bg-gray-50 py-24 px-6">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-900">
        What Our Clients Say
      </h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        {testimonials.map((item, i) => (
          <motion.div
            key={i}
            className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
          >
            <p className="text-gray-700 italic mb-4">"{item.text}"</p>
            <h4 className="text-gray-900 font-semibold">{item.name}</h4>
            <p className="text-gray-500 text-sm">{item.company}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
