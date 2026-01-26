"use client";

import { motion } from "framer-motion";
import { TrendingUp, Package, ChefHat, DollarSign } from "lucide-react";

interface BusinessSnapshotProps {
  savedMoney: number;
  savedPercentage: number;
  currency?: string;
  fridgeItems: number;
  cookedRecipes: number;
}

/**
 * 💼 Business Snapshot
 * 
 * Dashboard-lite в профиле
 * Ключевые метрики бизнеса:
 * - Сэкономлено (PRIMARY)
 * - Продукты
 * - Приготовлено
 * 
 * За ЭТО платят.
 */
export function BusinessSnapshot({
  savedMoney,
  savedPercentage,
  currency = "PLN",
  fridgeItems,
  cookedRecipes,
}: BusinessSnapshotProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-emerald-500/20 rounded-lg">
          <DollarSign className="w-4 h-4 text-emerald-400" />
        </div>
        <h3 className="text-sm font-bold text-white">
          💼 Центр управления кухней
        </h3>
      </div>

      {/* PRIMARY - Saved Money */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl border border-emerald-500/40 p-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-emerald-300/80 font-medium">
              💰 Сэкономлено
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 rounded-full">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-300">
                +{savedPercentage}%
              </span>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {savedMoney.toFixed(2)}
            </span>
            <span className="text-lg text-emerald-300 font-semibold">
              {currency}
            </span>
          </div>
          
          <p className="text-[10px] text-emerald-300/60 mt-1">
            этот месяц
          </p>
        </div>
      </motion.div>

      {/* Secondary Metrics - Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Продукты */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] text-gray-400 font-medium">
              Продукты
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {fridgeItems}
          </div>
        </motion.div>

        {/* Приготовлено */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 p-3"
        >
          <div className="flex items-center gap-2 mb-2">
            <ChefHat className="w-4 h-4 text-violet-400" />
            <span className="text-[10px] text-gray-400 font-medium">
              Приготовлено
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            {cookedRecipes}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
