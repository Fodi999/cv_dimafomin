"use client";

import { motion } from "framer-motion";
import { Package, Coins, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { FridgeItem } from "@/lib/types";

interface FridgeStatsProps {
  items: FridgeItem[];
}

export default function FridgeStats({ items }: FridgeStatsProps) {
  const { t } = useLanguage();
  
  // Calculate total value
  const totalValue = items.reduce((sum, item) => {
    return sum + (item.totalPrice || 0);
  }, 0);

  // Calculate critical/expired value
  const criticalValue = items
    .filter(item => item.status === 'critical' || item.status === 'expired')
    .reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  const itemsCount = items.length;
  const hasPrice = items.some(item => item.totalPrice !== undefined && item.totalPrice !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
    >
      {/* Total products */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-200 dark:border-sky-800/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/10">
            <Package className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t?.fridge?.stats?.products || "Products"}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {itemsCount}
            </p>
          </div>
        </div>
      </div>

      {/* Total value */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Coins className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t?.fridge?.stats?.fridgeValue || "Fridge Value"}</p>
            {hasPrice ? (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalValue.toFixed(2)} PLN
              </p>
            ) : (
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                {t?.fridge?.stats?.noPrices || "No prices"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Critical/expired value warning */}
      {criticalValue > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{t?.fridge?.stats?.lossRisk || "Loss Risk"}</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {criticalValue.toFixed(2)} PLN
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                {t?.fridge?.stats?.quickUse || "Products for quick use"}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
