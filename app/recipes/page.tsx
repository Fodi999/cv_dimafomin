"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, ChefHat, Check, AlertCircle, ShoppingCart, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { recipeMatchingApi, AvailableRecipesResponse } from "@/lib/api/recipe-matching";
import { getRecipeTitle } from "@/lib/i18n/getRecipeTitle";

export default function RecipesPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const { token } = useAuth();
  
  const [available, setAvailable] = useState<AvailableRecipesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state for collapsible sections
  const [showAlmostCook, setShowAlmostCook] = useState(true);
  const [showNeedToBuy, setShowNeedToBuy] = useState(false);

  useEffect(() => {
    if (token) {
      loadAvailableRecipes();
    }
  }, [token, language]); // Re-load when language changes

  async function loadAvailableRecipes() {
    if (!token) {
      setError("Please login to see recipes");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("🔍 Loading available recipes from fridge...");
      console.log("🌍 UI Language:", language);
      
      const data = await recipeMatchingApi.getAvailableRecipes({}, token, language);
      
      console.log("✅ Available recipes loaded:", {
        canCook: data.canCook.length,
        almostCook: data.almostCook.length,
        needToBuy: data.needToBuy.length,
        total: data.totalCount
      });
      
      // 🔍 DEBUG: Check what fields backend returns
      if (data.canCook.length > 0) {
        const firstRecipe = data.canCook[0];
        console.log("🔍 Backend recipe structure:", {
          title: firstRecipe.title,
          localName: firstRecipe.localName,
          canonicalName: firstRecipe.canonicalName,
          hasTitle: !!firstRecipe.title,
          hasLocalName: !!firstRecipe.localName,
          hasCanonicalName: !!firstRecipe.canonicalName
        });
      }
      
      setAvailable(data);
    } catch (err: any) {
      console.error("❌ Failed to load available recipes:", err);
      setError(err.message || "Nie udało się załadować przepisów");
    } finally {
      setLoading(false);
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t?.common?.back || "Назад"}</span>
          </button>
          <div className="flex items-center gap-3">
            <ChefHat className="w-6 h-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t?.recipes?.cooking?.title || "Gotowanie"}</h1>
          </div>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">{t?.recipes?.cooking?.loading || "Sprawdzanie Twojej lodówki..."}</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {!loading && !error && available && (
          <>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">{available.canCookCount}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t?.recipes?.cooking?.stats?.canCookNow || "Można ugotować teraz"}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-2xl font-bold text-yellow-600">{available.almostCookCount}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t?.recipes?.cooking?.stats?.almostReady || "Prawie gotowe"}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ShoppingCart className="w-5 h-5 text-red-600" />
                    <span className="text-2xl font-bold text-red-600">{available.needToBuyCount}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t?.recipes?.cooking?.stats?.needShopping || "Wymaga zakupów"}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4">{t?.recipes?.cooking?.stats?.basedOnFridge || "Na podstawie Twojej lodówki pokazujemy, co możesz ugotować teraz"}</p>
            </motion.div>

            <motion.div variants={container} initial="hidden" animate="show" className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t?.recipes?.cooking?.sections?.canCook?.title || "Można ugotować teraz"}</h2>
                <span className="text-sm text-gray-500">({available.canCookCount})</span>
              </div>

              {available.canCookCount === 0 && available.almostCookCount === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                  <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{t?.recipes?.cooking?.empty?.title || "Twoja lodówka jest pusta"}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">{t?.recipes?.cooking?.empty?.description || "Dodaj składniki do lodówki, aby zobaczyć co możesz ugotować"}</p>
                  <button onClick={() => router.push("/fridge")} className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">{t?.recipes?.cooking?.empty?.action || "Przejdź do lodówki"}</button>
                </div>
              ) : (
                <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {available.canCook.map((recipe) => (
                    <motion.div key={recipe.recipeId} variants={item}>
                      <RecipeCard 
                        id={recipe.recipeId} 
                        title={getRecipeTitle(recipe, language)} 
                        category={recipe.country || "main"} 
                        difficulty={(recipe.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate"} 
                        cookingTime={recipe.timeMinutes || recipe.cookingTime} 
                        imageUrl={recipe.imageUrl || "https://i.postimg.cc/B63F53xY/DSCF4622.jpg"} 
                        author={{ name: "Dima Fomin", avatar: "https://i.postimg.cc/k4SPVGzv/avatar.jpg" }} 
                        likes={0} 
                        comments={0} 
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {available.almostCookCount > 0 && (
              <motion.div variants={container} initial="hidden" animate="show" className="mb-12">
                <button onClick={() => setShowAlmostCook(!showAlmostCook)} className="flex items-center gap-3 mb-6 w-full group">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t?.recipes?.cooking?.sections?.almostCook?.title || "Prawie gotowe"}</h2>
                  <span className="text-sm text-gray-500">({available.almostCookCount})</span>
                  {showAlmostCook ? <ChevronUp className="w-5 h-5 text-gray-400 ml-auto group-hover:text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-400 ml-auto group-hover:text-gray-600" />}
                </button>
                {showAlmostCook && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {available.almostCook.map((recipe) => (
                      <motion.div key={recipe.recipeId} variants={item}>
                        <RecipeCard 
                          id={recipe.recipeId} 
                          title={getRecipeTitle(recipe, language)} 
                          category={recipe.country || "main"} 
                          difficulty={(recipe.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate"} 
                          cookingTime={recipe.timeMinutes || recipe.cookingTime} 
                          imageUrl={recipe.imageUrl || "https://i.postimg.cc/B63F53xY/DSCF4622.jpg"} 
                          author={{ name: "Dima Fomin", avatar: "https://i.postimg.cc/k4SPVGzv/avatar.jpg" }} 
                          likes={0} 
                          comments={0} 
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {available.needToBuyCount > 0 && (
              <motion.div variants={container} initial="hidden" animate="show">
                <button onClick={() => setShowNeedToBuy(!showNeedToBuy)} className="flex items-center gap-3 mb-6 w-full group">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t?.recipes?.cooking?.sections?.needToBuy?.title || "Wymaga zakupów"}</h2>
                  <span className="text-sm text-gray-500">({available.needToBuyCount})</span>
                  {showNeedToBuy ? <ChevronUp className="w-5 h-5 text-gray-400 ml-auto group-hover:text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-400 ml-auto group-hover:text-gray-600" />}
                </button>
                {showNeedToBuy && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {available.needToBuy.map((recipe) => (
                      <motion.div key={recipe.recipeId} variants={item}>
                        <RecipeCard 
                          id={recipe.recipeId} 
                          title={getRecipeTitle(recipe, language)} 
                          category={recipe.country || "main"} 
                          difficulty={(recipe.difficulty as "beginner" | "intermediate" | "advanced") || "intermediate"} 
                          cookingTime={recipe.timeMinutes || recipe.cookingTime} 
                          imageUrl={recipe.imageUrl || "https://i.postimg.cc/B63F53xY/DSCF4622.jpg"} 
                          author={{ name: "Dima Fomin", avatar: "https://i.postimg.cc/k4SPVGzv/avatar.jpg" }} 
                          likes={0} 
                          comments={0} 
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
