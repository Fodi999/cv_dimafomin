import { useState, useEffect } from "react";

export interface MarketRecipe {
  id: string;
  title: string;
  type: "course" | "recipe";
  level: "beginner" | "intermediate" | "advanced";
  rating: number;
  reviews: number;
  priceCT: number;
  image: string;
  owned: boolean;
  description?: string;
  author?: string;
}

export interface UseMarketRecipesReturn {
  data: MarketRecipe[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMarketRecipes(): UseMarketRecipesReturn {
  const [data, setData] = useState<MarketRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Brak tokenu autoryzacji");
      }

      const response = await fetch("/api/market/recipes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Błąd podczas ładowania przepisów");
      }

      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setData(result.data);
      } else {
        throw new Error("Nieprawidłowa struktura danych");
      }
    } catch (err: any) {
      console.error("useMarketRecipes error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchRecipes,
  };
}
