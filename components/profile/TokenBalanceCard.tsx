// TokenBalanceCard.tsx — картка балансу токенів з кнопками

import { Coins, RefreshCw, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TokenBalanceCardProps {
  balance: number;
  loading: boolean;
  retryCount: number;
  transactionsCount: number;
  translations: Record<string, string>;
  onEarnClick: () => void;
  onBuyClick: () => void;
  onRefreshClick: () => void;
}

export function TokenBalanceCard({
  balance,
  loading,
  retryCount,
  transactionsCount,
  translations,
  onEarnClick,
  onBuyClick,
  onRefreshClick,
}: TokenBalanceCardProps) {
  const isEmpty = balance === 0 && transactionsCount === 0 && !loading;
  const isRetrying = retryCount > 0 && retryCount < 2;
  const hasMaxRetries = retryCount >= 2 && balance === 0;

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200 shadow-sm">
        {/* Balance display */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">{translations.tokenBalance}</p>
              <p className="text-xl font-bold text-gray-900">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  balance
                )}
                <span className="text-xs text-gray-500 ml-1 font-normal">{translations.tokens}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={onEarnClick}
            size="sm"
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-sm h-8"
          >
            {translations.earn}
          </Button>
          <Button
            onClick={onBuyClick}
            size="sm"
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-sm h-8"
          >
            {translations.buy}
          </Button>
          <Button
            onClick={onRefreshClick}
            size="sm"
            variant="outline"
            className="px-2 h-8"
            title={translations.refresh}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
