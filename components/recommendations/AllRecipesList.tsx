"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChefHat,
  Loader2,
  Clock,
  Users,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  Flame,
  Leaf,
  X,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface Recipe {
  id: string;
  title: string;
  canonical_name: string;
  description?: string;
  image_url?: string;
  cook_time?: number;
  servings?: number;
  difficulty?: "easy" | "medium" | "hard";
  category?: string;
  tags?: string[];
  diet_tags?: string[]; // vegetarian, vegan, etc.
  allergens?: string[]; // dairy, nuts, etc.
}

interface AllRecipesListProps {
  defaultCategory?: string;
  defaultDietTag?: string;
}

const labels = {
  ru: {
    title: "Все рецепты",
    description: "Полный каталог рецептов с фильтрами",
    searchPlaceholder: "Поиск по названию...",
    selectButton: "Выбрать рецепт",
    noRecipes: "Рецепты не найдены",
    loading: "Загрузка рецептов...",
    loadMore: "Показать еще",
    error: "Ошибка загрузки",
    
    filters: "Фильтры",
    categories: "Категория",
    difficulty: "Сложность",
    time: "Время",
    diet: "Диета",
    allergens: "Аллергены",
    resetFilters: "Очистить фильтры",
    
    easy: "Легко",
    medium: "Средне",
    hard: "Сложно",
    
    vegetarian: "Вегетарианское",
    vegan: "Веган",
    glutenFree: "Без глютена",
    
    cookTime: "Время приготовления",
    servings: "Порции",
    
    minutesShort: "мин",
  },
  en: {
    title: "All Recipes",
    description: "Complete recipe catalog with filters",
    searchPlaceholder: "Search by name...",
    selectButton: "Select Recipe",
    noRecipes: "No recipes found",
    loading: "Loading recipes...",
    loadMore: "Show More",
    error: "Load error",
    
    filters: "Filters",
    categories: "Category",
    difficulty: "Difficulty",
    time: "Time",
    diet: "Diet",
    allergens: "Allergens",
    resetFilters: "Clear Filters",
    
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    glutenFree: "Gluten Free",
    
    cookTime: "Cook Time",
    servings: "Servings",
    
    minutesShort: "min",
  },
  pl: {
    title: "Wszystkie przepisy",
    description: "Kompletny katalog przepisów z filtrami",
    searchPlaceholder: "Szukaj po nazwie...",
    selectButton: "Wybierz przepis",
    noRecipes: "Nie znaleziono przepisów",
    loading: "Ładowanie przepisów...",
    loadMore: "Pokaż więcej",
    error: "Błąd ładowania",
    
    filters: "Filtry",
    categories: "Kategoria",
    difficulty: "Trudność",
    time: "Czas",
    diet: "Dieta",
    allergens: "Alergeny",
    resetFilters: "Wyczyść filtry",
    
    easy: "Łatwo",
    medium: "Średnio",
    hard: "Trudno",
    
    vegetarian: "Wegetariańskie",
    vegan: "Weganskie",
    glutenFree: "Bez glutenu",
    
    cookTime: "Czas gotowania",
    servings: "Porcje",
    
    minutesShort: "min",
  },
};

// Cache management
const CACHE_KEY = "recipes_cache";
const CACHE_DURATION = 3600000; // 1 hour in ms

interface CachedRecipes {
  data: Recipe[];
  timestamp: number;
}

