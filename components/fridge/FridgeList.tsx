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
import { getWarehouseStatus, calculateDaysLeft } from "@/lib/types/warehouse-ui";
import { syncWarehouseToLosses } from "@/lib/utils/warehouse-sync";

interface FridgeListProps {
  items: FridgeItemType[];
  onDelete: (id: string) => void;
  onPriceClick?: (item: FridgeItemType) => void;
  onQuantityClick?: (item: FridgeItemType) => void;
  highlightId?: string; // 🆕 ID of item to highlight (from notification click)
}

// ✅ Backend category keys с иконками (используем BACKEND keys вместо польских)
const getCategoryConfig = (t: any) => [
  { value: "all", label: t?.fridge?.categories?.all || "All", Icon: LayoutGrid },
  { value: "dairy", label: t?.fridge?.categories?.dairy || "Dairy", Icon: Milk },
  { value: "protein", label: t?.fridge?.categories?.protein || "Protein", Icon: Beef },
  { value: "vegetable", label: t?.fridge?.categories?.vegetable || "Vegetables", Icon: Carrot },
  { value: "fruit", label: t?.fridge?.categories?.fruit || "Fruits", Icon: Apple },
  { value: "grain", label: t?.fridge?.categories?.grain || "Grains", Icon: Croissant },
  { value: "beverage", label: t?.fridge?.categories?.beverage || "Beverages", Icon: Coffee },
  { value: "fish", label: t?.fridge?.categories?.fish || "Fish", Icon: Fish },
  { value: "egg", label: t?.fridge?.categories?.egg || "Eggs", Icon: Package },
  { value: "condiment", label: t?.fridge?.categories?.condiment || "Condiments", Icon: Package },
  { value: "other", label: t?.fridge?.categories?.other || "Other", Icon: Package },
];

export default function FridgeList({ items, onDelete, onPriceClick, onQuantityClick, highlightId }: FridgeListProps) {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");
  const CATEGORIES = getCategoryConfig(t);
  
  console.log('[FridgeList] Received items:', items);
  console.log('[FridgeList] Items count:', items?.length);
  
  // 🔥 ФРОНТЕНД-СИНХРОНИЗАЦИЯ: Фильтруем EXPIRED продукты
  // EXPIRED продукты НЕ показываются на складе - они автоматически появляются в списаниях
  const { activeWarehouseItems, expiredLosses } = syncWarehouseToLosses(items, language);
  
  if (expiredLosses.length > 0) {
    console.log(`[FridgeList] 🚫 Filtered out ${expiredLosses.length} EXPIRED items. They will appear in Losses.`);
  }
  
  console.log('[FridgeList] Active warehouse items (EXPIRED filtered):', activeWarehouseItems.length);
  
  // ✅ Подсчёт продуктов по категориям (используем backend categoryKey)
  const categoryCounts = activeWarehouseItems.reduce((acc, item) => {
    const categoryKey = item.ingredient?.categoryKey || 'other';
    acc[categoryKey] = (acc[categoryKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // ✅ Фильтрация по backend categoryKey (НЕ по переведенному имени!)
  const filteredItems = activeCategory === "all" 
    ? activeWarehouseItems 
    : activeWarehouseItems.filter(item => (item.ingredient?.categoryKey || 'other') === activeCategory);
  
  // 🔥 Сортировка: WARNING → OK (по daysLeft возрастанию)
  // Используем единый UI-контракт для статусов
  const sortedItems = [...filteredItems].sort((a, b) => {
    const aDaysLeft = calculateDaysLeft(a.expiresAt);
    const bDaysLeft = calculateDaysLeft(b.expiresAt);
    const aStatus = getWarehouseStatus(aDaysLeft);
    const bStatus = getWarehouseStatus(bDaysLeft);
    
    // Приоритет 1: WARNING (≤2 дня) - самые первые
    if (aStatus === 'WARNING' && bStatus !== 'WARNING') return -1;
    if (aStatus !== 'WARNING' && bStatus === 'WARNING') return 1;
    
    // Приоритет 2: Внутри каждой группы сортируем по daysLeft (меньше = выше)
    const aDays = aDaysLeft ?? Infinity;
    const bDays = bDaysLeft ?? Infinity;
    return aDays - bDays;
  });
  
  console.log('[FridgeList] Active category:', activeCategory);
  console.log('[FridgeList] Filtered items:', filteredItems.length);

  if (activeWarehouseItems.length === 0) {
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
            {t?.fridge?.emptyState?.title || "Добавьте продукты на склад:"}
          </p>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-sky-500 mt-1">•</span>
              <span>{t?.fridge?.emptyState?.reason1 || "AI предложит рецепты на основе продуктов"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500 mt-1">•</span>
              <span>{t?.fridge?.emptyState?.reason2 || "Используйте продукты до истечения срока"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500 mt-1">•</span>
              <span>{t?.fridge?.emptyState?.reason3 || "Не покупайте то, что уже есть на складе"}</span>
            </li>
          </ul>
          
          {/* ℹ️ Информация о синхронизации со списаниями */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>ℹ️ Автоматическая синхронизация:</strong> Продукты с истекшим сроком годности автоматически переносятся в раздел "Списания". Проверьте там, если продукт исчез со склада.
            </p>
          </div>
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
                {items.reduce((sum, item) => sum + (item.currentValue || 0), 0) > 0 && (
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                    {items.reduce((sum, item) => sum + (item.currentValue || 0), 0).toFixed(2)} PLN
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

