"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { useAIRecommendation } from "@/hooks/useAIRecommendation";
import AIRecommendationCardCompact from "@/components/assistant/AIRecommendationCardCompact";
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
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  
  // ✅ NO RecipeContext hook - AI Assistant is isolated
  // ✅ AI recommendations are ephemeral, not persistent
  const { data, loading, error, refetch, loadNext } = useAIRecommendation(token);

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

        // ✅ Recipe is cooked - backend has recorded it
        // ❌ NO need to save to RecipeContext (AI recommendation is ephemeral)
        // RecipeContext is for user-selected recipes from catalog, not AI recommendations
        console.log("✅ Recipe cooked successfully (backend recorded)");

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
      toast.error('Войдите, чтобы сохранить рецепт');
      return;
    }

    try {
      console.log('⭐ Saving recipe to cooking list:', recipeId);

      const response = await fetch('/api/user/recipes/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeId }),
      });

      console.log('📥 Save recipe response status:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('📦 Save recipe response data:', data);

      if (data.success) {
        toast.success('✅ Рецепт добавлен в раздел "Готовка"! Найдёте его на странице готовки', { duration: 5000 });
        console.log('✅ Recipe saved successfully');
        
        // Trigger a refresh event that /recipes page can listen to
        window.dispatchEvent(new Event('recipe-saved'));
        
      } else {
        console.error('❌ Server returned success=false:', data);
        throw new Error(data.message || 'Не удалось сохранить рецепт');
      }
    } catch (err: any) {
      console.error('❌ Failed to save recipe:', err);
      toast.error(err.message || 'Не удалось сохранить. Попробуйте снова');
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
      <div className="space-y-6">
        <PageHeader
          title={t.assistant.title}
          description={t.assistant.description}
          icon={<Sparkles className="w-6 h-6" />}
        />

        {/* 📊 Question Section - COMPACT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900 p-4 text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.assistant.questionTitle}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t.assistant.questionDescription}
              </p>
            </div>
          </div>
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

      {/* ✅ Success State - AI Recommendation - COMPACT VIEW */}
      {data && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AIRecommendationCardCompact
            recipe={{
              recipeId: data.recipe.id,
              title: data.recipe.displayName,
              localName: data.recipe.displayName,
              canonicalName: data.recipe.canonicalName,
              description: data.recipe.description,
              servings: data.recipe.servings || 1,
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
              steps: data.recipe.steps || [],
              matchStatus: data.recipe.scenario === 'CAN_COOK_NOW' ? 'ready' : 
                          data.recipe.scenario === 'ALMOST_READY' ? 'almost_ready' : 'not_ready',
              matchPercent: Math.round(data.recipe.matchRatio * 100),
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
            aiTitle={data.ai.title}
            aiReason={data.ai.reason}
            onSave={() => handleSaveRecipe(data.recipe.id)}
            isSaved={false}
          />
        </motion.div>
      )}
      </div>
    </PageLayout>
  );
}
