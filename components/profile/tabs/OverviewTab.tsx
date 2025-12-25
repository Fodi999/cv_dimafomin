"use client";

import { motion } from "framer-motion";
import { Plus, Bot, Clock } from "lucide-react";
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
 * Shows: Last actions (history) + Clear next steps (CTAs)
 * Level/Budget moved to ProgressControl component above tabs
 */
export function OverviewTab({
  lastActions,
}: OverviewTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-3 sm:space-y-4">
      
      {/* Ostatnie działania - Last 3 actions */}
      {lastActions.length > 0 && (
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white mb-2 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
            Ostatnie działania
          </h3>
          <div className="space-y-1.5">
            {lastActions.slice(0, 3).map((action, index) => (
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

      {/* Co dalej? - 2 Clear CTAs ONLY */}
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
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl p-3 sm:p-4 text-white text-left transition-all shadow-lg"
          >
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 mb-1.5" />
            <h4 className="font-bold text-xs sm:text-sm">Otwórz AI</h4>
            <p className="text-[10px] sm:text-xs text-white/80">Stwórz przepis</p>
          </motion.button>
        </div>
      </div>

    </div>
  );
}
