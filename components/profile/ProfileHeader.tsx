// ProfileHeader.tsx — шапка профілю з аватаром та статистикою

import { MapPin } from "lucide-react";
import type { UserProfile } from "@/lib/profile-types";

interface ProfileHeaderProps {
  user: UserProfile;
  postsCount: number;
  translations: Record<string, string>;
}

export function ProfileHeader({ user, postsCount, translations }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      {/* Avatar */}
      {user?.avatar ? (
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-24 h-24 rounded-full shadow-lg mb-4 object-cover"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg mb-4">
          <span className="text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
      )}

      {/* Name and Username */}
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        {user?.name || "Користувач"}
      </h1>
      <p className="text-gray-500 mb-1">
        @{user?.name?.toLowerCase().replace(/\s+/g, '_') || "user"}
      </p>
      
      {/* Bio */}
      {user?.bio && (
        <p className="text-gray-700 text-sm max-w-xl mt-3 mb-4">
          {user.bio}
        </p>
      )}

      {/* Location */}
      {user?.location && (
        <div className="flex items-center gap-2 text-gray-600 mb-6">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{user.location}</span>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 text-sm mb-6">
        <div>
          <span className="font-bold text-gray-900">{postsCount}</span>
          <span className="text-gray-600 ml-1">{translations.publications}</span>
        </div>
        <div>
          <span className="font-bold text-gray-900">{user?.followers || 0}</span>
          <span className="text-gray-600 ml-1">{translations.followers}</span>
        </div>
        <div>
          <span className="font-bold text-gray-900">{user?.following || 0}</span>
          <span className="text-gray-600 ml-1">{translations.following}</span>
        </div>
      </div>
    </div>
  );
}
