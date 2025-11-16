"use client";

import { motion } from "framer-motion";
import { TokenBalanceCard } from "../TokenBalanceCard";
import { TransactionsCard } from "../TransactionsCard";
import type { Transaction } from "@/lib/profile-types";

interface WalletSectionProps {
  balance: number;
  transactions: Transaction[];
  retryCount: number;
  translations: Record<string, string>;
  onEarnClick: () => void;
  onBuyClick: () => void;
  onRefreshClick: () => void;
}

export function WalletSection({
  balance,
  transactions,
  retryCount,
  translations,
  onEarnClick,
  onBuyClick,
  onRefreshClick,
}: WalletSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Token Balance Card */}
      <TokenBalanceCard
        balance={balance}
        loading={false}
        retryCount={retryCount}
        transactionsCount={transactions.length}
        translations={translations}
        onEarnClick={onEarnClick}
        onBuyClick={onBuyClick}
        onRefreshClick={onRefreshClick}
      />

      {/* Transactions */}
      <TransactionsCard transactions={transactions} />
    </motion.div>
  );
}
