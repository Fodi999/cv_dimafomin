"use client";

import { motion } from "framer-motion";
import { ChefHat, Clock, AlertTriangle, Coins, Bot } from "lucide-react";
import type { AIGoal } from "@/hooks/useAI";
import { useTranslations } from "@/hooks/useTranslations";

interface AIActionsProps {
  onAnalyze: (goal: AIGoal) => void | Promise<void>;
  loading?: boolean;
}

export function AIActions({ onAnalyze, loading }: AIActionsProps) {
  const { t } = useTranslations();
  
  // 🎯 DECISION ENGINE PRESETS (НЕ AI!)
  // AI = narrator/mentor, НЕ brain/decision-maker
  // Ці кнопки викликають rules-based decision engine, а не AI-аналіз
  
  // 🔥 NEW: Decision Engine Presets (не чат, а інструмент)
  const actions: Array<{ 
    goal: AIGoal; 
    icon: React.ReactNode;
    labelKey: string;
    descKey: string;
    color: string; 
    hoverColor: string;
  }> = [
    {
      goal: "cook_now",
      icon: <ChefHat className="w-6 h-6" />,
      labelKey: "ai.actions.cook_now.label",
      descKey: "ai.actions.cook_now.desc",
      color: "from-sky-500 to-cyan-500",
      hoverColor: "hover:from-sky-600 hover:to-cyan-600",
    },
    {
      goal: "expiring_soon",
      icon: <AlertTriangle className="w-6 h-6" />,
      labelKey: "ai.actions.expiring_soon.label",
      descKey: "ai.actions.expiring_soon.desc",
      color: "from-orange-500 to-red-500",
      hoverColor: "hover:from-orange-600 hover:to-red-600",
    },
    {
      goal: "save_money",
      icon: <Coins className="w-6 h-6" />,
      labelKey: "ai.actions.save_money.label",
      descKey: "ai.actions.save_money.desc",
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:from-green-600 hover:to-emerald-600",
    },
    {
      goal: "quick_meal",
      icon: <Clock className="w-6 h-6" />,
      labelKey: "ai.actions.quick_meal.label",
      descKey: "ai.actions.quick_meal.desc",
      color: "from-purple-500 to-pink-500",
      hoverColor: "hover:from-purple-600 hover:to-pink-600",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bot className="w-8 h-8 text-blue-500 dark:text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("ai.actions.title" as any)}
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {t("ai.actions.subtitle" as any)}
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.goal}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={async () => {
              console.log("🎯 Decision Engine triggered:", action.goal);
              await onAnalyze(action.goal);
            }}
            disabled={loading}
            className={`
              relative p-6 rounded-xl text-white
              bg-gradient-to-br ${action.color} ${action.hoverColor}
              shadow-lg hover:shadow-2xl hover:scale-[1.02]
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-start gap-4 text-left
            `}
          >
            {loading ? (
              <div className="w-full flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent" />
              </div>
            ) : (
              <>
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    {action.icon}
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold mb-1 leading-tight">
                    {t(action.labelKey as any)}
                  </h3>
                  <p className="text-sm text-white/90 leading-snug">
                    {t(action.descKey as any)}
                  </p>
                </div>
              </>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
