"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Refrigerator, Loader2, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNotificationRefetch } from "@/contexts/NotificationRefetchContext";
import { fridgeApi } from "@/lib/api";
import FridgeForm from "@/components/fridge/FridgeForm";
import FridgeList from "@/components/fridge/FridgeList";
import FridgeStats from "@/components/fridge/FridgeStats";
import PriceSheet from "@/components/fridge/PriceSheet";
import QuantitySheet from "@/components/fridge/QuantitySheet";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { FridgeItem, AddFridgeItemData, FridgeItemsResponse } from "@/lib/types";
import { ACTIVE_STATUSES } from "@/lib/types";

/**
 * 🔐 ADMIN INGREDIENTS - ChefOS Architecture 2026
 * 
 * Бывший Fridge → теперь Warehouse (Склад)
 * Управление ингредиентами для бизнеса
 */

export default function AdminIngredientsPage() {
  const { session } = useSession();
  const { openAuthModal } = useAuth();
  const { t } = useLanguage();
  const { triggerRefetch } = useNotificationRefetch();
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPriceSheetOpen, setIsPriceSheetOpen] = useState(false);
  const [priceSheetItem, setPriceSheetItem] = useState<FridgeItem | null>(null);
  const [isQuantitySheetOpen, setIsQuantitySheetOpen] = useState(false);
  const [quantitySheetItem, setQuantitySheetItem] = useState<FridgeItem | null>(null);

  const activeItems = items.filter((i) => ACTIVE_STATUSES.includes(i.status));

  useEffect(() => {
    if (!session) return;
    loadFridgeItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const loadFridgeItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        openAuthModal("login");
        return;
      }
      console.log('[AdminIngredients] 📡 Calling fridgeApi.getItems...');
      const response = await fridgeApi.getItems(token) as FridgeItemsResponse;
      console.log('[AdminIngredients] 📦 Response:', response);
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
      triggerRefetch();
      setSuccessMessage(t?.fridge?.messages?.addSuccess || "✅ Ingredient added!");
      setTimeout(() => setSuccessMessage(null), 3000);
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
      await loadFridgeItems();
      triggerRefetch();
      setSuccessMessage(t?.fridge?.messages?.deleteSuccess || "✅ Ingredient deleted!");
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* 🎨 Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Warehouse Ingredients
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your stock for recipes and products
          </p>
        </div>
      </div>

      {/* ✅ Success Messages */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ❌ Error Messages */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3"
          >
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
          {/* 📊 Statistics */}
          {activeItems.length > 0 && <FridgeStats items={activeItems} />}

          {/* ➕ Add Ingredient Button */}
          <div className="mb-6">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  {t?.fridge?.actions?.addProduct || "Add Ingredient"}
                </motion.button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
                <SheetHeader className="px-6 pt-6 pb-4">
                  <SheetTitle>{t?.fridge?.form?.addToFridgeTitle || "Add ingredient to warehouse"}</SheetTitle>
                  <SheetDescription>
                    {t?.fridge?.form?.addToFridgeDesc || "Search for a product and enter quantity."}
                  </SheetDescription>
                </SheetHeader>
                <div className="px-6 pb-6">
                  <FridgeForm onAdd={handleAddItem} token={localStorage.getItem("token") || ""} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* 📋 Ingredient List */}
          <FridgeList 
            items={activeItems} 
            onDelete={handleRemoveItem} 
            onPriceClick={handlePriceClick}
            onQuantityClick={handleQuantityClick}
          />
          
          {/* 💰 Price Sheet */}
          <Sheet open={isPriceSheetOpen} onOpenChange={setIsPriceSheetOpen}>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
              <SheetHeader className="px-6 pt-6 pb-4">
                <SheetTitle>{t?.fridge?.form?.updatePriceTitle || "Update price"}</SheetTitle>
                <SheetDescription>
                  {t?.fridge?.form?.updatePriceDesc || "Enter price per unit."}
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
                <SheetTitle>{t?.fridge?.form?.updateQuantityTitle || "Update quantity"}</SheetTitle>
                <SheetDescription>
                  {t?.fridge?.form?.updateQuantityDesc || "Change ingredient quantity."}
                </SheetDescription>
              </SheetHeader>
              <div className="px-6 pb-6">
                {quantitySheetItem && (
                  <QuantitySheet item={quantitySheetItem} onSave={handleUpdateQuantity} />
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          {/* 💡 Hint */}
          {activeItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="mt-8 p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/30 rounded-lg flex gap-3"
            >
              <AlertCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-sky-900 dark:text-sky-100">
                  {t?.fridge?.warnings?.hint || "Track your ingredient expiry dates and costs for better business management."}
                </p>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
