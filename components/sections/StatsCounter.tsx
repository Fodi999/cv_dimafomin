"use client";

import { useEffect, useState } from "react";
import { Users, ChefHat, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Stats {
  usersCount: number;
  recipesCount: number;
  ingredientsCount: number;
}

interface StatsCounterProps {
  variant?: 'light' | 'dark';
}

export default function StatsCounter({ variant = 'light' }: StatsCounterProps) {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    usersCount: 0,
    recipesCount: 0,
    ingredientsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch public stats
        const statsRes = await fetch('/api/stats/public');
        const statsData = await statsRes.json();

        setStats({
          usersCount: statsData.usersCount || 100,
          recipesCount: statsData.recipesCount || 16,
          ingredientsCount: statsData.ingredientsCount || 214,
        });
      } catch (error) {
        console.error('[StatsCounter] Error fetching stats:', error);
        // Set fallback values
        setStats({
          usersCount: 100,
          recipesCount: 16,
          ingredientsCount: 214,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  const textColor = variant === 'dark' ? 'text-white' : 'text-gray-700 dark:text-gray-300';
  const iconColor = variant === 'dark' ? 'text-white' : 'text-sky-600 dark:text-sky-400';

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 sm:gap-4 md:gap-6 px-2 sm:px-3 ${variant === 'light' ? 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 shadow-sm' : ''}`}>
        <span className={`inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 ${textColor} text-xs sm:text-sm font-medium animate-pulse`}>
          <Users className={`w-3 h-3 sm:w-4 sm:h-4 ${iconColor}`} />
          <span className="hidden sm:inline">...</span>
        </span>
        <span className={`inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 ${textColor} text-xs sm:text-sm font-medium animate-pulse`}>
          <ChefHat className={`w-3 h-3 sm:w-4 sm:h-4 ${iconColor}`} />
          <span className="hidden sm:inline">...</span>
        </span>
        <span className={`inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 ${textColor} text-xs sm:text-sm font-medium animate-pulse`}>
          <Package className={`w-3 h-3 sm:w-4 sm:h-4 ${iconColor}`} />
          <span className="hidden sm:inline">...</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-4 md:gap-6 ${variant === 'light' ? 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50' : 'px-2 sm:px-4'}`}>
      <span className={`inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 ${textColor} text-xs sm:text-sm font-medium`}>
        <Users className={`w-3 h-3 sm:w-4 sm:h-4 ${iconColor}`} />
        <span className="hidden sm:inline">{stats.usersCount} {t.home.hero.stats.users}</span>
        <span className="sm:hidden">{stats.usersCount}</span>
      </span>
      <span className={`inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 ${textColor} text-xs sm:text-sm font-medium`}>
        <ChefHat className={`w-3 h-3 sm:w-4 sm:h-4 ${iconColor}`} />
        <span className="hidden sm:inline">{stats.recipesCount} {t.home.hero.stats.recipes}</span>
        <span className="sm:hidden">{stats.recipesCount}</span>
      </span>
      <span className={`inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 ${textColor} text-xs sm:text-sm font-medium`}>
        <Package className={`w-3 h-3 sm:w-4 sm:h-4 ${iconColor}`} />
        <span className="hidden sm:inline">{stats.ingredientsCount} {t.home.hero.stats.products}</span>
        <span className="sm:hidden">{stats.ingredientsCount}</span>
      </span>
    </div>
  );
}
