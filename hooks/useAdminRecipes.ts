import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  difficulty: "easy" | "medium" | "hard";
  status: "draft" | "published" | "archived";
  cooking_time: number; // minutes
  servings: number;
  portionWeightGrams?: number; // вес одной порции в граммах
  ingredients: Array<{
    id?: string;
    ingredient_id?: string;
    ingredientId?: string;
    ingredientKey?: string;
    name?: string;
    ingredientName?: string;
    namePl?: string;
    nameEn?: string;
    nameRu?: string;
    amount?: number;
    quantity?: number;
    unit?: string;
    optional?: boolean;
    sortOrder?: number;
    inFridge?: boolean;
    fridgeQuantity?: number | null;
  }>;
  steps?: Array<{
    stepNumber?: number;
    description?: string;
    instruction?: string;
    text?: string;
    duration?: number;
  }>;
  image_url?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  views?: number;
  viewsCount?: number;
  saves?: number;
  created_at?: string;
  updated_at?: string;
  // Backend fields (camelCase) - from PostgreSQL
  canonicalName?: string;
  localName?: string;
  namePl?: string;
  nameEn?: string;
  nameUk?: string;
  nameRu?: string;
  descriptionPl?: string;
  descriptionEn?: string;
  descriptionRu?: string;
  country?: string;
  region?: string;
  category?: string;
  timeMinutes?: number;
  stepsPl?: string[];
  nutritionProfile?: {
    type?: string;
    calories?: number;
  };
  source?: {
    type?: string;
    reference?: string;
  };
  cookingTime?: number;
  portions?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecipesFilters {
  search: string;
  cuisine: string; // 'all' | 'italian' | 'japanese' | 'ukrainian' | etc.
  difficulty: string; // 'all' | 'easy' | 'medium' | 'hard'
  status: string; // 'all' | 'draft' | 'published' | 'archived'
  page: number;
  limit: number;
}

export interface RecipesMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Хук для получения списка рецептов (админ)
 */
export function useAdminRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [meta, setMeta] = useState<RecipesMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<RecipesFilters>({
    search: "",
    cuisine: "all",
    difficulty: "all",
    status: "all",
    page: 1,
    limit: 50,
  });

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.cuisine !== "all") queryParams.append("cuisine", filters.cuisine);
      if (filters.difficulty !== "all") queryParams.append("difficulty", filters.difficulty);
      if (filters.status !== "all") queryParams.append("status", filters.status);
      queryParams.append("page", filters.page.toString());
      queryParams.append("limit", filters.limit.toString());

      const url = `/api/admin/recipes?${queryParams.toString()}`;
      console.log('[useAdminRecipes] Fetching from:', url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[useAdminRecipes] Error response:', errorText);
        throw new Error(`Failed to fetch recipes: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      // Ensure we always set an array
      const recipesArray = Array.isArray(data.data) 
        ? data.data 
        : Array.isArray(data.recipes) 
          ? data.recipes 
          : [];
      
      setRecipes(recipesArray);
      setMeta(data.meta || null);
    } catch (error) {
      console.error("[useAdminRecipes] Error:", error);
      toast.error("Помилка завантаження рецептів");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const updateFilters = (newFilters: Partial<RecipesFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const refetch = () => {
    fetchRecipes();
  };

  return {
    recipes,
    meta,
    isLoading,
    filters,
    updateFilters,
    refetch,
  };
}

/**
 * Хук для действий с рецептами (создание, обновление, удаление)
 */
export function useAdminRecipeActions() {
  const createRecipe = async (recipeData: Omit<Recipe, "id">): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/recipes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        throw new Error("Failed to create recipe");
      }

      toast.success("Рецепт створено");
      return true;
    } catch (error) {
      console.error("[useAdminRecipeActions] Create error:", error);
      toast.error("Помилка створення рецепта");
      return false;
    }
  };

  const updateRecipe = async (id: string, recipeData: Partial<Recipe>): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/recipes/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        throw new Error("Failed to update recipe");
      }

      toast.success("Рецепт оновлено");
      return true;
    } catch (error) {
      console.error("[useAdminRecipeActions] Update error:", error);
      toast.error("Помилка оновлення рецепта");
      return false;
    }
  };

  const deleteRecipe = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      toast.success("Рецепт видалено");
      return true;
    } catch (error) {
      console.error("[useAdminRecipeActions] Delete error:", error);
      toast.error("Помилка видалення рецепта");
      return false;
    }
  };

  return {
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
}
