// TransactionHistory.tsx — історія транзакцій з іконками

import { TrendingUp, Gift, Coins, ShoppingBag, Wallet } from "lucide-react";
import type { Transaction } from "@/lib/profile-types";

interface TransactionHistoryProps {
  transactions: Transaction[];
  translations: Record<string, string>;
}

export function TransactionHistory({ transactions, translations }: TransactionHistoryProps) {
  if (transactions.length === 0) return null;

  return (
    <div className="max-w-md mx-auto mb-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">{translations.transactionHistory}</h3>
          </div>
        </div>

        {/* Transaction list */}
        <div className="divide-y divide-gray-100">
          {transactions.slice(0, 5).map((tx) => {
            const isBonus = tx.type === 'bonus';
            const isEarned = tx.type === 'earned';
            const isSpent = tx.type === 'spent' || tx.type === 'purchase';
            const isPositive = isBonus || isEarned || tx.amount > 0;
            
            // Icon selection
            const TransactionIcon = isBonus ? Gift : isEarned ? Coins : isSpent ? ShoppingBag : Wallet;
            const iconColor = isBonus ? 'text-orange-600' : isEarned ? 'text-green-600' : isSpent ? 'text-blue-600' : 'text-gray-600';
            const iconBg = isBonus ? 'bg-orange-100' : isEarned ? 'bg-green-100' : isSpent ? 'bg-blue-100' : 'bg-gray-100';
            
            return (
              <div 
                key={tx.id} 
                className={`px-4 py-3 transition-colors ${
                  isBonus 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
                      <TransactionIcon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isBonus ? 'text-orange-900' : 'text-gray-900'
                      }`}>
                        {tx.description || tx.reason || 'Транзакція'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">
                          {new Date(tx.createdAt || tx.date || '').toLocaleDateString('uk-UA', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {isBonus && (
                          <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full font-semibold">
                            {translations.bonus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div className={`text-lg font-bold flex-shrink-0 ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? '+' : '-'}{Math.abs(tx.amount)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
