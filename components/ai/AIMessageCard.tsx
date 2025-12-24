/**
 * 🤖 AIMessageCard - Single Source of Truth for AI Communication
 * 
 * This component is the ONLY way AI communicates with users.
 * No more:
 * - toast.error(...)
 * - alert(...)
 * - scattered if (error) blocks
 * 
 * Pattern:
 * 1. Backend returns: { code: "NO_RECIPES_FOR_FRIDGE", context: {...} }
 * 2. Frontend renders: <AIMessageCard code="NO_RECIPES_FOR_FRIDGE" context={{...}} />
 * 3. All text comes from i18n/pl/ai.ts
 * 
 * Usage:
 * ```tsx
 * <AIMessageCard
 *   code="NO_RECIPES_FOR_FRIDGE"
 *   context={{ fridgeItems: 5 }}
 *   onAction={handleAIAction}
 * />
 * ```
 */

"use client";

import { motion } from "framer-motion";
import { X, Sparkles, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { getAIMessage, FALLBACK_MESSAGE, type AIMessageContext } from "@/i18n/pl/ai";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Icon mapping for action buttons
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Plus: require("lucide-react").Plus,
  Save: require("lucide-react").Save,
  Search: require("lucide-react").Search,
  RefreshCw: require("lucide-react").RefreshCw,
  ShoppingCart: require("lucide-react").ShoppingCart,
  Refrigerator: require("lucide-react").Refrigerator,
  Wallet: require("lucide-react").Wallet,
  Settings: require("lucide-react").Settings,
  LogIn: require("lucide-react").LogIn,
  ChefHat: require("lucide-react").ChefHat,
  ArrowLeft: require("lucide-react").ArrowLeft,
};

type AIMessageCardProps = {
  /** Message code from backend (e.g., "NO_RECIPES_FOR_FRIDGE") */
  code: string;
  
  /** Dynamic context data for message template */
  context?: AIMessageContext;
  
  /** Handler for action button clicks */
  onAction?: (actionId: string) => void;
  
  /** Handler for dismiss button */
  onDismiss?: () => void;
  
  /** Custom className for styling */
  className?: string;
  
  /** Show/hide animation */
  animate?: boolean;
};

export function AIMessageCard({
  code,
  context,
  onAction,
  onDismiss,
  className,
  animate = true,
}: AIMessageCardProps) {
  // Get message from dictionary
  const message = getAIMessage(code, context) || FALLBACK_MESSAGE;

  // Level-based styling
  const levelStyles = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      icon: Info,
      iconColor: "text-blue-600 dark:text-blue-400",
      titleColor: "text-blue-900 dark:text-blue-100",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
      border: "border-yellow-200 dark:border-yellow-800",
      icon: AlertTriangle,
      iconColor: "text-yellow-600 dark:text-yellow-400",
      titleColor: "text-yellow-900 dark:text-yellow-100",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      icon: AlertCircle,
      iconColor: "text-red-600 dark:text-red-400",
      titleColor: "text-red-900 dark:text-red-100",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      icon: CheckCircle,
      iconColor: "text-green-600 dark:text-green-400",
      titleColor: "text-green-900 dark:text-green-100",
    },
  };

  const level = message.level || "info";
  const styles = levelStyles[level];
  const LevelIcon = styles.icon;

  const content = (
    <div
      className={cn(
        "rounded-xl border p-6 shadow-sm",
        styles.bg,
        styles.border,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          {/* Level Icon */}
          <div className={cn("mt-0.5", styles.iconColor)}>
            <LevelIcon className="w-5 h-5" />
          </div>

          {/* Title */}
          <div className="flex-1">
            <h3 className={cn("font-semibold text-lg", styles.titleColor)}>
              {message.title}
            </h3>
          </div>

          {/* AI Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
              AI
            </span>
          </div>
        </div>

        {/* Dismiss Button */}
        {message.dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              "p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors",
              styles.iconColor
            )}
            aria-label="Zamknij"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Description */}
      <div className="ml-8 mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {message.description}
        </p>
      </div>

      {/* Actions */}
      {message.actions && message.actions.length > 0 && (
        <div className="ml-8 flex flex-wrap gap-2">
          {message.actions.map((action) => {
            const IconComponent = action.icon ? ICON_MAP[action.icon] : null;
            
            // Map 'primary' to 'default' for Button component compatibility
            const variant = action.variant === 'primary' ? 'default' : action.variant || 'default';
            
            return (
              <Button
                key={action.id}
                onClick={() => onAction?.(action.id)}
                variant={variant}
                size="sm"
                className="gap-2"
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {action.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );

  // Wrap with animation if enabled
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

/**
 * 🎯 Convenience wrapper for common patterns
 */
export function AIMessageCardWrapper({
  response,
  onAction,
  onDismiss,
}: {
  response: { code?: string; context?: AIMessageContext; success?: boolean } | null;
  onAction?: (actionId: string) => void;
  onDismiss?: () => void;
}) {
  // Don't render if no response or success
  if (!response || response.success) {
    return null;
  }

  // Don't render if no code
  if (!response.code) {
    console.warn("⚠️ AIMessageCard: response missing 'code' field", response);
    return null;
  }

  return (
    <AIMessageCard
      code={response.code}
      context={response.context}
      onAction={onAction}
      onDismiss={onDismiss}
    />
  );
}
