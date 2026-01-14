"use client";

import { motion } from "framer-motion";
import { StatsCard } from "../StatsCard";
import type { UserProfile } from "@/lib/profile-types";
import { Award, Zap, BarChart3, TrendingUp } from "lucide-react";
import { composite } from "@/lib/design-tokens";
import { useState } from "react";

interface OverviewSectionProps {
  userProfile: UserProfile;
  user: {
    chefTokens?: number;
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  translations: Record<string, string>;
  onEarnClick: () => void;
  onBuyClick: () => void;
  onRefreshClick: () => void;
  retryCount: number;
}

export function OverviewSection({
  userProfile,
  user,
  translations,
  onEarnClick,
  onBuyClick,
  onRefreshClick,
  retryCount,
}: OverviewSectionProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  const level = 5;
  const xp = 2450;
  const maxXp = 5000;
  const balance = user?.chefTokens || 0;
  const coursesCount = 3;
  const xpPercent = (xp / maxXp) * 100;

  return (
    <div>
      {/* STATS + PROGRESS */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        {/* STATISTICS + PROGRESS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
        {/* STATISTICS - 4 Cards in 2x2 grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          <StatsCard
            icon={<Award className="w-8 h-8" />}
            label="Уровень"
            value={level}
            color="purple"
            index={0}
          />
          <StatsCard
            icon={<Zap className="w-8 h-8" />}
            label="Опыт"
            value={`${xp}`}
            change={`/ ${maxXp}`}
            color="orange"
            index={1}
          />
          <StatsCard
            icon={<BarChart3 className="w-8 h-8" />}
            label="Баланс"
            value={balance.toLocaleString()}
            color="green"
            index={2}
          />
          <StatsCard
            icon={<TrendingUp className="w-8 h-8" />}
            label="Курсы"
            value={coursesCount}
            color="blue"
            index={3}
          />
        </div>

        {/* PROGRESS BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-2xl p-4 sm:p-5 border border-violet-500/10 transition-all"
          style={{ 
            background: "rgba(139, 92, 246, 0.12)",
            backdropFilter: 'blur(18px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <div>
              <h3 className="font-semibold text-xs text-white/80 uppercase tracking-tight mb-1">
                Прогресс к уровню {level + 1}
              </h3>
              <p className="text-lg sm:text-xl font-bold text-white">
                {xp.toLocaleString()} / {maxXp.toLocaleString()}
              </p>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-violet-300">
              {Math.round(xpPercent)}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-700/40 rounded-full overflow-hidden border border-gray-700/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-full bg-gradient-to-r from-violet-500 via-violet-600 to-violet-400 rounded-full"
              style={{ boxShadow: '0 0 16px rgba(139, 92, 246, 0.8)' }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Ещё {maxXp - xp} XP до следующего уровня
          </p>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
