import { motion } from "framer-motion";
import { User, Mail, MapPin, Edit2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { colors, composite, borderRadius, shadows } from "@/lib/design-tokens";

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  followers?: number;
  following?: number;
}

export function ProfileHeader({
  name,
  email,
  avatar,
  bio,
  location,
  followers = 0,
  following = 0,
}: ProfileHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${composite.card.container} ${composite.card.hover} ${borderRadius.lg}`}
    >
      {/* Background Gradient - Sky Theme */}
      <div className={`h-16 sm:h-20 ${colors.primary.light.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-2000" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-0">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-end -mt-8 sm:-mt-10 mb-2 relative z-10">
          {/* Avatar */}
          <div className={`w-24 h-24 sm:w-28 sm:h-28 ${borderRadius.lg} border-3 border-white dark:border-gray-800 ${colors.primary.light.gradient} overflow-hidden shadow-lg flex-shrink-0`}>
            {avatar && !imageError ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-400 to-cyan-500">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 break-words">
              {name || t.profile.header.user}
            </h1>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-300 min-w-0">
                <Mail className="w-3 h-3 text-sky-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">{email}</span>
              </div>
              {location && (
                <div className="flex items-center gap-1 text-gray-300 min-w-0">
                  <MapPin className="w-3 h-3 text-sky-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">{location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <Link href="/profile/edit">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-2 ${composite.buttonPrimary} rounded-lg flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm flex-shrink-0`}
            >
              <Edit2 className="w-3 h-3" />
              <span className="hidden sm:inline">Редактировать</span>
              <span className="sm:hidden">✏️</span>
            </motion.button>
          </Link>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-gray-300 mb-2 leading-tight font-medium text-xs sm:text-sm break-words overflow-hidden line-clamp-2">
            {bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 pt-2 pb-2 border-t border-sky-400/20">
          <motion.div 
            whileHover={{ y: -2 }}
            className={`flex flex-col items-center justify-center p-2 sm:p-3 ${borderRadius.md} ${colors.primary.light.badge} hover:bg-sky-500/30 transition-all`}
          >
            <div className="flex items-center gap-1 whitespace-nowrap">
              <p className={`text-lg sm:text-2xl font-bold ${colors.primary.light.text}`}>
                {followers}
              </p>
              <p className="text-xs text-gray-400 font-semibold leading-tight truncate">
                {t.profile.stats.followers}
              </p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -2 }}
            className={`flex flex-col items-center justify-center p-2 sm:p-3 ${borderRadius.md} bg-cyan-500/10 border border-cyan-200/50 hover:bg-cyan-500/30 transition-all`}
          >
            <div className="flex items-center gap-1 whitespace-nowrap">
              <p className="text-lg sm:text-2xl font-bold text-cyan-300">
                {following}
              </p>
              <p className="text-xs text-gray-400 font-semibold leading-tight truncate">
                {t.profile.stats.following}
              </p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -2 }}
            className={`flex flex-col items-center justify-center p-2 sm:p-3 ${borderRadius.md} bg-emerald-500/10 border border-emerald-200/50 hover:bg-emerald-500/30 transition-all`}
          >
            <div className="flex items-center gap-1 whitespace-nowrap">
              <p className="text-lg sm:text-2xl font-bold text-emerald-300">
                0
              </p>
              <p className="text-xs text-gray-400 font-semibold leading-tight truncate">
                {t.profile.stats.posts}
              </p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -2 }}
            className={`flex flex-col items-center justify-center p-2 sm:p-3 ${borderRadius.md} bg-orange-500/10 border border-orange-200/50 hover:bg-orange-500/30 transition-all`}
          >
            <div className="flex items-center gap-1 whitespace-nowrap">
              <p className="text-lg sm:text-2xl font-bold text-orange-300">
                0
              </p>
              <p className="text-xs text-gray-400 font-semibold leading-tight truncate">
                {t.profile.stats.recipes}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
