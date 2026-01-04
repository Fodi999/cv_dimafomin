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
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <AlertDialogTitle>Видалити користувача?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            Ви впевнені, що хочете видалити користувача{" "}
            <span className="font-semibold text-foreground">{userName}</span> (
            <span className="text-muted-foreground">{userEmail}</span>)?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {/* Warning block outside of <p> tag */}
        <div className="px-6 pb-2">
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-md">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              ⚠️ Це незворотна дія!
            </p>
            <ul className="mt-2 text-xs text-red-700 dark:text-red-400 space-y-1 list-disc list-inside">
              <li>Усі дані користувача будуть видалені</li>
              <li>Історія замовлень буде втрачена</li>
              <li>Відновлення буде неможливим</li>
            </ul>
          </div>
        </div>
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
