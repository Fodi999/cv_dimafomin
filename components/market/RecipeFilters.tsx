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
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Пошук рецептів..."
            className="pl-10"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        {onCategoryChange && (
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC864]"
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
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC864]"
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
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC864]"
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
