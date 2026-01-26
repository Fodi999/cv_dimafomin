"use client";

import { motion } from "framer-motion";
import { Award, TrendingUp, Lightbulb, Users } from "lucide-react";

interface ProgressIntelligenceProps {
  level: number;
  xp: number;
  maxXp: number;
  communityInsights?: string[];
}

/**
 * 📈 Progress & Intelligence
 * 
 * Два ключевых блока:
 * 1. Уровень + XP (геймификация, retention)
 * 2. Collective Intelligence (social layer без социалки)
 * 
 * Must-have для 2025-2026
 */
export function ProgressIntelligence({
  level,
  xp,
  maxXp,
  communityInsights = [
    "Большинство пользователей сейчас оптимизируют холодильник, а не рецепты",
    "Часто упрощают техники для снижения затрат",
    "Лучшее время начать контроль себестоимости"
  ],
}: ProgressIntelligenceProps) {
  const xpPercentage = (xp / maxXp) * 100;
  const xpRemaining = maxXp - xp;

  return (
    <div className="space-y-4">
      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-500/20 rounded-lg">
              <Award className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-bold text-white">
              Уровень {level}
            </h3>
          </div>
          <div className="text-xs text-gray-400 font-medium">
            {xp.toLocaleString()} / {maxXp.toLocaleString()} XP
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2.5 bg-gray-900/60 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-[10px] text-gray-400">
          <span>{xpPercentage.toFixed(0)}% до следующего уровня</span>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{xpRemaining.toLocaleString()} XP осталось</span>
          </div>
        </div>
      </motion.div>

      {/* Collective Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-blue-500/20 rounded-lg">
            <Lightbulb className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-sm font-bold text-white">
            🧠 Наблюдения сообщества
          </h3>
          <span className="text-[10px] text-gray-500 font-medium">
            (уровень {level})
          </span>
        </div>

        {/* Insights */}
        <div className="space-y-2.5">
          {communityInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              className="flex items-start gap-2 group"
            >
              <div className="mt-0.5 w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
              <p className="text-xs text-gray-300 leading-relaxed">
                {insight}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <Users className="w-3 h-3" />
            <span>Агрегировано из поведения пользователей</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
