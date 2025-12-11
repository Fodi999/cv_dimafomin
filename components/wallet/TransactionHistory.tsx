"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Coins, 
  Filter, 
  Calendar,
  ChevronDown,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Transaction } from "@/lib/profile-types";
import { walletApi } from "@/lib/api";

interface TransactionHistoryProps {
  userId: string;
  limit?: number;
  showFilters?: boolean;
}

type TransactionType = 'all' | 'earned' | 'spent' | 'bonus' | 'purchase';

const TRANSACTION_TYPES: Array<{ value: TransactionType; label: string; color: string }> = [
  { value: 'all', label: 'Всі', color: 'gray' },
  { value: 'earned', label: 'Заробіток', color: 'green' },
  { value: 'spent', label: 'Витрати', color: 'red' },
  { value: 'bonus', label: 'Бонуси', color: 'blue' },
  { value: 'purchase', label: 'Покупки', color: 'purple' },
];

export function TransactionHistory({ 
  userId, 
  limit = 10, 
  showFilters = true 
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<TransactionType>('all');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const loadTransactions = async (reset = false) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const currentOffset = reset ? 0 : offset;
      
      const filters: any = {
        limit,
        offset: currentOffset,
      };
      
      if (selectedType !== 'all') {
        filters.type = selectedType;
      }

      const data = await walletApi.getTransactions(userId, token, filters);
      const newTransactions = (data as any)?.transactions || [];

      if (reset) {
        setTransactions(newTransactions);
        setOffset(limit);
      } else {
        setTransactions(prev => [...prev, ...newTransactions]);
        setOffset(prev => prev + limit);
      }

      setHasMore(newTransactions.length === limit);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions(true);
  }, [userId, selectedType]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadTransactions();
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
      case 'bonus':
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case 'spent':
      case 'purchase':
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      default:
        return <Coins className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
        return 'text-green-400';
      case 'spent':
        return 'text-red-400';
      case 'bonus':
        return 'text-blue-400';
      case 'purchase':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Щойно';
    if (diffInHours < 24) return `${diffInHours}год тому`;
    if (diffInHours < 48) return 'Вчора';
    
    return date.toLocaleDateString('uk-UA', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-tight">
          Історія транзакцій
        </h3>
        
        {showFilters && (
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-xs font-medium text-gray-300 transition-colors border border-gray-700/50"
            >
              <Filter className="w-3.5 h-3.5" />
              {TRANSACTION_TYPES.find(t => t.value === selectedType)?.label}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <AnimatePresence>
              {showFilterMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50"
                >
                  {TRANSACTION_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setSelectedType(type.value);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        selectedType === type.value
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="space-y-2">
        {loading && transactions.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <Coins className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-50" />
            <p className="text-gray-400 text-sm">Транзакцій не знайдено</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {transactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl p-3 bg-gray-800/30 hover:bg-gray-800/50 transition-all border border-gray-700/30 hover:border-gray-600/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Icon & Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2 rounded-lg bg-gray-700/50 flex-shrink-0">
                        {getTransactionIcon(tx.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {tx.description || tx.reason || 'Транзакція'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-400">
                            {formatDate(tx.date || tx.createdAt || new Date().toISOString())}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-400 capitalize">
                            {TRANSACTION_TYPES.find(t => t.value === tx.type)?.label || tx.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex-shrink-0 text-right">
                      <p className={`text-sm font-bold ${getTransactionColor(tx.type)}`}>
                        {tx.type === 'spent' || tx.type === 'purchase' ? '-' : '+'}
                        {tx.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">CT</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Load More Button */}
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="w-full py-2.5 mt-3 text-sm font-medium text-blue-300 hover:text-blue-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Завантаження...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Завантажити ще
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
