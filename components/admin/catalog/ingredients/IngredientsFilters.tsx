"use client";

import { Search } from "lucide-react";
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

export type CategoryFilter = "all" | "protein" | "vegetable" | "dairy" | "grain" | "condiment" | "other";

interface IngredientsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (value: CategoryFilter) => void;
}

export function IngredientsFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
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
            <SelectItem value="vegetable">🥦 {t.admin.catalog.products.categories.vegetables}</SelectItem>
            <SelectItem value="protein">🥩 {t.admin.catalog.products.categories.meat}</SelectItem>
            <SelectItem value="dairy">🥛 {t.admin.catalog.products.categories.dairy}</SelectItem>
            <SelectItem value="grain">🌾 {t.admin.catalog.products.categories.grains}</SelectItem>
            <SelectItem value="condiment">🧂 {t.admin.catalog.products.categories.condiment}</SelectItem>
            <SelectItem value="other">📦 {t.admin.catalog.products.categories.other}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
