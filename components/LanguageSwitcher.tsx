"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Language } from "@/lib/translations";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-[#1E1A41]/10 backdrop-blur-sm rounded-full p-1 border border-[#1E1A41]/20">
      <button
        onClick={() => setLanguage('pl')}
        className="relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300"
      >
        {language === 'pl' && (
          <motion.div
            layoutId="activeLang"
            className="absolute inset-0 bg-gradient-to-r from-[#C5E98A] to-[#3BC864] rounded-full shadow-lg"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className={`relative z-10 font-bold ${language === 'pl' ? 'text-red-600' : 'text-black/70'}`}>PL</span>
      </button>
      
      <button
        onClick={() => setLanguage('ua')}
        className="relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300"
      >
        {language === 'ua' && (
          <motion.div
            layoutId="activeLang"
            className="absolute inset-0 bg-gradient-to-r from-[#C5E98A] to-[#3BC864] rounded-full shadow-lg"
            initial={false}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className={`relative z-10 font-bold ${language === 'ua' ? 'text-red-600' : 'text-black/70'}`}>UA</span>
      </button>
    </div>
  );
}
