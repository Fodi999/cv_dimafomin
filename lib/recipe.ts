/**
 * Recipe Module - Central Export
 * 
 * Import everything related to recipes from here:
 * 
 * ```typescript
 * import { 
 *   Recipe, 
 *   getRecipeTitle, 
 *   recipeApi,
 *   useRecipeCreate 
 * } from '@/lib/recipe';
 * ```
 */

// Types
export type {
  Recipe,
  RecipeIngredient,
  RecipeStep,
  RecipeNutrition,
  RecipeListResponse,
  RecipeSingleResponse,
  RecipeCreateRequest,
  RecipeCreateResponse,
} from './types/recipe';

// Helper Functions
export {
  getRecipeTitle,
  getRecipeDescription,
  formatCanonicalName,
  getRecipeUrl,
  getRecipeKey,
  getIngredientName,
} from './types/recipe';

// API Client
export { recipeApi } from './api/recipe';
