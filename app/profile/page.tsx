"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { SimpleProfileHeader } from "@/components/profile/SimpleProfileHeader";
import { HeroKPI } from "@/components/profile/HeroKPI";
import { ProgressControl } from "@/components/profile/ProgressControl";
import { ProfileTabs, ProfileTab } from "@/components/profile/ProfileTabs";
import { OverviewTab } from "@/components/profile/tabs/OverviewTab";
import { StatsTab } from "@/components/profile/tabs/StatsTab";
import { ResourcesTab } from "@/components/profile/tabs/ResourcesTab";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateProfile } = useUser();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  const [stats, setStats] = useState({
    cookedRecipes: 12,
    savedRecipes: 34,
    fridgeItems: 28,
    savedMoney: 450.50,
  });

  const [overviewData, setOverviewData] = useState({
    lastActions: [
      {
        id: "1",
        type: "dish_cooked" as const,
        text: "Ugotowano: Spaghetti Carbonara",
        timestamp: "2024-01-15T18:30:00Z",
      },
      {
        id: "2",
        type: "product_added" as const,
        text: "Dodano: Mleko 2%",
        timestamp: "2024-01-15T12:00:00Z",
      },
    ],
    weeklyBudget: 300,
    weeklySpent: 185,
  });

  const [statsData, setStatsData] = useState({
    wastePercentage: 8,
    topRecipes: [
      { name: "Spaghetti Carbonara", count: 5 },
      { name: "Pierogi ruskie", count: 4 },
    ],
    topCategories: [
      { name: "Warzywa", spent: 120 },
      { name: "Mięso", spent: 95 },
    ],
  });

  const [resourcesData, setResourcesData] = useState({
    ownRecipes: 2,
    cartItems: 0,
    purchasedCourses: 3,
  });

  useEffect(() => {
    if (!user) return;
  }, [user]);

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
  };

  const handleSettings = () => {
    router.push("/profile/settings");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {t?.profile?.page?.loading || "Loading profile..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t?.profile?.page?.notLoggedIn || "You must be logged in to view profile"}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all"
          >
            {t?.profile?.page?.loginButton || "Log in"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Sticky Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t?.profile?.page?.backButton || "Back"}</span>
          </button>
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {t?.profile?.page?.title || "Profile"}
            </h1>
          </div>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        
        {/* 🧠 Block 1: Identity (minimal, quiet) */}
        <div className="mb-3 sm:mb-4">
          <SimpleProfileHeader
            name={user.name || "User"}
            email={user.email || ""}
            avatar={user.avatar || "/default-avatar.png"}
            level={user.level || 1}
            chefTokens={user.chefTokens || 0}
            onEdit={handleEditProfile}
            onSettings={handleSettings}
          />
          {/* Page Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2 font-medium"
          >
            {t?.profile?.page?.subtitle || "💼 Your kitchen management center"}
          </motion.p>
        </div>

        {/* 🔥 Block 2: Hero KPI (Main Metrics - Oszczędzono is PRIMARY) */}
        <div className="mb-3 sm:mb-4">
          <HeroKPI
            savedMoney={stats.savedMoney}
            cookedRecipes={stats.cookedRecipes}
            fridgeItems={stats.fridgeItems}
            chefTokens={user.chefTokens || 0}
          />
        </div>

        {/* 📈 Block 3: Progress & Control (Level + Budget) */}
        <div className="mb-3 sm:mb-4">
          <ProgressControl
            level={user.level || 1}
            xp={2450}
            maxXp={5000}
            weeklyBudget={overviewData.weeklyBudget}
            weeklySpent={overviewData.weeklySpent}
          />
        </div>

        {/* 🧭 Block 4: Tabs (Przegląd / Statystyki / Zasoby) */}
        <div className="space-y-3 sm:space-y-4">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <OverviewTab
                  level={user.level || 1}
                  xp={2450}
                  maxXp={5000}
                  lastActions={overviewData.lastActions}
                  weeklyBudget={overviewData.weeklyBudget}
                  weeklySpent={overviewData.weeklySpent}
                />
              </motion.div>
            )}

            {activeTab === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <StatsTab
                  weeklyBudget={overviewData.weeklyBudget}
                  weeklySpent={overviewData.weeklySpent}
                  wastePercentage={statsData.wastePercentage}
                  topRecipes={statsData.topRecipes}
                  topCategories={statsData.topCategories}
                />
              </motion.div>
            )}

            {activeTab === "resources" && (
              <motion.div
                key="resources"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ResourcesTab
                  savedRecipes={stats.savedRecipes}
                  cookedRecipes={stats.cookedRecipes}
                  ownRecipes={resourcesData.ownRecipes}
                  cartItems={resourcesData.cartItems}
                  purchasedCourses={resourcesData.purchasedCourses}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
