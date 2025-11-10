"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Refrigerator,
  Plus,
  Trash2,
  Search,
  AlertCircle,
  Droplets,
  Flame,
  Leaf,
  Fish,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { fridgeApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface FridgeItem {
  id: string;
  name: string;
  category: "protein" | "vegetable" | "condiment" | "other";
  expiryDate: string;
  quantity: string;
}

export default function FridgePage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<FridgeItem["category"]>(
    "other"
  );
  const [newItemExpiry, setNewItemExpiry] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Load fridge items on mount
  useEffect(() => {
    // Wait for user context to load
    if (isLoading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    const loadFridgeItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/login");
          return;
        }

        try {
          const fridgeItems = await fridgeApi.getItems(token);
          setItems(Array.isArray(fridgeItems) ? fridgeItems : []);
        } catch (apiErr: any) {
          // API endpoint might not be available yet, use mock data
          console.warn("Fridge API not available, using mock data:", apiErr);
          setItems([]);
        }
      } catch (err: any) {
        console.error("Failed to load fridge items:", err);
        setError(err.message || "Помилка завантаження холодильника");
      } finally {
        setLoading(false);
      }
    };

    loadFridgeItems();
  }, [user, isLoading, router]);

  const categoryIcons = {
    protein: <Fish className="w-5 h-5 text-orange-500" />,
    vegetable: <Leaf className="w-5 h-5 text-green-500" />,
    condiment: <Droplets className="w-5 h-5 text-blue-500" />,
    other: <Flame className="w-5 h-5 text-gray-500" />,
  };

  const categoryLabels = {
    protein: "Білки",
    vegetable: "Овочі",
    condiment: "Приправи",
    other: "Інше",
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = async () => {
    if (newItemName.trim() === "" || newItemExpiry === "" || newItemQuantity === "") {
      setError("Заповніть усі поля");
      return;
    }

    try {
      setIsAdding(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const newItem = await fridgeApi.addItem(
          {
            name: newItemName,
            category: newItemCategory,
            expiryDate: newItemExpiry,
            quantity: newItemQuantity,
          },
          token
        );

        setItems([...items, newItem as FridgeItem]);
      } catch (apiErr: any) {
        // If API fails, add item locally
        console.warn("Fridge API not available, adding locally:", apiErr);
        const localItem: FridgeItem = {
          id: Date.now().toString(),
          name: newItemName,
          category: newItemCategory,
          expiryDate: newItemExpiry,
          quantity: newItemQuantity,
        };
        setItems([...items, localItem]);
      }

      setNewItemName("");
      setNewItemCategory("other");
      setNewItemExpiry("");
      setNewItemQuantity("");
      setShowAddForm(false);
      setSuccessMessage("✅ Інгредієнт додан!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to add item:", err);
      setError(err.message || "Помилка при додаванні інгредієнту");
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        await fridgeApi.deleteItem(id, token);
      } catch (apiErr: any) {
        // If API fails, remove item locally
        console.warn("Fridge API not available, removing locally:", apiErr);
      }

      setItems(items.filter((item) => item.id !== id));
      setSuccessMessage("✅ Інгредієнт видален!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      setError(err.message || "Помилка при видаленні інгредієнту");
    }
  };

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysLeft < 0) return { label: "Прострочено", color: "text-red-600" };
    if (daysLeft <= 3) return { label: `${daysLeft} днів`, color: "text-orange-600" };
    return { label: `${daysLeft} днів`, color: "text-green-600" };
  };

  const groupedItems = {
    protein: filteredItems.filter((i) => i.category === "protein"),
    vegetable: filteredItems.filter((i) => i.category === "vegetable"),
    condiment: filteredItems.filter((i) => i.category === "condiment"),
    other: filteredItems.filter((i) => i.category === "other"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-sky-50 dark:from-gray-950 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ===== LOADING AUTH ===== */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        )}

        {/* ===== CHECK AUTH ===== */}
        {!isLoading && !user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Потрібна авторизація
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Будь ласка, увійдіть, щоб використовувати холодильник
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/login")}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-medium"
            >
              Увійти
            </motion.button>
          </motion.div>
        )}

        {!isLoading && user && (
          <>
            {/* ===== HEADER ===== */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="p-3 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl"
                >
                  <Refrigerator className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Мій холодильник
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Управляйте своїми інгредієнтами та датами зберігання
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ===== SUCCESS MESSAGE ===== */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-green-700 dark:text-green-300">{successMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===== ERROR MESSAGE ===== */}
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

            {/* ===== LOADING ===== */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* ===== SEARCH & ADD BUTTON ===== */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col sm:flex-row gap-3 mb-6"
                >
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Пошук інгредієнтів..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    disabled={isAdding}
                  >
                    <Plus className="w-5 h-5" />
                    Додати інгредієнт
                  </motion.button>
                </motion.div>

                {/* ===== ADD ITEM FORM ===== */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6 p-6 bg-white dark:bg-slate-800/50 rounded-lg border border-sky-200 dark:border-sky-800/30 shadow-lg"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Додати новий інгредієнт
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Назва інгредієнту"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className="px-4 py-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />

                        <select
                          value={newItemCategory}
                          onChange={(e) =>
                            setNewItemCategory(e.target.value as FridgeItem["category"])
                          }
                          className="px-4 py-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                          <option value="protein">Білки</option>
                          <option value="vegetable">Овочі</option>
                          <option value="condiment">Приправи</option>
                          <option value="other">Інше</option>
                        </select>

                        <input
                          type="date"
                          value={newItemExpiry}
                          onChange={(e) => setNewItemExpiry(e.target.value)}
                          className="px-4 py-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />

                        <input
                          type="text"
                          placeholder="Кількість (напр. 500g, 2 шт)"
                          value={newItemQuantity}
                          onChange={(e) => setNewItemQuantity(e.target.value)}
                          className="px-4 py-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleAddItem}
                          className="flex-1 px-4 py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium transition-all disabled:opacity-50"
                          disabled={isAdding}
                        >
                          {isAdding ? "Додавання..." : "Додати"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowAddForm(false)}
                          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900/50 font-medium transition-all"
                        >
                          Скасувати
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ===== ITEMS BY CATEGORY ===== */}
                {filteredItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <Refrigerator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Холодильник порожній
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Додайте перший інгредієнт щоб почати
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedItems).map(([category, categoryItems]) =>
                      categoryItems.length > 0 ? (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            {categoryIcons[category as FridgeItem["category"]]}
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                              {categoryLabels[category as FridgeItem["category"]]} (
                              {categoryItems.length})
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {categoryItems.map((item, idx) => {
                              const expiryStatus = getExpiryStatus(item.expiryDate);
                              return (
                                <motion.div
                                  key={item.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  whileHover={{ scale: 1.02 }}
                                  className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-sky-100 dark:border-sky-800/30 hover:border-sky-300 dark:hover:border-sky-700/50 transition-all"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                      {item.name}
                                    </h4>
                                    <motion.button
                                      whileHover={{ scale: 1.2, rotate: 90 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleRemoveItem(item.id)}
                                      className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors text-red-600 dark:text-red-400"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </motion.button>
                                  </div>

                                  <div className="space-y-2 text-sm">
                                    <p className="text-gray-600 dark:text-gray-400">
                                      Кількість:{" "}
                                      <span className="font-medium text-gray-900 dark:text-white">
                                        {item.quantity}
                                      </span>
                                    </p>

                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">
                                        Придатні до:
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {getExpiryStatus(item.expiryDate).label ===
                                          "Прострочено" && (
                                          <AlertCircle className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className={`font-medium ${expiryStatus.color}`}>
                                          {expiryStatus.label}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      ) : null
                    )}
                  </div>
                )}

                {/* ===== INFO BOX ===== */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/30 rounded-lg flex gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-sky-900 dark:text-sky-100">
                      <span className="font-semibold">Порада:</span> Перевіряйте дати
                      закінчення поживності ваших інгредієнтів. Критичні інгредієнти
                      помічаються попередженням при наближенні до дати закінчення.
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
