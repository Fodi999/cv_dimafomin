/**
 * CategorySelect - Dropdown with icons and sorted by order
 * Categories are NEVER entered manually
 */

"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetaCategory } from "@/lib/meta/types";

interface CategorySelectProps {
  value: string;                    // categoryId: "main", "salad"
  onChange: (categoryId: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function CategorySelect({
  value,
  onChange,
  required = false,
  disabled = false,
}: CategorySelectProps) {
  const [categories, setCategories] = useState<MetaCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/meta/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        
        // Sort by order
        const sorted = (data.categories || []).sort(
          (a: MetaCategory, b: MetaCategory) => a.order - b.order
        );
        
        setCategories(sorted);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const selectedCategory = categories.find((c) => c.id === value);

  return (
    <div className="space-y-2">
      <Label htmlFor="category">
        Категорія {required && <span className="text-red-500">*</span>}
      </Label>

      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger id="category">
          <SelectValue>
            {isLoading ? (
              "Завантаження..."
            ) : selectedCategory ? (
              <div className="flex items-center gap-2">
                <span>{selectedCategory.icon}</span>
                <span>{selectedCategory.namePL}</span>
                <span className="text-xs text-gray-500">
                  ({selectedCategory.recipeCount})
                </span>
              </div>
            ) : (
              "Виберіть категорію..."
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <span>{category.icon}</span>
                <span>{category.namePL}</span>
                <span className="text-xs text-gray-500">
                  ({category.recipeCount})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
