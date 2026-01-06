/**
 * Ingredients API Layer
 * Clean separation of API logic from components
 */

import { apiFetch } from "@/lib/api/base";

export type CreateIngredientPayload = {
  inputName: string;
  inputLang: "pl" | "en" | "ru"; // Required by backend (for now)
  category: "protein" | "vegetable" | "dairy" | "grain" | "condiment" | "other";
  unit: string;
};

export type UpdateIngredientPayload = {
  inputName?: string;
  category?: string;
  unit?: string;
};

/**
 * Create new ingredient with AI translation
 * Backend will translate the name to all languages using Groq
 */
export async function createIngredient(payload: CreateIngredientPayload) {
  return apiFetch<{ success: boolean; data: any }>("/admin/ingredients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Update existing ingredient
 */
export async function updateIngredient(id: string, payload: UpdateIngredientPayload) {
  return apiFetch<{ success: boolean; data: any }>(`/admin/ingredients/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
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
