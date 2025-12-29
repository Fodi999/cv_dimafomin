"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Refrigerator, Loader2, AlertCircle, CheckCircle2, Plus, ArrowLeft, Trash2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { fridgeApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import FridgeForm from "@/components/fridge/FridgeForm";
import FridgeList from "@/components/fridge/FridgeList";
import FridgeStats from "@/components/fridge/FridgeStats";
import FridgeAIActions from "@/components/fridge/FridgeAIActions";
import PriceSheet from "@/components/fridge/PriceSheet";
import QuantitySheet from "@/components/fridge/QuantitySheet";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { FridgeItem, AddFridgeItemData, FridgeItemsResponse } from "@/lib/types";
import { ACTIVE_STATUSES } from "@/lib/types";

export default function FridgePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { openAuthModal } = useAuth();
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

  // 🔥 Фильтрация: разделяем active (ok/warning/critical) vs expired
  const activeItems = items.filter((i) => ACTIVE_STATUSES.includes(i.status));
  const expiredItems = items.filter((i) => i.status === "expired");
  const criticalItems = activeItems.filter((i) => i.status === "critical");

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
      const errorMessage = err instanceof Error ? err.message : "Błąd ładowania produktów";
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
      setSuccessMessage("✅ Produkt dodany do lodówki!");
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
      setSuccessMessage("✅ Produkt usunięty!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Błąd podczas usuwania produktu";
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
      setSuccessMessage("✅ Cena zaktualizowana!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Błąd podczas aktualizacji ceny";
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
      setSuccessMessage("✅ Ilość zaktualizowana!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Błąd podczas aktualizacji ilości";
      console.error("Failed to update quantity:", err);
      setError(errorMessage);
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Sticky Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Назад</span>
          </button>
          <div className="flex items-center gap-3">
            <Refrigerator className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Moja Lodówka</h1>
          </div>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        )}

        {!isLoading && !user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Wymagana autoryzacja</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Zaloguj się, aby zarządzać swoją lodówką</p>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openAuthModal("login")} className="px-8 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-medium">Zaloguj się</motion.button>
          </motion.div>
        )}

        {!isLoading && user && (
          <>
            <AnimatePresence>
              {successMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-green-700 dark:text-green-300">{successMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 🔥 FLOW CTAs - Co dalej? */}
            <AnimatePresence>
              {showFlowCTA && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-6 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 border border-sky-200 dark:border-sky-800 rounded-xl"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    Co teraz? 🎯
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <button
                      onClick={() => router.push("/recipes")}
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                    >
                      <span className="text-2xl">🍳</span>
                      <span>Sprawdź, co możesz ugotować</span>
                    </button>
                    <button
                      onClick={() => router.push("/assistant")}
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                    >
                      <span className="text-2xl">🤖</span>
                      <span>Zapytaj AI, co zrobić</span>
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

                {/* 🗑️ Блок просроченных продуктов (СВОДКА, не карточки) */}
                {expiredItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-800 dark:text-red-200">
                          🗑️ Zutylizowane produkty
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {expiredItems.length} {expiredItems.length === 1 ? 'produkt' : expiredItems.length >= 2 && expiredItems.length <= 4 ? 'produkty' : 'produktów'} • {expiredItems.reduce((s, i) => s + (i.totalPrice || 0), 0).toFixed(2)} PLN strat
                        </p>
                        <button
                          onClick={() => router.push("/losses")}
                          className="mt-2 text-sm font-medium text-red-700 dark:text-red-300 hover:underline"
                        >
                          Zobacz historię strat →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ✨ AI Actions - ТОЛЬКО если есть activeItems */}
                {activeItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <FridgeAIActions />
                  </motion.div>
                )}

                {/* ➕ Dodaj produkt button */}
                <div className="mb-6">
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        Dodaj produkt
                      </motion.button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-0">
                      <SheetHeader className="px-6 pt-6 pb-4">
                        <SheetTitle>Dodaj produkt do lodówki</SheetTitle>
                        <SheetDescription>
                          Wyszukaj produkt i podaj ilość. Backend automatycznie obliczy termin ważności.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="px-6 pb-6">
                        <FridgeForm onAdd={handleAddItem} token={localStorage.getItem("token") || ""} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* 📋 Lista produktów - ТОЛЬКО activeItems (без expired) */}
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
                      <SheetTitle>Dodaj cenę produktu</SheetTitle>
                      <SheetDescription>
                        Podaj cenę za wybraną jednostkę. System automatycznie obliczy całkowitą wartość.
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
                      <SheetTitle>Zmień ilość produktu</SheetTitle>
                      <SheetDescription>
                        Zaktualizuj ilość produktu. Cena całkowita zostanie przeliczona automatycznie.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="px-6 pb-6">
                      {quantitySheetItem && (
                        <QuantitySheet item={quantitySheetItem} onSave={handleUpdateQuantity} />
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
                
                {/* ⚠️ Предупреждение для critical items - ТОЛЬКО critical (не expired) */}
                {criticalItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-200 dark:border-orange-800/30 rounded-lg flex gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
                        ⚠️ Produkty wymagające szybkiego użycia
                      </p>
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        {(() => {
                          const criticalValue = criticalItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
                          if (criticalValue > 0) {
                            return `Produkty za ${criticalValue.toFixed(2)} PLN wkrótce się zepsują. AI może zaproponować, co z nich ugotować.`;
                          }
                          return `Masz ${criticalItems.length} ${criticalItems.length === 1 ? 'produkt' : 'produktów'} do szybkiego użycia.`;
                        })()}
                      </p>
                    </div>
                  </motion.div>
                )}
                
                {/* 💡 Wskazówka */}
                {activeItems.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/30 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-sky-900 dark:text-sky-100"><span className="font-semibold">Wskazówka:</span> Produkty z krótkim terminem ważności będą oznaczone ostrzeżeniem — AI zaproponuje, co ugotować w pierwszej kolejności.</p>
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
