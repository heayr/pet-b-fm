import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Публичные маршруты (доступны без авторизации)
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
    "/auth/error",
    "/api/auth",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // API маршруты (кроме auth) — не блокируем middleware, защита будет внутри
  const isApiRoute = nextUrl.pathname.startsWith("/api/");

  // Статические файлы
  const isStaticFile =
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname.startsWith("/images") ||
    nextUrl.pathname.startsWith("/favicon");

  if (isStaticFile) {
    return NextResponse.next();
  }

  // Если не авторизован и маршрут не публичный — редирект на логин
  if (!isLoggedIn && !isPublicRoute && !isApiRoute) {
    const loginUrl = new URL("/auth/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // Защита админ-маршрутов по ролям
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/auth/login", nextUrl.origin);
      return Response.redirect(loginUrl);
    }

    if (!["super_admin", "admin", "moderator"].includes(userRole ?? "")) {
      return Response.redirect(new URL("/dashboard", nextUrl.origin));
    }
  }

  // Защита дашборда
  if (nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};