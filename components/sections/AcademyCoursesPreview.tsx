"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function AcademyCoursesPreview() {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-900 dark:to-pink-950">
      {/* Content - Centered */}
      <div className="container max-w-3xl mx-auto px-4 text-center space-y-12">
        {/* Main Message */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t.journey.screen5.title}
          </h1>
          
          <div className="pt-8 space-y-4">
            <p className="text-2xl md:text-3xl font-medium text-purple-600 dark:text-purple-400">
              {t.journey.screen5.subtitle1}
            </p>
            <p className="text-2xl md:text-3xl text-purple-500 dark:text-purple-500">
              {t.journey.screen5.subtitle2}
            </p>
          </div>
          
          {/* Ecosystem */}
          <div className="pt-6">
            <p className="text-2xl md:text-3xl font-semibold text-indigo-600 dark:text-indigo-400">
              {t.journey.screen5.ecosystem}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
