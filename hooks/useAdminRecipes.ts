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
  imageUrl?: string | null; // ← ДОБАВЛЕНО: URL изображения из Cloudinary
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
    ingredient?: { // ✅ Nested ingredient object from backend
      id?: string;
      name?: string;
      namePl?: string;
      nameEn?: string;
      nameRu?: string;
      unit?: string;
      category?: string;
      nutritionGroup?: string;
      usageCount?: number;
      autoTranslated?: boolean;
    };
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
  stepsPl?: string | string[]; // ✅ Language-specific steps (can be string or array)
  stepsEn?: string | string[]; // ✅ Language-specific steps
  stepsRu?: string | string[]; // ✅ Language-specific steps
  nutritionProfile?: {
    type?: string;
    calories?: number;
    protein?: number; // ✅ Protein in grams
    fat?: number; // ✅ Fat in grams
    carbohydrate?: number; // ✅ Carbohydrates in grams
  };
  source?: {
    type?: string;
    reference?: string;
    generator?: string; // ✅ AI generator name (e.g., 'groq-llama-3.3-70b')
    authorId?: string; // ✅ Author ID
    timestamp?: number; // ✅ Creation timestamp
  };
  cookingTime?: number;
  portions?: number;
  createdAt?: string;
  updatedAt?: string;
  imagePublicId?: string; // ✅ Cloudinary public ID
}

export interface RecipesFilters {
  search: string;
  cuisine: string; // 'all' | 'italian' | 'japanese' | 'ukrainian' | etc.
  difficulty: string; // 'all' | 'easy' | 'medium' | 'hard'
  status: string; // 'all' | 'draft' | 'published' | 'archived'
  sortBy?: string; // 'created_at' | 'title' | 'cooking_time' | 'views'
  sortOrder?: 'asc' | 'desc'; // ascending or descending
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
    sortBy: "created_at",
    sortOrder: "desc",
    page: 1,
    limit: 12, // 12 рецептов на страницу для удобной пагинации
  });
  
  // Separate state for debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [filters.search]);

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();
      
      // Use debounced search value
      if (debouncedSearch) queryParams.append("search", debouncedSearch);
      if (filters.cuisine !== "all") queryParams.append("cuisine", filters.cuisine);
      if (filters.difficulty !== "all") queryParams.append("difficulty", filters.difficulty);
      if (filters.status !== "all") queryParams.append("status", filters.status);
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);
      queryParams.append("page", filters.page.toString());
      queryParams.append("limit", filters.limit.toString());

      const url = `/api/admin/recipes?${queryParams.toString()}`;

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
      
      // Map snake_case to camelCase and normalize field names
      const mappedRecipes = recipesArray.map((recipe: any) => ({
        ...recipe,
        // Image URL mapping - backend returns "imageUrl"
        imageUrl: recipe.imageUrl || recipe.image_url || recipe.imagePublicId || null,
        // Cooking time mapping - backend returns "timeMinutes"
        cooking_time: recipe.timeMinutes || recipe.cooking_time || recipe.cookingTime || recipe.time_minutes || 0,
        // Created/Updated dates
        created_at: recipe.createdAt || recipe.created_at,
        updated_at: recipe.updatedAt || recipe.updated_at,
      }));
      
      setRecipes(mappedRecipes);
      setMeta(data.meta || null);
    } catch (error) {
      console.error("[useAdminRecipes] Error:", error);
      toast.error("Помилка завантаження рецептів");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, filters.cuisine, filters.difficulty, filters.status, filters.sortBy, filters.sortOrder, filters.page, filters.limit]);

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
