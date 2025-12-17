"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Refrigerator, Loader2, AlertCircle, CheckCircle2, Plus, Sparkles } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { fridgeApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import FridgeForm from "@/components/fridge/FridgeForm";
import FridgeList from "@/components/fridge/FridgeList";
import FridgeStats from "@/components/fridge/FridgeStats";
import FridgeAIActions from "@/components/fridge/FridgeAIActions";
import AIResultModal from "@/components/fridge/AIResultModal";
import PriceSheet from "@/components/fridge/PriceSheet";
import QuantitySheet from "@/components/fridge/QuantitySheet";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { FridgeItem, AddFridgeItemData, FridgeItemsResponse } from "@/lib/types";

export default function FridgePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Sheet state
  const [isPriceSheetOpen, setIsPriceSheetOpen] = useState(false); // Price sheet state
  const [priceSheetItem, setPriceSheetItem] = useState<FridgeItem | null>(null); // Selected item for price
  const [isQuantitySheetOpen, setIsQuantitySheetOpen] = useState(false); // Quantity sheet state
  const [quantitySheetItem, setQuantitySheetItem] = useState<FridgeItem | null>(null); // Selected item for quantity
  // AI states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTitle, setAiTitle] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    loadFridgeItems();
  }, [user, isLoading]);

  const loadFridgeItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      console.log('[FridgePage] 📡 Calling fridgeApi.getItems...');
      const response = await fridgeApi.getItems(token) as FridgeItemsResponse;
      console.log('[FridgePage] 📦 Response from getItems:', response);
      console.log('[FridgePage] 📦 Response.items:', response?.items);
      console.log('[FridgePage] 📦 Setting items state with:', response.items || []);
      setItems(response.items || []);
    } catch (err: any) {
      console.error("Failed to load fridge items:", err);
      setError(err.message || "Błąd ładowania produktów");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (data: AddFridgeItemData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      // MVP: Add item, then refetch full list
      await fridgeApi.addItem(data, token);
      
      // Refetch to get updated list with backend-calculated expiry
      await loadFridgeItems();
      
      // Close sheet and show success
      setIsSheetOpen(false);
      setSuccessMessage("✅ Produkt dodany do lodówki!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      throw err; // FridgeForm will handle display
    }
  };

  const handleRemoveItem = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await fridgeApi.deleteItem(id, token);
      setItems(items.filter((item) => item.id !== id));
      setSuccessMessage("✅ Produkt usunięty!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      setError(err.message || "Błąd podczas usuwania produktu");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUpdatePrice = async (itemId: string, pricePerUnit: number, currency: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      // Event sourcing: добавляем price-event вместо обновления
      await fridgeApi.addPrice(itemId, { 
        pricePerUnit, 
        currency,
        source: 'manual' // 📌 Обязательное поле для event sourcing
      }, token);
      
      // Refetch to get updated totalPrice from backend
      await loadFridgeItems();
      
      setIsPriceSheetOpen(false);
      setPriceSheetItem(null);
      setSuccessMessage("✅ Cena zaktualizowana!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to update price:", err);
      setError(err.message || "Błąd podczas aktualizacji ceny");
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
      router.push("/login");
      return;
    }
    try {
      await fridgeApi.updateItemQuantity(itemId, { quantity }, token);
      
      // Refetch to get updated data from backend
      await loadFridgeItems();
      
      setIsQuantitySheetOpen(false);
      setQuantitySheetItem(null);
      setSuccessMessage("✅ Ilość zaktualizowana!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to update quantity:", err);
      setError(err.message || "Błąd podczas aktualizacji ilości");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleAIAnalyze = async (goal: string) => {
    const titles: Record<string, string> = {
      'recipe_today': '🍳 Przepis na dziś',
      'plan_3days': '📅 Plan na 3 dni',
      'use_expiring': '♻️ Wykorzystaj kończące się',
      'spending_analysis': '💸 Analiza wydatków'
    };
    
    setAiTitle(titles[goal] || 'Analiza AI');
    setAiLoading(true);
    setAiModalOpen(true);
    setAiResult('');

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Brak tokenu autoryzacji");
      }

      const response = await fetch("/api/ai/fridge/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ goal }),
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Błąd podczas analizy");
      }

      const data = await response.json();
      setAiResult(data.analysis || data.message || 'Brak odpowiedzi od AI');
    } catch (err: any) {
      console.error("AI Analysis error:", err);
      setAiResult(`❌ Błąd: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-sky-50 dark:from-gray-950 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-[80px]">
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
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.push("/login")} className="px-8 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-medium">Zaloguj się</motion.button>
          </motion.div>
        )}
        {!isLoading && user && (
          <>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <motion.div whileHover={{ rotate: 10 }} className="p-3 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl">
                  <Refrigerator className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Moja Lodówka</h1>
                    <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold uppercase rounded-full">Core</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Centrum planowania posiłków, zakupów i kontroli budżetu</p>
                </div>
              </div>
            </motion.div>
            <AnimatePresence>
              {successMessage && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-green-700 dark:text-green-300">{successMessage}</p>
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
                {/* � Statistics */}
                {items.length > 0 && <FridgeStats items={items} />}

                {/* ✨ AI Actions */}
                {items.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Asystent</h2>
                    </div>
                    <FridgeAIActions onAnalyze={handleAIAnalyze} loading={aiLoading} />
                  </motion.div>
                )}

                {/* �🔘 Dodaj produkt button */}
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

                {/* 📋 Lista produktów lub empty state */}
                <FridgeList 
                  items={items} 
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
                
                {/* 💡 Economic hint for critical/expired items */}
                {items.length > 0 && items.some(item => item.status === 'critical' || item.status === 'expired') && (
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
                          const criticalItems = items.filter(item => item.status === 'critical' || item.status === 'expired');
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
                
                {items.length > 0 && (
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

      {/* AI Result Modal */}
      <AIResultModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title={aiTitle}
        content={aiResult}
        loading={aiLoading}
      />
    </div>
  );
}
