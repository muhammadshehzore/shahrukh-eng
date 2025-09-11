import { notFound } from "next/navigation";
import ServiceDetailClient from "./ServiceDetailClient";

/* 🔹 API se ek service fetch */
async function getService(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services/${slug}/`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

/* 🔹 Saare slugs fetch kar ke static pages banao */
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/`, {
      cache: "no-store",
    });
    if (!res.ok) return [];

    const services = await res.json();

    return services.map((service) => ({
      slug: service.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

/* 🔹 Actual page */
export default async function ServiceDetailPage({ params }) {
  const { slug } = await params; // ✅ required in Next.js 14
  const service = await getService(slug);

  if (!service) return notFound();

  return <ServiceDetailClient service={service} />;
}
