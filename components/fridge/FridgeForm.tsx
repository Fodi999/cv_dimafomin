"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, AlertCircle } from "lucide-react";
import IngredientAutocomplete from "./IngredientAutocomplete";
import type { CatalogIngredient, AddFridgeItemData } from "@/lib/types";

interface FridgeFormProps {
  onAdd: (data: AddFridgeItemData) => Promise<void>;
  token: string;
}

export default function FridgeForm({ onAdd, token }: FridgeFormProps) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState<CatalogIngredient | null>(null);
  const [quantity, setQuantity] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIngredientSelect = (ingredient: CatalogIngredient) => {
    setSelectedIngredient(ingredient);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedIngredient) {
      setError("Wybierz produkt z listy");
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      setError("Podaj prawidłową ilość (większą niż 0)");
      return;
    }

    setIsAdding(true);

    try {
      const expiresAt = new Date();
      const shelfLifeDays = selectedIngredient.defaultShelfLifeDays || 7;
      expiresAt.setDate(expiresAt.getDate() + shelfLifeDays);
      
      console.log('[FridgeForm] 📅 Calculated expiresAt:', {
        ingredient: selectedIngredient.name,
        defaultShelfLifeDays: shelfLifeDays,
        expiresAt: expiresAt.toISOString(),
      });

      await onAdd({
        ingredientId: selectedIngredient.id,
        quantity: quantityNum,
        unit: selectedIngredient.unit,
        expiresAt: expiresAt.toISOString(),
      });

      setSearchValue("");
      setSelectedIngredient(null);
      setQuantity("");
    } catch (err: any) {
      console.error("Failed to add item:", err);
      setError(err.message || "Błąd podczas dodawania produktu");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Поиск продукта */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Produkt
        </label>
        <IngredientAutocomplete
          value={searchValue}
          onChange={setSearchValue}
          onSelect={handleIngredientSelect}
          token={token}
          placeholder="Szukaj produktu (np. mleko, jajka)..."
        />
        
        {selectedIngredient && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-4 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-lg border border-sky-200 dark:border-sky-800/30"
          >
            <p className="text-sm text-gray-900 dark:text-white font-medium">
              ✅ Wybrany produkt: {selectedIngredient.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Jednostka: <span className="font-medium">{selectedIngredient.unit}</span> • Kategoria: {selectedIngredient.category}
            </p>
            
            {selectedIngredient.defaultShelfLifeDays && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                📅 Termin ważności: 
                <span className="font-medium">
                  {(() => {
                    const expDate = new Date();
                    expDate.setDate(expDate.getDate() + selectedIngredient.defaultShelfLifeDays);
                    return expDate.toLocaleDateString('pl-PL', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    });
                  })()}
                </span>
                ({selectedIngredient.defaultShelfLifeDays} dni)
              </p>
            )}
          </motion.div>
        )}
      </div>

      <div className="pt-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Ilość {selectedIngredient && `(${selectedIngredient.unit})`}
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder={selectedIngredient ? `np. 500 ${selectedIngredient.unit}` : "Najpierw wybierz produkt"}
          disabled={!selectedIngredient}
          className="w-full px-4 py-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isAdding || !selectedIngredient || !quantity}
        className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-5 h-5" />
        {isAdding ? "Dodawanie..." : "Dodaj do lodówki"}
      </motion.button>
    </form>
  );
}
