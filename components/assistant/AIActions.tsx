"use client";

import { motion } from "framer-motion";
import { ChefHat, Calendar, AlertCircle, TrendingDown } from "lucide-react";
import type { AIGoal } from "@/hooks/useAI";

interface AIActionsProps {
  onAnalyze: (goal: AIGoal) => void | Promise<void>;
  loading?: boolean;
}

export function AIActions({ onAnalyze, loading }: AIActionsProps) {
  console.log("🟦 AIActions rendered, onAnalyze type:", typeof onAnalyze);
  console.log("🟦 AIActions loading state:", loading);
  
  const actions = [
    {
      goal: "find_recipes" as AIGoal,
      icon: <ChefHat className="w-5 h-5" />,
      label: "Znajdź przepisy z lodówki",
      description: "� Przepisy z katalogu dopasowane do Twoich składników",
      color: "from-purple-500 to-pink-500",
      hoverColor: "hover:from-purple-600 hover:to-pink-600",
    },
    {
      goal: "3_days_plan" as AIGoal,
      icon: <Calendar className="w-5 h-5" />,
      label: "Zaplanuj menu na 3 dni",
      description: "Spójny plan dań dopasowany do Twojej kuchni",
      color: "from-blue-500 to-indigo-500",
      hoverColor: "hover:from-blue-600 hover:to-indigo-600",
    },
    {
      goal: "reduce_waste" as AIGoal,
      icon: <AlertCircle className="w-5 h-5" />,
      label: "Zoptymalizuj produkty",
      description: "Przepisy z produktów o krótkim terminie ważności",
      color: "from-yellow-500 to-orange-500",
      hoverColor: "hover:from-yellow-600 hover:to-orange-600",
    },
    {
      goal: "budget_review" as AIGoal,
      icon: <TrendingDown className="w-5 h-5" />,
      label: "Przeanalizuj koszty kuchni",
      description: "Kontrola wydatków i realne oszczędności",
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:from-green-600 hover:to-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.button
          key={action.goal}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={async () => {
            console.log("🔴 Button clicked:", action.label, "goal:", action.goal);
            console.log("🔴 Loading state:", loading);
            console.log("🔴 About to call onAnalyze with goal:", action.goal);
            try {
              await onAnalyze(action.goal);
              console.log("🟢 onAnalyze completed successfully");
            } catch (error) {
              console.error("💥 Error calling onAnalyze:", error);
            }
          }}
          disabled={loading}
          className={`
            relative p-4 rounded-xl text-white
            bg-gradient-to-br ${action.color} ${action.hoverColor}
            shadow-lg hover:shadow-xl
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            flex flex-col items-start gap-3 text-left
          `}
        >
          {loading ? (
            <div className="w-full flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 w-full">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  {action.icon}
                </div>
                <span className="text-base font-bold leading-tight">{action.label}</span>
              </div>
              <p className="text-sm text-white/90 leading-snug">
                {action.description}
              </p>
            </>
          )}
        </motion.button>
      ))}
    </div>
  );
}
