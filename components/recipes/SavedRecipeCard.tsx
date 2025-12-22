"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  Users, 
  ChefHat, 
  Trash2, 
  ExternalLink,
  Calendar,
  TrendingUp,
  Globe
} from "lucide-react";

// SavedRecipe interface matching backend response
export interface SavedRecipe {
  id: string;
  recipeId: string;
  recipeName: string;
  recipeCountry: string;
  recipeDifficulty: 'easy' | 'medium' | 'hard';
  recipeTimeMinutes: number;
  recipeServings: number;
  savedAt: string; // ISO date
  cookedCount: number;
  lastCookedAt: string | null;
  canCookNow?: boolean; // Can cook with current fridge ingredients
  missingIngredientsCount?: number; // How many ingredients are missing
  usedIngredientsValue?: number; // PLN value from fridge
  missingIngredientsCost?: number; // PLN cost to buy missing
  totalWasteSaved?: number; // PLN saved from waste (if cooked before)
}

interface SavedRecipeCardProps {
  recipe: SavedRecipe;
  onCook: (recipeId: string) => Promise<void>;
  onDelete?: (recipeId: string) => Promise<void>;
  isLoading?: boolean;
}

// Difficulty translation and color mapping
const difficultyConfig = {
  easy: { label: 'Łatwy', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  medium: { label: 'Średni', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' },
  hard: { label: 'Trudny', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20' },
};

export default function SavedRecipeCard({ 
  recipe, 
  onCook, 
  onDelete,
  isLoading = false 
}: SavedRecipeCardProps) {
  const [isCooking, setIsCooking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const difficulty = difficultyConfig[recipe.recipeDifficulty] || difficultyConfig.medium;

  // Format date
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('pl-PL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  // Handle cook action
  const handleCook = async () => {
    if (isCooking) return;
    
    setIsCooking(true);
    try {
      await onCook(recipe.recipeId);
    } catch (err) {
      console.error('Failed to cook recipe:', err);
    } finally {
      setIsCooking(false);
    }
  };

  // Handle delete action
  const handleDelete = async () => {
    if (isDeleting || !onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(recipe.recipeId);
    } catch (err) {
      console.error('Failed to delete recipe:', err);
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {recipe.recipeName}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs font-medium">
                ⭐ Zapisany
              </span>
            </div>
            
            {/* Metadata badges */}
            <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
              {/* Country */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                <Globe className="w-4 h-4" />
                {recipe.recipeCountry}
              </span>

              {/* Time */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                <Clock className="w-4 h-4" />
                {recipe.recipeTimeMinutes} min
              </span>

              {/* Servings */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                <Users className="w-4 h-4" />
                {recipe.recipeServings} porcji
              </span>

              {/* Difficulty */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${difficulty.bgColor} ${difficulty.color}`}>
                <ChefHat className="w-4 h-4" />
                {difficulty.label}
              </span>
            </div>

            {/* Status indicators */}
            <div className="space-y-2">
              {/* Can cook now */}
              {recipe.canCookNow && (
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                  <span className="flex h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium">✅ Możesz ugotować teraz</span>
                </div>
              )}

              {/* Missing ingredients */}
              {!recipe.canCookNow && recipe.missingIngredientsCount && recipe.missingIngredientsCount > 0 && (
                <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-400">
                  <span className="flex h-2 w-2 rounded-full bg-orange-500" />
                  <span className="font-medium">🛒 Brakuje {recipe.missingIngredientsCount} {recipe.missingIngredientsCount === 1 ? 'składnika' : 'składników'}</span>
                </div>
              )}

              {/* Already cooked */}
              {recipe.lastCookedAt && (
                <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-400">
                  <span className="flex h-2 w-2 rounded-full bg-purple-500" />
                  <span className="font-medium">🔁 Gotowany wcześniej ({formatDate(recipe.lastCookedAt)})</span>
                </div>
              )}
            </div>
          </div>

          {/* Delete button */}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting || isCooking}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              title="Usuń z zapisanych"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Economy section - show if data available */}
      {(recipe.usedIngredientsValue || recipe.missingIngredientsCost || recipe.totalWasteSaved) && (
        <div className="px-6 py-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-b border-gray-100 dark:border-gray-800">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            💰 Ekonomia przepisu
          </h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            {/* Used from fridge */}
            {recipe.usedIngredientsValue !== undefined && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Z lodówki</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {recipe.usedIngredientsValue.toFixed(2)} PLN
                </div>
              </div>
            )}

            {/* Cost to complete */}
            {recipe.missingIngredientsCost !== undefined && recipe.missingIngredientsCost > 0 && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Do dokupienia</div>
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {recipe.missingIngredientsCost.toFixed(2)} PLN
                </div>
              </div>
            )}

            {/* Waste saved */}
            {recipe.totalWasteSaved !== undefined && recipe.totalWasteSaved > 0 && (
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Uratowano</div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {recipe.totalWasteSaved.toFixed(2)} PLN
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats section */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          {/* Saved date */}
          <div>
            <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Zapisano
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(recipe.savedAt)}
            </div>
          </div>

          {/* Cooked count */}
          <div>
            <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Ugotowano
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {recipe.cookedCount} {recipe.cookedCount === 1 ? 'raz' : 'razy'}
            </div>
          </div>

          {/* Last cooked */}
          <div>
            <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-1">
              <ChefHat className="w-3.5 h-3.5" />
              Ostatnio
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {recipe.lastCookedAt ? formatDate(recipe.lastCookedAt) : 'Nigdy'}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="p-4 flex flex-col gap-3">
        {/* Primary action: Cook / Cook again */}
        <button
          onClick={handleCook}
          disabled={isCooking || isDeleting || isLoading}
          className={`w-full px-6 py-3 rounded-lg ${
            recipe.canCookNow
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
              : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
          } disabled:from-gray-400 disabled:to-gray-500 text-white font-medium transition-all flex items-center justify-center gap-2 shadow-sm`}
        >
          {isCooking ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Gotuję...
            </>
          ) : recipe.lastCookedAt ? (
            <>
              <ChefHat className="w-5 h-5" />
              🔄 Ugotuj ponownie
            </>
          ) : (
            <>
              <ChefHat className="w-5 h-5" />
              🍳 Ugotuj
            </>
          )}
        </button>

        {/* Secondary actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Add missing to shopping list - show only if ingredients are missing */}
          {!recipe.canCookNow && recipe.missingIngredientsCount && recipe.missingIngredientsCount > 0 && (
            <button
              onClick={() => {
                // TODO: Implement shopping list integration
                console.log('Add missing ingredients to shopping list');
              }}
              disabled={isDeleting || isLoading}
              className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium transition-all flex items-center justify-center gap-2 text-sm"
            >
              🛒 Dodaj do zakupów
            </button>
          )}

          {/* View details */}
          <button
            onClick={() => {
              // TODO: Navigate to recipe details page
              console.log('Navigate to recipe:', recipe.recipeId);
            }}
            disabled={isDeleting || isLoading}
            className={`px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition-all flex items-center justify-center gap-2 text-sm ${
              !recipe.canCookNow && recipe.missingIngredientsCount ? '' : 'col-span-2'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            Zobacz szczegóły
          </button>
        </div>
      </div>
    </motion.div>
  );
}
