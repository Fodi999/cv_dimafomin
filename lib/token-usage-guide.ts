/**
 * CSS VARIABLES & DESIGN TOKENS USAGE GUIDE
 * ==========================================
 * 
 * This file documents how to use the CSS Variables layer
 * for dynamic theming and consistent styling.
 * 
 * Defined in: app/globals.css
 * Configured in: tailwind.config.ts
 * Theme management: components/theme/ThemeProvider.tsx
 */

// ============================================
// PART 1: COLOR TOKENS
// ============================================

/**
 * Primary Colors - Main brand colors
 * Used for: primary actions, links, focus states
 * 
 * Light: #3BC864 (Irradiated Toad - green)
 * Dark: #64DC82 (brighter for visibility)
 */

export const COLOR_TOKENS = {
  PRIMARY: "rgb(var(--color-primary-rgb) / <alpha-value>)",
  PRIMARY_LIGHT: "rgb(var(--color-primary-light-rgb) / <alpha-value>)",

  // Secondary - Complimentary color
  SECONDARY: "rgb(var(--color-secondary-rgb) / <alpha-value>)",
  SECONDARY_LIGHT: "rgb(var(--color-secondary-light-rgb) / <alpha-value>)",

  // Background colors
  BG: "rgb(var(--color-bg-rgb) / <alpha-value>)",
  BG_DARK: "rgb(var(--color-bg-dark-rgb) / <alpha-value>)",
  BG_MUTED: "rgb(var(--color-bg-muted-rgb) / <alpha-value>)",

  // Text colors
  TEXT_PRIMARY: "rgb(var(--color-text-primary-rgb) / <alpha-value>)",
  TEXT_SECONDARY: "rgb(var(--color-text-secondary-rgb) / <alpha-value>)",
  TEXT_MUTED: "rgb(var(--color-text-muted-rgb) / <alpha-value>)",

  // Status colors
  SUCCESS: "rgb(var(--color-success-rgb) / <alpha-value>)",
  WARNING: "rgb(var(--color-warning-rgb) / <alpha-value>)",
  ERROR: "rgb(var(--color-error-rgb) / <alpha-value>)",
  INFO: "rgb(var(--color-info-rgb) / <alpha-value>)",
};

/**
 * EXAMPLES - Color Usage in Tailwind
 * 
 * 1. Simple background
 *    <div className="bg-primary">Primary background</div>
 * 
 * 2. With opacity (requires RGB format)
 *    <div className="bg-primary/50">50% opacity</div>
 *    <div className="bg-primary/75">75% opacity</div>
 * 
 * 3. Text colors
 *    <div className="text-primary">Primary text</div>
 *    <div className="text-text-secondary">Secondary text</div>
 * 
 * 4. Borders
 *    <div className="border-2 border-primary">Primary border</div>
 *    <div className="border border-primary/20">Subtle border</div>
 * 
 * 5. Combined
 *    <div className="bg-bg text-text-primary border border-primary/10">
 *      Card with token colors
 *    </div>
 */

// ============================================
// PART 2: SPACING TOKENS
// ============================================

/**
 * Spacing scale (8px base)
 * Used for: padding, margin, gaps
 */

export const SPACING_TOKENS = {
  XS: "var(--spacing-xs)", // 4px
  SM: "var(--spacing-sm)", // 8px
  MD: "var(--spacing-md)", // 12px
  LG: "var(--spacing-lg)", // 16px
  XL: "var(--spacing-xl)", // 24px
  "2XL": "var(--spacing-2xl)", // 32px
  "3XL": "var(--spacing-3xl)", // 48px
};

/**
 * EXAMPLES - Spacing Usage
 * 
 * 1. Padding
 *    <div className="px-md py-lg">Content with padding</div>
 *    <div className="p-lg">4-way padding</div>
 * 
 * 2. Margin
 *    <div className="mb-lg">Item with bottom margin</div>
 *    <div className="mx-auto my-xl">Centered with vertical margin</div>
 * 
 * 3. Gaps
 *    <div className="flex gap-md">Flex with gap</div>
 *    <div className="grid gap-lg">Grid with gap</div>
 */

// ============================================
// PART 3: BORDER RADIUS TOKENS
// ============================================

/**
 * Border radius scale
 * Used for: rounded corners on elements
 */

export const RADIUS_TOKENS = {
  XS: "var(--radius-xs)", // 4px
  SM: "var(--radius-sm)", // 8px
  MD: "var(--radius-md)", // 12px
  LG: "var(--radius-lg)", // 16px
  XL: "var(--radius-xl)", // 20px
  FULL: "var(--radius-full)", // 9999px (circle)
};

/**
 * EXAMPLES - Radius Usage
 * 
 * 1. Simple rounded
 *    <div className="rounded-md">Rounded corners</div>
 * 
 * 2. Fully rounded (circle)
 *    <div className="w-10 h-10 rounded-full">Avatar</div>
 * 
 * 3. On buttons
 *    <button className="rounded-lg px-4 py-2">Button</button>
 */

