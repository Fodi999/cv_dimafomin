"use client";

import { motion } from "framer-motion";
import { Clock, Users, ChefHat, CheckCircle, ArrowRight, Sparkles, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import type { RecipeMatch } from "@/lib/api";

interface AIRecommendationCardCompactProps {
  recipe: RecipeMatch;
  aiTitle?: string;
  aiReason?: string;
  onSave?: () => void;
  isSaved?: boolean;
  className?: string;
}

export default function AIRecommendationCardCompact({
  recipe,
  aiTitle,
  aiReason,
  onSave,
  isSaved = false,
  className = ""
}: AIRecommendationCardCompactProps) {
  const router = useRouter();
  const { t } = useLanguage();

  // Determine recipe status
  const getRecipeStatus = () => {
    if (recipe.canCookNow) {
      return { 
        emoji: '🟢', 
        text: t.recipes.match.canCookNow || 'Можно приготовить сейчас', 
        color: 'bg-green-500 text-white' 
      };
    } else if (recipe.missingCount <= 2) {
      const ingredientWord = recipe.missingCount === 1 
        ? t.recipes.match.ingredientSingular 
        : t.recipes.match.ingredientPlural;
      return { 
        emoji: '🟡', 
        text: `Не хватает ${recipe.missingCount} ${ingredientWord}`, 
        color: 'bg-yellow-500 text-white' 
      };
    } else {
      return { 
        emoji: '🔴', 
        text: `Не хватает ${recipe.missingCount} ${t.recipes.match.ingredientPlural}`, 
        color: 'bg-red-500 text-white' 
      };
    }
  };

  const status = getRecipeStatus();

  const handleClick = () => {
    if (recipe.canonicalName) {
      router.push(`/recipes/${recipe.canonicalName}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`space-y-4 ${className}`}
    >
      {/* AI Explanation Card */}
      {(aiTitle || aiReason) && (
        <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              {aiTitle && (
                <h3 className="text-base font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  {aiTitle}
                </h3>
              )}
              {aiReason && (
                <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                  {aiReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recipe Preview Card - Clickable */}
      <motion.div
        whileHover={{ y: -2 }}
        onClick={handleClick}
        className="group cursor-pointer rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all overflow-hidden"
      >
        {/* Image */}
        {recipe.imageUrl && (
          <div className="relative h-64 w-full overflow-hidden">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Save Button - Top Left */}
            {onSave && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSave();
                }}
                className="absolute top-3 left-3 p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-all shadow-lg z-10"
              >
                <Heart 
                  className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
                />
              </button>
            )}
            
            {/* Status Badge - Top Right */}
            <div className="absolute top-3 right-3">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${status.color}`}>
                <span>{status.emoji}</span>
                <span>{status.text}</span>
              </div>
            </div>

            {/* Title on Image */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-xl font-bold text-white drop-shadow-lg mb-1">
                {recipe.title}
              </h3>
              {recipe.description && (
                <p className="text-white/90 text-sm line-clamp-2">
                  {recipe.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* No Image Fallback */}
        {!recipe.imageUrl && (
          <div className="relative h-32 w-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-white/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-white text-center px-4">
                {recipe.title}
              </h3>
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {recipe.cookingTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{recipe.cookingTime} мин</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{recipe.servings} {t.recipes.match.servingPlural}</span>
                </div>
              )}
            </div>
            {recipe.coverage !== undefined && (
              <div className="flex items-center gap-1.5 text-sm font-semibold text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>{Math.round(recipe.coverage > 1 ? recipe.coverage : recipe.coverage * 100)}% совпадение</span>
              </div>
            )}
          </div>

          {/* Ingredients Summary */}
          <div className="space-y-2 mb-4">
            {(recipe.usedCount ?? 0) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {t.recipes.match.fromFridge}:
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {recipe.usedCount} {recipe.usedCount === 1 ? t.recipes.match.ingredientSingular : t.recipes.match.ingredientPlural}
                </span>
              </div>
            )}
            {(recipe.missingCount ?? 0) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {t.recipes.match.toBuy}:
                </span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {recipe.missingCount} {recipe.missingCount === 1 ? t.recipes.match.ingredientSingular : t.recipes.match.ingredientPlural}
                </span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleClick}
            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>{t.recipes.match.viewRecipe || 'Смотреть рецепт'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
