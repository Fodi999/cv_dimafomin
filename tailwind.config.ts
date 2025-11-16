import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ===== COLORS - Connected to CSS Variables ===== */
      colors: {
        /* Primary colors using CSS variables */
        primary: "rgb(var(--color-primary-rgb) / <alpha-value>)",
        "primary-light": "rgb(var(--color-primary-light-rgb) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary-rgb) / <alpha-value>)",
        "secondary-light": "rgb(var(--color-secondary-light-rgb) / <alpha-value>)",
        
        /* Background colors */
        bg: "rgb(var(--color-bg-rgb) / <alpha-value>)",
        "bg-dark": "rgb(var(--color-bg-dark-rgb) / <alpha-value>)",
        "bg-muted": "rgb(var(--color-bg-muted-rgb) / <alpha-value>)",
        
        /* Text colors */
        text: {
          primary: "rgb(var(--color-text-primary-rgb) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary-rgb) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted-rgb) / <alpha-value>)",
        },
        
        /* Status colors */
        success: "rgb(var(--color-success-rgb) / <alpha-value>)",
        warning: "rgb(var(--color-warning-rgb) / <alpha-value>)",
        error: "rgb(var(--color-error-rgb) / <alpha-value>)",
        info: "rgb(var(--color-info-rgb) / <alpha-value>)",
      },

      /* ===== SPACING - Connected to CSS Variables ===== */
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "var(--spacing-3xl)",
      },

      /* ===== BORDER RADIUS - Connected to CSS Variables ===== */
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },

      /* ===== BOX SHADOW - Connected to CSS Variables ===== */
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
      },

      /* ===== TRANSITIONS - Connected to CSS Variables ===== */
      transitionDuration: {
        xs: "var(--transition-xs)",
        sm: "var(--transition-sm)",
        md: "var(--transition-md)",
        lg: "var(--transition-lg)",
        xl: "var(--transition-xl)",
      },

      /* ===== Z-INDEX SCALE ===== */
      zIndex: {
        hide: "var(--z-hide)",
        base: "var(--z-base)",
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        fixed: "var(--z-fixed)",
        "modal-backdrop": "var(--z-modal-backdrop)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        tooltip: "var(--z-tooltip)",
      },

      /* ===== FONT FAMILY ===== */
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: [
          'Menlo',
          'Consolas',
          'Monaco',
          'Courier New',
          'monospace',
        ],
      },

      /* ===== ANIMATIONS ===== */
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "fade-out": "fadeOut 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-safe-area")],
};

export default config;
