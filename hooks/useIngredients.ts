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
  category: string;
  unit: string;
  usageCount?: number; // Сколько рецептов используют
  createdAt?: string;
  updatedAt?: string;
}

export interface IngredientsFilters {
  search: string;
  category: string;
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
    page: 1,
    limit: 50,
  });

  const fetchIngredients = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const language = localStorage.getItem("language") || "pl";
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append("search", filters.search);
      if (filters.category !== "all") queryParams.append("category", filters.category);
      queryParams.append("page", filters.page.toString());
      queryParams.append("limit", filters.limit.toString());

      const url = `/api/admin/ingredients?${queryParams.toString()}`;
      console.log('[useIngredients] Fetching from:', url, 'with filters:', filters);

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
      console.log('[useIngredients] API response:', data);
      console.log('[useIngredients] First ingredient sample:', data.data?.[0]);
      
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
  }, [filters]);

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
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/ingredients/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete ingredient");
      }

      toast.success("Інгредієнт видалено");
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
