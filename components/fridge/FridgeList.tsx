"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { 
  Refrigerator, 
  LayoutGrid, 
  Milk, 
  Beef, 
  Carrot, 
  Apple, 
  Croissant, 
  Coffee, 
  Fish,
  Package
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import FridgeItem from "./FridgeItem";
import type { FridgeItem as FridgeItemType } from "@/lib/types";

interface FridgeListProps {
  items: FridgeItemType[];
  onDelete: (id: string) => void;
  onPriceClick?: (item: FridgeItemType) => void;
  onQuantityClick?: (item: FridgeItemType) => void;
  highlightId?: string; // 🆕 ID of item to highlight (from notification click)
}

// ✅ Профессиональные категории с иконками lucide-react
const getCategoryConfig = (t: any) => [
  { value: "all", label: t?.fridge?.categories?.all || "All", Icon: LayoutGrid },
  { value: "Nabiał", label: t?.fridge?.categories?.dairy || "Dairy", Icon: Milk },
  { value: "Mięso", label: t?.fridge?.categories?.meat || "Meat", Icon: Beef },
  { value: "Warzywa", label: t?.fridge?.categories?.vegetables || "Vegetables", Icon: Carrot },
  { value: "Owoce", label: t?.fridge?.categories?.fruits || "Fruits", Icon: Apple },
  { value: "Pieczywo", label: t?.fridge?.categories?.bread || "Bread", Icon: Croissant },
  { value: "Napoje", label: t?.fridge?.categories?.drinks || "Drinks", Icon: Coffee },
  { value: "Ryby", label: t?.fridge?.categories?.fish || "Fish", Icon: Fish },
  { value: "Inne", label: t?.fridge?.categories?.other || "Other", Icon: Package },
];

export default function FridgeList({ items, onDelete, onPriceClick, onQuantityClick, highlightId }: FridgeListProps) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const CATEGORIES = getCategoryConfig(t);
  
  console.log('[FridgeList] Received items:', items);
  console.log('[FridgeList] Items count:', items?.length);
  
  // ✅ Подсчёт продуктов по категориям
  const categoryCounts = items.reduce((acc, item) => {
    const category = item.ingredient?.category || 'Inne';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // ✅ Фильтрация по активной категории
  const filteredItems = activeCategory === "all" 
    ? items 
    : items.filter(item => (item.ingredient?.category || 'Inne') === activeCategory);
  
  // Сортировка: fresh → ok → warning → critical → expired
  const sortedItems = [...filteredItems].sort((a, b) => {
    const order = { fresh: 0, ok: 1, warning: 2, critical: 3, expired: 4 };
    return order[a.status] - order[b.status];
  });
  
  console.log('[FridgeList] Active category:', activeCategory);
  console.log('[FridgeList] Filtered items:', filteredItems.length);

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 px-6"
      >
        <Refrigerator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t?.fridge?.messages?.empty || "Your fridge is empty"}
        </h3>
        <div className="max-w-md mx-auto text-left">
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            {t?.fridge?.emptyState?.title || "Add products to:"}
          </p>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-sky-500 mt-1">•</span>
              <span>{t?.fridge?.emptyState?.reason1 || "Get AI recipe suggestions"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500 mt-1">•</span>
              <span>{t?.fridge?.emptyState?.reason2 || "Use products before expiry"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500 mt-1">•</span>
              <span>{t?.fridge?.emptyState?.reason3 || "Avoid buying duplicates"}</span>
            </li>
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ✅ STICKY Горизонтальная панель категорий - Mobile optimized */}
      <div className="sticky top-[56px] sm:top-[64px] z-20 bg-gradient-to-b from-white via-white to-transparent dark:from-gray-950 dark:via-gray-950 dark:to-transparent pb-3 sm:pb-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Refrigerator className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" />
                {t?.fridge?.title || "Fridge"}
              </h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 text-xs sm:text-sm font-bold rounded-full border border-sky-200 dark:border-sky-700">
                  {items.length} {t?.fridge?.stats?.products || "products"}
                </span>
                {items.reduce((sum, item) => sum + (item.totalPrice || 0), 0) > 0 && (
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                    {items.reduce((sum, item) => sum + (item.totalPrice || 0), 0).toFixed(2)} PLN
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Tabs Navigation - с горизонтальным скроллом, оптимизировано для мобильных */}
          <div className="p-2 sm:p-3 bg-gray-50 dark:bg-slate-900/50 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1.5 sm:gap-2 min-w-max">
              {CATEGORIES.map((category) => {
                const count = category.value === "all" ? items.length : (categoryCounts[category.value] || 0);
                const isActive = activeCategory === category.value;
                const Icon = category.Icon;
                
                // Скрываем категории без продуктов (кроме "Все")
                if (category.value !== "all" && count === 0) return null;
                
                return (
                  <motion.button
                    key={category.value}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(category.value)}
                    className={`
                      px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm transition-all whitespace-nowrap
                      flex items-center gap-1.5 sm:gap-2 relative
                      ${isActive 
                        ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg' 
                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-600'
                      }
                    `}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-sky-500'}`} />
                    <span>{category.label}</span>
                    {count > 0 && (
                      <span className={`
                        px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold
                        ${isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                        }
                      `}>
                        {count}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Список продуктов - Mobile optimized */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 sm:py-8 px-4 sm:px-6 bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow border border-gray-200 dark:border-gray-700"
        >
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {t?.fridge?.emptyCategory?.replace('{category}', CATEGORIES.find(c => c.value === activeCategory)?.label || '') || `No products in category ${CATEGORIES.find(c => c.value === activeCategory)?.label}`}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          <AnimatePresence mode="popLayout">
            {sortedItems.map((item, index) => (
              <FridgeItem
                key={item.id}
                item={item}
                onDelete={onDelete}
                onPriceClick={onPriceClick}
                onQuantityClick={onQuantityClick}
                index={index}
                isHighlighted={item.id === highlightId} // 🆕 Highlight if matches URL param
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

