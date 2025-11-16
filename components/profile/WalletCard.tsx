"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
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
        className={`${composite.card.container} ${composite.card.hover} overflow-hidden`}
      >
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-violet-500/20 border border-violet-400/40">
              <Wallet className="w-5 h-5 text-violet-300" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-tight font-semibold">
                Баланс
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {balance.toLocaleString()}
              </p>
            </div>
          </div>
          <motion.button
            onClick={() => setIsDetailsOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 transition-colors"
            title="Деталі кошелька"
          >
            <Wallet className="w-5 h-5 text-white" />
          </motion.button>
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
