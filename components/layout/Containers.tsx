/**
 * 🏗️ LAYOUT CONTAINERS - Universal Building Blocks
 * 
 * These components enforce CONSISTENT structure across ALL pages.
 * Main page (`/app/page.tsx`) uses these patterns.
 * 
 * Philosophy:
 * - Page = Content inside Containers
 * - NOT: Page = HTML + Custom Styles
 * 
 * Components:
 * - Container: Max-width wrapper with horizontal padding
 * - Section: Full-width section with vertical spacing
 * - Card: Content card with consistent styling
 * - Grid: Responsive grid layout
 */

"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { designSystem } from "@/lib/design-system";

// ============================================
// 📦 CONTAINER - Max-width wrapper
// ============================================

interface ContainerProps {
  children: ReactNode;
  /** Max width variant */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  /** Additional padding */
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

/**
 * Container - Horizontal max-width wrapper
 * 
 * Used on main page for centering content.
 * Default: max-w-7xl (1280px) with responsive padding
 */
export function Container({
  children,
  size = "7xl",
  padding = "md",
  className,
}: ContainerProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl", // Main page default
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "",
    sm: "px-4",
    md: "px-4 sm:px-6 lg:px-8", // Main page default
    lg: "px-6 sm:px-8 lg:px-12",
  };

  return (
    <div
      className={cn(
        "w-full mx-auto",
        sizeClasses[size],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================
// 📐 SECTION - Full-width section wrapper
// ============================================

interface SectionProps {
  children: ReactNode;
  /** Section ID for anchor links */
  id?: string;
  /** Background style */
  background?: "transparent" | "white" | "gray" | "dark" | "gradient-sky" | "gradient-cyan" | "gradient-purple";
  /** Vertical spacing */
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  /** Apply container padding inside */
  contained?: boolean;
  className?: string;
}

/**
 * Section - Full-width section wrapper
 * 
 * Used on main page for different content blocks.
 * Example: Hero, About, Courses, etc.
 */
export function Section({
  children,
  id,
  background = "transparent",
  spacing = "lg",
  contained = true,
  className,
}: SectionProps) {
  const backgroundClasses = {
    transparent: "bg-transparent",
    white: "bg-white dark:bg-gray-900",
    gray: "bg-gray-50 dark:bg-gray-800",
    dark: "bg-gray-900 dark:bg-black",
    "gradient-sky": "bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950 dark:to-cyan-950",
    "gradient-cyan": "bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950 dark:to-sky-950",
    "gradient-purple": "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
  };

  const spacingClasses = {
    none: "",
    sm: "py-8 sm:py-12",
    md: "py-12 sm:py-16",
    lg: "py-16 sm:py-24", // Main page default
    xl: "py-24 sm:py-32",
  };

  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        backgroundClasses[background],
        spacingClasses[spacing],
        className
      )}
    >
      {contained ? <Container>{children}</Container> : children}
    </section>
  );
}

// ============================================
// 🎴 CARD - Content card
// ============================================

interface CardProps {
  children: ReactNode;
  /** Card variant */
  variant?: "default" | "glass" | "bordered" | "elevated" | "gradient";
  /** Padding size */
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Border radius */
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Hover effect */
  hover?: boolean;
  /** Clickable (cursor pointer) */
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Card - Reusable content card
 * 
 * Variants match main page patterns:
 * - default: White background with border
 * - glass: Semi-transparent with blur (Hero cards)
 * - bordered: Border focus
 * - elevated: Shadow emphasis
 * - gradient: Gradient background
 */
export function Card({
  children,
  variant = "default",
  padding = "lg",
  rounded = "xl",
  hover = false,
  clickable = false,
  className,
  onClick,
}: CardProps) {
  const variantClasses = {
    default: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
    glass: "bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10",
    bordered: "bg-transparent border-2 border-gray-300 dark:border-gray-700",
    elevated: "bg-white dark:bg-gray-900 shadow-lg",
    gradient: "bg-gradient-to-br from-sky-500 to-cyan-500 text-white",
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-6 sm:p-8", // Main page default
    xl: "p-8 sm:p-12",
  };

  const roundedClasses = {
    none: "",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl", // Main page default
    "2xl": "rounded-2xl",
  };

  const hoverClasses = hover
    ? "transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
    : "";

  const clickableClasses = clickable ? "cursor-pointer" : "";

  return (
    <div
      onClick={onClick}
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        roundedClasses[rounded],
        hoverClasses,
        clickableClasses,
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================
// 🔲 GRID - Responsive grid layout
// ============================================

interface GridProps {
  children: ReactNode;
  /** Number of columns */
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Gap between items */
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  /** Responsive behavior */
  responsive?: boolean;
  className?: string;
}

/**
 * Grid - Responsive grid layout
 * 
 * Used on main page for feature cards, course cards, etc.
 * Responsive by default: mobile-1, tablet-2, desktop-configured
 */
export function Grid({
  children,
  cols = 3,
  gap = "lg",
  responsive = true,
  className,
}: GridProps) {
  const colsClasses = responsive
    ? {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3", // Main page default
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        5: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        6: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
      }
    : {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
      };

  const gapClasses = {
    none: "gap-0",
    xs: "gap-2",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-6 sm:gap-8", // Main page default
    xl: "gap-8 sm:gap-12",
  };

  return (
    <div className={cn("grid", colsClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// ============================================
// 📱 FLEX - Flexible layouts
// ============================================

interface FlexProps {
  children: ReactNode;
  /** Direction */
  direction?: "row" | "col";
  /** Alignment */
  align?: "start" | "center" | "end" | "stretch";
  /** Justify */
  justify?: "start" | "center" | "end" | "between" | "around";
  /** Gap */
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  /** Wrap */
  wrap?: boolean;
  className?: string;
}

/**
 * Flex - Flexbox utility component
 * 
 * For quick flex layouts without custom classes
 */
export function Flex({
  children,
  direction = "row",
  align = "start",
  justify = "start",
  gap = "md",
  wrap = false,
  className,
}: FlexProps) {
  const directionClass = direction === "row" ? "flex-row" : "flex-col";
  const alignClass = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  }[align];
  const justifyClass = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  }[justify];
  const gapClass = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  }[gap];
  const wrapClass = wrap ? "flex-wrap" : "";

  return (
    <div
      className={cn(
        "flex",
        directionClass,
        alignClass,
        justifyClass,
        gapClass,
        wrapClass,
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================
// 📦 ANIMATED CONTAINER (Framer Motion)
// ============================================

interface AnimatedContainerProps {
  children: ReactNode;
  /** Animation variant */
  variant?: "fadeUp" | "fadeDown" | "fadeIn" | "scaleUp" | "slideInLeft" | "slideInRight";
  /** Delay in seconds */
  delay?: number;
  className?: string;
}

/**
 * AnimatedContainer - Container with entrance animation
 * 
 * Used on main page for smooth content reveals
 */
export function AnimatedContainer({
  children,
  variant = "fadeUp",
  delay = 0,
  className,
}: AnimatedContainerProps) {
  const variants = designSystem.animations;

  const animationVariant = {
    fadeUp: variants.fadeUp,
    fadeDown: variants.fadeDown,
    fadeIn: variants.fadeIn,
    scaleUp: variants.scaleUp,
    slideInLeft: variants.slideInLeft,
    slideInRight: variants.slideInRight,
  }[variant];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={animationVariant}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================
// 🎯 EXPORT ALL CONTAINERS
// ============================================

export const Containers = {
  Container,
  Section,
  Card,
  Grid,
  Flex,
  AnimatedContainer,
};

export default Containers;
