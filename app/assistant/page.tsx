"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { AIActions } from "@/components/assistant/AIActions";
import { AIResults } from "@/components/assistant/AIResults";
import { useAI, type AIGoal, type Recipe } from "@/hooks/useAI";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function AssistantPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { runAI, result, loading, error, clearResult } = useAI();
  const [actionLoading, setActionLoading] = useState(false);

  const handleAnalyze = async (goal: AIGoal) => {
    await runAI(goal);
  };

  const handleAddToPlan = async (recipe: Recipe) => {
    setActionLoading(true);
    try {
      // TODO: Implement API call to add recipe to meal plan
      console.log("Adding to plan:", recipe);
      // const response = await fetch("/api/meal-plan", { ... });
      alert(`Przepis "${recipe.title}" dodany do planu!`);
    } catch (err) {
      console.error("Error adding to plan:", err);
      alert("Błąd podczas dodawania do planu");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkDone = async (recipe: Recipe) => {
    setActionLoading(true);
    try {
      // TODO: Implement API call to deduct ingredients from fridge
      console.log("Marking as done:", recipe);
      // const response = await fetch("/api/fridge/deduct", { ... });
      alert(`Przepis "${recipe.title}" oznaczony jako zrobiony! Produkty zostały odjęte.`);
    } catch (err) {
      console.error("Error marking as done:", err);
      alert("Błąd podczas oznaczania jako zrobione");
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
          <AIActions onAnalyze={handleAnalyze} loading={loading} />
        </motion.div>

        {/* AI Results - Recipe Cards */}
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
      </div>
    </div>
  );
}
