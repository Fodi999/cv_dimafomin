"use client";

import { motion } from "framer-motion";
import { Rss, MessageSquare } from "lucide-react";

export type CommunityTab = "feed" | "discussions";

interface CommunityTabsProps {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
  className?: string;
}

export default function CommunityTabs({ activeTab, onTabChange, className = "" }: CommunityTabsProps) {
  const tabs = [
    {
      id: "feed" as CommunityTab,
      label: "Przepisy",
      icon: Rss,
      description: "Globalna ścianka przepisów",
    },
    {
      id: "discussions" as CommunityTab,
      label: "Dyskusje",
      icon: MessageSquare,
      description: "Rozmowy społeczności",
    },
  ];

  return (
    <div className={`border-b border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="flex gap-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative pb-4 px-2 font-semibold transition-all
                ${isActive 
                  ? "text-[#3BC864] dark:text-[#3BC864]" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }
              `}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </div>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3BC864]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
