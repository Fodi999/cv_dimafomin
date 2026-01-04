/**
 * Recipe Title Localization Helper
 * 
 * Backend now returns localized `localName` based on Accept-Language header!
 * 
 * - canonicalName: "Greek Salad" (always EN, fallback)
 * - localName: локализованное название на языке из Accept-Language
 *   - ru → "Греческий салат"
 *   - pl → "Sałatka grecka"  
 *   - en → "Greek Salad"
 */

interface RecipeWithLocalization {
  canonicalName?: string;
  localName?: string;
  title?: string;
}

/**
 * Get localized recipe title
 * 
 * Backend already returns correct localName based on Accept-Language header.
 * Frontend just uses localName with canonicalName as fallback.
 */
export function getRecipeTitle(
  recipe: RecipeWithLocalization | null | undefined,
  _lang?: string  // Unused, kept for compatibility
): string {
  if (!recipe) return "";

  // Backend returns localName in the correct language based on Accept-Language
  // Frontend just needs to use it with canonicalName as fallback
  return recipe.localName || recipe.canonicalName || "";
}
