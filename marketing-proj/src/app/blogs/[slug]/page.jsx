// src/app/blogs/[slug]/page.jsx
import BlogDetail from "./BlogDetail";

const baseUrl = process.env.NEXT_PUBLIC_API_URL.replace("/api", "");

// SEO metadata
export async function generateMetadata({ params }) {
  // Await params first
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}/`, { cache: "no-store" });
  if (!res.ok) return { title: "Blog Not Found", description: "Blog not found" };

  const blog = await res.json();

  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt,
    openGraph: {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.excerpt,
      images: blog.image ? [blog.image.startsWith("http") ? blog.image : `${baseUrl}${blog.image}`] : [],
    },
  };
}

// Blog Detail Page
export default async function BlogDetailPage({ params }) {
  // Await params first
  const { slug } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}/`, { cache: "no-store" });
  if (!res.ok) return <div className="text-center py-20">Blog not found.</div>;

  const blog = await res.json();
  if (blog.image && !blog.image.startsWith("http")) blog.image = `${baseUrl}${blog.image}`;

  return <BlogDetail blog={blog} />;
}
