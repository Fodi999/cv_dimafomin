"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AIActions } from "@/components/assistant/AIActions";
import { AIResults } from "@/components/assistant/AIResults";
import { useAI, type AIGoal, type Recipe } from "@/hooks/useAI";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function CreateRecipeChatPage() {
  const { user } = useUser();
  const router = useRouter();
  const { loading, result, error, runAI } = useAI();

  const [loadingAction, setLoadingAction] = useState<string>("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Ładowanie...</p>
        </div>
      </div>
    );
  }

  const handleAIAnalyze = async (goal: AIGoal, preferences?: { time?: string; budget?: string }) => {
    setLoadingAction(goal);
    await runAI(goal, preferences);
    setLoadingAction("");
  };

  const handleAddToPlan = async (recipe: Recipe) => {
    console.log("Adding to meal plan:", recipe);
    // TODO: Implement API call to backend
    // POST /api/meal-plan/add { recipe_id, date }
    alert(`Przepis "${recipe.title}" zostanie dodany do planu! (TODO: backend API)`);
  };

  const handleMarkDone = async (recipe: Recipe) => {
    console.log("Marking as done:", recipe);
    // TODO: Implement API call to deduct ingredients from fridge
    // POST /api/fridge/deduct { ingredients: [...] }
    alert(`Przepis "${recipe.title}" oznaczony jako gotowy! (TODO: deduct ingredients from fridge)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800 p-4 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Sparkles className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Assistant
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Wybierz akcję, a sztuczna inteligencja pomoże Ci zarządzać kuchnią
          </p>
        </motion.div>

        {/* AI Actions */}
        <AIActions
          onAnalyze={handleAIAnalyze}
          loading={loading}
          loadingAction={loadingAction}
        />

        {/* Results */}
        <AIResults
          result={result}
          loading={loading}
          error={error}
          onAddToPlan={handleAddToPlan}
          onMarkDone={handleMarkDone}
        />
      </div>
    </div>
  );
}
