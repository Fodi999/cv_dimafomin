"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, DollarSign, PiggyBank, ShoppingCart, Lightbulb } from "lucide-react";

interface CostInsight {
  totalSpent: number;
  avgPerDay?: number;
  avgPerWeek?: number;
  topExpenses?: Array<{ name: string; amount: number; percentage: number }>;
  savings?: Array<{ tip: string; potential: number }>;
  comparison?: {
    vs_last_week?: number;
    vs_last_month?: number;
  };
}

interface CostInsightsProps {
  data: CostInsight;
}

export function CostInsights({ data }: CostInsightsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    }).format(amount);
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-5 h-5 text-red-500" />;
    if (value < 0) return <TrendingDown className="w-5 h-5 text-green-500" />;
    return <DollarSign className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <PiggyBank className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Przeanalizuj koszty kuchni
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kontrola wydatków i realne oszczędności
          </p>
        </div>
      </div>

      {/* Total Spent Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Całkowite wydatki</p>
            <p className="text-4xl font-bold">{formatCurrency(data.totalSpent)}</p>
            {data.avgPerDay && (
              <p className="text-sm opacity-75 mt-2">
                ~{formatCurrency(data.avgPerDay)} / dzień
              </p>
            )}
          </div>
          <ShoppingCart className="w-16 h-16 opacity-20" />
        </div>

        {/* Comparison */}
        {data.comparison && (
          <div className="mt-4 pt-4 border-t border-white/20 flex gap-4">
            {data.comparison.vs_last_week !== undefined && (
              <div className="flex items-center gap-2">
                {getTrendIcon(data.comparison.vs_last_week)}
                <span className="text-sm">
                  {Math.abs(data.comparison.vs_last_week)}% vs tydzień temu
                </span>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Top Expenses */}
      {data.topExpenses && data.topExpenses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
        >
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Największe wydatki
          </h4>
          <div className="space-y-3">
            {data.topExpenses.map((expense, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {expense.name}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${expense.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {expense.percentage}% całkowitych wydatków
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Savings Tips */}
      {data.savings && data.savings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
        >
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Porady oszczędnościowe
          </h4>
          <div className="space-y-4">
            {data.savings.map((saving, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-4 border-l-4 border-yellow-500"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {saving.tip}
                </p>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold">
                    Oszczędność: {formatCurrency(saving.potential)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Average Stats */}
      {data.avgPerWeek && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Średnio / dzień</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.avgPerDay || 0)}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Średnio / tydzień</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(data.avgPerWeek)}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
