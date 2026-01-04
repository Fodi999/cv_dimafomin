"use client";

import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIngredientsSearch, Ingredient } from "@/hooks/useIngredients";

interface RecipeIngredient {
  ingredient_id: string;
  name: string;
  amount: number;
  unit: string;
}

interface IngredientSelectorProps {
  selectedIngredients: RecipeIngredient[];
  onAdd: (ingredient: RecipeIngredient) => void;
  onRemove: (id: string) => void;
}

/**
 * 🔍 Ingredient Selector with Autocomplete
 * 
 * Ключевой компонент для выбора ингредиентов из каталога:
 * - Autocomplete из /admin/ingredients
 * - Количество + единица
 * - Запрет дубликатов
 * - Таблица добавленных
 */
export function IngredientSelector({
  selectedIngredients,
  onAdd,
  onRemove,
}: IngredientSelectorProps) {
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState<number>(100);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [showResults, setShowResults] = useState(false);

  const { results, isSearching } = useIngredientsSearch(query);

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setQuery(ingredient.name);
    setShowResults(false);
  };

  const handleAddIngredient = () => {
    if (!selectedIngredient || amount <= 0) return;

    // Check for duplicates
    if (selectedIngredients.some((i) => i.ingredient_id === selectedIngredient.id)) {
      alert("Цей інгредієнт вже додано!");
      return;
    }

    onAdd({
      ingredient_id: selectedIngredient.id,
      name: selectedIngredient.name,
      amount,
      unit: selectedIngredient.unit,
    });

    // Reset
    setQuery("");
    setSelectedIngredient(null);
    setAmount(100);
  };

  return (
    <div className="space-y-4">
      {/* Autocomplete Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-900 dark:text-white">
            Додати інгредієнт
          </label>
          <div className="flex items-center gap-2">
            {results.length > 0 && query.length >= 2 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Знайдено: {results.length}
              </span>
            )}
            <a
              href="/admin/catalog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
            >
              📦 Каталог
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIngredient(null);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Почніть вводити інгредієнт..."
              className="pl-10"
            />
          </div>

          {/* Autocomplete Results */}
          {showResults && query.length >= 2 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-sm text-gray-500">Пошук...</div>
              ) : results.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">
                  Нічого не знайдено. Спочатку додайте інгредієнт у каталог.
                </div>
              ) : (
                results.map((ingredient) => (
                  <button
                    key={ingredient.id}
                    onClick={() => handleSelectIngredient(ingredient)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {ingredient.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {ingredient.unit}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Amount Input */}
      {selectedIngredient && (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Кількість
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="1"
              className="mt-1"
            />
          </div>
          <div className="flex-shrink-0">
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Одиниця
            </div>
            <div className="h-10 px-3 flex items-center bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
              {selectedIngredient.unit}
            </div>
          </div>
          <Button onClick={handleAddIngredient} className="flex-shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Додати
          </Button>
        </div>
      )}

      {/* Selected Ingredients Table */}
      {selectedIngredients.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Інгредієнт
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Кількість
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Одиниця
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {selectedIngredients.map((ingredient) => (
                <tr key={ingredient.ingredient_id}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {ingredient.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {ingredient.amount}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {ingredient.unit}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(ingredient.ingredient_id)}
                      className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedIngredients.length === 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          Інгредієнти ще не додано. Почніть вводити назву вище.
        </div>
      )}
    </div>
  );
}
