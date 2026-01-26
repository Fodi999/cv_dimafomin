"use client";

import { CoreOperations } from "@/components/admin/dashboard/CoreOperations";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { SystemOverview } from "@/components/admin/dashboard/SystemOverview";
import { SystemNotifications } from "@/components/admin/dashboard/SystemNotifications";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Admin Dashboard - 2026 Money-First Design
 * 
 * Структура:
 * 1. Операционное ядро (Склад, Списания, Экономика, Ассистент)
 * 2. Быстрые действия (задачи владельца)
 * 3. Системный обзор (менее контрастный)
 * 4. Системные уведомления
 */
export default function AdminDashboard() {
  const { t } = useLanguage();
  
  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-4 overflow-hidden">
      {/* Header - Compact */}
      <div className="flex-shrink-0">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t.admin.dashboard.title || "Панель администратора"}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Операционный контроль
        </p>
      </div>

      {/* Операционное ядро - TOP */}
      <div className="flex-shrink-0">
        <CoreOperations />
      </div>

      {/* Быстрые действия + Системный обзор */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-4 min-h-0">
        {/* Левая колонка - скроллируемая */}
        <div className="flex flex-col min-h-0">
          <div className="space-y-4 overflow-y-auto pr-2">
            {/* Быстрые действия */}
            <QuickActions />
            
            {/* Системный обзор - менее контрастный */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                Система
              </h3>
              <SystemOverview />
            </div>
          </div>
        </div>
        
        {/* Правая колонка - системные уведомления */}
        <div className="flex flex-col min-h-0">
          <SystemNotifications />
        </div>
      </div>
    </div>
  );
}