export function AllRecipesList({ defaultCategory, defaultDietTag }: AllRecipesListProps) {
  const router = useRouter();
  const { language } = useLanguage();
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory || "");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [maxCookTime, setMaxCookTime] = useState("");
  const [selectedDietTag, setSelectedDietTag] = useState(defaultDietTag || "");
  const [excludeAllergens, setExcludeAllergens] = useState("");
  const [showFilters, setShowFilters] = useState(true); // ✅ Show filters by default
  
  // Data & Loading
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(12); // Pagination
  
  // Cache
  const cacheRef = useRef<CachedRecipes | null>(null);

  const t = labels[language as keyof typeof labels] || labels.en;

  // Load recipes with caching
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        console.log("🔄 AllRecipesList: Fetch started");
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log("   Token available:", !!token);

        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        console.log("   Cached data exists:", !!cached);
        if (cached) {
          const parsedCache = JSON.parse(cached) as CachedRecipes;
          const now = Date.now();
          const age = now - parsedCache.timestamp;
          const isValid = age < CACHE_DURATION;
          const hasData = Array.isArray(parsedCache.data) && parsedCache.data.length > 0;
          console.log(`   Cache age: ${(age / 1000).toFixed(1)}s, Valid: ${isValid}, Data count: ${parsedCache.data.length}`);
          
          // ✅ ИСПРАВЛЕНИЕ №1: Кэш валиден ТОЛЬКО если есть реальные данные
          const hasValidCache = isValid && hasData;
          
          if (hasValidCache) {
            console.log("   ✅ Using cached recipes:", parsedCache.data.length);
            setAllRecipes(parsedCache.data);
            setFilteredRecipes(parsedCache.data);
            cacheRef.current = parsedCache;
            setLoading(false);
            return;
          } else {
            console.log("   🚨 Cache ignored:", { isValid, hasData, reason: !isValid ? "expired" : "empty" });
          }
        }

        console.log("   📡 Fetching from /api/recipes...");
        // Fetch from Next.js API route (which proxies to Go backend)
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        
        // Add token if available
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(
          `/api/recipes?lang=${language}&limit=1000`,
          {
            headers,
          }
        );

        console.log("   Response status:", response.status);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Recipes endpoint not found");
          } else if (response.status === 500) {
            throw new Error("Server error");
          }
          throw new Error(`Failed to fetch recipes: ${response.status}`);
        }

        const result = await response.json();
        console.log("🍱 API Response:", result);
        
        // Handle both formats: { recipes: [...] } and { data: [...] }
        const recipes = result.recipes || result.data || [];
        console.log("📊 Extracted recipes count:", recipes.length);
        
        // Ensure we have data
        if (!Array.isArray(recipes)) {
          console.error("❌ Recipes is not an array:", typeof recipes, recipes);
          throw new Error("Invalid recipes format");
        }

        // Cache the data
        const cacheData: CachedRecipes = {
          data: recipes,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        cacheRef.current = cacheData;
        console.log("✅ Cache updated with", recipes.length, "recipes");

        setAllRecipes(recipes);
        setFilteredRecipes(recipes);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching recipes:", err);
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

    fetchRecipes();
  }, [language]);

  // Apply filters and search
  useEffect(() => {
    console.log("🔍 Applying filters...");
    console.log("   All recipes:", allRecipes.length);
    console.log("   Filters:", {
      searchTerm,
      selectedCategory,
      selectedDifficulty,
      maxCookTime,
      selectedDietTag,
      excludeAllergens,
    });

    let filtered = allRecipes;

    // Search by title
    if (searchTerm) {
      const before = filtered.length;
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.canonical_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(`   Search "${searchTerm}": ${before} → ${filtered.length}`);
    }

    // Filter by category
    if (selectedCategory) {
      const before = filtered.length;
      filtered = filtered.filter((recipe) =>
        recipe.category === selectedCategory
      );
      console.log(`   Category "${selectedCategory}": ${before} → ${filtered.length}`);
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      const before = filtered.length;
      filtered = filtered.filter((recipe) =>
        recipe.difficulty === selectedDifficulty
      );
      console.log(`   Difficulty "${selectedDifficulty}": ${before} → ${filtered.length}`);
    }

    // Filter by max cook time
    if (maxCookTime) {
      const before = filtered.length;
      const maxTime = parseInt(maxCookTime);
      filtered = filtered.filter((recipe) =>
        recipe.cook_time && recipe.cook_time <= maxTime
      );
      console.log(`   Max time ${maxTime}min: ${before} → ${filtered.length}`);
    }

    // Filter by diet tag
    if (selectedDietTag) {
      const before = filtered.length;
      filtered = filtered.filter((recipe) =>
        recipe.diet_tags?.includes(selectedDietTag)
      );
      console.log(`   Diet "${selectedDietTag}": ${before} → ${filtered.length}`);
    }

    // Exclude allergens
    if (excludeAllergens) {
      const before = filtered.length;
      const allergenList = excludeAllergens.split(",").map(a => a.trim().toLowerCase());
      filtered = filtered.filter((recipe) => {
        const recipeAllergens = (recipe.allergens || []).map(a => a.toLowerCase());
        return !allergenList.some(allergen => recipeAllergens.includes(allergen));
      });
      console.log(`   Exclude allergens ${allergenList}: ${before} → ${filtered.length}`);
    }

    console.log("   Final result:", filtered.length, "recipes");
    setFilteredRecipes(filtered);
    setDisplayCount(12); // Reset pagination
  }, [searchTerm, selectedCategory, selectedDifficulty, maxCookTime, selectedDietTag, excludeAllergens, allRecipes]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedDifficulty("");
    setMaxCookTime("");
    setSelectedDietTag("");
    setExcludeAllergens("");
    setDisplayCount(12);
  };

  const handleSelectRecipe = (recipeId: string) => {
    router.push(`/admin/dishes/new/${recipeId}`);
  };

  const displayedRecipes = filteredRecipes.slice(0, displayCount);
  const hasMore = displayCount < filteredRecipes.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">{t.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs bg-blue-100 dark:bg-blue-950 p-2 rounded text-blue-900 dark:text-blue-200 flex justify-between items-center">
          <span>🔍 Debug: allRecipes={allRecipes.length}, filtered={filteredRecipes.length}, loading={loading}</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-5 text-xs"
            onClick={() => {
              localStorage.removeItem(CACHE_KEY);
              window.location.reload();
            }}
          >
            Clear Cache
          </Button>
        </div>
      )}

      {/* Search & Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="w-full md:w-auto"
        >
          <Filter className="w-4 h-4 mr-2" />
          {t.filters}
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </Button>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            {/* Category */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                {t.categories}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                <option value="soup">Soup</option>
                <option value="salad">Salad</option>
                <option value="main">Main Course</option>
                <option value="dessert">Dessert</option>
                <option value="breakfast">Breakfast</option>
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                {t.difficulty}
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Any Difficulty</option>
                <option value="easy">{t.easy}</option>
                <option value="medium">{t.medium}</option>
                <option value="hard">{t.hard}</option>
              </select>
            </div>

            {/* Max Cook Time */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                {t.time} ({t.minutesShort})
              </label>
              <Input
                type="number"
                placeholder="e.g., 30"
                value={maxCookTime}
                onChange={(e) => setMaxCookTime(e.target.value)}
                min="0"
              />
            </div>

            {/* Diet Tag */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                {t.diet}
              </label>
              <select
                value={selectedDietTag}
                onChange={(e) => setSelectedDietTag(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Any Diet</option>
                <option value="vegetarian">{t.vegetarian}</option>
                <option value="vegan">{t.vegan}</option>
                <option value="glutenFree">{t.glutenFree}</option>
              </select>
            </div>

            {/* Exclude Allergens */}
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                {t.allergens}
              </label>
              <Input
                placeholder="e.g., dairy, nuts"
                value={excludeAllergens}
                onChange={(e) => setExcludeAllergens(e.target.value)}
              />
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                {t.resetFilters}
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Results Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {filteredRecipes.length} {filteredRecipes.length === 1 ? "recipe" : "recipes"}
      </div>

      {/* Empty State */}
      {filteredRecipes.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">{t.noRecipes}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Recipes Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {displayedRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group">
                  {/* Image */}
                  {recipe.image_url && (
                    <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
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
                      {/* Difficulty Badge */}
                      {recipe.difficulty && (
                        <div className="absolute top-2 left-2">
                          <Badge className={getDifficultyColor(recipe.difficulty)}>
                            {getDifficultyLabel(recipe.difficulty, t)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">
                      {recipe.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                      {recipe.canonical_name}
                    </CardDescription>

                    {/* Meta Info */}
                    <div className="flex gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
                      {recipe.cook_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {recipe.cook_time} {t.minutesShort}
                        </div>
                      )}
                      {recipe.servings && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {recipe.servings}
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Diet Tags */}
                    {recipe.diet_tags && recipe.diet_tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {recipe.diet_tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag === "vegetarian" && (
                              <>
                                <Leaf className="w-3 h-3 mr-1" />
                                {t.vegetarian}
                              </>
                            )}
                            {tag === "vegan" && "🌱 Vegan"}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Allergen Warning */}
                    {recipe.allergens && recipe.allergens.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {recipe.allergens.slice(0, 2).map((allergen) => (
                          <Badge key={allergen} variant="outline" className="text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Select Button */}
                    <Button
                      onClick={() => handleSelectRecipe(recipe.id)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      {t.selectButton}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center pt-4"
            >
              <Button
                onClick={() => setDisplayCount((prev) => prev + 12)}
                variant="outline"
                className="px-8"
              >
                {t.loadMore}
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

// Helper functions
function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return "bg-green-500/20 text-green-700 dark:text-green-300";
    case "medium":
      return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300";
    case "hard":
      return "bg-red-500/20 text-red-700 dark:text-red-300";
    default:
      return "bg-gray-500/20 text-gray-700 dark:text-gray-300";
  }
}

function getDifficultyLabel(difficulty: string, t: typeof labels.en) {
  switch (difficulty) {
    case "easy":
      return t.easy;
    case "medium":
      return t.medium;
    case "hard":
      return t.hard;
    default:
      return difficulty;
  }
}
