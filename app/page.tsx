"use client";

import PublicHeader from "@/components/layout/PublicHeader";
import DynamicMetaTags from "@/components/DynamicMetaTags";
import StructuredData from "@/components/StructuredData";
import DevelopmentModal from "@/components/DevelopmentModal";
import StatsCounter from "@/components/sections/StatsCounter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <>
      <DynamicMetaTags />
      <StructuredData />
      <DevelopmentModal />
      
      {/* Navigation */}
      <PublicHeader />
      
      {/* Always show section content - no landing page */}
      <main className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Content wrapper with padding for header */}
        <div className="h-full pt-24 sm:pt-28 pb-8 px-6 sm:px-12 lg:px-20 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
              
              {/* Main heading with gradient */}
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent leading-tight">
                  {t.home.hero.title}
                </h1>
              </div>

              {/* Subheading with emphasis */}
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-50 leading-snug">
                  {t.home.hero.subtitle}
                </h2>
                <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t.home.hero.description}
                </p>
              </div>

              {/* Description with card style */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 dark:from-orange-500/10 dark:via-amber-500/10 dark:to-yellow-500/10 blur-3xl -z-10"></div>
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-gray-100 leading-relaxed font-normal">
                    {t.home.hero.details}
                  </p>
                </div>
              </div>

              {/* Stats Counter - positioned below the main content */}
              <div className="pt-8">
                <StatsCounter />
              </div>

          </div>
        </div>
      </main>
    </>
  );
}
