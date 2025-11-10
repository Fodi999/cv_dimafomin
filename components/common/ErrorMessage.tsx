// ErrorMessage.tsx - Компонент для відображення помилок

import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({
  title = "Помилка",
  message,
  onRetry,
  onDismiss,
  className = ""
}: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-xl p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-rose-900 dark:text-rose-300 mb-1">{title}</h4>
          <p className="text-sm text-rose-700 dark:text-rose-400">{message}</p>
          {(onRetry || onDismiss) && (
            <div className="flex gap-2 mt-3">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  size="sm"
                  variant="outline"
                  className="border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Спробувати ще раз
                </Button>
              )}
              {onDismiss && (
                <Button
                  onClick={onDismiss}
                  size="sm"
                  variant="ghost"
                  className="text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40"
                >
                  Закрити
                </Button>
              )}
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-rose-400 dark:text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
