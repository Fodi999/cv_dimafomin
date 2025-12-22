/**
 * AIHintCard - Universal Hint Notification Component
 * 
 * Displays persistent content suggestions with action buttons.
 * Used for "what to do next" guidance (not errors).
 */

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Info, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import type { Notice } from "@/lib/notifications/types";

type AIHintCardProps = {
  notice: Notice;
  onDismiss?: () => void;
};

export function AIHintCard({ notice, onDismiss }: AIHintCardProps) {
  if (!notice) return null;

  // Icon based on level
  const Icon = getIconForLevel(notice.level);
  const colors = getColorsForLevel(notice.level);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className={`rounded-xl border ${colors.border} ${colors.bg} p-6 relative`}
      >
        {/* Close Button */}
        {notice.dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={`absolute top-4 right-4 p-1 rounded-lg hover:${colors.hoverBg} transition-colors`}
            title="Zamknij"
            aria-label="Zamknij podpowiedź"
          >
            <X className={`w-5 h-5 ${colors.icon}`} />
          </button>
        )}

        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`p-2 rounded-lg ${colors.iconBg}`}>
            <Icon className={`w-6 h-6 ${colors.icon} flex-shrink-0`} />
          </div>

          {/* Content */}
          <div className="flex-1 pr-8">
            <p className={`font-semibold ${colors.title} mb-1`}>
              {notice.title}
            </p>

            {notice.description && (
              <p className={`text-sm ${colors.description} mb-4 leading-relaxed`}>
                {notice.description}
              </p>
            )}

            {/* Action Buttons */}
            {notice.actions && notice.actions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {notice.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={getButtonClasses(action.variant || "primary", notice.level)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Helper: Get icon for notice level
function getIconForLevel(level: Notice["level"]) {
  switch (level) {
    case "success":
      return CheckCircle;
    case "error":
      return AlertCircle;
    case "warning":
      return AlertTriangle;
    case "info":
    default:
      return Sparkles;
  }
}

// Helper: Get colors for notice level
function getColorsForLevel(level: Notice["level"]) {
  switch (level) {
    case "success":
      return {
        border: "border-green-200 dark:border-green-700",
        bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
        iconBg: "bg-green-100 dark:bg-green-900/40",
        icon: "text-green-600 dark:text-green-400",
        title: "text-green-900 dark:text-green-200",
        description: "text-green-800 dark:text-green-300",
        hoverBg: "bg-green-200 dark:hover:bg-green-900/60",
      };
    case "error":
      return {
        border: "border-red-200 dark:border-red-700",
        bg: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
        iconBg: "bg-red-100 dark:bg-red-900/40",
        icon: "text-red-600 dark:text-red-400",
        title: "text-red-900 dark:text-red-200",
        description: "text-red-800 dark:text-red-300",
        hoverBg: "bg-red-200 dark:hover:bg-red-900/60",
      };
    case "warning":
      return {
        border: "border-yellow-200 dark:border-yellow-700",
        bg: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
        iconBg: "bg-yellow-100 dark:bg-yellow-900/40",
        icon: "text-yellow-600 dark:text-yellow-400",
        title: "text-yellow-900 dark:text-yellow-200",
        description: "text-yellow-800 dark:text-yellow-300",
        hoverBg: "bg-yellow-200 dark:hover:bg-yellow-900/60",
      };
    case "info":
    default:
      return {
        border: "border-purple-200 dark:border-purple-700",
        bg: "bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20",
        iconBg: "bg-purple-100 dark:bg-purple-900/40",
        icon: "text-purple-600 dark:text-purple-400",
        title: "text-purple-900 dark:text-purple-200",
        description: "text-purple-800 dark:text-purple-300",
        hoverBg: "bg-purple-200 dark:hover:bg-purple-900/60",
      };
  }
}

// Helper: Get button classes based on variant
function getButtonClasses(variant: "primary" | "secondary" | "ghost", level: Notice["level"]) {
  const base = "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm";

  if (variant === "primary") {
    switch (level) {
      case "success":
        return `${base} text-white bg-green-600 hover:bg-green-700`;
      case "error":
        return `${base} text-white bg-red-600 hover:bg-red-700`;
      case "warning":
        return `${base} text-white bg-yellow-600 hover:bg-yellow-700`;
      case "info":
      default:
        return `${base} text-white bg-purple-600 hover:bg-purple-700`;
    }
  }

  if (variant === "secondary") {
    switch (level) {
      case "success":
        return `${base} text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-900/60`;
      case "error":
        return `${base} text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60`;
      case "warning":
        return `${base} text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40 hover:bg-yellow-200 dark:hover:bg-yellow-900/60`;
      case "info":
      default:
        return `${base} text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900/60`;
    }
  }

  // ghost variant
  switch (level) {
    case "success":
      return `${base} text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40`;
    case "error":
      return `${base} text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40`;
    case "warning":
      return `${base} text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/40`;
    case "info":
    default:
      return `${base} text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40`;
  }
}
