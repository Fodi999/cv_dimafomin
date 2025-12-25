/**
 * 🎯 UnifiedRecipeCard - Single Source of Truth for Recipe Display
 * 
 * This component replaces:
 * - components/recipes/RecipeCard.tsx (catalog view)
 * - components/recipes/SavedRecipeCard.tsx (saved recipes)
 * - components/assistant/RecipeCard.tsx (AI recommendations)
 * 
 * Philosophy:
 * - ONE card component for ALL contexts
 * - Accepts normalized recipe data
 * - Adapts display based on context prop
 * 
 * Usage:
 * ```tsx
 * // Catalog view
 * <UnifiedRecipeCard
 *   recipe={normalizedRecipe}
 *   context="catalog"
 *   onView={() => router.push(`/recipes/${id}`)}
 * />
 * 
 * // Saved recipes
 * <UnifiedRecipeCard
 *   recipe={normalizedRecipe}
 *   context="saved"
 *   onCook={handleCook}
 *   onDelete={handleDelete}
 * />
 * 
 * // AI recommendation
 * <UnifiedRecipeCard
 *   recipe={normalizedRecipe}
 *   context="ai"
 *   onAddToPlan={handleAddToPlan}
 * />
 * ```
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  ChefHat,
  Bookmark,
  BookmarkCheck,
  Trash2,
  ExternalLink,
  Calendar,
  Globe,
  AlertCircle,
  CheckCircle2,
  ShoppingCart,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ========================================
// 🎨 TYPES
// ========================================

type RecipeContext = "catalog" | "saved" | "ai" | "market" | "profile";

type RecipeDifficulty = "easy" | "medium" | "hard" | "beginner" | "intermediate" | "advanced";

type RecipeStatus = "canCookNow" | "fewMissing" | "manyMissing";

interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost?: number;
}

interface RecipeEconomy {
  usedFromFridge?: boolean;
  usedValue?: number;
  estimatedExtraCost?: number;
  costToComplete?: number;
  savedMoney?: number;
  wasteRiskSaved?: number;
  currency: string;
}

interface RecipeAuthor {
  name: string;
  avatar?: string;
}

export interface UnifiedRecipeData {
  // Core fields
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;

  // Meta
  difficulty?: RecipeDifficulty;
  cookingTime?: number; // minutes
  servings?: number;
  category?: string;
  country?: string;

  // Ingredients
  ingredientsUsed?: RecipeIngredient[]; // Available in fridge
  ingredientsMissing?: RecipeIngredient[]; // Need to buy
  ingredients?: RecipeIngredient[]; // All ingredients (for catalog)

  // Instructions
  steps?: string[];
  chefTips?: string[];

  // Economy
  economy?: RecipeEconomy;

  // Social (catalog)
  author?: RecipeAuthor;
  likes?: number;
  comments?: number;

  // Status (saved)
  savedAt?: string; // ISO date
  cookedCount?: number;
  lastCookedAt?: string | null;
  canCookNow?: boolean;
  missingIngredientsCount?: number;

  // Priority (AI)
  expiryPriority?: "critical" | "warning" | "ok";

  // Budget
  weeklyBudget?: number;
}

interface UnifiedRecipeCardProps {
  /** Recipe data (normalized) */
  recipe: UnifiedRecipeData;

  /** Display context */
  context: RecipeContext;

  /** Actions */
  onView?: () => void;
  onCook?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onAddToPlan?: () => void;
  onAddToCart?: () => void;

  /** Loading states */
  isCooking?: boolean;
  isSaving?: boolean;
  isDeleting?: boolean;

  /** Custom className */
  className?: string;
}

// ========================================
// 🎨 CONSTANTS
// ========================================

