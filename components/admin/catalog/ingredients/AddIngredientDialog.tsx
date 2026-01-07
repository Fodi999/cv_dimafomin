"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus, AlertCircle, Check, AlertTriangle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createIngredient, getIngredientSuggestions } from "@/lib/api/ingredients.api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIngredients } from "@/hooks/useIngredients";
import { 
  getCategoryLabel, 
  getNutritionLabel, 
  getCategoryIcon, 
  getNutritionIcon 
} from "@/lib/constants/ingredientCategories";

interface AddIngredientDialogProps {
  onCreated?: (ingredientId: string) => void;
  onSelected?: (ingredientId: string) => void;
}

/**
 * Нормализация названия (та же логика что на бекенде)
 * Убирает пробелы, спецсимволы, приводит к lowercase
 */
function normalizeIngredientName(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-zа-яё]/gi, '');
}

/**
 * Получить название продукта по языку
 */
function getIngredientName(ingredient: any, lang: string): string {
  if (lang === 'ru') return ingredient.nameRu || ingredient.namePl || ingredient.nameEn || ingredient.name;
  if (lang === 'pl') return ingredient.namePl || ingredient.nameRu || ingredient.nameEn || ingredient.name;
  if (lang === 'en') return ingredient.nameEn || ingredient.namePl || ingredient.nameRu || ingredient.name;
  return ingredient.name || ingredient.nameRu || ingredient.namePl || ingredient.nameEn;
}

/**
 * Перевод единиц измерения на русский
 */
function getUnitNameRu(unit: string): string {
  const units: Record<string, string> = {
    'g': 'г',
    'kg': 'кг',
    'ml': 'мл',
    'l': 'л',
    'pcs': 'шт',
    'tbsp': 'ст.л.',
    'tsp': 'ч.л.',
    'cup': 'стакан',
    'pinch': 'щепотка'
  };
  return units[unit.toLowerCase()] || unit;
}

