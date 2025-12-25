/**
 * 🎨 DESIGN SYSTEM - SINGLE SOURCE OF TRUTH
 * 
 * This file defines ALL visual decisions for the application.
 * Main page (`/app/page.tsx`) is the REFERENCE implementation.
 * 
 * ⚠️ RULES:
 * 1. NO inline styles (style={{}})
 * 2. NO custom colors (bg-[#123456])
 * 3. NO custom sizes (rounded-[18px], w-[234px])
 * 4. ONLY use tokens from this file
 * 5. ONLY use shared components
 * 
 * If you need a new style → add it here FIRST, then use everywhere.
 */

// ============================================
// 🎨 COLOR PALETTE (from main page reference)
// ============================================

export const colors = {
  // Primary (Green - Irradiated Toad)
  primary: {
    DEFAULT: "rgb(59 200 100)", // #3BC864
    light: "rgb(197 233 138)", // #C5E98A - Avocado Smoothie
    dark: "rgb(45 160 80)",
    foreground: "rgb(254 249 245)", // Hot White
  },

  // Secondary (Blue - Waterberry)
  secondary: {
    DEFAULT: "rgb(43 106 121)", // #2B6A79
    light: "rgb(80 180 200)", // Lighter cyan
    dark: "rgb(30 80 95)",
    foreground: "rgb(254 249 245)",
  },

  // Background
  background: {
    DEFAULT: "rgb(254 249 245)", // Hot White (light mode)
    dark: "rgb(15 15 20)", // Very dark (dark mode)
    muted: "rgb(224 216 208)", // Border color
    card: "rgb(255 255 255)", // Card background (light)
    cardDark: "rgb(26 26 37)", // Card background (dark)
  },

  // Text
  text: {
    primary: "rgb(36 15 36)", // Mystic Void (light mode)
    primaryDark: "rgb(250 250 255)", // Almost white (dark mode)
    secondary: "rgb(30 26 65)", // Sea by Night
    secondaryDark: "rgb(200 200 210)",
    muted: "rgb(120 120 140)",
  },

  // Accent colors (from main page)
  accent: {
    sky: {
      DEFAULT: "rgb(14 165 233)", // sky-500
      light: "rgb(56 189 248)", // sky-400
      dark: "rgb(3 105 161)", // sky-700
    },
    cyan: {
      DEFAULT: "rgb(6 182 212)", // cyan-500
      light: "rgb(34 211 238)", // cyan-400
      dark: "rgb(8 145 178)", // cyan-600
    },
    purple: {
      DEFAULT: "rgb(168 85 247)", // purple-500
      light: "rgb(192 132 252)", // purple-400
      dark: "rgb(126 34 206)", // purple-600
    },
    pink: {
      DEFAULT: "rgb(236 72 153)", // pink-500
      light: "rgb(244 114 182)", // pink-400
      dark: "rgb(219 39 119)", // pink-600
    },
    emerald: {
      DEFAULT: "rgb(16 185 129)", // emerald-500
      light: "rgb(52 211 153)", // emerald-400
      dark: "rgb(5 150 105)", // emerald-600
    },
  },

  // Semantic colors
  semantic: {
    success: "rgb(59 200 100)", // Same as primary
    warning: "rgb(251 191 36)", // amber-400
    error: "rgb(239 68 68)", // red-500
    info: "rgb(59 130 246)", // blue-500
  },
} as const;

// ============================================
// 📏 SPACING SCALE (8px base)
// ============================================

export const spacing = {
  // Micro spacing (for tight layouts)
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.5rem", // 24px
  "2xl": "2rem", // 32px
  "3xl": "3rem", // 48px
  "4xl": "4rem", // 64px
  "5xl": "6rem", // 96px
  "6xl": "8rem", // 128px

  // Container spacing (from main page)
  container: {
    padding: "1rem", // px-4
    paddingSm: "1.5rem", // sm:px-6
    paddingLg: "2rem", // lg:px-8
  },

  // Section spacing (from AcademyHero, AcademyAbout)
  section: {
    paddingY: "4rem", // py-16
    paddingYSm: "6rem", // sm:py-24
    paddingYLg: "8rem", // lg:py-32
  },
} as const;

// ============================================
// 🔲 BORDER RADIUS (from main page components)
// ============================================

export const radius = {
  none: "0",
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px - buttons
  md: "0.75rem", // 12px - cards
  lg: "1rem", // 16px - large cards
  xl: "1.25rem", // 20px - hero cards
  "2xl": "1.5rem", // 24px
  "3xl": "2rem", // 32px
  full: "9999px", // rounded-full
} as const;

// ============================================
// 🌫️ SHADOWS & EFFECTS (from main page)
// ============================================

export const shadows = {
  // Standard shadows
  xs: "0 1px 2px rgba(0, 0, 0, 0.04)",
  sm: "0 2px 4px rgba(0, 0, 0, 0.08)",
  md: "0 4px 12px rgba(0, 0, 0, 0.12)",
  lg: "0 8px 24px rgba(0, 0, 0, 0.16)",
  xl: "0 12px 32px rgba(0, 0, 0, 0.20)",
  "2xl": "0 16px 48px rgba(0, 0, 0, 0.24)",

  // Colored shadows (from main page accent cards)
  sky: "0 8px 24px rgba(14, 165, 233, 0.3)",
  cyan: "0 8px 24px rgba(6, 182, 212, 0.3)",
  purple: "0 8px 24px rgba(168, 85, 247, 0.3)",
  pink: "0 8px 24px rgba(236, 72, 153, 0.3)",
  emerald: "0 8px 24px rgba(16, 185, 129, 0.3)",
} as const;

