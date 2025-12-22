"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, Users, ChefHat, TrendingUp, ShoppingCart, AlertCircle, Plus, Minus } from "lucide-react";
import type { RecipeMatch, RecipeMatchIngredient } from "@/lib/api";

interface RecipeMatchCardProps {
  recipe: RecipeMatch;
  onCook: (recipeId: string, idempotencyKey: string, servingsMultiplier: number) => Promise<void>;
  onAddToShoppingList?: (recipeId: string, missingIngredients: RecipeMatchIngredient[]) => void;
  isLoading?: boolean;
}

export default function RecipeMatchCard({
  recipe,
  onCook,
  onAddToShoppingList,
  isLoading = false,
}: RecipeMatchCardProps) {
  const [isCooking, setIsCooking] = useState(false);
  const [cookingKey, setCookingKey] = useState<string | null>(null);
  
  // 🆕 Servings state (starts at base servings from recipe)
  const [servings, setServings] = useState(recipe.servings);
  
  // 🆕 Scale coefficient (core logic)
  const scale = useMemo(() => servings / recipe.servings, [servings, recipe.servings]);

  // 🆕 Helper: Scale quantity
  const scaleQuantity = (qty: number) => {
    return Math.round(qty * scale * 100) / 100;
  };

  // 🆕 Scaled economy (recalculated automatically)
  const scaledEconomy = useMemo(() => {
    if (!recipe.economy) {
      return {
        usedValue: 0,
        costToComplete: 0,
        totalRecipeCost: 0,
        wasteRiskSaved: 0,
        currency: 'PLN',
      };
    }
    return {
      usedValue: recipe.economy.usedValue * scale,
      costToComplete: recipe.economy.costToComplete * scale,
      totalRecipeCost: recipe.economy.totalRecipeCost * scale,
      wasteRiskSaved: recipe.economy.wasteRiskSaved * scale,
      currency: recipe.economy.currency,
    };
  }, [recipe.economy, scale]);

  // Format quantity helper
  const formatQuantity = (quantity: number, unit: string) => {
    if (unit === "g" && quantity >= 1000) {
      return `${(quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1)} kg`;
    }
    if (unit === "ml" && quantity >= 1000) {
      return `${(quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1)} l`;
    }
    return `${quantity} ${unit}`;
  };

  // Score color (0-100)
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-blue-600 dark:text-blue-400";
    if (score >= 40) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  // Coverage color (0-100%)
  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return "bg-green-500";
    if (coverage >= 70) return "bg-blue-500";
    if (coverage >= 50) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const handleCook = async () => {
    if (isCooking || cookingKey) return; // Prevent double-click

    // Generate idempotency key (UUID v4)
    const idempotencyKey = `cook-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    setIsCooking(true);
    setCookingKey(idempotencyKey);

    try {
      // 🆕 Pass servingsMultiplier (scale coefficient)
      await onCook(recipe.recipeId, idempotencyKey, scale);
    } finally {
      setIsCooking(false);
      setCookingKey(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Header with Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat className="w-16 h-16 text-purple-300 dark:text-purple-700" />
          </div>
        )}
        
        {/* Score Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <span className={`text-lg font-bold ${getScoreColor(recipe.score)}`}>
            {recipe.score}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">pts</span>
        </div>

        {/* Coverage Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${getCoverageColor(recipe.coverage)}`} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {recipe.coverage.toFixed(0)}%
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {recipe.usedCount}/{recipe.usedCount + recipe.missingCount}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* 📘 Source Badge - "Przepis z katalogu" */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pb-2 border-b border-gray-100 dark:border-gray-800">
          <span>📘</span>
          <span>Przepis z katalogu</span>
        </div>

        {/* Title & Meta */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {recipe.title}
          </h3>
          
          {recipe.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {recipe.description}
            </p>
          )}

          {/* 🆕 Match Status Badge */}
          <div className="mt-2">
            {recipe.canCookNow ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                <span>✅</span>
                <span>Możesz ugotować teraz</span>
              </div>
            ) : recipe.missingCount > 0 ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                <span>🛒</span>
                <span>Brakuje {recipe.missingCount} {recipe.missingCount === 1 ? 'składnika' : recipe.missingCount < 5 ? 'składników' : 'składników'}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
                <span>❌</span>
                <span>Nie pasuje do lodówki</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookingTime} min</span>
            </div>
            
            {/* 🆕 Servings Selector */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                disabled={servings <= 1}
                className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Zmniejsz porcje"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-medium min-w-[3ch] text-center text-gray-900 dark:text-white">
                {servings}
              </span>
              <button
                onClick={() => setServings(Math.min(10, servings + 1))}
                disabled={servings >= 10}
                className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Zwiększ porcje"
              >
                <Plus className="w-3 h-3" />
              </button>
              <span className="text-gray-600 dark:text-gray-400">
                {servings === 1 ? 'porcja' : servings < 5 ? 'porcje' : 'porcji'}
              </span>
              {/* 🆕 Total Yield Indicator */}
              {(() => {
                // Calculate total weight of all ingredients
                const totalUsedWeight = recipe.usedIngredients.reduce((sum, ing) => {
                  const scaledQty = scaleQuantity(ing.quantity);
                  if (ing.unit === 'g' || ing.unit === 'ml') return sum + scaledQty;
                  if (ing.unit === 'kg' || ing.unit === 'l') return sum + scaledQty * 1000;
                  return sum;
                }, 0);
                const totalMissingWeight = recipe.missingIngredients.reduce((sum, ing) => {
                  const scaledQty = scaleQuantity(ing.quantity);
                  if (ing.unit === 'g' || ing.unit === 'ml') return sum + scaledQty;
                  if (ing.unit === 'kg' || ing.unit === 'l') return sum + scaledQty * 1000;
                  return sum;
                }, 0);
                const totalWeight = totalUsedWeight + totalMissingWeight;
                
                if (totalWeight > 0) {
                  return (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      (≈{formatQuantity(totalWeight, 'g')})
                    </span>
                  );
                }
                return null;
              })()}
            </div>
            
            {recipe.country && (
              <div className="flex items-center gap-1.5">
                <span>🌍</span>
                <span>{recipe.country}</span>
              </div>
            )}
            {recipe.difficulty && (
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span className="capitalize">{recipe.difficulty}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ingredients Used */}
        {recipe.usedIngredients.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-3 border border-green-200 dark:border-green-800/30">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">✅</span>
              Z lodówki ({recipe.usedCount})
            </h4>
            <ul className="space-y-1.5 text-sm">
              {recipe.usedIngredients.slice(0, 3).map((ing, i) => (
                <li key={i} className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>• {ing.name}</span>
                  <span className="font-medium">{formatQuantity(scaleQuantity(ing.quantity), ing.unit)}</span>
                </li>
              ))}
              {recipe.usedIngredients.length > 3 && (
                <li className="text-xs text-gray-500 dark:text-gray-400">
                  + {recipe.usedIngredients.length - 3} więcej
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Missing Ingredients */}
        {recipe.missingIngredients.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-3 border border-amber-200 dark:border-amber-800/30">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="text-amber-600 dark:text-amber-400">🛒</span>
              Do dokupienia ({recipe.missingCount})
            </h4>
            <ul className="space-y-1.5 text-sm mb-3">
              {recipe.missingIngredients.slice(0, 3).map((ing, i) => (
                <li key={i} className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>• {ing.name}</span>
                  <span className="font-medium">{formatQuantity(scaleQuantity(ing.quantity), ing.unit)}</span>
                </li>
              ))}
              {recipe.missingIngredients.length > 3 && (
                <li className="text-xs text-gray-500 dark:text-gray-400">
                  + {recipe.missingIngredients.length - 3} więcej
                </li>
              )}
            </ul>
            
            {scaledEconomy.costToComplete > 0 && (
              <div className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                Koszt dokupienia: ~{scaledEconomy.costToComplete.toFixed(2)} {scaledEconomy.currency}
              </div>
            )}
          </div>
        )}

        {/* Economy Summary */}
        <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-3 border border-purple-200 dark:border-purple-800/30">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="text-purple-600 dark:text-purple-400">💰</span>
            Ekonomia
          </h4>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Wartość z lodówki:</span>
              <span className="font-medium">{scaledEconomy.usedValue.toFixed(2)} {scaledEconomy.currency}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Koszt całkowity:</span>
              <span className="font-medium">{scaledEconomy.totalRecipeCost.toFixed(2)} {scaledEconomy.currency}</span>
            </div>
            {scaledEconomy.wasteRiskSaved > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold pt-1 border-t border-purple-200 dark:border-purple-800/30">
                <span>Uratowano przed marnowaniem:</span>
                <span>{scaledEconomy.wasteRiskSaved.toFixed(2)} {scaledEconomy.currency}</span>
              </div>
            )}
          </div>
        </div>

        {/* 🆕 Cooking Steps */}
        {recipe.steps && recipe.steps.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3 border border-blue-200 dark:border-blue-800/30">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">👨‍🍳</span>
              Sposób przygotowania
            </h4>
            <ol className="space-y-2 text-sm">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">
                    {i + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {recipe.canCookNow ? (
            <button
              onClick={handleCook}
              disabled={isCooking || isLoading}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isCooking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gotowanie...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5" />
                  Gotuj
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => onAddToShoppingList?.(recipe.recipeId, recipe.missingIngredients)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingCart className="w-5 h-5" />
              Dodaj do listy zakupów
            </button>
          )}
        </div>

        {/* Warning if can't cook now */}
        {!recipe.canCookNow && recipe.missingCount > 0 && (
          <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/5 rounded p-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Brakuje {recipe.missingCount} składników. Dokup je, aby ugotować ten przepis.</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
