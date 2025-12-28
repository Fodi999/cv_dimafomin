/**
 * i18n Type Definitions
 * Типы для системы интернационализации
 */

/**
 * Поддерживаемые языки
 */
export type Language = "pl" | "en" | "ru";

/**
 * Структура словаря
 * Определяет shape всех доменов и их ключей
 */
export interface Dictionary {
  common: Record<string, any>;
  navigation: Record<string, any>;
  auth: Record<string, any>;
  profile: Record<string, any>;
  recipes: Record<string, any>;
  academy: Record<string, any>;
  tokens: Record<string, any>;
  admin: Record<string, any>;
  errors: Record<string, any>;
  market: Record<string, any>;
}

/**
 * Языковые настройки
 */
export interface LanguageSettings {
  language: Language;
  fallback?: Language;
}

/**
 * Контекст языка для React
 */
export interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
  isLoading: boolean;
}