const DIFFICULTY_CONFIG = {
  easy: {
    label: "Łatwy",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  medium: {
    label: "Średni",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  hard: {
    label: "Trudny",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  beginner: {
    label: "Początkujący",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  intermediate: {
    label: "Średni",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  advanced: {
    label: "Zaawansowany",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
};

const EXPIRY_BADGES = {
  critical: {
    emoji: "🔥",
    text: "Użyć pilnie",
    color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  warning: {
    emoji: "🟡",
    text: "Użyć niedługo",
    color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  },
  ok: {
    emoji: "🟢",
    text: "Świeże",
    color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  },
};

const STATUS_BADGES = {
  canCookNow: {
    emoji: "🟢",
    text: "Możesz ugotować teraz",
    color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  },
  fewMissing: {
    emoji: "🟡",
    text: "Brakuje kilku składników",
    color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  },
  manyMissing: {
    emoji: "🔴",
    text: "Brakuje wielu składników",
    color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  },
};

// ========================================
// 🛠️ UTILITIES
// ========================================

function getRecipeStatus(recipe: UnifiedRecipeData): RecipeStatus {
  if (recipe.canCookNow) return "canCookNow";
  
  const missingCount = recipe.missingIngredientsCount || recipe.ingredientsMissing?.length || 0;
  return missingCount <= 2 ? "fewMissing" : "manyMissing";
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatQuantity(quantity: number, unit: string): string {
  if (unit === "g" && quantity >= 1000) {
    return `${(quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1)} kg`;
  }
  if (unit === "ml" && quantity >= 1000) {
    return `${(quantity / 1000).toFixed(quantity % 1000 === 0 ? 0 : 1)} l`;
  }
  return `${quantity} ${unit}`;
}

// ========================================
// 📦 COMPONENT
// ========================================

export function UnifiedRecipeCard({
  recipe,
  context,
  onView,
  onCook,
  onSave,
  onDelete,
  onAddToPlan,
  onAddToCart,
  isCooking = false,
  isSaving = false,
  isDeleting = false,
  className,
}: UnifiedRecipeCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  // ========================================
  // 🎨 STYLING
  // ========================================
  const difficulty = recipe.difficulty
    ? DIFFICULTY_CONFIG[recipe.difficulty] || DIFFICULTY_CONFIG.medium
    : null;

  const status = getRecipeStatus(recipe);
  const statusBadge = STATUS_BADGES[status];

  const expiryBadge = recipe.expiryPriority
    ? EXPIRY_BADGES[recipe.expiryPriority]
    : null;

  // ========================================
  // 🎬 HANDLERS
  // ========================================
  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on action buttons
    if ((e.target as HTMLElement).closest("button")) {
      e.preventDefault();
    }
  };

  // ========================================
  // 🧩 RENDER HELPERS
  // ========================================

  const renderImage = () => {
    if (context === "ai") return null; // AI cards don't show images

    return (
      <div className="relative overflow-hidden h-48 sm:h-56 bg-gradient-to-br from-sky-200 to-cyan-200 dark:from-sky-950 dark:to-cyan-950">
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}

        {/* Difficulty Badge */}
        {difficulty && (
          <div
            className={cn(
              "absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-xs font-semibold",
              difficulty.bgColor,
              difficulty.color
            )}
          >
            {difficulty.label}
          </div>
        )}

        {/* Category/Country Badge */}
        {(recipe.category || recipe.country) && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-sky-500/80 text-white text-xs font-semibold">
            {recipe.category || recipe.country}
          </div>
        )}

        {/* Save button (catalog context) */}
        {context === "catalog" && onSave && (
          <button
            onClick={handleSave}
            className={cn(
              "absolute bottom-3 right-3 p-2.5 rounded-full backdrop-blur-sm transition-all",
              isSaved
                ? "bg-sky-500 text-white"
                : "bg-white/90 text-gray-700 hover:bg-sky-500 hover:text-white"
            )}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    );
  };

  const renderHeader = () => {
    if (context !== "ai") return null;

    return (
      <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <ChefHat className="w-6 h-6 flex-shrink-0" />
            <span>{recipe.title}</span>
          </h3>
          {expiryBadge && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border",
                expiryBadge.color
              )}
            >
              <span>{expiryBadge.emoji}</span>
              {expiryBadge.text}
            </span>
          )}
        </div>
        {recipe.description && (
          <p className="text-white/90 mt-2">{recipe.description}</p>
        )}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="p-4 sm:p-5">
        {/* Title (non-AI contexts) */}
        {context !== "ai" && (
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
            {recipe.title}
          </h3>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          {recipe.cookingTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-500" />
              <span>{recipe.cookingTime} min</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-500" />
              <span>{recipe.servings} porcji</span>
            </div>
          )}
          
          {/* Status badge (saved context) */}
          {context === "saved" && statusBadge && (
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
                statusBadge.color
              )}
            >
              <span>{statusBadge.emoji}</span>
              <span>{statusBadge.text}</span>
            </div>
          )}
        </div>

        {/* Saved date (saved context) */}
        {context === "saved" && recipe.savedAt && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Zapisano: {formatDate(recipe.savedAt)}</span>
            {recipe.cookedCount && recipe.cookedCount > 0 && (
              <>
                <span>•</span>
                <span>Ugotowano {recipe.cookedCount}×</span>
              </>
            )}
          </div>
        )}

        {/* Author (catalog context) */}
        {context === "catalog" && recipe.author && (
          <div className="flex items-center gap-2 mb-3">
            {recipe.author.avatar && (
              <img
                src={recipe.author.avatar}
                alt={recipe.author.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {recipe.author.name}
            </span>
          </div>
        )}

        {/* Economy (AI/saved contexts) */}
        {(context === "ai" || context === "saved") && recipe.economy && (
          <div className="mb-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-2">
              <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                {recipe.economy.costToComplete !== undefined &&
                  recipe.economy.costToComplete > 0 && (
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-700 dark:text-gray-300">
                        Koszt dokupienia:
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {recipe.economy.costToComplete.toFixed(2)}{" "}
                        {recipe.economy.currency}
                      </span>
                    </div>
                  )}
                {recipe.economy.wasteRiskSaved &&
                  recipe.economy.wasteRiskSaved > 0 && (
                    <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                      <span>Oszczędności:</span>
                      <span className="font-bold">
                        +{recipe.economy.wasteRiskSaved.toFixed(2)}{" "}
                        {recipe.economy.currency}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Social stats (catalog context) */}
        {context === "catalog" && (recipe.likes || recipe.comments) && (
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {recipe.likes && (
              <span className="flex items-center gap-1">
                ❤️ {recipe.likes}
              </span>
            )}
            {recipe.comments && (
              <span className="flex items-center gap-1">
                💬 {recipe.comments}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderActions = () => {
    return (
      <div className="p-4 sm:p-5 pt-0 flex flex-wrap gap-2">
        {/* Cook button */}
        {onCook && (
          <button
            onClick={onCook}
            disabled={isCooking}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2",
              "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isCooking ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gotuję...
              </>
            ) : (
              <>
                <ChefHat className="w-4 h-4" />
                Ugotuj
              </>
            )}
          </button>
        )}

        {/* Add to cart */}
        {onAddToCart &&
          recipe.ingredientsMissing &&
          recipe.ingredientsMissing.length > 0 && (
            <button
              onClick={onAddToCart}
              className="flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <ShoppingCart className="w-4 h-4" />
              Zakupy
            </button>
          )}

        {/* Delete button (saved context) */}
        {context === "saved" && onDelete && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-red-400 border-t-red-700 rounded-full animate-spin" />
                Usuwam...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Usuń
              </>
            )}
          </button>
        )}

        {/* Add to plan (AI context) */}
        {context === "ai" && onAddToPlan && (
          <button
            onClick={onAddToPlan}
            className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <Calendar className="w-4 h-4" />
            Dodaj do planu
          </button>
        )}

        {/* View details (catalog context) */}
        {context === "catalog" && onView && (
          <button
            onClick={onView}
            className="w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white"
          >
            Zobacz przepis
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  // ========================================
  // 🎬 RENDER
  // ========================================

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={context === "catalog" ? { y: -4 } : undefined}
      className={cn(
        "group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all",
        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
        context === "catalog" && "cursor-pointer",
        className
      )}
      onClick={context === "catalog" ? handleCardClick : undefined}
    >
      {renderImage()}
      {renderHeader()}
      {renderContent()}
      {renderActions()}
    </motion.div>
  );

  // Wrap with Link for catalog context
  if (context === "catalog" && recipe.id) {
    return <Link href={`/recipes/${recipe.id}`}>{cardContent}</Link>;
  }

  return cardContent;
}
