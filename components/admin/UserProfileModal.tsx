"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Edit2, Save, Mail, Phone, MapPin, User, Activity, ShieldCheck, Calendar } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  status: "active" | "inactive" | "banned";
  avatar?: string;
  joinDate: Date;
  orders: number;
  totalSpent: number;
  lastLogin?: Date;
  verificationStatus: "verified" | "pending" | "unverified";
}

interface UserProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

const mockActivityHistory = [
  { date: new Date(Date.now() - 2 * 3600000), action: "Створено замовлення #ORD-2451", amount: "$45.99" },
  { date: new Date(Date.now() - 5 * 3600000), action: "Оновлено профіль", amount: null },
  { date: new Date(Date.now() - 1 * 86400000), action: "Створено замовлення #ORD-2450", amount: "$32.50" },
];

const formatDate = (date: Date) => {
  return date.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400";
    case "premium":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    case "user":
      return "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400";
    default:
      return "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    case "inactive":
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
    case "banned":
      return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
    default:
      return "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400";
  }
};

export function UserProfileModal({ user, isOpen, onClose }: UserProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  // Синхронізуємо editedUser коли змінюється user або модаль відкривається
  useEffect(() => {
    setEditedUser(user);
    setIsEditing(false);
  }, [user, isOpen]);

  const handleSave = () => {
    console.log("Збережено користувача:", editedUser);
    setIsEditing(false);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Активний";
      case "inactive":
        return "Неактивний";
      case "banned":
        return "Заблокований";
      default:
        return status;
    }
  };

  const getVerificationLabel = (status: string) => {
    switch (status) {
      case "verified":
        return "Верифіковано";
      case "pending":
        return "Очікує верифікації";
      case "unverified":
        return "Не верифіковано";
      default:
        return status;
    }
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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50 bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isEditing ? "Редагування профілю" : "Профіль користувача"}
              </h2>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(80vh-200px)]">
              <div className="p-6 space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                      {getInitials(editedUser.name)}
                    </div>
                  </div>

                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          placeholder="Ім'я користувача"
                        />
                        <Input
                          value={editedUser.email}
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                          placeholder="Email"
                          type="email"
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                          {editedUser.name}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                          <Mail size={16} />
                          {editedUser.email}
                        </p>
                        <div className="flex gap-2">
                          <Badge className={getRoleColor(editedUser.role)}>
                            {editedUser.role === "admin" ? "🔑 Адміністратор" : editedUser.role === "premium" ? "⭐ Преміум" : "👤 Користувач"}
                          </Badge>
                          <Badge className={getStatusColor(editedUser.status)}>
                            {getStatusLabel(editedUser.status)}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Status */}
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center gap-3">
                  <ShieldCheck size={20} className="text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {getVerificationLabel(editedUser.verificationStatus)}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {editedUser.verificationStatus === "verified" && "Користувач підтвердив свою електронну адресу"}
                      {editedUser.verificationStatus === "pending" && "Очікуємо підтвердження електронної адреси"}
                      {editedUser.verificationStatus === "unverified" && "Електронна адреса не підтверджена"}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <Card className="p-4 space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Контактна інформація</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        <Phone size={16} className="inline mr-1" />
                        Телефон
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedUser.phone}
                          onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                          placeholder="Телефон"
                        />
                      ) : (
                        <p className="text-slate-900 dark:text-white">{editedUser.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        <MapPin size={16} className="inline mr-1" />
                        Місцезнаходження
                      </label>
                      {isEditing ? (
                        <Input
                          value={editedUser.location}
                          onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                          placeholder="Місцезнаходження"
                        />
                      ) : (
                        <p className="text-slate-900 dark:text-white">{editedUser.location}</p>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {editedUser.orders}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Замовлень</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${editedUser.totalSpent.toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Витрачено</p>
                  </Card>
                </div>

                {/* Dates */}
                <Card className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Calendar size={16} />
                      Дата реєстрації:
                    </div>
                    <p className="font-medium text-slate-900 dark:text-white">{formatDate(editedUser.joinDate)}</p>
                  </div>
                  {editedUser.lastLogin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Activity size={16} />
                        Останній вхід:
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">{formatDate(editedUser.lastLogin)}</p>
                    </div>
                  )}
                </Card>

                {/* Activity History */}
                <Card className="p-4 space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Історія активності</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {mockActivityHistory.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm border-l-2 border-purple-500 pl-3 py-2">
                        <div>
                          <p className="text-slate-900 dark:text-white">{item.action}</p>
                          <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                        </div>
                        {item.amount && (
                          <p className="font-semibold text-green-600 dark:text-green-400">{item.amount}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-2 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Зберегти зміни
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Скасувати
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />
                    Редагувати
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1"
                  >
                    Закрити
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
