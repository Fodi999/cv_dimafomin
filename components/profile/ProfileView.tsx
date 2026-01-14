"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, TrendingUp, FileText } from "lucide-react";
import { ProfileHeader } from "./ProfileHeader";
import { OverviewSection } from "./sections/OverviewSection";
import { StatsSection } from "./sections/StatsSection";
import { ContentSection } from "./sections/ContentSection";
import type { TabType, UserProfile, Post, Transaction } from "@/lib/profile-types";
import type { FormData } from "@/lib/profile-types";
import { colors } from "@/lib/design-tokens";

interface ProfileViewProps {
  // Profile data
  userProfile: UserProfile;
  user: {
    chefTokens?: number;
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  // Posts and transactions
  posts: Post[];
  savedPosts: Post[];
  transactions: Transaction[];
  // Health data
  healthData: {
    age: number;
    weight: number;
    height: number;
    dailyCalories: number;
    allergies: string[];
    dietaryRestrictions: string[];
    fitnessGoal: string;
  };
  // Flags
  pageLoading: boolean;
  retryCount: number;
  isOwn: boolean; // If true - show wallet tab, if false - only public tabs
  // Translations
  translations: Record<string, string>;
  // Handlers
  onHealthDataUpdate: (data: any) => void;
  onEarnClick: () => void;
  onBuyClick: () => void;
  onRefreshClick: () => void;
}

export function ProfileView({
  userProfile,
  user,
  posts,
  savedPosts,
  transactions,
  healthData,
  pageLoading,
  retryCount,
  isOwn,
  translations,
  onHealthDataUpdate,
  onEarnClick,
  onBuyClick,
  onRefreshClick,
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  return (
    <div className={`min-h-screen w-screen ${colors.primary.dark.gradient} flex flex-col`}>
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Profile Container - Scrollable */}
      <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-20 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* PROFILE HEADER - Static, doesn't change with tabs */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 mt-6"
          >
            <ProfileHeader
              name={userProfile.name}
              email={userProfile.email}
              avatar={userProfile.avatar}
              bio={userProfile.bio}
              location={userProfile.location}
              followers={userProfile.followers}
              following={userProfile.following}
              profile={userProfile}
              level={5}
              xp={2450}
              maxXp={5000}
              balance={user?.chefTokens || 0}
              coursesCount={3}
            />
          </motion.div>

          {/* Tab Navigation - NOT in Tabs/AnimatePresence so it doesn't flicker */}
          <div className="flex gap-2 border-b border-gray-700/50 pb-4 mb-8 overflow-x-auto">
            <motion.button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-4 rounded-lg text-sm sm:text-base font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === "overview"
                  ? "bg-violet-500/30 text-violet-300"
                  : "text-gray-400 hover:text-white hover:bg-violet-500/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden sm:inline">Обзор</span>
              <BarChart3 className="sm:hidden w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("stats")}
              className={`py-2 px-4 rounded-lg text-sm sm:text-base font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === "stats"
                  ? "bg-violet-500/30 text-violet-300"
                  : "text-gray-400 hover:text-white hover:bg-violet-500/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden sm:inline">Статистика</span>
              <TrendingUp className="sm:hidden w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("content")}
              className={`py-2 px-4 rounded-lg text-sm sm:text-base font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === "content"
                  ? "bg-violet-500/30 text-violet-300"
                  : "text-gray-400 hover:text-white hover:bg-violet-500/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden sm:inline">Контент</span>
              <FileText className="sm:hidden w-5 h-5" />
            </motion.button>
          </div>

          {/* Animated Tab Content - only content animates */}
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <OverviewSection
                  userProfile={userProfile}
                  user={user}
                  translations={translations}
                  onEarnClick={onEarnClick}
                  onBuyClick={onBuyClick}
                  onRefreshClick={onRefreshClick}
                  retryCount={retryCount}
                />
              </motion.div>
            )}

            {/* Stats Tab */}
            {activeTab === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <StatsSection
                  userProfile={userProfile}
                  healthData={healthData}
                  onHealthDataUpdate={onHealthDataUpdate}
                />
              </motion.div>
            )}

            {/* Content Tab */}
            {activeTab === "content" && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <ContentSection
                  posts={posts}
                  savedPosts={savedPosts}
                  translations={translations}
                  userProfile={userProfile}
                  user={user}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
