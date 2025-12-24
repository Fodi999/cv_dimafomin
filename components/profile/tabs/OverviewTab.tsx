"use client";

import { motion } from "framer-motion";
import { Plus, Bot, TrendingUp, Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface OverviewTabProps {
  level: number;
  xp: number;
  maxXp: number;
  weeklyBudget?: number;
  weeklySpent?: number;
  lastActions: Array<{
    id: string;
    type: "product_added" | "dish_cooked" | "recipe_saved";
    text: string;
    timestamp: string;
  }>;
}

/**
 * Tab 1: Przegląd (Overview)
 * PHILOSOPHY: Overview, not Admin Panel
 * Answers 4 questions:
 * 1. Кто я? → Level badge
 * 2. Как я справляюсь? → Budget progress
 * 3. Что я делал? → Last 2 actions only
 * 4. Что дальше? → 2 Clear CTAs
 */
export function OverviewTab({
  level,
  xp,
  maxXp,
  weeklyBudget,
  weeklySpent,
  lastActions,
}: OverviewTabProps) {
  const router = useRouter();
  const xpProgress = (xp / maxXp) * 100;
  const budgetProgress = weeklyBudget && weeklySpent 
    ? (weeklySpent / weeklyBudget) * 100 
    : 0;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 1. Кто я? - Level Progress */}
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-3 sm:p-4 border border-amber-500/40">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Poziom {level}</h3>
            <p className="text-[10px] sm:text-xs text-amber-300">
              {xp} / {maxXp} XP
            </p>
          </div>
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
          />
        </div>
      </div>

      {/* 2. Jak я справляюсь? - Budget Week */}
      {weeklyBudget && weeklySpent !== undefined && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-3 sm:p-4 border border-green-500/40">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">Budżet tygodnia</h3>
              <p className="text-[10px] sm:text-xs text-green-300">
                {weeklySpent.toFixed(0)} / {weeklyBudget.toFixed(0)} PLN
              </p>
            </div>
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetProgress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${
                budgetProgress > 90
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : "bg-gradient-to-r from-green-500 to-emerald-500"
              }`}
            />
          </div>
        </div>
      )}

      {/* 3. Что я делал? - Last 2 actions only */}
      {lastActions.length > 0 && (
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white mb-2 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
            Ostatnie działania
          </h3>
          <div className="space-y-1.5">
            {lastActions.slice(0, 2).map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[11px] sm:text-xs leading-tight">{action.text}</p>
                    <p className="text-gray-400 text-[9px] sm:text-[10px] mt-0.5">{action.timestamp}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {action.type === "product_added" && (
                      <span className="text-sky-400 text-sm sm:text-base">🧊</span>
                    )}
                    {action.type === "dish_cooked" && (
                      <span className="text-green-400 text-sm sm:text-base">🍽</span>
                    )}
                    {action.type === "recipe_saved" && (
                      <span className="text-purple-400 text-sm sm:text-base">📘</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Что дальше? - 2 Clear CTAs */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-white mb-2">Co dalej?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/fridge")}
            className="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 rounded-xl p-3 sm:p-4 text-white text-left transition-all shadow-lg"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mb-1.5" />
            <h4 className="font-bold text-xs sm:text-sm">Dodaj produkty</h4>
            <p className="text-[10px] sm:text-xs text-white/80">Zaktualizuj lodówkę</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/assistant")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl p-3 sm:p-4 text-white text-left transition-all shadow-lg"
          >
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 mb-1.5" />
            <h4 className="font-bold text-xs sm:text-sm">Otwórz AI</h4>
            <p className="text-[10px] sm:text-xs text-white/80">Zaplanuj posiłki</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
