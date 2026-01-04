/**
 * 🔄 Recipe Data Adapters
 * 
 * Converts различные форматы данных (от backend, AI, saved recipes)
 * в единый формат UnifiedRecipeData
 * 
 * This eliminates:
 * - "Magic" calculations on frontend
 * - Duplicated normalization logic
 * - Inconsistent data structures
 * 
 * Usage:
 * ```tsx
 * // From API
 * const recipe = apiRecipeToUnified(apiResponse);
 * 
 * // From SavedRecipe
 * const recipe = savedRecipeToUnified(savedRecipe);
 * 
 * // From AI RecipeMatch
 * const recipe = recipeMatchToUnified(aiRecommendation);
 * ```
 */

import type { RecipeMatch, RecipeMatchIngredient } from "./api/recipe-matching";
import type { UnifiedRecipeData } from "@/components/recipes/UnifiedRecipeCard";

// ========================================
// 🔄 FROM API RECIPES
// ========================================

/**
 * Convert /api/recipes response to UnifiedRecipeData
 */
export function apiRecipeToUnified(apiRecipe: any): UnifiedRecipeData {
  return {
    id: apiRecipe.id || apiRecipe._id || "",
    title: apiRecipe.title || apiRecipe.name || "Przepis",
    description: apiRecipe.description || "",
    imageUrl: apiRecipe.imageUrl || apiRecipe.image_url || apiRecipe.image,

    difficulty: normalizeDifficulty(apiRecipe.difficulty),
    cookingTime: apiRecipe.cookingTime || apiRecipe.timeMinutes || apiRecipe.time_minutes,
    servings: apiRecipe.servings || apiRecipe.portions,
    category: apiRecipe.category,
    country: apiRecipe.country || apiRecipe.recipeCountry,

    ingredients: apiRecipe.ingredients?.map((ing: any) => ({
      name: ing.name,
      quantity: ing.quantity || ing.amount,
      unit: ing.unit,
      estimatedCost: ing.estimatedCost || ing.estimated_cost,
    })),

    steps: apiRecipe.steps || apiRecipe.instructions,
    chefTips: apiRecipe.chefTips || apiRecipe.chef_tips || apiRecipe.tips,

    author: apiRecipe.author
      ? {
          name: apiRecipe.author.name,
          avatar: apiRecipe.author.avatar || apiRecipe.author.avatar_url,
        }
      : undefined,

    likes: apiRecipe.likes || apiRecipe.likesCount,
    comments: apiRecipe.comments || apiRecipe.commentsCount,
  };
}

// ========================================
// 🔄 FROM SAVED RECIPES
// ========================================

/**
 * Convert SavedRecipe to UnifiedRecipeData
 */
export function savedRecipeToUnified(savedRecipe: any): UnifiedRecipeData {
  return {
    id: savedRecipe.id || savedRecipe.recipeId,
    title: savedRecipe.recipeName || savedRecipe.title,
    description: savedRecipe.description || "",
    imageUrl: savedRecipe.imageUrl || savedRecipe.image_url,

    difficulty: normalizeDifficulty(savedRecipe.recipeDifficulty || savedRecipe.difficulty),
    cookingTime: savedRecipe.recipeTimeMinutes || savedRecipe.cookingTime,
    servings: savedRecipe.recipeServings || savedRecipe.servings,
    country: savedRecipe.recipeCountry,

    savedAt: savedRecipe.savedAt || savedRecipe.saved_at,
    cookedCount: savedRecipe.cookedCount || savedRecipe.cooked_count || 0,
    lastCookedAt: savedRecipe.lastCookedAt || savedRecipe.last_cooked_at,

    canCookNow: savedRecipe.canCookNow ?? savedRecipe.can_cook_now,
    missingIngredientsCount:
      savedRecipe.missingIngredientsCount ?? savedRecipe.missing_ingredients_count,

    ingredientsUsed: savedRecipe.usedIngredients || savedRecipe.ingredients_used,
    ingredientsMissing: savedRecipe.missingIngredients || savedRecipe.ingredients_missing,

    economy: savedRecipe.economy
      ? {
          usedFromFridge: savedRecipe.economy.usedFromFridge,
          usedValue: savedRecipe.economy.usedValue || savedRecipe.usedIngredientsValue,
          costToComplete:
            savedRecipe.economy.costToComplete ||
            savedRecipe.missingIngredientsCost ||
            savedRecipe.economy.estimatedExtraCost,
          wasteRiskSaved:
            savedRecipe.economy.wasteRiskSaved ||
            savedRecipe.totalWasteSaved ||
            savedRecipe.economy.savedMoney,
          currency: savedRecipe.economy.currency || "PLN",
        }
      : undefined,
  };
}

