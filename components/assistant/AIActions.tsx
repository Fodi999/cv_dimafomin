"use client";

import { motion } from "framer-motion";
import { ChefHat, Clock, AlertTriangle, Coins } from "lucide-react";
import type { AIGoal } from "@/hooks/useAI";

interface AIActionsProps {
  onAnalyze: (goal: AIGoal) => void | Promise<void>;
  loading?: boolean;
}

export function AIActions({ onAnalyze, loading }: AIActionsProps) {
  console.log("🟦 AIActions rendered, onAnalyze type:", typeof onAnalyze);
  console.log("🟦 AIActions loading state:", loading);
  
  // 🔥 NEW: Decision Engine Presets (не чат, а інструмент)
  const actions = [
    {
      goal: "cook_now" as AIGoal,
      icon: <ChefHat className="w-6 h-6" />,
      emoji: "🍳",
      label: "Co mogę ugotować TERAZ?",
      description: "Pokazuję przepisy z Twojej lodówki — zero zakupów",
      color: "from-sky-500 to-cyan-500",
      hoverColor: "hover:from-sky-600 hover:to-cyan-600",
    },
    {
      goal: "expiring_soon" as AIGoal,
      icon: <AlertTriangle className="w-6 h-6" />,
      emoji: "⏰",
      label: "Co się zmarnuje w ciągu 24h?",
      description: "Pilne przepisy dla produktów o krótkim terminie",
      color: "from-orange-500 to-red-500",
      hoverColor: "hover:from-orange-600 hover:to-red-600",
    },
    {
      goal: "save_money" as AIGoal,
      icon: <Coins className="w-6 h-6" />,
      emoji: "💸",
      label: "Jak zaoszczędzić dziś pieniądze?",
      description: "Gotuj z tego, co masz — uniknij dodatkowych wydatków",
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:from-green-600 hover:to-emerald-600",
    },
    {
      goal: "quick_meal" as AIGoal,
      icon: <Clock className="w-6 h-6" />,
      emoji: "⚡",
      label: "Co ugotować w 30 minut?",
      description: "Szybkie dania bez skomplikowanych kroków",
      color: "from-purple-500 to-pink-500",
      hoverColor: "hover:from-purple-600 hover:to-pink-600",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🤖 Co chcesz zrobić?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Wybierz scenariusz — AI podejmie decyzję na podstawie Twojej lodówki
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
              console.log("🔴 Preset clicked:", action.label, "goal:", action.goal);
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
                {/* Emoji + Icon */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-3xl">{action.emoji}</span>
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold mb-1 leading-tight">
                    {action.label}
                  </h3>
                  <p className="text-sm text-white/90 leading-snug">
                    {action.description}
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
