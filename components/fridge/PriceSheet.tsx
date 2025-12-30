"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateIngredient, generateIngredientSlug } from "@/lib/i18n/translateIngredient";
import type { FridgeItem } from "@/lib/types";

interface PriceSheetProps {
  item: FridgeItem;
  onSave: (itemId: string, pricePerUnit: number, currency: string) => Promise<void>;
}

export default function PriceSheet({ item, onSave }: PriceSheetProps) {
  const { t } = useLanguage();
  const [priceValue, setPriceValue] = useState<string>("");
  const [priceUnit, setPriceUnit] = useState<"kg" | "l" | "szt">("kg");
  const [currency, setCurrency] = useState<string>("PLN");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Определяем единицу измерения цены на основе единицы продукта
  const detectPriceUnit = (productUnit: string): "kg" | "l" | "szt" => {
    if (productUnit === "g" || productUnit === "kg") return "kg";
    if (productUnit === "ml" || productUnit === "l") return "l";
    return "szt";
  };

  // Установить единицу измерения при монтировании
  useState(() => {
    setPriceUnit(detectPriceUnit(item.unit));
  });

  /**
   * Нормализация цены: kg/l → /1000 (в граммы/миллилитры), szt → без изменений
   */
  function normalizePrice(value: number, unit: "kg" | "l" | "szt"): number {
    if (unit === "kg") return value / 1000; // PLN/kg → PLN/g
    if (unit === "l") return value / 1000;  // PLN/l → PLN/ml
    return value; // szt → без изменений
  }

  // Рассчитать итоговую стоимость для предпросмотра
  const calculateEstimatedTotal = (): number | null => {
    const value = parseFloat(priceValue);
    if (isNaN(value) || value <= 0) return null;

    const normalizedPrice = normalizePrice(value, priceUnit);
    return normalizedPrice * item.quantity;
  };

  const estimatedTotal = calculateEstimatedTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const value = parseFloat(priceValue);
    if (isNaN(value) || value <= 0) {
      setError(t?.fridge?.priceModal?.invalidPrice || "Enter a valid price");
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedPrice = normalizePrice(value, priceUnit);
      await onSave(item.id, normalizedPrice, currency);
    } catch (err: any) {
      setError(err.message || t?.fridge?.priceModal?.saveError || "Error saving price");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with item info */}
      <div className="p-4 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 rounded-lg border border-sky-200 dark:border-sky-800/30">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
          {translateIngredient(
            item.ingredient.name,
            item.ingredient.i18nKey || generateIngredientSlug(item.ingredient.name),
            t
          )}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {item.quantity} {item.unit}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Price Unit Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t?.fridge?.priceModal?.priceFor || "Price per:"}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["kg", "l", "szt"].map((unit) => (
              <motion.button
                key={unit}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPriceUnit(unit as "kg" | "l" | "szt")}
                className={`
                  px-4 py-2.5 rounded-lg font-medium text-sm transition-all
                  ${priceUnit === unit
                    ? "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }
                `}
              >
                {unit}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Price Input */}
        <div>
          <label htmlFor="priceValue" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t?.fridge?.priceModal?.amount || "Amount:"}
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              id="priceValue"
              step="0.01"
              min="0.01"
              placeholder={t?.fridge?.priceModal?.amountPlaceholder || "e.g. 3.20"}
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        {/* Currency Selector */}
        <div>
          <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t?.fridge?.form?.currency || "Currency:"}
          </label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          >
            <option value="PLN">PLN (złoty)</option>
            <option value="EUR">EUR (euro)</option>
            <option value="USD">USD (dolar)</option>
          </select>
        </div>

        {/* Estimated Total Preview */}
        {estimatedTotal !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/30 rounded-lg"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t?.fridge?.form?.estimatedTotal || "Estimated total cost:"}
            </p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {estimatedTotal.toFixed(2)} {currency}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {priceValue} {currency}/{priceUnit} × {item.quantity} {item.unit}
            </p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/30 rounded-lg"
          >
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting || !priceValue}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className="w-full py-3 px-6 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t?.fridge?.priceModal?.saving || "Saving..."}
            </>
          ) : (
            t?.fridge?.priceModal?.save || "Save price"
          )}
        </motion.button>
      </form>
    </div>
  );
}
