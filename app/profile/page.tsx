"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { TabsNavigation } from "@/components/profile/TabsNavigation";
import { PostsGrid } from "@/components/profile/PostsGrid";
import { CoursesGrid } from "@/components/profile/CoursesGrid";
import { ActionButtons } from "@/components/profile/ActionButtons";
import { TokenBalanceCard } from "@/components/profile/TokenBalanceCard";
import { TransactionHistory } from "@/components/profile/TransactionHistory";
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

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const handleToChat = () => {
    router.push("/chat");
  };

  const handleToHome = () => {
    router.push("/");
  };

  const handleLogout = () => {
    // ✅ Don't call router.push here - let the useEffect handle it
    // Because logout() sets user=null → isAuthenticated=false → effect redirects
    // Calling router.push here causes race condition
    logout();
  };

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
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Action Buttons */}
        <div className="mb-8">
          <ActionButtons 
            translations={translationsRecord}
            onEditProfile={handleEditProfile}
            onToChat={handleToChat}
            onToHome={handleToHome}
            onLogout={handleLogout}
          />
        </div>

        {/* Profile Header */}
        <div className="mb-8">
          <ProfileHeader 
            name={userProfile.name}
            email={userProfile.email}
            avatar={userProfile.avatar}
            bio={userProfile.bio}
            location={userProfile.location}
            followers={userProfile.followers}
            following={userProfile.following}
          />
        </div>

        {/* Token Balance Card */}
        <div className="mb-8">
          <TokenBalanceCard 
            balance={user.chefTokens || 0}
            loading={pageLoading}
            retryCount={retryCount}
            transactionsCount={transactions.length}
            translations={translationsRecord}
            onEarnClick={handleEarn}
            onBuyClick={handleBuy}
            onRefreshClick={handleRefresh}
          />
        </div>

        {/* Tabs Navigation */}
        <TabsNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          translations={translationsRecord}
        />

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-900 rounded-b-3xl shadow-lg overflow-hidden">
          {activeTab === "posts" && (
            <PostsGrid 
              posts={posts}
              loading={pageLoading}
              emptyMessage={translationsRecord.noPostsYet || "Нет постов"}
              onCreatePost={() => router.push("/academy/create")}
              translations={translationsRecord}
            />
          )}
          {activeTab === "saved" && (
            <PostsGrid 
              posts={savedPosts}
              loading={pageLoading}
              emptyMessage={translationsRecord.noSavedPosts || "Нет сохраненных постов"}
              translations={translationsRecord}
            />
          )}
          {activeTab === "courses" && (
            <CoursesGrid />
          )}
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <TransactionHistory 
            transactions={transactions}
            translations={translationsRecord}
          />
        </div>
      </div>
    </div>
  );
}
