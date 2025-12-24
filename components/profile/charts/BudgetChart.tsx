"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BudgetChartProps {
  weeklyData: Array<{
    week: string;
    spent: number;
    budget: number;
  }>;
}

/**
 * Budget Chart - Weekly spending vs budget
 * Simple bar chart showing last 4 weeks
 */
export function BudgetChart({ weeklyData }: BudgetChartProps) {
  const maxValue = Math.max(...weeklyData.map(w => Math.max(w.spent, w.budget)));

  return (
    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-3 sm:p-4 border border-green-500/40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-bold text-white">Budżet (ostatnie 4 tygodnie)</h3>
        <TrendingUp className="w-4 h-4 text-green-400" />
      </div>

      {/* Chart */}
      <div className="space-y-2">
        {weeklyData.map((week, index) => {
          const spentPercent = (week.spent / maxValue) * 100;
          const budgetPercent = (week.budget / maxValue) * 100;
          const isOverBudget = week.spent > week.budget;

          return (
            <div key={week.week}>
              {/* Week label */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] sm:text-xs text-gray-400">{week.week}</span>
                <span className={`text-[10px] sm:text-xs font-bold ${
                  isOverBudget ? "text-red-400" : "text-green-400"
                }`}>
                  {week.spent} / {week.budget} PLN
                </span>
              </div>

              {/* Bars */}
              <div className="relative h-6 bg-white/5 rounded-lg overflow-hidden">
                {/* Budget bar (background) */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${budgetPercent}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="absolute h-full bg-white/10 rounded-lg"
                />
                
                {/* Spent bar (foreground) */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${spentPercent}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                  className={`absolute h-full rounded-lg ${
                    isOverBudget
                      ? "bg-gradient-to-r from-red-500 to-orange-500"
                      : "bg-gradient-to-r from-green-500 to-emerald-500"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-green-500 to-emerald-500" />
          <span className="text-[10px] text-gray-400">Wydano</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white/10" />
          <span className="text-[10px] text-gray-400">Budżet</span>
        </div>
      </div>
    </div>
  );
}
