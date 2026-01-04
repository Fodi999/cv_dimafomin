"use client";

import { ArrowRight, Users, BookOpen, Brain, Settings } from "lucide-react";
import Link from "next/link";
import { useAdminUsersStats } from "@/hooks/useAdminUsers";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * KPI-блок из 4 карточек (максимум)
 * Это СВОДКА разделов, не отдельная аналитика
 * 🔥 Интегрировано с реальным API для статистики пользователей
 */

interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  stats: Array<{ label: string; value: string | number; trend?: string }>;
  href: string;
  color: string;
  isLoading?: boolean;
}

function KPICard({ icon, title, stats, href, color, isLoading }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            {icon}
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">{stat.label}:</span>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Skeleton className="h-5 w-16" />
              ) : (
                <>
                  <span className="font-medium text-gray-900 dark:text-white">{stat.value}</span>
                  {stat.trend && (
                    <span className="text-xs text-green-600 dark:text-green-400">{stat.trend}</span>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <Link
        href={href}
        className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Открыть {title}
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
      </Link>
    </div>
  );
}

export function KPISection() {
  // 🔥 Real data from API
  const { stats: userStats, isLoading: isUsersLoading } = useAdminUsersStats();

  // Calculate percentage for active today (if we have data)
  const activeTodayPercentage = userStats?.total && userStats?.active_today
    ? ((userStats.active_today / userStats.total) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Пользователи - REAL DATA */}
      <KPICard
        icon={<Users className="w-5 h-5 text-blue-600" />}
        title="Пользователи"
        stats={[
          { 
            label: "Всего", 
            value: isUsersLoading ? "..." : (userStats?.total || 0).toLocaleString() 
          },
          { 
            label: "Активные сегодня", 
            value: isUsersLoading ? "..." : userStats?.active_today || 0,
            trend: userStats?.active_today ? `${activeTodayPercentage}%` : undefined
          },
        ]}
        href="/admin/users"
        color="bg-blue-50 dark:bg-blue-900/20"
        isLoading={isUsersLoading}
      />

      {/* 2. Контент */}
      <KPICard
        icon={<BookOpen className="w-5 h-5 text-purple-600" />}
        title="Контент"
        stats={[
          { label: "Рецепты", value: "500+" },
          { label: "Ингредиенты", value: 320 },
          { label: "Курсы", value: 12 },
        ]}
        href="/admin/recipes"
        color="bg-purple-50 dark:bg-purple-900/20"
      />

      {/* 3. AI */}
      <KPICard
        icon={<Brain className="w-5 h-5 text-cyan-600" />}
        title="AI"
        stats={[
          { label: "Активных сценариев", value: 6 },
          { label: "Промптов", value: 24 },
        ]}
        href="/admin/ai-scenarios"
        color="bg-cyan-50 dark:bg-cyan-900/20"
      />

      {/* 4. Система */}
      <KPICard
        icon={<Settings className="w-5 h-5 text-gray-600" />}
        title="Система"
        stats={[
          { label: "Локализации", value: "PL / RU / EN" },
          { label: "Ошибок", value: 0 },
        ]}
        href="/admin/settings"
        color="bg-gray-50 dark:bg-gray-700/20"
      />
    </div>
  );
}
