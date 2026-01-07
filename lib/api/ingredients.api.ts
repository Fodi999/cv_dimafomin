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
