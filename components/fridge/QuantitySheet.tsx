"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Loader2 } from "lucide-react";
import type { FridgeItem } from "@/lib/types";

interface QuantitySheetProps {
  item: FridgeItem;
  onSave: (itemId: string, quantity: number) => Promise<void>;
}

export default function QuantitySheet({ item, onSave }: QuantitySheetProps) {
  const [quantity, setQuantity] = useState<string>(item.quantity.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const value = parseFloat(quantity);
    if (isNaN(value) || value <= 0) {
      setError("Podaj prawidłową ilość");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(item.id, value);
    } catch (err: any) {
      setError(err.message || "Błąd podczas aktualizacji ilości");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Рассчитать новую общую стоимость
  const calculateNewTotal = (): number | null => {
    const value = parseFloat(quantity);
    if (isNaN(value) || value <= 0 || !item.pricePerUnit) return null;
    return value * item.pricePerUnit;
  };

  const newTotal = calculateNewTotal();

  return (
    <div className="space-y-6">
      {/* Header with item info */}
      <div className="p-4 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 rounded-lg border border-sky-200 dark:border-sky-800/30">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
          {item.ingredient.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Obecna ilość: {item.quantity} {item.unit}
        </p>
        {item.pricePerUnit && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Cena za {item.unit === 'g' ? 'kg' : item.unit === 'ml' ? 'l' : 'szt'}: {(item.pricePerUnit * (item.unit === 'g' || item.unit === 'ml' ? 1000 : 1)).toFixed(2)} PLN
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Quantity Input */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nowa ilość ({item.unit}):
          </label>
          <div className="relative">
            <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              id="quantity"
              step="any"
              min="1"
              placeholder={`np. ${item.quantity}`}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full pl-10 pr-16 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              required
              autoFocus
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
              {item.unit}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            💡 Zmień ilość, jeśli część produktu została zużyta
          </p>
        </div>

        {/* New Total Preview */}
        {newTotal !== null && item.totalPrice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800/30 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Poprzedni koszt:
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 line-through">
                {item.totalPrice.toFixed(2)} {item.currency || 'PLN'}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nowy koszt:
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {newTotal.toFixed(2)} {item.currency || 'PLN'}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {quantity} {item.unit} × {(item.pricePerUnit || 0).toFixed(4)} {item.currency}/{item.unit}
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
          disabled={isSubmitting || !quantity}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className="w-full py-3 px-6 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Zapisywanie...
            </>
          ) : (
            "Zaktualizuj ilość"
          )}
        </motion.button>
      </form>
    </div>
  );
}
