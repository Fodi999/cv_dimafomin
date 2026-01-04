"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  TrendingDown,
  ShoppingCart,
  ChefHat,
  Save,
  RotateCw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import type { RecipeMatch } from "@/lib/api";

interface AIRecommendationCardProps {
  recipe: RecipeMatch;
  onCook: (servingsMultiplier: number) => void; // 🆕 Now accepts multiplier
  onSave: () => void;
  onAddToCart: () => void;
  onRefresh: () => void;
  isCooking?: boolean;
  isSaving?: boolean;
  weeklyBudget?: number;
  className?: string;
}

export default function AIRecommendationCard({
  recipe,
  onCook,
  onSave,
  onAddToCart,
  onRefresh,
  isCooking = false,
  isSaving = false,
  weeklyBudget,
  className = ""
}: AIRecommendationCardProps) {
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false);
  const [servings, setServings] = useState(recipe.servings); // 🆕 UI state for portions

  // Calculate servings multiplier
  const servingsMultiplier = recipe.servings > 0 ? servings / recipe.servings : 1;

  // Format quantity and unit
  const formatQuantity = (quantity: number, unit: string) => {
    if (unit === "g" && quantity >= 1000) {
      return `${(quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1)} kg`;
    }
    if (unit === "ml" && quantity >= 1000) {
      return `${(quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1)} l`;
    }
    return `${quantity} ${unit}`;
  };

  // Determine recipe status
  const getRecipeStatus = () => {
    if (recipe.canCookNow) {
      return { emoji: '🟢', text: 'Możesz ugotować teraz', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' };
    } else if (recipe.missingCount <= 2) {
      return { emoji: '🟡', text: `Brakuje ${recipe.missingCount} składników`, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' };
    } else {
      return { emoji: '🔴', text: `Brakuje ${recipe.missingCount} składników`, color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' };
    }
  };

  const status = getRecipeStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden ${className}`}
    >
      {/* 1️⃣ HEADER SECTION */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${status.color}`}>
              <span>{status.emoji}</span>
              <span>{status.text}</span>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">
              {recipe.title}
            </h3>
            {recipe.description && (
              <p className="text-purple-100 text-sm leading-relaxed">
                {recipe.description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 2️⃣ META SECTION */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            {recipe.cookingTime && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="font-medium">{recipe.cookingTime} min</span>
              </div>
            )}
            {recipe.coverage !== undefined && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="font-medium">
                  {Math.min(100, Math.round(recipe.coverage > 1 ? recipe.coverage : recipe.coverage * 100))}% dopasowania
                </span>
              </div>
            )}
          </div>

          {/* Servings control */}
          {recipe.servings > 0 && (
            <div className="flex items-center gap-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2">
              <Users className="w-4 h-4 text-purple-500" />
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold transition-colors"
                disabled={servings <= 1}
              >
                −
              </button>
              <span className="font-semibold text-gray-900 dark:text-white min-w-[3ch] text-center">
                {servings}
              </span>
              <button
                onClick={() => setServings(servings + 1)}
                className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold transition-colors"
              >
                +
              </button>
              <span className="text-gray-600 dark:text-gray-400 font-medium">porcji</span>
            </div>
          )}
        </div>
      </div>

      {/* 3️⃣ INGREDIENTS SECTION */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Składniki
        </h4>
        <div className="space-y-3">
          {/* Available ingredients */}
          {recipe.usedIngredients && recipe.usedIngredients.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-2">
                Masz w lodówce ({recipe.usedIngredients.length})
              </p>
              <div className="space-y-2">
                {recipe.usedIngredients.map((ing, idx) => {
                  if (typeof ing === 'string') return null;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm bg-green-50 dark:bg-green-900/20 rounded-lg p-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white font-medium flex-1">
                        {ing.name}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                        {formatQuantity(ing.quantity * servingsMultiplier, ing.unit)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Missing ingredients */}
          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-2">
                Trzeba dokupić ({recipe.missingIngredients.length})
              </p>
              <div className="space-y-2">
                {recipe.missingIngredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-sm bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3"
                  >
                    <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white font-medium flex-1">
                      {ing.name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                      {formatQuantity(ing.quantity * servingsMultiplier, ing.unit)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4️⃣ COLLAPSIBLE INSTRUCTIONS */}
      {recipe.steps && recipe.steps.length > 0 && (
        <div className="border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sposób przygotowania
            </h4>
            {isInstructionsExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          
          <AnimatePresence>
            {isInstructionsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 space-y-4">
                  {recipe.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-sm">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pt-1">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 5️⃣ ECONOMY SECTION */}
      {recipe.economy && (
        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Ekonomia
              </p>
              
              {/* Cost breakdown */}
              {recipe.economy.costToComplete > 0 && recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                <div className="space-y-2 mb-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Koszt dokupienia ({recipe.missingIngredients.length} {recipe.missingIngredients.length === 1 ? 'składnik' : 'składników'}):
                  </p>
                  <div className="space-y-1">
                    {recipe.missingIngredients.slice(0, 3).map((ing, idx) => {
                      const scaledQuantity = ing.quantity * servingsMultiplier;
                      const scaledCost = (ing.estimatedCost || 0) * servingsMultiplier;
                      return (
                        <div key={idx} className="flex justify-between text-xs text-gray-700 dark:text-gray-300 pl-2">
                          <span>• {ing.name} ({formatQuantity(scaledQuantity, ing.unit)})</span>
                          {ing.estimatedCost && (
                            <span className="font-mono">{scaledCost.toFixed(2)} {recipe.economy!.currency}</span>
                          )}
                        </div>
                      );
                    })}
                    {recipe.missingIngredients.length > 3 && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 pl-2">
                        +{recipe.missingIngredients.length - 3} więcej...
                      </p>
                    )}
                  </div>
                  
                  {/* Total cost for selected servings */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Razem ({servings} {servings === 1 ? 'porcja' : servings < 5 ? 'porcje' : 'porcji'}):
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {(recipe.economy.costToComplete * servingsMultiplier).toFixed(2)} {recipe.economy.currency}
                    </span>
                  </div>
                  
                  {/* Per-portion cost */}
                  {recipe.servings > 0 && (
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
                      <span>Koszt za porcję:</span>
                      <span className="font-mono">
                        {(recipe.economy.costToComplete / recipe.servings).toFixed(2)} {recipe.economy.currency}
                      </span>
                    </div>
                  )}
                  
                  {/* Budget warning */}
                  {weeklyBudget && recipe.economy.costToComplete > 0 && (
                    (() => {
                      const totalCost = recipe.economy.costToComplete * servingsMultiplier;
                      const budgetPercent = (totalCost / weeklyBudget) * 100;
                      if (budgetPercent >= 50) {
                        return (
                          <div className="mt-2 p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700">
                            <p className="text-xs font-semibold text-orange-800 dark:text-orange-300 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              To {budgetPercent.toFixed(0)}% Twojego tygodniowego budżetu
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()
                  )}
                </div>
              )}

              {/* Savings */}
              {recipe.economy.wasteRiskSaved > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Oszczędności (zapobieganie marnowaniu):</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    +{recipe.economy.wasteRiskSaved.toFixed(2)} {recipe.economy.currency}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6️⃣ "DLACZEGO TEN PRZEPIS?" SECTION */}
      {(recipe.description || (recipe.coverage ?? 0) > 0.5) && (
        <div className="px-6 py-4 bg-purple-50 dark:bg-purple-900/10 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Dlaczego ten przepis?
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {recipe.description || (
                  <>
                    Ten przepis został zaproponowany, ponieważ:
                    <br />• masz {recipe.usedIngredients.length} {recipe.usedIngredients.length === 1 ? 'składnik' : 'składników'} w lodówce
                    {recipe.coverage && <> ({Math.min(100, Math.round(recipe.coverage > 1 ? recipe.coverage : recipe.coverage * 100))}% pokrycia)</>}
                    <br />• {recipe.canCookNow ? 'możesz ugotować od razu' : `wystarczy dokupić ${recipe.missingCount} ${recipe.missingCount === 1 ? 'składnik' : 'składników'}`}
                    {recipe.cookingTime && <><br />• przygotowanie zajmuje tylko {recipe.cookingTime} minut</>}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7️⃣ ACTIONS SECTION */}
      <div className="p-6 space-y-3">
        {/* PRIMARY Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => onCook(servingsMultiplier)}
            disabled={isCooking}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isCooking ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gotuję...
              </>
            ) : (
              <>
                <ChefHat className="w-5 h-5" />
                Ugotuj
              </>
            )}
          </button>

          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <button
              onClick={onAddToCart}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-5 h-5" />
              Dodaj do zakupów
            </button>
          )}
        </div>

        {/* SECONDARY Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 dark:border-t-gray-300 rounded-full animate-spin" />
                Zapisuję...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Zapisz
              </>
            )}
          </button>

          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-all flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Odśwież
          </button>
        </div>
      </div>
    </motion.div>
  );
}
