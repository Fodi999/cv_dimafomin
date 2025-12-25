"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { TrendingUp, MessageSquare, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CommunityTabs from "./components/CommunityTabs";
import FeedTab from "./components/FeedTab";
import DiscussionsTab from "./components/DiscussionsTab";

export default function CommunityPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const community = (t.academy as any)?.community;

  // Tab state from URL
  const [activeTab, setActiveTab] = useState<"feed" | "discussions">(
    (searchParams.get("tab") as "feed" | "discussions") || "feed"
  );

  // Filter state (shared between tabs)
  const [feedFilter, setFeedFilter] = useState<"all" | "trending" | "following">("all");
  const [discussionsFilter, setDiscussionsFilter] = useState<"all" | "trending">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Update URL when tab changes
  const handleTabChange = (tab: "feed" | "discussions") => {
    setActiveTab(tab);
    router.push(`/academy/community?tab=${tab}`, { scroll: false });
  };

  // Stats data
  const stats = [
    {
      icon: TrendingUp,
      label: "Aktywne posty",
      value: "1,234",
      change: "+12%",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: MessageSquare,
      label: "Aktywni szefowie",
      value: "567",
      change: "+8%",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: Award,
      label: "Rozdane tokeny",
      value: "89K",
      change: "+23%",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {community?.title || "Społeczność"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {community?.subtitle || "Dziel się przepisami, dyskutuj i ucz się od innych szefów kuchni"}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">{stat.change} ostatni tydzień</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <CommunityTabs activeTab={activeTab} onTabChange={handleTabChange} className="mb-8" />

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "feed" && (
            <FeedTab
              filter={feedFilter}
              onFilterChange={setFeedFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}
          {activeTab === "discussions" && (
            <DiscussionsTab
              filter={discussionsFilter}
              onFilterChange={setDiscussionsFilter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
