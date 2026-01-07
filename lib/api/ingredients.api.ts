/**
 * Ingredients API Layer
 * Clean separation of API logic from components
 */

import { apiFetch } from "@/lib/api/base";

/**
 * Create new ingredient - ТОЛЬКО название!
 * Backend автоматически:
 * - определит категорию через AI
 * - выберет единицу измерения
 * - переведёт на RU/EN/PL
 */
export async function createIngredient(inputName: string) {
  return apiFetch<{
    id: string;
    namePl: string;
    nameEn: string;
    nameRu: string;
    category: string;
    unit: string;
    normalizedValue: string;
    autoTranslated?: boolean;
  }>("/admin/ingredients", {
    method: "POST",
    body: JSON.stringify({ inputName }),
  });
}

/**
 * Delete ingredient
 */
export async function deleteIngredient(id: string) {
  return apiFetch(`/admin/ingredients/${id}`, {
    method: "DELETE",
  });
}

/**
 * Get all ingredients with optional filters
 */
export async function getIngredients(params?: {
  search?: string;
  category?: string;
  unit?: string;
}) {
  const query = new URLSearchParams();
  
  if (params?.search) query.append('search', params.search);
  if (params?.category) query.append('category', params.category);
  if (params?.unit) query.append('unit', params.unit);

  return apiFetch(`/admin/ingredients?${query.toString()}`);
}

/**
 * Get ingredient suggestions (autocomplete)
 * @param query - Search query (min 2 characters)
 * @param limit - Max results (default: 5)
 * @param language - Language code (ru/pl/en) for Accept-Language header
 */
export async function getIngredientSuggestions(query: string, limit: number = 5, language?: string) {
  if (query.length < 2) {
    return { suggestions: [] };
  }
  
  const params = new URLSearchParams();
  params.append('q', query);
  params.append('limit', limit.toString());

  const response = await apiFetch<any>(`/admin/ingredients/suggest?${params.toString()}`, {
    language: language // Pass language to API for proper Accept-Language header
  });
  
  console.log('[ingredients.api] Raw response:', response);
  console.log('[ingredients.api] response type:', Array.isArray(response) ? 'array' : typeof response);
  
  // Case 1: apiFetch already unwrapped {data: [...]} → response is Array
  if (Array.isArray(response)) {
    console.log('[ingredients.api] Response is array → using directly');
    return { suggestions: response };
  }
  
  // Case 2: Old format {suggestions: [...]}
  if (response.suggestions) {
    console.log('[ingredients.api] Using response.suggestions');
    return response;
  }
  
  // Case 3: New format {data: [...]}
  if (response.data) {
    console.log('[ingredients.api] Using response.data → converting to suggestions');
    return { suggestions: response.data };
  }
  
  // Fallback
  console.warn('[ingredients.api] No data or suggestions found, returning empty array');
  return { suggestions: [] };
}

/**
 * Universal ingredient resolution
 * Returns existing ingredient OR creates new one with AI classification
 * 
 * @param input - Ingredient name (any language)
 * @returns { status: "created" | "existing", ingredient: {...} }
 */
export async function resolveIngredient(input: string) {
  return apiFetch<{
    status: "created" | "existing";
    ingredient: {
      id: string;
      name: string;
      nameRu?: string;
      namePl?: string;
      nameEn?: string;
      category: string;
      nutritionGroup?: string;
      unit: string;
    };
  }>("/admin/ingredients/resolve", {
    method: "POST",
    body: JSON.stringify({ input }),
  });
}
