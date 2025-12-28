/**
 * AI-Generated Translations Layer
 * 
 * Этот слой содержит переводы, сгенерированные AI.
 * ⚠️ Требуют ручной проверки и редактуры native speakers!
 * 
 * Status: DRAFT
 * Last updated: 2025-12-28
 */

export const aiTranslations = {
  /**
   * Маркеры для обозначения AI-контента
   */
  markers: {
    todo: '[TODO: REVIEW]',
    ai: '[AI-GENERATED]',
    needsReview: '[NEEDS NATIVE REVIEW]',
  },

  /**
   * Английские переводы (требуют проверки)
   */
  en: {
    // Academy domain - AI-generated from Polish
    academy: {
      hero: {
        // Пример: эти ключи были сгенерированы AI и требуют проверки
        // badge: "[AI] Platform for culinary learning",
      },
      about: {
        // aiMentorDesc: "[NEEDS REVIEW] AI-powered mentor for personalized learning",
      },
    },
    
    // Recipes domain
    recipes: {
      // filters: {
      //   difficulty: "[TODO] Review difficulty translations",
      // }
    },
  },

  /**
   * Русские переводы (требуют проверки)
   */
  ru: {
    // Academy domain - AI-generated from Polish
    academy: {
      hero: {
        // badge: "[AI] Платформа для кулинарного обучения",
      },
      about: {
        // aiMentorDesc: "[ТРЕБУЕТ ПРОВЕРКИ] AI-ментор для персонализированного обучения",
      },
    },
    
    // Recipes domain
    recipes: {
      // filters: {
      //   difficulty: "[TODO] Проверить переводы уровней сложности",
      // }
    },
  },

  /**
   * Метаданные о переводах
   */
  metadata: {
    generatedBy: 'ChatGPT-4',
    generatedDate: '2025-12-28',
    reviewStatus: 'pending',
    reviewers: [] as string[],
  },

  /**
   * Список ключей, требующих приоритетной проверки
   */
  priorityReview: [
    'academy.hero.badge',
    'academy.hero.headingLine1',
    'auth.login.title',
    'auth.register.title',
    'common.save',
    'common.cancel',
  ],

  /**
   * Глоссарий терминов для консистентности переводов
   */
  glossary: {
    en: {
      'ChefTokens': 'ChefTokens', // Не переводится
      'recipe': 'recipe',
      'sushi': 'sushi',
      'chef': 'chef',
      'mentor': 'mentor',
      'AI mentor': 'AI Mentor',
    },
    ru: {
      'ChefTokens': 'ChefTokens', // Не переводится
      'recipe': 'рецепт',
      'sushi': 'суши',
      'chef': 'шеф-повар',
      'mentor': 'ментор',
      'AI mentor': 'AI-ментор',
    },
  },

  /**
   * Правила переводов
   */
  rules: {
    en: [
      'Use American English spelling',
      'Keep technical terms in English (AI, tokens, etc.)',
      'Use title case for headings',
      'Be concise and direct',
    ],
    ru: [
      'Использовать формальный стиль общения ("Вы")',
      'Технические термины оставлять на английском (AI, tokens)',
      'Избегать калек и англицизмов где возможно',
      'Проверять грамматику и пунктуацию',
    ],
  },

  /**
   * Проверить, требует ли ключ проверки
   */
  needsReview(language: 'en' | 'ru', domain: string, key: string): boolean {
    const fullKey = `${domain}.${key}`;
    return (this.priorityReview as readonly string[]).includes(fullKey);
  },

  /**
   * Получить статус перевода
   */
  getStatus(language: 'en' | 'ru', domain: string, key: string): 'pending' | 'reviewed' | 'approved' {
    // Здесь можно добавить логику отслеживания статусов
    return 'pending';
  },
} as const;

/**
 * Helper для проверки AI-маркеров в строке
 */
export function hasAIMarker(text: string): boolean {
  const markers = Object.values(aiTranslations.markers);
  return markers.some(marker => text.includes(marker));
}

/**
 * Helper для удаления AI-маркеров из строки
 */
export function stripAIMarkers(text: string): string {
  let result = text;
  const markers = Object.values(aiTranslations.markers);
  markers.forEach(marker => {
    result = result.replace(marker, '').trim();
  });
  return result;
}

/**
 * Экспорт типов
 */
export type AITranslationStatus = 'pending' | 'reviewed' | 'approved';
export type SupportedLanguage = 'en' | 'ru';
