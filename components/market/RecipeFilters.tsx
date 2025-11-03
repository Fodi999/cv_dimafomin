"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface RecipeFiltersProps {
  onSearchChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function RecipeFilters({
  onSearchChange,
  onDifficultyChange,
  onSortChange,
}: RecipeFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Difficulty Filter */}
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3BC864]"
          onChange={(e) => onDifficultyChange(e.target.value)}
        >
          <option value="">Усі рівні</option>
          <option value="beginner">Початківець</option>
          <option value="intermediate">Середній</option>
          <option value="advanced">Професіонал</option>
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
