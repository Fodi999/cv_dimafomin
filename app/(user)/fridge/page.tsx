"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Refrigerator, Loader2, AlertCircle, CheckCircle2, Plus, ArrowLeft } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotificationRefetch } from "@/contexts/NotificationRefetchContext";
import { fridgeApi } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import FridgeForm from "@/components/fridge/FridgeForm";
import FridgeList from "@/components/fridge/FridgeList";
import FridgeStats from "@/components/fridge/FridgeStats";
import PriceSheet from "@/components/fridge/PriceSheet";
import QuantitySheet from "@/components/fridge/QuantitySheet";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { FridgeItem, AddFridgeItemData, FridgeItemsResponse } from "@/lib/types";
import { ACTIVE_STATUSES } from "@/lib/types";

export default function FridgePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlightItemId = searchParams.get('highlight'); // 🆕 Get highlighted item from URL
  const { user, isLoading } = useUser();
  const { openAuthModal } = useAuth();
  const { t } = useLanguage();
  const { triggerRefetch } = useNotificationRefetch(); // 🆕 For notification updates
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showFlowCTA, setShowFlowCTA] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPriceSheetOpen, setIsPriceSheetOpen] = useState(false);
  const [priceSheetItem, setPriceSheetItem] = useState<FridgeItem | null>(null);
  const [isQuantitySheetOpen, setIsQuantitySheetOpen] = useState(false);
  const [quantitySheetItem, setQuantitySheetItem] = useState<FridgeItem | null>(null);

  // 🔥 Фильтрация: разделяем active (fresh/ok/warning/critical) vs expired
  const activeItems = items.filter((i) => ACTIVE_STATUSES.includes(i.status));
  // ❌ expiredItems УДАЛЕНЫ - источник истины только /api/history/losses

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      openAuthModal("login");
      return;
    }
    loadFridgeItems();
  }, [user, isLoading, openAuthModal]);

  const loadFridgeItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        openAuthModal("login");
        return;
      }
      console.log('[FridgePage] 📡 Calling fridgeApi.getItems...');
      const response = await fridgeApi.getItems(token) as FridgeItemsResponse;
      console.log('[FridgePage] 📦 Response from getItems:', response);
      console.log('[FridgePage] 📦 Response.items:', response?.items);
      console.log('[FridgePage] 📦 Setting items state with:', response.items || []);
      setItems(response.items || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t?.fridge?.messages?.error || "Error loading products";
      console.error("Failed to load fridge items:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (data: AddFridgeItemData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      openAuthModal("login");
      return;
    }
    try {
      await fridgeApi.addItem(data, token);
      await loadFridgeItems();
      setIsSheetOpen(false);
      
      // 🆕 ШАГ 2: Refetch notifications after adding item
      triggerRefetch();
      
      setSuccessMessage(t?.fridge?.messages?.addSuccess || "✅ Product added to fridge!");
      setShowFlowCTA(true);
      setTimeout(() => {
        setSuccessMessage(null);
        setShowFlowCTA(false);
      }, 8000);
    } catch (err: unknown) {
      throw err;
    }
  };

  const handleRemoveItem = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      openAuthModal("login");
      return;
    }
    try {
      await fridgeApi.deleteItem(id, token);
      // 🔥 Перезагружаем данные с сервера для консистентности
      // (важно для будущего soft-delete / auto-move to history)
      await loadFridgeItems();
      
      // 🆕 ШАГ 2: Refetch notifications after deleting item
      triggerRefetch();
      
      setSuccessMessage(t?.fridge?.messages?.deleteSuccess || "✅ Product deleted!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t?.fridge?.messages?.deleteError || "Error deleting product";
      console.error("Failed to delete item:", err);
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUpdatePrice = async (itemId: string, pricePerUnit: number, currency: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      openAuthModal("login");
      return;
    }
    try {
      await fridgeApi.addPrice(itemId, { 
        pricePerUnit, 
        currency,
        source: 'manual'
      }, token);
      await loadFridgeItems();
      setIsPriceSheetOpen(false);
      setPriceSheetItem(null);
      setSuccessMessage(t?.fridge?.messages?.priceUpdated || "✅ Price updated!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t?.fridge?.messages?.priceError || "Error updating price";
      console.error("Failed to update price:", err);
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handlePriceClick = (item: FridgeItem) => {
    setPriceSheetItem(item);
    setIsPriceSheetOpen(true);
  };

  const handleQuantityClick = (item: FridgeItem) => {
    setQuantitySheetItem(item);
    setIsQuantitySheetOpen(true);
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      openAuthModal("login");
      return;
    }
    try {
      await fridgeApi.updateItemQuantity(itemId, { quantity }, token);
      await loadFridgeItems();
      setIsQuantitySheetOpen(false);
      setQuantitySheetItem(null);
      setSuccessMessage(t?.fridge?.messages?.quantityUpdated || "✅ Quantity updated!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t?.fridge?.messages?.quantityError || "Error updating quantity";
      console.error("Failed to update quantity:", err);
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-safe">
      {/* Clean Header - минимализм */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">{t?.fridge?.backButton || "Back"}</span>
          </button>
          <div className="flex items-center gap-2.5">
            <Refrigerator className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{t?.fridge?.title || "Fridge"}</h1>
          </div>
          <div className="w-16 sm:w-20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {isLoading && (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-sky-500 animate-spin" />
          </div>
        )}

        {!isLoading && !user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8 sm:py-12 px-4">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{t?.fridge?.messages?.authRequired || "Authorization required"}</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">{t?.fridge?.messages?.authRequiredDesc || "Log in to manage your fridge"}</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openAuthModal("login")} className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm sm:text-base font-medium">{t?.fridge?.messages?.loginButton || "Log in"}</motion.button>
          </motion.div>
        )}

        {!isLoading && user && (
          <>
            <AnimatePresence>
              {successMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <p className="text-sm sm:text-base text-green-700 dark:text-green-300">{successMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 🔥 FLOW CTAs - Co dalej? - Mobile optimized */}
            <AnimatePresence>
              {showFlowCTA && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 border border-sky-200 dark:border-sky-800 rounded-xl"
                >
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {t?.fridge?.flow?.whatNext || "What now? 🎯"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => router.push("/recipes")}
                      className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
                    >
                      <span className="text-xl sm:text-2xl">🍳</span>
                      <span>{t?.fridge?.flow?.checkRecipes || "Check what you can cook"}</span>
                    </button>
                    <button
                      onClick={() => router.push("/assistant")}
                      className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
                    >
                      <span className="text-xl sm:text-2xl">🤖</span>
                      <span>{t?.fridge?.flow?.askAI || "Ask AI what to do"}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* 📊 Statistics - ТОЛЬКО activeItems (без expired) */}
                {activeItems.length > 0 && <FridgeStats items={activeItems} />}

                {/* 
                  ❌ УДАЛЁН БЛОК "Zutylizowane produkty" 
                  📌 Причина: Локальный expiredItems != backend history
                  ✅ Источник истины: ТОЛЬКО /losses (GET /api/history/losses)
                */}

                {/* ➕ Dodaj produkt button - Mobile optimized */}
                <div className="mb-4 sm:mb-6">
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-sm sm:text-base font-medium rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        {t?.fridge?.actions?.addProduct || "Add product"}
                      </motion.button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
                      <SheetHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
                        <SheetTitle className="text-base sm:text-lg">{t?.fridge?.form?.addToFridgeTitle || "Add product to fridge"}</SheetTitle>
                        <SheetDescription className="text-sm">
                          {t?.fridge?.form?.addToFridgeDesc || "Search for a product and enter quantity. Backend will automatically calculate expiry date."}
                        </SheetDescription>
                      </SheetHeader>
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <FridgeForm onAdd={handleAddItem} token={localStorage.getItem("token") || ""} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* 📋 Lista produktów */}
                <FridgeList 
                  items={activeItems} 
                  onDelete={handleRemoveItem} 
                  onPriceClick={handlePriceClick}
                  onQuantityClick={handleQuantityClick}
                  highlightId={highlightItemId || undefined} // 🆕 Pass highlighted item ID
                />
                
                {/* 💰 Price Sheet */}
                <Sheet open={isPriceSheetOpen} onOpenChange={setIsPriceSheetOpen}>
                  <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
                    <SheetHeader className="px-6 pt-6 pb-4">
                      <SheetTitle>{t?.fridge?.form?.updatePriceTitle || "Add product price"}</SheetTitle>
                      <SheetDescription>
                        {t?.fridge?.form?.updatePriceDesc || "Enter price per selected unit. System will automatically calculate total value."}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="px-6 pb-6">
                      {priceSheetItem && (
                        <PriceSheet item={priceSheetItem} onSave={handleUpdatePrice} />
                      )}
                    </div>
                  </SheetContent>
                </Sheet>

                {/* ⚖️ Quantity Sheet */}
                <Sheet open={isQuantitySheetOpen} onOpenChange={setIsQuantitySheetOpen}>
                  <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
                    <SheetHeader className="px-6 pt-6 pb-4">
                      <SheetTitle>{t?.fridge?.form?.updateQuantityTitle || "Change product quantity"}</SheetTitle>
                      <SheetDescription>
                        {t?.fridge?.form?.updateQuantityDesc || "Update product quantity. Total price will be recalculated automatically."}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="px-6 pb-6">
                      {quantitySheetItem && (
                        <QuantitySheet item={quantitySheetItem} onSave={handleUpdateQuantity} />
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
                
                {/* 💡 Wskazówka */}
                {activeItems.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/30 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-sky-900 dark:text-sky-100">{t?.fridge?.warnings?.hint || "Hint: Products with short expiry dates will be marked with a warning — AI will suggest what to cook first."}</p>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
