"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Save, Camera, Lock, Bell, Shield, Zap, Key, Circle } from "lucide-react";

interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  status: "active" | "inactive";
  joinDate: string;
  lastLogin: string;
}

interface AdminProfileEditPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (profile: AdminProfile) => void;
}

const defaultProfile: AdminProfile = {
  name: "Дмитро Авраменко",
  email: "dmitro@sushichef.com",
  phone: "+380 95 123 4567",
  avatar: "ДА",
  role: "Адміністратор",
  status: "active",
  joinDate: "15 січня 2024",
  lastLogin: "Сьогодні, 14:32",
};

export function AdminProfileEditPanel({ isOpen, onClose, onSave }: AdminProfileEditPanelProps) {
  const [profile, setProfile] = useState<AdminProfile>(defaultProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Симуляція збереження
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setSaveSuccess(true);
    
    if (onSave) {
      onSave(profile);
    }

    // Закрити успішне повідомлення через 2 секунди
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  const handleInputChange = (field: keyof AdminProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header with Profile Info */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Редагувати профіль
                </h2>
                <button
                  onClick={onClose}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Profile Summary - Minimalist */}
              <div className="flex items-start gap-4">
                {/* Square Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white shadow-md">
                    <span className="text-xl font-bold">{profile.avatar}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {profile.email}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 bg-purple-500 text-white text-xs font-semibold rounded">
                    <Key className="w-3 h-3" />
                    {profile.role}
                  </span>
                </div>
              </div>

              {/* Profile Details - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Роль</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">{profile.role}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Статус</p>
                  <p className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Circle className="w-2.5 h-2.5 fill-green-600 dark:fill-green-400" />
                    <span className="truncate">Активний</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Приєднався</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">{profile.joinDate}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Останній вхід</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">{profile.lastLogin}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Success Message */}
              <AnimatePresence>
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-500 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2"
                  >
                    <Zap size={18} />
                    Профіль успішно оновлено!
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Avatar Upload Section */}
              <Card className="p-6 space-y-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
                <div className="flex flex-col items-center gap-4">
                  <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                    <Camera size={18} />
                    Змінити фото
                  </Button>
                  <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                    Рекомендуємо кв. зображення мінімум 400x400px
                  </p>
                </div>
              </Card>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield size={18} />
                  Основна інформація
                </h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Ім'я
                  </label>
                  <Input
                    value={profile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Введіть ім'я"
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Введіть email"
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Телефон
                  </label>
                  <Input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+380 95 123 4567"
                    className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Account Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock size={18} />
                  Налаштування облікового запису
                </h3>

                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Роль</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{profile.role}</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                      <Key className="w-3 h-3" />
                    </span>
                  </div>
                </Card>

                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Статус</p>
                      <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                        <Circle className="w-3 h-3 fill-green-600 dark:fill-green-400" />
                        {profile.status === 'active' ? 'Активний' : 'Неактивний'}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                      OK
                    </span>
                  </div>
                </Card>

                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Приєднався</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{profile.joinDate}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Останній вхід</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{profile.lastLogin}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Security Options */}
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield size={18} />
                  Безпека
                </h3>

                <Button variant="outline" className="w-full justify-start gap-2">
                  <Lock size={18} />
                  Змінити пароль
                </Button>

                <Button variant="outline" className="w-full justify-start gap-2">
                  <Zap size={18} />
                  Двофакторна аутентифікація
                </Button>

                <Button variant="outline" className="w-full justify-start gap-2">
                  <Bell size={18} />
                  Налаштування сповіщень
                </Button>
              </div>

              {/* Danger Zone */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-red-600 dark:text-red-400">
                  Небезпечна зона
                </h3>
                <Button variant="outline" className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800">
                  Видалити обліковий запис
                </Button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 sm:p-6 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 w-full"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Збереження...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Зберегти зміни
                  </>
                )}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 w-full"
              >
                Скасувати
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
