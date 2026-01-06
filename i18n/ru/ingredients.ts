/**
 * Ingredients translations (RU)
 * UI-only translations for ingredient-related elements
 * 
 * Note: Ingredient names come from backend with name_pl, name_en, name_ru fields
 * This file contains only UI element translations
 */

export const ingredients = {
  // UI Elements
  searchPlaceholder: "Поиск ингредиентов...",
  noResults: "Ингредиенты не найдены",
  addIngredient: "Добавить ингредиент",
  editIngredient: "Редактировать ингредиент",
  deleteIngredient: "Удалить ингредиент",
  
  // Fallback
  unknown: "Неизвестный ингредиент",
} as const;
