"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, ChefHat, BookOpen, Lightbulb, Filter, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type for catalog recipe (matches backend response)
type CatalogRecipe = {
  id: string;
  canonicalName?: string; // Backend field
  localName?: string;     // Backend field
  name?: string;          // Fallback
  category: string;
  country?: string;
  difficulty?: string;
  timeMinutes?: number;
  servings?: number;
  imageUrl?: string;
};

export default function RecipesPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [recipes, setRecipes] = useState<CatalogRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Load recipes from API (Single Source of Truth)
  useEffect(() => {
    loadCatalog();
  }, []);

  async function loadCatalog() {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📚 Loading recipe catalog from API...");
      
      const response = await fetch("/api/recipes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        console.log("✅ Catalog loaded:", data.data.length, "recipes");
        setRecipes(data.data);
      } else {
        throw new Error(data.message || "Failed to load recipes");
      }
    } catch (err: any) {
      console.error("❌ Failed to load catalog:", err);
      setError(err.message || "Nie udało się załadować przepisów");
    } finally {
      setLoading(false);
    }
  }

  // Filter logic
  const filteredRecipes = recipes.filter((recipe) => {
    // Category filter
    if (categoryFilter !== "all" && recipe.category?.toLowerCase() !== categoryFilter) {
      return false;
    }

    // Time filter
    if (timeFilter !== "all") {
      const time = recipe.timeMinutes || 0;
      if (timeFilter === "quick" && time >= 30) return false;
      if (timeFilter === "medium" && (time < 30 || time > 60)) return false;
      if (timeFilter === "long" && time <= 60) return false;
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      const diff = recipe.difficulty?.toLowerCase() || "";
      if (difficultyFilter === "easy" && !["easy", "łatwy", "latwy"].includes(diff)) return false;
      if (difficultyFilter === "medium" && !["medium", "średni", "sredni"].includes(diff)) return false;
      if (difficultyFilter === "hard" && !["hard", "trudny"].includes(diff)) return false;
    }

    return true;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Sticky Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Назад</span>
          </button>
          <div className="flex items-center gap-3">
            <ChefHat className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Gotowanie</h1>
          </div>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

      {!loading && recipes.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-sky-600 dark:text-sky-400 mb-6">
          <BookOpen className="w-4 h-4" />
          <span>{recipes.length} {recipes.length === 1 ? 'przepis' : 'przepisów'} w katalogu</span>
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-500 max-w-2xl mx-auto mb-8 text-center">
        Przeglądaj przepisy. Zapisz je, aby sprawdzić składniki w swojej kuchni.
      </p>

        {/* Filters */}
        {!loading && !error && recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Filter className="w-4 h-4" />
              Filtry
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Kategoria
                </label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wszystkie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Wszystkie</SelectItem>
                    <SelectItem value="main">Dania główne</SelectItem>
                    <SelectItem value="soup">Zupy</SelectItem>
                    <SelectItem value="salad">Sałatki</SelectItem>
                    <SelectItem value="sushi">Sushi</SelectItem>
                    <SelectItem value="dessert">Desery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Czas przygotowania
                </label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Dowolny" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Dowolny</SelectItem>
                    <SelectItem value="quick">&lt; 30 min</SelectItem>
                    <SelectItem value="medium">30-60 min</SelectItem>
                    <SelectItem value="long">60+ min</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Poziom trudności
                </label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Dowolny" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Dowolny</SelectItem>
                    <SelectItem value="easy">Łatwy</SelectItem>
                    <SelectItem value="medium">Średni</SelectItem>
                    <SelectItem value="hard">Trudny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results count */}
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Znaleziono: <span className="font-semibold text-sky-600 dark:text-sky-400">{filteredRecipes.length}</span> z <span className="font-semibold">{recipes.length}</span> {recipes.length === 1 ? 'przepisu' : 'przepisów'}
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              ❌ {error}
            </p>
            <button
              onClick={loadCatalog}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Spróbuj ponownie
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recipes.length === 0 && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Brak przepisów w katalogu
            </p>
          </div>
        )}

        {/* Empty Filter State */}
        {!loading && !error && recipes.length > 0 && filteredRecipes.length === 0 && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-12 text-center">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
              Nie znaleziono przepisów pasujących do wybranych filtrów
            </p>
            <button
              onClick={() => {
                setCategoryFilter("all");
                setTimeFilter("all");
                setDifficultyFilter("all");
              }}
              className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors"
            >
              Wyczyść filtry
            </button>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && !error && filteredRecipes.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => {
                // Get recipe name (prioritize localName, then canonicalName, then fallback)
                const recipeName = recipe.localName || recipe.canonicalName || recipe.name || "Unnamed Recipe";
                
                return (
                  <motion.div 
                    key={recipe.id} 
                    variants={item}
                    initial="hidden"
                    animate="show"
                  >
                    <RecipeCard
                      id={recipe.id}
                      title={recipeName}
                      category={recipe.category}
                    difficulty={(recipe.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate"}
                    cookingTime={recipe.timeMinutes || 30}
                    imageUrl={recipe.imageUrl || "https://i.postimg.cc/B63F53xY/DSCF4622.jpg"}
                    author={{ 
                      name: "Dima Fomin", 
                      avatar: "https://i.postimg.cc/k4SPVGzv/avatar.jpg" 
                    }}
                    likes={0}
                    comments={0}
                  />
                  </motion.div>
                );
              })}
            </div>
            
            {/* CTA Hint */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 p-6 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-xl border border-sky-200 dark:border-sky-800"
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-700 dark:text-gray-300 text-left">
                  <span className="font-semibold">W katalogu jest {recipes.length} przepisów.</span> Zapisz wybrane, aby AI sprawdziło składniki w Twojej lodówce i pokazało, co możesz ugotować od razu.
                </p>
              </div>
            </motion.div>
          </>
        )}

        {/* Footer CTA */}
        {!loading && recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Chcesz nauczyć się więcej? Dołącz do Modern Food Academy
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold rounded-lg transition-all"
            >
              Przejdź do Akademii
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