// Glass effect (from main page cards)
export const glass = {
  background: "rgba(255, 255, 255, 0.06)",
  backgroundDark: "rgba(0, 0, 0, 0.2)",
  border: "rgba(255, 255, 255, 0.1)",
  blur: "16px",
} as const;

// ============================================
// 📝 TYPOGRAPHY (from main page)
// ============================================

export const typography = {
  // Font families
  fontFamily: {
    sans: 'var(--font-geist-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
    mono: 'var(--font-geist-mono, "Menlo", "Consolas", monospace)',
  },

  // Font sizes (from main page hierarchy)
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
    base: ["1rem", { lineHeight: "1.5rem" }], // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }], // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }], // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
    "5xl": ["3rem", { lineHeight: "1" }], // 48px
    "6xl": ["3.75rem", { lineHeight: "1" }], // 60px
    "7xl": ["4.5rem", { lineHeight: "1" }], // 72px - Hero heading
  },

  // Font weights
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  // Line heights
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
} as const;

// ============================================
// ⚡ ANIMATION PRESETS (Framer Motion)
// ============================================

export const animations = {
  // Page entrance (used on main page)
  pageEnter: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  },

  // Fade up (Hero elements)
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  },

  // Fade down
  fadeDown: {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  },

  // Fade in (simple)
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 },
    },
  },

  // Scale up (cards, modals)
  scaleUp: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  },

  // Slide in from left
  slideInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  },

  // Slide in from right
  slideInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  },

  // Stagger children (for lists)
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  },
} as const;

// ============================================
// 🖱️ HOVER & TRANSITION EFFECTS
// ============================================

export const transitions = {
  // Standard transitions
  fast: "75ms cubic-bezier(0.4, 0, 0.2, 1)",
  normal: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",

  // Hover effects (Framer Motion)
  hover: {
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { duration: 0.2 },
    },
    scaleSmall: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.15 },
    },
    lift: {
      whileHover: { y: -4 },
      transition: { duration: 0.2 },
    },
    glow: {
      whileHover: { boxShadow: shadows.xl },
      transition: { duration: 0.2 },
    },
  },
} as const;

// ============================================
// 📦 LAYOUT CONSTANTS (from main page)
// ============================================

export const layout = {
  // Max widths (container sizes)
  maxWidth: {
    xs: "20rem", // 320px
    sm: "24rem", // 384px
    md: "28rem", // 448px
    lg: "32rem", // 512px
    xl: "36rem", // 576px
    "2xl": "42rem", // 672px
    "3xl": "48rem", // 768px
    "4xl": "56rem", // 896px
    "5xl": "64rem", // 1024px
    "6xl": "72rem", // 1152px
    "7xl": "80rem", // 1280px - Main page container
    full: "100%",
  },

  // Breakpoints (responsive design)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Z-index scale (layering)
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030, // Header/Navigation
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

// ============================================
// 🎨 GRADIENT PRESETS (from main page)
// ============================================

export const gradients = {
  // Background gradients (main page reference)
  hero: "bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950",
  heroDark: "dark:from-gray-950 dark:via-sky-950 dark:to-cyan-950",

  // Text gradients (Hero heading)
  textSky: "bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-400",
  textCyan: "bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-400",
  textPurple: "bg-gradient-to-r from-purple-500 to-pink-500",
  textEmerald: "bg-gradient-to-r from-emerald-500 to-green-500",

  // Button gradients
  buttonPrimary: "bg-gradient-to-r from-sky-500 to-cyan-500",
  buttonPrimaryHover: "hover:from-sky-600 hover:to-cyan-600",
  buttonSecondary: "bg-gradient-to-r from-purple-500 to-pink-500",
  buttonSecondaryHover: "hover:from-purple-600 hover:to-pink-600",

  // Card gradients (glass effect)
  cardGlass: "bg-white/10 dark:bg-black/20",
  cardGlassBorder: "border border-white/20 dark:border-white/10",

  // Badge gradients (from Hero)
  badgeSky: "bg-sky-500/20 border-sky-400/50 dark:bg-sky-500/20 dark:border-sky-600/50",
  badgePurple: "bg-purple-500/20 border-purple-400/50",
  badgeEmerald: "bg-emerald-500/20 border-emerald-400/50",
} as const;

// ============================================
// 🚫 FORBIDDEN PATTERNS (DO NOT USE)
// ============================================

/**
 * ⚠️ NEVER USE THESE IN CODE:
 * 
 * ❌ style={{ color: '#123456' }}
 * ❌ className="bg-[#abcdef]"
 * ❌ className="rounded-[18px]"
 * ❌ className="w-[234px]"
 * ❌ className="shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
 * 
 * ✅ INSTEAD USE:
 * 
 * ✅ className="bg-sky-500" (from colors.accent.sky)
 * ✅ className="rounded-xl" (from radius.xl)
 * ✅ className="w-full max-w-7xl" (from layout.maxWidth)
 * ✅ className="shadow-lg" (from shadows.lg)
 */

// ============================================
// 📦 EXPORT UNIFIED DESIGN SYSTEM
// ============================================

export const designSystem = {
  colors,
  spacing,
  radius,
  shadows,
  glass,
  typography,
  animations,
  transitions,
  layout,
  gradients,
} as const;

export default designSystem;
