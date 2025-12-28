"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WasteChartProps {
  wasteData: Array<{
    week: string;
    percentage: number;
  }>;
}

/**
 * Waste Chart - Food waste percentage trend
 * Line chart showing waste % over last 4 weeks
 */
export function WasteChart({ wasteData }: WasteChartProps) {
  const { t } = useLanguage();
  
  const maxValue = Math.max(...wasteData.map(w => w.percentage), 20); // min 20% for scale
  const points = wasteData.map((week, index) => ({
    x: (index / (wasteData.length - 1)) * 100,
    y: 100 - (week.percentage / maxValue) * 100,
  }));

  // Calculate trend
  const firstValue = wasteData[0].percentage;
  const lastValue = wasteData[wasteData.length - 1].percentage;
  const trend = lastValue < firstValue ? "down" : lastValue > firstValue ? "up" : "stable";

  // Create SVG path
  const pathD = points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${path} L ${point.x} ${point.y}`;
  }, "");

  const getTrendText = () => {
    if (trend === "down") return t?.profile?.stats?.wasteChart?.trendDown || "Decreasing ✓";
    if (trend === "up") return t?.profile?.stats?.wasteChart?.trendUp || "Increasing";
    return t?.profile?.stats?.wasteChart?.trendStable || "Stable";
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl p-3 sm:p-4 border border-amber-500/40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-bold text-white">
          {t?.profile?.stats?.wasteChart?.title || "Food waste"}
        </h3>
        {trend === "down" && <TrendingDown className="w-4 h-4 text-green-400" />}
        {trend === "up" && <TrendingUp className="w-4 h-4 text-red-400" />}
        {trend === "stable" && <Minus className="w-4 h-4 text-gray-400" />}
      </div>

      {/* Chart */}
      <div className="relative h-32 bg-white/5 rounded-lg overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.5"
            />
          ))}

          {/* Area under line */}
          <motion.path
            d={`${pathD} L 100 100 L 0 100 Z`}
            fill="url(#wasteGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 0.8 }}
          />

          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#wasteStroke)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />

          {/* Points */}
          {points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill="#f59e0b"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.2 }}
            />
          ))}

          {/* Gradients */}
          <defs>
            <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="wasteStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>
        </svg>

        {/* Value labels */}
        <div className="absolute inset-0 flex items-end justify-between px-2 pb-1">
          {wasteData.map((week, index) => (
            <div key={week.week} className="text-center" style={{ flex: 1 }}>
              <div className="text-[9px] sm:text-[10px] font-bold text-amber-400">
                {week.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Week labels */}
      <div className="flex items-end justify-between mt-2">
        {wasteData.map((week) => (
          <div key={week.week} className="text-[9px] sm:text-[10px] text-gray-400 text-center" style={{ flex: 1 }}>
            {week.week}
          </div>
        ))}
      </div>

      {/* Trend info */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            {t?.profile?.stats?.wasteChart?.trend || "Trend:"}
          </span>
          <span className={`text-xs font-bold ${
            trend === "down" ? "text-green-400" : trend === "up" ? "text-red-400" : "text-gray-400"
          }`}>
            {getTrendText()}
          </span>
        </div>
      </div>
    </div>
  );
}
