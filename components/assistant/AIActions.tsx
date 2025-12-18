"use client";

import { motion } from "framer-motion";
import { ChefHat, Calendar, AlertCircle, TrendingDown } from "lucide-react";
import type { AIGoal } from "@/hooks/useAI";

interface AIActionsProps {
  onAnalyze: (goal: AIGoal) => void;
  loading?: boolean;
}

export function AIActions({ onAnalyze, loading }: AIActionsProps) {
  const actions = [
    {
      goal: "today_meals" as AIGoal,
      icon: <ChefHat className="w-5 h-5" />,
      label: "Przepis na dziś",
      description: "AI zaproponuje przepis na podstawie produktów w lodówce",
      color: "from-orange-500 to-red-500",
      hoverColor: "hover:from-orange-600 hover:to-red-600",
    },
    {
      goal: "3_days_plan" as AIGoal,
      icon: <Calendar className="w-5 h-5" />,
      label: "Plan na 3 dni",
      description: "Stwórz plan posiłków na najbliższe 3 dni",
      color: "from-blue-500 to-indigo-500",
      hoverColor: "hover:from-blue-600 hover:to-indigo-600",
    },
    {
      goal: "reduce_waste" as AIGoal,
      icon: <AlertCircle className="w-5 h-5" />,
      label: "Wykorzystaj kończące się",
      description: "Co zrobić z produktami o krótkim terminie ważności",
      color: "from-yellow-500 to-orange-500",
      hoverColor: "hover:from-yellow-600 hover:to-orange-600",
    },
    {
      goal: "budget_review" as AIGoal,
      icon: <TrendingDown className="w-5 h-5" />,
      label: "Analiza wydatków",
      description: "Przeanalizuj wydatki i otrzymaj porady oszczędnościowe",
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
          onClick={() => onAnalyze(action.goal)}
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
