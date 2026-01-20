"use client";

import { motion } from "framer-motion";
import { useCategories } from "@/contexts/CategoryContext";
import { Loader2 } from "lucide-react";

interface FridgeCategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (categoryKey: string) => void;
}

export default function FridgeCategoryFilter({ 
  activeCategory, 
  onCategoryChange 
}: FridgeCategoryFilterProps) {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    console.error('[FridgeCategoryFilter] Error loading categories:', error);
    // Don't show error UI, fallback categories should be used
  }

  return (
    <div className="mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const isActive = activeCategory === category.key;
          
          return (
            <motion.button
              key={category.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onCategoryChange(category.key)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl
                font-medium text-sm whitespace-nowrap
                transition-all duration-200
                ${isActive 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                }
              `}
            >
              <span>{category.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
