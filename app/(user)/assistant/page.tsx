"use client";

import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRecipe } from "@/contexts/RecipeContext";
import { useRouter } from "next/navigation";
import { useAIRecommendation } from "@/hooks/useAIRecommendation";
import AIRecommendationCard from "@/components/assistant/AIRecommendationCard";
import { AIMessageCard } from "@/components/ai/AIMessageCard";
import { PageLayout, PageHeader } from "@/components/layout/PageLayout";
import { generateUUID } from "@/lib/uuid";
import { recipeMatchingApi } from "@/lib/api";
import type { RecipeScenario, AIRecipeResponse } from "@/lib/types/ai-recipe";

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 AI Asystent Kuchenny - 2025 Architecture
// ═══════════════════════════════════════════════════════════════════════════
//
// CONTRACT:
// 
// ✅ SINGLE SOURCE OF TRUTH: GET /api/ai-recipe/recommendation
// ✅ Backend-driven Rules Engine decides everything
// ✅ Frontend just renders the decision
// 
// ❌ NO AI generation here
// ❌ NO ingredient recomputation
// ❌ NO fridge analysis
// ❌ NO fallback logic
//
// Backend provides:
// - scenario (CAN_COOK_NOW, ALMOST_READY, NEED_MORE, etc.)
// - confidence (0-100)
// - canonicalName
// - missingIngredients
// - coverage
//
// Frontend displays:
// - ONE card with backend decision
// - CTA based on scenario
// - No toggles, no rotation, no localStorage
//
// Last Updated: 2026-01-17
// ═══════════════════════════════════════════════════════════════════════════

const CTA_BY_SCENARIO: Record<RecipeScenario, string> = {
  CAN_COOK_NOW: "Gotuj teraz",
  ALMOST_READY: "Zobacz czego brakuje",
  NEED_MORE: "Zobacz inne pomysły",
} as const;

