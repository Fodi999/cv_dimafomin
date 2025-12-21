"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
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

// LocalStorage key
const STORAGE_KEY = "sushi_chef_recipe";

// Create context
const RecipeContext = createContext<RecipeContextType | null>(null);

// Provider component
export function RecipeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RecipeState>(() => {
    // 🔄 Initialize from localStorage on mount
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          console.log("🔄 RecipeContext: Restored from localStorage", parsed.recipe?.title);
          return parsed;
        }
      } catch (err) {
        console.error("❌ RecipeContext: Failed to restore from localStorage", err);
      }
    }
    return {
      recipe: null,
      usedProducts: [],
      lastUpdatedAt: null,
    };
  });
  const [isLoading, setIsLoading] = useState(false);

  // 💾 Save to localStorage whenever state changes
  useEffect(() => {
    if (state.recipe) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        console.log("💾 RecipeContext: Saved to localStorage");
      } catch (err) {
        console.error("❌ RecipeContext: Failed to save to localStorage", err);
      }
    } else {
      // Clear storage when recipe is null
      localStorage.removeItem(STORAGE_KEY);
      console.log("🗑️ RecipeContext: Cleared localStorage");
    }
  }, [state]);

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
        const status = res.status;
        const errorText = await res.text();
        console.warn(`⚠️ Failed to refresh recipe (${status}): ${errorText}`);
        console.warn("   This is not critical - backend endpoint may not be implemented yet");
        console.warn("   User can still use the recipe with original economy data");
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
      } else {
        console.warn("⚠️ Backend returned success but no economy data");
      }
    } catch (err) {
      console.warn("⚠️ RecipeContext: Refresh error (non-critical):", err);
      console.warn("   User can continue with original economy data");
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
