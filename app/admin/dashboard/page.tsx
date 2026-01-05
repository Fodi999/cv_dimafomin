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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {t.admin.dashboard.title}
        </h2>
        <p className="text-muted-foreground">
          {t.admin.dashboard.subtitle}
        </p>
      </div>

      {/* 2️⃣ KPI-блок (4 карточки максимум) */}
      <KPISection />

      {/* 3️⃣ Быстрые переходы (Action Hub) */}
      <ActionHub />

      {/* 4️⃣ Системные уведомления */}
      <SystemNotifications />
    </div>
  );
}
