/**
 * 🎨 PageLayout - Unified Layout for All Pages
 * 
 * This component establishes CONSISTENT structure across the entire app:
 * - DynamicMetaTags (SEO)
 * - StructuredData (Schema.org)
 * - ScrollProgress (UX indicator)
 * - ScrollToTop (navigation helper)
 * - Consistent padding, spacing, animations
 * 
 * Philosophy:
 * - Main page style = REFERENCE
 * - All pages should follow same pattern
 * - Section-based layout
 * 
 * Usage:
 * ```tsx
 * <PageLayout
 *   title="Przepisy"
 *   description="Odkryj tysiące przepisów"
 *   showScrollProgress={true}
 * >
 *   <YourPageContent />
 * </PageLayout>
 * ```
 */

"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import DynamicMetaTags from "@/components/DynamicMetaTags";
import StructuredData from "@/components/StructuredData";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollToTop from "@/components/ScrollToTop";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  /** Page content */
  children: ReactNode;

  /** Page title (for meta tags) */
  title?: string;

  /** Page description (for meta tags) */
  description?: string;

  /** Show scroll progress indicator */
  showScrollProgress?: boolean;

  /** Show scroll to top button */
  showScrollToTop?: boolean;

  /** Custom background gradient */
  background?:
    | "default"
    | "gradient-blue"
    | "gradient-purple"
    | "gradient-green"
    | "solid";

  /** Max width constraint */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";

  /** Padding */
  padding?: "none" | "sm" | "md" | "lg";

  /** Show header spacing (for pages with fixed header) */
  hasHeader?: boolean;

  /** Custom className */
  className?: string;

  /** Animate page entrance */
  animate?: boolean;
}

const BACKGROUND_STYLES = {
  default:
    "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
  "gradient-blue":
    "bg-gradient-to-br from-sky-50 to-cyan-100 dark:from-sky-950 dark:to-cyan-900",
  "gradient-purple":
    "bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900",
  "gradient-green":
    "bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900",
  solid: "bg-white dark:bg-gray-900",
};

const MAX_WIDTH_STYLES = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  "2xl": "max-w-[1600px]",
  full: "max-w-full",
};

const PADDING_STYLES = {
  none: "",
  sm: "px-3 py-2",
  md: "px-4 py-3 sm:px-6 sm:py-4",
  lg: "px-6 py-4 sm:px-8 sm:py-6",
};

export function PageLayout({
  children,
  title,
  description,
  showScrollProgress = true,
  showScrollToTop = true,
  background = "default",
  maxWidth = "lg",
  padding = "md",
  hasHeader = true,
  className,
  animate = true,
}: PageLayoutProps) {
  const bgClass = BACKGROUND_STYLES[background];
  const maxWidthClass = MAX_WIDTH_STYLES[maxWidth];
  const paddingClass = PADDING_STYLES[padding];

  const content = (
    <>
      {/* Meta Tags */}
      <DynamicMetaTags />
      <StructuredData />

      {/* UX Helpers */}
      {showScrollProgress && <ScrollProgress />}
      {showScrollToTop && <ScrollToTop />}

      {/* Main Content */}
      <main
        className={cn(
          "relative w-full min-h-screen overflow-y-auto",
          bgClass,
          hasHeader && "pt-16", // Space for fixed header
          className
        )}
      >
        <div className={cn("mx-auto", maxWidthClass, paddingClass)}>
          {children}
        </div>
      </main>
    </>
  );

  // Wrap with animation if enabled
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

/**
 * 📦 PageSection - Consistent section wrapper
 * 
 * For pages with multiple sections (like main page)
 */
interface PageSectionProps {
  children: ReactNode;
  id?: string;
  background?: "transparent" | "white" | "gray" | "gradient";
  spacing?: "none" | "sm" | "md" | "lg";
  className?: string;
}

const SECTION_BG_STYLES = {
  transparent: "bg-transparent",
  white: "bg-white dark:bg-gray-900",
  gray: "bg-gray-50 dark:bg-gray-800",
  gradient: "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
};

const SECTION_SPACING_STYLES = {
  none: "",
  sm: "py-8 sm:py-12",
  md: "py-12 sm:py-16",
  lg: "py-16 sm:py-24",
};

export function PageSection({
  children,
  id,
  background = "transparent",
  spacing = "md",
  className,
}: PageSectionProps) {
  const bgClass = SECTION_BG_STYLES[background];
  const spacingClass = SECTION_SPACING_STYLES[spacing];

  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        bgClass,
        spacingClass,
        className
      )}
    >
      {children}
    </section>
  );
}

/**
 * 📦 PageHeader - Consistent page header
 * 
 * For pages with title + description + actions
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6 sm:mb-8", className)}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {icon && (
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                {icon}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>
          {description && (
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-2">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/**
 * 📦 PageCard - Consistent card wrapper
 * 
 * For content cards across pages
 */
interface PageCardProps {
  children: ReactNode;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
  className?: string;
}

const CARD_PADDING_STYLES = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function PageCard({
  children,
  hover = false,
  padding = "md",
  className,
}: PageCardProps) {
  const paddingClass = CARD_PADDING_STYLES[padding];

  return (
    <div
      className={cn(
        "rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm",
        hover && "hover:shadow-md transition-shadow duration-200",
        paddingClass,
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * 📦 PageGrid - Consistent grid layout
 * 
 * For recipe cards, product cards, etc.
 */
interface PageGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const GRID_COLUMNS_STYLES = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

const GRID_GAP_STYLES = {
  sm: "gap-3",
  md: "gap-4 sm:gap-6",
  lg: "gap-6 sm:gap-8",
};

export function PageGrid({
  children,
  columns = 3,
  gap = "md",
  className,
}: PageGridProps) {
  const columnsClass = GRID_COLUMNS_STYLES[columns];
  const gapClass = GRID_GAP_STYLES[gap];

  return (
    <div className={cn("grid", columnsClass, gapClass, className)}>
      {children}
    </div>
  );
}
