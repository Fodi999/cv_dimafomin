"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { composite } from "@/lib/design-tokens";
import { WalletDetailSheet } from "./WalletDetailSheet";

interface WalletCardProps {
  balance: number;
  earned?: number;
  spent?: number;
  pending?: number;
  onPurchaseClick?: () => void;
}

export function WalletCard({
  balance,
  earned = 0,
  spent = 0,
  pending = 0,
  onPurchaseClick,
}: WalletCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-4"
      >
        {/* Main Balance Card */}
        <motion.button
          onClick={() => setIsDetailsOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`${composite.card.container} ${composite.card.hover} overflow-hidden w-full text-left transition-all`}
        >
          <div className="px-6 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-violet-500/20 border border-violet-400/40">
                <Wallet className="w-6 h-6 text-violet-300" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-tight font-semibold">
                  Баланс токенів
                </p>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-4">
              {balance.toLocaleString()}
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg"
            >
              Поповнити баланс
            </motion.div>
          </div>
        </motion.button>

        {/* Stats Cards - 3 columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {/* Earned */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className={`${composite.card.container} ${composite.card.hover} overflow-hidden`}
          >
            <div className="px-4 py-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                <p className="text-xs text-gray-400 font-semibold">Заробили</p>
              </div>
              <p className="text-lg font-bold text-emerald-300">
                {earned.toLocaleString()}
              </p>
            </div>
          </motion.div>

          {/* Spent */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className={`${composite.card.container} ${composite.card.hover} overflow-hidden`}
          >
            <div className="px-4 py-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="w-4 h-4 text-rose-400" />
                <p className="text-xs text-gray-400 font-semibold">Витратили</p>
              </div>
              <p className="text-lg font-bold text-rose-300">
                {spent.toLocaleString()}
              </p>
            </div>
          </motion.div>

          {/* Pending */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className={`${composite.card.container} ${composite.card.hover} overflow-hidden`}
          >
            <div className="px-4 py-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <p className="text-xs text-gray-400 font-semibold">Очікуючи</p>
              </div>
              <p className="text-lg font-bold text-amber-300">
                {pending.toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Wallet Detail Sheet */}
      <WalletDetailSheet
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        balance={balance}
        earned={earned}
        spent={spent}
        pending={pending}
        onPurchaseClick={onPurchaseClick}
      />
    </>
  );
}
