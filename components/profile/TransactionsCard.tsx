"use client";

import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import type { Transaction } from "@/lib/profile-types";
import { borderRadius, colors } from "@/lib/design-tokens";

interface TransactionsCardProps {
  transactions: Transaction[];
}

export function TransactionsCard({ transactions }: TransactionsCardProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">
          Історія транзакцій
        </h3>
        <span className={`px-2 py-0.5 ${borderRadius.full} ${colors.primary.light.badge} text-sm font-medium`}>
          {transactions.length}
        </span>
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Немає транзакцій</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.slice(0, 5).map((transaction, idx) => (
            <div
              key={idx}
              className={`p-3 ${borderRadius.lg} bg-gray-900/40 border ${colors.border.dark.primary} flex items-center justify-between`}
            >
              <div className="flex items-center gap-2">
                {transaction.amount > 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-white">
                    {transaction.type || "Транзакція"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {transaction.date ? new Date(transaction.date).toLocaleDateString("uk-UA") : "-"}
                  </p>
                </div>
              </div>
              <p
                className={`text-sm font-semibold ${
                  transaction.amount > 0
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {transaction.amount > 0 ? "+" : ""}
                {transaction.amount}
              </p>
            </div>
          ))}
          {transactions.length > 5 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
              +{transactions.length - 5} ще транзакцій
            </p>
          )}
        </div>
      )}
    </div>
  );
}
