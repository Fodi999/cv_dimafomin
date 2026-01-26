"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface MarketplaceFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  priceMin: string;
  onPriceMinChange: (value: string) => void;
  priceMax: string;
  onPriceMaxChange: (value: string) => void;
}

export function MarketplaceFilters({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  priceMin,
  onPriceMinChange,
  priceMax,
  onPriceMaxChange,
}: MarketplaceFiltersProps) {
  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Поиск блюд..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category */}
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            <SelectItem value="rolls">Rolls</SelectItem>
            <SelectItem value="bowls">Bowls</SelectItem>
            <SelectItem value="drinks">Drinks</SelectItem>
            <SelectItem value="soups">Soups</SelectItem>
            <SelectItem value="desserts">Desserts</SelectItem>
          </SelectContent>
        </Select>

        {/* Price Range */}
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Мин"
            value={priceMin}
            onChange={(e) => onPriceMinChange(e.target.value)}
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Макс"
            value={priceMax}
            onChange={(e) => onPriceMaxChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Популярные</SelectItem>
            <SelectItem value="price-asc">По цене (возр.)</SelectItem>
            <SelectItem value="price-desc">По цене (убыв.)</SelectItem>
            <SelectItem value="newest">Новые</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
