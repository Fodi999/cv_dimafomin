/**
 * AI Recipe Types - Frontend Contract
 * 
 * 🎯 ЦЕЛЬ: Frontend НЕ думает, НЕ решает, ТОЛЬКО рендерит
 * 
 * Backend отправляет:
 * - recipe: все данные о рецепте
 * - ai: человеческое объяснение от AI
 * 
 * Frontend:
 * - получает DTO
 * - рендерит по scenario
 * - НЕ интерпретирует бизнес-логику
 */

/**
 * Сценарий рецепта (решает backend)
 */
export type RecipeScenario =
  | "CAN_COOK_NOW"      // Можно готовить сейчас (100% совпадение)
  | "ALMOST_READY"      // Почти готов (80-99% совпадение)
  | "NEED_MORE";        // Нужно больше ингредиентов (<80%)

/**
 * Уровень уверенности (решает backend/AI)
 */
export type RecipeConfidence =
  | "EXACT_MATCH"       // Точное совпадение
  | "HIGH"              // Высокая уверенность
  | "MEDIUM"            // Средняя уверенность
  | "LOW";              // Низкая уверенность

/**
 * Ингредиент (уже локализованный backend'ом)
 */
export interface IngredientDTO {
  id: string;
  name: string;           // ✅ УЖЕ локализовано backend'ом для текущего языка пользователя
  quantity: number;
  unit: string;
  available?: number;     // Доступно в холодильнике
}

/**
 * Рецепт (все данные решены backend'ом)
 */
export interface RecipeDTO {
  id: string;
  canonicalName: string;        // ✅ Каноническое имя (для URL)
  displayName: string;          // ✅ Локализованное название (для UI)
  canCookNow: boolean;          // ✅ Backend решил
  scenario: RecipeScenario;     // ✅ Backend определил
  confidence: RecipeConfidence; // ✅ AI оценил
  matchRatio: number;           // ⚠️ Только для debug, НЕ использовать в UI
  
  // Ингредиенты (УЖЕ локализованы backend'ом)
  ingredients: IngredientDTO[];
  missingIngredients: IngredientDTO[];
  
  // Дополнительная информация
  imageUrl?: string;
  description?: string;
  cookingTime?: number;
  servings?: number;     // ✅ Базовое количество порций
  steps?: string[];      // ✅ Шаги приготовления (локализованы backend'ом)
  difficulty?: string;
  country?: string;
}

/**
 * AI объяснение (на языке пользователя)
 */
export interface AIExplanationDTO {
  title: string;                // "Идеальное блюдо для сегодня!"
  reason: string;               // "У вас все ингредиенты..."
  ingredientsUsed: string[];    // ["свежие яйца", "растительное масло"]
  tip?: string;                 // Дополнительный совет от AI
}

/**
 * Полный ответ от API
 */
export interface AIRecipeResponse {
  recipe: RecipeDTO;
  ai: AIExplanationDTO;
  success: boolean;
}

/**
 * Ошибка от API
 */
export interface AIRecipeError {
  code: string;
  message: string;
  context?: Record<string, any>;
}
