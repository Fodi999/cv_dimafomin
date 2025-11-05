"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Coins, ArrowUpRight, ArrowDownRight, ShoppingCart, GraduationCap, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  reason: string;
  date: string;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactions?: Transaction[];
}

export default function WalletModal({ 
  isOpen, 
  onClose, 
  balance, 
  totalEarned, 
  totalSpent, 
  transactions = [] 
}: WalletModalProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

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

  const tokenPackages = [
    { amount: 100, price: 49, popular: false },
    { amount: 200, price: 89, popular: true },
    { amount: 500, price: 199, popular: false },
  ];

  const handlePurchase = (amount: number) => {
    setSelectedPackage(amount);
    // TODO: Integrate with payment system
    console.log(`Purchasing ${amount} ChefTokens`);
  };

  const handleEarnTokens = () => {
    onClose();
    router.push("/academy/earn-tokens");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 p-6 text-white relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Coins className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-1">
                      {t.academy.dashboard.wallet.title}
                    </h2>
                    <p className="text-white/90 text-sm">
                      {t.academy.dashboard.wallet.balance}: <span className="font-bold text-2xl">{balance.toLocaleString()}</span> ChefTokens
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Info Message */}
                <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg">
                  <p className="text-blue-900 font-medium flex items-start gap-2">
                    <span className="text-2xl">🎁</span>
                    <span>
                      {balance === 0 ? (
                        t.academy.dashboard.wallet.modal?.emptyMessage || 
                        "У вас 0 ChefTokens. Ви можете купити токени для доступу до нових курсів або отримати їх, завершивши завдання Академії."
                      ) : (
                        t.academy.dashboard.wallet.modal?.hasTokensMessage || 
                        `У вас ${balance} ChefTokens. Продовжуйте навчання, щоб заробити більше токенів, або купіть додаткові для доступу до преміум курсів.`
                      )}
                    </span>
                  </p>
                </div>

                {/* Action Buttons */}
                {!showPurchaseForm ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Button
                      onClick={() => setShowPurchaseForm(true)}
                      className="h-auto py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {t.academy.dashboard.wallet.modal?.buyButton || "💰 Купити токени"}
                    </Button>
                    
                    <Button
                      onClick={handleEarnTokens}
                      variant="outline"
                      className="h-auto py-4 border-2 border-[#3BC864] text-[#3BC864] hover:bg-[#3BC864] hover:text-white font-semibold text-lg"
                    >
                      <GraduationCap className="w-5 h-5 mr-2" />
                      {t.academy.dashboard.wallet.modal?.earnButton || "🎓 Як отримати безкоштовно?"}
                    </Button>
                  </div>
                ) : (
                  /* Purchase Form */
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-[#1E1A41]">
                        {t.academy.dashboard.wallet.modal?.selectPackage || "Оберіть пакет токенів"}
                      </h3>
                      <button
                        onClick={() => setShowPurchaseForm(false)}
                        className="text-sm text-gray-500 hover:text-[#3BC864] transition-colors"
                      >
                        {t.academy.dashboard.wallet.modal?.back || "← Назад"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {tokenPackages.map((pkg) => (
                        <motion.div
                          key={pkg.amount}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handlePurchase(pkg.amount)}
                          className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                            pkg.popular
                              ? 'border-[#3BC864] bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                              : 'border-gray-200 hover:border-[#3BC864] bg-white'
                          }`}
                        >
                          {pkg.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#3BC864] text-white text-xs font-bold rounded-full">
                              {t.academy.dashboard.wallet.modal?.popular || "ПОПУЛЯРНИЙ"}
                            </div>
                          )}
                          
                          <div className="text-center">
                            <div className="mb-2">
                              <Coins className="w-12 h-12 mx-auto text-amber-500" />
                            </div>
                            <p className="text-3xl font-bold text-[#1E1A41] mb-1">
                              {pkg.amount}
                            </p>
                            <p className="text-sm text-gray-500 mb-4">ChefTokens</p>
                            <div className="pt-4 border-t border-gray-200">
                              <p className="text-2xl font-bold text-[#3BC864] mb-1">
                                {pkg.price} PLN
                              </p>
                              <p className="text-xs text-gray-500">
                                {(pkg.price / pkg.amount).toFixed(2)} PLN / CT
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                      <p className="text-sm text-amber-900">
                        💳 <strong>{t.academy.dashboard.wallet.modal?.paymentInfo || "Оплата:"}</strong> 
                        {" "}{t.academy.dashboard.wallet.modal?.paymentMethods || "Картка, BLIK, PayPal, Google Pay"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <p className="text-sm text-green-700 mb-1 font-medium">
                      {t.academy.dashboard.wallet.totalEarned}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      +{totalEarned.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200">
                    <p className="text-sm text-red-700 mb-1 font-medium">
                      {t.academy.dashboard.wallet.totalSpent}
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      -{totalSpent.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Transaction History */}
                <div>
                  <h3 className="text-xl font-bold text-[#1E1A41] mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#3BC864]" />
                    {t.academy.dashboard.wallet.recentTransactions}
                  </h3>

                  {transactions && transactions.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            transaction.type === 'earned' 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'earned' ? 'bg-green-500' : 'bg-red-500'
                            }`}>
                              {transaction.type === 'earned' ? (
                                <ArrowUpRight className="w-4 h-4 text-white" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-[#1E1A41]">
                                {getReasonText(transaction.reason)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(transaction.date)}
                              </p>
                            </div>
                          </div>

                          <p className={`text-lg font-bold ${
                            transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'earned' ? '+' : '-'}
                            {transaction.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <Coins className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">
                        {t.academy.dashboard.wallet.noTransactions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
