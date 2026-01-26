/**
 * 📦 Ingredient Categories API Client
 * 
 * Fetches ingredient categories from backend with localization support.
 * Categories are reference data managed in database, not hardcoded.
 * 
 * ✅ 2026: Использует publicFetch для публичных endpoint'ов
 */

import { publicFetch } from "./publicFetch";

export interface Category {
  key: string;        // Stable identifier (fish, meat, dairy)
  label: string;      // Localized label (depends on Accept-Language)
  icon: string;       // Emoji icon (🐟, 🥩, 🥛)
  sortOrder: number;  // Display order (0 = first, 9 = last)
}

interface CategoryApiResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

/**
 * Fetch ingredient categories from backend
 * 
 * ✅ 2026: Использует publicFetch (публичный endpoint, не требует токен)
 * 
 * @param language - Language code (pl, en, ru)
 * @returns Array of categories sorted by sortOrder
 * 
 * @example
 * const categories = await fetchCategories('pl');
 * // [
 * //   {key: "all", label: "Wszystkie", icon: "🧊", sortOrder: 0},
 * //   {key: "fish", label: "Ryby", icon: "🐟", sortOrder: 1},
 * //   ...
 * // ]
 */
export async function fetchCategories(language: string): Promise<Category[]> {
  try {
    // ✅ 2026: Backend исправлен - /api/catalog/ingredient-categories теперь публичный
    const url = `/api/catalog/ingredient-categories`;

    const response = await publicFetch(url, {
      method: 'GET',
      headers: {
        'Accept-Language': language,
      },
    });

    if (!response.ok) {
      console.warn(`[categoryApi] Failed with ${response.status} - using fallback categories`);
      return getFallbackCategories(language);
    }

    const result: CategoryApiResponse = await response.json();
    
    if (!result.success || !result.data?.categories) {
      throw new Error('Invalid response format from categories API');
    }
    
    console.log(`[categoryApi] ✅ Loaded ${result.data.categories.length} categories from backend`);
    return result.data.categories.sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    console.error('[categoryApi] Failed to fetch categories:', error);
    
    // Fallback to minimal set if API fails
    return getFallbackCategories(language);
  }
}

/**
 * Fallback categories if API fails
 * Used for offline/error resilience
 */
function getFallbackCategories(language: string): Category[] {
  const fallbacks: Record<string, Category[]> = {
    pl: [
      { key: 'all', label: 'Wszystkie', icon: '🧊', sortOrder: 0 },
      { key: 'fish', label: 'Ryby', icon: '🐟', sortOrder: 1 },
      { key: 'meat', label: 'Mięso', icon: '🥩', sortOrder: 2 },
      { key: 'egg', label: 'Jajka', icon: '🥚', sortOrder: 3 },
      { key: 'dairy', label: 'Nabiał', icon: '🥛', sortOrder: 4 },
      { key: 'vegetable', label: 'Warzywa', icon: '🥕', sortOrder: 5 },
      { key: 'fruit', label: 'Owoce', icon: '🍎', sortOrder: 6 },
      { key: 'grain', label: 'Zboża', icon: '🌾', sortOrder: 7 },
      { key: 'condiment', label: 'Przyprawy', icon: '🧂', sortOrder: 8 },
      { key: 'other', label: 'Inne', icon: '📦', sortOrder: 9 },
    ],
    en: [
      { key: 'all', label: 'All', icon: '🧊', sortOrder: 0 },
      { key: 'fish', label: 'Fish', icon: '🐟', sortOrder: 1 },
      { key: 'meat', label: 'Meat', icon: '🥩', sortOrder: 2 },
      { key: 'egg', label: 'Eggs', icon: '🥚', sortOrder: 3 },
      { key: 'dairy', label: 'Dairy', icon: '🥛', sortOrder: 4 },
      { key: 'vegetable', label: 'Vegetables', icon: '🥕', sortOrder: 5 },
      { key: 'fruit', label: 'Fruits', icon: '🍎', sortOrder: 6 },
      { key: 'grain', label: 'Grains', icon: '🌾', sortOrder: 7 },
      { key: 'condiment', label: 'Condiments', icon: '🧂', sortOrder: 8 },
      { key: 'other', label: 'Other', icon: '📦', sortOrder: 9 },
    ],
    ru: [
      { key: 'all', label: 'Все', icon: '🧊', sortOrder: 0 },
      { key: 'fish', label: 'Рыба', icon: '🐟', sortOrder: 1 },
      { key: 'meat', label: 'Мясо', icon: '🥩', sortOrder: 2 },
      { key: 'egg', label: 'Яйца', icon: '🥚', sortOrder: 3 },
      { key: 'dairy', label: 'Молочное', icon: '🥛', sortOrder: 4 },
      { key: 'vegetable', label: 'Овощи', icon: '🥕', sortOrder: 5 },
      { key: 'fruit', label: 'Фрукты', icon: '🍎', sortOrder: 6 },
      { key: 'grain', label: 'Крупы', icon: '🌾', sortOrder: 7 },
      { key: 'condiment', label: 'Специи', icon: '🧂', sortOrder: 8 },
      { key: 'other', label: 'Другое', icon: '📦', sortOrder: 9 },
    ],
  };

  return fallbacks[language] || fallbacks['en'];
}

/**
 * Get category label by key (for display purposes)
 * 
 * @param categories - Array of categories from API
 * @param key - Category key (fish, meat, dairy)
 * @returns Localized label or key as fallback
 */
export function getCategoryLabel(categories: Category[], key: string): string {
  const category = categories.find(c => c.key === key);
  return category?.label || key;
}

/**
 * Get category icon by key
 * 
 * @param categories - Array of categories from API
 * @param key - Category key (fish, meat, dairy)
 * @returns Emoji icon or default box
 */
export function getCategoryIcon(categories: Category[], key: string): string {
  const category = categories.find(c => c.key === key);
  return category?.icon || '📦';
}
