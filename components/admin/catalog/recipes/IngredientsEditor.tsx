"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Trash2, GripVertical, Package, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Ingredient {
  id: string;
  name: string;
  namePl?: string;
  nameEn?: string;
  category?: string;
}

interface RecipeIngredient {
  id?: string;
  ingredientId: string;
  ingredientName: string;
  amount: number;
  unit: string;
}

interface IngredientsEditorProps {
  value: RecipeIngredient[];
  onChange: (ingredients: RecipeIngredient[]) => void;
  recipeId?: string; // Optional: only needed if backend API calls require it
}

const UNITS = [
  { value: 'g', label: 'г (грами)' },
  { value: 'kg', label: 'кг (кілограми)' },
  { value: 'ml', label: 'мл (мілілітри)' },
  { value: 'l', label: 'л (літри)' },
  { value: 'pcs', label: 'шт (штуки)' },
  { value: 'tbsp', label: 'ст.л. (столові ложки)' },
  { value: 'tsp', label: 'ч.л. (чайні ложки)' },
  { value: 'cup', label: 'склянка' },
];

export function IngredientsEditor({ value, onChange, recipeId }: IngredientsEditorProps) {
  // Local state only for UI (search, form)
  const [searchTerm, setSearchTerm] = useState('');
  const [catalogIngredients, setCatalogIngredients] = useState<Ingredient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  // New ingredient form
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [unit, setUnit] = useState<string>('g');

  // Search catalog
  useEffect(() => {
    if (searchTerm.length < 2) {
      setCatalogIngredients([]);
      return;
    }

    const debounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/admin/ingredients?search=${encodeURIComponent(searchTerm)}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          setCatalogIngredients(data.ingredients || []);
        }
      } catch (error) {
        console.error('Error searching ingredients:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleAddIngredient = async () => {
    if (!selectedIngredient || amount <= 0) {
      toast.error('Оберіть інгредієнт та вкажіть кількість');
      return;
    }

    // Check for duplicates
    if (value.some((i: RecipeIngredient) => i.ingredientId === selectedIngredient.id)) {
      toast.error('Цей інгредієнт вже додано');
      return;
    }

    try {
      // If recipeId exists, save to backend
      if (recipeId) {
        const response = await fetch(`/api/admin/recipes/${recipeId}/ingredients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ingredientId: selectedIngredient.id,
            amount,
            unit,
          }),
        });

        if (!response.ok) throw new Error('Failed to add ingredient');

        const responseData = await response.json();
        const newIngredient: RecipeIngredient = {
          id: responseData.id,
          ingredientId: selectedIngredient.id,
          ingredientName: selectedIngredient.namePl || selectedIngredient.name,
          amount,
          unit,
        };

        onChange([...value, newIngredient]);
      } else {
        // Create mode: just add to local state
        const newIngredient: RecipeIngredient = {
          ingredientId: selectedIngredient.id,
          ingredientName: selectedIngredient.namePl || selectedIngredient.name,
          amount,
          unit,
        };
        onChange([...value, newIngredient]);
      }
      
      // Reset form
      setSelectedIngredient(null);
      setAmount(0);
      setUnit('g');
      setSearchTerm('');
      setShowSearch(false);
      
      toast.success('Інгредієнт додано');
    } catch (error) {
      console.error('Error adding ingredient:', error);
      toast.error('Помилка при додаванні інгредієнта');
    }
  };

  const handleRemoveIngredient = async (ingredientId: string) => {
    try {
      // If recipeId exists and ingredient has ID, delete from backend
      if (recipeId && ingredientId) {
        const response = await fetch(`/api/admin/recipes/${recipeId}/ingredients/${ingredientId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to remove ingredient');
      }

      // Update local state
      onChange(value.filter((i: RecipeIngredient) => i.id !== ingredientId));
      toast.success('Інгредієнт видалено');
    } catch (error) {
      console.error('Error removing ingredient:', error);
      toast.error('Помилка при видаленні інгредієнта');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Інгредієнти
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {value.length} інгредієнтів додано
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Додати інгредієнт
        </Button>
      </div>

      {/* Add Ingredient Form */}
      {showSearch && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Search */}
            <div className="md:col-span-5 space-y-2">
              <Label htmlFor="ingredient-search" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Інгредієнт з каталогу
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="ingredient-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Шукати: ziemniak, cebula, twaróg..."
                  className="pl-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              {/* Search Results */}
              {catalogIngredients.length > 0 && (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {catalogIngredients.map((ing) => (
                    <button
                      key={ing.id}
                      type="button"
                      onClick={() => {
                        setSelectedIngredient(ing);
                        setSearchTerm(ing.namePl || ing.name);
                        setCatalogIngredients([]);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {ing.namePl || ing.name}
                      </div>
                      {ing.nameEn && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {ing.nameEn}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Amount */}
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Кількість
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="500"
                min="0"
                step="0.1"
              />
            </div>

            {/* Unit */}
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="unit" className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Одиниця
              </Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add Button */}
            <div className="md:col-span-1 flex items-end">
              <Button
                type="button"
                onClick={handleAddIngredient}
                disabled={!selectedIngredient || amount <= 0}
                className="w-full"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {selectedIngredient && (
            <div className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Обрано: <strong>{selectedIngredient.namePl || selectedIngredient.name}</strong>
            </div>
          )}
        </div>
      )}

      {/* Ingredients List */}
      {value.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Інгредієнтів ще немає
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Натисніть "Додати інгредієнт" для початку
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {value.map((ing: RecipeIngredient, index: number) => (
            <div
              key={ing.id || index}
              className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              {/* Drag Handle */}
              <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
              
              {/* Ingredient Name */}
              <div className="flex-1 font-medium text-gray-900 dark:text-gray-100">
                {ing.ingredientName}
              </div>
              
              {/* Amount */}
              <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                {ing.amount} {ing.unit}
              </div>
              
              {/* Delete */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => ing.id && handleRemoveIngredient(ing.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