// ========================================
// 🔄 FROM AI RECIPE MATCH
// ========================================

/**
 * Convert RecipeMatch (AI recommendation) to UnifiedRecipeData
 */
export function recipeMatchToUnified(match: RecipeMatch): UnifiedRecipeData {
  return {
    id: match.recipeId || "",
    // ✅ Backend returns localized localName based on Accept-Language
    title: match.localName || match.canonicalName,
    description: match.description,
    imageUrl: match.imageUrl,

    difficulty: normalizeDifficulty(match.difficulty),
    cookingTime: match.cookingTime,
    servings: match.servings,
    country: match.country,

    ingredientsUsed: Array.isArray(match.usedIngredients) && match.usedIngredients.length > 0 && typeof match.usedIngredients[0] !== 'string' 
      ? match.usedIngredients as RecipeMatchIngredient[]
      : undefined,
    ingredientsMissing: match.missingIngredients,

    steps: match.steps,
    chefTips: [], // RecipeMatch doesn't have chefTips

    canCookNow: match.canCookNow,
    missingIngredientsCount: match.missingCount,

    economy: match.economy
      ? {
          usedFromFridge: true,
          costToComplete: match.economy.costToComplete,
          wasteRiskSaved: match.economy.wasteRiskSaved,
          currency: match.economy.currency,
        }
      : undefined,

    // RecipeMatch doesn't have expiryPriority - can be added later
  };
}

// ========================================
// 🔄 FROM AI GENERATED RECIPE (useAI hook)
// ========================================

/**
 * Convert Recipe from useAI hook to UnifiedRecipeData
 */
export function aiRecipeToUnified(recipe: any): UnifiedRecipeData {
  return {
    id: recipe.id || "",
    title: recipe.title || recipe.name,
    description: recipe.description,

    difficulty: normalizeDifficulty(recipe.difficulty),
    cookingTime: recipe.timeMinutes || recipe.cookingTime,
    servings: recipe.servings || recipe.portions,

    ingredientsUsed: recipe.ingredientsUsed || recipe.ingredients,
    ingredientsMissing: recipe.ingredientsMissing || [],

    steps: recipe.steps,
    chefTips: recipe.chefTips,

    economy: recipe.economy
      ? {
          usedFromFridge: recipe.economy.usedFromFridge ?? true,
          usedValue: recipe.economy.usedValue,
          estimatedExtraCost: recipe.economy.estimatedExtraCost,
          costToComplete: recipe.economy.estimatedExtraCost,
          savedMoney: recipe.economy.savedMoney,
          currency: recipe.economy.currency || "PLN",
        }
      : undefined,

    expiryPriority: recipe.expiryPriority || recipe.expires_priority,
  };
}

// ========================================
// 🛠️ UTILITIES
// ========================================

/**
 * Normalize difficulty levels from different formats
 */
function normalizeDifficulty(
  difficulty?: string
): "easy" | "medium" | "hard" | "beginner" | "intermediate" | "advanced" | undefined {
  if (!difficulty) return undefined;

  const lower = difficulty.toLowerCase();

  // Map various formats
  const mapping: Record<string, "easy" | "medium" | "hard"> = {
    easy: "easy",
    łatwy: "easy",
    prosty: "easy",
    beginner: "easy",
    początkujący: "easy",

    medium: "medium",
    średni: "medium",
    intermediate: "medium",
    średnio: "medium",

    hard: "hard",
    trudny: "hard",
    advanced: "hard",
    zaawansowany: "hard",
  };

  return mapping[lower] || "medium";
}

/**
 * Calculate missing ingredients count if not provided
 */
export function calculateMissingCount(recipe: UnifiedRecipeData): number {
  if (recipe.missingIngredientsCount !== undefined) {
    return recipe.missingIngredientsCount;
  }

  return recipe.ingredientsMissing?.length || 0;
}

/**
 * Determine if recipe can be cooked now
 */
export function canCookRecipe(recipe: UnifiedRecipeData): boolean {
  if (recipe.canCookNow !== undefined) {
    return recipe.canCookNow;
  }

  return calculateMissingCount(recipe) === 0;
}

/**
 * Batch convert array of recipes
 */
export function convertRecipeArray<T>(
  recipes: T[],
  converter: (recipe: T) => UnifiedRecipeData
): UnifiedRecipeData[] {
  return recipes.map(converter);
}
