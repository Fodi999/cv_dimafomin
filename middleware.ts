/**
 * i18n Middleware
 * Гарантирует наличие языка в cookie при каждом запросе
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

export function middleware(req: NextRequest) {
  // Читаем язык из cookie
  const cookieLang = req.cookies.get(LANGUAGE_COOKIE_KEY)?.value;

  // Валидируем и фолбэчим на дефолтный
  const lang = cookieLang && isSupportedLanguage(cookieLang)
    ? cookieLang
    : DEFAULT_LANGUAGE;

  // Создаём response
  const res = NextResponse.next();

  // Устанавливаем/обновляем cookie
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
