// src/lib/api.js
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { getToken } from "./auth";

// Fetch all services
export async function fetchServices() {
  try {
    const res = await fetch(`${API_URL}/services/`, { cache: "no-store" });
    if (!res.ok) {
      console.error("Failed to fetch services:", res.status);
      return [];
    }
    const data = await res.json();

    // Ensure each service has a unique id
    return data.map((s, index) => ({
      id: s.id ?? index,
      slug: s.slug,
      name: s.name,
      ...s, // include any extra fields
    }));
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

// Fetch single service detail
export async function fetchServiceDetail(slug) {
  const res = await fetch(`${API_URL}/services/${slug}/`);
  if (!res.ok) throw new Error("Failed to fetch service detail");
  return res.json();
}

// Fetch projects
export async function fetchProjects() {
  const res = await fetch(`${API_URL}/projects/`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

// Fetch hero slides
export async function fetchHeroSlides() {
  const res = await fetch(`${API_URL}/hero-slides/`);
  if (!res.ok) throw new Error("Failed to fetch hero slides");
  return res.json();
}

// Create quotation
export async function createQuotation(data) {
  const res = await fetch(`${API_URL}/quotes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create quotation");
  return res.json();
}

// Create an Axios instance
export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // your Django API base
});

// Add JWT token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});




export async function apiFetch(path, options = {}) {
  const access = getToken("access");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (access) headers["Authorization"] = `Bearer ${access}`;

  const res = await fetch(path.startsWith("http") ? path : `${path}`, {
    ...options,
    headers,
  });

  // If 401, let caller handle refresh logic
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}