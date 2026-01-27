"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChefHat,
  Loader2,
  Zap,
  Check,
  X,
  Clock,
  Users,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface IngredientInfo {
  id: string;
  canonical_name: string;
  display_name: string;
  quantity: number;
  unit: string;
  category: string;
}

interface RecipeRecommendation {
  id: string;
  title: string;
  canonical_name: string;
  image_url: string;
  cook_time: number;
  servings: number;
  match_percent: number;
  match_status: "ready" | "almost_ready" | "not_ready";
  available_ingredients: IngredientInfo[];
  missing_ingredients: IngredientInfo[];
  steps: string[];
}

interface RecommendationResponse {
  decision: "ready" | "almost_ready" | "not_ready";
  summary: string;
  total_matches: number;
  recipes: RecipeRecommendation[];
}

const labels = {
  ru: {
    title: "🍳 Рецепты из вашего холодильника",
    description: "Подобранные рецепты на основе доступных ингредиентов",
    loading: "Загрузка рецептов...",
    ready: "Готово к приготовлению!",
    almostReady: "Почти готово",
    notReady: "Нужны ингредиенты",
    available: "Есть в холодильнике",
    missing: "Не хватает",
    cookTime: "Время приготовления",
    servings: "Порции",
    selectRecipe: "Выбрать рецепт",
    noRecipes: "Рецепты не найдены",
  },
  en: {
    title: "🍳 Recipes from Your Fridge",
    description: "Recommended recipes based on available ingredients",
    loading: "Loading recipes...",
    ready: "Ready to cook!",
    almostReady: "Almost ready",
    notReady: "Need ingredients",
    available: "In your fridge",
    missing: "Missing",
    cookTime: "Cook time",
    servings: "Servings",
    selectRecipe: "Select Recipe",
    noRecipes: "No recipes found",
  },
  pl: {
    title: "🍳 Przepisy z Twojej lodówki",
    description: "Przepisy dobrane na podstawie dostępnych składników",
    loading: "Ładowanie przepisów...",
    ready: "Gotowe do gotowania!",
    almostReady: "Prawie gotowe",
    notReady: "Potrzebne składniki",
    available: "W twojej lodówce",
    missing: "Brakuje",
    cookTime: "Czas gotowania",
    servings: "Porcje",
    selectRecipe: "Wybierz przepis",
    noRecipes: "Nie znaleziono przepisów",
  },
};

export function RecipeRecommendationsList() {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        // 🟢 ВАРИАНТ 1: Ходим напрямую в Go backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("API_URL not configured");
        }

        const response = await fetch(
          `${apiUrl}/api/recipe-recommendations?lang=${language}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch recommendations: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(err instanceof Error ? err.message : "Failed to load recipes");
        toast.error(
          language === "ru"
            ? "Ошибка загрузки рецептов"
            : "Failed to load recipes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [language]);

  const t = labels[language as keyof typeof labels] || labels.en;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800";
      case "almost_ready":
        return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-500/20 text-green-700 dark:text-green-300";
      case "almost_ready":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300";
      default:
        return "bg-red-500/20 text-red-700 dark:text-red-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ready":
        return t.ready;
      case "almost_ready":
        return t.almostReady;
      default:
        return t.notReady;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">{t.loading}</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300">{error || "No data"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data.recipes || data.recipes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t.noRecipes}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          {t.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{data.summary}</p>
        <div className="mt-4 flex items-center gap-2">
          <Badge variant="outline">
            <Zap className="w-3 h-3 mr-1" />
            {data.total_matches} {t.available}
          </Badge>
        </div>
      </motion.div>

      {/* Recipes Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {data.recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Card className={`h-full overflow-hidden border-2 ${getStatusColor(recipe.match_status)}`}>
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700 group">
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://via.placeholder.com/300x200?text=" +
                      encodeURIComponent(recipe.title);
                  }}
                />

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusBadgeColor(recipe.match_status)}>
                    {recipe.match_percent.toFixed(0)}%
                  </Badge>
                </div>

                {/* Ready Indicator */}
                {recipe.match_status === "ready" && (
                  <div className="absolute top-2 left-2 bg-green-500/80 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {t.ready}
                  </div>
                )}
              </div>

              <CardHeader>
                <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
                <CardDescription className="text-xs">{recipe.canonical_name}</CardDescription>

                {/* Meta Info */}
                <div className="flex gap-4 mt-3 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {recipe.cook_time} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {recipe.servings} {t.servings}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Available Ingredients */}
                {recipe.available_ingredients.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Check className="w-4 h-4" />
                      {t.available}
                    </h4>
                    <div className="space-y-1">
                      {recipe.available_ingredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1"
                        >
                          ✓ {ing.display_name} ({ing.quantity} {ing.unit})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Ingredients */}
                {recipe.missing_ingredients.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-red-600 dark:text-red-400">
                      <X className="w-4 h-4" />
                      {t.missing}
                    </h4>
                    <div className="space-y-1">
                      {recipe.missing_ingredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1"
                        >
                          ✗ {ing.display_name} ({ing.quantity} {ing.unit})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button
                  onClick={() => router.push(`/admin/dishes/new/${recipe.id}`)}
                  className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {t.selectRecipe}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
