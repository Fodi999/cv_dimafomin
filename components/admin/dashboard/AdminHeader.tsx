"use client";

import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Settings, Shield, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Верхняя служебная панель админ-дашборда
 * Без повторов меню, только:
 * - Имя/роль админа (клик → dropdown с профилем)
 * - Email
 * - Статус
 * - Последний вход
 * - Быстрые действия (Настройки, Безопасность, Выход)
 */
export function AdminHeader() {
  const { user } = useUser();
  const { logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Admin Info with Dropdown */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-3 py-2 transition-colors"
            >
              <Shield className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-gray-900 dark:text-white">
                System Administrator
              </span>
              <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium">
                {user?.role === "superadmin" ? "SUPERADMIN" : "ADMIN"}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                >
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.email || "admin@example.com"}
                    </p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/admin/profile");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Мій профіль
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/admin/settings");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Налаштування системи
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/admin/settings/security");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    >
                      <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Безпека
                      </span>
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-red-600 dark:text-red-400">
                        Вийти
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>📧 {user?.email || "admin@example.com"}</span>
            <span className="flex items-center gap-1">
              🟢 <span>Активен</span>
            </span>
            <span>⏱ Последний вход: Сегодня {formatTime()}</span>
          </div>
        </div>

        {/* Right: Quick Actions (icons only, no text) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/admin/settings")}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Настройки системы"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Выход"
          >
            <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
