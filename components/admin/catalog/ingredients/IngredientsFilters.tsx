"use client";

import { Search, Sparkles, TrendingUp, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

// ✅ Culinary categories (not nutrition groups!)
export type CategoryFilter = "all" | "meat" | "fish" | "egg" | "vegetable" | "fruit" | "dairy" | "grain" | "condiment" | "other";

// ✅ Sort options
export type SortOption = "newest" | "name" | "usage";

interface IngredientsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
  sortBy?: SortOption;
  onSortChange?: (value: SortOption) => void;
}

export function IngredientsFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sortBy = "newest",
  onSortChange,
}: IngredientsFiltersProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      {/* Search Input */}
      <div className="flex-1 space-y-2">
        <Label htmlFor="search">{t.admin.catalog.products.search || "Search"}</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder={t.admin.catalog.products.searchPlaceholder || "Search by name (any language)..."}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="w-full space-y-2 md:w-[200px]">
        <Label htmlFor="category">{t.admin.catalog.products.table.category || "Category"}</Label>
        <Select value={categoryFilter} onValueChange={(value) => onCategoryChange(value as CategoryFilter)}>
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.admin.catalog.products.categories.all || "All categories"}</SelectItem>
            <SelectItem value="meat">🥩 {t.admin.catalog.products.categories.meat || "Meat & Poultry"}</SelectItem>
            <SelectItem value="fish">🐟 {t.admin.catalog.products.categories.fish || "Fish & Seafood"}</SelectItem>
            <SelectItem value="egg">🥚 {t.admin.catalog.products.categories.egg || "Eggs"}</SelectItem>
            <SelectItem value="vegetable">🥦 {t.admin.catalog.products.categories.vegetables || "Vegetables"}</SelectItem>
            <SelectItem value="fruit">🍎 {t.admin.catalog.products.categories.fruit || "Fruits & Berries"}</SelectItem>
            <SelectItem value="dairy">🥛 {t.admin.catalog.products.categories.dairy || "Dairy Products"}</SelectItem>
            <SelectItem value="grain">🌾 {t.admin.catalog.products.categories.grains || "Grains & Pasta"}</SelectItem>
            <SelectItem value="condiment">🧂 {t.admin.catalog.products.categories.condiment || "Condiments & Spices"}</SelectItem>
            <SelectItem value="other">📦 {t.admin.catalog.products.categories.other || "Other"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Options */}
      {onSortChange && (
        <div className="w-full space-y-2 md:w-[200px]">
          <Label htmlFor="sort">{t.admin.catalog.products.sort || "Sort by"}</Label>
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
            <SelectTrigger id="sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>{t.admin.catalog.products.sortOptions?.newest || "Newest first"}</span>
                </div>
              </SelectItem>
              <SelectItem value="name">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span>{t.admin.catalog.products.sortOptions?.name || "By name"}</span>
                </div>
              </SelectItem>
              <SelectItem value="usage">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>{t.admin.catalog.products.sortOptions?.usage || "By usage"}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
