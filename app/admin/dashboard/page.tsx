"use client";

import { KPISection } from "@/components/admin/dashboard/KPISection";
import { ActionHub } from "@/components/admin/dashboard/ActionHub";
import { SystemNotifications } from "@/components/admin/dashboard/SystemNotifications";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Admin Dashboard - Главная страница админки
 * 
 * Modern shadcn/ui design with proper component structure
 */
export default function AdminDashboard() {
  const { t } = useLanguage();
  
  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-3 overflow-hidden">
      {/* Header - Very Compact */}
      <div className="flex-shrink-0">
        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          {t.admin.dashboard.title}
        </h2>
        <p className="text-xs text-muted-foreground">
          {t.admin.dashboard.subtitle}
        </p>
      </div>

      {/* KPI Cards - Compact */}
      <div className="flex-shrink-0">
        <KPISection />
      </div>

      {/* Action Hub + Notifications - Side by side, scrollable internally */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-3 min-h-0">
        <div className="overflow-y-auto">
          <ActionHub />
        </div>
        <div className="overflow-y-auto">
          <SystemNotifications />
        </div>
      </div>
    </div>
  );
}
