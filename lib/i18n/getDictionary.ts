/**
 * Dictionary Loader with Lazy Loading
 * Загрузчик словарей с ленивой загрузкой для оптимизации бандла
 */

import type { Dictionary, Language } from "./types";

/**
 * Асинхронно загружает словарь для указанного языка
 * Использует динамические импорты для lazy loading и tree-shaking
 * 
 * @param lang - Код языка (pl, en, ru)
 * @returns Promise с объектом словаря
 * 
 * @example
 * const dict = await getDictionary('en');
 * console.log(dict.common.save); // "Save"
 */
export async function getDictionary(lang: Language): Promise<Dictionary> {
  switch (lang) {
    case "pl":
      return (await import("./dictionaries/pl")).pl;
    case "en":
      return (await import("./dictionaries/en")).en;
    case "ru":
      return (await import("./dictionaries/ru")).ru;
    default:
      // Fallback на польский язык
      return (await import("./dictionaries/pl")).pl;
  }
}

/**
 * Синхронная версия (для SSR/SSG)
 * Импортирует все словари напрямую без динамической загрузки
 */
export function getDictionarySync(lang: Language): Dictionary {
  const pl = require("./dictionaries/pl").pl;
  const en = require("./dictionaries/en").en;
  const ru = require("./dictionaries/ru").ru;

  switch (lang) {
    case "pl":
      return pl;
    case "en":
      return en;
    case "ru":
      return ru;
    default:
      return pl;
  }
}
