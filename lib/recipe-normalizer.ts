/**
 * Recipe Normalizer - единая точка преобразования данных от backend
 * Решает проблему разных форматов (ingredients vs ingredientsUsed)
 */

export interface NormalizedRecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface NormalizedRecipeEconomy {
  usedFromFridge: boolean;
  usedValue?: number;
  estimatedExtraCost: number;
  savedMoney?: number;
  currency: string;
}

export interface NormalizedRecipe {
  title: string;
  description: string;
  ingredientsUsed: NormalizedRecipeIngredient[];
  ingredientsMissing: NormalizedRecipeIngredient[];
  steps: string[];
  cookingTime: number;
  servings: number;
  expiryPriority?: 'critical' | 'warning' | 'ok';
  economy: NormalizedRecipeEconomy;
  chefTips: string[];
  difficulty?: string;
}

/**
 * Нормализует рецепт от backend к единому формату
 * Поддерживает старый формат (ingredients) и новый (ingredientsUsed)
 */
export function normalizeRecipe(apiRecipe: any): NormalizedRecipe {
  // Нормализуем economy (backend может вернуть null или неполный объект)
  const economy: NormalizedRecipeEconomy = {
    usedFromFridge: apiRecipe.economy?.usedFromFridge ?? true,
    usedValue: apiRecipe.economy?.usedValue ?? apiRecipe.economy?.used_value,
    estimatedExtraCost: apiRecipe.economy?.estimatedExtraCost ?? apiRecipe.economy?.estimated_extra_cost ?? 0,
    savedMoney: apiRecipe.economy?.savedMoney ?? apiRecipe.economy?.saved_money,
    currency: apiRecipe.economy?.currency ?? 'PLN',
  };

  return {
    title: apiRecipe.title || apiRecipe.name || 'Przepis z AI',
    description: apiRecipe.description || '',
    // 🔑 KEY: старый формат (ingredients) → новый (ingredientsUsed)
    ingredientsUsed: apiRecipe.ingredientsUsed || apiRecipe.ingredients || [],
    ingredientsMissing: apiRecipe.ingredientsMissing || [],
    steps: apiRecipe.steps || [],
    cookingTime: apiRecipe.timeMinutes || apiRecipe.cookingTime || 0,
    servings: apiRecipe.servings || apiRecipe.portions || 1,
    expiryPriority: apiRecipe.expiryPriority || apiRecipe.expires_priority,
    economy,
    chefTips: apiRecipe.chefTips || [],
    difficulty: apiRecipe.difficulty || 'średni',
  };
}
