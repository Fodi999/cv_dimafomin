/**
 * Meta Reference Data Types
 * Professional CMS-ready metadata structures
 */

// ============= COUNTRY =============

export interface MetaCountry {
  id: string;              // UUID
  code: string;            // ISO: "PL", "US", "UA"
  name: string;            // English: "Poland"
  namePL: string;          // Localized: "Polska"
  nameRU: string;          // Localized: "Польша"
  flag: string;            // Emoji: "🇵🇱"
  recipeCount: number;     // Analytics
}

// ============= CUISINE =============

export interface MetaCuisine {
  id: string;              // "poland", "italian", "japanese"
  name: string;            // English: "Polish Cuisine"
  namePL: string;          // "Kuchnia Polska"
  nameRU: string;          // "Польская кухня"
  countryCode?: string;    // Optional link: "PL"
  icon: string;            // Emoji: "🍲"
  recipeCount: number;     // Analytics
}

// ============= CATEGORY =============

export interface MetaCategory {
  id: string;              // "main", "salad", "soup"
  code: string;            // "main-course"
  name: string;            // English: "Main Course"
  namePL: string;          // "Danie główne"
  nameRU: string;          // "Основное блюдо"
  icon: string;            // Emoji: "🍽️"
  order: number;           // Sort order
  recipeCount: number;     // Analytics
}

// ============= DIFFICULTY =============

export interface MetaDifficulty {
  id: string;              // "easy", "medium", "hard"
  code: string;            // "easy"
  name: string;            // English: "Easy"
  namePL: string;          // "Łatwy"
  nameRU: string;          // "Легкий"
  level: number;           // 1, 2, 3 for sorting
  icon: string;            // "😊", "🤔", "💪"
  color: string;           // "green", "yellow", "red"
  recipeCount: number;     // Analytics
}

// ============= API RESPONSES =============

export interface MetaCountriesResponse {
  countries: MetaCountry[];
  total: number;
}

export interface MetaCuisinesResponse {
  cuisines: MetaCuisine[];
  total: number;
}

export interface MetaCategoriesResponse {
  categories: MetaCategory[];
  total: number;
}

export interface MetaDifficultiesResponse {
  difficulties: MetaDifficulty[];
  total: number;
}
