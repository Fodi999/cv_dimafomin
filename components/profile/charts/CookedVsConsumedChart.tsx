"use client";

import { motion } from "framer-motion";
import { ChefHat, Utensils } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CookedVsConsumedProps {
  data: Array<{
    week: string;
    cooked: number;
    consumed: number;
  }>;
}

/**
 * Cooked vs Consumed Chart
 * Comparison chart showing cooking efficiency
 */
export function CookedVsConsumedChart({ data }: CookedVsConsumedProps) {
  const { t } = useLanguage();
  const maxValue = Math.max(...data.map(d => Math.max(d.cooked, d.consumed)));

  return (
    <div className="bg-gradient-to-br from-sky-500/20 to-cyan-500/20 rounded-xl p-3 sm:p-4 border border-sky-500/40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-bold text-white">
          {t?.profile?.stats?.cookedVsConsumed?.title || "Cooked vs Consumed"}
        </h3>
        <Utensils className="w-4 h-4 text-sky-400" />
      </div>

      {/* Chart */}
      <div className="space-y-3">
        {data.map((week, index) => {
          const cookedPercent = (week.cooked / maxValue) * 100;
          const consumedPercent = (week.consumed / maxValue) * 100;
          const efficiency = week.consumed > 0 ? (week.consumed / week.cooked) * 100 : 0;

          return (
            <div key={week.week}>
              {/* Week label */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] sm:text-xs text-gray-400">{week.week}</span>
                <span className="text-[10px] sm:text-xs text-sky-400">
                  {t?.profile?.stats?.cookedVsConsumed?.efficiency?.replace("{percent}", efficiency.toFixed(0)) || 
                    `${efficiency.toFixed(0)}% efficiency`}
                </span>
              </div>

              {/* Bars */}
              <div className="space-y-1">
                {/* Cooked */}
                <div className="flex items-center gap-2">
                  <ChefHat className="w-3 h-3 text-purple-400" />
                  <div className="flex-1 h-4 bg-white/5 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cookedPercent}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-end pr-1"
                    >
                      <span className="text-[9px] font-bold text-white">{week.cooked}</span>
                    </motion.div>
                  </div>
                </div>

                {/* Consumed */}
                <div className="flex items-center gap-2">
                  <Utensils className="w-3 h-3 text-sky-400" />
                  <div className="flex-1 h-4 bg-white/5 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${consumedPercent}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg flex items-center justify-end pr-1"
                    >
                      <span className="text-[9px] font-bold text-white">{week.consumed}</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
          <span className="text-[10px] text-gray-400">
            {t?.profile?.stats?.cookedVsConsumed?.cooked || "Cooked"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-sky-500 to-cyan-500" />
          <span className="text-[10px] text-gray-400">
            {t?.profile?.stats?.cookedVsConsumed?.consumed || "Consumed"}
          </span>
        </div>
      </div>
    </div>
  );
}
