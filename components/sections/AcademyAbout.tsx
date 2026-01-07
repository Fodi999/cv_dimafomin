"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function AcademyAbout() {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950 dark:via-purple-900 dark:to-fuchsia-950">
      {/* Content - Centered */}
      <div className="container max-w-3xl mx-auto px-4 text-center space-y-12">
        {/* Main Message */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t.journey.screen2.title}
          </h1>
          
          <div className="pt-8 space-y-4">
            <p className="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300">
              {t.journey.screen2.subtitle}
              <br />
              <span className="text-purple-600 dark:text-purple-400 font-bold">{t.journey.screen2.subtitleHighlight}</span>
            </p>
            
            <div className="pt-6 space-y-2">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t.journey.screen2.description1}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.journey.screen2.description2}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
