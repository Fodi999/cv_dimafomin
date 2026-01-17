/**
 * i18n Type Definitions
 * Типы для системы интернационализации
 */

import type { Language } from "./constants";

/**
 * Поддерживаемые языки
 * Re-export for convenience
 */
export type { Language } from "./constants";

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
  tokens: Record<string, any>;
  admin: Record<string, any>;
  errors: Record<string, any>;
  fridge: Record<string, any>;
  losses: Record<string, any>;
  ingredients: Record<string, any>;
  home: Record<string, any>;
  assistant: Record<string, any>;
  journey: Record<string, any>;
  journeyNextButtonTexts: Record<string, string>;
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
