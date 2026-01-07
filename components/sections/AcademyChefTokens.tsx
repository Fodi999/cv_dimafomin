"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function AcademyChefTokens() {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-900 dark:to-yellow-950">
      {/* Content - Centered */}
      <div className="container max-w-3xl mx-auto px-4 text-center space-y-12">
        {/* Main Message */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t.journey.screen3.title}
          </h1>
          
          <div className="pt-8 space-y-4">
            <p className="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300">
              {t.journey.screen3.subtitle1}
              <br />
              <span className="text-amber-600 dark:text-amber-400 font-bold">{t.journey.screen3.subtitleHighlight}</span>
            </p>
            
            <div className="pt-6 space-y-2 text-lg text-gray-600 dark:text-gray-400">
              <p className="italic">{t.journey.screen3.question1}</p>
              <p className="italic">{t.journey.screen3.question2}</p>
              <p className="italic">{t.journey.screen3.question3}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
