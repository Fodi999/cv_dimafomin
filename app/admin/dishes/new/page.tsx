"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChefHat } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { RecipeRecommendationsList } from "@/components/recommendations/RecipeRecommendationsList";
import { AllRecipesList } from "@/components/recommendations/AllRecipesList";

export default function SelectRecipePage() {
  const router = useRouter();
  const { language } = useLanguage();

  const labels = {
    ru: {
      title: "Выберите рецепт для создания блюда",
      description: "Выберите существующий рецепт, чтобы создать блюдо с финансовыми параметрами",
      recommendationsTab: "⚡ Рекомендации",
      allRecipesTab: "🔍 Все рецепты",
    },
    en: {
      title: "Select a Recipe to Create Dish",
      description: "Choose an existing recipe to create a dish with financial parameters",
      recommendationsTab: "⚡ Recommendations",
      allRecipesTab: "🔍 All Recipes",
    },
    pl: {
      title: "Wybierz przepis do utworzenia dania",
      description: "Wybierz istniejący przepis, aby utworzyć danie z parametrami finansowymi",
      recommendationsTab: "⚡ Rekomendacje",
      allRecipesTab: "🔍 Wszystkie przepisy",
    },
  };

  const t = labels[language as keyof typeof labels] || labels.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Page Header */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {t.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Tabs: Recommendations vs Search */}
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="recommendations">
              {t.recommendationsTab}
            </TabsTrigger>
            <TabsTrigger value="search">
              {t.allRecipesTab}
            </TabsTrigger>
          </TabsList>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <RecipeRecommendationsList />
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            {/* Use new AllRecipesList component with full filters and caching */}
            <AllRecipesList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
