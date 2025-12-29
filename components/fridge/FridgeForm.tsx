"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateIngredient, generateIngredientSlug } from "@/lib/i18n/translateIngredient";
import IngredientAutocomplete from "./IngredientAutocomplete";
import type { CatalogIngredient, AddFridgeItemData } from "@/lib/types";

interface FridgeFormProps {
  onAdd: (data: AddFridgeItemData) => Promise<void>;
  token: string;
}

export default function FridgeForm({ onAdd, token }: FridgeFormProps) {
  const { t } = useLanguage();
  const [searchValue, setSearchValue] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState<CatalogIngredient | null>(null);
  const [quantity, setQuantity] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [pricePer, setPricePer] = useState<"kg" | "szt" | "l">("kg");
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
      setError(t?.fridge?.form?.selectProduct || "Select a product from the list");
      return;
    }
    
    const quantityNum = parseFloat(quantity);
    if (!quantity || isNaN(quantityNum) || quantityNum <= 0) {
      setError(t?.fridge?.form?.invalidQuantity || "Enter a valid quantity (greater than 0)");
      return;
    }
    
    setIsAdding(true);
    
    try {
      const expiresAt = new Date();
      const shelfLifeDays = selectedIngredient.defaultShelfLifeDays || 7;
      expiresAt.setDate(expiresAt.getDate() + shelfLifeDays);
      
      const addData: AddFridgeItemData = {
        ingredientId: selectedIngredient.id,
        quantity: quantityNum,
        unit: selectedIngredient.unit,
        expiresAt: expiresAt.toISOString(),
      };

      // 💰 Add price if provided
      if (priceValue && !isNaN(parseFloat(priceValue)) && parseFloat(priceValue) > 0) {
        addData.priceInput = {
          value: parseFloat(priceValue),
          per: pricePer,
        };
      }
      
      await onAdd(addData);
      
      setSearchValue("");
      setSelectedIngredient(null);
      setQuantity("");
      setPriceValue("");
      setPricePer("kg");
    } catch (err: any) {
      console.error("Failed to add item:", err);
      setError(err.message || t?.fridge?.form?.addError || "Error adding product");
    } finally {
      setIsAdding(false);
    }
  };
  
  // ✅ Переводим название выбранного ингредиента
  const translatedIngredientName = selectedIngredient 
    ? translateIngredient(
        selectedIngredient.name, 
        selectedIngredient.i18nKey || generateIngredientSlug(selectedIngredient.name),
        t
      )
    : null;
    
  // ✅ Переводим категорию
  const translatedCategory = selectedIngredient?.category
    ? (t?.fridge?.categories?.[selectedIngredient.category] || selectedIngredient.category)
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t?.fridge?.form?.productLabel || "Product"}
        </label>
        <IngredientAutocomplete
          value={searchValue}
          onChange={setSearchValue}
          onSelect={handleIngredientSelect}
          token={token}
          placeholder={t?.fridge?.form?.searchPlaceholder || "Search for product (e.g. milk, eggs)..."}
        />
        
        {selectedIngredient && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-4 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 rounded-lg border border-sky-200 dark:border-sky-800/30"
          >
            <p className="text-sm text-gray-900 dark:text-white font-medium">
              ✅ {t?.fridge?.form?.selectedProduct || "Selected product"}: {translatedIngredientName}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {t?.fridge?.form?.unit || "Unit"}: <span className="font-medium">{selectedIngredient.unit}</span> • {t?.fridge?.form?.category || "Category"}: {translatedCategory}
            </p>
            
            {selectedIngredient.defaultShelfLifeDays && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                📅 {t?.fridge?.form?.expiryDate || "Expiry date"}: 
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
                ({t?.fridge?.form?.expiryInDays?.replace('{{days}}', String(selectedIngredient.defaultShelfLifeDays)) || `${selectedIngredient.defaultShelfLifeDays} days`})
              </p>
            )}
          </motion.div>
        )}
      </div>

      <div className="pt-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t?.fridge?.form?.quantity || "Quantity"} {selectedIngredient && `(${selectedIngredient.unit})`}
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder={
            selectedIngredient 
              ? t?.fridge?.form?.quantityPlaceholder?.replace('{{unit}}', selectedIngredient.unit) || `e.g. 500 ${selectedIngredient.unit}`
              : t?.fridge?.form?.selectProductFirst || "Select a product first"
          }
          disabled={!selectedIngredient}
          className="w-full px-4 py-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* 💰 Price Input (Recommended) */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          💰 {t?.fridge?.form?.priceLabel || "Price"} <span className="text-xs font-normal text-amber-600 dark:text-amber-400">{t?.fridge?.form?.priceRecommended || "(recommended - for savings calculations)"}</span>
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
            placeholder={t?.fridge?.form?.pricePlaceholder || "e.g. 50"}
            disabled={!selectedIngredient}
            className="flex-1 px-4 py-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="flex items-center px-3 text-sm text-gray-600 dark:text-gray-400">{t?.fridge?.form?.pricePerLabel || "PLN per"}</span>
          <select
            value={pricePer}
            onChange={(e) => setPricePer(e.target.value as "kg" | "l" | "szt")}
            disabled={!selectedIngredient}
            className="px-4 py-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="kg">kg</option>
            <option value="l">litr</option>
            <option value="szt">szt</option>
          </select>
        </div>
        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1">
          <span className="text-base">⚠️</span>
          <span><strong>{t?.fridge?.form?.priceWarning || "Without price we won't show how much you save on recipes. Add price to see real savings!"}</strong></span>
        </p>
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
        {isAdding ? (t?.fridge?.form?.adding || "Adding...") : (t?.fridge?.form?.addButton || "Add to Fridge")}
      </motion.button>
    </form>
  );
}
