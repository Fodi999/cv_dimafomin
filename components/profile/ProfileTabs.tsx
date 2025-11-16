"use client";

import { motion } from "framer-motion";
import { Zap, Heart, FileText, ShoppingCart, BarChart3 } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProfileHeader } from "./ProfileHeader";
import { TokenBalanceCard } from "./TokenBalanceCard";
import { HealthProfile } from "./HealthProfile";
import type { UserProfile, Post, Transaction } from "@/lib/profile-types";
import React from "react";
import { PostsCard } from "./PostsCard";
import { SavedPostsCard } from "./SavedPostsCard";
import { TransactionsCard } from "./TransactionsCard";
import { borderRadius, colors } from "@/lib/design-tokens";

interface ProfileTabsProps {
  userProfile: UserProfile;
  user: {
    chefTokens?: number;
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  posts: Post[];
  savedPosts: Post[];
  transactions: Transaction[];
  pageLoading: boolean;
  retryCount: number;
  healthData: {
    age: number;
    weight: number;
    height: number;
    dailyCalories: number;
    allergies: string[];
    dietaryRestrictions: string[];
    fitnessGoal: string;
  };
  translationsRecord: Record<string, string>;
  onHealthDataUpdate: (data: any) => void;
  onEarnClick: () => void;
  onBuyClick: () => void;
  onRefreshClick: () => void;
}

export function ProfileTabs({
  userProfile,
  user,
  posts,
  savedPosts,
  transactions,
  pageLoading,
  retryCount,
  healthData,
  translationsRecord,
  onHealthDataUpdate,
  onEarnClick,
  onBuyClick,
  onRefreshClick,
}: ProfileTabsProps) {
  return (
    <div className="space-y-6">
      {/* Profile Header - Always Visible */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <ProfileHeader
          name={userProfile.name}
          email={userProfile.email}
          avatar={userProfile.avatar}
          bio={userProfile.bio}
          location={userProfile.location}
          followers={userProfile.followers}
          following={userProfile.following}
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="earn" className="w-full">
          <TabsList className={`grid w-full grid-cols-5 bg-gray-900/60 p-1 ${borderRadius.lg} border border-sky-400/30 shadow-lg backdrop-blur-sm`}>
            {/* Earn Tokens Tab */}
            <TabsTrigger 
              value="earn" 
              className={`flex items-center gap-2 ${borderRadius.md} data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all`}
            >
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-semibold">Zarabiać</span>
            </TabsTrigger>

            {/* Health Profile Tab */}
            <TabsTrigger 
              value="health"
              className={`flex items-center gap-2 ${borderRadius.md} data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all`}
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-semibold">Zdrowie</span>
            </TabsTrigger>

            {/* Posts Tab */}
            <TabsTrigger 
              value="posts"
              className={`flex items-center gap-2 ${borderRadius.md} data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-sky-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-semibold">Posty</span>
            </TabsTrigger>

            {/* Saved Tab */}
            <TabsTrigger 
              value="saved"
              className={`flex items-center gap-2 ${borderRadius.md} data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-semibold">Zapisane</span>
            </TabsTrigger>

            {/* Transactions Tab */}
            <TabsTrigger 
              value="transactions"
              className={`flex items-center gap-2 ${borderRadius.md} data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-semibold">Historia</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className={`mt-8 ${borderRadius.lg} overflow-hidden border border-sky-400/30 shadow-lg`}>
            {/* Earn Tokens Content */}
            <TabsContent value="earn" className="p-6 bg-gray-900/40 backdrop-blur-sm">
              <TokenBalanceCard
                balance={user.chefTokens || 0}
                loading={pageLoading}
                retryCount={retryCount}
                transactionsCount={transactions.length}
                translations={translationsRecord}
                onEarnClick={onEarnClick}
                onBuyClick={onBuyClick}
                onRefreshClick={onRefreshClick}
              />
            </TabsContent>

            {/* Health Profile Content */}
            <TabsContent value="health" className="p-6 bg-gray-900/40 backdrop-blur-sm">
              <HealthProfile
                age={healthData.age}
                weight={healthData.weight}
                height={healthData.height}
                dailyCalories={healthData.dailyCalories}
                allergies={healthData.allergies}
                dietaryRestrictions={healthData.dietaryRestrictions}
                fitnessGoal={healthData.fitnessGoal}
                onUpdate={onHealthDataUpdate}
              />
            </TabsContent>

            {/* Posts Content */}
            <TabsContent value="posts" className="p-6 bg-gray-900/40 backdrop-blur-sm">
              <PostsCard posts={posts} onCreatePost={() => {}} />
            </TabsContent>

            {/* Saved Content */}
            <TabsContent value="saved" className="p-6 bg-gray-900/40 backdrop-blur-sm">
              <SavedPostsCard posts={savedPosts} />
            </TabsContent>

            {/* Transactions Content */}
            <TabsContent value="transactions" className="p-6 bg-gray-900/40 backdrop-blur-sm">
              <TransactionsCard transactions={transactions} />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}
