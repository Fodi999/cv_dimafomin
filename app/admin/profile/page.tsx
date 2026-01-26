"use client";

import { useState } from "react";
import { useUser } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Globe, 
  Clock, 
  Shield, 
  Lock,
  Camera,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * Admin Profile - Личная зона администратора
 * 
 * ❗ НЕ смешиваем с system settings
 * 
 * Содержит:
 * - Basic Info (имя, email, аватар)
 * - Personal Settings (язык интерфейса, часовой пояс)
 * - Security (смена пароля, 2FA, sessions)
 */
export default function AdminProfile() {
  const { user, updateProfile } = useUser();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    language: "uk",
    timezone: "Europe/Kyiv",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // TODO: API call to update profile
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Паролі не співпадають");
      return;
    }
    setIsSaving(true);
    // TODO: API call to change password
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Мій профіль
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Персональні налаштування адміністратора
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        
        {/* 1️⃣ Basic Info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Основна інформація
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Редагувати
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium"
                >
                  Скасувати
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Збереження..." : "Зберегти"}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Аватар профілю
                </p>
                {isEditing && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Клікніть щоб змінити (JPG, PNG, max 2MB)
                  </p>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="w-4 h-4" />
                Ім'я
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Language */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Globe className="w-4 h-4" />
                Мова інтерфейсу
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="uk">Українська</option>
                <option value="pl">Polski</option>
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </div>

            {/* Timezone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4" />
                Часовий пояс
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="Europe/Kyiv">Київ (UTC+2)</option>
                <option value="Europe/Warsaw">Варшава (UTC+1)</option>
                <option value="Europe/London">Лондон (UTC+0)</option>
                <option value="America/New_York">Нью-Йорк (UTC-5)</option>
              </select>
            </div>
          </div>
        </motion.section>

        {/* 2️⃣ Security */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Безпека
          </h2>

          <div className="space-y-6">
            {/* Change Password */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Змінити пароль
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Lock className="w-4 h-4" />
                    Поточний пароль
                  </label>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Lock className="w-4 h-4" />
                    Новий пароль
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Lock className="w-4 h-4" />
                    Підтвердіть новий пароль
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Збереження..." : "Змінити пароль"}
                </button>
              </div>
            </div>

            {/* 2FA */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Двофакторна автентифікація (2FA)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Додатковий рівень захисту для вашого облікового запису
              </p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                Налаштувати 2FA
              </button>
            </div>

            {/* Active Sessions */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Активні сесії
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      🖥️ MacBook Air (Поточна)
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Київ, Україна • Сьогодні о 14:32
                    </p>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Активна
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
