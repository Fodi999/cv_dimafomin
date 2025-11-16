"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bell, Mail, Key, Lock, Save, RotateCcw, Settings, Zap } from "lucide-react";

type SettingsTab = "general" | "email" | "notifications" | "api" | "security";

interface GeneralSettings {
  appName: string;
  appDescription: string;
  timezone: string;
  language: string;
  theme: string;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  orderNotifications: boolean;
  userNotifications: boolean;
  systemNotifications: boolean;
}

interface APISettings {
  apiKey: string;
  apiSecret: string;
  webhookUrl: string;
  rateLimit: string;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  ipWhitelist: string;
  sessionTimeout: string;
  passwordMinLength: string;
}

const tabConfig = [
  { id: "general" as const, label: "Загальні", icon: Settings },
  { id: "email" as const, label: "Email", icon: Mail },
  { id: "notifications" as const, label: "Сповіщення", icon: Bell },
  { id: "api" as const, label: "API", icon: Key },
  { id: "security" as const, label: "Безпека", icon: Lock },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [saved, setSaved] = useState(false);

  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    appName: "Sushi Chef",
    appDescription: "Зробіть суші дома - крок за кроком",
    timezone: "Europe/Kyiv",
    language: "uk",
    theme: "dark",
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "admin@sushi-chef.com",
    smtpPassword: "••••••••",
    fromEmail: "noreply@sushi-chef.com",
    fromName: "Sushi Chef",
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    userNotifications: true,
    systemNotifications: true,
  });

  const [apiSettings, setAPISettings] = useState<APISettings>({
    apiKey: "sk_live_••••••••••••••••",
    apiSecret: "••••••••••••••••",
    webhookUrl: "https://sushi-chef.com/webhook",
    rateLimit: "1000",
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: true,
    ipWhitelist: "0.0.0.0/0",
    sessionTimeout: "30",
    passwordMinLength: "8",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (activeTab === "general") {
      setGeneralSettings({
        appName: "Sushi Chef",
        appDescription: "Зробіть суші дома - крок за кроком",
        timezone: "Europe/Kyiv",
        language: "uk",
        theme: "dark",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Налаштування
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Управляйте параметрами вашої системи
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto pb-4">
        {tabConfig.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
              }`}
            >
              <TabIcon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* General Settings */}
        {activeTab === "general" && (
          <Card className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Назва додатку
                </label>
                <Input
                  value={generalSettings.appName}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, appName: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Часовий пояс
                </label>
                <Input
                  value={generalSettings.timezone}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, timezone: e.target.value })
                  }
                  className="w-full"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Опис додатку
                </label>
                <textarea
                  value={generalSettings.appDescription}
                  onChange={(e) =>
                    setGeneralSettings({
                      ...generalSettings,
                      appDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Мова
                </label>
                <select
                  value={generalSettings.language}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, language: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="uk">Українська</option>
                  <option value="en">English</option>
                  <option value="ru">Русский</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Тема
                </label>
                <select
                  value={generalSettings.theme}
                  onChange={(e) =>
                    setGeneralSettings({ ...generalSettings, theme: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="light">Світла</option>
                  <option value="dark">Темна</option>
                  <option value="auto">Авто</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <Save size={18} />
                Зберегти
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw size={18} />
                Скинути
              </Button>
            </div>
          </Card>
        )}

        {/* Email Settings */}
        {activeTab === "email" && (
          <Card className="p-6 space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
              <Mail size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                Налаштуйте параметри SMTP для надсилання листів
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  SMTP хост
                </label>
                <Input
                  value={emailSettings.smtpHost}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, smtpHost: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  SMTP порт
                </label>
                <Input
                  value={emailSettings.smtpPort}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, smtpPort: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  SMTP користувач
                </label>
                <Input
                  value={emailSettings.smtpUser}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, smtpUser: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  SMTP пароль
                </label>
                <Input
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Від кого (Email)
                </label>
                <Input
                  value={emailSettings.fromEmail}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, fromEmail: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Від кого (Ім'я)
                </label>
                <Input
                  value={emailSettings.fromName}
                  onChange={(e) =>
                    setEmailSettings({ ...emailSettings, fromName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <Save size={18} />
                Зберегти
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                Тестувати з'єднання
              </Button>
            </div>
          </Card>
        )}

        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Bell size={18} />
                  Канали сповіщень
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      key: "emailNotifications",
                      label: "Email сповіщення",
                      desc: "Надсилати сповіщення на пошту",
                    },
                    {
                      key: "pushNotifications",
                      label: "Push сповіщення",
                      desc: "Надсилати браузерні сповіщення",
                    },
                    {
                      key: "smsNotifications",
                      label: "SMS сповіщення",
                      desc: "Надсилати SMS повідомлення",
                    },
                  ].map((notification) => (
                    <label key={notification.key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={
                          notificationSettings[
                            notification.key as keyof NotificationSettings
                          ] as boolean
                        }
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [notification.key]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded"
                      />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {notification.label}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {notification.desc}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  Типи подій для сповіщення
                </h3>

                <div className="space-y-3">
                  {[
                    { key: "orderNotifications", label: "Сповіщення про замовлення" },
                    { key: "userNotifications", label: "Сповіщення про користувачів" },
                    { key: "systemNotifications", label: "Системні сповіщення" },
                  ].map((notification) => (
                    <label key={notification.key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={
                          notificationSettings[
                            notification.key as keyof NotificationSettings
                          ] as boolean
                        }
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [notification.key]: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded"
                      />
                      <div className="font-medium text-slate-900 dark:text-white">
                        {notification.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <Save size={18} />
                Зберегти
              </Button>
            </div>
          </Card>
        )}

        {/* API Settings */}
        {activeTab === "api" && (
          <Card className="p-6 space-y-6">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3">
              <Key size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-300">
                Збережіть ці ключі в безпечному місці. Їх не можна буде скинути
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  API ключ
                </label>
                <div className="flex gap-2">
                  <Input value={apiSettings.apiKey} readOnly className="flex-1" />
                  <Button variant="outline">Копіювати</Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  API секрет
                </label>
                <div className="flex gap-2">
                  <Input value={apiSettings.apiSecret} readOnly type="password" className="flex-1" />
                  <Button variant="outline">Копіювати</Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Webhook URL
                </label>
                <Input
                  value={apiSettings.webhookUrl}
                  onChange={(e) =>
                    setAPISettings({ ...apiSettings, webhookUrl: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Rate Limit (запитів/хвилину)
                </label>
                <Input
                  value={apiSettings.rateLimit}
                  onChange={(e) =>
                    setAPISettings({ ...apiSettings, rateLimit: e.target.value })
                  }
                  type="number"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <Save size={18} />
                Зберегти
              </Button>
              <Button variant="outline">Перегенерувати ключі</Button>
            </div>
          </Card>
        )}

        {/* Security Settings */}
        {activeTab === "security" && (
          <Card className="p-6 space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
              <Lock size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 dark:text-red-300">
                Параметри безпеки впливають на всі облікові записи
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={securitySettings.twoFactorAuth}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorAuth: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      Двофакторна аутентифікація
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Потребувати 2FA для входу адміністраторів
                    </div>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  IP білий список
                </label>
                <Input
                  value={securitySettings.ipWhitelist}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      ipWhitelist: e.target.value,
                    })
                  }
                  placeholder="0.0.0.0/0"
                />
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Розділіть кількома комами (192.168.1.1, 10.0.0.0/8)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Тайм-аут сесії (хвилин)
                </label>
                <Input
                  value={securitySettings.sessionTimeout}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: e.target.value,
                    })
                  }
                  type="number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Мінімальна довжина пароля
                </label>
                <Input
                  value={securitySettings.passwordMinLength}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      passwordMinLength: e.target.value,
                    })
                  }
                  type="number"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
              >
                <Save size={18} />
                Зберегти
              </Button>
            </div>
          </Card>
        )}
      </motion.div>

      {/* Success message */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          ✅ Налаштування збережено успішно!
        </motion.div>
      )}
    </motion.div>
  );
}
