"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";
import { gradients } from "@/lib/design-tokens";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-gray-900/10 dark:bg-gray-700/20 backdrop-blur-sm rounded-full p-1 border border-gray-900/20 dark:border-gray-700/50 relative">
      <button
        onClick={() => setLanguage('pl')}
        className="relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300"
      >
        {language === 'pl' && (
          <motion.div
            layoutId="activeLang"
            className={`absolute inset-0 ${gradients.primary} rounded-full shadow-lg dark:shadow-sky-500/30`}
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className={`relative z-10 font-bold ${language === 'pl' ? 'text-white' : 'text-gray-700 dark:text-gray-400'}`}>Polski</span>
      </button>
    </div>
  );
}
