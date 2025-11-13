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
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
            {/* Earn Tokens Tab */}
            <TabsTrigger 
              value="earn" 
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="hidden sm:inline text-sm">Zarabiać</span>
            </TabsTrigger>

            {/* Health Profile Tab */}
            <TabsTrigger 
              value="health"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
            >
              <Heart className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline text-sm">Zdrowie</span>
            </TabsTrigger>

            {/* Posts Tab */}
            <TabsTrigger 
              value="posts"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
            >
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline text-sm">Posty</span>
            </TabsTrigger>

            {/* Saved Tab */}
            <TabsTrigger 
              value="saved"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
            >
              <ShoppingCart className="w-4 h-4 text-green-500" />
              <span className="hidden sm:inline text-sm">Zapisane</span>
            </TabsTrigger>

            {/* Transactions Tab */}
            <TabsTrigger 
              value="transactions"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
            >
              <BarChart3 className="w-4 h-4 text-purple-500" />
              <span className="hidden sm:inline text-sm">Historia</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="mt-6 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            {/* Earn Tokens Content */}
            <TabsContent value="earn" className="p-4 bg-white dark:bg-gray-950">
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
            <TabsContent value="health" className="p-4 bg-white dark:bg-gray-950">
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
            <TabsContent value="posts" className="p-4 bg-white dark:bg-gray-950">
              <PostsCard posts={posts} onCreatePost={() => {}} />
            </TabsContent>

            {/* Saved Content */}
            <TabsContent value="saved" className="p-4 bg-white dark:bg-gray-950">
              <SavedPostsCard posts={savedPosts} />
            </TabsContent>

            {/* Transactions Content */}
            <TabsContent value="transactions" className="p-4 bg-white dark:bg-gray-950">
              <TransactionsCard transactions={transactions} />
            </TabsContent>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
}
