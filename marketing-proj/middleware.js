// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("access")?.value || null;
  const { pathname } = req.nextUrl;

  // Protect only /admin/* routes (but allow /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware only to /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};
