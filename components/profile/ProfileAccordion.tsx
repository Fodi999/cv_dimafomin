"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap, Heart } from "lucide-react";
import { ProfileHeader } from "./ProfileHeader";
import { TokenBalanceCard } from "./TokenBalanceCard";
import { HealthProfile } from "./HealthProfile";
import { TabsNavigation } from "./TabsNavigation";
import type { TabType, UserProfile, Post, Transaction } from "@/lib/profile-types";

interface ProfileAccordionProps {
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
  activeTab: TabType;
  healthData: {
    age: number;
    weight: number;
    height: number;
    dailyCalories: number;
    allergies: string[];
    dietaryRestrictions: string[];
    fitnessGoal: string;
  };
  translations: Record<string, string>;
  translationsRecord: Record<string, string>;
  onTabChange: (tab: TabType) => void;
  onHealthDataUpdate: (data: any) => void;
  onEarnClick: () => void;
  onBuyClick: () => void;
  onRefreshClick: () => void;
}

export function ProfileAccordion({
  userProfile,
  user,
  posts,
  savedPosts,
  transactions,
  pageLoading,
  retryCount,
  activeTab,
  healthData,
  translations,
  translationsRecord,
  onTabChange,
  onHealthDataUpdate,
  onEarnClick,
  onBuyClick,
  onRefreshClick,
}: ProfileAccordionProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["earn"])
  );

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const sections = [
    {
      id: "earn",
      title: "Zacznij zarabiać tokeny!",
      subtitle: "Wykonuj zadania, twórz przepisy lub kupuj tokeny",
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      render: () => (
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
      ),
    },
    {
      id: "health",
      title: "Профіль здоров'я",
      icon: <Heart className="w-5 h-5 text-red-500" />,
      render: () => (
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
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Profile Header - Always Visible */}
      <div className="mb-6">
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

      {/* Accordion Sections */}
      {sections.map((section) => {
        const isExpanded = expandedSections.has(section.id);

        return (
          <motion.div
            key={section.id}
            className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-950 transition-colors"
            layout
          >
            {/* Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                {section.icon}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h3>
                  {section.subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {section.subtitle}
                    </p>
                  )}
                </div>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-4"
              >
                <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-600" />
              </motion.div>
            </button>

            {/* Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 dark:border-gray-800"
                >
                  <div className="p-4 bg-gray-50/50 dark:bg-gray-900/50">
                    {section.render()}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Tabs Section - Below Accordion */}
      <div className="mt-8">
        <TabsNavigation
          activeTab={activeTab}
          onTabChange={onTabChange}
          translations={translations}
        />
      </div>
    </div>
  );
}
