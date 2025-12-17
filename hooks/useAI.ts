import { useState } from "react";

export type AIGoal = "today_meals" | "3_days_plan" | "reduce_waste" | "budget_review";

export interface Recipe {
  id?: string;
  title: string;
  description?: string;
  ingredients: Array<{ name: string; quantity?: string; unit?: string }>;
  steps: string[];
  servings?: number;
  timeMinutes?: number;
  difficulty?: string;
  imageUrl?: string;
}

export interface AIResult {
  recipes?: Recipe[];
  plans?: any[];
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

  return { runAI, result, loading, error, clearResult };
}
