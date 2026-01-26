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

interface UserDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName: string;
  userEmail: string;
}

/**
 * 🗑️ Диалог подтверждения удаления пользователя
 * Критичная операция - только для super_admin
 */
export function UserDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  userName,
  userEmail,
}: UserDeleteDialogProps) {
  const { t } = useLanguage();
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <AlertDialogTitle>{t.admin.users.actions.deleteUser}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {t.admin.users.actions.confirmDelete}{" "}
            <span className="font-semibold text-foreground">{userName}</span> (
            <span className="text-muted-foreground">{userEmail}</span>)?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {/* ⚠️ Критическое предупреждение */}
        <div className="px-6 pb-2">
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md">
            <p className="text-sm font-bold text-red-800 dark:text-red-300 mb-3">
              ⚠️ {t.admin.users.actions.deleteWarning || "УВАГА: Ця дія НЕ МОЖЕ бути скасована!"}
            </p>
            
            <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-2">
              🗑️ Що буде видалено (каскадне видалення):
            </p>
            <ul className="text-xs text-red-700 dark:text-red-400 space-y-1 list-disc list-inside ml-2">
              <li>Профіль користувача</li>
              <li>Холодильник (fridge_items)</li>
              <li>Сповіщення (notifications)</li>
              <li>Токен банк (token_bank)</li>
              <li>Меню користувача (user_menu_items)</li>
              <li>Сесії рецептів (recipe_sessions)</li>
              <li>Збережені рецепти (saved_recipes)</li>
              <li>Історія приготування (cook_log)</li>
            </ul>
            
            <p className="text-xs font-medium text-red-700 dark:text-red-400 mt-3 mb-2">
              📝 Що залишиться (SET NULL):
            </p>
            <ul className="text-xs text-red-700 dark:text-red-400 space-y-1 list-disc list-inside ml-2">
              <li>Рецепти користувача (author_id = NULL)</li>
              <li>Транзакції токенів (user_id = NULL)</li>
            </ul>

            <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/40 rounded border border-red-300 dark:border-red-800">
              <p className="text-xs font-bold text-red-900 dark:text-red-200">
                💡 Рекомендація: Замість видалення використовуйте "Block" (можна відновити)
              </p>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.admin.users.actions.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            {t.admin.users.actions.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
