/**
 * AI Recipe UI Constants
 * 
 * 🎯 ЦЕЛЬ: Маппинг scenario → UI элементы
 * 🚫 ЗАПРЕЩЕНО: Логика, вычисления
 * ✅ РАЗРЕШЕНО: Только константы для рендера
 */

import type { RecipeScenario, RecipeConfidence } from '@/lib/types/ai-recipe';

/**
 * Текст кнопок по сценарию
 */
export const SCENARIO_CTA: Record<RecipeScenario, Record<string, string>> = {
  CAN_COOK_NOW: {
    pl: 'Gotować teraz',
    en: 'Cook now',
    ru: 'Готовить сейчас',
  },
  ALMOST_READY: {
    pl: 'Czego brakuje',
    en: "What's missing",
    ru: 'Чего не хватает',
  },
  NEED_MORE: {
    pl: 'Zobacz pomysły',
    en: 'See ideas',
    ru: 'Посмотреть идеи',
  },
};

/**
 * Цвета бейджей по сценарию
 */
export const SCENARIO_BADGE_COLORS: Record<RecipeScenario, string> = {
  CAN_COOK_NOW: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  ALMOST_READY: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  NEED_MORE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

/**
 * Иконки по confidence
 */
export const CONFIDENCE_ICONS: Record<RecipeConfidence, string> = {
  EXACT_MATCH: '🎯',
  HIGH: '✨',
  MEDIUM: '💡',
  LOW: '🤔',
};

/**
 * Цвета для confidence
 */
export const CONFIDENCE_COLORS: Record<RecipeConfidence, string> = {
  EXACT_MATCH: 'text-green-600 dark:text-green-400',
  HIGH: 'text-blue-600 dark:text-blue-400',
  MEDIUM: 'text-yellow-600 dark:text-yellow-400',
  LOW: 'text-gray-600 dark:text-gray-400',
};
