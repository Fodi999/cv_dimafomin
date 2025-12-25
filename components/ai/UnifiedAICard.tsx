/**
 * 🎯 UnifiedAICard - Single Source of Truth for AI Communication
 * 
 * This component replaces:
 * - AIRecommendationCard (recipes)
 * - AIMessageCard (system messages)
 * 
 * Philosophy:
 * - ONE universal layout
 * - Backend sends: { type, header, context, actions }
 * - Frontend renders consistently
 * 
 * Usage:
 * ```tsx
 * // Recipe recommendation
 * <UnifiedAICard
 *   type="recipe"
 *   header={{ title, description, status, icon }}
 *   context={{ recipe: {...} }}
 *   actions={[...]}
 * />
 * 
 * // System message
 * <UnifiedAICard
 *   type="message"
 *   header={{ title, level: "warning" }}
 *   context={{ fridgeItems: 5 }}
 *   actions={[{ label: "Dodaj produkty", icon: "Plus" }]}
 * />
 * ```
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  TrendingDown,
  Plus,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ========================================
// 🎨 TYPES
// ========================================

type AICardType = "recipe" | "message";

type AICardLevel = "info" | "warning" | "error" | "success";

type AICardStatus = {
  emoji: string;
  text: string;
  color: string;
};

type AICardHeader = {
  title: string;
  description?: string;
  status?: AICardStatus;
  level?: AICardLevel; // for messages
  icon?: React.ReactNode;
};

type RecipeIngredient = {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost?: number;
};

type RecipeEconomy = {
  costToComplete: number;
  currency: string;
  wasteRiskSaved?: number;
};

type RecipeContext = {
  servings?: number;
  cookingTime?: number;
  coverage?: number;
  usedIngredients?: RecipeIngredient[];
  missingIngredients?: RecipeIngredient[];
  steps?: string[];
  economy?: RecipeEconomy;
  weeklyBudget?: number;
};

type AICardAction = {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

type UnifiedAICardProps = {
  /** Card type: recipe or message */
  type: AICardType;

  /** Header configuration */
  header: AICardHeader;

  /** Context data (recipe details or message context) */
  context?: RecipeContext | Record<string, any>;

  /** Action buttons */
  actions?: AICardAction[];

  /** Dismissible (for messages) */
  dismissible?: boolean;
  onDismiss?: () => void;

  /** Custom className */
  className?: string;

  /** Show/hide animation */
  animate?: boolean;
};

// ========================================
// 🎨 LEVEL STYLES (for messages)
// ========================================

const LEVEL_STYLES = {
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    headerBg: "bg-gradient-to-r from-blue-600 to-cyan-600",
    icon: Info,
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-800",
    headerBg: "bg-gradient-to-r from-yellow-600 to-orange-600",
    icon: AlertTriangle,
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  error: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    headerBg: "bg-gradient-to-r from-red-600 to-rose-600",
    icon: AlertCircle,
    iconColor: "text-red-600 dark:text-red-400",
  },
  success: {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    headerBg: "bg-gradient-to-r from-green-600 to-emerald-600",
    icon: CheckCircle2,
    iconColor: "text-green-600 dark:text-green-400",
  },
};

// ========================================
// 🎨 BUTTON VARIANTS
// ========================================

const BUTTON_VARIANTS = {
  primary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl",
  secondary: "border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300",
  danger: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl",
};

// ========================================
// 🛠️ UTILITIES
// ========================================

const formatQuantity = (quantity: number, unit: string): string => {
  if (unit === "g" && quantity >= 1000) {
    return `${(quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1)} kg`;
  }
  if (unit === "ml" && quantity >= 1000) {
    return `${(quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1)} l`;
  }
  return `${quantity} ${unit}`;
};

// ========================================
// 📦 COMPONENT
// ========================================

