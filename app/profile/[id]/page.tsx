"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { TabsNavigation } from "@/components/profile/TabsNavigation";
import { PostsGrid } from "@/components/profile/PostsGrid";
import { CoursesGrid } from "@/components/profile/CoursesGrid";
import { TokenBalanceCard } from "@/components/profile/TokenBalanceCard";
import { TransactionHistory } from "@/components/profile/TransactionHistory";
import type { TabType, UserProfile, Post, Transaction } from "@/lib/profile-types";
import { useProfileTranslations } from "@/hooks/useProfileTranslations";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft, UserPlus, UserMinus } from "lucide-react";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const { user, isLoading: authLoading } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { translations } = useProfileTranslations();
  const isOwnProfile = user?.id === userId;

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setPageLoading(true);
        // TODO: Replace with actual API call to get specific user profile
        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const profileData = await response.json();
        setUserProfile(profileData);
        setIsFollowing(profileData.isFollowing || false);
      } catch (error) {
        console.error("Failed to load profile:", error);
        // Fallback to not found state
        setUserProfile(null);
      } finally {
        setPageLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  // Load posts
  useEffect(() => {
    if (!userProfile) return;
    
    const loadPosts = async () => {
      try {
        setPostsLoading(true);
        // TODO: Replace with actual API call
        setPosts([]);
        setSavedPosts([]);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setPostsLoading(false);
      }
    };

    loadPosts();
  }, [userProfile]);

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

  if (pageLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
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

  const translationsRecord = translations as Record<string, string>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Main Profile Container */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        {/* Action Buttons */}
        {!isOwnProfile && (
          <div className="mb-8 flex gap-3 justify-center">
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
            <Button
              onClick={handleMessage}
              variant="outline"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Написать
            </Button>
          </div>
        )}

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

        {/* Token Balance Card - only show for own profile */}
        {isOwnProfile && (
          <div className="mb-8">
            <TokenBalanceCard 
              balance={user?.chefTokens || 0}
              loading={false}
              retryCount={0}
              transactionsCount={transactions.length}
              translations={translationsRecord}
              onEarnClick={() => router.push("/academy")}
              onBuyClick={() => console.log("Buy tokens")}
              onRefreshClick={() => console.log("Refresh")}
            />
          </div>
        )}

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
              loading={postsLoading}
              emptyMessage={translationsRecord.noPostsYet || "Нет постов"}
              translations={translationsRecord}
            />
          )}
          {activeTab === "saved" && isOwnProfile && (
            <PostsGrid 
              posts={savedPosts}
              loading={postsLoading}
              emptyMessage={translationsRecord.noSavedPosts || "Нет сохраненных постов"}
              translations={translationsRecord}
            />
          )}
          {activeTab === "courses" && (
            <CoursesGrid />
          )}
        </div>

        {/* Transaction History - only show for own profile */}
        {isOwnProfile && (
          <div className="mt-8">
            <TransactionHistory 
              transactions={transactions}
              translations={translationsRecord}
            />
          </div>
        )}
      </div>
    </div>
  );
}
