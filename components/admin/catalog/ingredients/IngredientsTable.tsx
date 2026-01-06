"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Ingredient } from "@/hooks/useIngredients";
import { useLanguage } from "@/contexts/LanguageContext";

interface IngredientsTableProps {
  ingredients: Ingredient[];
  isLoading: boolean;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredient: Ingredient) => void;
}

export function IngredientsTable({
  ingredients,
  isLoading,
  onEdit,
  onDelete,
}: IngredientsTableProps) {
  const { t, language } = useLanguage();

  // Функция для получения локализованного названия ингредиента
  const getIngredientName = (ingredient: Ingredient): string => {
    // Поддерживаем оба формата: snake_case и camelCase
    const namePl = ingredient.name_pl || (ingredient as any).namePl;
    const nameEn = ingredient.name_en || (ingredient as any).nameEn;
    const nameRu = ingredient.name_ru || (ingredient as any).nameRu;
    
    // Debug: показываем первый ингредиент для отладки
    if (ingredients.indexOf(ingredient) === 0) {
      console.log('[IngredientsTable] First ingredient debug:', {
        name: ingredient.name,
        name_pl: ingredient.name_pl,
        name_en: ingredient.name_en,
        name_ru: ingredient.name_ru,
        namePl: (ingredient as any).namePl,
        nameEn: (ingredient as any).nameEn,
        nameRu: (ingredient as any).nameRu,
        resolved_pl: namePl,
        resolved_en: nameEn,
        resolved_ru: nameRu,
        currentLanguage: language,
      });
    }
    
    // Выбираем название в зависимости от текущего языка
    switch (language) {
      case 'en':
        return nameEn || namePl || ingredient.name;
      case 'ru':
        return nameRu || namePl || ingredient.name;
      case 'pl':
      default:
        return namePl || ingredient.name;
    }
  };

  // Функция для получения переведенной категории
  const getCategoryName = (category: string): string => {
    const categoryKey = category as keyof typeof t.admin.catalog.products.categories;
    return t.admin.catalog.products.categories[categoryKey] || category;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          {t.admin.catalog.products.noProducts}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t.admin.catalog.products.table.name}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t.admin.catalog.products.table.category}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t.admin.catalog.products.table.unit}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t.admin.catalog.products.table.usedIn}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t.admin.catalog.products.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {ingredients.map((ingredient) => (
              <tr
                key={ingredient.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getIngredientName(ingredient)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {getCategoryName(ingredient.category)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {ingredient.unit}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {ingredient.usageCount || 0} {t.admin.catalog.products.table.recipes}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(ingredient)}
                      className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(ingredient)}
                      className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
