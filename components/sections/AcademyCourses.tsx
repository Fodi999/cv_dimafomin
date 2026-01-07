"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function AcademyCourses() {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-900 dark:to-teal-950">
      {/* Content - Centered */}
      <div className="container max-w-3xl mx-auto px-4 text-center space-y-12">
        {/* Main Message */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
            {t.journey.screen4.title}
            <br />
            {t.journey.screen4.titleLine2}
          </h1>
          
          <div className="pt-8">
            <p className="text-2xl md:text-3xl font-medium text-green-600 dark:text-green-400">
              {t.journey.screen4.subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
