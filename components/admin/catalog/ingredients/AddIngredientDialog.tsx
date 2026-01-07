"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, AlertCircle, Check } from "lucide-react";
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
import { createIngredient } from "@/lib/api/ingredients.api";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIngredients } from "@/hooks/useIngredients";
import { 
  getCategoryLabel, 
  getNutritionLabel, 
  getCategoryIcon, 
  getNutritionIcon 
} from "@/lib/constants/ingredientCategories";

interface AddIngredientDialogProps {
  onCreated?: () => void;
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
  const { t } = useLanguage();
  const { ingredients, isLoading: ingredientsLoading } = useIngredients();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  // Предиктивная проверка дубликата (без запроса к API)
  const existingIngredient = useMemo(() => {
    if (!name.trim() || !ingredients.length) return null;

    const normalizedInput = normalizeIngredientName(name.trim());
    if (!normalizedInput) return null;

    return ingredients.find(ing => {
      // Проверяем все варианты названий
      const variants = [
        ing.name_en ?? ing.nameEn,
        ing.name_pl ?? ing.namePl,
        ing.name_ru ?? ing.nameRu,
        ing.name
      ].filter(Boolean) as string[];

      return variants.some(variant => 
        normalizeIngredientName(variant) === normalizedInput
      );
    });
  }, [name, ingredients]);

  const resetForm = () => {
    setName("");
  };

  // Использовать существующий продукт
  const handleUseExisting = useCallback(() => {
    if (!existingIngredient) return;
    
    toast.success("Продукт выбран из каталога", {
      description: existingIngredient.name_ru ?? existingIngredient.nameRu ?? existingIngredient.name
    });
    
    if (onSelected) {
      onSelected(existingIngredient.id);
    }
    
    setOpen(false);
    resetForm();
  }, [existingIngredient, onSelected]);

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
        description: `${existingIngredient.name_ru ?? existingIngredient.nameRu ?? existingIngredient.name}`
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
        onCreated();
      }
    } catch (error: any) {
      // 409 Conflict = ингредиент уже существует (это НЕ ошибка, а информация)
      if (error?.status === 409 || error?.statusCode === 409) {
        toast.info("Этот продукт уже есть в каталоге", {
          description: "AI обнаружил дубликат при нормализации названия"
        });
        setOpen(false);
        resetForm();
        // Обновить список чтобы пользователь увидел существующий
        if (onCreated) {
          onCreated();
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
            
            {/* Предупреждение о дубликате */}
            {existingIngredient ? (
              <div className="flex flex-col sm:flex-row items-start gap-2 text-xs sm:text-sm text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 p-2 sm:p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 w-full">
                  <p className="font-medium">Такой продукт уже существует:</p>
                  <div className="mt-1.5 sm:mt-2 space-y-1">
                    {/* Название продукта */}
                    <div className="font-semibold text-sm sm:text-base">
                      {existingIngredient.name_ru ?? existingIngredient.nameRu ?? existingIngredient.name}
                    </div>
                    
                    {/* Кулинарная категория (category) - ОСНОВНАЯ */}
                    <div className="flex items-center gap-1.5 text-sm">
                      <span>{getCategoryIcon(existingIngredient.category)}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {getCategoryLabel(existingIngredient.category)}
                      </span>
                    </div>
                    
                    {/* Нутриентная группа (nutritionGroup) - ДОПОЛНИТЕЛЬНАЯ */}
                    {existingIngredient.nutritionGroup && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span>{getNutritionIcon(existingIngredient.nutritionGroup)}</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {getNutritionLabel(existingIngredient.nutritionGroup)}
                        </span>
                      </div>
                    )}
                    
                    {/* Единица измерения */}
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {getUnitNameRu(existingIngredient.unit)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleUseExisting}
                      className="h-8 sm:h-7 text-xs w-full sm:w-auto"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Использовать
                    </Button>
                    <span className="text-xs text-muted-foreground">или введите другое название</span>
                  </div>
                </div>
              </div>
            ) : (
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
