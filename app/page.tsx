"use client";

import { useState } from "react";
import { Brain, Target, Rocket, Gem, ChevronRight, Flame, Award } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import DynamicMetaTags from "@/components/DynamicMetaTags";
import StructuredData from "@/components/StructuredData";
import DevelopmentModal from "@/components/DevelopmentModal";
import AcademyHero from "@/components/sections/AcademyHero";
import AcademyAbout from "@/components/sections/AcademyAbout";
import AcademyChefTokens from "@/components/sections/AcademyChefTokens";
import AcademyCourses from "@/components/sections/AcademyCourses";
import AcademyCoursesPreview from "@/components/sections/AcademyCoursesPreview";
import AcademyEntry from "@/components/sections/AcademyEntry";
import { useLanguage } from "@/contexts/LanguageContext";
import StatsCounter from "@/components/sections/StatsCounter";

type JourneyStep = {
  id: string;
  icon: any;
  title: string;
  description: string;
  color: string;
  component: React.ReactNode;
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { t } = useLanguage();

  const journeySteps: JourneyStep[] = [
    {
      id: "about",
      icon: Brain,
      title: "Думай",
      description: "Почему, когда и зачем",
      color: "from-blue-500 to-cyan-500",
      component: <AcademyAbout />,
    },
    {
      id: "tokens",
      icon: Target,
      title: "Принимай решения",
      description: "Выбирай подход, а не шаги",
      color: "from-amber-500 to-orange-500",
      component: <AcademyChefTokens />,
    },
    {
      id: "courses",
      icon: Gem,
      title: "Готовь",
      description: "Холодильник → Идея → Блюдо",
      color: "from-green-500 to-emerald-500",
      component: <AcademyCourses />,
    },
    {
      id: "preview",
      icon: Rocket,
      title: "Развивай навык",
      description: "Через практику и решения",
      color: "from-indigo-500 to-purple-500",
      component: <AcademyCoursesPreview />,
    },
    {
      id: "entry",
      icon: ChevronRight,
      title: "Начать",
      description: "Войти в ChefOS",
      color: "from-rose-500 to-pink-500",
      component: <AcademyEntry />,
    },
  ];

  // Функция для получения цвета кнопки следующего экрана
  const getNextButtonColor = () => {
    if (!activeSection) {
      // На первом экране → следующий экран "about" (purple)
      return "from-purple-500 to-fuchsia-500";
    }
    const currentIndex = journeySteps.findIndex(step => step.id === activeSection);
    if (currentIndex < journeySteps.length - 1) {
      const nextStep = journeySteps[currentIndex + 1];
      // Возвращаем цвет следующего экрана
      return nextStep.color;
    }
    return "from-sky-500 to-cyan-500"; // default
  };

  return (
    <>
      <DynamicMetaTags />
      <StructuredData />
      <DevelopmentModal />
      
      {/* Navigation */}
      <PublicHeader />
      
      {/* Stats Counter - Fixed at top, visible on all screens */}
      <div className="fixed top-[130px] sm:top-[146px] left-1/2 -translate-x-1/2 z-40">
        <StatsCounter />
      </div>
      
      {/* Always show section content - no landing page */}
      <main className="relative w-full min-h-screen overflow-y-auto bg-white dark:bg-gray-950">
        {/* Content wrapper with padding for header and footer */}
        <div className="pt-20 sm:pt-16 pb-24 sm:pb-20 px-4 sm:px-0">
          {activeSection 
            ? journeySteps.find(step => step.id === activeSection)?.component 
            : <AcademyHero />
          }
        </div>
          
          {/* Navigation Footer */}
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
            {/* Animated running text bar - Hidden on mobile */}
            <div className="hidden sm:block overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-1.5">
              <div className="animate-marquee whitespace-nowrap flex gap-8 items-center">
                {/* RU - Русский */}
                <span className="inline-flex items-center gap-2 text-white text-xs font-medium px-4">
                  <Brain className="w-3.5 h-3.5" />
                  Думай как профессионал
                </span>
                <span className="inline-flex items-center gap-2 text-white text-xs font-medium px-4">
                  <Target className="w-3.5 h-3.5" />
                  AI — твой ментор
                </span>
                
                {/* EN - English */}
                <span className="inline-flex items-center gap-2 text-cyan-300 text-xs font-medium px-4">
                  <Rocket className="w-3.5 h-3.5" />
                  Think like a chef
                </span>
                <span className="inline-flex items-center gap-2 text-cyan-300 text-xs font-medium px-4">
                  <Gem className="w-3.5 h-3.5" />
                  Solutions, not recipes
                </span>
                
                {/* PL - Polski */}
                <span className="inline-flex items-center gap-2 text-purple-300 text-xs font-medium px-4">
                  <Award className="w-3.5 h-3.5" />
                  Myśl jak profesjonalista
                </span>
                <span className="inline-flex items-center gap-2 text-purple-300 text-xs font-medium px-4">
                  <Flame className="w-3.5 h-3.5" />
                  AI to mentor
                </span>
                
                {/* Дубликат для бесшовного цикла */}
                <span className="inline-flex items-center gap-2 text-white text-xs font-medium px-4">
                  <Brain className="w-3.5 h-3.5" />
                  Думай как профессионал
                </span>
                <span className="inline-flex items-center gap-2 text-white text-xs font-medium px-4">
                  <Target className="w-3.5 h-3.5" />
                  AI — твой ментор
                </span>
                <span className="inline-flex items-center gap-2 text-cyan-300 text-xs font-medium px-4">
                  <Rocket className="w-3.5 h-3.5" />
                  Think like a chef
                </span>
                <span className="inline-flex items-center gap-2 text-cyan-300 text-xs font-medium px-4">
                  <Gem className="w-3.5 h-3.5" />
                  Solutions, not recipes
                </span>
                <span className="inline-flex items-center gap-2 text-purple-300 text-xs font-medium px-4">
                  <Award className="w-3.5 h-3.5" />
                  Myśl jak profesjonalista
                </span>
                <span className="inline-flex items-center gap-2 text-purple-300 text-xs font-medium px-4">
                  <Flame className="w-3.5 h-3.5" />
                  AI to mentor
                </span>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="p-3 sm:p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-0">
              {/* Left: Back Buttons */}
              <div className="flex items-center gap-1 sm:gap-3">
                <button
                  onClick={() => {
                    setActiveSection(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
                  <span className="hidden sm:inline">{t.journey.navigation.toStart}</span>
                  <span className="sm:hidden">🏠</span>
                </button>
                
                {/* Previous Step Button */}
                {activeSection && (
                  <>
                    <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
                    <button
                      onClick={() => {
                        const currentIndex = journeySteps.findIndex(step => step.id === activeSection);
                        if (currentIndex > 0) {
                          setActiveSection(journeySteps[currentIndex - 1].id);
                        } else {
                          // Если на втором экране (index 0), возвращаемся на первый
                          setActiveSection(null);
                        }
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                    >
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
                      <span className="hidden sm:inline">{t.journey.navigation.back}</span>
                      <span className="sm:hidden">←</span>
                    </button>
                  </>
                )}
              </div>

              {/* Center: Progress Indicator */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Dots Progress */}
                {[1, 2, 3, 4, 5, 6].map((step) => {
                  const currentStep = activeSection 
                    ? journeySteps.findIndex(s => s.id === activeSection) + 2 
                    : 1;
                  
                  return (
                    <div
                      key={step}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                        step <= currentStep
                          ? 'bg-sky-500 scale-110'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Right: Next Button */}
              {!activeSection || journeySteps.findIndex(step => step.id === activeSection) < journeySteps.length - 1 ? (
                <button
                  onClick={() => {
                    if (!activeSection) {
                      // С первого экрана переходим на второй (about)
                      setActiveSection(journeySteps[0].id);
                    } else {
                      const currentIndex = journeySteps.findIndex(step => step.id === activeSection);
                      if (currentIndex < journeySteps.length - 1) {
                        setActiveSection(journeySteps[currentIndex + 1].id);
                      }
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`group relative flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r ${getNextButtonColor()} text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:opacity-100 opacity-90 active:scale-98 animate-soft-pulse`}
                >
                  <span className="hidden sm:inline">
                    {!activeSection 
                      ? t.journeyNextButtonTexts.screen1
                      : activeSection === 'about'
                      ? t.journeyNextButtonTexts.screen2
                      : activeSection === 'tokens'
                      ? t.journeyNextButtonTexts.screen3
                      : activeSection === 'courses'
                      ? t.journeyNextButtonTexts.screen4
                      : activeSection === 'preview'
                      ? t.journeyNextButtonTexts.screen5
                      : t.journey.navigation.next
                    }
                  </span>
                  <span className="sm:hidden">Далее</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveSection(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative px-3 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:opacity-100 opacity-90 active:scale-98 animate-soft-pulse"
                >
                  <span className="hidden sm:inline">{t.journey.navigation.finish}</span>
                  <span className="sm:hidden">✓</span>
                </button>
              )}
            </div>
            </div>
          </div>
        </main>
    </>
  );
}