export function UnifiedAICard({
  type,
  header,
  context,
  actions = [],
  dismissible = false,
  onDismiss,
  className,
  animate = true,
}: UnifiedAICardProps) {
  // ========================================
  // 🔢 STATE (for recipes)
  // ========================================
  const recipeContext = context as RecipeContext;
  const [servings, setServings] = useState(recipeContext?.servings || 1);
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false);

  const servingsMultiplier =
    recipeContext?.servings && recipeContext.servings > 0
      ? servings / recipeContext.servings
      : 1;

  // ========================================
  // 🎨 STYLING
  // ========================================
  const level = header.level || "info";
  const styles = LEVEL_STYLES[level];
  const LevelIcon = styles.icon;

  const headerBgClass =
    type === "recipe"
      ? "bg-gradient-to-r from-purple-600 to-pink-600"
      : styles.headerBg;

  // ========================================
  // 🧩 RENDER HELPERS
  // ========================================

  const renderHeader = () => (
    <div className={cn("p-6 text-white", headerBgClass)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Status Badge (recipes) */}
          {type === "recipe" && header.status && (
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3",
                header.status.color
              )}
            >
              <span>{header.status.emoji}</span>
              <span>{header.status.text}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-2xl font-bold mb-2">{header.title}</h3>

          {/* Description */}
          {header.description && (
            <p className="text-white/90 text-sm leading-relaxed">
              {header.description}
            </p>
          )}
        </div>

        {/* Icon */}
        <div className="flex-shrink-0">
          {type === "message" ? (
            <div className="flex items-center gap-2">
              {/* AI Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">AI</span>
              </div>

              {/* Dismiss */}
              {dismissible && onDismiss && (
                <button
                  onClick={onDismiss}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Zamknij"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {header.icon || <Sparkles className="w-6 h-6" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderMeta = () => {
    if (type !== "recipe" || !recipeContext) return null;

    return (
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 text-sm">
            {recipeContext.cookingTime && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="font-medium">
                  {recipeContext.cookingTime} min
                </span>
              </div>
            )}
            {recipeContext.coverage !== undefined && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="font-medium">
                  {Math.min(
                    100,
                    Math.round(
                      recipeContext.coverage > 1
                        ? recipeContext.coverage
                        : recipeContext.coverage * 100
                    )
                  )}
                  % dopasowania
                </span>
              </div>
            )}
          </div>

          {/* Servings control */}
          {recipeContext.servings && recipeContext.servings > 0 && (
            <div className="flex items-center gap-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2">
              <Users className="w-4 h-4 text-purple-500" />
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold transition-colors disabled:opacity-50"
                disabled={servings <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-900 dark:text-white min-w-[3ch] text-center">
                {servings}
              </span>
              <button
                onClick={() => setServings(servings + 1)}
                className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                porcji
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderIngredients = () => {
    if (type !== "recipe" || !recipeContext) return null;

    const hasIngredients =
      recipeContext.usedIngredients?.length ||
      recipeContext.missingIngredients?.length;
    if (!hasIngredients) return null;

    return (
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Składniki
        </h4>
        <div className="space-y-3">
          {/* Available ingredients */}
          {recipeContext.usedIngredients &&
            recipeContext.usedIngredients.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-2">
                  Masz w lodówce ({recipeContext.usedIngredients.length})
                </p>
                <div className="space-y-2">
                  {recipeContext.usedIngredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm bg-green-50 dark:bg-green-900/20 rounded-lg p-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white font-medium flex-1">
                        {ing.name}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                        {formatQuantity(
                          ing.quantity * servingsMultiplier,
                          ing.unit
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Missing ingredients */}
          {recipeContext.missingIngredients &&
            recipeContext.missingIngredients.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-2">
                  Trzeba dokupić ({recipeContext.missingIngredients.length})
                </p>
                <div className="space-y-2">
                  {recipeContext.missingIngredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-sm bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3"
                    >
                      <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                      <span className="text-gray-900 dark:text-white font-medium flex-1">
                        {ing.name}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                        {formatQuantity(
                          ing.quantity * servingsMultiplier,
                          ing.unit
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    );
  };

  const renderInstructions = () => {
    if (
      type !== "recipe" ||
      !recipeContext?.steps ||
      recipeContext.steps.length === 0
    )
      return null;

    return (
      <div className="border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sposób przygotowania
          </h4>
          {isInstructionsExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {isInstructionsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-4">
                {recipeContext.steps!.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pt-1">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderEconomy = () => {
    if (type !== "recipe" || !recipeContext?.economy) return null;

    return (
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Ekonomia
            </p>

            {/* Cost display */}
            {recipeContext.economy.costToComplete > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Koszt ({servings} porcji):
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {(
                      recipeContext.economy.costToComplete * servingsMultiplier
                    ).toFixed(2)}{" "}
                    {recipeContext.economy.currency}
                  </span>
                </div>

                {/* Budget warning */}
                {recipeContext.weeklyBudget && (() => {
                  const totalCost =
                    recipeContext.economy!.costToComplete * servingsMultiplier;
                  const budgetPercent =
                    (totalCost / recipeContext.weeklyBudget) * 100;
                  if (budgetPercent >= 50) {
                    return (
                      <div className="mt-2 p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700">
                        <p className="text-xs font-semibold text-orange-800 dark:text-orange-300 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          To {budgetPercent.toFixed(0)}% Twojego tygodniowego
                          budżetu
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}

            {/* Savings */}
            {recipeContext.economy.wasteRiskSaved &&
              recipeContext.economy.wasteRiskSaved > 0 && (
                <div className="flex items-center gap-2 text-xs mt-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Oszczędności:
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    +{recipeContext.economy.wasteRiskSaved.toFixed(2)}{" "}
                    {recipeContext.economy.currency}
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  };

  const renderActions = () => {
    if (!actions || actions.length === 0) return null;

    const primaryActions = actions.filter((a) => a.variant === "primary" || a.variant === "danger");
    const secondaryActions = actions.filter((a) => a.variant === "secondary");

    return (
      <div className="p-6 space-y-3">
        {/* Primary Actions */}
        {primaryActions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {primaryActions.map((action) => {
              const Icon = action.icon;
              const variantClass = BUTTON_VARIANTS[action.variant || "primary"];

              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  disabled={action.disabled || action.loading}
                  className={cn(
                    "px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                    variantClass
                  )}
                >
                  {action.loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {action.label}...
                    </>
                  ) : (
                    <>
                      {Icon && <Icon className="w-5 h-5" />}
                      {action.label}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Secondary Actions */}
        {secondaryActions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {secondaryActions.map((action) => {
              const Icon = action.icon;
              const variantClass = BUTTON_VARIANTS.secondary;

              return (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  disabled={action.disabled || action.loading}
                  className={cn(
                    "px-4 py-2 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                    variantClass
                  )}
                >
                  {action.loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 dark:border-t-gray-300 rounded-full animate-spin" />
                      {action.label}...
                    </>
                  ) : (
                    <>
                      {Icon && <Icon className="w-4 h-4" />}
                      {action.label}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ========================================
  // 🎬 RENDER
  // ========================================

  const content = (
    <div
      className={cn(
        "rounded-2xl border bg-white dark:bg-gray-900 shadow-lg overflow-hidden",
        type === "message" && styles.bg,
        type === "message" && styles.border,
        "border-gray-200 dark:border-gray-800",
        className
      )}
    >
      {renderHeader()}
      {renderMeta()}
      {renderIngredients()}
      {renderInstructions()}
      {renderEconomy()}
      {renderActions()}
    </div>
  );

  // Wrap with animation if enabled
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
