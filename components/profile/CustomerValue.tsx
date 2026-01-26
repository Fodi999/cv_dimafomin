"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Gift } from "lucide-react";

interface CustomerValueProps {
  savedMoney: number;
  savedPercentage: number;
  currency?: string;
  totalOrders: number;
}

/**
 * 💳 Value & Loyalty
 * 
 * CUSTOMER-ПРОФИЛЬ (не Admin!)
 * 
 * Показываем:
 * - Выгоду (сколько сэкономил)
 * - ChefTokens (лояльность)
 * - Заказы (активность)
 * 
 * НЕ показываем:
 * - Холодильник
 * - Приготовленные рецепты
 * - Себестоимость
 * 
 * Customer не управляет кухней.
 * Customer управляет своим опытом и выгодой.
 */
export function CustomerValue({
  savedMoney,
  savedPercentage,
  currency = "PLN",
  totalOrders,
}: CustomerValueProps) {
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
          <Gift className="w-4 h-4 text-emerald-400" />
        </div>
        <h3 className="text-sm font-bold text-white">
          💳 Моя выгода на платформе
        </h3>
      </div>

      {/* PRIMARY - Saved Money (Customer's main value) */}
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
              💰 Сэкономлено за месяц
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
            по сравнению с обычными ценами
          </p>
        </div>
      </motion.div>

      {/* Secondary Metric - Total Orders */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-700/50 p-3"
      >
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] text-gray-400 font-medium">
            Заказов всего
          </span>
        </div>
        <div className="text-2xl font-bold text-white">
          {totalOrders}
        </div>
        <p className="text-[9px] text-gray-500 mt-0.5">
          за всё время
        </p>
      </motion.div>
    </motion.div>
  );
}
