"use client";

import { AdminHeader } from "@/components/admin/dashboard/AdminHeader";
import { KPISection } from "@/components/admin/dashboard/KPISection";
import { ActionHub } from "@/components/admin/dashboard/ActionHub";
import { SystemNotifications } from "@/components/admin/dashboard/SystemNotifications";

/**
 * Admin Dashboard - Главная страница админки
 * 
 * Цель: Не управлять всем, а дать контроль и ориентиры
 * - Состояние системы
 * - Быстрый доступ к ключевым зонам
 * - Сигналы, где есть проблемы
 * 
 * Структура:
 * 1. AdminHeader - служебная панель (роль, email, статус, быстрые действия)
 * 2. KPISection - 4 карточки (Пользователи, Контент, AI, Система)
 * 3. ActionHub - быстрые переходы (дубликат меню без вложенности)
 * 4. SystemNotifications - уведомления (только при событиях)
 */
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 1️⃣ Верхняя панель */}
      <AdminHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 2️⃣ KPI-блок (4 карточки максимум) */}
        <section>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📊 Панель управления
          </h1>
          <KPISection />
        </section>

        {/* 3️⃣ Быстрые переходы (Action Hub) */}
        <section>
          <ActionHub />
        </section>

        {/* 4️⃣ Системные уведомления */}
        <section>
          <SystemNotifications />
        </section>
      </div>
    </div>
  );
}
