// EmptyState.tsx - Компонент для відображення порожнього стану

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gradients } from "@/lib/design-tokens";

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  actionLabel,
  onAction,
  className = ""
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}
    >
      {emoji && (
        <span className="text-6xl mb-4">{emoji}</span>
      )}
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-950/40 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-sky-400 dark:text-sky-500" />
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className={`${gradients.primary} hover:shadow-lg dark:hover:shadow-sky-500/30 text-white`}
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
