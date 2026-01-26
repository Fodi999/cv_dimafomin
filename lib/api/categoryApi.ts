/**
 * 📦 Ingredient Categories API Client
 * 
 * Fetches ingredient categories from backend with localization support.
 * Categories are reference data managed in database, not hardcoded.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

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
 * @param language - Language code (pl, en, ru)
 * @param token - JWT Bearer token
 * @returns Array of categories sorted by sortOrder
 * 
 * @example
 * const categories = await fetchCategories('pl', token);
 * // [
 * //   {key: "all", label: "Wszystkie", icon: "🧊", sortOrder: 0},
 * //   {key: "fish", label: "Ryby", icon: "🐟", sortOrder: 1},
 * //   ...
 * // ]
 */
export async function fetchCategories(language: string, token?: string | null): Promise<Category[]> {
  try {
    // Build headers - only include Authorization if token exists
    const headers: HeadersInit = {
      'Accept-Language': language, // pl, en, ru
      'Content-Type': 'application/json',
    };
    
    // Only add Authorization header if token is provided
    if (token && token.trim()) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/catalog/ingredient-categories`, {
      method: 'GET',
      headers,
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      // If 401 and no token, use fallback immediately (expected behavior)
      if (response.status === 401 && !token) {
        console.warn('[categoryApi] 401 without token - using fallback categories');
        return getFallbackCategories(language);
      }
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }

    const result: CategoryApiResponse = await response.json();
    
    // ✅ Backend возвращает {success: true, data: {categories: [...]}}
    if (!result.success || !result.data?.categories) {
      throw new Error('Invalid response format from categories API');
    }
    
    // Backend already sorts by sortOrder, but we ensure it client-side too
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
