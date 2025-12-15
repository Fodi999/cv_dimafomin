"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { fridgeApi } from "@/lib/api";
import type { CatalogIngredient, IngredientSearchResponse } from "@/lib/types";

interface IngredientAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (ingredient: CatalogIngredient) => void;
  token: string;
  placeholder?: string;
  categoryFilter?: string | null;
}

export default function IngredientAutocomplete({
  value,
  onChange,
  onSelect,
  token,
  placeholder = "Szukaj produktu...",
  categoryFilter = null,
}: IngredientAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<CatalogIngredient[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Поиск ингредиентов при изменении value
  useEffect(() => {
    const searchIngredients = async () => {
      if (value.trim().length < 1) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        console.log('[IngredientAutocomplete] 🔍 Calling fridgeApi.searchIngredients with:', value);
        const response = await fridgeApi.searchIngredients(value, token) as IngredientSearchResponse;
        console.log('[IngredientAutocomplete] 📦 RAW response from API:', response);
        console.log('[IngredientAutocomplete] 📦 Response type:', typeof response);
        console.log('[IngredientAutocomplete] 📦 Response.items:', response?.items);
        console.log('[IngredientAutocomplete] 📦 Response.data:', (response as any)?.data);
        console.log('[IngredientAutocomplete] 📦 Full response keys:', response ? Object.keys(response) : 'null');
        
        // ✅ Чистая работа с данными: API слой уже нормализовал ответ
        let items = response?.items ?? [];
        
        // ✅ Фильтрация по категории (если указан фильтр)
        if (categoryFilter) {
          items = items.filter(item => item.category === categoryFilter);
          console.log('[IngredientAutocomplete] 🔍 Filtered by category:', categoryFilter, '→', items.length, 'items');
        }
        
        console.log('[IngredientAutocomplete] Items extracted:', items);
        console.log('[IngredientAutocomplete] Items count:', items.length);
        console.log('[IngredientAutocomplete] Setting isOpen to:', items.length > 0);
        
        setSuggestions(items);
        setIsOpen(items.length > 0); // Открываем только если есть результаты
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Failed to search ingredients:", error);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchIngredients, 300);
    return () => clearTimeout(debounce);
  }, [value, token, categoryFilter]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Навигация клавиатурой
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (ingredient: CatalogIngredient) => {
    onSelect(ingredient);
    onChange(ingredient.name);
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-3 w-5 h-5 text-sky-500 animate-spin" />
        )}
      </div>

      {/* Dropdown с результатами */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-800 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            {suggestions.map((ingredient, index) => {
              if (index === 0) {
                console.log('[IngredientAutocomplete] 🎨 Rendering dropdown with', suggestions.length, 'items');
              }
              return (
                <motion.div
                  key={ingredient.id}
                  whileHover={{ backgroundColor: "rgba(14, 165, 233, 0.1)" }}
                  onClick={() => {
                    console.log('[IngredientAutocomplete] ✅ Selected:', ingredient);
                    handleSelect(ingredient);
                  }}
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? "bg-sky-500/20"
                      : "hover:bg-sky-500/10"
                  } ${index > 0 ? "border-t border-gray-100 dark:border-gray-700" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {ingredient.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Kategoria: {ingredient.category}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                      {ingredient.unit}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Нет результатов */}
      {isOpen && !loading && value.trim().length >= 1 && suggestions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-800 rounded-lg shadow-lg p-4"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            🔍 Nie znaleziono produktów dla &quot;{value}&quot;
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
            Spróbuj wpisać inną nazwę
          </p>
        </motion.div>
      )}
    </div>
  );
}
