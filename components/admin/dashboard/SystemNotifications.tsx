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
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-lg h-full">
      {/* Decorative background */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {t.admin.dashboard.systemNotifications.title}
          </h3>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
            {notifications.length}
          </span>
        </div>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {notifications.map((notification, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getColorClasses(notification.type)} hover:scale-[1.01] transition-transform`}
            >
              <div className="p-1.5 rounded-lg bg-white/50 dark:bg-gray-800/50 flex-shrink-0">
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold block truncate">{notification.message}</span>
              </div>
              <span className="text-xs font-medium opacity-70 whitespace-nowrap flex-shrink-0">{notification.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
