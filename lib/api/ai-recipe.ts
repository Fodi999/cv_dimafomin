/**
 * AI Recipe API Client
 * 
 * 🎯 ПРАВИЛО: Один endpoint = один метод
 * 🚫 ЗАПРЕЩЕНО: Вычисления, интерпретации, бизнес-логика
 * ✅ РАЗРЕШЕНО: Fetch, parse, return DTO
 */

import type { AIRecipeResponse, AIRecipeError } from '@/lib/types/ai-recipe';

// ✅ Backend API base URL (Koyeb) - БЕЗ /api на конце!
// В .env.local: NEXT_PUBLIC_API_BASE=https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';

/**
 * Получить AI-рекомендацию рецепта
 * 
 * Backend делает:
 * - Читает язык пользователя из User.settings
 * - Локализует название рецепта
 * - Локализует названия ингредиентов
 * - Определяет scenario (CAN_COOK_NOW/ALMOST_READY/NEED_MORE)
 * - Генерирует AI объяснение на языке пользователя
 * 
 * Frontend делает:
 * - Получает DTO
 * - Рендерит UI
 * 
 * @param token - JWT токен пользователя
 * @returns AI recommendation с полностью готовыми данными
 * @throws Error если API недоступен
 */
export async function fetchAIRecipe(token: string): Promise<AIRecipeResponse> {
  // ✅ Get user language from localStorage
  const lang = typeof window !== 'undefined' 
    ? localStorage.getItem('lang') || 'ru' 
    : 'ru';
  
  console.log('🌍 [fetchAIRecipe] Using language:', lang);
  
  // ✅ Use /recipe-recommendations with lang parameter
  const res = await fetch(`${API_BASE}/recipe-recommendations?limit=1&lang=${lang}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // ✅ Всегда свежие данные от AI
  });

  if (!res.ok) {
    const error: AIRecipeError = await res.json().catch(() => ({
      code: 'UNKNOWN_ERROR',
      message: 'Failed to load AI recipe',
    }));
    
    throw new Error(error.message);
  }

  const json = await res.json();
  return transformRecipeResponse(json);
}

// Helper: Map backend match_status to RecipeScenario
function mapMatchStatusToScenario(status: string): 'CAN_COOK_NOW' | 'ALMOST_READY' | 'NEED_MORE' {
  switch (status) {
    case 'ready':
      return 'CAN_COOK_NOW';
    case 'almost_ready':
      return 'ALMOST_READY';
    case 'need_more':
      return 'NEED_MORE';
    default:
      return 'NEED_MORE';
  }
}

// Helper: Transform backend recipe to AIRecipeResponse format
function transformRecipeResponse(json: any): AIRecipeResponse {
  if (!json.recipes || json.recipes.length === 0) {
    throw new Error('No recipes found');
  }
  
  const recipe = json.recipes[0];
  return {
    recipe: {
      id: recipe.id,
      canonicalName: recipe.canonical_name,
      displayName: recipe.title,
      imageUrl: recipe.image_url,
      canCookNow: recipe.match_status === 'ready',
      scenario: mapMatchStatusToScenario(recipe.match_status),
      confidence: 'MEDIUM',
      matchRatio: recipe.match_percent / 100,
      servings: recipe.servings || 1,  // ✅ Backend servings (default 1)
      steps: recipe.steps || [],  // ✅ Backend cooking steps (localized)
      ingredients: (recipe.available_ingredients || []).map((ing: any) => ({
        id: ing.id,
        name: ing.display_name,
        quantity: ing.quantity,
        unit: ing.unit,
        available: ing.quantity,
      })),
      missingIngredients: (recipe.missing_ingredients || []).map((ing: any) => ({
        id: ing.id,
        name: ing.display_name,
        quantity: ing.quantity,
        unit: ing.unit,
      })),
      cookingTime: recipe.cook_time,
      difficulty: undefined,
      country: undefined,
    },
    ai: {
      title: json.summary || 'AI recommendation',  // ✅ Use backend summary (already localized)
      reason: json.summary || '',  // ✅ Use backend summary as reason too
      ingredientsUsed: (recipe.available_ingredients || []).map((ing: any) => ing.display_name),
    },
    success: true,
  };
}

/**
 * Получить следующую рекомендацию (skip текущую)
 * 
 * @param token - JWT токен
 * @param skipRecipeId - ID рецепта, который нужно пропустить
 */
export async function fetchNextAIRecipe(
  token: string,
  skipRecipeId: string
): Promise<AIRecipeResponse> {
  // ✅ Get user language from localStorage
  const lang = typeof window !== 'undefined' 
    ? localStorage.getItem('lang') || 'ru' 
    : 'ru';
  
  // ✅ Use /recipe-recommendations with skip and lang parameters
  const res = await fetch(`${API_BASE}/recipe-recommendations?limit=1&skip=${skipRecipeId}&lang=${lang}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to load next AI recipe');
  }

  const json = await res.json();
  return transformRecipeResponse(json);
}
