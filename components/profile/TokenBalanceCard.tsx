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
    <div className="max-w-md mx-auto mb-6">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200 shadow-sm">
        {/* Empty wallet message */}
        {isEmpty && (
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-blue-800 font-medium mb-1">
                  {translations.startEarning}
                </p>
                <p className="text-xs text-blue-600">
                  {translations.startEarningDesc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Retry message */}
        {isRetrying && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-700 animate-spin" />
              <p className="text-xs text-blue-700">
                {translations.initializing} ({retryCount}/2)
              </p>
            </div>
          </div>
        )}

        {/* Max retries message */}
        {hasMaxRetries && (
          <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-700" />
              <p className="text-xs text-orange-700">
                {translations.walletAvailable}
              </p>
            </div>
          </div>
        )}

        {/* Balance display */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">{translations.tokenBalance}</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  balance
                )}
                <span className="text-sm text-gray-500 ml-1 font-normal">{translations.tokens}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={onEarnClick}
            size="sm"
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
          >
            {translations.earn}
          </Button>
          <Button
            onClick={onBuyClick}
            size="sm"
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-md"
          >
            {translations.buy}
          </Button>
          <Button
            onClick={onRefreshClick}
            size="sm"
            variant="outline"
            className="px-3"
            title={translations.refresh}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
