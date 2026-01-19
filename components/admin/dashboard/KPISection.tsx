"use client";

import { ArrowRight, Users, BookOpen, Settings, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAdminUsersStats } from "@/hooks/useAdminUsers";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * KPI Section - Dashboard overview cards
 * Modern design with gradients and better visual hierarchy
 */

interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  stats: Array<{ label: string; value: string | number; trend?: string; href?: string }>;
  href?: string; // Made optional
  iconColor: string;
  isLoading?: boolean;
  buttonLabel?: string; // Made optional
}

function KPICard({ icon, title, stats, href, iconColor, isLoading, buttonLabel }: KPICardProps) {
  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      {/* Decorative background gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-semibold">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-xl ${iconColor} shadow-lg`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative z-10 pb-3">
        <div className="space-y-1.5">
          {stats.map((stat, idx) => {
            const content = (
              <div className="flex items-center justify-between text-xs p-1.5 rounded-lg transition-colors">
                <span className="text-muted-foreground font-medium">{stat.label}:</span>
                <div className="flex items-center gap-1.5">
                  {isLoading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <>
                      <span className="font-bold text-base">{stat.value}</span>
                      {stat.trend && (
                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-0.5">
                          <TrendingUp className="w-2.5 h-2.5" />
                          {stat.trend}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
            
            // If stat has href, make it clickable
            if (stat.href) {
              return (
                <Link key={idx} href={stat.href} className="block hover:bg-primary/5 rounded-lg transition-colors">
                  {content}
                </Link>
              );
            }
            
            return <div key={idx}>{content}</div>;
          })}
        </div>

        {/* Show button only if href and buttonLabel provided */}
        {href && buttonLabel && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <Link href={href} className="block">
              <Button variant="ghost" size="sm" className="w-full justify-between group hover:bg-primary/10 transition-colors h-8">
                <span className="font-semibold text-xs">{buttonLabel}</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function KPISection() {
  const { t } = useLanguage();
  
  // Real data from API
  const { stats: userStats, isLoading: isUsersLoading } = useAdminUsersStats();
  const { stats: adminStats, isLoading: isStatsLoading } = useAdminStats();

  const activeTodayPercentage = userStats?.total && userStats?.active_today
    ? ((userStats.active_today / userStats.total) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Users - Real Data */}
      <KPICard
        icon={<Users className="h-4 w-4 text-blue-600" />}
        title={t.admin.dashboard.kpi.users.title}
        stats={[
          { label: t.admin.dashboard.kpi.users.total, value: userStats?.total || 0 },
          { label: t.admin.dashboard.kpi.users.activeToday, value: userStats?.active_today || 0, trend: `${activeTodayPercentage}%` },
          { label: t.admin.dashboard.kpi.users.growth, value: "+5.2%" },
        ]}
        href="/admin/users"
        iconColor="bg-blue-100 dark:bg-blue-900/30"
        isLoading={isUsersLoading}
        buttonLabel={t.admin.dashboard.kpi.users.viewAll}
      />

      {/* Content - Real Data with Direct Links (No bottom button - stats are clickable) */}
      <KPICard
        icon={<BookOpen className="h-4 w-4 text-green-600" />}
        title={t.admin.dashboard.kpi.content.title}
        stats={[
          { label: t.admin.dashboard.kpi.content.recipes, value: adminStats?.recipes.total || 0, href: "/admin/catalog/recipes-list" },
          { label: t.admin.dashboard.kpi.content.products, value: adminStats?.ingredients?.total || 0, href: "/admin/catalog/products" },
        ]}
        iconColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isStatsLoading}
      />

      {/* System - Real Data */}
      <KPICard
        icon={<Settings className="h-4 w-4 text-orange-600" />}
        title={t.admin.dashboard.kpi.system.title}
        stats={[
          { label: t.admin.dashboard.kpi.system.uptime, value: adminStats?.system.uptime || "N/A" },
          { label: t.admin.dashboard.kpi.system.errors, value: 0 },
          { label: t.admin.dashboard.kpi.system.users, value: userStats?.total || 0 },
        ]}
        href="/admin/settings"
        iconColor="bg-orange-100 dark:bg-orange-900/30"
        isLoading={isStatsLoading || isUsersLoading}
        buttonLabel={t.admin.dashboard.kpi.system.viewAll}
      />
    </div>
  );
}
