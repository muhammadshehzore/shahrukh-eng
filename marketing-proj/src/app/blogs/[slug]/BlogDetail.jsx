// marketing-proj/src/app/blogs/[slug]/BlogDetail.jsx
"use client";

import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";

export default function BlogDetail({ blog }) {
  return (
    <div className="bg-blue-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blogs" },
            { label: blog.title }
          ]}
          className="text-blue-700"
        />

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-10 tracking-tight"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {blog.title}
        </motion.h1>

        {/* Cover Image */}
        {blog.image && (
          <motion.img
            src={blog.image}
            alt={blog.title}
            className="w-full rounded-3xl shadow-2xl mb-12 object-cover border-4 border-blue-100"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}

        {/* Blog Content */}
        <motion.div
          className="prose prose-lg max-w-none text-gray-800 prose-headings:text-blue-900 prose-a:text-blue-700 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: blog.content }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />

        {/* Published Date */}
        <motion.div
          className="mt-16 pt-6 border-t border-blue-200 text-sm text-blue-800 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Published on{" "}
          {new Date(blog.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </motion.div>

      </div>
    </div>
  );
}
