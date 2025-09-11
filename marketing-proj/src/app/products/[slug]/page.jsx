// src/app/products/[slug]/page.jsx
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetail({ params }) {
  const { slug } = await params;

  // Fetch single product
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/`,
    { cache: "no-store" }
  );
  if (!res.ok) return notFound();
  const product = await res.json();

  // Fetch all products for "More Products"
  const resAll = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/`,
    { cache: "no-store" }
  );
  const allProducts = resAll.ok ? await resAll.json() : [];

  return <ProductDetailClient product={product} allProducts={allProducts} />;
}
