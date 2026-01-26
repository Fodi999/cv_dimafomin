"use client";

import Link from "next/link";
import { ArrowRight, Users, BookOpen, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUsersStats } from "@/hooks/useAdminUsers";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * System Overview - Системный обзор
 * 
 * Менее контрастные карточки для системных разделов:
 * - Пользователи
 * - Контент
 * - Система
 * 
 * Это "фон", а не центр внимания
 */

interface SystemCardProps {
  icon: React.ReactNode;
  title: string;
  stats: Array<{ label: string; value: string | number; href?: string }>;
  href?: string;
  isLoading?: boolean;
  buttonLabel?: string;
}

function SystemCard({ icon, title, stats, href, isLoading, buttonLabel }: SystemCardProps) {
  return (
    <Card className="border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/30 hover:bg-white dark:hover:bg-gray-900/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </CardTitle>
        <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pb-3 px-4">
        <div className="space-y-1">
          {stats.map((stat, idx) => {
            const content = (
              <div className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                <div className="flex items-center gap-1.5">
                  {isLoading ? (
                    <Skeleton className="h-4 w-12" />
                  ) : (
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{stat.value}</span>
                  )}
                </div>
              </div>
            );

            if (stat.href) {
              return (
                <Link key={idx} href={stat.href} className="block">
                  {content}
                </Link>
              );
            }

            return <div key={idx}>{content}</div>;
          })}
        </div>

        {href && buttonLabel && (
          <div className="mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
            <Link href={href}>
              <Button variant="ghost" size="sm" className="w-full justify-between group hover:bg-gray-100 dark:hover:bg-gray-800 h-7 text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">{buttonLabel}</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SystemOverview() {
  const { t } = useLanguage();
  
  const { stats: userStats, isLoading: isUsersLoading } = useAdminUsersStats();
  const { stats: adminStats, isLoading: isStatsLoading } = useAdminStats();

  const activeTodayPercentage = userStats?.total && userStats?.active_today
    ? ((userStats.active_today / userStats.total) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {/* Users */}
      <SystemCard
        icon={<Users className="h-4 w-4" />}
        title={t.admin.dashboard.kpi.users.title}
        stats={[
          { label: t.admin.dashboard.kpi.users.total, value: userStats?.total || 0 },
          { label: t.admin.dashboard.kpi.users.activeToday, value: userStats?.active_today || 0 },
        ]}
        href="/admin/users"
        isLoading={isUsersLoading}
        buttonLabel={t.admin.dashboard.kpi.users.viewAll}
      />

      {/* Content */}
      <SystemCard
        icon={<BookOpen className="h-4 w-4" />}
        title={t.admin.dashboard.kpi.content.title}
        stats={[
          { label: t.admin.dashboard.kpi.content.recipes, value: adminStats?.recipes.total || 0, href: "/admin/catalog/recipes-list" },
          { label: t.admin.dashboard.kpi.content.products, value: adminStats?.ingredients?.total || 0, href: "/admin/catalog/products" },
        ]}
        isLoading={isStatsLoading}
      />

      {/* System */}
      <SystemCard
        icon={<Settings className="h-4 w-4" />}
        title={t.admin.dashboard.kpi.system.title}
        stats={[
          { label: t.admin.dashboard.kpi.system.uptime, value: adminStats?.system.uptime || "N/A" },
          { label: t.admin.dashboard.kpi.system.errors, value: 0 },
        ]}
        href="/admin/settings"
        isLoading={isStatsLoading || isUsersLoading}
        buttonLabel={t.admin.dashboard.kpi.system.viewAll}
      />
    </div>
  );
}
