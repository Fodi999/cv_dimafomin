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

export default function FridgeList({ items, onDelete, onPriceClick, onQuantityClick }: FridgeListProps) {
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
  
  // Сортировка: expired → critical → warning → ok
  const sortedItems = [...filteredItems].sort((a, b) => {
    const order = { expired: 0, critical: 1, warning: 2, ok: 3 };
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
    <div className="space-y-6">
      {/* ✅ Профессиональные вкладки категорий */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Refrigerator className="w-5 h-5 text-sky-500" />
            {t?.fridge?.title || "Fridge"}
            <span className="px-2.5 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-sm font-semibold rounded-full">
              {items.length}
            </span>
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t?.fridge?.categories?.title || "Browse products by category"}
          </p>
        </div>
        
        {/* Tabs Navigation */}
        <div className="p-4 bg-gray-50 dark:bg-slate-900/50">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const count = category.value === "all" ? items.length : (categoryCounts[category.value] || 0);
              const isActive = activeCategory === category.value;
              const Icon = category.Icon;
              
              return (
                <motion.button
                  key={category.value}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(category.value)}
                  className={`
                    px-4 py-2.5 rounded-lg font-medium text-sm transition-all
                    flex items-center gap-2.5 relative
                    ${isActive 
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/30' 
                      : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-gray-600 hover:border-sky-300 dark:hover:border-sky-700'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-500'}`} />
                  <span>{category.label}</span>
                  {count > 0 && (
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-bold min-w-[24px] text-center
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

      {/* ✅ Список продуктов */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8 px-6 bg-white dark:bg-slate-800 rounded-xl shadow border border-gray-200 dark:border-gray-700"
        >
          <p className="text-gray-600 dark:text-gray-400">
            {t?.fridge?.emptyCategory?.replace('{{category}}', CATEGORIES.find(c => c.value === activeCategory)?.label || '') || `No products in category ${CATEGORIES.find(c => c.value === activeCategory)?.label}`}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {sortedItems.map((item, index) => (
              <FridgeItem
                key={item.id}
                item={item}
                onDelete={onDelete}
                onPriceClick={onPriceClick}
                onQuantityClick={onQuantityClick}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

