/**
 * Recipe Card Component with Multilingual Support
 * Shows recipe with NEW badge and localized name
 */

import { Clock, Users, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Recipe } from "@/hooks/useAdminRecipes";
import { getRecipeName, isNewRecipe } from "@/lib/utils/recipe-helpers";
import { useLanguage } from "@/contexts/LanguageContext";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const { language } = useLanguage();
  const recipeName = getRecipeName(recipe, language as 'ru' | 'en' | 'pl' | 'uk');
  const showNewBadge = isNewRecipe(recipe.created_at || recipe.createdAt);

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header with Name and Badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 flex-1">
            {recipeName}
          </h3>
          {showNewBadge && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white shrink-0">
              <Sparkles className="w-3 h-3" />
              NEW
            </span>
          )}
        </div>

        {/* Description */}
        {recipe.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cooking_time || recipe.timeMinutes || 0} хв</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings || recipe.portions || 0}</span>
          </div>
        </div>

        {/* Difficulty Badge */}
        {recipe.difficulty && (
          <div className="mt-3">
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
              recipe.difficulty === 'easy' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : recipe.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {recipe.difficulty === 'easy' ? 'Легкий' : recipe.difficulty === 'medium' ? 'Середній' : 'Складний'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
