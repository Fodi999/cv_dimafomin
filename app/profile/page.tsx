"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { ProfileView } from "@/components/profile/ProfileView";
import type { UserProfile, Post, Transaction, FormData } from "@/lib/profile-types";
import { useProfileTranslations } from "@/hooks/useProfileTranslations";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateProfile } = useUser();
  const { translations } = useProfileTranslations();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
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

  // Load user profile, posts, and transactions
  useEffect(() => {
    if (isLoading || !user || dataLoaded) return;

    const loadData = async () => {
      try {
        setPageLoading(true);

        // Load profile
        setUserProfile({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio || "",
          location: user.location || "",
          phone: user.phone || "",
          instagram: user.instagram || "",
          telegram: user.telegram || "",
          whatsapp: user.whatsapp || "",
          followers: 0,
          following: 0,
        });

        // Initialize form with user data
        setFormData({
          name: user.name,
          email: user.email,
          bio: user.bio || "",
          location: user.location || "",
          phone: user.phone || "",
          instagram: user.instagram || "",
          telegram: user.telegram || "",
          whatsapp: user.whatsapp || "",
        });

        // Load posts (empty for now)
        setPosts([]);
        setSavedPosts([]);

        // Load transactions (empty for now)
        setTransactions([]);

        setDataLoaded(true);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [user, dataLoaded, isLoading]);

  // Reset dataLoaded when user becomes null (logout)
  useEffect(() => {
    if (!user) {
      setDataLoaded(false);
    }
  }, [user]);

  if (isLoading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Не удалось загрузить профиль</p>
      </div>
    );
  }

  const handleEarn = () => {
    router.push("/academy");
  };

  const handleBuy = () => {
    console.log("Buy tokens");
  };

  const handleRefresh = () => {
    setRetryCount((prev) => (prev + 1) % 3);
  };

  const handleFormChange = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfile({
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        instagram: formData.instagram,
        telegram: formData.telegram,
        whatsapp: formData.whatsapp,
      });
      console.log("✅ Profile updated successfully");
    } catch (error) {
      console.error("❌ Failed to save profile:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (url: string) => {
    try {
      await updateProfile({ avatar: url });
      console.log("✅ Avatar updated successfully");
    } catch (error) {
      console.error("❌ Failed to upload avatar:", error);
      throw error;
    }
  };

  const translationsRecord = translations as Record<string, string>;

  return (
    <ProfileView
      userProfile={userProfile}
      user={user}
      posts={posts}
      savedPosts={savedPosts}
      transactions={transactions}
      healthData={healthData}
      formData={formData}
      pageLoading={pageLoading}
      retryCount={retryCount}
      isSaving={isSaving}
      isOwn={true}
      translations={translationsRecord}
      onHealthDataUpdate={setHealthData}
      onFormChange={handleFormChange}
      onSave={handleSave}
      onAvatarUpload={handleAvatarUpload}
      onEarnClick={handleEarn}
      onBuyClick={handleBuy}
      onRefreshClick={handleRefresh}
    />
  );
}
