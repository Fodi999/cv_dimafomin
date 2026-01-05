/**
 * Recipe Form Types & Constants
 * Universal types for both Create and Edit modes
 */

// ============= TYPES =============

export type RecipeDifficulty = 'easy' | 'medium' | 'hard';
export type RecipeStatus = 'draft' | 'published' | 'archived';
export type RecipeMode = 'create' | 'edit';

/**
 * Ingredient in form (tied to catalog)
 */
export interface RecipeFormIngredient {
  ingredientId: string;     // UUID из каталога
  ingredientKey?: string;   // Optional key для поиска
  name: string;             // Display name
  quantity: number;
  unit: string;
  optional?: boolean;
  sortOrder?: number;
}

/**
 * Cooking step
 */
export interface RecipeFormStep {
  stepNumber: number;
  description: string;
  duration?: number;  // в минутах
}

/**
 * Translation for a locale
 */
export interface RecipeTranslation {
  locale: 'pl' | 'en' | 'uk' | 'ru';
  name: string;
  description: string;
}

/**
 * Origin info
 */
export interface RecipeOrigin {
  country: string;
  region?: string;
}

/**
 * Nutrition profile
 */
export interface RecipeNutrition {
  type?: string;
  calories?: number;
}

/**
 * Source metadata
 */
export interface RecipeSource {
  type: string;
  reference?: string;
}

/**
 * Complete Recipe Form Data
 * Used for both Create and Edit
 */
export interface RecipeFormData {
  // Basic Info
  localName: string;
  canonicalName: string;
  
  // Descriptions
  descriptionPl?: string;
  descriptionEn?: string;
  descriptionRu?: string;
  
  // Classification (Reference Data - IDs not text)
  countryCode?: string;     // "PL", "US" - ISO code
  cuisineId?: string;       // "poland", "italian" - ID from meta
  categoryId?: string;      // "main", "salad" - ID from meta
  difficulty: RecipeDifficulty;
  status: RecipeStatus;
  
  // Metrics
  timeMinutes: number;
  servings: number;
  portionWeightGrams?: number;
  
  // Content
  ingredients: RecipeFormIngredient[];
  steps: RecipeFormStep[];
  
  // Translations
  translations: {
    namePl?: string;
    nameEn?: string;
    nameUk?: string;
    nameRu?: string;
  };
  
  // Optional
  origin?: RecipeOrigin;
  nutritionProfile?: RecipeNutrition;
  source?: RecipeSource;
}

// ============= CONSTANTS =============

/**
 * Empty recipe for Create mode
 */
export const EMPTY_RECIPE: RecipeFormData = {
  localName: '',
  canonicalName: '',
  
  descriptionPl: '',
  descriptionEn: '',
  descriptionRu: '',
  
  countryCode: '',
  cuisineId: '',
  categoryId: '',
  difficulty: 'easy',
  status: 'draft',
  
  timeMinutes: 30,
  servings: 1,
  portionWeightGrams: undefined,
  
  ingredients: [],
  steps: [],
  
  translations: {
    namePl: '',
    nameEn: '',
    nameUk: '',
    nameRu: '',
  },
  
  origin: undefined,
  nutritionProfile: undefined,
  source: undefined,
};

/**
 * Default step for adding new steps
 */
export const EMPTY_STEP: RecipeFormStep = {
  stepNumber: 1,
  description: '',
  duration: undefined,
};

/**
 * Default ingredient for adding new ingredients
 */
export const EMPTY_INGREDIENT: RecipeFormIngredient = {
  ingredientId: '',
  name: '',
  quantity: 0,
  unit: 'g',
  optional: false,
  sortOrder: 0,
};

// ============= MAPPERS =============

/**
 * Map backend Recipe to RecipeFormData
 * Used in Edit mode
 */
