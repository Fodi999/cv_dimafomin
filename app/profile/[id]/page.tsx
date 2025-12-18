"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { ProfileView } from "@/components/profile/ProfileView";
import type { UserProfile, Post, Transaction, FormData } from "@/lib/profile-types";
import { useProfileTranslations } from "@/hooks/useProfileTranslations";
import { userApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft, UserPlus, UserMinus } from "lucide-react";
import { motion } from "framer-motion";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { user, isLoading: authLoading } = useUser();
  const { translations } = useProfileTranslations();

  // Redirect special routes (dashboard, settings, etc) to their proper locations
  useEffect(() => {
    const specialRoutes = ['dashboard', 'settings', 'edit', 'wallet'];
    if (specialRoutes.includes(userId.toLowerCase())) {
      router.replace('/profile');
    }
  }, [userId, router]);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [healthData, setHealthData] = useState({
    age: 0,
    weight: 0,
    height: 0,
    dailyCalories: 2000,
    allergies: [] as string[],
    dietaryRestrictions: [] as string[],
    fitnessGoal: "maintenance",
  });
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    bio: "",
    location: "",
    phone: "",
    instagram: "",
    telegram: "",
    whatsapp: "",
  });

  const isOwnProfile = user?.id === userId;

  // Load user profile
  useEffect(() => {
    // Don't load profile if userId is a special route
    const specialRoutes = ['dashboard', 'settings', 'edit', 'wallet'];
    if (specialRoutes.includes(userId.toLowerCase())) {
      return;
    }

    const loadProfile = async () => {
      try {
        setPageLoading(true);
        // Use the userApi.getUserProfile function to fetch the profile
        const token = localStorage.getItem("token");
        const profileData = await userApi.getUserProfile(userId, token);
        
        // Convert ProfileData to UserProfile by adding id
        const userProfile: UserProfile = {
          id: userId,
          name: profileData.name || "",
          email: profileData.email || "",
          avatar: profileData.avatarUrl,
          bio: profileData.bio,
          location: profileData.location,
          phone: profileData.phone,
          instagram: profileData.instagram,
          telegram: profileData.telegram,
          whatsapp: profileData.whatsapp,
          chefTokens: profileData.chefTokens,
        };
        
        setUserProfile(userProfile);
        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          bio: profileData.bio || "",
          location: profileData.location || "",
          phone: profileData.phone || "",
          instagram: profileData.instagram || "",
          telegram: profileData.telegram || "",
          whatsapp: profileData.whatsapp || "",
        });
        // Set following status - default to false if not provided
        setIsFollowing(false);
      } catch (error) {
        console.error("Failed to load profile:", error);
        setUserProfile(null);
      } finally {
        setPageLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleFollow = async () => {
    try {
      // TODO: Implement follow/unfollow API call
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error);
    }
  };

  const handleMessage = () => {
    router.push(`/chat/${userId}`);
  };

  const handleEarn = () => {
    router.push("/academy");
  };

  const handleBuy = () => {
    console.log("Buy tokens");
  };

  const handleRefresh = () => {
    setRetryCount((prev) => (prev + 1) % 3);
  };

  const translationsRecord = translations as Record<string, string>;

  // Сначала проверяем authLoading - пока идёт проверка авторизации, не показываем ничего
  if (authLoading) {
    return null; // Или можно вернуть лоадер, но null предотвратит "мигание" неавторизованного UI
  }

  // Затем проверяем загрузку профиля
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-slate-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-slate-600 text-lg">Профиль не найден</p>
        <Button onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          На главную
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Action Buttons - for other profiles */}
      {!isOwnProfile && (
        <div className="fixed top-24 right-4 z-50 flex gap-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={handleFollow}
              className={`${
                isFollowing
                  ? "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              }`}
            >
              {isFollowing ? (
                <>
                  <UserMinus className="w-4 h-4 mr-2" />
                  Отписаться
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Подписаться
                </>
              )}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Button onClick={handleMessage} variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Написать
            </Button>
          </motion.div>
        </div>
      )}

      <ProfileView
        userProfile={userProfile}
        user={user || { id: userId, name: userProfile.name, email: userProfile.email }}
        posts={posts}
        savedPosts={savedPosts}
        transactions={transactions}
        healthData={healthData}
        pageLoading={pageLoading}
        retryCount={retryCount}
        isOwn={isOwnProfile}
        translations={translationsRecord}
        onHealthDataUpdate={setHealthData}
        onEarnClick={handleEarn}
        onBuyClick={handleBuy}
        onRefreshClick={handleRefresh}
      />
    </>
  );
}
