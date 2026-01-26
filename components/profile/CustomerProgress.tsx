"use client";

import { motion } from "framer-motion";
import { Award, TrendingUp, Star } from "lucide-react";

interface CustomerProgressProps {
  level: number;
  xp: number;
  maxXp: number;
}

/**
 * ⭐ Customer Progress
 * 
 * XP теперь = активность как клиент:
 * - Покупки
 * - Отзывы
 * - Повторные заказы
 * 
 * ❌ НЕ "приготовление"
 * ✅ Активность покупателя
 */
export function CustomerProgress({
  level,
  xp,
  maxXp,
}: CustomerProgressProps) {
  const xpPercentage = (xp / maxXp) * 100;
  const xpRemaining = maxXp - xp;

  return (
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
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-violet-400" />
          <span>{xpPercentage.toFixed(0)}% до следующего уровня</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>{xpRemaining.toLocaleString()} XP осталось</span>
        </div>
      </div>

      {/* How to Earn XP */}
      <div className="mt-3 pt-3 border-t border-gray-700/50">
        <p className="text-[10px] text-gray-500">
          Зарабатывайте XP: заказы • отзывы • повторные покупки
        </p>
      </div>
    </motion.div>
  );
}
