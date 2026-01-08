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
export async function getIngredientSuggestions(query: string, limit: number = 10, language?: string) {
  if (query.length < 2) {
    return { suggestions: [] };
  }
  
  // Use Next.js API route instead of direct backend call
  const params = new URLSearchParams();
  params.append('q', query);
  params.append('limit', limit.toString());

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (language) {
      headers["Accept-Language"] = language;
    }

    const response = await fetch(`/api/admin/ingredients/suggest?${params.toString()}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[getIngredientSuggestions] Error:', response.status, errorText);
      throw new Error(`Failed to fetch suggestions: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('[ingredients.api] Raw response:', data);
    console.log('[ingredients.api] response type:', Array.isArray(data) ? 'array' : typeof data);
    
    // Case 1: Response is array directly
    if (Array.isArray(data)) {
      console.log('[ingredients.api] Response is array → using directly');
      return { suggestions: data };
    }
    
    // Case 2: Old format {suggestions: [...]}
    if (data.suggestions) {
      console.log('[ingredients.api] Using data.suggestions');
      return data;
    }
    
    // Case 3: New format {data: [...]}
    if (data.data) {
      console.log('[ingredients.api] Using data.data → converting to suggestions');
      return { suggestions: data.data };
    }
    
    // Fallback
    console.warn('[ingredients.api] No data or suggestions found, returning empty array');
    return { suggestions: [] };
  } catch (error: any) {
    console.error('[getIngredientSuggestions] Error:', error);
    throw error;
  }
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
