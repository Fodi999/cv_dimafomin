"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import type { TabType, UserProfile, Post, Transaction } from "@/lib/profile-types";
import { useProfileTranslations } from "@/hooks/useProfileTranslations";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout, updateProfile } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
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
  const { translations, language } = useProfileTranslations();

  // Load user profile, posts, and transactions - ONCE
  useEffect(() => {
    // ✅ Layout уже проверил авторизацию, просто загружаем данные
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
          bio: "",
          location: "",
          followers: 0,
          following: 0,
        });
        
        // Load posts
        setPosts([]);
        setSavedPosts([]);
        
        // Load transactions
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
    // TODO: Implement token purchase
    console.log("Buy tokens");
  };

  const handleRefresh = () => {
    setRetryCount(prev => (prev + 1) % 3);
  };

  const translationsRecord = translations as Record<string, string>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Main Profile Container */}
      <div className="max-w-4xl mx-auto px-4 pt-[120px] pb-8">
        <ProfileTabs
          userProfile={userProfile}
          user={user}
          posts={posts}
          savedPosts={savedPosts}
          transactions={transactions}
          pageLoading={pageLoading}
          retryCount={retryCount}
          healthData={healthData}
          translationsRecord={translationsRecord}
          onHealthDataUpdate={setHealthData}
          onEarnClick={handleEarn}
          onBuyClick={handleBuy}
          onRefreshClick={handleRefresh}
        />
      </div>
    </div>
  );
}
