"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle, Clock, RefreshCw, Save, FileText } from "lucide-react";
import { AIActions } from "@/components/assistant/AIActions";
import { AIResults } from "@/components/assistant/AIResults";
import { useAI, type AIGoal, type Recipe } from "@/hooks/useAI";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { fridgeApi } from "@/lib/api";

// Types for recipe response
interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

interface RecipeEconomy {
  usedFromFridge: boolean;
  estimatedExtraCost: number;
  currency: string;
}

interface RecipeData {
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  ingredientsMissing?: RecipeIngredient[];
  steps: string[];
  servings?: number;
  timeMinutes?: number;
  difficulty?: string;
  chefTips?: string[];
  expiryPriority?: "critical" | "warning" | "ok" | null;
  economy?: RecipeEconomy;
}

interface UsedProduct {
  name: string;
  usedAmount: number;
  unit: string;
}

export default function AssistantPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Helper function to format quantity and unit
  const formatQuantity = (quantity: number, unit: string) => {
    if (unit === "g" && quantity >= 1000) {
      return `${(quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1)} kg`;
    }
    if (unit === "ml" && quantity >= 1000) {
      return `${(quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1)} l`;
    }
    return `${quantity} ${unit}`;
  };
  const { runAI, result, loading, error, clearResult, setLoading } = useAI();
  const [actionLoading, setActionLoading] = useState(false);
  const [singleRecipe, setSingleRecipe] = useState<RecipeData | null>(null);
  const [usedProducts, setUsedProducts] = useState<UsedProduct[]>([]);
  const [recipeError, setRecipeError] = useState<string | null>(null);

  const handleAnalyze = async (goal: AIGoal) => {
    console.log("🔵 handleAnalyze called with goal:", goal);
    
    // Clear single recipe when running other goals
    setSingleRecipe(null);
    setUsedProducts([]);
    setRecipeError(null);
    
    // Special handling for "today_meals" - create single recipe
    if (goal === "today_meals") {
      console.log("🟢 Detected today_meals goal - creating single recipe");
      await handleCreateSingleRecipe();
      return;
    }
    
    console.log("🟡 Running standard AI analysis for goal:", goal);
    await runAI(goal);
  };

  const handleCreateSingleRecipe = async () => {
    console.log("🟣 handleCreateSingleRecipe started");
    
    // 🛡️ Guard: Check if user context is ready
    if (isLoading) {
      console.warn("⚠️ User context still loading, skipping");
      return;
    }
    
    if (!user) {
      console.warn("⚠️ User not ready yet");
      setRecipeError("Zaloguj się, aby kontynuować");
      return;
    }
    
    setRecipeError(null);
    setSingleRecipe(null);
    setUsedProducts([]);
    clearResult();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token:", token ? "exists" : "missing");
      
      if (!token) {
        console.error("❌ No token, stopping");
        setRecipeError("Wymagana autoryzacja");
        setLoading(false);
        return;
      }

      console.log("🌐 Calling API: /api/ai/create-recipe-from-fridge");
      
      const res = await fetch("/api/ai/create-recipe-from-fridge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ language: "pl" }),
      });

      console.log("📡 API Response status:", res.status);

      // 🔍 DEBUG: Check RAW response
      const rawText = await res.text();
      console.log("🔍 RAW RESPONSE TEXT:", rawText);
      
      const data = JSON.parse(rawText);
      console.log("📦 API Response data:", data);

      // ✅ Check for error first
      if (!data.success) {
        console.log("⚠️ Backend returned success: false");
        setRecipeError(data.data?.message || "Błąd generowania przepisu");
        setLoading(false);
        return;
      }

      // Get recipe object (no parsing needed - backend returns object)
      const recipe = data.data?.recipe;
      
      if (!recipe) {
        console.error("❌ No recipe in response");
        setRecipeError("Brak danych przepisu");
        setLoading(false);
        return;
      }

      console.log("🍽️ Recipe received:", recipe);

      // 🔧 NORMALIZATION: Handle different API response formats
      const normalizedRecipe = {
        title: recipe.title ?? recipe.name ?? "Przepis z AI",
        description: recipe.description ?? "",
        ingredients: recipe.ingredients ?? recipe.ingredientsUsed ?? [],
        ingredientsMissing: recipe.ingredientsMissing ?? [],
        steps: recipe.steps ?? [],
        servings: recipe.servings ?? recipe.portions ?? null,
        timeMinutes: recipe.timeMinutes ?? recipe.cookingTime ?? null,
        difficulty: recipe.difficulty ?? "średni",
        chefTips: recipe.chefTips ?? [],
        expiryPriority: recipe.expiryPriority ?? recipe.expires_priority ?? null,
        economy: recipe.economy ?? {
          usedFromFridge: true,
          estimatedExtraCost: 0,
          currency: "PLN",
        },
      };

      console.log("🔧 Normalized recipe:", normalizedRecipe);

      // ✅ SUCCESS - display recipe
      setSingleRecipe(normalizedRecipe);
      setUsedProducts(data.data?.usedProducts ?? []);
      console.log("✅ Recipe set in state");
      console.log("📦 Used products count:", data.data?.usedProducts?.length ?? 0);
      console.log("🛒 Missing ingredients count:", normalizedRecipe.ingredientsMissing?.length ?? 0);
      console.log("💰 Economy data:", normalizedRecipe.economy);

    } catch (err: any) {
      console.error("❌ Fetch error:", err);
      setRecipeError("Błąd połączenia z AI");
    } finally {
      setLoading(false);
      console.log("🏁 Loading false");
    }
  };

  const handleAddToPlan = async (recipe: Recipe) => {
    setActionLoading(true);
    try {
      console.log("Adding to plan:", recipe);
      alert(`Przepis "${recipe.title}" dodany do planu!`);
    } catch (err) {
      console.error("Error adding to plan:", err);
      alert("Błąd podczas dodawania do planu");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkDone = async (recipe: Recipe) => {
    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      alert("Ten przepis nie ma składników do odjęcia");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Wymagana autoryzacja");
        return;
      }

      const ingredientsToDeduct = recipe.ingredients.map(ing => ({
        name: ing.name,
        quantity: Number(ing.quantity) || 1,
        unit: ing.unit || "szt"
      }));

      const response = await fridgeApi.deductIngredients(ingredientsToDeduct, token);

      if (response.success) {
        alert(`✅ ${response.message}\n\nOdjęto ${response.deducted?.length || 0} składników z lodówki`);
      } else {
        alert(`❌ Nie udało się odjąć składników`);
      }
    } catch (err: any) {
      console.error("Error marking as done:", err);
      alert(`❌ Błąd: ${err.message || "Nie udało się odjąć składników"}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Wymagana autoryzacja</h2>
          <p className="text-gray-600 dark:text-gray-400">Zaloguj się, aby korzystać z AI Asystenta</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/login")}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
          >
            Zaloguj się
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-purple-900/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-[80px] space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                AI Asystent Kuchenny
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Inteligentne podpowiedzi na podstawie twojej lodówki
              </p>
            </div>
          </div>
        </motion.div>

        {/* AI Actions - Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AIActions onAnalyze={handleAnalyze} loading={loading || isLoading} />
        </motion.div>

        {/* Loading State for Single Recipe */}
        {loading && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  AI analizuje zawartość lodówki i tworzy przepis…
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  To może potrwać kilka sekund
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State for Single Recipe */}
        {recipeError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-200 mb-1">
                  Uwaga
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  {recipeError}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Single Recipe Display */}
        {singleRecipe && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6 space-y-6"
          >
            {/* 1️⃣ Header with Priority Badge */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {singleRecipe.title}
                  </h2>
                  {singleRecipe.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {singleRecipe.description}
                    </p>
                  )}
                </div>

                {/* Expiry Priority Badge */}
                {singleRecipe.expiryPriority === "critical" && (
                  <span className="text-xs px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium whitespace-nowrap">
                    🔥 Użyć pilnie
                  </span>
                )}
                {singleRecipe.expiryPriority === "warning" && (
                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium whitespace-nowrap">
                    🟡 Wkrótce straci ważność
                  </span>
                )}
                {singleRecipe.expiryPriority === "ok" && (
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium whitespace-nowrap">
                    🟢 Spokojnie
                  </span>
                )}
              </div>

              {/* Time & Servings */}
              <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                {singleRecipe.timeMinutes && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span><strong>{singleRecipe.timeMinutes} min</strong></span>
                  </div>
                )}
                {singleRecipe.servings && (
                  <div>
                    👥 <strong>{singleRecipe.servings} porcji</strong>
                  </div>
                )}
              </div>
            </div>

            {/* 2️⃣ Składniki z lodówki (ingredientsUsed) */}
            <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✅</span>
                Z lodówki
              </h3>
              <ul className="space-y-2">
                {singleRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">• {ing.name}</span>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {formatQuantity(ing.quantity, ing.unit)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3️⃣ Do dokupienia (ingredientsMissing) */}
            {singleRecipe.ingredientsMissing && singleRecipe.ingredientsMissing.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-800/30">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">🛒</span>
                  Do dokupienia
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  To normalne — niektóre składniki (sól, olej, przyprawy) często dokupujemy osobno
                </p>
                <ul className="space-y-2 mb-3">
                  {singleRecipe.ingredientsMissing.map((ing, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700 dark:text-gray-300">• {ing.name}</span>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {formatQuantity(ing.quantity, ing.unit)}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => alert("Lista zakupów (coming soon)")}
                  className="w-full text-sm px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 font-medium transition-colors"
                >
                  Dodaj do listy zakupów
                </button>
              </div>
            )}

            {/* 4️⃣ Ekonomia */}
            {singleRecipe.economy && (
              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 border border-purple-200 dark:border-purple-800/30">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400">💰</span>
                  Ekonomia
                </h3>
                {singleRecipe.economy.usedFromFridge && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Używasz produktów z lodówki.
                  </p>
                )}
                {singleRecipe.economy.estimatedExtraCost !== null && singleRecipe.economy.estimatedExtraCost !== undefined && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Szacowany koszt brakujących składników:{" "}
                    <strong className="text-purple-700 dark:text-purple-400">
                      ~{singleRecipe.economy.estimatedExtraCost} {singleRecipe.economy.currency}
                    </strong>
                  </p>
                )}
              </div>
            )}

            {/* 5️⃣ Przygotowanie (steps) */}
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>👨‍🍳</span>
                Przygotowanie
              </h3>
              <ol className="space-y-3">
                {singleRecipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 flex items-center justify-center text-xs font-medium">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Chef Tips */}
            {singleRecipe.chefTips && singleRecipe.chefTips.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <span>💡</span>
                  Wskazówki szefa
                </h4>
                <ul className="space-y-2 text-sm">
                  {singleRecipe.chefTips.map((tip, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-purple-500 dark:text-purple-400">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 6️⃣ Footer - CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => handleCreateSingleRecipe()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-400 text-sm font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Inny przepis
              </button>
              <button
                onClick={() => alert("Zapisz (coming soon)")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 text-sm font-medium transition-colors"
              >
                💾 Zapisz
              </button>
              <button
                onClick={() => alert("Export PDF (coming soon)")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
              >
                📄 PDF
              </button>
              <button
                onClick={() => alert("Lista zakupów (coming soon)")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-sm font-medium transition-colors"
              >
                🛒 Lista zakupów
              </button>
            </div>
          </motion.div>
        )}

        {/* Standard AI Results - Recipe Cards */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AIResults
              result={result}
              loading={loading}
              error={error}
              onAddToPlan={handleAddToPlan}
              onMarkDone={handleMarkDone}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
