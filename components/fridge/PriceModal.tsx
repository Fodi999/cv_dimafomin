"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateIngredient, generateIngredientSlug } from "@/lib/i18n/translateIngredient";
import type { FridgeItem } from "@/lib/types";

interface PriceModalProps {
  item: FridgeItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: string, pricePerUnit: number, currency: string) => Promise<void>;
}

// Нормализация цены: преобразует пользовательский ввод в pricePerUnit для базовой единицы (g/ml)
function normalizePrice(value: number, unit: "kg" | "l" | "szt"): number {
  if (unit === "kg") return value / 1000; // PLN/kg → PLN/g
  if (unit === "l") return value / 1000;  // PLN/l → PLN/ml
  return value; // szt → без изменений
}

export default function PriceModal({ item, isOpen, onClose, onSave }: PriceModalProps) {
  const { t } = useLanguage();
  const [priceValue, setPriceValue] = useState("");
  const [priceUnit, setPriceUnit] = useState<"kg" | "l" | "szt">(
    item.unit === "g" || item.unit === "kg" ? "kg" :
    item.unit === "ml" || item.unit === "l" ? "l" : "szt"
  );
  const [currency] = useState("PLN");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const value = parseFloat(priceValue);
    if (!priceValue || isNaN(value) || value <= 0) {
      setError(t?.fridge?.priceModal?.invalidPrice || "Enter a valid price (greater than 0)");
      return;
    }

    setIsSaving(true);
    try {
      // Нормализуем цену перед отправкой на backend
      const normalizedPrice = normalizePrice(value, priceUnit);
      
      await onSave(item.id, normalizedPrice, currency);
      
      // Reset and close
      setPriceValue("");
      onClose();
    } catch (err: any) {
      console.error("Failed to save price:", err);
      setError(err.message || t?.fridge?.priceModal?.saveError || "Error saving price");
    } finally {
      setIsSaving(false);
    }
  };

  // Obliczenie szacunkowej ceny całkowitej dla podglądu
  const estimatedTotal = (() => {
    const value = parseFloat(priceValue);
    if (isNaN(value) || value <= 0) return null;

    let multiplier = 1;
    if (priceUnit === "kg") {
      multiplier = item.unit === "g" ? item.quantity / 1000 : item.quantity;
    } else if (priceUnit === "l") {
      multiplier = item.unit === "ml" ? item.quantity / 1000 : item.quantity;
    } else if (priceUnit === "szt") {
      multiplier = item.quantity;
    }

    return value * multiplier;
  })();

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 relative"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t?.fridge?.priceModal?.title || "Add price"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {translateIngredient(
                        item.ingredient.name,
                        item.ingredient.i18nKey || generateIngredientSlug(item.ingredient.name),
                        t
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {item.quantity} {item.unit}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t?.fridge?.priceModal?.priceFor || "Price per:"}
                  </label>
                  <select
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value as "kg" | "l" | "szt")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="kg">{t?.fridge?.priceModal?.units?.kg || "kilogram (kg)"}</option>
                    <option value="l">{t?.fridge?.priceModal?.units?.l || "liter (l)"}</option>
                    <option value="szt">{t?.fridge?.priceModal?.units?.szt || "piece (pc)"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t?.fridge?.priceModal?.amount || "Amount:"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={priceValue}
                      onChange={(e) => setPriceValue(e.target.value)}
                      placeholder={t?.fridge?.priceModal?.amountPlaceholder || "e.g. 3.20"}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                      autoFocus
                    />
                    <div className="px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                      {currency}
                    </div>
                  </div>
                </div>

                {/* Estimated total preview */}
                {estimatedTotal !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg"
                  >
                    <p className="text-xs text-green-700 dark:text-green-300 mb-1">
                      {t?.fridge?.priceModal?.estimatedValue || "Estimated product value:"}
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      ≈ {estimatedTotal.toFixed(2)} {currency}
                    </p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg"
                  >
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {t?.fridge?.priceModal?.cancel || "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !priceValue}
                    className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (t?.fridge?.priceModal?.saving || "Saving...") : (t?.fridge?.priceModal?.save || "Save price")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
