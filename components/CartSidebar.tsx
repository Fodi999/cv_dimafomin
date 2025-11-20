"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, Coins, ArrowLeft, Check, User, Mail, Phone, MapPin, AlertCircle, MessageCircle, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user, deductTokens } = useUser();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [viewState, setViewState] = useState<"cart" | "checkout" | "success">("cart");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    telegram: "",
    address: "",
    notes: "",
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Reset state when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setViewState("cart");
      setError("");
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Auto-fill form with user data when switching to checkout
  useEffect(() => {
    if (user && viewState === "checkout") {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        telegram: user.telegram || "",
        address: user.location || "",
        notes: "",
      });
    }
  }, [user, viewState]);

  const handleCheckout = () => {
    setViewState("checkout");
  };

  const handleBack = () => {
    setViewState("cart");
    setError("");
  };

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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success!
      setViewState("success");
      
      // Clear cart and close after delay
      setTimeout(() => {
        clearCart();
        setViewState("cart");
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Помилка при оформленні замовлення");
      setIsProcessing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[450px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-l border-gray-700/50 p-0 overflow-hidden"
      >
        {/* Header */}
        <SheetHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-1.5 sm:gap-2 text-white text-lg sm:text-xl font-bold">
              {viewState === "checkout" && (
                <button
                  onClick={handleBack}
                  className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors mr-0.5 sm:mr-1"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </button>
              )}
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              {viewState === "cart" && "Кошик"}
              {viewState === "checkout" && "Оформлення"}
              {viewState === "success" && "Готово!"}
              {viewState === "cart" && cartItems.length > 0 && (
                <span className="ml-1 sm:ml-2 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm font-semibold border border-blue-500/30">
                  {cartItems.length}
                </span>
              )}
            </SheetTitle>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </SheetHeader>

        {/* Content based on state */}
        <div className="flex flex-col h-[calc(100vh-80px)]">
          <AnimatePresence mode="wait">
            {/* CART VIEW */}
            {viewState === "cart" && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 scrollbar-hide">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 opacity-20 text-gray-500" />
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">Кошик порожній</h3>
                        <p className="text-gray-400 text-xs sm:text-sm max-w-xs px-4">
                          Додайте рецепти з Ринку, щоб розпочати покупки
                        </p>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      <AnimatePresence mode="popLayout">
                        {cartItems.map((item, idx) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className="relative rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/50 hover:border-blue-500/50 transition-all bg-gray-800/30 hover:bg-gray-800/50 group"
                          >
                            {/* Delete Button */}
                            <AnimatePresence>
                              {hoveredItem === item.id && (
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  onClick={() => removeFromCart(item.id)}
                                  className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 p-1.5 sm:p-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors z-10 shadow-lg"
                                >
                                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                </motion.button>
                              )}
                            </AnimatePresence>

                            <div className="flex gap-2 sm:gap-3">
                              {/* Image */}
                              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white text-xs sm:text-sm line-clamp-2 mb-1 pr-6 sm:pr-8">
                                  {item.title}
                                </h4>
                                <p className="text-xs text-gray-400 line-clamp-1 mb-1.5 sm:mb-2">
                                  {item.description}
                                </p>

                                {/* Meta */}
                                <div className="flex items-center justify-between gap-1 sm:gap-2">
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    <div className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                      <span className="hidden sm:inline">{item.difficulty}</span>
                                      <span className="sm:hidden text-[10px]">{item.difficulty.slice(0, 3)}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-0.5 sm:gap-1">
                                    <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                                    <span className="text-sm sm:text-base font-bold text-blue-300">
                                      {item.price}
                                    </span>
                                  </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center justify-between mt-2 sm:mt-3">
                                  <span className="text-xs text-gray-400">Кількість:</span>
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(item.id, item.quantity - 1);
                                      }}
                                      className="p-1 sm:p-1.5 bg-gray-700/50 hover:bg-gray-700 rounded transition-colors"
                                    >
                                      <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                                    </button>
                                    <span className="text-white font-bold text-sm sm:text-base min-w-[20px] sm:min-w-[24px] text-center">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(item.id, item.quantity + 1);
                                      }}
                                      className="p-1 sm:p-1.5 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                                    >
                                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Footer - Checkout Section */}
                {cartItems.length > 0 && (
                  <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="border-t border-gray-700/50 bg-gray-800/80 backdrop-blur-sm px-3 sm:px-6 py-3 sm:py-4"
                  >
                    {/* Summary */}
                    <div className="mb-3 sm:mb-4 space-y-1.5 sm:space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-400">Позицій:</span>
                        <span className="text-white font-semibold">{cartItems.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-gray-400">Всього товарів:</span>
                        <span className="text-white font-semibold">{totalItems}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-gray-700/50">
                        <span className="text-base sm:text-lg font-bold text-white">До сплати:</span>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                          <span className="text-xl sm:text-2xl font-bold text-blue-300">{totalPrice}</span>
                          <span className="text-xs sm:text-sm text-gray-400">CT</span>
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCheckout}
                        className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg sm:rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                      >
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        Оформити замовлення
                      </motion.button>
                      
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => window.location.href = '/market'}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all text-xs sm:text-sm"
                        >
                          Продовжити
                        </motion.button>
                        
                        {cartItems.length > 1 && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (confirm('Очистити весь кошик?')) {
                                clearCart();
                              }
                            }}
                            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold rounded-lg transition-all border border-red-500/30"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* CHECKOUT FORM VIEW */}
            {viewState === "checkout" && (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  {/* Form Fields - Scrollable */}
                  <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 scrollbar-hide">
                    {/* Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Ім'я *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          placeholder="Ваше ім'я"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Телефон
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          placeholder="+380..."
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Адреса доставки *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          placeholder="Місто, вулиця, будинок, квартира"
                        />
                      </div>
                    </div>

                    {/* Telegram */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Telegram
                      </label>
                      <div className="relative">
                        <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="text"
                          name="telegram"
                          value={formData.telegram}
                          onChange={handleChange}
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          placeholder="@username"
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                        Примітки (необов'язково)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                        placeholder="Додаткова інформація..."
                      />
                    </div>

                    {/* Order Summary */}
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg sm:rounded-xl border border-blue-500/30">
                      <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">Підсумок</h3>
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Позицій:</span>
                          <span className="text-white font-semibold">{cartItems.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Всього товарів:</span>
                          <span className="text-white font-semibold">{totalItems}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Баланс:</span>
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                            <span className="text-green-300 font-semibold">
                              {user?.chefTokens || 0} CT
                            </span>
                          </div>
                        </div>
                        <div className="pt-1.5 sm:pt-2 border-t border-gray-700/50 flex items-center justify-between">
                          <span className="font-bold text-white">До сплати:</span>
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                            <span className="text-lg sm:text-xl font-bold text-blue-300">{totalPrice}</span>
                            <span className="text-gray-400 text-xs">CT</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-2.5 sm:p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-300 text-xs sm:text-sm">{error}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Footer - Submit Button */}
                  <div className="border-t border-gray-700/50 bg-gray-800/80 backdrop-blur-sm px-3 sm:px-6 py-3 sm:py-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg sm:rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                    >
                      {isProcessing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Обробка...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          Підтвердити
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* SUCCESS VIEW */}
            {viewState === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center h-full px-4 sm:px-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
                  >
                    <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                    Замовлення оформлено!
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4 px-4">
                    Дякуємо за покупку! Рецепти додано до вашого профілю.
                  </p>
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                    <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                    <span className="text-green-300 font-semibold text-sm sm:text-base">
                      Списано: {totalPrice} CT
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
