"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle, Clock, RefreshCw, Save, FileText, Search, Filter, Plus, Minus, Users, Star, RotateCw } from "lucide-react";
import { AIActions } from "@/components/assistant/AIActions";
import { AIResults } from "@/components/assistant/AIResults";
import { useAI, type AIGoal, type Recipe } from "@/hooks/useAI";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipe } from "@/contexts/RecipeContext";
import { useRouter } from "next/navigation";
import { fridgeApi, recipeMatchingApi, type RecipeMatch, type RecipeMatchIngredient } from "@/lib/api";
import RecipeMatchCard from "@/components/recipes/RecipeMatchCard";
import { generateUUID } from "@/lib/uuid";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/common/Toast";

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
  
  // 🆕 Toast notifications
  const toast = useToast();

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
  const [matchesError, setMatchesError] = useState<string | null>(null);
  
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
      return;
    }

    setMatchesLoading(true);
    setMatchesError(null);

    try {
      console.log("🎯 Loading AI recommendation...");
      console.log(`   Excluding ${viewedRecipeIds.length} recipe(s):`, viewedRecipeIds);
      
      // 🆕 Используем /recommendations с excludeRecipeIds для избегания дубликатов
      const recommendation = await recipeMatchingApi.getRecommendation(
        'fridge', 
        20, 
        token,
        viewedRecipeIds // ← Передаём список просмотренных рецептов
      );
      
      if (!recommendation) {
        // Если закончились рецепты, сбрасываем список и пробуем заново
        toast.info("Показано все доступные рецепты! Начинаю сначала...");
        setViewedRecipeIds([]);
        return; // User can click "Odśwież" again
      }
      
      console.log("✅ AI Recommendation received:");
      console.log(`   Recipe: "${recommendation.title}" (ID: ${recommendation.recipeId})`);
      console.log(`   Coverage: ${recommendation.coverage.toFixed(0)}%`);
      console.log(`   Score: ${recommendation.score}`);
      console.log(`   Can cook now: ${recommendation.canCookNow}`);
      console.log(`   Used ingredients: ${recommendation.usedCount}`);
      console.log(`   Missing ingredients: ${recommendation.missingCount}`);
      
      // Сохраняем ID этого рецепта, чтобы не показывать его снова
      setViewedRecipeIds(prev => [...prev, recommendation.recipeId]);
      
      // Обёртываем в массив для совместимости с ONE CARD AT A TIME UX
      setRecipeMatches([recommendation]);
      setCurrentRecipeIndex(0);
      
    } catch (err: any) {
      console.error("❌ Failed to load AI recommendation:", err);
      setMatchesError(err.message || "Nie udało się załadować rekomendacji");
      
      // Show toast error
      toast.error(
        err.message || "Nie udało się załadować przepisu"
      );
    } finally {
      setMatchesLoading(false);
    }
  }, [user, toast, viewedRecipeIds]);

  const handleCookRecipe = useCallback(async (
    recipeId: string, 
    idempotencyKey: string, 
    servingsMultiplier: number = 1
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Wymagana autoryzacja", "Zaloguj się, aby ugotować przepis");
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
        // 🎉 Success toast
        const usedValue = result.economySnapshot.usedValue.toFixed(2);
        const savedValue = result.economySnapshot.wasteRiskSaved.toFixed(2);
        const currency = result.economySnapshot.currency;
        const ingredientsCount = result.ingredientsUsed.length;

        toast.success(
          "Smacznego! 🍽️",
          `Wykorzystano ${ingredientsCount} ${ingredientsCount === 1 ? 'składnik' : 'składników'} z lodówki (${usedValue} ${currency}). Uratowano ${savedValue} ${currency} przed marnowaniem!`,
          7000
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
        toast.warning("Już ugotowane", "Ten przepis został już oznaczony jako ugotowany");
      } else if (err.status === 404) {
        toast.error("Przepis nie znaleziony", "Nie można znaleźć tego przepisu w katalogu");
      } else if (err.status === 400) {
        toast.error("Błąd w danych", err.message || "Sprawdź czy wszystkie dane są poprawne");
      } else {
        toast.error("Nie udało się ugotować", err.message || "Spróbuj ponownie za chwilę");
      }
    }
  }, [fridgeItems, loadRecipeMatches]);

  const handleAddToShoppingList = useCallback((recipeId: string, missingIngredients: RecipeMatchIngredient[]) => {
    console.log('🛒 Adding to shopping list:', { recipeId, missingIngredients });
    
    if (!missingIngredients || missingIngredients.length === 0) {
      toast.warning('Brak składników', 'Nie ma składników do dodania');
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
      `Dodano ${missingIngredients.length} ${missingIngredients.length === 1 ? 'składnik' : 'składników'}`,
      `${ingredientsList}\n\nSzacunkowy koszt: ~${totalCost.toFixed(2)} PLN`,
      8000
    );
  }, [toast]);

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

  // 🆕 Reload recipes from API
  const handleReloadRecipes = useCallback(async () => {
    setCurrentRecipeIndex(0);
    await loadRecipeMatches();
  }, [loadRecipeMatches]);

  // 🆕 Save recipe to favorites
  const handleSaveRecipe = useCallback(async (recipeId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Wymagana autoryzacja', 'Zaloguj się, aby zapisać przepis');
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
        toast.success('Przepis zapisany!', 'Znajdziesz go w sekcji "Zapisane przepisy"', 5000);
      } else {
        throw new Error(data.message || 'Nie udało się zapisać przepisu');
      }
    } catch (err: any) {
      console.error('❌ Failed to save recipe:', err);
      toast.error('Nie udało się zapisać', err.message || 'Spróbuj ponownie');
    }
  }, [toast]);

  const handleAnalyze = async (goal: AIGoal) => {
    console.log("🔵 handleAnalyze called with goal:", goal);
    
    // 🆕 Special handling for "find_recipes" - load matched recipes from catalog
    if (goal === "find_recipes") {
      console.log("🟢 Detected find_recipes goal - loading recipes from catalog");
      console.log("📍 Endpoint: GET /api/recipes/match");
      setShowMatches(true); // Show the matches section
      if (recipeMatches.length === 0) {
        await loadRecipeMatches(); // Load if not already loaded
      }
      return;
    }
    
    // Clear recipe when running other goals
    clearRecipe();
    setRecipeError(null);
    
    console.log("🟡 Running standard AI analysis for goal:", goal);
    console.log("📍 Endpoint: /api/ai/fridge/analyze (generic analysis)");
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
                  🗑️
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
              {/* Error State */}
              {matchesError && (
                <div className="rounded-xl border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900 dark:text-red-200 mb-1">
                        Błąd ładowania przepisów
                      </p>
                      <p className="text-sm text-red-800 dark:text-red-300">
                        {matchesError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!matchesLoading && recipeMatches.length === 0 && !matchesError && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-8 text-center">
                  <Search className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Nie znaleziono dopasowanych przepisów
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Spróbuj dodać więcej produktów do lodówki
                  </p>
                </div>
              )}

              {/* 🆕 ONE CARD AT A TIME - Single Recipe Display */}
              {recipeMatches.length > 0 && (() => {
                const currentRecipe = recipeMatches[currentRecipeIndex];
                
                return (
                  <div className="space-y-6">
                    {/* Recipe Progress Indicator */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>
                        Przepis {currentRecipeIndex + 1} z {recipeMatches.length}
                      </span>
                      <span className="text-xs">
                        Score: <strong className="text-purple-600 dark:text-purple-400">{currentRecipe.score} pts</strong>
                      </span>
                    </div>

                    {/* Main Recipe Card */}
                    <RecipeMatchCard
                      key={currentRecipe.recipeId}
                      recipe={currentRecipe}
                      onCook={handleCookRecipe}
                      onAddToShoppingList={handleAddToShoppingList}
                      isLoading={matchesLoading}
                    />

                    {/* Action Buttons Below Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Reload - Get New AI Recommendation */}
                      <button
                        onClick={handleReloadRecipes}
                        disabled={matchesLoading}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <RotateCw className={`w-5 h-5 ${matchesLoading ? 'animate-spin' : ''}`} />
                        � Odśwież propozycję
                      </button>

                      {/* Save Recipe */}
                      <button
                        onClick={() => handleSaveRecipe(currentRecipe.recipeId)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Star className="w-5 h-5" />
                        ⭐ Zapisz przepis
                      </button>

                      {/* Reset Viewed Recipes - Show All Again */}
                      {viewedRecipeIds.length > 1 && (
                        <button
                          onClick={() => {
                            setViewedRecipeIds([]);
                            toast.info("Lista resetowana - pokażę wszystkie przepisy ponownie");
                          }}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <RotateCw className="w-5 h-5" />
                          🔄 Resetuj ({viewedRecipeIds.length} przepisów)
                        </button>
                      )}
                    </div>

                    {/* AI Hint - Why This Recipe? */}
                    {currentRecipe.score >= 80 && (
                      <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 border border-purple-200 dark:border-purple-800/30">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">💡</div>
                          <div>
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                              Dlaczego ten przepis?
                            </h4>
                            <p className="text-sm text-purple-800 dark:text-purple-200">
                              Ten przepis został wybrany, ponieważ wykorzystuje <strong>{currentRecipe.usedCount} składników</strong> z Twojej lodówki 
                              ({currentRecipe.coverage.toFixed(0)}% pokrycia) i możesz go ugotować {currentRecipe.canCookNow ? 'od razu' : `dokupując tylko ${currentRecipe.missingCount} składników`}.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
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
      </div>
      
      {/* 🆕 Toast Notifications Container */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  );
}
