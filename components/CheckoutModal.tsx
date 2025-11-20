"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, MapPin, CreditCard, Check, AlertCircle, Coins } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, deductTokens } = useUser();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    telegram: "",
    notes: "",
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState("");

  // Auto-fill form with user data
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        telegram: user.telegram || "",
        notes: "",
      });
    }
  }, [user, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    try {
      // Validate user has enough tokens
      const userBalance = user?.chefTokens || 0;
      if (userBalance < totalPrice) {
        setError(`Недостатньо токенів. У вас: ${userBalance} CT, потрібно: ${totalPrice} CT`);
        setIsProcessing(false);
        return;
      }

      // Deduct tokens
      const result = await deductTokens(
        totalPrice,
        `Покупка рецептів: ${cartItems.map(item => item.title).join(", ")}`
      );

      if (!result.success) {
        setError(result.error || "Помилка списання токенів");
        setIsProcessing(false);
        return;
      }

      // Simulate API call for order creation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success!
      setOrderComplete(true);
      
      // Clear cart after 2 seconds and close modal
      setTimeout(() => {
        clearCart();
        setOrderComplete(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Помилка при оформленні замовлення");
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-20 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="relative w-full max-w-2xl my-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 flex flex-col"
          >
            {orderComplete ? (
              // Success State
              <div className="p-8 sm:p-12 text-center flex items-center justify-center min-h-[400px]">
                <div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Замовлення оформлено!
                  </h2>
                  <p className="text-gray-300 text-lg mb-4">
                    Дякуємо за покупку! Рецепти додано до вашого профілю.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                    <Coins className="w-5 h-5 text-green-300" />
                    <span className="text-green-300 font-semibold">
                      Списано: {totalPrice} CT
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="sticky top-0 z-10 px-6 py-4 border-b border-gray-700/50 bg-gray-800/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      Оформлення замовлення
                    </h2>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto max-h-[calc(90vh-80px)]">
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* User Info Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-400" />
                      Контактні дані
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Ім'я *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            placeholder="Ваше ім'я"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Телефон
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            placeholder="+380..."
                          />
                        </div>
                      </div>

                      {/* Telegram */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Telegram
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="telegram"
                            value={formData.telegram}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            placeholder="@username"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Примітки (необов'язково)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                      placeholder="Додаткова інформація..."
                    />
                  </div>

                  {/* Order Summary */}
                  <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/30">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                      Підсумок замовлення
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Товарів:</span>
                        <span className="text-white font-semibold">{cartItems.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Ваш баланс:</span>
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 font-semibold">
                            {user?.chefTokens || 0} CT
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-700/50 flex items-center justify-between">
                        <span className="text-lg font-bold text-white">До сплати:</span>
                        <div className="flex items-center gap-2">
                          <Coins className="w-6 h-6 text-blue-400" />
                          <span className="text-2xl font-bold text-blue-300">{totalPrice}</span>
                          <span className="text-gray-400">CT</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all"
                    >
                      Скасувати
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Обробка...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Підтвердити замовлення
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
  );
}
