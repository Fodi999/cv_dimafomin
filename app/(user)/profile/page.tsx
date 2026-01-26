"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext"; // ✅ 2026: Для роли и статуса
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomerProfileHeader } from "@/components/profile/CustomerProfileHeader";
import { CustomerKPI } from "@/components/profile/CustomerKPI";
import { OrdersPreview } from "@/components/profile/OrdersPreview";
import { NotificationsBlock } from "@/components/profile/NotificationsBlock";
import { Order } from "@/lib/types/order";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User as UserIcon, Shield, Crown, CheckCircle, AlertTriangle, Ban, XCircle } from "lucide-react";

// Mock данные заказов (в будущем из API)
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2451",
    date: "2026-01-15T14:30:00Z",
    status: "completed",
    items: [],
    itemsCount: 3,
    total: 109.0,
  },
  {
    id: "2",
    orderNumber: "ORD-2450",
    date: "2026-01-14T18:20:00Z",
    status: "cooking",
    items: [],
    itemsCount: 3,
    total: 64.0,
  },
  {
    id: "3",
    orderNumber: "ORD-2449",
    date: "2026-01-13T12:15:00Z",
    status: "paid",
    items: [],
    itemsCount: 1,
    total: 35.0,
  },
];

/**
 * ✅ 2026: User Profile Page
 * Route: /profile
 * Purpose: Универсальный профиль для всех ролей
 * 
 * Отображает:
 * - Роль пользователя (из AuthContext)
 * - Статус пользователя (из AuthContext)
 * - Динамический контент в зависимости от роли
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { user: authUser, reloadMe } = useAuth(); // ✅ 2026: Источник роли и статуса
  const { t } = useLanguage();

  const [orders] = useState<Order[]>(mockOrders); // В будущем из API
  const [favoriteDishes] = useState(5); // В будущем из API

  useEffect(() => {
    if (!user) return;
  }, [user]);

  // ✅ 2026: Helper functions для роли и статуса
  const getRoleConfig = (role: string) => {
    const configs = {
      customer: { label: "👤 Покупатель", variant: "secondary" as const, icon: UserIcon },
      home_chef: { label: "👨‍🍳 Домашній кухар", variant: "default" as const, icon: UserIcon },
      chef_staff: { label: "👔 Персонал кухаря", variant: "default" as const, icon: UserIcon },
      admin: { label: "🛡️ Адміністратор", variant: "default" as const, icon: Shield },
      super_admin: { label: "👑 Супер Адмін", variant: "destructive" as const, icon: Crown },
    };
    return configs[role as keyof typeof configs] || configs.customer;
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      active: { label: "Активний", variant: "default" as const, icon: CheckCircle, className: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
      pending: { label: "Очікує підтвердження", variant: "secondary" as const, icon: AlertTriangle, className: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" },
      suspended: { label: "Призупинено", variant: "secondary" as const, icon: XCircle, className: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" },
      blocked: { label: "Заблоковано", variant: "destructive" as const, icon: Ban, className: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
    };
    return configs[status as keyof typeof configs] || configs.active;
  };

  const roleConfig = getRoleConfig(authUser?.role || "customer");
  const statusConfig = getStatusConfig(authUser?.status || "active");

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
    // В будущем открыть модалку редактирования
  };

  const handleSettings = () => {
    router.push("/profile/settings");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {t?.profile?.page?.loading || "Loading profile..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t?.profile?.page?.notLoggedIn || "You must be logged in to view profile"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all"
          >
            {t?.profile?.page?.loginButton || "Log in"}
          </button>
        </div>
      </div>
    );
  }

  // Вычисляем метрики
  const totalOrders = orders.length;
  const lastOrder = orders.length > 0 ? orders[0] : undefined;
  const activeOrders = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <CustomerProfileHeader
            name={user.name || "User"}
            email={user.email || ""}
            avatar={user.avatar || "/default-avatar.png"}
            role={authUser?.role}
            status={authUser?.status}
            roleConfig={roleConfig}
            statusConfig={statusConfig}
            onEdit={handleEditProfile}
            onSettings={handleSettings}
            onRefresh={reloadMe}
          />

          {/* ✅ 2026: Предупреждения для неактивных статусов */}
          {authUser?.status === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 max-w-2xl mx-auto"
            >
              <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                  <strong>Ваша роль змінена на "{roleConfig.label}".</strong><br />
                  Акаунт очікує підтвердження адміністратором.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {authUser?.status === "suspended" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 max-w-2xl mx-auto"
            >
              <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-900">
                <XCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-300">
                  <strong>Ваш акаунт тимчасово призупинено.</strong><br />
                  Будь ласка, зверніться в підтримку для отримання додаткової інформації.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {authUser?.status === "blocked" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 max-w-2xl mx-auto"
            >
              <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900">
                <Ban className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-300">
                  <strong>Ваш акаунт заблоковано.</strong><br />
                  Зверніться в підтримку: support@example.com
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </div>

        {/* Customer KPI Cards */}
        <div className="mb-6">
          <CustomerKPI
            totalOrders={totalOrders}
            lastOrder={lastOrder}
            activeOrders={activeOrders}
            favoriteDishes={favoriteDishes}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <OrdersPreview orders={orders} />
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <NotificationsBlock />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
