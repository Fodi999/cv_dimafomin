"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function AcademyHero() {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950 dark:via-blue-900 dark:to-indigo-950">
      {/* Content - Centered */}
      <div className="container max-w-3xl mx-auto px-4 text-center space-y-12">
        {/* Main Message */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t.journey.screen1.title}
            <br />
            <span className="text-sky-600 dark:text-sky-400">{t.journey.screen1.titleHighlight}</span>
          </h1>
          
          <div className="pt-8 space-y-2">
            <p className="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300">
              {t.journey.screen1.subtitle1}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t.journey.screen1.subtitle2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