export function mapRecipeToForm(recipe: any): RecipeFormData {
  return {
    localName: recipe.localName || '',
    canonicalName: recipe.canonicalName || '',
    
    descriptionPl: recipe.descriptionPl || '',
    descriptionEn: recipe.descriptionEn || '',
    descriptionRu: recipe.descriptionRu || '',
    
    countryCode: recipe.countryCode || '',
    cuisineId: recipe.cuisineId || recipe.cuisine || '',  // Fallback to old field
    categoryId: recipe.categoryId || recipe.category || '',  // Fallback to old field
    difficulty: recipe.difficulty || 'easy',
    status: recipe.status || 'draft',
    
    timeMinutes: recipe.timeMinutes || 30,
    servings: recipe.servings || 1,
    portionWeightGrams: recipe.portionWeightGrams,
    
    ingredients: (recipe.ingredients || []).map((ing: any, index: number) => ({
      ingredientId: ing.ingredientId || ing.id || '',
      ingredientKey: ing.ingredientKey,
      name: ing.name || ing.ingredientName || '',
      quantity: ing.quantity || ing.amount || 0,
      unit: ing.unit || 'g',
      optional: ing.optional || false,
      sortOrder: ing.sortOrder ?? index,
    })),
    
    steps: (recipe.steps || []).map((step: any, index: number) => ({
      stepNumber: step.stepNumber || index + 1,
      description: typeof step === 'string' ? step : (step.description || step.text || step.instruction || ''),
      duration: step.duration,
    })),
    
    translations: {
      namePl: recipe.namePl || '',
      nameEn: recipe.nameEn || '',
      nameUk: recipe.nameUk || '',
      nameRu: recipe.nameRu || '',
    },
    
    origin: recipe.country ? {
      country: recipe.country,
      region: recipe.region,
    } : undefined,
    
    nutritionProfile: recipe.nutritionProfile,
    source: recipe.source,
  };
}

/**
 * Map RecipeFormData to API payload
 * Used in both Create and Edit
 */
export function mapFormToApi(formData: RecipeFormData): any {
  return {
    // Backend expects 'title', not 'localName'
    title: formData.localName,
    canonicalName: formData.canonicalName,
    
    // Backend expects 'description', not 'descriptionPl'
    description: formData.descriptionPl || '',
    descriptionEn: formData.descriptionEn || undefined,
    descriptionRu: formData.descriptionRu || undefined,
    
    // Backend expects 'cuisine', not 'cuisineId'
    cuisine: formData.cuisineId || '',
    // Backend expects 'category', not 'categoryId'
    category: formData.categoryId || '',
    difficulty: formData.difficulty,
    status: formData.status,
    
    timeMinutes: formData.timeMinutes,
    servings: formData.servings,
    portionWeight: formData.portionWeightGrams || undefined,
    
    ingredients: formData.ingredients.map((ing) => ({
      ingredientId: ing.ingredientId,
      ingredientKey: ing.ingredientKey,
      quantity: ing.quantity,
      unit: ing.unit,
      optional: ing.optional || false,
      sortOrder: ing.sortOrder || 0,
    })),
    
    // Backend expects 'order', not 'stepNumber'
    steps: formData.steps.map((step) => ({
      order: step.stepNumber,
      description: step.description,
      duration: step.duration,
    })),
    
    namePl: formData.translations.namePl || undefined,
    nameEn: formData.translations.nameEn || undefined,
    nameUk: formData.translations.nameUk || undefined,
    nameRu: formData.translations.nameRu || undefined,
    
    country: formData.countryCode || formData.origin?.country || undefined,
    region: formData.origin?.region || undefined,
    
    nutritionProfile: formData.nutritionProfile || undefined,
    source: formData.source || undefined,
  };
}

/**
 * Validate recipe form
 * mode: 'create' - basic validation, 'edit' - full validation
 */
export function validateRecipeForm(formData: RecipeFormData, mode: RecipeMode = 'create'): string[] {
  const errors: string[] = [];
  
  if (!formData.localName.trim()) {
    errors.push('Назва обов\'язкова');
  }
  
  if (!formData.canonicalName.trim()) {
    errors.push('Canonical name обов\'язковий');
  }
  
  if (!formData.cuisineId || !formData.cuisineId.trim()) {
    errors.push('Оберіть кухню');
  }
  
  if (formData.timeMinutes <= 0) {
    errors.push('Час приготування має бути більше 0');
  }
  
  if (formData.servings <= 0) {
    errors.push('Кількість порцій має бути більше 0');
  }
  
  // Only validate ingredients and steps in edit mode
  // In create mode, these will be added after recipe creation
  if (mode === 'edit') {
    if (formData.ingredients.length === 0) {
      errors.push('Додайте хоча б один інгредієнт');
    }
    
    if (formData.steps.length === 0) {
      errors.push('Додайте хоча б один крок приготування');
    }
  }
  
  return errors;
}
