"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Loader2, AlertCircle, CheckCircle2, Plus } from "lucide-react";
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
import { syncWarehouseToLosses } from "@/lib/utils/warehouse-sync";

/**
 * 🔐 ADMIN INGREDIENTS - ChefOS Architecture 2026
 * 
 * Склад (Warehouse) - управление складскими запасами
 * Управление ингредиентами на складе: количество, цены, сроки годности
 */
export default function AdminIngredientsPage() {
  const { session } = useSession();
  const { openAuthModal } = useAuth();
  const { t, language } = useLanguage();
  const { triggerRefetch } = useNotificationRefetch();

  useEffect(() => {
    console.log('[AdminIngredientsPage] 📦 Page loaded: /admin/ingredients');
    console.log('[AdminIngredientsPage] ✅ Rendering FridgeList (Warehouse)');
  }, []);
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPriceSheetOpen, setIsPriceSheetOpen] = useState(false);
  const [priceSheetItem, setPriceSheetItem] = useState<FridgeItem | null>(null);
  const [isQuantitySheetOpen, setIsQuantitySheetOpen] = useState(false);
  const [quantitySheetItem, setQuantitySheetItem] = useState<FridgeItem | null>(null);

  // 🔥 ФРОНТЕНД-СИНХРОНИЗАЦИЯ: Фильтруем EXPIRED продукты
  // EXPIRED продукты автоматически переносятся в списания
  const navLanguage = language === "ru" ? "ru" : language === "pl" ? "pl" : "en";
  const { activeWarehouseItems, expiredLosses } = syncWarehouseToLosses(items, navLanguage);
  const activeItems = activeWarehouseItems;
  
  // Логируем синхронизацию для отладки
  if (expiredLosses.length > 0) {
    console.log(`[AdminIngredients] 🔄 ${expiredLosses.length} EXPIRED items synced to Losses:`, expiredLosses.map(l => l.productName));
  }

  useEffect(() => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('[AdminIngredientsPage] 📦 PAGE: Warehouse (Fridge)');
    console.log('[AdminIngredientsPage] 🔗 Pathname: /admin/ingredients');
    console.log('[AdminIngredientsPage] ✅ Rendering FridgeList (Warehouse)');
    console.log('[AdminIngredientsPage] 🎯 This is NOT the Products Catalog!');
    console.log('═══════════════════════════════════════════════════════');
    
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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Package className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            Склад (Холодильник)
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            РЕАЛЬНАЯ ЖИЗНЬ — Управление складскими запасами: количество, цены, сроки годности
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
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
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
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  {t?.fridge?.actions?.addProduct || "Добавить на склад"}
                </motion.button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
                <SheetHeader className="px-6 pt-6 pb-4">
                  <SheetTitle>{t?.fridge?.form?.addToFridgeTitle || "Добавить на склад"}</SheetTitle>
                  <SheetDescription>
                    {t?.fridge?.form?.addToFridgeDesc || "Найти продукт и указать количество."}
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
                <SheetTitle>{t?.fridge?.form?.updatePriceTitle || "Обновить цену"}</SheetTitle>
                <SheetDescription>
                  {t?.fridge?.form?.updatePriceDesc || "Указать цену за единицу."}
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
                <SheetTitle>{t?.fridge?.form?.updateQuantityTitle || "Обновить количество"}</SheetTitle>
                <SheetDescription>
                  {t?.fridge?.form?.updateQuantityDesc || "Изменить количество ингредиента."}
                </SheetDescription>
              </SheetHeader>
              <div className="px-6 pb-6">
                {quantitySheetItem && (
                  <QuantitySheet item={quantitySheetItem} onSave={handleUpdateQuantity} />
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          {/* 💡 Hint - Информация о синхронизации */}
          {activeItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.3 }} 
              className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg flex gap-3"
            >
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Автоматическая синхронизация со списаниями
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Продукты с коротким сроком годности (≤2 дня) отмечены жёлтым badge. При истечении срока они автоматически переносятся в раздел "Списания". AI предложит рецепты для использования продуктов до истечения срока.
                </p>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
