"use client";

import { useState } from "react";
import { ChefHat, Calendar, AlertCircle, TrendingDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type AIGoal = "today_meals" | "3_days_plan" | "reduce_waste" | "budget_review";

interface FridgeAIActionsProps {
  onAnalyze: (goal: AIGoal) => void;
  loading?: boolean;
}

export default function FridgeAIActions({ onAnalyze, loading }: FridgeAIActionsProps) {
  const actions = [
    {
      goal: "today_meals" as AIGoal,
      icon: <ChefHat className="w-4 h-4" />,
      label: "Przepis na dziś",
      description: "AI zaproponuje przepis na podstawie produktów w lodówce",
      color: "from-orange-500 to-red-500",
      hoverColor: "hover:from-orange-600 hover:to-red-600",
    },
    {
      goal: "3_days_plan" as AIGoal,
      icon: <Calendar className="w-4 h-4" />,
      label: "Plan na 3 dni",
      description: "Stwórz plan posiłków na najbliższe 3 dni",
      color: "from-blue-500 to-indigo-500",
      hoverColor: "hover:from-blue-600 hover:to-indigo-600",
    },
    {
      goal: "reduce_waste" as AIGoal,
      icon: <AlertCircle className="w-4 h-4" />,
      label: "Kończące się",
      description: "Co zrobić z produktami o krótkim terminie ważności",
      color: "from-yellow-500 to-orange-500",
      hoverColor: "hover:from-yellow-600 hover:to-orange-600",
    },
    {
      goal: "budget_review" as AIGoal,
      icon: <TrendingDown className="w-4 h-4" />,
      label: "Analiza wydatków",
      description: "Przeanalizuj wydatki i otrzymaj porady oszczędnościowe",
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:from-green-600 hover:to-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action, index) => (
          <motion.button
            key={action.goal}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onAnalyze(action.goal)}
            disabled={loading}
            className={`
              relative p-3 rounded-lg text-white
              bg-gradient-to-br ${action.color} ${action.hoverColor}
              shadow-md hover:shadow-lg
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              flex flex-col items-start gap-2 text-left
            `}
          >
            {loading ? (
              <div className="w-full flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 w-full">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {action.icon}
                  </div>
                  <span className="text-sm font-semibold leading-tight">{action.label}</span>
                </div>
                <p className="text-xs text-white/90 leading-snug">
                  {action.description}
                </p>
              </>
            )}
          </motion.button>
        ))}
      </div>
  );
}
