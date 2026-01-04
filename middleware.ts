/**
 * Combined Middleware: i18n + Role-based Routing
 * 
 * 1. Гарантирует наличие языка в cookie
 * 2. Защищает маршруты на основе роли пользователя
 * 
 * 3 зоны доступа:
 * - `/` - Публичная (доступна всем)
 * - Пользовательские маршруты (только для USER): /fridge, /recipes, /assistant, /tokens, /academy, /market, /losses, /profile
 * - `/admin` - Админ-панель (только для ADMIN/SUPERADMIN)
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */

import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  LANGUAGE_COOKIE_KEY,
  LANGUAGE_COOKIE_MAX_AGE,
  isSupportedLanguage,
} from "@/lib/i18n/constants";

// 🔒 Protected USER routes (Route Group (user) renders as root paths)
const PROTECTED_USER_ROUTES = [
  "/fridge",
  "/recipes",
  "/assistant",
  "/tokens",
  "/academy",
  "/market",
  "/losses",
  "/profile",
];

// Helper: Check if path is a protected user route
function isProtectedUserRoute(pathname: string): boolean {
  return PROTECTED_USER_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ==================== 1. i18n Logic ====================
  const cookieLang = req.cookies.get(LANGUAGE_COOKIE_KEY)?.value;
  const lang = cookieLang && isSupportedLanguage(cookieLang)
    ? cookieLang
    : DEFAULT_LANGUAGE;

  // ==================== 2. Auth & Role Logic ====================
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  // Публичные маршруты (доступны всем)
  const publicPaths = [
    "/",
    "/academy",
    "/pricing",
    "/about",
    "/auth",
    "/api", // API routes всегда доступны
  ];

  const isPublicPath = publicPaths.some((path) => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // 🔓 Гость (не авторизован)
  if (!token) {
    // Гость пытается попасть в USER routes или /admin → редирект на главную
    if (isProtectedUserRoute(pathname) || pathname.startsWith("/admin")) {
      console.log(`🚫 [Middleware] Guest tried to access: ${pathname} → redirecting to /`);
      const url = req.nextUrl.clone();
      url.pathname = "/";
      const res = NextResponse.redirect(url);
      res.cookies.set(LANGUAGE_COOKIE_KEY, lang, {
        path: "/",
        maxAge: LANGUAGE_COOKIE_MAX_AGE,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    }

    // Гость на публичной странице → разрешаем
    const res = NextResponse.next();
    res.cookies.set(LANGUAGE_COOKIE_KEY, lang, {
      path: "/",
      maxAge: LANGUAGE_COOKIE_MAX_AGE,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  }

  // 🛡 Админ (role === "admin" или "super_admin")
  if (role === "admin" || role === "super_admin" || role === "superadmin") {
    // Админ пытается попасть в USER routes → редирект в /admin
    if (isProtectedUserRoute(pathname)) {
      console.log(`🛡 [Middleware] Admin tried to access user route: ${pathname} → redirecting to /admin`);
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      const res = NextResponse.redirect(url);
      res.cookies.set(LANGUAGE_COOKIE_KEY, lang, {
        path: "/",
        maxAge: LANGUAGE_COOKIE_MAX_AGE,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    }

    // Админ на / или /admin → разрешаем
    const res = NextResponse.next();
    res.cookies.set(LANGUAGE_COOKIE_KEY, lang, {
      path: "/",
      maxAge: LANGUAGE_COOKIE_MAX_AGE,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  }

  // 👤 Обычный пользователь (USER)
  if (token && role !== "admin" && role !== "super_admin" && role !== "superadmin") {
    // Пользователь пытается попасть в /admin → редирект в /academy
    if (pathname.startsWith("/admin")) {
      console.log(`👤 [Middleware] User tried to access /admin: ${pathname} → redirecting to /academy`);
      const url = req.nextUrl.clone();
      url.pathname = "/academy";
      const res = NextResponse.redirect(url);
      res.cookies.set(LANGUAGE_COOKIE_KEY, lang, {
        path: "/",
        maxAge: LANGUAGE_COOKIE_MAX_AGE,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res;
    }

    // Пользователь на / или /app → разрешаем
    const res = NextResponse.next();
    res.cookies.set(LANGUAGE_COOKIE_KEY, lang, {
      path: "/",
      maxAge: LANGUAGE_COOKIE_MAX_AGE,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  }

  // Fallback: просто применяем i18n
  const res = NextResponse.next();
  res.cookies.set(LANGUAGE_COOKIE_KEY, lang, {
    path: "/",
    maxAge: LANGUAGE_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

/**
 * Matcher для middleware
 * Применяется ко всем путям кроме API, static файлов, и _next
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, robots.txt, sitemap.xml (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
