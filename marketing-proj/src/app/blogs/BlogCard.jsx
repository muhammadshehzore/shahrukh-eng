// components/BlogCard.jsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BlogCard({ blog, index, baseUrl }) {
  const blogImage = blog.image?.startsWith("http") ? blog.image : `${baseUrl}${blog.image}`;

  return (
    <motion.div
      key={blog.slug}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
        <motion.img
          src={blogImage}
          alt={blog.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-blue-700 mb-2">{blog.title}</h2>
        <p className="text-gray-600 flex-grow line-clamp-4">{blog.excerpt}</p>
        <Link
          href={`/blogs/${blog.slug}`}
          className="mt-5 inline-block text-blue-600 font-medium hover:underline"
        >
          Read More →
        </Link>
      </div>
    </motion.div>
  );
}
