"use client";

import { useState } from "react";
import type { NotificationSettings } from "@/lib/settings-types";
import { Bell, AlertTriangle, Calendar } from "lucide-react";

interface Props {
  settings: NotificationSettings;
  onUpdate: (data: Partial<NotificationSettings>) => void;
}

export default function NotificationSettingsSection({ settings, onUpdate }: Props) {
  const [localSettings, setLocalSettings] = useState(settings);

  function toggleSetting(key: keyof NotificationSettings) {
    const currentValue = localSettings[key];
    const newValue = currentValue === "off" ? "push" : "off";
    
    const updated = { ...localSettings, [key]: newValue };
    setLocalSettings(updated);
    onUpdate({ [key]: newValue });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Powiadomienia
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tylko najważniejsze przypomnienia
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Ważne przypomnienia
          </label>
        </div>
        
        <div className="space-y-3">
          {/* Expiring Products */}
          <label className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer bg-white dark:bg-gray-800 transition-colors">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Produkty się psują
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Ostrzeżenie gdy produkty tracą świeżość
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={localSettings.expiringProducts !== "off"}
              onChange={() => toggleSetting("expiringProducts")}
              className="w-5 h-5 text-purple-500"
            />
          </label>

          {/* Cooking Time */}
          <label className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer bg-white dark:bg-gray-800 transition-colors">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Plan na dziś
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Przypomnienie o planowanych posiłkach
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={localSettings.cookingTime !== "off"}
              onChange={() => toggleSetting("cookingTime")}
              className="w-5 h-5 text-purple-500"
            />
          </label>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          💡 Powiadomienia wysyłane są tylko o najważniejszych rzeczach — nic zbędnego
        </p>
      </div>
    </div>
  );
}
