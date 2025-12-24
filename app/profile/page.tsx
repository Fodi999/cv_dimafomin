"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { SimpleProfileHeader } from "@/components/profile/SimpleProfileHeader";
import { QuickStats } from "@/components/profile/QuickStats";
import { ProfileTabs, ProfileTab } from "@/components/profile/ProfileTabs";
import { OverviewTab } from "@/components/profile/tabs/OverviewTab";
import { StatsTab } from "@/components/profile/tabs/StatsTab";
import { ResourcesTab } from "@/components/profile/tabs/ResourcesTab";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateProfile } = useUser();

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Ładowanie profilu...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Musisz być zalogowany, aby zobaczyć profil
          </p>
          <button
            onClick={() => router.push("/auth")}
            className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            Zaloguj się
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        {/* Верхняя часть: Header */}
        <div className="mb-3 sm:mb-4">
          <SimpleProfileHeader
            name={user.name || "User"}
            email={user.email || ""}
            avatar={user.avatar || "/default-avatar.png"}
            level={user.level || 1}
            chefTokens={user.chefTokens || 0}
            onEdit={handleEditProfile}
          />
        </div>

        {/* Layout в 2 колонки: Stats слева, Tabs справа */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Quick Stats - занимает 4 колонки */}
          <div className="lg:col-span-4">
            <QuickStats
              cookedRecipes={stats.cookedRecipes}
              savedRecipes={stats.savedRecipes}
              fridgeItems={stats.fridgeItems}
              savedMoney={stats.savedMoney}
            />
          </div>

          {/* Tabs Content - занимает 8 колонок */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
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
    </div>
  );
}
