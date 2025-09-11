import ProductsGallery from ".//ProductsGallery";

export default async function ProductsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${baseUrl}/products/`, { cache: "no-store" });
  const products = await res.json();

  return <ProductsGallery products={products} />;
}
