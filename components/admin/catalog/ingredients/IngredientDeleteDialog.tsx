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

interface IngredientDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  ingredientName: string;
  usageCount?: number;
}

export function IngredientDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  ingredientName,
  usageCount = 0,
}: IngredientDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <AlertDialogTitle>Видалити інгредієнт?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            Ви впевнені, що хочете видалити інгредієнт{" "}
            <span className="font-semibold text-foreground">{ingredientName}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {usageCount > 0 && (
          <div className="px-6 pb-2">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-md">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                ⚠️ Увага!
              </p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                Цей інгредієнт використовується в {usageCount} рецептах. При
                видаленні він буде видалений з усіх рецептів.
              </p>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>Скасувати</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Так, видалити
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
