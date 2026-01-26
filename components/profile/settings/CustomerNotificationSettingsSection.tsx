"use client";

import { useState } from "react";
import { Bell, Package, ChefHat, Truck, CheckCircle2, Tag } from "lucide-react";

interface NotificationPreference {
  email: boolean;
  push: boolean;
}

interface CustomerNotificationSettings {
  orderCreated: NotificationPreference;
  orderProcessing: NotificationPreference;
  orderCooking: NotificationPreference;
  orderReady: NotificationPreference;
  orderDelivered: NotificationPreference;
  promotions: NotificationPreference;
}

export default function CustomerNotificationSettingsSection() {
  const [settings, setSettings] = useState<CustomerNotificationSettings>({
    orderCreated: { email: true, push: true },
    orderProcessing: { email: true, push: true },
    orderCooking: { email: true, push: true },
    orderReady: { email: true, push: true },
    orderDelivered: { email: true, push: true },
    promotions: { email: true, push: false },
  });

  const toggleNotification = (
    key: keyof CustomerNotificationSettings,
    channel: "email" | "push"
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [channel]: !prev[key][channel],
      },
    }));
    // В будущем сохранять в backend
  };

  const notificationTypes = [
    {
      key: "orderCreated" as const,
      icon: Package,
      title: "Заказ создан",
      description: "Подтверждение создания заказа",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-500",
    },
    {
      key: "orderProcessing" as const,
      icon: Package,
      title: "Заказ готовится",
      description: "Ваш заказ принят в обработку",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-500",
    },
    {
      key: "orderCooking" as const,
      icon: ChefHat,
      title: "Заказ готовится",
      description: "Ваш заказ готовится на кухне",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-500",
    },
    {
      key: "orderReady" as const,
      icon: CheckCircle2,
      title: "Заказ готов",
      description: "Ваш заказ готов к получению",
      iconBg: "bg-green-500/20",
      iconColor: "text-green-500",
    },
    {
      key: "orderDelivered" as const,
      icon: Truck,
      title: "Заказ в доставке",
      description: "Ваш заказ в пути",
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-500",
    },
    {
      key: "promotions" as const,
      icon: Tag,
      title: "Акции и предложения",
      description: "Специальные предложения и скидки",
      iconBg: "bg-pink-500/20",
      iconColor: "text-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Уведомления
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Выберите, о чём вы хотите получать уведомления
        </p>
      </div>

      {/* Channels */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Каналы уведомлений:
        </p>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-700 dark:text-gray-300">📧 Email</span>
          <span className="text-gray-700 dark:text-gray-300">🔔 Push</span>
        </div>
      </div>

      {/* Notification Types */}
      <div className="space-y-3">
        {notificationTypes.map(({ key, icon: Icon, title, description, iconBg, iconColor }) => {
          const notification = settings[key];
          
          return (
            <div
              key={key}
              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-2 ${iconBg} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    {title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 pl-12">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notification.email}
                    onChange={() => toggleNotification(key, "email")}
                    className="w-4 h-4 text-purple-500 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notification.push}
                    onChange={() => toggleNotification(key, "push")}
                    className="w-4 h-4 text-purple-500 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Push</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          💡 Все уведомления включены по умолчанию. Вы можете отключить лишнее
        </p>
      </div>
    </div>
  );
}
