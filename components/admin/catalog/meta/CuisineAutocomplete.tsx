/**
 * CuisineAutocomplete - Smart autocomplete with country filtering
 * Filters cuisines based on selected country
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetaCuisine } from "@/lib/meta/types";

interface CuisineAutocompleteProps {
  value: string;                    // cuisineId: "poland", "italian"
  onChange: (cuisineId: string, cuisine: MetaCuisine | null) => void;
  countryCode?: string;             // Filter by country: "PL", "IT"
  required?: boolean;
  disabled?: boolean;
}

export function CuisineAutocomplete({
  value,
  onChange,
  countryCode,
  required = false,
  disabled = false,
}: CuisineAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [cuisines, setCuisines] = useState<MetaCuisine[]>([]);
  const [filteredCuisines, setFilteredCuisines] = useState<MetaCuisine[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<MetaCuisine | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch cuisines on mount or when countryCode changes
  useEffect(() => {
    const fetchCuisines = async () => {
      setIsLoading(true);
      try {
        let url = '/api/meta/cuisines';
        if (countryCode) {
          url += `?countryCode=${countryCode}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch cuisines');
        const data = await response.json();
        setCuisines(data.cuisines || []);
        
        // Set selected cuisine if value exists
        if (value) {
          const selected = data.cuisines.find((c: MetaCuisine) => c.id === value);
          if (selected) {
            setSelectedCuisine(selected);
            setQuery(selected.namePL);
          } else {
            // Value exists but not in filtered list - clear selection
            setSelectedCuisine(null);
            setQuery("");
            onChange("", null);
          }
        }
      } catch (error) {
        console.error('Error fetching cuisines:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCuisines();
  }, [countryCode, value]);

  // Filter cuisines based on query
  useEffect(() => {
    if (!query) {
      setFilteredCuisines(cuisines);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = cuisines.filter((cuisine) => {
      return (
        cuisine.namePL.toLowerCase().includes(lowerQuery) ||
        cuisine.name.toLowerCase().includes(lowerQuery) ||
        cuisine.id.toLowerCase().includes(lowerQuery)
      );
    });

    setFilteredCuisines(filtered);
  }, [query, cuisines]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (cuisine: MetaCuisine) => {
    setSelectedCuisine(cuisine);
    setQuery(cuisine.namePL);
    onChange(cuisine.id, cuisine);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);

    // If query is empty, clear selection
    if (!newQuery) {
      setSelectedCuisine(null);
      onChange('', null);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label htmlFor="cuisine">
        Кухня {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          id="cuisine"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={
            isLoading 
              ? "Завантаження..." 
              : countryCode 
                ? "Кухні вибраної країни..." 
                : "Пошук кухні..."
          }
          className="pl-9 pr-10"
          required={required}
          disabled={disabled || isLoading}
        />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        
        {/* Selected cuisine icon */}
        {selectedCuisine && (
          <span className="absolute right-10 top-1/2 -translate-y-1/2 text-lg">
            {selectedCuisine.icon}
          </span>
        )}
      </div>

      {/* Filter info */}
      {countryCode && cuisines.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Показано кухні країни: {countryCode}
        </p>
      )}

      {/* Dropdown */}
      {isOpen && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCuisines.length === 0 ? (
            <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              {countryCode ? 'Кухонь для цієї країни не знайдено' : 'Кухонь не знайдено'}
            </div>
          ) : (
            filteredCuisines.map((cuisine) => (
              <button
                key={cuisine.id}
                type="button"
                onClick={() => handleSelect(cuisine)}
                className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedCuisine?.id === cuisine.id
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
              >
                <span className="text-2xl">{cuisine.icon}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {cuisine.namePL}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {cuisine.recipeCount} recipes
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
