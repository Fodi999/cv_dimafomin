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
import { AlertTriangle, ChefHat } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RecipeDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  recipeTitle: string;
  viewsCount?: number;
  createdAt?: string;
}

export function RecipeDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  recipeTitle,
  viewsCount = 0,
  createdAt,
}: RecipeDeleteDialogProps) {
  const { t, language } = useLanguage();
  const dialog = t.admin.catalog.recipes.deleteDialog;
  
  // Format date if provided
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString(
        language === 'en' ? 'en-US' : language === 'ru' ? 'ru-RU' : 'pl-PL',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {dialog.description}{" "}
            <span className="font-semibold text-foreground flex items-center gap-1 inline-flex">
              <ChefHat className="w-4 h-4" />
              {recipeTitle}
            </span>
            ?
            {formattedDate && (
              <span className="block mt-2 text-xs text-muted-foreground">
                {dialog.createdAt} {formattedDate}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {viewsCount > 0 && (
          <div className="px-6 pb-2">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-md">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                ⚠️ {dialog.viewsWarning}
              </p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                {dialog.viewsMessage.replace('{count}', viewsCount.toString())}
              </p>
            </div>
          </div>
        )}

        <div className="px-6 pb-2">
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              🗑️ {dialog.irreversibleTitle}
            </p>
            <p className="mt-1 text-xs text-red-700 dark:text-red-400">
              {dialog.irreversibleMessage}
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>{dialog.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            {dialog.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
