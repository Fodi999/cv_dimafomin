"use client";

import { motion } from "framer-motion";
import { ChefHat, BookmarkCheck, Refrigerator, PiggyBank } from "lucide-react";

interface QuickStatsProps {
  cookedRecipes: number;
  savedRecipes: number;
  fridgeItems: number;
  savedMoney: number; // in PLN
}

/**
 * Quick Stats - Short analytics
 * 4 cards: Cooked, Saved, Fridge, Money Saved
 * No text, only numbers + icons
 */
export function QuickStats({
  cookedRecipes,
  savedRecipes,
  fridgeItems,
  savedMoney,
}: QuickStatsProps) {
  const stats = [
    {
      icon: <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "Ugotowane przepisy",
      value: cookedRecipes,
      color: "from-green-500 to-emerald-500",
      textColor: "text-green-400",
    },
    {
      icon: <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "Zapisane przepisy",
      value: savedRecipes,
      color: "from-purple-500 to-pink-500",
      textColor: "text-purple-400",
    },
    {
      icon: <Refrigerator className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "Produkty w lodówce",
      value: fridgeItems,
      color: "from-sky-500 to-cyan-500",
      textColor: "text-sky-400",
    },
    {
      icon: <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: "Oszczędzono",
      value: `${savedMoney.toFixed(0)} PLN`,
      color: "from-amber-500 to-orange-500",
      textColor: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-gradient-to-br from-sky-500/10 to-cyan-500/10 rounded-lg p-2.5 border border-sky-300/40 backdrop-blur-sm hover:border-sky-300/60 transition-all"
        >
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20 flex-shrink-0`}>
              <div className={stat.textColor}>{stat.icon}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg sm:text-xl font-bold text-white leading-tight">{stat.value}</div>
              <div className="text-[9px] sm:text-[10px] text-gray-400 leading-tight truncate">{stat.label}</div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
