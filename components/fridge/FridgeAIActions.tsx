"use client";

import { useState } from "react";
import { ChefHat, Calendar, AlertCircle, TrendingDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type AIGoal = "recipe_today" | "plan_3days" | "use_expiring" | "spending_analysis";

interface FridgeAIActionsProps {
  onAnalyze: (goal: AIGoal) => void;
  loading?: boolean;
}

export default function FridgeAIActions({ onAnalyze, loading }: FridgeAIActionsProps) {
  const actions = [
    {
      goal: "recipe_today" as AIGoal,
      icon: <ChefHat className="w-5 h-5" />,
      label: "Что приготовить сегодня",
      emoji: "🍳",
      color: "from-orange-500 to-red-500",
      hoverColor: "hover:from-orange-600 hover:to-red-600",
    },
    {
      goal: "plan_3days" as AIGoal,
      icon: <Calendar className="w-5 h-5" />,
      label: "План на 3 дня",
      emoji: "📅",
      color: "from-blue-500 to-indigo-500",
      hoverColor: "hover:from-blue-600 hover:to-indigo-600",
    },
    {
      goal: "use_expiring" as AIGoal,
      icon: <AlertCircle className="w-5 h-5" />,
      label: "Что срочно использовать",
      emoji: "♻️",
      color: "from-yellow-500 to-orange-500",
      hoverColor: "hover:from-yellow-600 hover:to-orange-600",
    },
    {
      goal: "spending_analysis" as AIGoal,
      icon: <TrendingDown className="w-5 h-5" />,
      label: "Анализ расходов",
      emoji: "💸",
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:from-green-600 hover:to-emerald-600",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          AI Asystent Kuchenny
        </h3>
      </div>
      
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
              relative p-4 rounded-xl text-white font-semibold
              bg-gradient-to-br ${action.color} ${action.hoverColor}
              shadow-lg hover:shadow-xl
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              flex flex-col items-center gap-2 text-center
            `}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span className="text-2xl">{action.emoji}</span>
                <span className="text-sm leading-tight">{action.label}</span>
              </>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
