"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Clock, Trash2, CheckCircle2 } from "lucide-react";

interface UrgentItem {
  name: string;
  daysLeft: number;
  quantity?: number;
  unit?: string;
  suggestion: string;
}

interface UrgentActionsProps {
  items: UrgentItem[];
  onMarkDone: (item: UrgentItem) => void;
  loading?: boolean;
}

export function UrgentActions({ items, onMarkDone, loading }: UrgentActionsProps) {
  const getUrgencyColor = (daysLeft: number) => {
    if (daysLeft <= 1) return "from-red-500 to-rose-500";
    if (daysLeft <= 3) return "from-orange-500 to-amber-500";
    return "from-yellow-500 to-orange-500";
  };

  const getUrgencyIcon = (daysLeft: number) => {
    if (daysLeft <= 1) return <Trash2 className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Kończące się produkty
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {items.length} produktów wymaga uwagi
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className={`h-2 bg-gradient-to-r ${getUrgencyColor(item.daysLeft)}`} />
            
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Item Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getUrgencyColor(item.daysLeft)} flex items-center justify-center text-white`}>
                      {getUrgencyIcon(item.daysLeft)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">
                          {item.daysLeft === 0 ? "Dzisiaj wygasa!" : 
                           item.daysLeft === 1 ? "1 dzień" : 
                           `${item.daysLeft} dni`}
                        </span>
                        {item.quantity && (
                          <>
                            <span>•</span>
                            <span>{item.quantity} {item.unit || "szt"}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* AI Suggestion */}
                  <div className="mt-3 p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                      💡 Rekomendacja AI:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.suggestion}
                    </p>
                  </div>
                </div>

                {/* Zrobione Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onMarkDone(item)}
                  disabled={loading}
                  className="
                    px-4 py-2 rounded-lg
                    bg-gradient-to-r from-green-500 to-emerald-500
                    hover:from-green-600 hover:to-emerald-600
                    text-white font-semibold text-sm
                    shadow-md hover:shadow-lg
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center gap-2
                    whitespace-nowrap
                    h-fit
                  "
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Zrobione
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Wszystkie produkty są świeże! 🎉</p>
        </div>
      )}
    </div>
  );
}
