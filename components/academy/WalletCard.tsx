"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Coins, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Calendar, ChevronDown, Maximize2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import WalletModal from "./WalletModal";

interface Transaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  reason: string;
  date: string;
}

interface WalletCardProps {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactions?: Transaction[];
}

export default function WalletCard({ balance, totalEarned, totalSpent, transactions = [] }: WalletCardProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true); // Default open for better UX
  const [showModal, setShowModal] = useState(false);

  const getReasonText = (reason: string) => {
    const reasonKey = reason as keyof typeof t.academy.dashboard.wallet.reasons;
    return t.academy.dashboard.wallet.reasons[reasonKey] || reason;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden border-2 border-[#3BC864]/20">
        {/* Accordion Header - Always Visible */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
              <Coins className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[#1E1A41] flex items-center gap-2">
                {t.academy.dashboard.wallet.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {t.academy.dashboard.wallet.balance}: <span className="font-bold text-amber-600">{balance.toLocaleString()} CT</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Expand Modal Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="p-2 hover:bg-[#3BC864]/10 rounded-lg transition-colors group"
              title="Розгорнути повний гаманець"
            >
              <Maximize2 className="w-5 h-5 text-[#3BC864] group-hover:scale-110 transition-transform" />
            </button>
            
            {/* Accordion Toggle */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="w-6 h-6 text-[#3BC864]" />
            </motion.div>
          </div>
        </div>

      {/* Accordion Content - Expandable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-8 border-t border-gray-200">
              {/* Balance Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-8">
                {/* Current Balance - Large Card */}
                <motion.div 
                  className="md:col-span-1 bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium opacity-90">{t.academy.dashboard.wallet.balance}</p>
                    <Coins className="w-6 h-6 opacity-80" />
                  </div>
                  <p className="text-5xl font-bold mb-1">{balance.toLocaleString()}</p>
                  <p className="text-xs opacity-75">ChefTokens</p>
                </motion.div>

                {/* Total Earned */}
                <motion.div 
                  className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium opacity-90">{t.academy.dashboard.wallet.totalEarned}</p>
                    <TrendingUp className="w-5 h-5 opacity-80" />
                  </div>
                  <p className="text-3xl font-bold mb-1">+{totalEarned.toLocaleString()}</p>
                  <p className="text-xs opacity-75">ChefTokens</p>
                </motion.div>

                {/* Total Spent */}
                <motion.div 
                  className="bg-gradient-to-br from-red-400 to-rose-600 rounded-2xl p-6 text-white shadow-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium opacity-90">{t.academy.dashboard.wallet.totalSpent}</p>
                    <TrendingDown className="w-5 h-5 opacity-80" />
                  </div>
                  <p className="text-3xl font-bold mb-1">-{totalSpent.toLocaleString()}</p>
                  <p className="text-xs opacity-75">ChefTokens</p>
                </motion.div>
              </div>

              {/* Recent Transactions */}
              <div>
                <h3 className="text-xl font-bold text-[#1E1A41] mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#3BC864]" />
                  {t.academy.dashboard.wallet.recentTransactions}
                </h3>

                {transactions && transactions.length > 0 ? (
                  <div className="space-y-3">
                    {transactions.slice(0, 10).map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                          transaction.type === 'earned' 
                            ? 'bg-green-50 border-green-200 hover:border-green-300' 
                            : 'bg-red-50 border-red-200 hover:border-red-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'earned' ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {transaction.type === 'earned' ? (
                              <ArrowUpRight className="w-5 h-5 text-white" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1E1A41]">
                              {getReasonText(transaction.reason)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-xl font-bold ${
                            transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'earned' ? '+' : '-'}
                            {transaction.amount}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.type === 'earned' 
                              ? t.academy.dashboard.wallet.type.earned 
                              : t.academy.dashboard.wallet.type.spent
                            }
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                    <Coins className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">
                      {t.academy.dashboard.wallet.noTransactions}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {t.academy.dashboard.wallet.balance}: {balance} ChefTokens
                    </p>
                  </div>
                )}
              </div>

              {/* Info Note */}
              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <p className="text-sm text-blue-800">
                  {t.academy.dashboard.wallet.infoNote}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Wallet Modal */}
    <WalletModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      balance={balance}
      totalEarned={totalEarned}
      totalSpent={totalSpent}
      transactions={transactions}
    />
  </>
  );
}
