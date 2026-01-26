"use client";

import { motion } from "framer-motion";
import { Bell, Package, CheckCircle2, Truck, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  type: "order_status" | "order_ready" | "order_delivered";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsBlockProps {
  notifications?: Notification[];
}

/**
 * Notifications Block Component
 * Shows recent notifications for customer
 */
export function NotificationsBlock({ notifications = [] }: NotificationsBlockProps) {
  // Mock notifications if none provided
  const mockNotifications: Notification[] = notifications.length > 0 ? notifications : [
    {
      id: "1",
      type: "order_status",
      title: "Статус заказа изменён",
      message: "Заказ ORD-2450 готовится",
      timestamp: "2026-01-26T14:30:00Z",
      read: false,
    },
    {
      id: "2",
      type: "order_ready",
      title: "Заказ готов",
      message: "Заказ ORD-2451 готов к получению",
      timestamp: "2026-01-26T12:15:00Z",
      read: false,
    },
  ];

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order_status":
        return <Package className="w-4 h-4" />;
      case "order_ready":
        return <CheckCircle2 className="w-4 h-4" />;
      case "order_delivered":
        return <Truck className="w-4 h-4" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Только что";
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    return `${diffDays} дн назад`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Уведомления
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mockNotifications.length > 0 ? (
          <div className="space-y-3">
            {mockNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  notification.read
                    ? "bg-gray-50 dark:bg-gray-800/30"
                    : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                }`}
              >
                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm">{notification.title}</p>
                    {!notification.read && (
                      <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {formatTime(notification.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Нет уведомлений</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