// ============================================
// PART 4: SHADOW TOKENS
// ============================================

/**
 * Shadow scale (elevation system)
 * Used for: depth and elevation
 */

export const SHADOW_TOKENS = {
  XS: "var(--shadow-xs)", // Subtle
  SM: "var(--shadow-sm)", // Light
  MD: "var(--shadow-md)", // Medium
  LG: "var(--shadow-lg)", // Deep
  XL: "var(--shadow-xl)", // Very deep
  "2XL": "var(--shadow-2xl)", // Extreme
};

/**
 * EXAMPLES - Shadow Usage
 * 
 * 1. Simple shadow
 *    <div className="shadow-md">Card with medium shadow</div>
 * 
 * 2. Hover effect
 *    <div className="shadow-sm hover:shadow-lg transition-shadow">
 *      Hoverable card
 *    </div>
 * 
 * 3. Layered shadows
 *    <div className="shadow-lg dark:shadow-xl">Shadow in dark</div>
 */

// ============================================
// PART 5: TRANSITION TOKENS
// ============================================

/**
 * Transition durations (cubic-bezier timing)
 * Used for: smooth animations
 */

export const TRANSITION_TOKENS = {
  XS: "var(--transition-xs)", // 75ms
  SM: "var(--transition-sm)", // 100ms
  MD: "var(--transition-md)", // 150ms
  LG: "var(--transition-lg)", // 200ms
  XL: "var(--transition-xl)", // 300ms
};

/**
 * EXAMPLES - Transition Usage
 * 
 * 1. With Tailwind
 *    <div className="transition-all duration-200">Smooth transition</div>
 * 
 * 2. Custom CSS
 *    <style>
 *      .my-element {
 *        transition: all var(--transition-md) ease-out;
 *      }
 *    </style>
 * 
 * 3. Multiple properties
 *    <div className="transition-[color,box-shadow] duration-200">
 *      Multi-property transition
 *    </div>
 */

// ============================================
// PART 6: Z-INDEX TOKENS
// ============================================

/**
 * Z-index scale (logical layering)
 * Used for: stacking contexts
 */

export const Z_INDEX_TOKENS = {
  HIDE: "-1", // Hidden behind
  BASE: "0", // Normal layer
  DROPDOWN: "1000", // Dropdown menus
  STICKY: "1020", // Sticky elements
  FIXED: "1030", // Fixed elements
  MODAL: "1040", // Modal dialogs
  POPOVER: "1060", // Popovers
  TOOLTIP: "1070", // Tooltips
};

/**
 * EXAMPLES - Z-Index Usage
 * 
 * 1. Modal
 *    <div className="fixed inset-0 z-modal">Modal content</div>
 * 
 * 2. Dropdown
 *    <div className="absolute z-dropdown">Dropdown menu</div>
 * 
 * 3. Sticky header
 *    <header className="sticky top-0 z-sticky">Header</header>
 */

// ============================================
// PART 7: COMPONENT PATTERNS
// ============================================

/**
 * PATTERN 1: Button using tokens
 * 
 * Example code:
 * button className="
 *   px-4 py-2 rounded-md
 *   bg-primary text-white
 *   hover:bg-primary/90
 *   focus:ring-2 focus:ring-primary/30
 *   transition-all duration-200
 * "

/**
 * PATTERN 2: Card using tokens
 * 
 * Example code:
 * const cardElement = document.createElement('div');
 * cardElement.className = `
 *   bg-bg dark:bg-bg-dark
 *   border border-primary/10 dark:border-primary/20
 *   rounded-lg
 *   p-6
 *   shadow-md hover:shadow-lg
 *   transition-shadow duration-200
 * `;
 */

/**
 * PATTERN 3: Form input using tokens
 * 
 * Example code:
 * const inputElement = document.createElement('input');
 * inputElement.className = `
 *   w-full
 *   px-3 py-2 rounded-md
 *   bg-bg-muted/50 dark:bg-bg-dark/50
 *   border border-primary/20 dark:border-primary/30
 *   text-text-primary
 *   placeholder:text-text-muted
 *   focus:border-primary focus:ring-2 focus:ring-primary/30
 *   transition-all duration-200
 * `;
 */

/**
 * PATTERN 4: Layout using tokens
 * 
 * Example code:
 * const layoutElements = items.map(item => `
 *   <div className="p-lg rounded-lg bg-bg shadow-md">
 *     {item.content}
 *   </div>
 * `);
 */

// ============================================
// PART 8: DARK MODE
// ============================================

