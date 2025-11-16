"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface SendTokensSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance?: number;
  onSend?: (recipientId: string, amount: number) => Promise<void>;
}

export function SendTokensSheet({
  isOpen,
  onClose,
  currentBalance = 5000,
  onSend,
}: SendTokensSheetProps) {
  const [recipientId, setRecipientId] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSend = async () => {
    if (!recipientId.trim()) {
      setStatus("error");
      setErrorMessage("Укажите ID получателя");
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      setStatus("error");
      setErrorMessage("Укажите корректное количество токенов");
      return;
    }

    const numAmount = Number(amount);
    if (numAmount > currentBalance) {
      setStatus("error");
      setErrorMessage("Недостаточно токенов на балансе");
      return;
    }

    setIsLoading(true);
    try {
      await onSend?.(recipientId, numAmount);
      setStatus("success");
      setRecipientId("");
      setAmount("");

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 2000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Ошибка при отправке");
    } finally {
      setIsLoading(false);
    }
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
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white dark:bg-neutral-950 z-50 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                📤 Отправить токены
              </h2>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Current Balance */}
              <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 rounded-lg p-4 border border-sky-200 dark:border-sky-900">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Ваш баланс
                </p>
                <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                  {currentBalance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  ChefTokens доступны
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Recipient ID Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    ID получателя
                  </label>
                  <input
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    placeholder="Введите ID пользователя"
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Уникальный идентификатор пользователя
                  </p>
                </div>

                {/* Amount Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Количество токенов
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Максимум: {currentBalance.toLocaleString()}
                  </p>
                </div>

                {/* Quick amount buttons */}
                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Быстрый выбор
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 500, 1000, 5000].map((value) => (
                      <motion.button
                        key={value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setAmount(Math.min(value, currentBalance).toString())}
                        disabled={isLoading || value > currentBalance}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                          value > currentBalance
                            ? "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                            : "bg-sky-100 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50"
                        }`}
                      >
                        {value}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                      Ошибка
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                      {errorMessage}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Success Message */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                      Успешно отправлено!
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                      {amount} токенов отправлено пользователю
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Info Section */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Информация
                </h3>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">✓</span>
                    <span>Переводы выполняются мгновенно</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">✓</span>
                    <span>Комиссия не взимается</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">✓</span>
                    <span>История переводов сохраняется</span>
                  </div>
                </div>
              </div>

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSend}
                disabled={isLoading || !recipientId.trim() || !amount}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold hover:from-sky-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Отправить
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
