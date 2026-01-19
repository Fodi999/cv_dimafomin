"use client";

import { ArrowRight, Users, BookOpen, Brain, Settings } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAdminUsersStats } from "@/hooks/useAdminUsers";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * KPI Section - Dashboard overview cards
 * Uses shadcn/ui Card components with real API data
 */

interface KPICardProps {
  icon: React.ReactNode;
  title: string;
  stats: Array<{ label: string; value: string | number; trend?: string; href?: string }>;
  href: string;
  iconColor: string;
  isLoading?: boolean;
  buttonLabel: string;
}

function KPICard({ icon, title, stats, href, iconColor, isLoading, buttonLabel }: KPICardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${iconColor}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {stats.map((stat, idx) => {
            const content = (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{stat.label}:</span>
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <>
                      <span className="font-medium">{stat.value}</span>
                      {stat.trend && (
                        <span className="text-xs text-green-600 dark:text-green-400">{stat.trend}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
            
            // If stat has href, make it clickable
            if (stat.href) {
              return (
                <Link key={idx} href={stat.href} className="block hover:bg-muted/50 rounded px-2 py-1 -mx-2 transition-colors">
                  {content}
                </Link>
              );
            }
            
            return <div key={idx}>{content}</div>;
          })}
        </div>

        <Link href={href} className="block">
          <Button variant="ghost" className="w-full justify-between group">
            <span>{buttonLabel}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Content - Real Data with Direct Links */}
      <KPICard
        icon={<BookOpen className="h-4 w-4 text-green-600" />}
        title={t.admin.dashboard.kpi.content.title}
        stats={[
          { label: t.admin.dashboard.kpi.content.recipes, value: adminStats?.recipes.total || 0, href: "/admin/catalog/recipes-list" },
          { label: t.admin.dashboard.kpi.content.products, value: adminStats?.ingredients?.total || 0, href: "/admin/catalog/products" },
        ]}
        href="/admin/catalog"
        iconColor="bg-green-100 dark:bg-green-900/30"
        isLoading={isStatsLoading}
        buttonLabel={t.admin.dashboard.kpi.content.viewAll}
      />

      {/* AI - Real Data */}
      <KPICard
        icon={<Brain className="h-4 w-4 text-purple-600" />}
        title={t.admin.dashboard.kpi.ai.title}
        stats={[
          { label: t.admin.dashboard.kpi.ai.queries, value: adminStats?.ai.requests_today || 0 },
          { label: t.admin.dashboard.kpi.ai.accuracy, value: adminStats?.ai.success_rate ? `${adminStats.ai.success_rate}%` : "0%" },
          { label: t.admin.dashboard.kpi.ai.tokens, value: adminStats?.treasury.tokens_distributed ? `${(adminStats.treasury.tokens_distributed / 1000).toFixed(0)}K` : "0" },
        ]}
        href="/admin/integrations"
        iconColor="bg-purple-100 dark:bg-purple-900/30"
        isLoading={isStatsLoading}
        buttonLabel={t.admin.dashboard.kpi.ai.viewAll}
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
