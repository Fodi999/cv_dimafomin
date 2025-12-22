"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

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
  const [recipes, setRecipes] = useState<CatalogRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <main className="min-h-screen bg-white dark:bg-neutral-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🍱 Przepisy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            {loading 
              ? "Ładowanie przepisów z katalogu..."
              : recipes.length > 0
                ? `Odkryj kolekcję ${recipes.length} ${recipes.length === 1 ? 'przepisu' : recipes.length <= 4 ? 'przepisów' : 'przepisów'} z naszego katalogu. Wszystkie dane pochodzą z tego samego źródła co AI Asystent.`
                : "Odkryj kolekcję autorskich przepisów. Kliknij na przepis, aby zobaczyć pełne detale."
            }
          </p>
        </motion.div>

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
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              📭 Brak przepisów w katalogu
            </p>
          </div>
        )}

        {/* Recipes Grid */}
        {!loading && !error && recipes.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recipes.map((recipe) => {
              // Get recipe name (prioritize localName, then canonicalName, then fallback)
              const recipeName = recipe.localName || recipe.canonicalName || recipe.name || "Unnamed Recipe";
              
              return (
                <motion.div key={recipe.id} variants={item}>
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
          </motion.div>
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
    </main>
  );
}
