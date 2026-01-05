"use client";

import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * KPI блок для страницы пользователей
 * Read-only, без графиков
 * Честное отображение: total всегда показываем, остальное — с fallback
 */

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  isLoading?: boolean;
  tooltip?: string;
  isUnavailable?: boolean;
}

function KPICard({
  icon,
  label,
  value,
  color,
  isLoading,
  tooltip,
  isUnavailable,
}: KPICardProps) {
  const content = (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <p
          className={`text-2xl font-bold ${
            isUnavailable
              ? "text-gray-400 dark:text-gray-600"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {value}
        </p>
      )}
    </div>
  );

  if (tooltip && !isLoading) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}

interface UsersKPIProps {
  stats?: {
    total: number;
    active_today: number;
    blocked: number;
    premium?: number;
  } | null;
  isLoading?: boolean;
}

export function UsersKPI({ stats, isLoading = false }: UsersKPIProps) {
  const { t } = useLanguage();
  
  // 🔥 Честное отображение: показываем реальные данные с backend
  const total = stats?.total || 0;
  const activeToday = stats?.active_today || 0;
  const blocked = stats?.blocked || 0;
  const premium = stats?.premium; // undefined если 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total - всегда показываем */}
      <KPICard
        icon={<Users className="w-5 h-5 text-blue-600" />}
        label={t.admin.users.kpi.totalUsers}
        value={total.toLocaleString()}
        color="bg-blue-50 dark:bg-blue-900/20"
        isLoading={isLoading}
      />

      {/* Active Today - реальные данные из last_login_at */}
      <KPICard
        icon={<UserCheck className="w-5 h-5 text-green-600" />}
        label={t.admin.users.kpi.activeUsers}
        value={activeToday.toLocaleString()}
        color="bg-green-50 dark:bg-green-900/20"
        isLoading={isLoading}
      />

      {/* Blocked - по статусу blocked */}
      <KPICard
        icon={<UserX className="w-5 h-5 text-red-600" />}
        label={t.admin.users.status.blocked}
        value={blocked}
        color="bg-red-50 dark:bg-red-900/20"
        isLoading={isLoading}
      />

      {/* Premium - показываем "—" если 0 или undefined */}
      <KPICard
        icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
        label={t.admin.users.kpi.premiumUsers}
        value={premium && premium > 0 ? premium.toLocaleString() : "—"}
        color="bg-purple-50 dark:bg-purple-900/20"
        isLoading={isLoading}
        isUnavailable={!premium || premium === 0}
        tooltip={
          !premium || premium === 0
            ? t.admin.users.kpi.noPremium
            : undefined
        }
      />
    </div>
  );
}
