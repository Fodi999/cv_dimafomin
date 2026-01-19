"use client";

import { Pencil, Trash2, Eye, Clock, Users, Weight, Sparkles, ChefHat, UtensilsCrossed, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Recipe } from "@/hooks/useAdminRecipes";
import { getRecipeName, isNewRecipe, formatRecipeDate } from "@/lib/utils/recipe-helpers";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";

interface RecipesTableProps {
  recipes: Recipe[];
  isLoading: boolean;
  onView: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const difficultyLabels = {
  easy: "Легкий",
  medium: "Середній",
  hard: "Складний",
};

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  published: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  archived: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

const statusLabels = {
  draft: "Чернетка",
  published: "Опубліковано",
  archived: "Архів",
};

export function RecipesTable({ recipes, isLoading, onView, onEdit, onDelete }: RecipesTableProps) {
  const { language } = useLanguage();
  // Safety check: ensure recipes is always an array
  const safeRecipes = Array.isArray(recipes) ? recipes : [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 sm:h-16 w-full" />
        ))}
      </div>
    );
  }

  if (safeRecipes.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
        <ChefHat className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Рецептів не знайдено
        </p>
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
          Додайте перший рецепт, щоб почати
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm">
            <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300 w-16">
                  Фото
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Назва
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Кухня
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Складність
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Статус
                </th>
                <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 inline" />
                </th>
                <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Users className="w-4 h-4 inline" />
                </th>
                <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Weight className="w-4 h-4 inline" />
                </th>
                <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Інгредієнти
                </th>
                <th className="text-center p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Eye className="w-4 h-4 inline" />
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Дата створення
                </th>
                <th className="text-right p-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Дії
                </th>
              </tr>
            </thead>
          <tbody>
            {safeRecipes.map((recipe) => (
              <tr
                key={recipe.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                {/* Image Cell */}
                <td className="p-2">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    {recipe.imageUrl ? (
                      <img
                        src={recipe.imageUrl}
                        alt={getRecipeName(recipe, language as 'ru' | 'en' | 'pl' | 'uk')}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/images/recipe-placeholder.svg";
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                    )}
                  </div>
                </td>
                
                {/* Name Cell */}
                <td className="p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getRecipeName(recipe, language as 'ru' | 'en' | 'pl' | 'uk')}
                      </p>
                      {isNewRecipe(recipe.created_at || recipe.createdAt) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          <Sparkles className="w-3 h-3" />
                          NEW
                        </span>
                      )}
                    </div>
                    {recipe.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {recipe.description}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="p-3">
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {recipe.cuisine}
                </span>
              </td>
              <td className="p-3">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
                  {difficultyLabels[recipe.difficulty]}
                </span>
              </td>
              <td className="p-3">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[recipe.status]}`}>
                  {statusLabels[recipe.status]}
                </span>
              </td>
              <td className="p-3 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.cooking_time} хв
                </span>
              </td>
              <td className="p-3 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.servings}
                </span>
              </td>
              <td className="p-3 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.portionWeightGrams ? `${recipe.portionWeightGrams}г` : '—'}
                </span>
              </td>
              <td className="p-3 text-center">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {recipe.ingredients?.length || 0}
                </span>
              </td>
              <td className="p-3 text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {recipe.views || 0}
                </span>
              </td>
              <td className="p-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatRecipeDate(recipe.created_at || recipe.createdAt)}
                </span>
              </td>
              <td className="p-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(recipe)}
                    className="h-8 w-8 p-0"
                    title="Переглянути рецепт"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(recipe)}
                    className="h-8 w-8 p-0"
                    title="Редагувати"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(recipe)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Видалити"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Mobile: Cards */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
      {safeRecipes.map((recipe, index) => (
        <motion.div
          key={recipe.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-3 sm:p-4"
        >
          {/* Recipe Title + Image + NEW Badge */}
          <div className="flex items-start gap-3 mb-2">
            {/* Recipe Image */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              {recipe.imageUrl ? (
                <img
                  src={recipe.imageUrl}
                  alt={getRecipeName(recipe, language as 'ru' | 'en' | 'pl' | 'uk')}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/images/recipe-placeholder.svg";
                  }}
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400 dark:text-gray-600" />
              )}
            </div>

            {/* Recipe Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
                  {getRecipeName(recipe, language as 'ru' | 'en' | 'pl' | 'uk')}
                </h3>
                {isNewRecipe(recipe.created_at || recipe.createdAt) && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    NEW
                  </Badge>
                )}
              </div>
              {recipe.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                  {recipe.description}
                </p>
              )}
            </div>
          </div>

          {/* Badges: Difficulty + Status */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge className={`text-xs ${difficultyColors[recipe.difficulty]}`}>
              {difficultyLabels[recipe.difficulty]}
            </Badge>
            <Badge className={`text-xs ${statusColors[recipe.status]}`}>
              {statusLabels[recipe.status]}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {recipe.cuisine}
            </Badge>
          </div>

          {/* Recipe Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{recipe.cooking_time} хв</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <Users className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{recipe.servings} порц.</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <Weight className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{recipe.portionWeightGrams ? `${recipe.portionWeightGrams}г` : '—'}</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                {recipe.ingredients?.length || 0} інгр.
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {recipe.views || 0}
              </span>
            </div>
            <span className="text-muted-foreground">
              {formatRecipeDate(recipe.created_at || recipe.createdAt)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(recipe)}
              className="flex-1 h-9 gap-2 text-xs sm:text-sm"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Переглянути
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(recipe)}
              className="flex-1 h-9 gap-2 text-xs sm:text-sm"
            >
              <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Редагувати
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(recipe)}
              className="h-9 px-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
    </>
  );
}
