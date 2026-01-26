"use client";

import { Shield, Globe, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="h-full flex flex-col border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-900/30">
      <CardHeader className="flex-shrink-0 pb-3 px-4 pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t.admin.dashboard.systemNotifications.title}
          </CardTitle>
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {notifications.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-2">
          {notifications.map((notification, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${getColorClasses(notification.type)} hover:shadow-sm transition-shadow`}
            >
              <div className="p-1 rounded-md bg-white/50 dark:bg-gray-800/50 flex-shrink-0 mt-0.5">
                {notification.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium block leading-relaxed">{notification.message}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-500 mt-1 block">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