export function AddIngredientDialog({ onCreated, onSelected }: AddIngredientDialogProps) {
  const { t, language } = useLanguage();
  const { ingredients, isLoading: ingredientsLoading } = useIngredients();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Debounced fetch suggestions
  useEffect(() => {
    if (!name.trim() || name.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);
        const result = await getIngredientSuggestions(name, 5, language);
        setSuggestions(result.suggestions || []);
      } catch (error) {
        console.error('[AddIngredientDialog] Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [name, language]); // Added language dependency

  // Предиктивная проверка дубликата (без запроса к API)
  const existingIngredient = useMemo(() => {
    if (!name.trim() || !ingredients.length) return null;

    const normalizedInput = normalizeIngredientName(name.trim());
    if (!normalizedInput) return null;

    return ingredients.find(ing => {
      // Проверяем все варианты названий (только camelCase)
      const variants = [
        ing.nameEn,
        ing.namePl,
        ing.nameRu,
        ing.name
      ].filter(Boolean) as string[];

      return variants.some(variant => 
        normalizeIngredientName(variant) === normalizedInput
      );
    });
  }, [name, ingredients]);

  // Определение типа совпадения для подсказок
  const getSuggestionMatchType = useCallback((suggestion: any): 'exact' | 'similar' | 'weak' => {
    const normalizedInput = normalizeIngredientName(name.trim());
    const normalizedSuggestion = normalizeIngredientName(
      suggestion.nameRu || suggestion.namePl || suggestion.nameEn || suggestion.name
    );

    if (normalizedInput === normalizedSuggestion) return 'exact';
    if (normalizedSuggestion.startsWith(normalizedInput)) return 'similar';
    return 'weak';
  }, [name]);

  // Группировка подсказок по типу совпадения
  const groupedSuggestions = useMemo(() => {
    const exact: any[] = [];
    const similar: any[] = [];
    const weak: any[] = [];

    suggestions.forEach(sug => {
      const matchType = getSuggestionMatchType(sug);
      if (matchType === 'exact') exact.push(sug);
      else if (matchType === 'similar') similar.push(sug);
      else weak.push(sug);
    });

    return { exact, similar, weak };
  }, [suggestions, getSuggestionMatchType]);

  const resetForm = () => {
    setName("");
    setSuggestions([]);
  };

  // Выбрать подсказку из списка
  const handleSelectSuggestion = useCallback((suggestion: any) => {
    toast.success("Продукт выбран из каталога", {
      description: getIngredientName(suggestion, language)
    });
    
    if (onSelected) {
      onSelected(suggestion.id);
    }
    
    setOpen(false);
    resetForm();
  }, [onSelected, language]);

  // Использовать существующий продукт
  const handleUseExisting = useCallback(() => {
    if (!existingIngredient) return;
    
    toast.success("Продукт выбран из каталога", {
      description: getIngredientName(existingIngredient, language)
    });
    
    if (onSelected) {
      onSelected(existingIngredient.id);
    }
    
    setOpen(false);
    resetForm();
  }, [existingIngredient, onSelected, language]);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    
    // Базовая валидация
    if (!trimmedName) {
      toast.error("Введите название продукта");
      return;
    }

    if (trimmedName.length > 40) {
      toast.warning("Слишком длинное название (максимум 40 символов)");
      return;
    }

    // Предиктивная проверка дубликата (не отправляем запрос)
    if (existingIngredient) {
      toast.info("Этот продукт уже есть в каталоге", {
        description: getIngredientName(existingIngredient, language)
      });
      return;
    }

    try {
      setLoading(true);

      const res = await createIngredient(trimmedName);

      // apiFetch возвращает сразу data, не обёрнутый в { success, data }
      if (!res || !res.namePl) {
        console.error('[AddIngredientDialog] Invalid response structure:', res);
        toast.error("Неверный формат ответа от сервера");
        return;
      }

      toast.success(
        `Добавлено: ${res.namePl} · ${res.category}`,
        { description: `${res.nameEn} / ${res.nameRu}` }
      );
      
      setOpen(false);
      resetForm();
      
      // Обновить список
      if (onCreated) {
        onCreated(res.id);
      }
    } catch (error: any) {
      // 409 Conflict = ингредиент уже существует (это НЕ ошибка, а информация)
      if (error?.status === 409 || error?.statusCode === 409) {
        toast.info("Этот продукт уже есть в каталоге", {
          description: "AI обнаружил дубликат при нормализации названия"
        });
        setOpen(false);
        resetForm();
        // Не передаем ID т.к. неизвестен из 409 ответа
        if (onCreated) {
          onCreated("");
        }
        return;
      }

      // Остальные ошибки
      console.error("[AddIngredientDialog] Error:", error);
      toast.error(error?.message || "Не удалось добавить продукт");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{t.admin.catalog.products.addProduct}</span>
          <span className="sm:hidden">Добавить</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{t.admin.catalog.products.addProduct}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Введите название продукта. AI автоматически определит категорию, единицу измерения и переведёт название.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
          {/* Название продукта - ЕДИНСТВЕННОЕ ПОЛЕ */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm sm:text-base">Название продукта</Label>
            <Input
              id="name"
              placeholder="Например: Avocado, Огурец"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoFocus
              className={`text-base ${existingIngredient ? "border-yellow-500 focus-visible:ring-yellow-500" : ""}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim() && !existingIngredient) {
                  handleSubmit();
                }
              }}
            />
            
            {/* Exact match - продукт уже существует */}
            {existingIngredient ? (
              <div className="flex flex-col items-start gap-3 text-xs sm:text-sm bg-red-50 dark:bg-red-950/20 p-3 sm:p-4 rounded-lg border-2 border-red-200 dark:border-red-800">
                <div className="flex items-start gap-2 w-full">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900 dark:text-red-200 mb-2">
                      Такой продукт уже существует
                    </p>
                    
                    {/* Карточка продукта */}
                    <div className="bg-white dark:bg-gray-900 rounded-md p-3 space-y-2 border border-red-100 dark:border-red-900">
                      {/* Название продукта */}
                      <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                        {getIngredientName(existingIngredient, language)}
                      </div>
                      
                      {/* Категории в строку */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Кулинарная категория */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                          <span className="text-sm">{getCategoryIcon(existingIngredient.category)}</span>
                          <span className="text-xs font-medium">{getCategoryLabel(existingIngredient.category)}</span>
                        </div>
                        
                        {/* Нутриентная группа */}
                        {existingIngredient.nutritionGroup && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100">
                            <span className="text-sm">{getNutritionIcon(existingIngredient.nutritionGroup)}</span>
                            <span className="text-xs font-medium">{getNutritionLabel(existingIngredient.nutritionGroup)}</span>
                          </div>
                        )}
                        
                        {/* Единица измерения */}
                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          <span className="text-xs font-medium">{getUnitNameRu(existingIngredient.unit)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Действия */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full pt-2 border-t border-red-200 dark:border-red-800">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleUseExisting}
                    className="flex-1 sm:flex-initial h-9 text-sm font-medium border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/40"
                  >
                    <Check className="mr-1.5 h-4 w-4" />
                    Использовать этот продукт
                  </Button>
                  <span className="text-xs text-center sm:text-left text-red-700 dark:text-red-400">
                    или введите другое название
                  </span>
                </div>
              </div>
            ) : null}

            {/* Similar/Weak match - похожие продукты (autocomplete) */}
            {!existingIngredient && (groupedSuggestions.similar.length > 0 || groupedSuggestions.weak.length > 0) ? (
              <div className="space-y-2">
                {/* Similar matches */}
                {groupedSuggestions.similar.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-300 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Похожие продукты
                    </p>
                    <div className="space-y-1.5">
                      {groupedSuggestions.similar.map((sug) => (
                        <button
                          key={sug.id}
                          onClick={() => handleSelectSuggestion(sug)}
                          className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors flex items-center justify-between gap-3 bg-white dark:bg-gray-900 border border-yellow-100 dark:border-yellow-900"
                        >
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {getIngredientName(sug, language)}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-sm">{getCategoryIcon(sug.category)}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {getCategoryLabel(sug.category)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weak matches */}
                {groupedSuggestions.weak.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Другие варианты
                    </p>
                    <div className="space-y-1.5">
                      {groupedSuggestions.weak.map((sug) => (
                        <button
                          key={sug.id}
                          onClick={() => handleSelectSuggestion(sug)}
                          className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors flex items-center justify-between gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                        >
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {getIngredientName(sug, language)}
                          </span>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-sm">{getCategoryIcon(sug.category)}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {getCategoryLabel(sug.category)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Loading suggestions */}
            {loadingSuggestions && (
              <div className="text-xs text-muted-foreground animate-pulse">
                Поиск похожих продуктов...
              </div>
            )}

            {/* No suggestions - show hint */}
            {!existingIngredient && !loadingSuggestions && suggestions.length === 0 && name.length >= 2 && (
              <p className="text-xs text-muted-foreground">
                AI автоматически определит категорию, единицу измерения и переведёт название.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)} 
            disabled={loading}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {t.common.cancel}
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !name.trim() || !!existingIngredient}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {loading ? (
              <>
                <span className="mr-2">⏳</span>
                Создание...
              </>
            ) : existingIngredient ? (
              <span className="text-xs sm:text-sm">Продукт уже существует</span>
            ) : (
              "Создать"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
