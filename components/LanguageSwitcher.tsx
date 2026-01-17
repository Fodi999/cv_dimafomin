"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Language } from "@/lib/i18n/types";
import { gradients } from "@/lib/design-tokens";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const { updateSettings, loadSettings } = useSettings();
  const { isAuthenticated } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Handle language change
   * 
   * ✅ ПРАВИЛЬНО: Сохраняет язык в БД, затем перезагружает UI
   * 
   * КРИТИЧНО: Один источник истины — backend
   * 
   * 1. PATCH /api/settings { "language": "ru" }
   * 2. Обновить SettingsContext (принудительно перезагрузить)
   * 3. Ререндерить AI-блоки
   * 4. Обновить UI через setLanguage
   * 
   * 👉 AI, уведомления и UI всегда совпадают
   */
  const handleLanguageChange = async (lang: Language) => {
    if (lang === language || isUpdating) return;

    setIsUpdating(true);

    try {
      // If authenticated, save to backend FIRST (source of truth)
      if (isAuthenticated) {
        console.log(`🌍 [1/3] Saving language to backend: ${lang}`);
        await updateSettings({ language: lang });
        console.log(`✅ [2/3] Language saved to DB: ${lang}`);
        
        // Force reload settings to ensure AI gets the new language
        console.log(`🔄 [3/3] Reloading settings from backend...`);
        await loadSettings();
        console.log(`✅ Settings reloaded, AI will use new language: ${lang}`);
      }

      // Then update UI (this will reload the page)
      setLanguage(lang);
    } catch (error) {
      console.error("❌ Failed to save language:", error);
      
      // Show error to user
      if (typeof window !== "undefined") {
        alert("Nie udało się zapisać języka. Spróbuj ponownie.");
      }
      
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gray-900/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-full p-1 border border-gray-900/20 dark:border-gray-700/50 relative">
      {/* Polish */}
      <button
        onClick={() => handleLanguageChange('pl')}
        disabled={isUpdating}
        className="relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {language === 'pl' && (
          <motion.div
            layoutId="activeLang"
            className={`absolute inset-0 ${gradients.primary} rounded-full shadow-lg dark:shadow-sky-500/30`}
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className={`relative z-10 font-bold ${language === 'pl' ? 'text-white' : 'text-gray-700 dark:text-gray-400'}`}>
          {isUpdating && language !== 'pl' ? '...' : 'PL'}
        </span>
      </button>

      {/* English */}
      <button
        onClick={() => handleLanguageChange('en')}
        disabled={isUpdating}
        className="relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {language === 'en' && (
          <motion.div
            layoutId="activeLang"
            className={`absolute inset-0 ${gradients.primary} rounded-full shadow-lg dark:shadow-sky-500/30`}
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className={`relative z-10 font-bold ${language === 'en' ? 'text-white' : 'text-gray-700 dark:text-gray-400'}`}>
          {isUpdating && language !== 'en' ? '...' : 'EN'}
        </span>
      </button>

      {/* Russian */}
      <button
        onClick={() => handleLanguageChange('ru')}
        disabled={isUpdating}
        className="relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {language === 'ru' && (
          <motion.div
            layoutId="activeLang"
            className={`absolute inset-0 ${gradients.primary} rounded-full shadow-lg dark:shadow-sky-500/30`}
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className={`relative z-10 font-bold ${language === 'ru' ? 'text-white' : 'text-gray-700 dark:text-gray-400'}`}>
          {isUpdating && language !== 'ru' ? '...' : 'RU'}
        </span>
      </button>
    </div>
  );
}
