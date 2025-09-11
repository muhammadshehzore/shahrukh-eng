// marketing-proj\src\app\blogs\page.jsx
import BlogCard from "./BlogCard";

const baseUrl = process.env.NEXT_PUBLIC_API_URL.replace("/api", "");

export default async function BlogListPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/`, { cache: "no-store" });
  if (!res.ok) return <div className="text-center py-20">No blogs found.</div>;

  const blogs = await res.json();

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-bold text-blue-700 mb-16 text-center">
          Our Latest Blogs
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <BlogCard key={blog.slug} blog={blog} index={index} baseUrl={baseUrl} />
          ))}
        </div>
      </div>
    </div>
  );
}
