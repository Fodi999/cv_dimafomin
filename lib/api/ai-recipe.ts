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
  const res = await fetch(`${API_BASE}/ai-recipe/recommendation`, {
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
  return json.data as AIRecipeResponse;
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
  const res = await fetch(`${API_BASE}/ai-recipe/recommendation?skip=${skipRecipeId}`, {
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
  return json.data as AIRecipeResponse;
}
