"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Settings, 
  Globe, 
  Bot, 
  Bell
} from "lucide-react";
import {
  CoreSettingsSection,
  AIPreferencesSection,
  NotificationSettingsSection,
} from "@/components/profile/settings";
import { motion } from "framer-motion";

type SettingsSection = 
  | "core" 
  | "ai" 
  | "notifications";

export default function SettingsPage() {
  const router = useRouter();
  const { isLoaded, isUpdating } = useSettings();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<SettingsSection>("core");

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t?.profile?.settings?.loading || "Loading settings..."}</p>
        </div>
      </div>
    );
  }

  const sections = [
    { 
      id: "core", 
      label: t?.profile?.settings?.sections?.core?.label || "Core", 
      icon: Settings, 
      description: t?.profile?.settings?.sections?.core?.description || "Language, time, units" 
    },
    { 
      id: "ai", 
      label: t?.profile?.settings?.sections?.ai?.label || "AI & Mentor", 
      icon: Bot, 
      description: t?.profile?.settings?.sections?.ai?.description || "Assistant style" 
    },
    { 
      id: "notifications", 
      label: t?.profile?.settings?.sections?.notifications?.label || "Notifications", 
      icon: Bell, 
      description: t?.profile?.settings?.sections?.notifications?.description || "Important reminders" 
    },
  ] as const;

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
            <span className="font-medium">{t?.profile?.settings?.backButton || "Back"}</span>
          </button>
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t?.profile?.settings?.title || "Settings"}</h1>
          </div>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
        {/* Page Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 font-medium"
        >
          {t?.profile?.settings?.subtitle || "Simple settings. Smart action."}
        </motion.p>
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-12 md:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-2 sticky top-24"
            >
              {sections.map((section, index) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <motion.button
                    key={section.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                    onClick={() => setActiveSection(section.id as SettingsSection)}
                    className={`
                      w-full flex flex-col gap-1 px-4 py-4 rounded-xl
                      text-left transition-all duration-200
                      ${isActive 
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-[1.02]" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-purple-500"}`} />
                      <span className="text-sm font-semibold">{section.label}</span>
                    </div>
                    <span className={`text-xs ml-8 ${isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                      {section.description}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* Content Area */}
          <div className="col-span-12 md:col-span-9">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6"
            >
              {isUpdating && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300 text-sm flex items-center gap-2"
                >
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  <span>{t?.profile?.settings?.saving || "Saving..."}</span>
                </motion.div>
              )}

              {activeSection === "core" && <CoreSettingsSection />}

              {activeSection === "ai" && (
                <div className="text-center py-12 text-gray-500">
                  AI Preferences - TODO: Update to use SettingsContext
                </div>
              )}

              {activeSection === "notifications" && (
                <div className="text-center py-12 text-gray-500">
                  Notifications - TODO: Update to use SettingsContext
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
