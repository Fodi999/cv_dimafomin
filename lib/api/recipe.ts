/**
 * Recipe API Client
 * Работает с backend через NEXT_PUBLIC_API_BASE
 */

import type {
  Recipe,
  RecipeListResponse,
  RecipeSingleResponse,
  RecipeCreateRequest,
  RecipeCreateResponse,
} from '@/lib/types/recipe';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';

// =====================================================
// GET: Fetch Recipes
// =====================================================

/**
 * Получить список рецептов с фильтрацией
 */
export async function getRecipes(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  difficulty?: string;
  search?: string;
}): Promise<RecipeListResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.pageSize) searchParams.set('pageSize', params.pageSize.toString());
  if (params?.category) searchParams.set('category', params.category);
  if (params?.difficulty) searchParams.set('difficulty', params.difficulty);
  if (params?.search) searchParams.set('search', params.search);
  
  const url = `${API_BASE}/recipes${searchParams.toString() ? `?${searchParams}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch recipes: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Получить один рецепт по canonicalName
 */
export async function getRecipe(canonicalName: string): Promise<RecipeSingleResponse> {
  const response = await fetch(`${API_BASE}/recipes/${canonicalName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch recipe: ${response.statusText}`);
  }
  
  return response.json();
}

// =====================================================
// POST: Create Recipe
// =====================================================

/**
 * Создать новый рецепт
 * 
 * ВАЖНО: canonicalName генерируется backend'ом автоматически
 * - Frontend передает localName (любой язык)
 * - Backend генерирует English slug: "Яичница" → "scrambled_eggs"
 * - Backend проверяет уникальность и возвращает canonicalName
 */
export async function createRecipe(
  data: RecipeCreateRequest,
  token: string | null
): Promise<RecipeCreateResponse> {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Failed to create recipe');
  }
  
  return response.json();
}

// =====================================================
// PUT: Update Recipe
// =====================================================

/**
 * Обновить существующий рецепт
 * 
 * ВАЖНО: canonicalName НЕ МЕНЯЕТСЯ при обновлении
 * - Используется для идентификации рецепта
 * - Стабильный для SEO и аналитики
 * - Только backend может изменить (ручной SQL)
 */
export async function updateRecipe(
  canonicalName: string,
  data: Partial<RecipeCreateRequest>,
  token: string | null
): Promise<RecipeCreateResponse> {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE}/recipes/${canonicalName}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Failed to update recipe');
  }
  
  return response.json();
}

// =====================================================
// DELETE: Delete Recipe
// =====================================================

/**
 * Удалить рецепт (или изменить статус на 'archived')
 */
export async function deleteRecipe(
  canonicalName: string,
  token: string | null
): Promise<{ success: true; message: string }> {
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await fetch(`${API_BASE}/recipes/${canonicalName}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Failed to delete recipe');
  }
  
  return response.json();
}

// =====================================================
// Export all
// =====================================================

export const recipeApi = {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