export default function AssistantPage() {
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const { openAuthModal } = useAuth();
  const { t } = useLanguage();
  const { setRecipe: saveToRecipeContext } = useRecipe();
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  
  // 🎯 Mapper function: AIRecipeResponse → RecipeContext
  const handleRecipeLoaded = useCallback((aiResponse: AIRecipeResponse) => {
    console.log("🔄 Saving AI recipe to RecipeContext");
    
    // Map AIRecipeResponse to RecipeContext format
    const recipeForContext = {
      title: aiResponse.recipe.displayName,
      canonicalName: aiResponse.recipe.canonicalName,
      description: aiResponse.recipe.description,
      ingredients: aiResponse.recipe.ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
      })),
      ingredientsMissing: aiResponse.recipe.missingIngredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity,
        unit: ing.unit,
      })),
      servings: 2, // Default servings (backend не передаёт)
      timeMinutes: aiResponse.recipe.cookingTime || 30,
      difficulty: aiResponse.recipe.difficulty,
      // Economy будет null для catalog recipes (backend не считает)
      economy: null,
    };
    
    saveToRecipeContext({
      recipe: recipeForContext,
      usedProducts: aiResponse.ai.ingredientsUsed.map(name => ({
        name,
        usedAmount: 0, // Backend не передаёт количество
        unit: 'шт',
      })),
    });
    
    console.log("✅ AI recipe saved to RecipeContext (persists across navigation & reload)");
  }, [saveToRecipeContext]);
  
  // 🎯 Single source of truth - backend Rules Engine
  // ✅ Автоматически сохраняет в RecipeContext через handleRecipeLoaded
  const { data, loading, error, refetch, loadNext } = useAIRecommendation(token, handleRecipeLoaded);

  // 🔐 Auth Guard
  useEffect(() => {
    if (!userLoading && !user) {
      console.log("⚠️ User not authenticated");
    }
  }, [user, userLoading]);

  // 🎯 Unified Action Handler
  const handleAction = (actionId: string) => {
    console.log("🎯 Action:", actionId);
    
    switch (actionId) {
      case 'ADD_PRODUCTS':
      case 'VIEW_FRIDGE':
        router.push('/fridge');
        break;
        
      case 'VIEW_SAVED':
        router.push('/recipes/saved');
        break;
        
      case 'VIEW_CATALOG':
        router.push('/recipes');
        break;
        
      case 'RETRY':
        refetch();
        break;
        
      case 'LOGIN':
        openAuthModal('login');
        break;
        
      case 'NEXT_RECIPE':
        if (loadNext) {
          loadNext();
        }
        break;
        
      default:
        console.warn("⚠️ Unknown action:", actionId);
    }
  };

  // 👨‍🍳 Cook Recipe Handler
  const handleCookRecipe = async (recipeId: string, servingsMultiplier: number = 1) => {
    if (!token) {
      toast.error("Zaloguj się, aby ugotować przepis");
      return;
    }

    try {
      console.log("👨‍🍳 Cooking recipe:", { recipeId, servingsMultiplier });
      
      const result = await recipeMatchingApi.cookRecipe(
        recipeId,
        { 
          idempotencyKey: generateUUID(), 
          servingsMultiplier 
        },
        token
      );

      if (result.success) {
        const { economySnapshot, ingredientsUsed } = result;
        const usedValue = economySnapshot.usedValue.toFixed(2);
        const savedValue = economySnapshot.wasteRiskSaved.toFixed(2);
        const currency = economySnapshot.currency;

        toast.success(
          `Smacznego! Wykorzystano ${ingredientsUsed.length} ${ingredientsUsed.length === 1 ? 'składnik' : 'składników'} z lodówki (${usedValue} ${currency}). Uratowano ${savedValue} ${currency} przed marnowaniem!`,
          { duration: 7000 }
        );

        // Refresh recommendation after cooking
        setTimeout(() => refetch(), 1000);
      }
    } catch (err: any) {
      console.error("❌ Failed to cook recipe:", err);
      
      if (err.status === 409) {
        toast.warning("Ten przepis został już oznaczony jako ugotowany");
      } else if (err.status === 404) {
        toast.error("Nie można znaleźć tego przepisu w katalogu");
      } else {
        toast.error(err.message || "Nie udało się ugotować. Spróbuj ponownie");
      }
    }
  };

  // ⭐ Save Recipe Handler
  const handleSaveRecipe = async (recipeId: string) => {
    if (!token) {
      toast.error('Zaloguj się, aby zapisać przepis');
      return;
    }

    try {
      console.log('⭐ Saving recipe:', recipeId);

      const response = await fetch('/api/user/recipes/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Przepis zapisany! Znajdziesz go w sekcji "Zapisane przepisy"', { duration: 5000 });
      } else {
        throw new Error(data.message || 'Nie udało się zapisać przepisu');
      }
    } catch (err: any) {
      console.error('❌ Failed to save recipe:', err);
      toast.error(err.message || 'Nie udało się zapisać. Spróbuj ponownie');
    }
  };

  // 🛒 Add to Shopping List Handler
  const handleAddToCart = (missingIngredients: any[]) => {
    console.log('🛒 Adding to shopping list:', missingIngredients);
    
    if (!missingIngredients || missingIngredients.length === 0) {
      toast.warning('Nie ma składników do dodania');
      return;
    }

    const totalCost = missingIngredients.reduce(
      (sum, ing) => sum + (ing.estimatedCost || 0), 
      0
    );

    toast.success(
      `Dodano ${missingIngredients.length} ${missingIngredients.length === 1 ? 'składnik' : 'składników'}. Szacunkowy koszt: ~${totalCost.toFixed(2)} PLN`,
      { duration: 8000 }
    );
  };

  // 🔄 Loading State
  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  // 🔐 Auth Required State
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.assistant.authRequired}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t.assistant.authDescription}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openAuthModal("login")}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
          >
            {t.assistant.loginButton}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <PageLayout
      title={`${t.assistant.title} | Modern Food Academy`}
      description={t.assistant.description}
      background="gradient-purple"
      maxWidth="lg"
    >
      <PageHeader
        title={t.assistant.title}
        description={t.assistant.description}
        icon={<Sparkles className="w-6 h-6" />}
      />

      {/* 📊 Question Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 p-8 text-center"
      >
        <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t.assistant.questionTitle}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t.assistant.questionDescription}
        </p>
      </motion.div>

      {/* 🔄 Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 p-6"
        >
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {t.assistant.loading}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.assistant.loadingDescription}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ❌ Error State */}
      {error && !loading && (
        <AIMessageCard
          code={error === 'No authentication token' ? 'AUTH_REQUIRED' : 'FETCH_FAILED'}
          context={{ message: error }}
          onAction={handleAction}
          onDismiss={() => refetch()}
        />
      )}

      {/* ✅ Success State - AI Recommendation */}
      {data && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* AI Context Message - ТОЛЬКО от backend */}
          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                  {data.ai.title}
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {data.ai.reason}
                </p>
                {data.ai.tip && (
                  <p className="mt-2 text-xs text-blue-700 dark:text-blue-400 italic">
                    💡 {data.ai.tip}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recipe Card */}
          <AIRecommendationCard
            recipe={{
              recipeId: data.recipe.id,
              title: data.recipe.displayName,
              localName: data.recipe.displayName,
              canonicalName: data.recipe.canonicalName,
              description: data.recipe.description,
              servings: 2,
              timeMinutes: data.recipe.cookingTime || 30,
              difficulty: data.recipe.difficulty,
              canCook: data.recipe.canCookNow,
              canCookNow: data.recipe.canCookNow,
              coverage: data.recipe.matchRatio * 100,
              score: 0,
              usedCount: data.recipe.ingredients.length - data.recipe.missingIngredients.length,
              missingCount: data.recipe.missingIngredients.length,
              imageUrl: data.recipe.imageUrl,
              country: data.recipe.country,
              cookingTime: data.recipe.cookingTime || 30,
              usedIngredients: data.recipe.ingredients
                .filter(ing => ing.available !== undefined && ing.available >= ing.quantity)
                .map(ing => ({
                  name: ing.name,
                  quantity: ing.quantity,
                  unit: ing.unit,
                  inFridge: true,
                })),
              missingIngredients: data.recipe.missingIngredients.map(ing => ({
                name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit,
                estimatedCost: 0,
              })),
            }}
            onCook={(servingsMultiplier: number) => handleCookRecipe(data.recipe.id, servingsMultiplier)}
            onSave={() => handleSaveRecipe(data.recipe.id)}
            onAddToCart={() => handleAddToCart(data.recipe.missingIngredients || [])}
            onRefresh={() => {
              if (loadNext) {
                loadNext();
              } else {
                refetch();
              }
            }}
            isCooking={false}
            isSaving={false}
          />

          {/* AI Ingredients Used - ТОЛЬКО от backend */}
          {data.ai.ingredientsUsed && data.ai.ingredientsUsed.length > 0 && (
            <div className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6">
              <h3 className="font-semibold text-green-900 dark:text-green-200 mb-3">
                {t.assistant.ingredientsFromFridge}
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.ai.ingredientsUsed.map((ingredient: string, idx: number) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-sm text-green-700 dark:text-green-300"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </PageLayout>
  );
}
