"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IngredientsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
}

const CATEGORIES = [
  { value: "all", label: "Всі категорії" },
  { value: "meat", label: "М'ясо" },
  { value: "fish", label: "Риба" },
  { value: "vegetables", label: "Овочі" },
  { value: "fruits", label: "Фрукти" },
  { value: "dairy", label: "Молочні продукти" },
  { value: "grains", label: "Крупи" },
  { value: "spices", label: "Спеції" },
  { value: "other", label: "Інше" },
];

export function IngredientsFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
}: IngredientsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Пошук інгредієнтів..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Категорія" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
