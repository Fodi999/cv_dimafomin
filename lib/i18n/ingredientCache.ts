/**
 * In-memory cache for ingredient translations
 * Temporary solution until backend returns translations in GET /api/fridge/items
 */

interface IngredientTranslations {
  id: string;
  name: string;
  namePl?: string;
  nameEn?: string;
  nameRu?: string;
}

class IngredientCache {
  private cache: Map<string, IngredientTranslations> = new Map();

  /**
   * Store ingredient translations when received from search API
   */
  set(ingredient: IngredientTranslations): void {
    if (ingredient.id) {
      this.cache.set(ingredient.id, ingredient);
      
      // Also index by name for fallback lookup
      if (ingredient.name) {
        this.cache.set(ingredient.name, ingredient);
      }
      if (ingredient.namePl) {
        this.cache.set(ingredient.namePl, ingredient);
      }
      if (ingredient.nameEn) {
        this.cache.set(ingredient.nameEn, ingredient);
      }
      if (ingredient.nameRu) {
        this.cache.set(ingredient.nameRu, ingredient);
      }
    }
  }

  /**
   * Get ingredient translations by ID or name
   */
  get(idOrName: string): IngredientTranslations | undefined {
    return this.cache.get(idOrName);
  }

  /**
   * Get localized name for an ingredient
   */
  getLocalizedName(idOrName: string, language: string): string | undefined {
    const ingredient = this.cache.get(idOrName);
    if (!ingredient) return undefined;

    switch (language) {
      case 'ru':
        return ingredient.nameRu || ingredient.name;
      case 'en':
        return ingredient.nameEn || ingredient.name;
      case 'pl':
      default:
        return ingredient.namePl || ingredient.name;
    }
  }

  /**
   * Clear cache (useful for testing)
   */
  clear(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const ingredientCache = new IngredientCache();
