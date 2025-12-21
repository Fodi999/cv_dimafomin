"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { normalizeRecipe, type NormalizedRecipe } from "@/lib/recipe-normalizer";

// Types
interface UsedProduct {
  name: string;
  usedAmount: number;
  unit: string;
}

interface RecipeState {
  recipe: NormalizedRecipe | null;
  usedProducts: UsedProduct[];
  lastUpdatedAt: number | null;
}

interface RecipeContextType {
  state: RecipeState;
  setRecipe: (data: {
    recipe: any;
    usedProducts?: UsedProduct[];
  }) => void;
  clearRecipe: () => void;
  refreshRecipe: () => Promise<void>;
  isLoading: boolean;
}

// Create context
const RecipeContext = createContext<RecipeContextType | null>(null);

// Provider component
export function RecipeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RecipeState>({
    recipe: null,
    usedProducts: [],
    lastUpdatedAt: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Set recipe (with normalization)
  const setRecipe = useCallback((data: { recipe: any; usedProducts?: UsedProduct[] }) => {
    console.log("🔵 RecipeContext: Setting recipe", data.recipe);
    
    const normalizedRecipe = normalizeRecipe(data.recipe);
    
    setState({
      recipe: normalizedRecipe,
      usedProducts: data.usedProducts || [],
      lastUpdatedAt: Date.now(),
    });

    console.log("✅ RecipeContext: Recipe set", {
      title: normalizedRecipe.title,
      economy: normalizedRecipe.economy,
      ingredientsUsed: normalizedRecipe.ingredientsUsed.length,
      ingredientsMissing: normalizedRecipe.ingredientsMissing.length,
    });
  }, []);

  // Clear recipe
  const clearRecipe = useCallback(() => {
    console.log("🗑️ RecipeContext: Clearing recipe");
    setState({
      recipe: null,
      usedProducts: [],
      lastUpdatedAt: null,
    });
  }, []);

  // Refresh recipe (recalculate economy after fridge changes)
  const refreshRecipe = useCallback(async () => {
    if (!state.recipe) {
      console.warn("⚠️ RecipeContext: No recipe to refresh");
      return;
    }

    console.log("🔄 RecipeContext: Refreshing recipe economy");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token for refresh");
        return;
      }

      // Call backend to recalculate economy for existing recipe
      const res = await fetch("/api/ai/recalculate-recipe-economy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipeId: state.recipe.title, // or use actual ID if available
          ingredients: state.recipe.ingredientsUsed,
        }),
      });

      if (!res.ok) {
        console.error("❌ Failed to refresh recipe");
        return;
      }

      const data = await res.json();
      
      if (data.success && data.data?.economy) {
        // Update only economy, keep recipe intact
        setState(prev => ({
          ...prev,
          recipe: prev.recipe ? {
            ...prev.recipe,
            economy: normalizeRecipe({ economy: data.data.economy }).economy,
          } : null,
          lastUpdatedAt: Date.now(),
        }));

        console.log("✅ RecipeContext: Economy refreshed", data.data.economy);
      }
    } catch (err) {
      console.error("❌ RecipeContext: Refresh error", err);
    } finally {
      setIsLoading(false);
    }
  }, [state.recipe]);

  return (
    <RecipeContext.Provider
      value={{
        state,
        setRecipe,
        clearRecipe,
        refreshRecipe,
        isLoading,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

// Hook to use recipe context
export function useRecipe() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipe must be used within RecipeProvider");
  }
  return context;
}
