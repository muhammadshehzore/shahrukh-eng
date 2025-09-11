"use client";

import { useEffect, useState } from "react";

export default function TestServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/services/`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🔍 Test Services Endpoint</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>❌ Error: {error}</p>}

      <pre>{JSON.stringify(services, null, 2)}</pre>
    </div>
  );
}
