"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Ingredient } from "@/hooks/useIngredients";

interface IngredientDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  ingredient: Ingredient | null;
}

export function IngredientDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  ingredient,
}: IngredientDeleteDialogProps) {
  const { t, language } = useLanguage();
  const dialog = t.admin.catalog.products.deleteDialog;
  
  if (!ingredient) return null;
  
  // Get localized ingredient name
  const getIngredientName = (): string => {
    const namePl = ingredient.name_pl || (ingredient as any).namePl;
    const nameEn = ingredient.name_en || (ingredient as any).nameEn;
    const nameRu = ingredient.name_ru || (ingredient as any).nameRu;
    
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
  
  const ingredientName = getIngredientName();
  const usageCount = ingredient.usageCount || 0;
  const isUsedInRecipes = usageCount > 0;
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <AlertDialogTitle>
              {isUsedInRecipes ? dialog.titleBlocked : dialog.title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {isUsedInRecipes ? (
              dialog.descriptionBlocked.replace('{name}', ingredientName)
            ) : (
              <>
                {dialog.description}{" "}
                <span className="font-semibold text-foreground">{ingredientName}</span>?
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isUsedInRecipes ? (
          <div className="px-6 pb-2">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                🚫 {dialog.blockedTitle}
              </p>
              <p 
                className="mt-1 text-xs text-red-700 dark:text-red-400"
                dangerouslySetInnerHTML={{ 
                  __html: dialog.blockedMessage.replace('{count}', usageCount.toString()) 
                }}
              />
            </div>
          </div>
        ) : (
          <div className="px-6 pb-2">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-md">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                ⚠️ {dialog.warning}
              </p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                {dialog.warningMessage}
              </p>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>
            {isUsedInRecipes ? dialog.cancelBlocked : dialog.cancel}
          </AlertDialogCancel>
          {!isUsedInRecipes && (
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              {dialog.confirm}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
