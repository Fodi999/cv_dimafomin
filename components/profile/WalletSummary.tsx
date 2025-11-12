"use client";

import { motion } from "framer-motion";
import { Wallet, Send, TrendingUp, DollarSign } from "lucide-react";

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
      className="space-y-4"
    >
      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl p-8 text-white shadow-xl overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                Общий баланс
              </p>
              <p className="text-5xl font-bold">
                {balance.toLocaleString()}
              </p>
              <p className="text-white/70 text-sm mt-2">Chef Tokens</p>
            </div>
            <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
            <div>
              <p className="text-white/60 text-xs mb-1">Начислено</p>
              <p className="text-xl font-bold">
                +{earned.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">Потрачено</p>
              <p className="text-xl font-bold">
                -{spent.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">В ожидании</p>
              <p className="text-xl font-bold">
                +{pending.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-600 dark:text-gray-400">Пополнить</p>
              <p className="font-bold text-gray-900 dark:text-white">баланс</p>
            </div>
          </div>
          <span className="text-xl">→</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
              <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-600 dark:text-gray-400">Отправить</p>
              <p className="font-bold text-gray-900 dark:text-white">токены</p>
            </div>
          </div>
          <span className="text-xl">→</span>
        </motion.button>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          Последние транзакции
        </h3>
        <div className="space-y-3">
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
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {tx.type}
              </p>
              <p
                className={`font-bold text-${tx.color}-600 dark:text-${tx.color}-400`}
              >
                {tx.amount}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
