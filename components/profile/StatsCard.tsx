"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Award, Zap } from "lucide-react";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  color: "blue" | "green" | "purple" | "orange";
  index?: number;
}

const colorMap = {
  blue: "from-blue-500/20 to-cyan-500/20",
  green: "from-emerald-500/20 to-teal-500/20",
  purple: "from-purple-500/20 to-pink-500/20",
  orange: "from-orange-500/20 to-red-500/20",
};

const iconColorMap = {
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-emerald-600 dark:text-emerald-400",
  purple: "text-purple-600 dark:text-purple-400",
  orange: "text-orange-600 dark:text-orange-400",
};

export function StatsCard({
  icon,
  label,
  value,
  change,
  color,
  index = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ translateY: -2 }}
      className={`bg-gradient-to-br ${colorMap[color]} rounded-lg p-3 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all overflow-hidden`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 ${iconColorMap[color]} flex items-center justify-center`}>
          <div className="w-4 h-4">{icon}</div>
        </div>
        {change && (
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            {change}
          </div>
        )}
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900 dark:text-white break-words overflow-hidden max-w-full">
        {value}
      </p>
    </motion.div>
  );
}

interface StatsGridProps {
  level?: number;
  xp?: number;
  maxXp?: number;
  balance?: number;
  coursesCount?: number;
}

export function StatsGrid({
  level = 1,
  xp = 450,
  maxXp = 1000,
  balance = 5000,
  coursesCount = 3,
}: StatsGridProps) {
  const xpPercent = (xp / maxXp) * 100;

  return (
    <div className="space-y-3">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <StatsCard
          icon={<Award className="w-6 h-6" />}
          label="Уровень"
          value={level}
          color="purple"
          index={0}
        />
        <StatsCard
          icon={<Zap className="w-6 h-6" />}
          label="Опыт"
          value={`${xp}/${maxXp}`}
          color="orange"
          index={1}
        />
        <StatsCard
          icon={<BarChart3 className="w-6 h-6" />}
          label="Баланс токенов"
          value={balance.toLocaleString()}
          color="green"
          index={2}
        />
        <StatsCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Курсы"
          value={coursesCount}
          color="blue"
          index={3}
        />
      </div>

      {/* XP Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            Прогресс к уровню {level + 1}
          </h3>
          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {Math.round(xpPercent)}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 rounded-full shadow-lg"
          />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Ещё {maxXp - xp} XP до следующего уровня
        </p>
      </motion.div>
    </div>
  );
}
