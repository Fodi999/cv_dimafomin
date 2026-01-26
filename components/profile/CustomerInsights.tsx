"use client";

import { motion } from "framer-motion";
import { Lightbulb, Users } from "lucide-react";

interface CustomerInsightsProps {
  userLevel?: number;
  insights?: string[];
}

/**
 * 🧠 Community Insights - CUSTOMER VERSION
 * 
 * ❌ НЕ про:
 * - Оптимизацию холодильника
 * - Контроль себестоимости
 * - Управление кухней
 * 
 * ✅ ПРО:
 * - Выбор блюд
 * - Сравнение цен
 * - Покупательский опыт
 * 
 * Тот же механизм, другой текст, та же ценность.
 */
export function CustomerInsights({ 
  userLevel = 1,
  insights = [
    "Пользователи вашего уровня чаще выбирают простые, проверенные блюда",
    "Многие начинают сравнивать цены и порции",
    "Это хороший момент найти свои любимые позиции"
  ]
}: CustomerInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-blue-500/20 rounded-lg">
          <Lightbulb className="w-4 h-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-bold text-white">
          🧠 Наблюдения сообщества
        </h3>
        <span className="text-[10px] text-gray-500 font-medium">
          (уровень {userLevel})
        </span>
      </div>

      {/* Insights */}
      <div className="space-y-2.5">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
            className="flex items-start gap-2 group"
          >
            <div className="mt-0.5 w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
            <p className="text-xs text-gray-300 leading-relaxed">
              {insight}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-700/50">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <Users className="w-3 h-3" />
          <span>Агрегировано из поведения покупателей</span>
        </div>
      </div>
    </motion.div>
  );
}
