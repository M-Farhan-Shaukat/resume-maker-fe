import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("authToken")?.value;
  const twoFA = request.cookies.get("twoFA")?.value === "true";
  const pathname = request.nextUrl.pathname;

  const publicRoutes = [
    "/signin",
    "/reset",
    "/forgot",
    "/register",
    "/superadmin/login",
    "/twofactorauthentication",
  ];
  const privateRoutes = [
    "/admin-portal",
    "/document",
    "/provider-data",
    "/home",
    "/users",
    "/default-document",
  ];

  // 🔹 Handle Root Path `/`
  if (pathname === "/") {
    return token
      ? NextResponse.redirect(new URL("/home", request.url)) // Authenticated users go to admin
      : NextResponse.redirect(new URL("/signin", request.url)); // Guests go to signin
  }

  // 🔹 Redirect unauthenticated users away from private routes
  if (!token && privateRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 🔹 Redirect authenticated users away from public routes
  if (token && publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}
