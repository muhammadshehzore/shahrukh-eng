"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Breadcrumb({ items }) {
  return (
    <motion.nav
      className="text-sm text-gray-500 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {items.map((item, i) => (
        <span key={i}>
          {item.href ? (
            <Link href={item.href} className="hover:text-blue-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800">{item.label}</span>
          )}
          {i < items.length - 1 && " / "}
        </span>
      ))}
    </motion.nav>
  );
}
