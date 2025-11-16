"use client";

import { motion } from "framer-motion";
import { Wallet, Send, TrendingUp, DollarSign, Award, BookOpen } from "lucide-react";

interface WalletSummaryProps {
  balance?: number;
  earned?: number;
  spent?: number;
  pending?: number;
}

export function WalletSummary({
  balance = 5000,
  earned = 15000,
  spent = 10000,
  pending = 500,
}: WalletSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="space-y-3"
    >
      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-lg p-4 text-white shadow-xl overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-xs font-medium mb-1">
                Общий баланс
              </p>
              <p className="text-3xl font-bold">
                {balance.toLocaleString()}
              </p>
              <p className="text-white/70 text-xs mt-1">Chef Tokens</p>
            </div>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Wallet className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20">
            <div>
              <p className="text-white/60 text-xs mb-1">Начислено</p>
              <p className="text-sm font-bold">
                +{earned.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Потрачено</p>
              <p className="text-sm font-bold">
                -{spent.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">В ожидании</p>
              <p className="text-sm font-bold">
                +{pending.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <motion.button
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 flex items-center justify-between group min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[0.625rem] leading-none text-gray-600 dark:text-gray-400 truncate">Пополнить</p>
              <p className="text-[0.625rem] leading-none font-bold text-gray-900 dark:text-white truncate">баланс</p>
            </div>
          </div>
          <span className="text-xl flex-shrink-0 ml-2">→</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 flex items-center justify-between group min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors flex-shrink-0">
              <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[0.625rem] leading-none text-gray-600 dark:text-gray-400 truncate">Отправить</p>
              <p className="text-[0.625rem] leading-none font-bold text-gray-900 dark:text-white truncate">токены</p>
            </div>
          </div>
          <span className="text-xl flex-shrink-0 ml-2">→</span>
        </motion.button>
      </div>

      {/* Transaction History and Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Transaction History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            Последние транзакции
          </h3>
          <div className="space-y-2">
            {[
              { type: "Покупка рецепта", amount: "-250", color: "red" },
              { type: "Завершение курса", amount: "+500", color: "green" },
              { type: "Реферальный бонус", amount: "+150", color: "green" },
            ].map((tx, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {tx.type}
                </p>
                <p
                  className={`font-bold text-${tx.color}-600 dark:text-${tx.color}-400 text-sm`}
                >
                  {tx.amount}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div className="space-y-2">
          {/* Completed Course */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">Майстер суші: професійний рівень</h3>
                  <p className="text-xs text-gray-600">Завершено: 15 жовтня 2024</p>
                </div>
              </div>
              <div className="text-green-600 font-bold text-lg flex-shrink-0">100%</div>
            </div>
            <div className="w-full bg-green-200 h-2 rounded-full overflow-hidden mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "100%" }} />
            </div>
          </motion.div>

          {/* In Progress Course */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">Японська кухня для початківців</h3>
                  <p className="text-xs text-gray-600">В процесі навчання</p>
                </div>
              </div>
              <div className="text-orange-600 font-bold text-lg flex-shrink-0">30%</div>
            </div>
            <div className="w-full bg-orange-200 h-2 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: "30%" }} 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
