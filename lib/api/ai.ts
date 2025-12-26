/**
 * AI API Module
 * 
 * ⚠️ КЛЮЧЕВОЕ ПРАВИЛО:
 * AI в проекте = помощник и советник,
 * НЕ источник бизнес-логики и НЕ decision-maker.
 * 
 * У нас есть:
 * - rules-based decision engine
 * - budget module
 * - fridge module
 * - recipes module
 * 
 * AI НЕ ДОЛЖЕН дублировать их логику!
 * 
 * ✅ AI используется для:
 * - Креативной генерации контента (рецепты, тексты)
 * - Чата с пользователем (ментор, помощь)
 * - Контент-анализа (review, critique)
 * - Вторичных советов (recommendations)
 * 
 * ❌ AI НЕ используется для:
 * - Расчёта цен (есть budget module)
 * - Анализа холодильника (есть rules engine)
 * - Изменения состояния (фиджи, рецепты)
 * - Принятия решений за пользователя
 */

import { apiFetch } from './base';

export const aiApi = {
  /**
   * ✅ CORE: Chat with AI Chef Mentor
   * POST /ai/chef-mentor
   * 
   * Чистый AI-ассистент, не дублирует логику
   */
  mentorChat: async (userId: string, message: string, language = "pl", token?: string) => {
    return apiFetch("/ai/chef-mentor", {
      method: "POST",
      token,
      body: JSON.stringify({ userId, message, language }),
    });
  },

  /**
   * ✅ CORE: Generate recipe with AI
   * POST /ai/recipe-helper
   * 
   * Генерация = креативная задача, не конфликтует с rules-engine
   */
  generateRecipe: async (data: {
    title: string;
    language?: string;
    category?: string;
  }, token?: string) => {
    return apiFetch("/ai/recipe-helper", {
      method: "POST",
      token,
      body: JSON.stringify({
        title: data.title,
        language: data.language || "ua",
        category: data.category,
      }),
    });
  },

  /**
   * ✅ SECONDARY: Get AI recommendations (read-only)
   * GET /api/ai/recommendations
   * 
   * Read-only endpoint, не влияет на state
   * Используется как вторичные советы, не для автодействий
   */
  getRecommendations: async (limit: number = 10, token: string) => {
    return apiFetch(`/api/ai/recommendations?limit=${limit}`, { token });
  },

  /**
   * 🟡 CONTENT: Review recipe
   * POST /ai/review-recipe
   * 
   * Контент-анализ для UI/Editor
   * НЕ использовать в core user flow
   * НЕ вызывать автоматически
   */
  reviewRecipe: async (recipeId: string, language = "pl", token?: string) => {
    return apiFetch("/ai/review-recipe", {
      method: "POST",
      token,
      body: JSON.stringify({ recipeId, language }),
    });
  },

  /**
   * 🟡 CONTENT: Critique recipe
   * POST /ai/critique
   * 
   * Контент-анализ для UI/Editor
   * НЕ использовать в core user flow
   */
  critiqueRecipe: async (recipeId: string, language = "pl", token?: string) => {
    return apiFetch("/ai/critique", {
      method: "POST",
      token,
      body: JSON.stringify({ recipeId, language }),
    });
  },

  /**
   * 🟡 CONTENT: Analyze recipe
   * POST /ai/culinary/analyze
   * 
   * Контент-анализ для UI/Editor
   * Не влияет на расчёты
   */
  analyzeRecipe: async (data: {
    title: string;
    ingredients: string[];
    steps: string[];
    language?: string;
  }, token?: string) => {
    return apiFetch("/ai/culinary/analyze", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  },

  /**
   * 🟡 FALLBACK ONLY: Get ingredient nutrition info
   * GET /ai/ingredient-nutrition
   * 
   * ⚠️ Используется только как fallback, если нет данных из /nutrition/*
   * Предпочитаем nutrition module, а не AI
   */
  getIngredientNutrition: async (ingredientName: string, weight?: number, token?: string) => {
    const params = new URLSearchParams();
    params.append("name", ingredientName);
    if (weight) params.append("weight", weight.toString());
    return apiFetch(`/ai/ingredient-nutrition?${params}`, { token });
  },

  /**
   * 🟡 FALLBACK ONLY: Estimate price
   * POST /ai/estimate-price
   * 
   * ⚠️ AI НЕ ДОЛЖЕН считать деньги!
   * У нас есть: budget module, price history, real prices
   * 
   * Используется ТОЛЬКО как черновую оценку, если:
   * - Нет цены
   * - Нет истории
   * - Нет данных
   * 
   * ❌ НЕ использовать в UI для реальных расчётов
   */
  estimatePrice: async (data: {
    ingredients: string[];
    servings: number;
    difficulty: string;
  }, token?: string) => {
    return apiFetch("/ai/estimate-price", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  },
};

/**
 * AI Chat API
 * Общий чат с AI (не специализированный ментор)
 */
export const aiChatApi = {
  sendMessage: async (message: string, context?: any, token?: string) => {
    return apiFetch("/ai/chat", {
      method: "POST",
      token,
      body: JSON.stringify({ message, context }),
    });
  },
};

/**
 * ❌ СЛЕДУЮЩИЕ МЕТОДЫ НАМЕРЕННО НЕ ДОБАВЛЕНЫ:
 * 
 * 🚫 analyzeFridge() → Есть decision-engine + rules
 * 🚫 createRecipeFromFridge() → Дублирует recipes/match
 * 🚫 addMissingIngredients() → Опасно (AI пишет в state), есть /fridge/add-missing
 * 🚫 recalculateRecipeEconomy() → Деньги ≠ AI, есть budget module
 * 🚫 generateMealPlan() → Не MVP, запланировано на PRO-версию
 * 🚫 getFridgeRecommendations() → Дублирует recipes/match
 * 🚫 saveIngredientsToFridge() → AI не должен писать в state
 * 
 * Философия: AI = помощник, НЕ source of truth
 */
