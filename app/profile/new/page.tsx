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

export default function NewProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const [stats, setStats] = useState({
    cookedRecipes: 0,
    savedRecipes: 0,
    fridgeItems: 0,
    savedMoney: 0,
  });
  const [overviewData, setOverviewData] = useState({
    lastActions: [] as Array<{
      id: string;
      type: "product_added" | "dish_cooked" | "recipe_saved";
      text: string;
      timestamp: string;
    }>,
    weeklyBudget: 300,
    weeklySpent: 185,
  });
  const [statsData, setStatsData] = useState({
    wastePercentage: 8,
    topRecipes: [
      { name: "Spaghetti Carbonara", count: 5 },
      { name: "Pierogi ruskie", count: 4 },
      { name: "Rosół domowy", count: 3 },
    ],
    topCategories: [
      { name: "Warzywa", spent: 120 },
      { name: "Mięso", spent: 95 },
      { name: "Nabiał", spent: 68 },
    ],
  });
  const [resourcesData, setResourcesData] = useState({
    ownRecipes: 2,
    cartItems: 0,
    purchasedCourses: 3,
  });

  // Load stats from backend
  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // TODO: Replace with real API calls
        // Mock data for now
        setStats({
          cookedRecipes: 12,
          savedRecipes: 34,
          fridgeItems: 28,
          savedMoney: 450.50,
        });

        // Mock last actions
        setOverviewData({
          lastActions: [
            {
              id: "1",
              type: "dish_cooked",
              text: "Ugotowano: Spaghetti Carbonara",
              timestamp: "2 godziny temu",
            },
            {
              id: "2",
              type: "product_added",
              text: "Dodano: Pomidory, Bazylia, Mozzarella",
              timestamp: "5 godzin temu",
            },
            {
              id: "3",
              type: "recipe_saved",
              text: "Zapisano przepis: Tiramisu klasyczne",
              timestamp: "1 dzień temu",
            },
          ],
          weeklyBudget: 300,
          weeklySpent: 185,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };

    loadStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Ładowanie profilu...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Musisz być zalogowany</p>
          <button
            onClick={() => router.push("/auth")}
            className="px-6 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-sky-700 hover:to-cyan-700 transition-all"
          >
            Zaloguj się
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    console.log("Edit profile - open modal");
    // TODO: Open edit modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950 pt-24 pb-20">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Profile Header (Identity) */}
        <SimpleProfileHeader
          name={user.name}
          email={user.email}
          avatar={user.avatar}
          level={user.level || 5}
          chefTokens={user.chefTokens || 0}
          onEdit={handleEdit}
        />

        {/* 2. Quick Stats */}
        <QuickStats
          cookedRecipes={stats.cookedRecipes}
          savedRecipes={stats.savedRecipes}
          fridgeItems={stats.fridgeItems}
          savedMoney={stats.savedMoney}
        />

        {/* 3. Tab Navigation */}
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 4. Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-sky-500/10 to-cyan-500/10 rounded-2xl p-8 border border-sky-300/40 backdrop-blur-sm"
          >
            {activeTab === "overview" && (
              <OverviewTab
                level={user.level || 5}
                xp={2450}
                maxXp={5000}
                weeklyBudget={overviewData.weeklyBudget}
                weeklySpent={overviewData.weeklySpent}
                lastActions={overviewData.lastActions}
              />
            )}
            {activeTab === "stats" && (
              <StatsTab
                weeklyBudget={overviewData.weeklyBudget}
                weeklySpent={overviewData.weeklySpent}
                wastePercentage={statsData.wastePercentage}
                topRecipes={statsData.topRecipes}
                topCategories={statsData.topCategories}
              />
            )}
            {activeTab === "resources" && (
              <ResourcesTab
                savedRecipes={stats.savedRecipes}
                cookedRecipes={stats.cookedRecipes}
                ownRecipes={resourcesData.ownRecipes}
                cartItems={resourcesData.cartItems}
                purchasedCourses={resourcesData.purchasedCourses}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
