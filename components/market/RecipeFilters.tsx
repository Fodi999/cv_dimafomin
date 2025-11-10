"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RECIPE_CATEGORIES, DIFFICULTY_LEVELS } from "@/lib/constants";

interface RecipeFiltersProps {
  onSearchChange: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function RecipeFilters({
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onSortChange,
}: RecipeFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-sm p-6 mb-8 border border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Пошук рецептів..."
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        {onCategoryChange && (
          <select
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-500"
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Усі категорії</option>
            {RECIPE_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        )}

        {/* Difficulty Filter */}
        <select
          className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-500"
          onChange={(e) => onDifficultyChange(e.target.value)}
        >
          <option value="">Усі рівні</option>
          {DIFFICULTY_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-500"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="popular">Популярні</option>
          <option value="newest">Нові</option>
          <option value="price-low">Ціна: низька</option>
          <option value="price-high">Ціна: висока</option>
          <option value="rating">Рейтинг</option>
        </select>
      </div>
    </div>
  );
}
