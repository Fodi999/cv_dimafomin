"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Ingredient } from "@/hooks/useIngredients";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { 
  getProductAge, 
  getProductAgeBadgeText, 
  getProductAgeRowClass,
  formatProductDate 
} from "@/lib/utils/getProductAge";

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
          <Skeleton key={i} className="h-14 sm:h-16 w-full" />
        ))}
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          {t.admin.catalog.products.noProducts}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Desktop: Таблица */}
      <div className="hidden md:block overflow-x-auto">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Dodano
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t.admin.catalog.products.table.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {ingredients.map((ingredient) => {
              const age = ingredient.createdAt ? getProductAge(ingredient.createdAt) : "old";
              const rowClass = getProductAgeRowClass(age);
              
              return (
                <tr
                  key={ingredient.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${rowClass}`}
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ingredient.createdAt ? (
                      age === "today" ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700">
                          {getProductAgeBadgeText("today", language)}
                        </Badge>
                      ) : age === "new" ? (
                        <Badge variant="secondary">
                          {getProductAgeBadgeText("new", language)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          {formatProductDate(ingredient.createdAt, `${language}-${language.toUpperCase()}`)}
                        </span>
                      )
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: Карточки с анимацией */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {ingredients.map((ingredient, index) => {
          const age = ingredient.createdAt ? getProductAge(ingredient.createdAt) : "old";
          const rowClass = getProductAgeRowClass(age);
          
          return (
            <motion.div
              key={ingredient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 sm:p-4 ${rowClass}`}
            >
              <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white mb-1 truncate">
                    {getIngredientName(ingredient)}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {getCategoryName(ingredient.category)}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {ingredient.unit}
                    </span>
                    {ingredient.createdAt && (
                      age === "today" ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-700 text-xs">
                          {getProductAgeBadgeText("today", language)}
                        </Badge>
                      ) : age === "new" ? (
                        <Badge variant="secondary" className="text-xs">
                          {getProductAgeBadgeText("new", language)}
                        </Badge>
                      ) : null
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span>
                      {ingredient.usageCount || 0} {t.admin.catalog.products.table.recipes}
                    </span>
                    {ingredient.createdAt && age === "old" && (
                      <span className="text-muted-foreground">
                        {formatProductDate(ingredient.createdAt, `${language}-${language.toUpperCase()}`)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(ingredient)}
                    className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(ingredient)}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
