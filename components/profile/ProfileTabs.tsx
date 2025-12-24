"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, BarChart3, Coins } from "lucide-react";

export type ProfileTab = "overview" | "stats" | "resources";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

/**
 * Profile Tab Navigation
 * 3 tabs with CLEAR PURPOSE:
 * - Przegląd: Main dashboard (level, budget, last actions, CTAs)
 * - Statystyki: Pure analytics (charts, waste %, top categories)
 * - Zasoby: My resources (recipes, cart, purchased courses)
 */
export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs: Array<{ id: ProfileTab; label: string; icon: React.ReactNode }> = [
    { id: "overview", label: "Przegląd", icon: <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: "stats", label: "Statystyki", icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: "resources", label: "Zasoby", icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium text-xs sm:text-sm
              flex items-center gap-1.5 sm:gap-2 whitespace-nowrap
              transition-all duration-200
              ${
                isActive
                  ? "bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-lg"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            {tab.icon}
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-sky-600 to-cyan-600 rounded-lg -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
