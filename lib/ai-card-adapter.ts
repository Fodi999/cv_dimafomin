/**
 * 🔄 Adapter for converting backend data to UnifiedAICard format
 * 
 * This file provides helper functions to transform:
 * - RecipeMatch (from backend) → UnifiedAICard props
 * - AI response codes → UnifiedAICard props
 * 
 * Usage:
 * ```tsx
 * const cardProps = recipeToAICard(recipeMatch, {
 *   onCook: handleCook,
 *   onSave: handleSave,
 *   isCooking: loading,
 * });
 * 
 * <UnifiedAICard {...cardProps} />
 * ```
 */

import type { RecipeMatch } from "@/lib/api";
import { ChefHat, Save, ShoppingCart, RotateCw } from "lucide-react";

type AICardProps = {
  type: "recipe" | "message";
  header: {
    title: string;
    description?: string;
    status?: {
      emoji: string;
      text: string;
      color: string;
    };
    level?: "info" | "warning" | "error" | "success";
  };
  context?: any;
  actions?: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<any>;
    variant?: "primary" | "secondary" | "danger";
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
  }>;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
};

/**
 * Determine recipe status based on availability
 */
function getRecipeStatus(recipe: RecipeMatch) {
  if (recipe.canCookNow) {
    return {
      emoji: "🟢",
      text: "Możesz ugotować teraz",
      color:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    };
  } else if (recipe.missingCount <= 2) {
    return {
      emoji: "🟡",
      text: `Brakuje ${recipe.missingCount} składników`,
      color:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    };
  } else {
    return {
      emoji: "🔴",
      text: `Brakuje ${recipe.missingCount} składników`,
      color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    };
  }
}

/**
 * Convert RecipeMatch to UnifiedAICard props
 */
export function recipeToAICard(
  recipe: RecipeMatch,
  handlers: {
    onCook: (servingsMultiplier: number) => void;
    onSave: () => void;
    onAddToCart?: () => void;
    onRefresh?: () => void;
    isCooking?: boolean;
    isSaving?: boolean;
    weeklyBudget?: number;
  }
): AICardProps {
  const status = getRecipeStatus(recipe);

  // Build actions array
  const actions: AICardProps["actions"] = [];

  // PRIMARY: Cook button
  actions.push({
    id: "cook",
    label: "Ugotuj",
    icon: ChefHat,
    variant: "primary",
    loading: handlers.isCooking,
    onClick: () => handlers.onCook(1), // Default servings multiplier
  });

  // PRIMARY: Add to cart (if missing ingredients)
  if (
    handlers.onAddToCart &&
    recipe.missingIngredients &&
    recipe.missingIngredients.length > 0
  ) {
    actions.push({
      id: "add-to-cart",
      label: "Dodaj do zakupów",
      icon: ShoppingCart,
      variant: "danger",
      onClick: handlers.onAddToCart,
    });
  }

  // SECONDARY: Save
  actions.push({
    id: "save",
    label: "Zapisz",
    icon: Save,
    variant: "secondary",
    loading: handlers.isSaving,
    onClick: handlers.onSave,
  });

  // SECONDARY: Refresh
  if (handlers.onRefresh) {
    actions.push({
      id: "refresh",
      label: "Odśwież",
      icon: RotateCw,
      variant: "secondary",
      onClick: handlers.onRefresh,
    });
  }

  return {
    type: "recipe",
    header: {
      // ✅ Backend returns localized localName based on Accept-Language
      title: recipe.localName || recipe.canonicalName,
      description: recipe.description,
      status,
    },
    context: {
      servings: recipe.servings,
      cookingTime: recipe.cookingTime,
      coverage: recipe.coverage,
      usedIngredients: recipe.usedIngredients,
      missingIngredients: recipe.missingIngredients,
      steps: recipe.steps,
      economy: recipe.economy,
      weeklyBudget: handlers.weeklyBudget,
    },
    actions,
  };
}

/**
 * Convert AI response code to UnifiedAICard props
 */
export function messageToAICard(
  code: string,
  context?: Record<string, any>,
  handlers?: {
    onAction?: (actionId: string) => void;
    onDismiss?: () => void;
  }
): AICardProps {
  // This is a simplified version - ideally connect to your i18n/pl/ai.ts
  // For now, just return basic structure
  
  const messageMap: Record<
    string,
    {
      title: string;
      description: string;
      level: "info" | "warning" | "error" | "success";
    }
  > = {
    NO_RECIPES_FOR_FRIDGE: {
      title: "Brak przepisów dla Twojej lodówki",
      description:
        "Nie znaleziono przepisów pasujących do produktów w lodówce. Spróbuj dodać więcej produktów lub poszukaj nowych przepisów.",
      level: "warning",
    },
    RECIPE_SAVED: {
      title: "Przepis zapisany!",
      description: "Przepis został dodany do Twoich zapisanych przepisów.",
      level: "success",
    },
    COOKING_SUCCESS: {
      title: "Ugotowano!",
      description:
        "Przepis został oznaczony jako ugotowany. Produkty zostały odjęte z lodówki.",
      level: "success",
    },
    INSUFFICIENT_BUDGET: {
      title: "Przekroczony budżet",
      description:
        "Ten przepis przekracza Twój tygodniowy budżet. Rozważ tańszą alternatywę.",
      level: "warning",
    },
  };

  const message = messageMap[code] || {
    title: "Komunikat AI",
    description: "Otrzymano komunikat od asystenta AI.",
    level: "info" as const,
  };

  return {
    type: "message",
    header: {
      title: message.title,
      description: message.description,
      level: message.level,
    },
    context,
    dismissible: true,
    onDismiss: handlers?.onDismiss,
  };
}
