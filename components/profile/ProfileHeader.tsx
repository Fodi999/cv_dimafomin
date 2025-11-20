import { motion } from "framer-motion";
import { User, Mail, MapPin, Edit2, Award, Zap, BarChart3, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { colors, composite, borderRadius, shadows } from "@/lib/design-tokens";
import { ProfileEditSheet } from "./ProfileEditSheet";
import { ProfileData } from "@/lib/types";

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  followers?: number;
  following?: number;
  profile?: ProfileData | any;
  onProfileUpdate?: (updatedProfile: Partial<ProfileData>) => Promise<void>;
  level?: number;
  xp?: number;
  maxXp?: number;
  balance?: number;
  coursesCount?: number;
}

export function ProfileHeader({
  name,
  email,
  avatar,
  bio,
  location,
  followers = 0,
  following = 0,
  profile,
  onProfileUpdate,
  level = 5,
  xp = 2450,
  maxXp = 5000,
  balance = 0,
  coursesCount = 0,
}: ProfileHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { t } = useLanguage();

  // Ensure profile object exists for ProfileEditSheet
  const profileData: ProfileData = profile || {
    name,
    email,
    avatarUrl: avatar,
    bio,
    location,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${composite.card.container} ${composite.card.hover} ${borderRadius.lg}`}
    >
      {/* Background Gradient - Sky Theme */}
      <div className={`h-12 sm:h-16 ${colors.primary.light.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-2xl animate-pulse delay-2000" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-0">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end -mt-10 sm:-mt-14 mb-2 relative z-10">
          {/* Avatar */}
          <div className={`w-32 h-32 sm:w-40 sm:h-40 ${borderRadius.lg} overflow-hidden shadow-2xl flex-shrink-0`}>
            {avatar && !imageError ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-violet-400">
                <User className="w-16 h-16 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 break-words leading-tight">
              {name || t.profile.header.user}
            </h1>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-300 min-w-0">
                <Mail className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                <span className="text-xs text-gray-400 font-light truncate">{email}</span>
              </div>
              {location && (
                <div className="flex items-center gap-1 text-gray-300 min-w-0">
                  <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-gray-400 font-light truncate">{location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditOpen(true)}
            className={`px-3 py-2 ${composite.buttonPrimary} rounded-lg flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm flex-shrink-0`}
          >
            <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Edytuj</span>
          </motion.button>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-gray-300 mb-4 leading-tight font-medium text-xs sm:text-sm break-words overflow-hidden line-clamp-2">
            {bio}
          </p>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 py-4 border-t border-gray-700/30 mt-4">
          {/* Followers */}
          <div className="text-center">
            <p className="text-lg sm:text-xl font-bold text-white">{followers}</p>
            <p className="text-xs text-gray-400">Followers</p>
          </div>

          {/* Following */}
          <div className="text-center">
            <p className="text-lg sm:text-xl font-bold text-white">{following}</p>
            <p className="text-xs text-gray-400">Following</p>
          </div>

          {/* Level */}
          <div className="text-center">
            <p className="text-lg sm:text-xl font-bold text-violet-300">Lvl {level}</p>
            <p className="text-xs text-gray-400">Level</p>
          </div>

          {/* Balance */}
          <div className="text-center">
            <p className="text-lg sm:text-xl font-bold text-amber-300">{balance}</p>
            <p className="text-xs text-gray-400">Tokens</p>
          </div>
        </div>
      </div>

      {/* Edit Sheet */}
      <ProfileEditSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profileData}
        onSave={onProfileUpdate || (async () => {})}
      />
    </motion.div>
  );
}

