"use client";

import { motion } from "framer-motion";
import { Package, Coins, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { FridgeItem } from "@/lib/types";
import { calculateFridgeValue, countExpiringSoon } from "@/lib/fridgeUtils";

interface FridgeStatsProps {
  items: FridgeItem[];
}

export default function FridgeStats({ items }: FridgeStatsProps) {
  const { t } = useLanguage();
  
  // ✅ ПРАВИЛЬНО: Calculate value based on REMAINING quantities
  const totalValue = calculateFridgeValue(items);

  // Count items expiring soon (within 2 days)
  const expiringSoonCount = countExpiringSoon(items, 2);
  
  // Calculate critical value (items expiring within 2 days)
  const criticalValue = items
    .filter(item => item.daysLeft !== null && item.daysLeft <= 2)
    .reduce((sum, item) => sum + (item.currentValue || 0), 0);

  const itemsCount = items.length;
  const hasPrice = items.some(item => item.pricePerUnit !== undefined && item.pricePerUnit !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6"
    >
      {/* Total products */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
            <Package className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t?.fridge?.stats?.products || "Products"}</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">
              {itemsCount}
            </p>
          </div>
        </div>
      </div>

      {/* Current value (based on remaining) */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
            <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t?.fridge?.stats?.currentValue || "Value"}
            </p>
            {hasPrice ? (
              <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                {totalValue.toFixed(2)} PLN
              </p>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                {t?.fridge?.stats?.noPrices || "No prices"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Expiring soon warning */}
      {expiringSoonCount > 0 && (
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200/60 dark:border-orange-700/50 shadow-sm hover:shadow-md transition-all col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t?.fridge?.stats?.expiringSoon || "Expiring Soon"}
              </p>
              <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
                {expiringSoonCount}
              </p>
              {criticalValue > 0 && (
                <p className="text-[10px] text-orange-500 dark:text-orange-400 mt-0.5">
                  {criticalValue.toFixed(2)} PLN
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
