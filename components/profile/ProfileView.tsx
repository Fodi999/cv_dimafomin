"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OverviewSection } from "./sections/OverviewSection";
import { StatsSection } from "./sections/StatsSection";
import { ContentSection } from "./sections/ContentSection";
import { WalletSection } from "./sections/WalletSection";
import { EditSection } from "./sections/EditSection";
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
  // Form data for editing
  formData: FormData;
  // Flags
  pageLoading: boolean;
  retryCount: number;
  isSaving?: boolean;
  isOwn: boolean; // If true - show edit and wallet tabs, if false - only public tabs
  // Translations
  translations: Record<string, string>;
  // Handlers
  onHealthDataUpdate: (data: any) => void;
  onFormChange: (data: Partial<FormData>) => void;
  onSave: () => Promise<void>;
  onAvatarUpload: (url: string) => Promise<void>;
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
  formData,
  pageLoading,
  retryCount,
  isSaving = false,
  isOwn,
  translations,
  onHealthDataUpdate,
  onFormChange,
  onSave,
  onAvatarUpload,
  onEarnClick,
  onBuyClick,
  onRefreshClick,
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Disable body scroll when profile is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className={`h-screen w-screen fixed inset-0 ${colors.primary.dark.gradient} overflow-hidden flex flex-col`}>
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Profile Container */}
      <div className="relative z-10 flex-1 overflow-hidden max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
            {/* Tabs List */}
            <TabsList className={`grid w-full ${isOwn ? 'grid-cols-5' : 'grid-cols-3'} bg-gray-900/60 p-1 rounded-lg border border-sky-400/30 shadow-lg backdrop-blur-sm mb-6`}>
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all"
              >
                <span className="hidden sm:inline text-xs font-semibold">Обзор</span>
                <span className="sm:hidden text-xs font-semibold">📊</span>
              </TabsTrigger>

              <TabsTrigger
                value="stats"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all"
              >
                <span className="hidden sm:inline text-xs font-semibold">Статистика</span>
                <span className="sm:hidden text-xs font-semibold">📈</span>
              </TabsTrigger>

              <TabsTrigger
                value="content"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all"
              >
                <span className="hidden sm:inline text-xs font-semibold">Контент</span>
                <span className="sm:hidden text-xs font-semibold">📝</span>
              </TabsTrigger>

              {/* Wallet - only for own profile */}
              {isOwn && (
                <TabsTrigger
                  value="wallet"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all"
                >
                  <span className="hidden sm:inline text-xs font-semibold">Кошелёк</span>
                  <span className="sm:hidden text-xs font-semibold">💰</span>
                </TabsTrigger>
              )}

              {/* Edit - only for own profile */}
              {isOwn && (
                <TabsTrigger
                  value="edit"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all"
                >
                  <span className="hidden sm:inline text-xs font-semibold">Редактирование</span>
                  <span className="sm:hidden text-xs font-semibold">✏️</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <OverviewSection
                userProfile={userProfile}
                user={user}
                translations={translations}
                onEarnClick={onEarnClick}
                onBuyClick={onBuyClick}
                onRefreshClick={onRefreshClick}
                retryCount={retryCount}
              />
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-6">
              <StatsSection
                userProfile={userProfile}
                healthData={healthData}
                onHealthDataUpdate={onHealthDataUpdate}
              />
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <ContentSection
                posts={posts}
                savedPosts={savedPosts}
                translations={translations}
              />
            </TabsContent>

            {/* Wallet Tab - only for own profile */}
            {isOwn && (
              <TabsContent value="wallet" className="space-y-6">
                <WalletSection
                  balance={user?.chefTokens || 0}
                  transactions={transactions}
                  retryCount={retryCount}
                  translations={translations}
                  onEarnClick={onEarnClick}
                  onBuyClick={onBuyClick}
                  onRefreshClick={onRefreshClick}
                />
              </TabsContent>
            )}

            {/* Edit Tab - only for own profile */}
            {isOwn && (
              <TabsContent value="edit" className="space-y-6">
                <EditSection
                  user={userProfile}
                  formData={formData}
                  onFormChange={onFormChange}
                  onSave={onSave}
                  onAvatarUpload={onAvatarUpload}
                  isSaving={isSaving}
                  translations={translations}
                />
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
