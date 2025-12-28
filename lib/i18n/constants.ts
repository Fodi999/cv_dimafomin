/**
 * i18n Constants
 * Константы для системы интернационализации
 */

/**
 * Язык по умолчанию (польский)
 */
export const DEFAULT_LANGUAGE = "pl" as const;

/**
 * Поддерживаемые языки
 */
export const SUPPORTED_LANGUAGES = ["pl", "en", "ru"] as const;

/**
 * Тип языка (выведен из SUPPORTED_LANGUAGES)
 */
export type Language = typeof SUPPORTED_LANGUAGES[number];

/**
 * Cookie ключ для хранения языка
 */
export const LANGUAGE_COOKIE_KEY = "lang";

/**
 * LocalStorage ключ для хранения языка (fallback)
 */
export const LANGUAGE_STORAGE_KEY = "lang";

/**
 * Максимальный возраст cookie (1 год в секундах)
 */
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Проверка, является ли строка поддерживаемым языком
 */
export function isSupportedLanguage(lang: string): lang is Language {
  return SUPPORTED_LANGUAGES.includes(lang as Language);
}
