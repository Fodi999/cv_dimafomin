"use client";

import { motion } from "framer-motion";
import { Filter } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CATEGORIES = [
  { value: null, label: "Wszystkie", icon: "🍽️" },
  { value: "Nabiał", label: "Nabiał", icon: "🥛" },
  { value: "Mięso", label: "Mięso", icon: "🥩" },
  { value: "Ryby", label: "Ryby", icon: "🐟" },
  { value: "Warzywa", label: "Warzywa", icon: "🥕" },
  { value: "Owoce", label: "Owoce", icon: "🍎" },
  { value: "Pieczywo", label: "Pieczywo", icon: "🍞" },
  { value: "Napoje", label: "Napoje", icon: "🥤" },
  { value: "Inne", label: "Inne", icon: "📦" },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filtruj po kategorii:
        </h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.value;
          
          return (
            <motion.button
              key={category.value || 'all'}
              type="button"
              onClick={() => onCategoryChange(category.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${isSelected
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="mr-1.5">{category.icon}</span>
              {category.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
