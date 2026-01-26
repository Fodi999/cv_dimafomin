"use client";

import { motion } from "framer-motion";
import { User, Mail, Coins, Award, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface ProfileIdentityProps {
  name: string;
  email: string;
  avatar?: string;
  role: 'super_admin' | 'admin' | 'customer';
  level: number;
  chefTokens: number;
}

/**
 * 🧑 Identity Block
 * 
 * Компактная идентификация:
 * - Кто ты (имя, роль)
 * - Твой статус (уровень)
 * - Твоя валюта (ChefTokens)
 * 
 * БЕЗ шума, БЕЗ деталей
 * Всегда наверху профиля
 */
export function ProfileIdentity({
  name,
  email,
  avatar,
  role,
  level,
  chefTokens,
}: ProfileIdentityProps) {
  const [imageError, setImageError] = useState(false);

  const roleLabels = {
    super_admin: "Super Admin",
    admin: "Admin",
    customer: "Customer",
  };

  const roleColors = {
    super_admin: "from-rose-500 to-pink-500",
    admin: "from-violet-500 to-purple-500",
    customer: "from-sky-500 to-cyan-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 flex items-center gap-4"
    >
      {/* Avatar */}
      <div className="w-14 h-14 rounded-lg overflow-hidden shadow-lg flex-shrink-0 ring-2 ring-gray-700">
        {avatar && !imageError ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${roleColors[role]}`}>
            <User className="w-7 h-7 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Name + Role */}
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-bold text-white truncate">
            {name}
          </h2>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold text-white bg-gradient-to-r ${roleColors[role]}`}>
            {roleLabels[role]}
          </span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
          <Mail className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{email}</span>
        </div>

        {/* Level + CT */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-gray-300 font-medium">Level {level}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-gray-300 font-medium">{chefTokens} CT</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
