"use client";

import { motion } from "framer-motion";
import { TrendingDown, Trash2, ChefHat, ShoppingCart } from "lucide-react";
import { BudgetChart } from "@/components/profile/charts/BudgetChart";
import { WasteChart } from "@/components/profile/charts/WasteChart";
import { CategoryChart } from "@/components/profile/charts/CategoryChart";
import { CookedVsConsumedChart } from "@/components/profile/charts/CookedVsConsumedChart";

interface StatsTabProps {
  weeklyBudget?: number;
  weeklySpent?: number;
  wastePercentage: number;
  topRecipes: Array<{ name: string; count: number }>;
  topCategories: Array<{ name: string; spent: number }>;
}

/**
 * Tab 2: Statystyki (Analytics)
 * PHILOSOPHY: Pure data-driven analytics with visual charts
 * Shows:
 * - Budget trend chart (last 4 weeks)
 * - Waste percentage trend
 * - Cooked vs consumed efficiency
 * - Category spending breakdown (donut chart)
 * - Top recipes & categories (detailed lists)
 */
export function StatsTab({
  weeklyBudget,
  weeklySpent,
  wastePercentage,
  topRecipes,
  topCategories,
}: StatsTabProps) {
  // Mock data for charts (replace with real data from backend)
  const budgetData = [
    { week: "Tydz 1", spent: 250, budget: 300 },
    { week: "Tydz 2", spent: 280, budget: 300 },
    { week: "Tydz 3", spent: 220, budget: 300 },
    { week: "Tydz 4", spent: weeklySpent || 185, budget: weeklyBudget || 300 },
  ];

  const wasteData = [
    { week: "Tydz 1", percentage: 12 },
    { week: "Tydz 2", percentage: 10 },
    { week: "Tydz 3", percentage: 9 },
    { week: "Tydz 4", percentage: wastePercentage },
  ];

  const cookedVsConsumed = [
    { week: "Tydz 1", cooked: 8, consumed: 7 },
    { week: "Tydz 2", cooked: 10, consumed: 9 },
    { week: "Tydz 3", cooked: 12, consumed: 11 },
    { week: "Tydz 4", cooked: 9, consumed: 8 },
  ];

  const categoryColors = [
    "#10b981", // green
    "#8b5cf6", // purple
    "#f59e0b", // amber
    "#06b6d4", // cyan
    "#ec4899", // pink
  ];

  const categoryChartData = topCategories.map((cat, index) => ({
    ...cat,
    color: categoryColors[index % categoryColors.length],
  }));

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <BudgetChart weeklyData={budgetData} />
        <WasteChart wasteData={wasteData} />
        <CookedVsConsumedChart data={cookedVsConsumed} />
        <CategoryChart categories={categoryChartData} />
      </div>

      {/* Waste Percentage */}
      <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-3 sm:p-4 border border-orange-500/40">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1">Marnowanie produktów</h3>
            <p className="text-[10px] sm:text-xs text-gray-400">
              {wastePercentage < 10 ? "Świetny wynik! 🎉" : wastePercentage < 20 ? "Dobra praca 👍" : "Możesz lepiej ♻️"}
            </p>
          </div>
          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
        </div>
        <div className="flex items-end gap-2 sm:gap-3">
          <div className="text-3xl sm:text-4xl font-bold text-white">{wastePercentage}%</div>
          <div className="text-[10px] sm:text-xs text-gray-400 pb-0.5 sm:pb-1 leading-tight">produktów zmarnowanych</div>
        </div>
      </div>

      {/* Top Recipes */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
          <ChefHat className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />
          Najczęściej gotowane
        </h3>
        {topRecipes.length > 0 ? (
          <div className="space-y-1.5 sm:space-y-2">
            {topRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-lg sm:text-xl font-bold text-sky-400">#{index + 1}</div>
                    <div>
                      <p className="text-white font-medium text-xs sm:text-sm leading-tight">{recipe.name}</p>
                      <p className="text-[9px] sm:text-[10px] text-gray-400">{recipe.count}× ugotowano</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">Brak danych</p>
          </div>
        )}
      </div>

      {/* Top Categories by Spending */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-white mb-2 sm:mb-3 flex items-center gap-2">
          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
          Kategorie z największym wydatkiem
        </h3>
        {topCategories.length > 0 ? (
          <div className="space-y-1.5 sm:space-y-2">
            {topCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-2 sm:p-3 border border-white/10"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white font-medium text-xs sm:text-sm">{category.name}</span>
                  <span className="text-green-400 font-bold text-xs sm:text-sm">{category.spent.toFixed(0)} PLN</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1 sm:h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                    style={{ 
                      width: `${(category.spent / Math.max(...topCategories.map(c => c.spent))) * 100}%` 
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">Brak danych</p>
          </div>
        )}
      </div>
    </div>
  );
}
