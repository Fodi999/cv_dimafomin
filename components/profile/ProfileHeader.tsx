import { motion } from "framer-motion";
import { User, Mail, MapPin, Edit2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="h-32 bg-gradient-to-r from-sky-400 via-blue-500 to-teal-500" />

      {/* Content */}
      <div className="px-6 sm:px-8 pb-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end -mt-16 mb-6 relative z-10">
          {/* Avatar */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-white dark:border-gray-700 bg-gray-100 dark:bg-gray-700 overflow-hidden shadow-lg">
            {avatar && !imageError ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-300 to-blue-500">
                <User className="w-16 h-16 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {name || "Пользователь"}
            </h1>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm sm:text-base">{email}</span>
              </div>
              {location && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm sm:text-base">{location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <Link href="/profile/edit">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap text-sm sm:text-base"
            >
              <Edit2 className="w-4 h-4" />
              Редактировать
            </motion.button>
          </Link>
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
              {followers}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Подписчиков
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {following}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Подписок
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              0
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Постов
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              0
            </p>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Рецептов
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
