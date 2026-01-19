// =====================================================
// Recipe Types - Updated for canonicalName
// =====================================================

/**
 * Recipe from API (backend-driven canonical names)
 * 
 * ВАЖНО: canonicalName генерируется backend'ом, НЕ frontend'ом
 * - Всегда English slug (scrambled_eggs, не яичница)
 * - Уникальный (UNIQUE constraint в БД)
 * - Обязательный (NOT NULL constraint)
 * - Используется для рекомендаций, аналитики, масштабирования
 */
export interface Recipe {
  id: string;
  canonicalName: string; // ← ДОБАВЛЕНО: English slug (scrambled_eggs, fried_salmon, etc.)
  category: 'main' | 'salad' | 'soup' | 'dessert' | 'breakfast' | 'snack';
  country: string; // ISO code (pl, en, ru, etc.)
  difficulty: 'easy' | 'medium' | 'hard';
  timeMinutes: number;
  servings: number;
  
  // Image
  imageUrl?: string | null; // ← ДОБАВЛЕНО: URL изображения из Cloudinary (опционально для старых рецептов)
  
  // Локализованные поля (опциональные)
  titles?: {
    pl?: string;
    en?: string;
    ru?: string;
  };
  descriptions?: {
    pl?: string;
    en?: string;
    ru?: string;
  };
  
  // Legacy поля (deprecated, будут удалены)
  localName?: string; // @deprecated Используйте canonicalName
  title?: string;     // @deprecated Используйте titles[lang]
  
  // Ingredients (если нужны)
  ingredients?: RecipeIngredient[];
  
  // Steps (если нужны)
  steps?: RecipeStep[];
  
  // Nutrition (если есть)
  nutrition?: RecipeNutrition;
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface RecipeIngredient {
  id: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  optional?: boolean;
  sortOrder?: number;
  
  // Populated data (если backend включил)
  ingredient?: {
    id: string;
    names: {
      pl?: string;
      en?: string;
      ru?: string;
    };
  };
}

export interface RecipeStep {
  stepNumber: number;
  description: string;
  duration?: number; // в минутах
}

export interface RecipeNutrition {
  type?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

/**
 * Recipe List Response from API
 */
export interface RecipeListResponse {
  success: true;
  data: {
    recipes: Recipe[];
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

/**
 * Single Recipe Response from API
 */
export interface RecipeSingleResponse {
  success: true;
  data: {
    recipe: Recipe;
  };
}

/**
 * Recipe Create/Update Request
 */
export interface RecipeCreateRequest {
  // Basic Info (canonicalName НЕ включен - генерируется backend'ом)
  localName: string; // Локальное название (будет использовано для генерации canonicalName)
  
  // Локализованные названия
  namePl?: string;
  nameEn?: string;
  nameRu?: string;
  
  // Локализованные описания
  descriptionPl?: string;
  descriptionEn?: string;
  descriptionRu?: string;
  
  // Classification
  country?: string;     // ISO code (PL, US, etc.)
  category?: string;    // main, salad, soup, etc.
  difficulty: 'easy' | 'medium' | 'hard';
  status?: 'draft' | 'published' | 'archived';
  
  // Metrics
  timeMinutes: number;
  servings: number;
  portionWeightGrams?: number;
  
  // Content
  ingredients: Array<{
    ingredientId: string;
    quantity: number;
    unit: string;
    optional?: boolean;
    sortOrder?: number;
  }>;
  
  steps?: Array<{
    stepNumber: number;
    description: string;
    duration?: number;
  }>;
  
  // Nutrition
  nutrition?: {
    type?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

/**
 * Recipe Create/Update Response
 */
export interface RecipeCreateResponse {
  success: true;
  data: {
    recipe: Recipe; // Включает сгенерированный canonicalName
    message?: string;
  };
}

// =====================================================
// Helper Functions
// =====================================================

/**
 * Получить название рецепта на текущем языке
 * Fallback order: current lang → en → pl → ru → canonicalName
 */
export function getRecipeTitle(recipe: Recipe, lang: 'pl' | 'en' | 'ru' = 'en'): string {
  if (recipe.titles) {
    return recipe.titles[lang] 
      || recipe.titles.en 
      || recipe.titles.pl 
      || recipe.titles.ru 
      || formatCanonicalName(recipe.canonicalName);
  }
  
  // Legacy fallback
  if (recipe.title) return recipe.title;
  if (recipe.localName) return recipe.localName;
  
  return formatCanonicalName(recipe.canonicalName);
}

/**
 * Получить описание рецепта на текущем языке
 */
export function getRecipeDescription(recipe: Recipe, lang: 'pl' | 'en' | 'ru' = 'en'): string | undefined {
  if (!recipe.descriptions) return undefined;
  
  return recipe.descriptions[lang] 
    || recipe.descriptions.en 
    || recipe.descriptions.pl 
    || recipe.descriptions.ru;
}

/**
 * Форматировать canonicalName для отображения
 * "fried_salmon" → "Fried Salmon"
 */
export function formatCanonicalName(canonicalName: string): string {
  return canonicalName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Получить URL для страницы рецепта
 * Использует canonicalName для SEO-friendly URLs
 */
export function getRecipeUrl(recipe: Recipe): string {
  return `/recipes/${recipe.canonicalName}`; // /recipes/fried_salmon
}

/**
 * Получить уникальный ключ для рецепта (React keys)
 */
export function getRecipeKey(recipe: Recipe): string {
  return recipe.canonicalName; // Уникальный и стабильный
}

/**
 * Получить название ингредиента на текущем языке
 */
export function getIngredientName(
  ingredient: RecipeIngredient['ingredient'],
  lang: 'pl' | 'en' | 'ru' = 'en'
): string {
  if (!ingredient) return 'Unknown';
  
  return ingredient.names[lang]
    || ingredient.names.en
    || ingredient.names.pl
    || ingredient.names.ru
    || 'Unknown';
}
