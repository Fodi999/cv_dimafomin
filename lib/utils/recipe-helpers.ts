/**
 * Recipe Helper Functions
 * Utilities for working with multilingual recipe data
 */

import { Recipe } from "@/hooks/useAdminRecipes";

/**
 * Get recipe name in specified language with fallback
 */
export function getRecipeName(
  recipe: Recipe, 
  lang: 'ru' | 'en' | 'pl' | 'uk'
): string {
  const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
  const nameField = `name${capitalizedLang}` as keyof Recipe;
  
  // Try language-specific field first
  const localizedName = recipe[nameField];
  if (localizedName && typeof localizedName === 'string') {
    return localizedName;
  }
  
  // Fallback chain: ru -> en -> pl -> uk -> title
  return (
    recipe.nameRu || 
    recipe.nameEn || 
    recipe.namePl || 
    recipe.nameUk || 
    recipe.title || 
    'Без назви'
  );
}

/**
 * Check if recipe was created within last 7 days
 */
export function isNewRecipe(createdAt?: string): boolean {
  if (!createdAt) return false;
  
  try {
    const createdDate = new Date(createdAt);
    const now = Date.now();
    const daysSinceCreation = (now - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return daysSinceCreation <= 7;
  } catch (error) {
    console.error('[isNewRecipe] Invalid date:', createdAt);
    return false;
  }
}

/**
 * Format date for display
 */
export function formatRecipeDate(dateString?: string, locale: string = 'uk-UA'): string {
  if (!dateString) return '—';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return '—';
  }
}

/**
 * Get description in specified language with fallback
 */
export function getRecipeDescription(
  recipe: Recipe,
  lang: 'ru' | 'en' | 'pl'
): string {
  const capitalizedLang = lang.charAt(0).toUpperCase() + lang.slice(1);
  const descField = `description${capitalizedLang}` as keyof Recipe;
  
  const localizedDesc = recipe[descField];
  if (localizedDesc && typeof localizedDesc === 'string') {
    return localizedDesc;
  }
  
  // Fallback
  return (
    recipe.descriptionRu ||
    recipe.descriptionEn ||
    recipe.descriptionPl ||
    recipe.description ||
    ''
  );
}
