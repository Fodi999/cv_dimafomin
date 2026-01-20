import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface Ingredient {
  id: string;
  name: string; // Fallback name (usually Polish)
  // Snake_case format (from backend)
  name_pl?: string; // Polish name
  name_en?: string; // English name
  name_ru?: string; // Russian name
  // CamelCase format (alternative)
  namePl?: string;
  nameEn?: string;
  nameRu?: string;
  category: string; // Кулинарная категория (fish, meat, vegetable, etc.)
  nutritionGroup?: string; // Нутриентная группа (protein, carbohydrate, fat, etc.)
  unit: string;
  usageCount?: number; // Сколько рецептов используют
  createdAt?: string;
  updatedAt?: string;
}

export interface IngredientsFilters {
  search: string;
  category: string;
  sort?: string; // ✅ Sort option: "newest" (default), "name", "usage"
  page: number;
  limit: number;
}

export interface IngredientsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Хук для получения списка ингредиентов с фильтрацией
 */
export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [meta, setMeta] = useState<IngredientsMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<IngredientsFilters>({
    search: "",
    category: "all",
    sort: "newest", // ✅ Default: newest first (ORDER BY createdAt DESC)
    page: 1,
    limit: 12, // ✅ Changed from 50 to 12 for better pagination
  });

  const fetchIngredients = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const language = localStorage.getItem("language") || "pl";
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.category !== "all") queryParams.append("category", filters.category);
      if (filters.sort) queryParams.append("sort", filters.sort); // ✅ Pass sort to backend
      queryParams.append("page", filters.page.toString());
      queryParams.append("limit", filters.limit.toString());

      const url = `/api/admin/ingredients?${queryParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept-Language": language,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ingredients");
      }

      const data = await response.json();
      
      // Ensure we always set an array
      const ingredientsList = data.data || data.ingredients || [];
      setIngredients(Array.isArray(ingredientsList) ? ingredientsList : []);
      setMeta(data.meta || null);
    } catch (error) {
      console.error("[useIngredients] Error:", error);
      toast.error("Помилка завантаження інгредієнтів");
    } finally {
      setIsLoading(false);
    }
  }, [filters.search, filters.category, filters.sort, filters.page, filters.limit]);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const updateFilters = (newFilters: Partial<IngredientsFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    ingredients,
    meta,
    isLoading,
    filters,
    updateFilters,
    refetch: fetchIngredients,
  };
}

/**
 * Хук для поиска ингредиентов (autocomplete)
 */
export function useIngredientsSearch(query: string) {
  const [results, setResults] = useState<Ingredient[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchIngredients = async () => {
      setIsSearching(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `/api/admin/ingredients?search=${encodeURIComponent(query)}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = await response.json();
        setResults(data.ingredients || []);
      } catch (error) {
        console.error("[useIngredientsSearch] Error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchIngredients, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, isSearching };
}

/**
 * Хук для действий с ингредиентами (создание, обновление, удаление)
 */
export function useIngredientActions() {
  const createIngredient = async (data: Omit<Ingredient, "id">): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/ingredients", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create ingredient");
      }

      toast.success("Інгредієнт створено");
      return true;
    } catch (error) {
      console.error("[createIngredient] Error:", error);
      toast.error(error instanceof Error ? error.message : "Помилка створення інгредієнта");
      return false;
    }
  };

  const updateIngredient = async (id: string, data: Partial<Ingredient>): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/ingredients/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update ingredient");
      }

      toast.success("Інгредієнт оновлено");
      return true;
    } catch (error) {
      console.error("[updateIngredient] Error:", error);
      toast.error("Помилка оновлення інгредієнта");
      return false;
    }
  };

  const deleteIngredient = async (id: string): Promise<boolean> => {
    try {
      console.log('[deleteIngredient] Deleting ingredient:', id);
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/ingredients/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log('[deleteIngredient] Response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.log('[deleteIngredient] Error response:', data);
        
        // Handle 409 Conflict - ingredient used in recipes
        if (response.status === 409) {
          const errorMsg = data.error || data.message || "Неможливо видалити інгредієнт";
          
          // Extract recipe count if available
          const match = errorMsg.match(/used in (\d+) recipes?/i);
          const recipeCount = match ? match[1] : null;
          
          if (recipeCount) {
            toast.error(`Неможливо видалити: використовується в ${recipeCount} рецептах`, {
              duration: 5000,
            });
          } else {
            toast.error("Інгредієнт використовується в рецептах і не може бути видалений", {
              duration: 5000,
            });
          }
          return false;
        }
        
        // Handle 404 Not Found
        if (response.status === 404) {
          toast.error("Інгредієнт не знайдено");
          return false;
        }
        
        // Generic error with detailed message
        const errorMessage = data.error || data.message || "Failed to delete ingredient";
        console.error('[deleteIngredient] Error:', errorMessage);
        toast.error(`Помилка: ${errorMessage}`);
        return false;
      }

      console.log('[deleteIngredient] Success');
      toast.success("Інгредієнт видалено успішно");
      return true;
    } catch (error) {
      console.error("[deleteIngredient] Error:", error);
      toast.error("Помилка видалення інгредієнта");
      return false;
    }
  };

  return {
    createIngredient,
    updateIngredient,
    deleteIngredient,
  };
}
