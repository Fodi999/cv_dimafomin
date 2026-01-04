import { apiFetch } from './base';

export interface RecipeMatchParams {
  limit?: number;
  minCoverage?: number;
  maxMissingCost?: number;
  maxTimeMinutes?: number;
  countries?: string[];
  sort?: 'score' | 'coverage' | 'time';
  order?: 'asc' | 'desc';
}

export interface RecipeMatchIngredient {
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit?: number;
  totalPrice?: number;
  available?: number;
  estimatedCost?: number;
}

export interface RecipeMatchEconomy {
  usedValue: number;
  costToComplete: number;
  totalRecipeCost: number;
  wasteRiskSaved: number;
  currency: string;
}

export interface RecipeMatch {
  recipeId: string;
  canonicalName: string;      // English name from backend
  localName: string;           // Localized name (legacy, always PL)
  localName_pl?: string;       // Polish name
  localName_ru?: string;       // Russian name  
  localName_en?: string;       // English name
  title?: string;              // Legacy field (for backward compatibility)
  description?: string;
  imageUrl?: string;
  country?: string;
  category?: string;           // Backend returns category
  difficulty?: string;
  cookingTime: number;
  timeMinutes?: number;        // Backend may return timeMinutes
  servings: number;
  steps?: string[];
  score?: number;
  match?: number;              // Backend returns match score
  coverage?: number;
  usedIngredients: string[] | RecipeMatchIngredient[];  // Can be simple strings or detailed objects
  missingIngredients?: RecipeMatchIngredient[];
  missing?: string[];          // Backend returns simple string array
  economy?: RecipeMatchEconomy;
  canCookNow?: boolean;
  canCook?: boolean;           // Backend returns canCook
  missingCount: number;
  usedCount?: number;
  costToComplete?: number;     // Backend returns cost estimate
}

export interface CookRecipeParams {
  servingsMultiplier?: number;
  idempotencyKey: string;
}

export interface CookRecipeResult {
  success: boolean;
  message: string;
  ingredientsUsed: Array<{
    name: string;
    quantityUsed: number;
    unit: string;
    remainingInFridge: number;
  }>;
  economySnapshot: {
    usedValue: number;
    wasteRiskSaved: number;
    currency: string;
  };
}

export interface RecipeMatchResponse {
  count: number;
  recipes: RecipeMatch[];
}

/**
 * Available Recipes - categorized by cooking feasibility
 * Backend already returns this structure from /recipes/match
 */
export interface AvailableRecipesResponse {
  canCook: RecipeMatch[];         // ✅ Can cook NOW (missingCount === 0)
  almostCook: RecipeMatch[];      // 🟡 Missing 1-2 ingredients
  needToBuy: RecipeMatch[];       // 🔴 Missing 3+ ingredients
  canCookCount: number;           // Count from backend
  almostCookCount: number;        // Count from backend
  needToBuyCount: number;         // Count from backend
  totalCount: number;             // Total recipes count
}

export type AIRecommendationResult =
  | { status: 'ok'; recipe: RecipeMatch }
  | { status: 'no-results'; message: string; error?: string; requiresUserAction?: boolean };

export const recipeMatchingApi = {
  getRecipeMatches: async (params: RecipeMatchParams = {}, token: string): Promise<RecipeMatchResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.minCoverage) queryParams.append('minCoverage', params.minCoverage.toString());
    if (params.maxMissingCost) queryParams.append('maxMissingCost', params.maxMissingCost.toString());
    if (params.maxTimeMinutes) queryParams.append('maxTimeMinutes', params.maxTimeMinutes.toString());
    if (params.countries?.length) queryParams.append('countries', params.countries.join(','));
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);

    const url = `/recipes/match${queryParams.toString() ? `?${queryParams}` : ''}`;
    console.log('Fetching recipe matches:', url);
    
    return apiFetch<RecipeMatchResponse>(url, { token });
  },

  getRecommendation: async (
    mode: 'fridge' | 'preferences' = 'fridge', 
    limit: number = 10, 
    token: string,
    excludeRecipeIds?: string[]
  ): Promise<AIRecommendationResult> => {
    try {
      const data = await apiFetch<any>('/recipes/recommendations', {
        method: 'POST',
        token,
        body: JSON.stringify({ mode, limit, excludeRecipeIds: excludeRecipeIds || [] }),
      });

      if (!data.success) {
        return {
          status: 'no-results',
          message: data.message || 'Nie znaleźliśmy pasującego przepisu',
          error: data.error || 'No recipes available',
          requiresUserAction: data.requiresUserAction ?? false
        };
      }

      if (!data ||  !data.recipe || !data.recipe.id) {
        return { status: 'no-results', message: 'Nie znaleźliśmy pasującego przepisu', error: 'No recipe data' };
      }

      const { recipe, match, economy } = data;
      
      return {
        status: 'ok',
        recipe: {
          recipeId: recipe.id,
          canonicalName: recipe.canonicalName,
          localName: recipe.localName,
          title: recipe.title || recipe.canonicalName,
          description: '',
          imageUrl: '',
          cookingTime: recipe.timeMinutes,
          servings: recipe.servings,
          steps: recipe.steps || [],
          difficulty: recipe.difficulty,
          country: recipe.country,
          score: 85,
          coverage: match.usedIngredients.length > 0 ? 100 : 0,
          canCookNow: match.canCookNow,
          missingCount: match.missingRequired.length,
          usedCount: match.usedIngredients.length,
          usedIngredients: match.usedIngredients.map((ing: any) => ({
            name: ing.name, quantity: ing.quantity, unit: ing.unit, available: ing.available
          })),
          missingIngredients: match.missingRequired.map((ing: any) => ({
            name: ing.name, quantity: ing.quantity, unit: ing.unit, estimatedCost: ing.estimatedCost
          })),
          economy: {
            usedValue: economy.usedFromFridge,
            costToComplete: match.missingRequired.reduce((s: number, i: any) => s + i.estimatedCost, 0),
            totalRecipeCost: economy.usedFromFridge + match.missingRequired.reduce((s: number, i: any) => s + i.estimatedCost, 0),
            wasteRiskSaved: economy.saved,
            currency: 'PLN',
          },
        }
      };
    } catch (error: any) {
      return { status: 'no-results', message: error.message || 'Nie udało się załadować rekomendacji', error: error.toString() };
    }
  },

  /**
   * Get available recipes categorized by cooking feasibility
   * Backend returns pre-categorized recipes from /recipes/available
   */
  getAvailableRecipes: async (params: RecipeMatchParams = {}, token: string, language?: string): Promise<AvailableRecipesResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.minCoverage) queryParams.append('minCoverage', params.minCoverage.toString());
    if (params.maxMissingCost) queryParams.append('maxMissingCost', params.maxMissingCost.toString());
    if (params.maxTimeMinutes) queryParams.append('maxTimeMinutes', params.maxTimeMinutes.toString());
    if (params.countries?.length) queryParams.append('countries', params.countries.join(','));
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);

    const url = `/recipes/available${queryParams.toString() ? `?${queryParams}` : ''}`;
    console.log('🔍 Fetching available recipes:', url);
    console.log('🌍 Language:', language || 'auto-detect from Accept-Language');
    
    // Backend returns AvailableRecipesResponse with categorized recipes
    return apiFetch<AvailableRecipesResponse>(url, { token, language });
  },

  cookRecipe: async (recipeId: string, params: CookRecipeParams, token: string): Promise<CookRecipeResult> => {
    return apiFetch<CookRecipeResult>(`/recipes/${recipeId}/cook`, {
      method: 'POST',
      token,
      body: JSON.stringify(params),
    });
  },
};
