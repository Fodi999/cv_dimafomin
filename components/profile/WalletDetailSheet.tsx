"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowDownLeft, ArrowUpRight, Clock, Wallet, Send, ShoppingCart, Star, Shield, RefreshCcw, Sparkles } from "lucide-react";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { useUser } from "@/contexts/UserContext";

interface WalletDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  earned: number;
  spent: number;
  pending: number;
  onPurchaseClick?: () => void;
}

type TabType = "details" | "send" | "buy";

export function WalletDetailSheet({
  isOpen,
  onClose,
  balance,
  earned,
  spent,
  pending,
  onPurchaseClick,
}: WalletDetailSheetProps) {
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [sendAmount, setSendAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("1000");
  const { user } = useUser();

  const packages = [
    { id: "500", tokens: 500, price: "4.99", popular: false },
    { id: "1000", tokens: 1000, price: "8.99", popular: true },
    { id: "5000", tokens: 5000, price: "39.99", popular: false },
    { id: "10000", tokens: 10000, price: "69.99", popular: false },
  ];

  const handleSendTokens = async () => {
    console.log("Sending", sendAmount, "to", recipientEmail);
    // TODO: Implement API call
  };

  const handleBuyTokens = async () => {
    console.log("Buying package:", selectedPackage);
    onPurchaseClick?.();
  };

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
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />

          {/* Sliding Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-full max-w-md bg-gray-950 z-50 shadow-2xl overflow-y-auto border-l border-gray-800"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/20 border border-violet-400/40">
                  <Wallet className="w-5 h-5 text-violet-300" />
                </div>
                <h2 className="text-xl font-bold text-white">Кошелек</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="sticky top-16 bg-gray-950 border-b border-gray-800 px-6 pt-3 pb-3 z-10">
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setActiveTab("details")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all ${
                    activeTab === "details"
                      ? "bg-violet-600 text-white"
                      : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  Деталі
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab("send")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1 ${
                    activeTab === "send"
                      ? "bg-violet-600 text-white"
                      : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> Поділитися
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab("buy")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1 ${
                    activeTab === "buy"
                      ? "bg-violet-600 text-white"
                      : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Купити
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pt-16 pb-20">
              <AnimatePresence mode="wait">
                {/* Tab: Details */}
                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Main Balance */}
                    <div className="rounded-2xl p-6 border border-violet-500/20 transition-all"
                         style={{
                           background: "rgba(139, 92, 246, 0.12)",
                           backdropFilter: 'blur(18px)',
                           boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                         }}>
                      <p className="text-xs text-gray-400 uppercase tracking-tight font-semibold mb-2">
                        Загальний баланс токенів
                      </p>
                      <p className="text-5xl font-bold text-white mb-6">
                        {balance.toLocaleString()}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTab("buy")}
                        className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl font-bold transition-all hover:shadow-lg"
                      >
                        Поповнити баланс
                      </motion.button>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-3 gap-3">
                      {/* Earned */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-xl p-3 border border-emerald-500/20 bg-emerald-500/5"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                          <p className="text-xs text-emerald-300 font-semibold">Заробили</p>
                        </div>
                        <p className="text-lg font-bold text-emerald-300">
                          +{earned.toLocaleString()}
                        </p>
                      </motion.div>

                      {/* Spent */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-xl p-3 border border-rose-500/20 bg-rose-500/5"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <ArrowUpRight className="w-4 h-4 text-rose-400" />
                          <p className="text-xs text-rose-300 font-semibold">Витратили</p>
                        </div>
                        <p className="text-lg font-bold text-rose-300">
                          -{spent.toLocaleString()}
                        </p>
                      </motion.div>

                      {/* Pending */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-xl p-3 border border-amber-500/20 bg-amber-500/5"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <p className="text-xs text-amber-300 font-semibold">Очікуючи</p>
                        </div>
                        <p className="text-lg font-bold text-amber-300">
                          {pending.toLocaleString()}
                        </p>
                      </motion.div>
                    </div>

                    {/* Transaction History Component */}
                    {user?.id && (
                      <TransactionHistory 
                        userId={user.id} 
                        limit={10}
                        showFilters={true}
                      />
                    )}

                    {/* Info */}
                    <div className="rounded-xl p-4 border border-gray-700/30 bg-gray-900/50">
                      <p className="text-xs text-gray-400 leading-relaxed">
                        💡 <strong>Підказка:</strong> Токены можна заробляти через завдання, конкурсы та рефералів. Вони не мають строку дії.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Tab: Send Tokens */}
                {activeTab === "send" && (
                  <motion.div
                    key="send"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="rounded-2xl p-6 border border-blue-500/20 transition-all"
                         style={{
                           background: "rgba(59, 130, 246, 0.12)",
                           backdropFilter: 'blur(18px)',
                         }}>
                      <h3 className="text-lg font-bold text-white mb-4">📤 Поділитися Токенами</h3>

                      {/* Recipient Email */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Email отримувача
                        </label>
                        <input
                          type="email"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          placeholder="user@example.com"
                          className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Amount */}
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Кількість токенів
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            placeholder="0"
                            className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                          />
                          <button className="px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 text-sm font-semibold hover:border-blue-500 hover:text-blue-400 transition-colors">
                            Макс
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Доступно: {balance.toLocaleString()} токенів
                        </p>
                      </div>

                      {/* Send Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendTokens}
                        disabled={!sendAmount || !recipientEmail}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4 inline mr-2" /> Відправити
                      </motion.button>

                      <p className="text-xs text-gray-400 mt-4 text-center">
                        🔒 Трансакція безопасна та обратима в течение 24 часов
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Tab: Buy Tokens */}
                {activeTab === "buy" && (
                  <motion.div
                    key="buy"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">🛍️ Купити ChefTokens</h3>

                      <div className="space-y-3">
                        {packages.map((pkg, idx) => (
                          <motion.button
                            key={pkg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setSelectedPackage(pkg.id)}
                            className={`w-full p-4 rounded-xl border-2 transition-all ${
                              selectedPackage === pkg.id
                                ? "border-violet-500 bg-violet-500/20"
                                : "border-gray-700 bg-gray-900/50 hover:border-violet-400/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-left">
                                <p className="text-lg font-bold text-white">
                                  {pkg.tokens.toLocaleString()} ChefTokens
                                </p>
                                {pkg.popular && (
                                  <span className="text-xs font-semibold text-emerald-400 mt-1 inline-flex items-center gap-1">
                                    <Star className="w-3 h-3" /> Популярно
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-violet-300">
                                  ${pkg.price}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      {/* Buy Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBuyTokens}
                        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl font-bold transition-all hover:shadow-lg"
                      >
                        <ShoppingCart className="w-4 h-4 inline mr-2" /> Купити
                      </motion.button>

                      {/* Info */}
                      <div className="mt-6 space-y-2 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-400" />
                          <p>Безопасна оплата через Stripe</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <RefreshCcw className="w-4 h-4 text-blue-400" />
                          <p>24-годинна гарантія повернення грошей</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-violet-400" />
                          <p>Токени ніколи не закінчуються</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
