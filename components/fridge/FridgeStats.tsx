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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6"
    >
      {/* Total products */}
      <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-200 dark:border-sky-800/30">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-sky-500/10">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">{t?.fridge?.stats?.products || "Products"}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {itemsCount}
            </p>
          </div>
        </div>
      </div>

      {/* Current value (based on remaining) */}
      <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/30">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
              {t?.fridge?.stats?.currentValue || "Current Value"}
            </p>
            {hasPrice ? (
              <>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {totalValue.toFixed(2)} PLN
                </p>
                <p className="text-[9px] sm:text-[10px] text-green-600 dark:text-green-400 mt-0.5">
                  ✅ {t?.fridge?.stats?.basedOnRemaining || "Based on remaining"}
                </p>
              </>
            ) : (
              <p className="text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-medium">
                {t?.fridge?.stats?.noPrices || "No prices"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Expiring soon warning */}
      {expiringSoonCount > 0 && (
        <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800/30">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/10">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                {t?.fridge?.stats?.expiringSoon || "Expiring Soon"}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                {expiringSoonCount}
              </p>
              <p className="text-[9px] sm:text-[10px] text-orange-500 dark:text-orange-400 mt-0.5">
                ⚠️ {criticalValue.toFixed(2)} PLN - {t?.fridge?.stats?.useToday || "Use today"}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
