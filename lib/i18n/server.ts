/**
 * Server-side language utilities
 * Используется в Server Components для получения языка из cookies
 */

import { cookies } from "next/headers";
import { LANGUAGE_COOKIE_KEY, DEFAULT_LANGUAGE, isSupportedLanguage } from "./constants";
import type { Language } from "./types";

/**
 * Получить текущий язык из cookies (server-side)
 * Используется в Server Components для SSR
 * 
 * @returns Текущий язык пользователя
 * 
 * @example
 * // app/page.tsx
 * import { getServerLanguage } from "@/lib/i18n/server";
 * 
 * export default async function HomePage() {
 *   const lang = await getServerLanguage();
 *   const dict = await getDictionary(lang);
 *   return <h1>{dict.home.hero.title}</h1>;
 * }
 */
export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const lang = cookieStore.get(LANGUAGE_COOKIE_KEY)?.value;
  
  if (lang && isSupportedLanguage(lang)) {
    return lang;
  }
  
  return DEFAULT_LANGUAGE;
}
