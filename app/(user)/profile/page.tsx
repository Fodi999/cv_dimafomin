"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomerProfileHeader } from "@/components/profile/CustomerProfileHeader";
import { CustomerKPI } from "@/components/profile/CustomerKPI";
import { OrdersPreview } from "@/components/profile/OrdersPreview";
import { NotificationsBlock } from "@/components/profile/NotificationsBlock";
import { Order } from "@/lib/types/order";
import { motion } from "framer-motion";

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
 * Customer Profile Page
 * Route: /profile
 * Purpose: Customer dashboard - orders, favorites, notifications
 * NO kitchen, NO recipes, NO economy, NO gamification
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { t } = useLanguage();

  const [orders] = useState<Order[]>(mockOrders); // В будущем из API
  const [favoriteDishes] = useState(5); // В будущем из API

  useEffect(() => {
    if (!user) return;
  }, [user]);

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
            onEdit={handleEditProfile}
            onSettings={handleSettings}
          />
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 font-medium"
          >
            Ваш профиль покупателя
          </motion.p>
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
