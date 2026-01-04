"use client";

import { Users, UserCheck, UserX, Crown } from "lucide-react";

/**
 * KPI блок для страницы пользователей
 * Read-only, без графиков
 */

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

function KPICard({ icon, label, value, color }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

export function UsersKPI() {
  // TODO: Fetch from API
  const stats = {
    total: 3847,
    activeToday: "5.1%",
    blocked: 12,
    premium: 245,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        icon={<Users className="w-5 h-5 text-blue-600" />}
        label="Всього користувачів"
        value={stats.total.toLocaleString()}
        color="bg-blue-50 dark:bg-blue-900/20"
      />
      <KPICard
        icon={<UserCheck className="w-5 h-5 text-green-600" />}
        label="Активні сьогодні"
        value={stats.activeToday}
        color="bg-green-50 dark:bg-green-900/20"
      />
      <KPICard
        icon={<UserX className="w-5 h-5 text-red-600" />}
        label="Заблоковані"
        value={stats.blocked}
        color="bg-red-50 dark:bg-red-900/20"
      />
      <KPICard
        icon={<Crown className="w-5 h-5 text-purple-600" />}
        label="Преміум"
        value={stats.premium}
        color="bg-purple-50 dark:bg-purple-900/20"
      />
    </div>
  );
}
