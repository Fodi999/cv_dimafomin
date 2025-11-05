"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Calendar, Award, Users, Heart, MessageCircle, Share2, Camera, ChefHat, Bookmark } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { academyApi } from "@/lib/api";
import type { RecipePost, ProfileData } from "@/lib/types";

export default function UserProfilePage() {
  const { t } = useLanguage();
  const { user: currentUser, isAuthenticated } = useUser();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userPosts, setUserPosts] = useState<RecipePost[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        // Завантаження профілю користувача з API
        const profile = await academyApi.getProfile(userId);
        setProfileData(profile);
        
        // TODO: Завантаження постів користувача з API
        // const posts = await academyApi.getUserPosts(userId);
        // setUserPosts(posts);
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [userId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: API call to follow/unfollow
  };

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження профілю...</p>
        </div>
      </div>
    );
  }

  // Mock stats if not available from API
  const stats = {
    posts: userPosts.length || 0,
    followers: 0,
    following: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header - Pinterest Style */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-6">
          {/* Avatar - Centered */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
                {profileData?.avatarUrl ? (
                  <Image
                    src={profileData.avatarUrl}
                    alt={profileData?.name || 'User'}
                    width={112}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    {profileData?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>

            {/* Name and Username */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {profileData?.name || 'User'}
            </h1>
            <p className="text-gray-500 text-lg mb-1">@{profileData?.name?.toLowerCase().replace(/\s+/g, '_') || 'user'}</p>
            
            {/* Bio */}
            {profileData?.bio && (
              <p className="text-gray-700 text-base max-w-xl mt-3 mb-4">
                {profileData.bio}
              </p>
            )}

            {/* Location */}
            {profileData?.location && (
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{profileData.location}</span>
              </div>
            )}

            {/* Stats - Inline */}
            <div className="flex items-center gap-6 text-sm mb-6">
              <div>
                <span className="font-bold text-gray-900">{stats.posts}</span>
                <span className="text-gray-600 ml-1">публікацій</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">{stats.followers}</span>
                <span className="text-gray-600 ml-1">підписників</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">{stats.following}</span>
                <span className="text-gray-600 ml-1">підписок</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleFollow}
                className={`px-8 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                  isFollowing
                    ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isFollowing ? "Підписано" : "Підписатись"}
              </button>
              <button className="px-8 py-2.5 rounded-full font-semibold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all duration-300">
                Поділитись
              </button>
            </div>
          </div>
        </div>

        {/* Tabs - Pinterest Style */}
        <div className="border-b border-gray-200">
          <div className="flex justify-center gap-8">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-4 px-2 font-semibold transition-all duration-300 relative ${
                activeTab === "posts"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Створене
              {activeTab === "posts" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`py-4 px-2 font-semibold transition-all duration-300 relative ${
                activeTab === "saved"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Збережене
              {activeTab === "saved" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          </div>
        </div>

        {/* Content - Pinterest Masonry Grid */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {activeTab === "posts" ? (
            userPosts.length > 0 ? (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                {userPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="break-inside-avoid mb-4 group cursor-pointer"
                    onMouseEnter={() => setHoveredId(post.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-auto object-cover"
                      />
                      
                      {/* Hover Overlay */}
                      <div 
                        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                          hoveredId === post.id ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        {/* Top Right Actions */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                          >
                            <Bookmark className="w-4 h-4 text-gray-800" />
                          </button>
                        </div>

                        {/* Bottom Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-semibold text-sm mb-1">{post.title}</h3>
                          <p className="text-xs text-white/90 line-clamp-2 mb-2">{post.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-xs hover:scale-110 transition-transform"
                            >
                              <Heart className="w-4 h-4" />
                              <span>{post.likesCount}</span>
                            </button>
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-xs hover:scale-110 transition-transform"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.commentsCount}</span>
                            </button>
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 text-xs hover:scale-110 transition-transform"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Поки немає публікацій</p>
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Збережені рецепти приховані</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