/**
 * Dark mode is automatic with the theme system.
 * 
 * 1. ThemeProvider applies .dark class to <html>
 * 2. CSS variables are overridden in .dark selector
 * 3. No need to manually add dark: in globals.css
 * 
 * Usage:
 * - Light mode: browser default, uses :root variables
 * - Dark mode: when .dark class is on <html>, uses .dark variables
 * - System: ThemeProvider detects prefers-color-scheme
 * 
 * Example in component:
 * <div className="bg-bg dark:bg-bg-dark text-text-primary">
 *   Automatically adapts to theme
 * </div>
 * 
 * The dark: prefix still works with CSS variables!
 */

// ============================================
// PART 9: ALPHA VALUES IN TAILWIND
// ============================================

/**
 * CSS Variables use RGB format for alpha support
 * 
 * Instead of: #3BC864FF (can't use opacity)
 * We use: rgb(59 200 100 / <alpha-value>)
 * 
 * This allows: bg-primary/50, text-primary/75, border-primary/20
 * 
 * Supported opacity values:
 * /0    /5    /10    /15    /20    /25    /30    /35    /40    /45
 * /50   /55   /60    /65    /70    /75    /80    /85    /90    /95
 * /100
 */

/**
 * EXAMPLES - Alpha Usage
 * 
 * 1. Subtle borders
 *    <div className="border border-primary/10">Subtle border</div>
 * 
 * 2. Hover backgrounds
 *    <div className="hover:bg-primary/5 dark:hover:bg-primary/20">
 *      Hover area
 *    </div>
 * 
 * 3. Focus rings
 *    <input className="focus:ring-primary/30" />
 * 
 * 4. Overlays
 *    <div className="bg-black/50">Dark overlay</div>
 */

// ============================================
// PART 10: RUNTIME THEME SWITCHING
// ============================================

/**
 * Use the useTheme() hook to switch themes at runtime
 * 
 * Hook provides: theme, setTheme, resolvedTheme
 * theme: "system" | "light" | "dark"
 * setTheme: (theme: "system" | "light" | "dark") => void
 * resolvedTheme: actual theme in use ("light" or "dark")
 * 
 * Example in component:
 * import { useTheme } from "@/components/theme/ThemeProvider";
 * 
 * export function MyComponent() {
 *   const { theme, setTheme, resolvedTheme } = useTheme();
 *   
 *   return (
 *     <div>
 *       Current: {resolvedTheme}
 *       <button onClick={() => setTheme("dark")}>
 *         Go dark
 *       </button>
 *     </div>
 *   );
 * }
 */

// ============================================
// PART 11: MIGRATION CHECKLIST
// ============================================

/**
 * When updating components to use tokens:
 * 
 * ✅ Replace hardcoded colors with CSS variable colors
 * ✅ Use primary/secondary/success/warning/error/info
 * ✅ Use text-primary/secondary/muted for text
 * ✅ Use bg-bg and bg-bg-dark for backgrounds
 * ✅ Use borders with primary/10 to primary/30 opacity
 * ✅ Replace spacing values with spacing tokens
 * ✅ Use rounded-xs through rounded-full for radius
 * ✅ Use shadow-xs through shadow-2xl for elevation
 * ✅ Test both light and dark modes
 * ✅ Use useTheme() for theme-aware logic
 * 
 * Files to reference:
 * - app/globals.css (token definitions)
 * - tailwind.config.ts (Tailwind integration)
 * - components/theme/ThemeProvider.tsx (theme management)
 * - components/theme/ThemeToggle.tsx (theme switching UI)
 */

// ============================================
// PART 12: QUICK REFERENCE
// ============================================

export const QUICK_REFERENCE = `
COLORS:
  Primary:        bg-primary, text-primary
  Secondary:      bg-secondary, text-secondary
  Success:        bg-success
  Warning:        bg-warning
  Error:          bg-error
  Info:           bg-info
  Background:     bg-bg, dark:bg-bg-dark
  Text:           text-text-primary, text-text-secondary, text-text-muted
  
SPACING (4px, 8px, 12px, 16px, 24px, 32px, 48px):
  p-xs, p-sm, p-md, p-lg, p-xl, p-2xl, p-3xl
  m-xs, m-sm, m-md, m-lg, m-xl, m-2xl, m-3xl
  gap-xs, gap-sm, gap-md, gap-lg, gap-xl, gap-2xl, gap-3xl

RADIUS (4px, 8px, 12px, 16px, 20px, circle):
  rounded-xs, rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-full

SHADOWS (6 levels):
  shadow-xs, shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl

TRANSITIONS (75ms - 300ms):
  duration-75, duration-100, duration-150, duration-200, duration-300

Z-INDEX:
  z-dropdown: 1000
  z-sticky: 1020
  z-fixed: 1030
  z-modal: 1040
  z-popover: 1060
  z-tooltip: 1070

OPACITY (alpha values):
  /5, /10, /20, /30, /50, /75, /90

EXAMPLE:
  <div className="
    bg-bg dark:bg-bg-dark
    border border-primary/10 dark:border-primary/20
    rounded-lg
    p-lg
    shadow-md hover:shadow-lg
    transition-shadow duration-200
  ">
    Token-powered component
  </div>
`;
