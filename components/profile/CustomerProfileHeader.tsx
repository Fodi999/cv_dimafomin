"use client";

import { motion } from "framer-motion";
import { User, Mail, Edit2, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface CustomerProfileHeaderProps {
  name: string;
  email: string;
  avatar?: string;
  role?: string; // ✅ 2026: Роль пользователя
  status?: string; // ✅ 2026: Статус пользователя
  roleConfig?: { label: string; variant: any; icon: any }; // ✅ Конфигурация роли
  statusConfig?: { label: string; className: string; icon: any }; // ✅ Конфигурация статуса
  onEdit?: () => void;
  onSettings?: () => void;
  onRefresh?: () => void; // ✅ 2026: Обновление данных
}

/**
 * Customer Profile Header - Simplified
 * Shows: Name, Avatar, Email, Edit & Settings buttons
 * NO Level, NO XP, NO ChefTokens
 */
export function CustomerProfileHeader({
  name,
  email,
  avatar,
  role,
  status,
  roleConfig,
  statusConfig,
  onEdit,
  onSettings,
  onRefresh,
}: CustomerProfileHeaderProps) {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl overflow-hidden border border-purple-300/40 backdrop-blur-sm"
    >
      {/* Background Gradient Header */}
      <div className="h-12 sm:h-16 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Content */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        {/* Avatar + Main Info */}
        <div className="flex items-end gap-3 sm:gap-4 -mt-8 sm:-mt-10 mb-3 sm:mb-4 relative z-10">
          {/* Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 ring-4 ring-gray-950">
            {avatar && !imageError ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-400">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            )}
          </div>

          {/* Name + Email + Role + Status */}
          <div className="flex-1 min-w-0 pt-1 sm:pt-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-0.5 sm:mb-1 truncate">
              {name}
            </h1>
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-300 mb-2">
              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-400 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs truncate">{email}</span>
            </div>
            
            {/* ✅ 2026: Роль и статус под email */}
            {roleConfig && statusConfig && (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={roleConfig.variant} className="flex items-center gap-1 text-[10px] sm:text-xs h-5 sm:h-6">
                  <roleConfig.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{roleConfig.label}</span>
                </Badge>
                <Badge className={`${statusConfig.className} flex items-center gap-1 text-[10px] sm:text-xs h-5 sm:h-6`}>
                  <statusConfig.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{statusConfig.label}</span>
                </Badge>
                {onRefresh && (
                  <button
                    onClick={onRefresh}
                    className="text-white/70 hover:text-white transition-colors text-xs"
                    title="Оновити дані"
                  >
                    🔄
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Edit Button */}
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2"
            >
              <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t?.profile?.page?.editProfile || "Edit profile"}</span>
              <span className="sm:hidden">{t?.profile?.page?.editShort || "Edit"}</span>
            </motion.button>
          )}

          {/* Settings Button */}
          {onSettings && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSettings}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg text-white text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t?.profile?.page?.settings || "Settings"}</span>
              <span className="sm:hidden">{t?.profile?.page?.settingsShort || "Settings"}</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
