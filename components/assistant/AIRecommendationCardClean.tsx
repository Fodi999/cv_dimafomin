/**
 * AI Recommendation Card (Clean Architecture)
 * 
 * 🎯 ЦЕЛЬ: Рендерить DTO от backend
 * 🚫 ЗАПРЕЩЕНО: Вычисления, бизнес-логика, интерпретации
 * ✅ РАЗРЕШЕНО: Только рендер по scenario
 * 
 * Backend отправляет:
 * - recipe.displayName (УЖЕ локализовано)
 * - recipe.scenario (УЖЕ определено)
 * - ai.title, ai.reason (УЖЕ на языке пользователя)
 * - ingredients (УЖЕ локализованы)
 * 
 * Frontend:
 * - Рендерит
 * - НЕ думает
 */

'use client';

import Link from 'next/link';
import { CheckCircle2, ShoppingCart, Clock, ChefHat } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { AIRecipeResponse } from '@/lib/types/ai-recipe';
import { SCENARIO_CTA, SCENARIO_BADGE_COLORS, CONFIDENCE_ICONS } from '@/lib/constants/ai-recipe-ui';

interface AIRecommendationCardCleanProps {
  data: AIRecipeResponse;
  onNext?: () => void;
  onCook?: () => void;
}

export default function AIRecommendationCardClean({
  data,
  onNext,
  onCook,
}: AIRecommendationCardCleanProps) {
  const { t, language } = useLanguage();
  const { recipe, ai } = data;

  // ✅ Получаем CTA текст по scenario и языку
  const ctaText = SCENARIO_CTA[recipe.scenario][language] || SCENARIO_CTA[recipe.scenario].en;
  
  // ✅ Получаем цвет бейджа по scenario
  const badgeColor = SCENARIO_BADGE_COLORS[recipe.scenario];
  
  // ✅ Получаем иконку по confidence
  const confidenceIcon = CONFIDENCE_ICONS[recipe.confidence];

  return (
    <div className="rounded-2xl border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-gray-800 dark:to-pink-900/20 shadow-lg p-6 space-y-4">
      
      {/* Header: AI Title */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{confidenceIcon}</span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {ai.title}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {ai.reason}
          </p>
        </div>

        {/* Scenario Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
          {recipe.scenario.replace('_', ' ')}
        </span>
      </div>

      {/* Recipe Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <Link 
          href={`/recipes/${recipe.canonicalName}`}
          className="text-lg font-bold text-purple-600 dark:text-purple-400 hover:underline"
        >
          {recipe.displayName}
        </Link>

        {/* Recipe Meta */}
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
          {recipe.cookingTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookingTime} {t.recipes?.match?.minutes || 'min'}</span>
            </div>
          )}
          {recipe.difficulty && (
            <div className="flex items-center gap-1">
              <ChefHat className="w-4 h-4" />
              <span>{recipe.difficulty}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ingredients Used */}
      {ai.ingredientsUsed.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            {recipe.canCookNow 
              ? (t.recipes?.match?.ingredients || 'Ингредиенты')
              : (t.recipes?.match?.available || 'У вас есть')}
          </h3>
          <ul className="space-y-1.5">
            {ai.ingredientsUsed.map((ingredient, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Ingredients */}
      {recipe.missingIngredients.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            {t.recipes?.match?.toBuy || 'Не хватает'}:
          </h3>
          <ul className="space-y-1.5">
            {recipe.missingIngredients.map((ingredient, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-orange-50 dark:bg-orange-900/20 rounded-lg px-3 py-2">
                <ShoppingCart className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                <span>
                  {ingredient.name}
                  {ingredient.quantity > 0 && ` (${ingredient.quantity} ${ingredient.unit})`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Tip */}
      {ai.tip && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-700 dark:text-blue-400">
            💡 {ai.tip}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {recipe.canCookNow && onCook && (
          <button
            onClick={onCook}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {ctaText}
          </button>
        )}
        
        {!recipe.canCookNow && (
          <Link
            href={`/recipes/${recipe.canonicalName}`}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-center"
          >
            {ctaText}
          </Link>
        )}

        {onNext && (
          <button
            onClick={onNext}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 rounded-xl font-medium text-gray-700 dark:text-gray-300 transition-all duration-200"
          >
            {t.recipes?.match?.next || 'Далее'}
          </button>
        )}
      </div>
    </div>
  );
}
