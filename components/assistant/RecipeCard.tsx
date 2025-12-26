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
  // 🔍 DEBUG: Log economy data
  console.log("💰 RecipeCard economy data:", recipe.economy);
  
  // Определяем badge для expiryPriority
  const getExpiryBadge = () => {
    if (!recipe.expiryPriority) return null;
    
    const badges = {
      critical: { emoji: "🔥", text: "Użyć pilnie", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800" },
      warning: { emoji: "🟡", text: "Użyć niedługo", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" },
      ok: { emoji: "🟢", text: "Świeże", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" },
    };
    
    const badge = badges[recipe.expiryPriority];
    if (!badge) return null;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
        <span>{badge.emoji}</span>
        {badge.text}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* 1️⃣ Header with Priority Badge */}
      <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <ChefHat className="w-6 h-6 flex-shrink-0" />
            <span>{recipe.title || recipe.name}</span>
          </h3>
          {getExpiryBadge()}
        </div>
        
        {/* ✅ REASON - ЧОМУ цей рецепт підходить */}
        {recipe.reason && (
          <div className="mt-3 flex items-start gap-2">
            <span className="text-white/70 text-sm">💡</span>
            <p className="text-white/90 text-sm italic">{recipe.reason}</p>
          </div>
        )}
        
        {recipe.description && (
          <p className="text-white/90 mt-2 text-sm">{recipe.description}</p>
        )}
      </div>

      {/* 2️⃣ Meta Info (одна строка) */}
      <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 bg-gray-50 dark:bg-gray-800/50">
        {(recipe.timeMinutes || recipe.cookingTime) && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">⏱ {recipe.timeMinutes || recipe.cookingTime} min</span>
          </div>
        )}
        {(recipe.servings || recipe.portions) && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span className="text-sm">👥 {recipe.servings || recipe.portions} porcji</span>
          </div>
        )}
      </div>

      {/* 3️⃣ Składniki z lodówki (ключевая ценность) */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-green-600 dark:text-green-400">✅</span>
          Z lodówki
        </h4>
        <ul className="space-y-2">
          {(recipe.ingredients || recipe.ingredientsUsed || []).map((ing, idx) => (
            <li key={idx} className="flex justify-between items-start gap-2 text-sm">
              <span className="text-gray-700 dark:text-gray-300">
                <strong>{ing.name}</strong>
              </span>
              <span className="text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">
                {ing.quantity} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4️⃣ Missing Ingredients - 2 scenariusze */}
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

      {/* 5️⃣ Economy (САМАЯ ВАЖНАЯ СЕКЦИЯ - killer feature) */}
      {recipe.economy && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/10">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>💰</span>
            Ekonomia
          </h4>
          <div className="space-y-2 text-sm">
            {/* Użyto produktów z lodówki */}
            {recipe.economy.usedValue !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  Użyto produktów z lodówki:
                </span>
                <span className="font-bold text-purple-700 dark:text-purple-400">
                  {recipe.economy.usedValue.toFixed(2)} {recipe.economy.currency || 'PLN'}
                </span>
              </div>
            )}
            
            {/* Do kupienia / Nie musisz nic kupować */}
            {recipe.economy.estimatedExtraCost !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  {recipe.economy.estimatedExtraCost > 0 ? 'Do kupienia:' : 'Nie musisz nic kupować'}
                </span>
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  {recipe.economy.estimatedExtraCost > 0 
                    ? `~${recipe.economy.estimatedExtraCost.toFixed(2)} ${recipe.economy.currency || 'PLN'}`
                    : '✅'
                  }
                </span>
              </div>
            )}
            
            {/* Oszczędzasz (główny selling point) */}
            {recipe.economy.savedMoney !== undefined && (
              <div className="pt-2 mt-2 border-t border-purple-200 dark:border-purple-800/30">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 dark:text-white font-semibold">
                    Oszczędzasz:
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                    {recipe.economy.savedMoney.toFixed(2)} {recipe.economy.currency || 'PLN'}
                  </span>
                </div>
              </div>
            )}
            
            {/* Fallback dla starych danych (jeśli backend nie wysyła usedValue/savedMoney) */}
            {recipe.economy.usedFromFridge && 
             recipe.economy.usedValue === undefined && 
             recipe.economy.savedMoney === undefined && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                ✅ Używasz produktów z lodówki — oszczędzasz!
              </p>
            )}
          </div>
        </div>
      )}

      {/* 6️⃣ Preparation Steps (👨‍🍳 Przygotowanie) */}
      {recipe.steps && recipe.steps.length > 0 && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span>👨‍🍳</span>
            Przygotowanie
          </h4>
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
      )}

      {/* 7️⃣ Chef Tips (opcjonalne - PRO feature w przyszłości) */}
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
