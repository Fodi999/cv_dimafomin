/**
 * CountryAutocomplete - Professional autocomplete for country selection
 * Stores countryCode, displays localized name + flag
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetaCountry } from "@/lib/meta/types";

interface CountryAutocompleteProps {
  value: string;                    // countryCode: "PL", "US"
  onChange: (code: string, country: MetaCountry | null) => void;
  required?: boolean;
  disabled?: boolean;
}

export function CountryAutocomplete({
  value,
  onChange,
  required = false,
  disabled = false,
}: CountryAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState<MetaCountry[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<MetaCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<MetaCountry | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/meta/countries');
        if (!response.ok) throw new Error('Failed to fetch countries');
        const data = await response.json();
        setCountries(data.countries || []);
        
        // Set selected country if value exists
        if (value) {
          const selected = data.countries.find((c: MetaCountry) => c.code === value);
          if (selected) {
            setSelectedCountry(selected);
            setQuery(selected.namePL);
          }
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, [value]);

  // Filter countries based on query
  useEffect(() => {
    if (!query) {
      setFilteredCountries(countries);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = countries.filter((country) => {
      return (
        country.namePL.toLowerCase().includes(lowerQuery) ||
        country.name.toLowerCase().includes(lowerQuery) ||
        country.code.toLowerCase().includes(lowerQuery)
      );
    });

    setFilteredCountries(filtered);
  }, [query, countries]);

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

  const handleSelect = (country: MetaCountry) => {
    setSelectedCountry(country);
    setQuery(country.namePL);
    onChange(country.code, country);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);

    // If query is empty, clear selection
    if (!newQuery) {
      setSelectedCountry(null);
      onChange('', null);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label htmlFor="country">
        Країна {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          id="country"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={isLoading ? "Завантаження..." : "Пошук країни..."}
          className="pl-9 pr-10"
          required={required}
          disabled={disabled || isLoading}
        />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        
        {/* Selected country flag */}
        {selectedCountry && (
          <span className="absolute right-10 top-1/2 -translate-y-1/2 text-lg">
            {selectedCountry.flag}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCountries.length === 0 ? (
            <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
              Країн не знайдено
            </div>
          ) : (
            filteredCountries.map((country) => (
              <button
                key={country.id}
                type="button"
                onClick={() => handleSelect(country)}
                className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedCountry?.code === country.code
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
              >
                <span className="text-2xl">{country.flag}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {country.namePL}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {country.code} • {country.recipeCount} recipes
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
