"use client";

import { motion } from "framer-motion";
import { PieChart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryChartProps {
  categories: Array<{
    name: string;
    spent: number;
    color: string;
  }>;
}

/**
 * Category Chart - Spending by category
 * Donut chart showing category breakdown
 */
export function CategoryChart({ categories }: CategoryChartProps) {
  const { t } = useLanguage();
  const total = categories.reduce((sum, cat) => sum + cat.spent, 0);
  
  let cumulativePercent = 0;
  const segments = categories.map((category) => {
    const percent = (category.spent / total) * 100;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    
    return {
      ...category,
      percent,
      startPercent,
      endPercent: cumulativePercent,
    };
  });

  // Create donut segments using conic-gradient
  const conicGradient = segments
    .map(
      (seg) =>
        `${seg.color} ${seg.startPercent}% ${seg.endPercent}%`
    )
    .join(", ");

  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-3 sm:p-4 border border-purple-500/40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-bold text-white">
          {t?.profile?.stats?.categoryChart?.title || "Spending by category"}
        </h3>
        <PieChart className="w-4 h-4 text-purple-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32 sm:w-36 sm:h-36">
            {/* Donut */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(${conicGradient})`,
              }}
            />
            
            {/* Center hole */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-900/80 backdrop-blur-sm rounded-full flex flex-col items-center justify-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{total}</div>
                <div className="text-[9px] sm:text-[10px] text-gray-400">PLN</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {segments.map((segment, index) => (
            <motion.div
              key={segment.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-xs text-gray-300">{segment.name}</span>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-white">{segment.spent} PLN</div>
                <div className="text-[9px] text-gray-400">{segment.percent.toFixed(0)}%</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
