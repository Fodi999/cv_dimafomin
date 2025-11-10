"use client";

import { useUser } from "@/contexts/UserContext";
import { Settings, Bell, Lock, Palette, Database, LogOut } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { user, logout } = useUser();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");

  const handleSaveSettings = async () => {
    try {
      // Сохраняем настройки в localStorage или на бэкенд
      localStorage.setItem(
        "adminSettings",
        JSON.stringify({
          emailNotifications,
          pushNotifications,
          darkMode,
          autoBackup,
        })
      );

      setSavedMessage("✓ Настройки сохранены успешно");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  const settingsSections = [
    {
      title: "Уведомления",
      icon: Bell,
      items: [
        {
          label: "Email уведомления",
          description: "Получать уведомления на email",
          value: emailNotifications,
          onChange: setEmailNotifications,
        },
        {
          label: "Push уведомления",
          description: "Получать push уведомления в браузер",
          value: pushNotifications,
          onChange: setPushNotifications,
        },
      ],
    },
    {
      title: "Интерфейс",
      icon: Palette,
      items: [
        {
          label: "Тёмный режим",
          description: "Использовать тёмную тему",
          value: darkMode,
          onChange: setDarkMode,
        },
      ],
    },
    {
      title: "Данные",
      icon: Database,
      items: [
        {
          label: "Автоматическое резервное копирование",
          description: "Создавать резервные копии ежедневно",
          value: autoBackup,
          onChange: setAutoBackup,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Настройки админ панели
        </h1>
        <p className="text-foreground/60">
          Управляйте параметрами вашей учетной записи и системы
        </p>
      </div>

      {/* Settings Sections */}
      {settingsSections.map((section, index) => {
        const Icon = section.icon;
        return (
          <div
            key={index}
            className="bg-card rounded-xl shadow-sm border border-border p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {section.title}
              </h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex items-center justify-between py-4 border-b border-border last:border-0"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {item.label}
                    </h3>
                    <p className="text-sm text-foreground/60">
                      {item.description}
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.value}
                      onChange={(e) => item.onChange(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Security Section */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-destructive/10 rounded-lg">
            <Lock className="w-6 h-6 text-destructive" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Безопасность
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex-1">
              <h3 className="font-medium text-foreground">
                Пароль
              </h3>
              <p className="text-sm text-foreground/60">
                Изменить пароль вашей учетной записи
              </p>
            </div>
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium text-sm">
              Изменить пароль
            </button>
          </div>

          <div className="border-b border-border" />

          <div className="flex items-center justify-between py-4">
            <div className="flex-1">
              <h3 className="font-medium text-foreground">
                Двухфакторная аутентификация
              </h3>
              <p className="text-sm text-foreground/60">
                Добавить дополнительный уровень безопасности
              </p>
            </div>
            <button className="px-4 py-2 border border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium text-sm">
              Включить
            </button>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Информация об учетной записи
        </h2>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Имя
              </label>
              <input
                type="text"
                value={user?.name || ""}
                disabled
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground disabled:opacity-60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
            {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSaveSettings}
          className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Settings className="w-5 h-5" />
          Сохранить настройки
        </button>
        <button
          onClick={() => logout()}
          className="flex-1 px-6 py-3 border border-destructive text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Выход
        </button>
      </div>

      {/* Success Message */}
      {savedMessage && (
        <div className="fixed bottom-6 right-6 bg-primary text-white px-6 py-3 rounded-lg shadow-lg">
          {savedMessage}
        </div>
      )}
    </div>
  );
}
