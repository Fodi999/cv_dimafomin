"use client";

import { motion } from "framer-motion";
import { Clock, Users, ChefHat, CheckCircle2, Calendar } from "lucide-react";
import type { Recipe } from "@/hooks/useAI";

interface RecipeCardProps {
  recipe: Recipe;
  onAddToPlan?: (recipe: Recipe) => void;
  onMarkDone?: (recipe: Recipe) => void;
  loading?: boolean;
}

export function RecipeCard({ recipe, onAddToPlan, onMarkDone, loading }: RecipeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <ChefHat className="w-6 h-6" />
          {recipe.title}
        </h3>
        {recipe.description && (
          <p className="text-white/90 mt-2">{recipe.description}</p>
        )}
      </div>

      {/* Meta Info */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
        {recipe.timeMinutes && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{recipe.timeMinutes} min</span>
          </div>
        )}
        {recipe.servings && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span className="text-sm">{recipe.servings} porcji</span>
          </div>
        )}
        {recipe.difficulty && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
            {recipe.difficulty}
          </span>
        )}
      </div>

      {/* Ingredients */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Składniki:</h4>
        <ul className="space-y-2">
          {(recipe.ingredients || recipe.ingredientsUsed || []).map((ing, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-orange-500 mt-1">•</span>
              <span>
                {ing.name}
                {ing.quantity && ` - ${ing.quantity}`}
                {ing.unit && ` ${ing.unit}`}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Kroki przygotowania:</h4>
        <ol className="space-y-3">
          {recipe.steps.map((step, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
              <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Missing Ingredients - 2 scenariusze */}
      {recipe.ingredientsMissing && recipe.ingredientsMissing.length > 0 && (
        <>
          {/* Сценарий A: Pantry items (koszt = 0) */}
          {recipe.economy?.estimatedExtraCost === 0 && (
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/10">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span>🧂</span>
                Zakładamy, że te produkty są w kuchni
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Podstawowe składniki (sól, olej, przyprawy) są zwykle w każdym domu
              </p>
              <ul className="space-y-2">
                {recipe.ingredientsMissing.map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-green-600 mt-1">•</span>
                    <span>
                      {ing.name}
                      {ing.quantity && ` - ${ing.quantity}`}
                      {ing.unit && ` ${ing.unit}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Сценарий B: Нужно докупить (koszt > 0) */}
          {recipe.economy && recipe.economy.estimatedExtraCost > 0 && (
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/10">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span>�</span>
                Do kupienia
              </h4>
              <ul className="space-y-2 mb-3">
                {recipe.ingredientsMissing.map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>
                      {ing.name}
                      {ing.quantity && ` - ${ing.quantity}`}
                      {ing.unit && ` ${ing.unit}`}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-blue-200 dark:border-blue-800/30">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Szacowany koszt:{" "}
                  <strong className="text-blue-700 dark:text-blue-400">
                    ~{recipe.economy.estimatedExtraCost} {recipe.economy.currency || 'PLN'}
                  </strong>
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Economy Info - tylko jeśli używasz z lodówki */}
      {recipe.economy?.usedFromFridge && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/10">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span>💰</span>
            Ekonomia
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            ✅ Używasz produktów z lodówki — oszczędzasz!
          </p>
        </div>
      )}

      {/* Chef Tips */}
      {recipe.chefTips && recipe.chefTips.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>💡</span>
            Wskazówki szefa:
          </h4>
          <ul className="space-y-2">
            {recipe.chefTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-orange-500 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
        {onAddToPlan && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAddToPlan(recipe)}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Calendar className="w-5 h-5" />
            Dodaj do planu
          </motion.button>
        )}
        {onMarkDone && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onMarkDone(recipe)}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            Zrobione
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
