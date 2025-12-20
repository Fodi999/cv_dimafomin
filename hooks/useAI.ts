import { useState } from "react";

export type AIGoal = "today_meals" | "3_days_plan" | "reduce_waste" | "budget_review";

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeEconomy {
  usedFromFridge: boolean;
  estimatedExtraCost: number;
  currency: string;
}

export interface Recipe {
  id?: string;
  title: string;
  name?: string; // Alternate field name from backend
  description?: string;
  ingredients?: RecipeIngredient[]; // Legacy field
  ingredientsUsed?: RecipeIngredient[]; // Backend returns this
  ingredientsMissing?: RecipeIngredient[]; // Missing ingredients to buy
  steps: string[];
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Błąd podczas analizy AI");
      }

      const data = await response.json();
      
      // Парсим ответ от backend
      const aiResult: AIResult = {
        recipes: data?.data?.recipes || data?.recipes || [],
        plans: data?.data?.plans || data?.plans || [],
        analysis: data?.data?.result || data?.data?.text || data?.result || data?.text,
        message: data?.message
      };

      setResult(aiResult);
    } catch (err: any) {
      console.error("AI Analysis error:", err);
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
