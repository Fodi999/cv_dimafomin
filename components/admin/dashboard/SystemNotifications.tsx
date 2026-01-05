"use client";

import { Shield, Globe, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Системные уведомления
 * Мини-блок снизу, появляется ТОЛЬКО при событиях
 */

interface SystemNotification {
  icon: React.ReactNode;
  message: string;
  time: string;
  type: "info" | "warning" | "error";
}

export function SystemNotifications() {
  const { t } = useLanguage();
  
  // В реальности это будет приходить из API
  const notifications: SystemNotification[] = [
    {
      icon: <Shield className="w-4 h-4" />,
      message: t.admin.dashboard.systemNotifications.rolesChanged,
      time: `2 ${t.admin.dashboard.systemNotifications.hoursAgo}`,
      type: "info",
    },
    {
      icon: <Globe className="w-4 h-4" />,
      message: `${t.admin.dashboard.systemNotifications.localizationUpdated} (PL)`,
      time: `1 ${t.admin.dashboard.systemNotifications.hourAgo}`,
      type: "info",
    },
  ];

  if (notifications.length === 0) return null;

  const getColorClasses = (type: SystemNotification["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {t.admin.dashboard.systemNotifications.title}
      </h3>
      <div className="space-y-2">
        {notifications.map((notification, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${getColorClasses(notification.type)}`}
          >
            {notification.icon}
            <div className="flex-1">
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
            <span className="text-xs opacity-70">{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
