import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = req.nextUrl.pathname;

  // 🔐 If logged-in user opens login page
  if (path === "/login" && token) {
    if (token.role === "PRODUCT_OWNER") {
      return NextResponse.redirect(new URL("/organization", req.url));
    }

    if (token.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (token.role === "USER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // 🔒 Not logged in
  if (!token && path !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🛡 ADMIN protection
  if (
    path.startsWith("/admin") &&
    token?.role !== "ADMIN" &&
    token?.role !== "PRODUCT_OWNER"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 🏢 Organization protection
  if (
    path.startsWith("/organization") &&
    token?.role !== "PRODUCT_OWNER"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/admin/:path*",
    "/organization/:path*",
  ],
};