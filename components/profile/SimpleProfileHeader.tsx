"use client";

import { motion } from "framer-motion";
import { User, Mail, Edit2, Coins, Award, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface SimpleProfileHeaderProps {
  name: string;
  email: string;
  avatar?: string;
  level: number;
  chefTokens: number;
  onEdit?: () => void;
  onSettings?: () => void;
}

/**
 * Simplified Profile Header - Identity only
 * Shows: Name, Avatar, Email, Level, CT Balance
 * No followers/following, no bio, no location
 */
export function SimpleProfileHeader({
  name,
  email,
  avatar,
  level,
  chefTokens,
  onEdit,
  onSettings,
}: SimpleProfileHeaderProps) {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-sky-500/10 to-cyan-500/10 rounded-xl overflow-hidden border border-sky-300/40 backdrop-blur-sm"
    >
      {/* Background Gradient Header */}
      <div className="h-12 sm:h-16 bg-gradient-to-r from-sky-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-1000" />
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
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-violet-400">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            )}
          </div>

          {/* Name + Email */}
          <div className="flex-1 min-w-0 pt-1 sm:pt-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-0.5 sm:mb-1 truncate">
              {name}
            </h1>
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs truncate">{email}</span>
            </div>
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

        {/* Level + ChefTokens */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Level Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/40">
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <div>
              <div className="text-[9px] sm:text-[10px] text-amber-300 font-medium leading-tight">
                {t?.profile?.progress?.level || "Level"}
              </div>
              <div className="text-sm sm:text-base font-bold text-white leading-tight">{level}</div>
            </div>
          </div>

          {/* ChefTokens Balance */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-lg border border-sky-500/40">
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
            <div>
              <div className="text-[9px] sm:text-[10px] text-sky-300 font-medium leading-tight">
                {t?.profile?.kpi?.chefTokens?.label || "ChefTokens"}
              </div>
              <div className="text-sm sm:text-base font-bold text-white leading-tight">{chefTokens} CT</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
