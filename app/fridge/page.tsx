"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Refrigerator, Loader2, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { fridgeApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import FridgeForm from "@/components/fridge/FridgeForm";
import FridgeList from "@/components/fridge/FridgeList";
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
                {/* 🔘 Dodaj produkt button */}
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
                <FridgeList items={items} onDelete={handleRemoveItem} />
                
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
    </div>
  );
}
