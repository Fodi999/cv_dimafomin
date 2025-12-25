"use client";

import { motion } from "framer-motion";
import { PiggyBank, ChefHat, Refrigerator, Coins, TrendingUp } from "lucide-react";

interface HeroKPIProps {
  savedMoney: number;
  cookedRecipes: number;
  fridgeItems: number;
  chefTokens: number;
}

/**
 * Hero KPI Cards - Main Dashboard Metrics
 * Visual hierarchy: Oszczędzono is PRIMARY (biggest, most important)
 * Others are secondary supporting metrics
 */
export function HeroKPI({
  savedMoney,
  cookedRecipes,
  fridgeItems,
  chefTokens,
}: HeroKPIProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* PRIMARY KPI - Oszczędzono (Hero Card) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="sm:col-span-2 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl border border-emerald-500/40 p-4 sm:p-6 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <PiggyBank className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">+12%</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm sm:text-base text-emerald-300/80 font-medium">
              💰 Oszczędzono
            </p>
            <p className="text-4xl sm:text-5xl font-bold text-white">
              {savedMoney.toFixed(2)} <span className="text-2xl sm:text-3xl text-emerald-300">PLN</span>
            </p>
            <p className="text-xs sm:text-sm text-emerald-300/60">
              W tym miesiącu
            </p>
          </div>
        </div>
      </motion.div>

      {/* Secondary KPIs - Equal size, less visual weight */}
      
      {/* Ugotowane */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl border border-violet-500/40 p-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-400/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="p-2.5 bg-violet-500/20 rounded-lg w-fit mb-3">
            <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-violet-400" />
          </div>
          
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm text-violet-300/80 font-medium">
              Ugotowane
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-white">
              {cookedRecipes}
            </p>
            <p className="text-[10px] sm:text-xs text-violet-300/60">
              przepisów
            </p>
          </div>
        </div>
      </motion.div>

      {/* Produkty w lodówce */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-br from-sky-500/20 to-cyan-500/20 rounded-xl border border-sky-500/40 p-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-400/10 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="p-2.5 bg-sky-500/20 rounded-lg w-fit mb-3">
            <Refrigerator className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
          </div>
          
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm text-sky-300/80 font-medium">
              W lodówce
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-white">
              {fridgeItems}
            </p>
            <p className="text-[10px] sm:text-xs text-sky-300/60">
              produktów
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
