import { useState } from "react";

// 🔥 АРХІТЕКТУРНЕ ПРАВИЛО:
// AI = narrator/mentor (текст, поради, пояснення)
// Decision Engine = brain (вибір рецептів, розрахунки)
// 
// Цей хук викликає Decision Engine (/recipes/match), НЕ AI!
// Для чистого AI використовуй lib/api/ai.ts (mentorChat, generateRecipe)

export type AIGoal = "cook_now" | "expiring_soon" | "save_money" | "quick_meal";

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeEconomy {
  usedFromFridge: boolean;
  estimatedExtraCost: number;
  currency: string;
  usedValue?: number; // Wartość użytych produktów z lodówki
  savedMoney?: number; // Ile zaoszczędziłeś
}

export interface Recipe {
  id?: string;
  title: string;
  name?: string; // Alternate field name from backend
  description?: string;
  ingredients?: RecipeIngredient[]; // Legacy field
  ingredientsUsed?: RecipeIngredient[]; // Backend returns this
  ingredientsMissing?: RecipeIngredient[]; // Missing ingredients to buy
  steps?: string[]; // ✅ OPTIONAL - backend не завжди повертає
  servings?: number;
  portions?: number; // Alternate field name
  timeMinutes?: number;
  cookingTime?: number; // Alternate field name
  difficulty?: string;
  chefTips?: string[]; // Chef's tips and advice
  expiryPriority?: "critical" | "warning" | "ok" | null;
  expires_priority?: string; // Alternate field name
  economy?: RecipeEconomy; // Cost and fridge usage info
  imageUrl?: string;
  
  // ✅ UX: Контекстне пояснення ЧОМУ цей рецепт підходить
  reason?: string; // "Masz wszystkie składniki", "Zużywa produkty z krótkim terminem", etc.
  contextMessage?: string; // Загальне повідомлення для всіх рецептів сценарію
  matchPercentage?: number; // % доступних інгредієнтів
}

export interface DayPlan {
  day: string;
  date?: string;
  meals: Recipe[];
}

export interface UrgentItem {
  name: string;
  daysLeft: number;
  quantity?: number;
  unit?: string;
  suggestion: string;
}

export interface CostInsight {
  totalSpent: number;
  avgPerDay?: number;
  avgPerWeek?: number;
  topExpenses?: Array<{ name: string; amount: number; percentage: number }>;
  savings?: Array<{ tip: string; potential: number }>;
  comparison?: {
    vs_last_week?: number;
    vs_last_month?: number;
  };
}

export interface AIResult {
  recipes?: Recipe[];
  plan?: DayPlan[];
  urgent?: UrgentItem[];
  budget?: CostInsight;
  plans?: any[]; // legacy support
  analysis?: string;
  message?: string;
}

export function useAI() {
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAI(goal: AIGoal, preferences?: { time?: string; budget?: string }) {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Brak tokenu autoryzacji");
      }

      console.log(`🔥 Running DECISION ENGINE (not AI!) for goal: ${goal}`);

      const response = await fetch("/api/ai/fridge/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          goal,
          preferences: preferences || { time: "normal", budget: "normal" }
        }),
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        console.error("❌ Decision engine failed:", errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Recipe matching failed`);
      }

      const data = await response.json();
      
      console.log("✅ Decision engine response:", {
        goal: data.goal,
        recipesCount: data.recipes?.length || 0,
        usedDecisionEngine: data.usedDecisionEngine,
        message: data.message
      });

      // Парсим ответ від decision engine
      const aiResult: AIResult = {
        recipes: data.recipes || [],
        message: data.message,
        analysis: data.usedDecisionEngine 
          ? `🎯 Decision Engine: ${data.message}` 
          : data.analysis
      };

      setResult(aiResult);
    } catch (err: any) {
      console.error("❌ Decision Engine error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function clearResult() {
    setResult(null);
    setError(null);
  }

  return { runAI, result, loading, error, clearResult, setLoading };
}
