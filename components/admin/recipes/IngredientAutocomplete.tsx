/**
 * Search Selector for Ingredients
 * Like Notion/Figma: Always show results, click to select
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getIngredientSuggestions } from "@/lib/api/ingredients.api";
import { getCategoryIcon } from "@/lib/constants/ingredientCategories";

interface Ingredient {
  id: string;
  nameRu?: string;
  namePl?: string;
  nameEn?: string;
  category: string;
  nutritionGroup?: string;
  unit: string;
}

interface IngredientAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (ingredient: Ingredient) => void;
  onCreateNew: (input: string) => void;
  placeholder?: string;
  language: string;
}

function getIngredientName(ingredient: Ingredient, lang: string): string {
  const namePl = (ingredient as any).name_pl || ingredient.namePl;
  const nameEn = (ingredient as any).name_en || ingredient.nameEn;
  const nameRu = (ingredient as any).name_ru || ingredient.nameRu;
  const fallbackName = (ingredient as any).name;
  
  // Try language-specific first, then fallback to 'name' field
  switch (lang) {
    case 'en':
      return nameEn || namePl || fallbackName || 'Unknown';
    case 'ru':
      return nameRu || fallbackName || namePl || 'Unknown';
    case 'pl':
    default:
      return namePl || fallbackName || 'Unknown';
  }
}

export function IngredientAutocomplete({
  value,
  onChange,
  onSelect,
  onCreateNew,
  placeholder = "Начните вводить название...",
  language
}: IngredientAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search with AbortController (CRITICAL: prevents race conditions)
  useEffect(() => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    setIsOpen(true); // Open dropdown when typing
    
    // ✅ CRITICAL: AbortController отменяет предыдущий запрос
    const abortController = new AbortController();
    
    const timer = setTimeout(async () => {
      try {
        // Pass current language to API for better results
        const response = await getIngredientSuggestions(value, 10, language);
        
        // Проверка: если запрос был отменён, не обновляем state
        if (abortController.signal.aborted) {
          console.log('[Autocomplete] Request aborted');
          return;
        }
        
        console.log('[DEBUG] Full API response:', response);
        console.log('[DEBUG] response.suggestions:', response?.suggestions);
        console.log('[DEBUG] response.data:', (response as any)?.data);
        
        const results = response?.suggestions || [];
        
        console.log(`[Autocomplete] Query: "${value}" → Raw results: ${results.length}`);
        
        // Debug: show first item fields
        if (results.length > 0) {
          const first = results[0];
          console.log('[DEBUG] First item fields:', {
            name: first.name,
            nameRu: first.nameRu,
            name_ru: (first as any).name_ru,
            namePl: first.namePl,
            name_pl: (first as any).name_pl
          });
        }
        
        // Normalize data - NO FILTERING, just field mapping
        const normalized = results.map((item: any) => ({
          id: item.id,
          nameRu: item.nameRu || item.name_ru,
          namePl: item.namePl || item.name_pl,
          nameEn: item.nameEn || item.name_en,
          category: item.category,
          nutritionGroup: item.nutritionGroup || item.nutrition_group,
          unit: item.unit,
          // Keep ALL original fields for maximum compatibility
          name: item.name,
          name_pl: item.name_pl,
          name_en: item.name_en,
          name_ru: item.name_ru
        }));
        
        console.log(`[Autocomplete] Normalized: ${normalized.length} items`);
        setSuggestions(normalized);
      } catch (error: any) {
        // ✅ CRITICAL: НЕ показываем ошибку если запрос был отменён
        if (error.name === 'AbortError' || abortController.signal.aborted) {
          console.log('[Autocomplete] Request cancelled');
          return;
        }
        
        console.error('[Autocomplete] Error:', error);
        setSuggestions([]);
        // ❌ НЕ RETRY на 500 (как в требованиях)
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300); // ✅ debounce ≥ 300ms (как в требованиях)

    // Cleanup: отменяем запрос при новом вводе
    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [value, language]); // Added language dependency

  const handleSelect = useCallback((ingredient: Ingredient) => {
    onSelect(ingredient);
    setIsOpen(false);
  }, [onSelect]);

  const handleCreate = useCallback(() => {
    onCreateNew(value);
    setIsOpen(false);
  }, [value, onCreateNew]);

  const showDropdown = isOpen && value.length >= 2;
  const hasSuggestions = suggestions.length > 0;

  return (
    <div ref={wrapperRef} className="relative">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length >= 2 && setIsOpen(true)}
          placeholder={placeholder}
          className="pl-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          
          {/* Results list */}
          {hasSuggestions ? (
            <div className="py-1">
              {suggestions.map((ingredient) => {
                const icon = getCategoryIcon(ingredient.category);
                const name = getIngredientName(ingredient, language);

                return (
                  <button
                    key={ingredient.id}
                    onClick={() => handleSelect(ingredient)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors"
                  >
                    <span className="text-lg flex-shrink-0">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{name}</div>
                      <div className="text-xs text-muted-foreground">
                        {ingredient.category} • {ingredient.unit}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            !loading && (
              <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                Ничего не найдено
              </div>
            )
          )}

          {/* Create new button (always at bottom if typing) */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCreate}
              className="w-full justify-start gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
            >
              <Plus className="h-4 w-4" />
              Создать «{value}»
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
