"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle, Clock, RefreshCw, Save, FileText, Search, Filter, Plus, Minus, Users } from "lucide-react";
import { toast } from "sonner";
import { AIActions } from "@/components/assistant/AIActions";
import { AIResults } from "@/components/assistant/AIResults";
import { useAI, type AIGoal, type Recipe } from "@/hooks/useAI";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipe } from "@/contexts/RecipeContext";
import { useRouter } from "next/navigation";
import { fridgeApi, recipeMatchingApi, type RecipeMatch, type RecipeMatchIngredient, type AIRecommendationResult } from "@/lib/api";
import AIRecommendationCard from "@/components/assistant/AIRecommendationCard";
import { generateUUID } from "@/lib/uuid";
import { AIMessageCard } from "@/components/ai/AIMessageCard";
import { useRecipeStats } from "@/hooks/useRecipeStats";
import { PageLayout, PageHeader } from "@/components/layout/PageLayout";

// ═══════════════════════════════════════════════════════════════════════════
// 🔒 ARCHITECTURAL CONTRACT: cook_now Scenario
// ═══════════════════════════════════════════════════════════════════════════
// 
// CANONICAL RULE (DO NOT MODIFY):
// 
// The "cook_now" scenario ALWAYS uses deterministic rules-based matching
// via GET /api/recipes/match and NEVER uses AI recommendations.
//
// Why?
// 1. Deterministic matching is 100x cheaper than AI calls
// 2. Users expect instant results for "what can I cook now"
// 3. AI should only be fallback when catalog returns count === 0
// 4. Economy: matching uses existing recipe catalog, AI generates new content
//
// Endpoints:
// ✅ PRIMARY:   GET /api/recipes/match (rules-based, deterministic)
// ❌ FORBIDDEN: POST /api/recipes/recommendations (AI-powered, expensive)
//
// Parameters for cook_now:
const COOK_NOW_PARAMS = {
  limit: 20,           // Get top 20 matches for rotation
  sort: 'coverage',    // Prioritize recipes with highest ingredient coverage
  order: 'desc',       // Best matches first
  minCoverage: 0,      // Allow any match (filter on frontend if needed)
} as const;
//
// UX Contract:
// - If count > 0: Show recipes from catalog (NO AI fallback)
// - If count === 0: Show AIMessageCard suggesting to add products or explore catalog
// - Frontend filters already-viewed recipes from results
//
// Selection Logic (ONE CARD AT A TIME):
// 1. coverage DESC      (максимальное покрытие ингредиентов)
// 2. score DESC         (общий балл рецепта)
// 3. usedCount DESC     (больше ингредиентов из холодильника)
// 4. cookingTime ASC    (быстрее готовить)
//
// Last Updated: 2026-01-16
// ═══════════════════════════════════════════════════════════════════════════

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
  const { openAuthModal } = useAuth();
  const { state: recipeState, setRecipe, clearRecipe, refreshRecipe, isLoading: recipeLoading } = useRecipe();
  
  // 🔢 Recipe stats (global context for AI messages)
  const { stats, loading: statsLoading } = useRecipeStats();
  
  // ✨ AI response state (for AIMessageCard)
  const [aiResponse, setAiResponse] = useState<{ code?: string; context?: any; success?: boolean } | null>(null);

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
  const [recipeError, setRecipeError] = useState<string | null>(null);
  const [missingIngredientsAdded, setMissingIngredientsAdded] = useState(false);
  const [fridgeItems, setFridgeItems] = useState<any[]>([]);

  // 🆕 Recipe Matching State - with localStorage persistence
  const [recipeMatches, setRecipeMatches] = useState<RecipeMatch[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('assistant_recipe_matches');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [matchesLoading, setMatchesLoading] = useState(false);
  
  const [showMatches, setShowMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('assistant_show_matches') === 'true';
  });
  
  // 🆕 Current recipe index (for ONE CARD AT A TIME UX)
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('assistant_current_recipe_index');
    return saved ? parseInt(saved, 10) : 0;
  });

  // 🆕 Track viewed recipe IDs to avoid duplicates on "Odśwież"
  const [viewedRecipeIds, setViewedRecipeIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('assistant_viewed_recipe_ids');
    return saved ? JSON.parse(saved) : [];
  });

  // 🆕 AI Recipe Servings State (for single generated recipe)
  const [aiRecipeServings, setAiRecipeServings] = useState<number | null>(null);

  // 💾 Save recipe matches to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && recipeMatches.length > 0) {
      localStorage.setItem('assistant_recipe_matches', JSON.stringify(recipeMatches));
    }
  }, [recipeMatches]);

  // 💾 Save showMatches to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('assistant_show_matches', showMatches.toString());
    }
  }, [showMatches]);

  // 💾 Save currentRecipeIndex to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('assistant_current_recipe_index', currentRecipeIndex.toString());
    }
  }, [currentRecipeIndex]);

  // 💾 Save viewedRecipeIds to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && viewedRecipeIds.length > 0) {
      localStorage.setItem('assistant_viewed_recipe_ids', JSON.stringify(viewedRecipeIds));
    }
  }, [viewedRecipeIds]);

  // Use recipe from global context (persists across navigation & page reload)
  const singleRecipe = recipeState.recipe;
  const usedProducts = recipeState.usedProducts;

  // 🆕 Initialize servings when recipe loads
  useEffect(() => {
    if (singleRecipe && aiRecipeServings === null) {
      setAiRecipeServings(singleRecipe.servings);
    }
  }, [singleRecipe]);

  // 📊 Log recipe stats for debugging
  useEffect(() => {
    if (stats) {
      console.log('📊 Recipe stats loaded:', {
        totalRecipes: stats.totalRecipes,
        byCategory: Object.keys(stats.byCategory).length > 0 ? stats.byCategory : 'empty'
      });
    }
  }, [stats]);

  // 🔍 Log aiResponse context enrichment for debugging
  useEffect(() => {
    if (aiResponse && aiResponse.context) {
      console.log('🔍 AI Response context:', {
        code: aiResponse.code,
        context: aiResponse.context,
        hasTotalRecipes: 'totalRecipes' in aiResponse.context,
        totalRecipes: aiResponse.context.totalRecipes
      });
    }
  }, [aiResponse]);

  // 🆕 AI Recipe scale coefficient
  const aiRecipeScale = singleRecipe && aiRecipeServings 
    ? aiRecipeServings / singleRecipe.servings 
    : 1;

  // 🆕 Helper: Scale quantity for AI recipe
  const scaleAiRecipeQuantity = (qty: number) => {
    return Math.round(qty * aiRecipeScale * 100) / 100;
  };

  // 🔑 Helper: Normalize ingredient names for comparison
  const normalizeIngredientName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-ząćęłńóśźż0-9]/g, ""); // Remove special chars, keep Polish letters
  };

  // 🔑 ПРАВИЛЬНАЯ ЛОГИКА: Пересчитать missing ingredients против РЕАЛЬНОГО холодильника
  const recomputeMissingIngredients = () => {
    if (!singleRecipe?.ingredientsMissing) {
      return {
        missing: [],
        inFridge: [],
      };
    }

    // ⚠️ ЗАЩИТА: Не пересчитываем если холодильник не загружен
    if (!fridgeItems || fridgeItems.length === 0) {
      console.warn("⚠️ Cannot recompute - fridge is empty or not loaded yet");
      console.warn("   Returning all AI suggestions as 'missing' by default");
      return {
        missing: singleRecipe.ingredientsMissing,
        inFridge: [],
      };
    }

    const missing: any[] = [];
    const inFridge: any[] = [];

    singleRecipe.ingredientsMissing.forEach((ing: any) => {
      const normalizedIngName = normalizeIngredientName(ing.name);
      
      // Check if ingredient exists in fridge with sufficient quantity
      const fridgeItem = fridgeItems.find((item: any) => {
        const normalizedItemName = normalizeIngredientName(item.ingredient_name || item.name);
        return normalizedItemName === normalizedIngName;
      });

      if (fridgeItem && (fridgeItem.quantity || 0) >= (ing.quantity || 0)) {
        // ✅ Есть в холодильнике с достаточным количеством
        inFridge.push({
          ...ing,
          availableQuantity: fridgeItem.quantity,
        });
      } else if (fridgeItem) {
        // ⚠️ Есть в холодильнике, но недостаточно
        missing.push({
          ...ing,
          partiallyAvailable: true,
          availableQuantity: fridgeItem.quantity,
          needsMore: (ing.quantity || 0) - (fridgeItem.quantity || 0),
        });
      } else {
        // 🛒 Полностью отсутствует
        missing.push(ing);
      }
    });

    console.log("🔍 Recomputed ingredients:", {
      aiSuggested: singleRecipe.ingredientsMissing.length,
      inFridge: inFridge.length,
      missing: missing.length,
      fridgeItemsCount: fridgeItems.length,
    });

    return { missing, inFridge };
  };

  // Load fridge items on mount
  const loadFridgeItems = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token - cannot load fridge");
        return;
      }

      console.log("🔄 Loading fridge items from API...");
      const res = await fetch("/api/fridge/items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📡 Fridge API response status:", res.status);

      if (!res.ok) {
        console.error("❌ Fridge API error:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      console.log("📦 Raw fridge data:", data);

      // Backend может вернуть items в data.items или data.data.items
      const items = data.items || data.data?.items || data.data || [];
      
      setFridgeItems(items);
      console.log("🧊 Fridge items loaded:", items.length, "items:", items.map((i: any) => i.ingredient_name || i.name));
      
      if (items.length === 0) {
        console.warn("⚠️ WARNING: Fridge is empty! This may cause incorrect missing ingredients calculation.");
      }
    } catch (err) {
      console.error("❌ Failed to load fridge items:", err);
    }
  };

  // Load fridge on mount and when recipe changes
  useEffect(() => {
    if (user) {
      console.log("👤 User loaded, loading fridge items...");
      loadFridgeItems();
    }
  }, [user]);

  // 🔄 Auto-reload fridge when recipe changes or when returning to page
  useEffect(() => {
    if (user && singleRecipe) {
      console.log("� Recipe detected, ensuring fridge is loaded...");
      // Force reload to ensure data is fresh
      loadFridgeItems();
    }
  }, [singleRecipe?.title]); // Reload when recipe title changes (new recipe)

  // 🔄 Re-trigger recomputation when fridgeItems actually loads
  useEffect(() => {
    if (fridgeItems.length > 0 && singleRecipe) {
      console.log("✅ Fridge loaded, recipe exists - data is synced");
    }
  }, [fridgeItems.length, singleRecipe]);

  // 🗑️ Clear all saved recipe matches data from localStorage
  const clearSavedRecipeMatches = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('assistant_recipe_matches');
      localStorage.removeItem('assistant_show_matches');
      localStorage.removeItem('assistant_current_recipe_index');
      localStorage.removeItem('assistant_viewed_recipe_ids');
      console.log('🗑️ Cleared all saved recipe matches from localStorage');
    }
    setRecipeMatches([]);
    setShowMatches(false);
    setCurrentRecipeIndex(0);
    setViewedRecipeIds([]);
  }, []);

  // 🆕 Recipe Matching Functions
  const loadRecipeMatches = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      console.warn("⚠️ No token or user - cannot load recipe matches");
      setAiResponse({ 
        code: 'AUTH_REQUIRED', 
        context: { totalRecipes: stats?.totalRecipes ?? 0 },
        success: false 
      });
      return;
    }

    setMatchesLoading(true);
    setAiResponse(null); // Clear previous messages

    try {
      // ═══════════════════════════════════════════════════════════════════
      // 🔒 COOK_NOW CONTRACT: Rules-based matching only (NO AI)
      // ═══════════════════════════════════════════════════════════════════
      console.log("🎯 cook_now scenario: Loading recipes from GET /api/recipes/match");
      console.log("📋 Parameters:", COOK_NOW_PARAMS);
      console.log(`🚫 Excluding ${viewedRecipeIds.length} already viewed recipe(s):`, viewedRecipeIds);
      
      // ✅ Use deterministic rules-based matching (PRIMARY endpoint)
      const result = await recipeMatchingApi.getRecipeMatches(COOK_NOW_PARAMS, token);
      
      console.log(`✅ Received ${result.count} recipe matches from catalog`);
      
      // Handle empty catalog state (count === 0)
      if (!result.recipes || result.recipes.length === 0) {
        console.info("ℹ️ No recipes in catalog matching fridge contents");
        setRecipeMatches([]);
        
        // 🎨 Show user-friendly message (NO AI fallback - by design)
        setAiResponse({
          code: 'NO_RECIPES_FOR_FRIDGE',
          context: { 
            fridgeItems: fridgeItems.length,
            viewedCount: 0,
            totalRecipes: stats?.totalRecipes ?? 0,
          },
          success: false,
        });
        return;
      }
      
      // Filter out already viewed recipes (frontend-side exclusion)
      const unseenRecipes = result.recipes.filter(
        recipe => !viewedRecipeIds.includes(recipe.recipeId)
      );
      
      console.log(`📊 After filtering: ${unseenRecipes.length} unseen recipes available`);
      
      // Handle "all recipes already viewed" state
      if (unseenRecipes.length === 0) {
        console.info("ℹ️ All available recipes already viewed by user");
        setRecipeMatches([]);
        setAiResponse({
          code: 'ALL_RECIPES_VIEWED',
          context: { 
            fridgeItems: fridgeItems.length,
            viewedCount: viewedRecipeIds.length,
            totalRecipes: stats?.totalRecipes ?? 0,
          },
          success: false,
        });
        return;
      }
      
      // ═══════════════════════════════════════════════════════════════════
      // 📍 Selection Logic: ONE CARD AT A TIME
      // ═══════════════════════════════════════════════════════════════════
      // Priority (already sorted by backend):
      // 1. coverage DESC      → максимальное использование холодильника
      // 2. score DESC         → лучший общий балл
      // 3. usedCount DESC     → больше ингредиентов из холодильника  
      // 4. cookingTime ASC    → быстрее приготовить
      // ═══════════════════════════════════════════════════════════════════
      const recommendation = unseenRecipes[0]; // Backend уже отсортировал
      
      console.log("✅ Selected recipe (top match from rules engine):");
      console.log(`   📖 Title: "${recommendation.title || recommendation.canonicalName}"`);
      console.log(`   🆔 ID: ${recommendation.recipeId}`);
      console.log(`   📊 Coverage: ${recommendation.coverage?.toFixed(0) ?? 'N/A'}%`);
      console.log(`   ⭐ Score: ${recommendation.score ?? 'N/A'}`);
      console.log(`   ✅ Can cook: ${recommendation.canCookNow ?? recommendation.canCook}`);
      console.log(`   🥘 Used: ${recommendation.usedCount ?? recommendation.usedIngredients?.length ?? 0} ingredients`);
      console.log(`   🛒 Missing: ${recommendation.missingCount ?? 0} ingredients`);
      console.log(`   ⏱️ Time: ${recommendation.cookingTime ?? recommendation.timeMinutes ?? 'N/A'} min`);
      
      // Mark this recipe as viewed (prevent showing again)
      setViewedRecipeIds(prev => [...prev, recommendation.recipeId]);
      
      // Set for ONE CARD AT A TIME UX
      setRecipeMatches([recommendation]);
      setCurrentRecipeIndex(0);
      setAiResponse(null); // Clear any error messages
      
    } catch (err: any) {
      console.error("❌ Failed to load AI recommendation:", err);
      
      // Show AIMessageCard for network errors
      setAiResponse({
        code: 'FETCH_FAILED',
        context: { 
          message: err.message || "Nie udało się załadować przepisu",
          totalRecipes: stats?.totalRecipes ?? 0, // 🔢 Frontend enrichment
        },
        success: false,
      });
    } finally {
      setMatchesLoading(false);
    }
  }, [user, viewedRecipeIds, router, fridgeItems.length, stats]);

  const handleCookRecipe = useCallback(async (
    recipeId: string, 
    idempotencyKey: string, 
    servingsMultiplier: number = 1
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Zaloguj się, aby ugotować przepis");
      return;
    }

    try {
      console.log("👨‍🍳 Cooking recipe:", recipeId);
      console.log("   Idempotency key:", idempotencyKey);
      console.log("   Servings multiplier:", servingsMultiplier);
      
      const result = await recipeMatchingApi.cookRecipe(
        recipeId,
        { idempotencyKey, servingsMultiplier },
        token
      );

      if (result.success) {
        // Success toast
        const usedValue = result.economySnapshot.usedValue.toFixed(2);
        const savedValue = result.economySnapshot.wasteRiskSaved.toFixed(2);
        const currency = result.economySnapshot.currency;
        const ingredientsCount = result.ingredientsUsed.length;

        toast.success(
          `Smacznego! Wykorzystano ${ingredientsCount} ${ingredientsCount === 1 ? 'składnik' : 'składników'} z lodówki (${usedValue} ${currency}). Uratowano ${savedValue} ${currency} przed marnowaniem!`,
          { duration: 7000 }
        );

        // 🔄 Optimistic update: update fridge items locally
        const updatedFridgeItems = fridgeItems.map(item => {
          const usedIng = result.ingredientsUsed.find(
            ing => normalizeIngredientName(ing.name) === normalizeIngredientName(item.ingredient_name || item.name)
          );

          if (usedIng) {
            return {
              ...item,
              quantity: usedIng.remainingInFridge,
            };
          }
          return item;
        }).filter(item => item.quantity > 0); // Remove items with 0 quantity

        setFridgeItems(updatedFridgeItems);
        console.log("🧊 Fridge updated locally:", updatedFridgeItems.length, "items remaining");

        // 🔄 Background refresh: reload fridge and recipe matches
        setTimeout(() => {
          loadFridgeItems();
          loadRecipeMatches();
        }, 500);
      }
    } catch (err: any) {
      console.error("❌ Failed to cook recipe:", err);
      
      // Handle specific error cases
      if (err.status === 409) {
        toast.warning("Ten przepis został już oznaczony jako ugotowany");
      } else if (err.status === 404) {
        toast.error("Nie można znaleźć tego przepisu w katalogu");
      } else if (err.status === 400) {
        toast.error(err.message || "Sprawdź czy wszystkie dane są poprawne");
      } else {
        toast.error(err.message || "Nie udało się ugotować. Spróbuj ponownie za chwilę");
      }
    }
  }, [fridgeItems, loadRecipeMatches]);

  const handleAddToShoppingList = useCallback((recipeId: string, missingIngredients: RecipeMatchIngredient[]) => {
    console.log('🛒 Adding to shopping list:', { recipeId, missingIngredients });
    
    if (!missingIngredients || missingIngredients.length === 0) {
      toast.warning('Nie ma składników do dodania');
      return;
    }

    // TODO: Implement API call to POST /api/shopping-list
    // For now, show success toast with details
    const ingredientsList = missingIngredients
      .map(ing => `• ${ing.name} (${ing.quantity} ${ing.unit})`)
      .join('\n');
    
    const totalCost = missingIngredients.reduce(
      (sum, ing) => sum + (ing.estimatedCost || 0), 
      0
    );

    toast.success(
      `Dodano ${missingIngredients.length} ${missingIngredients.length === 1 ? 'składnik' : 'składników'}. Szacunkowy koszt: ~${totalCost.toFixed(2)} PLN`,
      { duration: 8000 }
    );
  }, []);

  // 🆕 Navigate to next recipe (ONE CARD AT A TIME)
  const handleNextRecipe = useCallback(() => {
    setCurrentRecipeIndex((prev) => {
      const next = prev + 1;
      if (next >= recipeMatches.length) {
        return 0; // Loop back to start
      }
      return next;
    });
  }, [recipeMatches.length]);

  const handleReloadRecipes = useCallback(async () => {
    setCurrentRecipeIndex(0);
    setViewedRecipeIds([]); // Reset viewed recipes
    setAiResponse(null); // Clear any AI messages
    setShowMatches(false); // Hide matches section
  }, []);

  // 🎯 Unified AI Action Handler
  const handleAIAction = useCallback((actionId: string) => {
    console.log("🎯 AI Action:", actionId);
    
    switch (actionId) {
      case 'ADD_PRODUCTS':
        router.push('/fridge');
        break;
        
      case 'VIEW_SAVED':
        router.push('/recipes/saved');
        break;
        
      case 'VIEW_CATALOG':
        router.push('/recipes');
        break;
        
      case 'RESET_VIEWED':
        handleReloadRecipes();
        break;
        
      case 'RETRY':
        loadRecipeMatches();
        break;
        
      case 'LOGIN':
        openAuthModal('login');
        break;
        
      case 'GENERATE_RECIPE':
        handleCreateSingleRecipe();
        break;
        
      case 'FIND_URGENT_RECIPES':
        loadRecipeMatches();
        break;
        
      case 'VIEW_FRIDGE':
        router.push('/fridge');
        break;
        
      default:
        console.warn("⚠️ Unknown AI action:", actionId);
    }
  }, [router, handleReloadRecipes, loadRecipeMatches, openAuthModal]);

  // Save recipe to favorites
  const handleSaveRecipe = useCallback(async (recipeId: string) => {
    const token = localStorage.getItem('token');
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
  }, []);

  const handleAnalyze = async (goal: AIGoal) => {
    console.log("🔵 handleAnalyze called with goal:", goal);
    
    // ═══════════════════════════════════════════════════════════════════════════
    // 🔒 ARCHITECTURAL CONTRACT: cook_now uses rules-based matching ONLY
    // ═══════════════════════════════════════════════════════════════════════════
    // 
    // Scenario: "cook_now" (Що можу приготувати зараз?)
    // 
    // Implementation:
    // ✅ PRIMARY:   GET /api/recipes/match with COOK_NOW_PARAMS
    // ❌ FORBIDDEN: POST /api/recipes/recommendations
    // ❌ FORBIDDEN: AI fallback when count > 0
    // 
    // Rationale:
    // - Deterministic matching = 100x cheaper than AI
    // - User expects instant results, not AI generation
    // - Catalog recipes already exist, no need to generate
    // 
    // AI ONLY used when:
    // - count === 0 (no recipes in catalog match fridge)
    // - User explicitly requests "generate new recipe"
    // 
    // ═══════════════════════════════════════════════════════════════════════════
    if (goal === "cook_now") {
      console.log("🟢 cook_now scenario triggered (RULES-BASED, NO AI)");
      console.log("📍 Endpoint: GET /api/recipes/match");
      console.log("🚫 AI fallback: DISABLED by architectural contract");
      
      setShowMatches(true); // Show the matches section
      
      // Load recipes from catalog if not already loaded
      if (recipeMatches.length === 0) {
        await loadRecipeMatches();
      }
      
      return; // NEVER proceed to AI for cook_now
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // Other goals (expiring_soon, save_money, quick_meal) can use AI
    // ═══════════════════════════════════════════════════════════════════════════
    
    // Clear recipe when running other goals
    clearRecipe();
    setRecipeError(null);
    
    console.log("🟡 Running AI analysis for goal:", goal);
    console.log("📍 Endpoint: /api/ai/fridge/analyze");
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
    clearRecipe();
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

      // ✅ SUCCESS - save to RecipeContext (persists across navigation & page reload)
      setRecipe({
        recipe: recipe,
        usedProducts: data.data?.usedProducts ?? [],
      });
      
      setMissingIngredientsAdded(false); // Reset flag on new recipe
      console.log("✅ Recipe saved to RecipeContext (persists across navigation & reload)");
      console.log("📦 Used products count:", data.data?.usedProducts?.length ?? 0);
      console.log("🛒 Missing ingredients count:", recipe.ingredientsMissing?.length ?? 0);
      console.log("💰 Economy data:", recipe.economy);

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

  // 🔑 Функция добавления бракующих складників до lodówки
  const handleAddMissingIngredients = async () => {
    const { missing: realMissing } = recomputeMissingIngredients();
    
    if (!singleRecipe || !realMissing || realMissing.length === 0) {
      console.warn("⚠️ No real missing ingredients to add");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Wymagana autoryzacja");
        setActionLoading(false);
        return;
      }

      const ingredientsToAdd = realMissing.map((ing: any) => ({
        name: ing.name,
        quantity: Number(ing.quantity) || 1,
        unit: ing.unit || "szt",
        category: "other", // default category
      }));

      console.log("➕ Adding real missing ingredients:", ingredientsToAdd);

      const response = await fridgeApi.addIngredientsBatch(ingredientsToAdd, token);

      if (response.success && response.added > 0) {
        setMissingIngredientsAdded(true);
        const message = response.failed > 0 
          ? `✅ Dodano ${response.added} składników. ${response.failed} nie znaleziono w bazie.`
          : `✅ Dodano ${response.added} składników do lodówki!`;
        alert(message);
        
        // 🔄 Reload fridge items after adding
        await loadFridgeItems();
        
        // 🔄 Try to refresh recipe economy (non-critical)
        console.log("🔄 Attempting to refresh recipe economy...");
        try {
          await refreshRecipe();
          console.log("✅ Recipe economy refresh completed");
        } catch (err) {
          console.warn("⚠️ Recipe economy refresh failed (non-critical):", err);
          // This is fine - user can continue with original economy
        }
      } else {
        alert(`❌ Nie udało się dodać składników (${response.failed} failed)`);
      }
    } catch (err: any) {
      console.error("Error adding missing ingredients:", err);
      alert(`❌ Błąd: ${err.message || "Nie udało się dodać składników"}`);
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
            onClick={() => openAuthModal("login")}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
          >
            Zaloguj się
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <PageLayout
      title="AI Asystent Kuchenny | Modern Food Academy"
      description="Inteligentne podpowiedzi kulinarne oparte na zawartości twojej lodówki. Generuj przepisy, sprawdzaj składniki i gotuj z AI."
      background="gradient-purple"
      maxWidth="lg"
    >
      <PageHeader
        title="AI Asystent Kuchenny"
        description="Inteligentne podpowiedzi na podstawie twojej lodówki"
        icon={<Sparkles className="w-6 h-6" />}
      />

        {/* AI Actions - Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AIActions onAnalyze={handleAnalyze} loading={loading || isLoading} />
        </motion.div>

        {/* 🆕 Recipe Matching Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Toggle Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Rekomendacja AI
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Najlepszy przepis na teraz
              </p>
            </div>
            <div className="flex gap-2">
              {/* Clear Button - only show if there are saved recipes */}
              {recipeMatches.length > 0 && (
                <button
                  onClick={() => {
                    clearSavedRecipeMatches();
                    toast.info("Historia przepisów wyczyszczona");
                  }}
                  className="px-4 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-all flex items-center gap-2 shadow-sm"
                  title="Wyczyść zapisane przepisy"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              
              <button
                onClick={() => {
                  setShowMatches(!showMatches);
                  if (!showMatches && recipeMatches.length === 0) {
                    loadRecipeMatches();
                  }
                }}
                disabled={matchesLoading}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium transition-all flex items-center gap-2 shadow-sm"
              >
                {matchesLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Ładowanie...
                  </>
                ) : showMatches ? (
                  <>
                    Ukryj przepisy
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Pokaż przepisy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Matches Display */}
          {showMatches && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* ✨ Show AIMessageCard if present (unified AI-UX) */}
              {aiResponse && !aiResponse.success && (
                <AIMessageCard
                  code={aiResponse.code!}
                  context={aiResponse.context}
                  onAction={handleAIAction}
                  onDismiss={() => setAiResponse(null)}
                />
              )}

              {/* Empty State - Only show if no AI message and no matches */}
              {!matchesLoading && recipeMatches.length === 0 && !aiResponse && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-8 text-center">
                  <Search className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Kliknij "Pokaż przepisy" aby rozpocząć
                  </p>
                </div>
              )}

              {/* 🆕 ONE CARD AT A TIME - Single Recipe Display */}
              {recipeMatches.length > 0 && (() => {
                const currentRecipe = recipeMatches[currentRecipeIndex];
                
                return (
                  <div className="space-y-6">
                    {/* Main Recipe Card */}
                    <AIRecommendationCard
                      recipe={currentRecipe}
                      onCook={(servingsMultiplier) => handleCookRecipe(currentRecipe.recipeId, generateUUID(), servingsMultiplier)}
                      onSave={() => handleSaveRecipe(currentRecipe.recipeId)}
                      onAddToCart={() => handleAddToShoppingList(currentRecipe.recipeId, currentRecipe.missingIngredients ?? [])}
                      onRefresh={handleReloadRecipes}
                      isCooking={matchesLoading}
                      isSaving={false}
                      weeklyBudget={undefined} // TODO: Get from useWallet() when integrated
                    />
                  </div>
                );
              })()}
            </motion.div>
          )}
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
    </PageLayout>
  );
}
