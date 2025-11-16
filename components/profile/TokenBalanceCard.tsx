// TokenBalanceCard.tsx — картка балансу токенів з кнопками

import { Coins, RefreshCw, Sparkles, AlertCircle, TrendingUp, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { colors, composite, borderRadius, shadows } from "@/lib/design-tokens";

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
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${composite.card.container} ${composite.card.hover} p-6`}
      >
        {/* Balance display */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-16 h-16 ${borderRadius.full} ${colors.primary.light.gradient} flex items-center justify-center shadow-lg`}
            >
              <Coins className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <p className="text-sm text-gray-400 font-semibold uppercase tracking-wide">{translations.tokenBalance}</p>
              <p className="text-4xl font-bold text-white">
                {loading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <>
                    {balance}
                    <span className="text-lg text-gray-400 ml-2 font-normal">CT</span>
                  </>
                )}
              </p>
            </div>
          </div>
          
          {/* Status badge */}
          {loading && (
            <div className={`px-4 py-2 ${colors.primary.light.badge} rounded-lg flex items-center gap-2`}>
              <Sparkles className="w-4 h-4 text-sky-300 animate-spin" />
              <span className="text-xs font-semibold text-sky-300">Załadowanie</span>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-sky-400/20">
          <div className="text-center">
            <p className="text-2xl font-bold text-sky-300">+500</p>
            <p className="text-xs text-gray-400 mt-1">Zarobiono</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">-250</p>
            <p className="text-xs text-gray-400 mt-1">Wydano</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">+150</p>
            <p className="text-xs text-gray-400 mt-1">Oczekiwanie</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEarnClick}
            className={`flex items-center justify-center gap-2 px-4 py-3 ${borderRadius.lg} ${composite.buttonPrimary} text-sm`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Zarabiać</span>
            <span className="sm:hidden">Zar.</span>
          </motion.button>
          
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBuyClick}
            className={`flex items-center justify-center gap-2 px-4 py-3 ${borderRadius.lg} bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all`}
          >
            <Gift className="w-4 h-4" />
            <span className="hidden sm:inline">Kupić</span>
            <span className="sm:hidden">Kup</span>
          </motion.button>
          
          <motion.button
            whileHover={{ rotate: 180, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefreshClick}
            className={`flex items-center justify-center px-4 py-3 ${borderRadius.lg} bg-gray-800/80 hover:bg-gray-700/80 text-sky-300 font-bold shadow-lg hover:shadow-xl transition-all border border-sky-400/30`}
            title={translations.refresh}
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
