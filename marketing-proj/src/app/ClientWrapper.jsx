"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

// Dynamically load ChatWidget only on client & allowed routes
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });

export default function ClientLayoutWrapper({ children }) {
  const pathname = usePathname();
  const [showChat, setShowChat] = useState(false);

  // Hide nav/footer/chat on these routes
  const hideLayout =
    ["/login"].some((p) => pathname.startsWith(p)) || pathname.startsWith("/admin");

  // Only show ChatWidget on allowed routes
  useEffect(() => {
    setShowChat(!hideLayout);
  }, [pathname]);

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className={`${!hideLayout ? "pt-16" : ""}`}> {/* 👈 compensate for fixed navbar */}
        {children}
      </main>
      {!hideLayout && <Footer />}
      {showChat && <ChatWidget />}
    </>
  );
}
