/**
 * Unified Adaptive Design System - Design Tokens
 * 
 * Центральное хранилище всех дизайн-токенов для всего приложения.
 * Обеспечивает консистентность визуального оформления и упрощает будущие изменения.
 * 
 * Основной подход:
 * - Единая цветовая палитра (Sky/Cyan) как основная темя
 * - Адаптивные компоненты, которые подстраиваются под контекст
 * - Dark mode поддержка на всех уровнях
 * - Реиспользуемые значения для анимаций, границ, теней
 */

/**
 * COLOR PALETTE - Основная цветовая палитра
 */
export const colors = {
  // Primary: Sky/Cyan Gradient (основной цвет системы)
  primary: {
    light: {
      from: 'from-sky-500',      // #00a5ef
      to: 'to-cyan-500',          // #00b7d7
      gradient: 'from-sky-500 to-cyan-500',
      badge: 'bg-sky-500/10 border border-sky-200/50',
      text: 'text-sky-600',
    },
    dark: {
      from: 'dark:from-sky-600',
      to: 'dark:to-cyan-600',
      gradient: 'dark:from-sky-600 dark:to-cyan-600',
      badge: 'dark:bg-sky-500/20 dark:border-sky-800/50',
      text: 'dark:text-sky-400',
    },
  },

  // Accent: Amber/Orange (для токенов, важных элементов)
  accent: {
    light: {
      from: 'from-amber-500',
      to: 'to-orange-500',
      badge: 'bg-amber-100 border border-amber-200',
      text: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    dark: {
      badge: 'dark:bg-amber-900/40 dark:border-amber-700',
      text: 'dark:text-amber-400',
      bg: 'dark:bg-amber-950',
    },
  },

  // Success: Emerald (для позитивных действий)
  success: {
    light: {
      badge: 'bg-emerald-100 border border-emerald-200',
      text: 'text-emerald-700',
    },
    dark: {
      badge: 'dark:bg-emerald-900/40 dark:border-emerald-700',
      text: 'dark:text-emerald-400',
    },
  },

  // Warning: Amber (для предупреждений)
  warning: {
    light: {
      badge: 'bg-amber-100 border border-amber-200',
      text: 'text-amber-700',
    },
    dark: {
      badge: 'dark:bg-amber-900/40 dark:border-amber-700',
      text: 'dark:text-amber-400',
    },
  },

  // Error: Rose (для ошибок)
  error: {
    light: {
      badge: 'bg-rose-100 border border-rose-200',
      text: 'text-rose-700',
    },
    dark: {
      badge: 'dark:bg-rose-900/40 dark:border-rose-700',
      text: 'dark:text-rose-400',
    },
  },

  // Background: White/Gray neutral (для фонов)
  background: {
    light: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      subtle: 'bg-gray-100',
      overlay: 'bg-white/50',
    },
    dark: {
      primary: 'dark:bg-gray-950',
      secondary: 'dark:bg-gray-900',
      subtle: 'dark:bg-gray-800',
      overlay: 'dark:bg-gray-950/50',
    },
  },

  // Text: для различных уровней контраста
  text: {
    light: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      tertiary: 'text-gray-500',
      muted: 'text-gray-400',
    },
    dark: {
      primary: 'dark:text-white',
      secondary: 'dark:text-gray-300',
      tertiary: 'dark:text-gray-400',
      muted: 'dark:text-gray-500',
    },
  },

  // Border: границы для всех элементов
  border: {
    light: {
      primary: 'border-sky-200/50',
      secondary: 'border-gray-200',
      subtle: 'border-gray-100',
    },
    dark: {
      primary: 'dark:border-sky-800/50',
      secondary: 'dark:border-gray-800',
      subtle: 'dark:border-gray-700',
    },
  },
};

/**
 * SHADOWS - Система теней для глубины
 */
export const shadows = {
  // Small shadow для карточек
  sm: {
    light: 'shadow-sm',
    dark: 'dark:shadow-sm',
    hover: 'hover:shadow-md dark:hover:shadow-sky-500/10',
  },

  // Medium shadow (default для большинства элементов)
  md: {
    light: 'shadow-md',
    dark: 'dark:shadow-md',
    hover: 'hover:shadow-lg dark:hover:shadow-sky-500/20',
  },

  // Large shadow для модалей и выделяющихся элементов
  lg: {
    light: 'shadow-lg',
    dark: 'dark:shadow-lg',
    hover: 'hover:shadow-xl dark:hover:shadow-sky-500/30',
  },

  // Sky-colored glow (специальное свечение для primary элементов)
  glow: {
    light: 'shadow-sky-500/20',
    dark: 'dark:shadow-sky-500/40',
  },
};

/**
 * BORDER RADIUS - Радиусы скругления
 */
export const borderRadius = {
  sm: 'rounded-lg',      // 8px
  md: 'rounded-xl',      // 12px
  lg: 'rounded-2xl',     // 16px
  full: 'rounded-full',  // 9999px
};

/**
 * SPACING - Система отступов
 */
export const spacing = {
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2xl': 'p-12',
};

/**
 * ANIMATIONS - Параметры анимаций (используется с Framer Motion)
 */
export const animations = {
  // Spring для интерактивных элементов
  spring: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },

  // Smooth transition для плавных смен
  smooth: {
    duration: 0.3,
    ease: 'easeInOut',
  },

  // Default для большинства анимаций
  default: {
    duration: 0.6,
  },

  // Stagger для списков
  stagger: (idx: number) => idx * 0.1,
};

/**
 * GRADIENTS - Предустановленные градиенты
 */
export const gradients = {
  // Primary gradient (Sky to Cyan)
  primary: 'bg-gradient-to-r from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600',

  // Subtle background gradient
  background: 'bg-gradient-to-b from-sky-500/5 via-transparent to-cyan-500/5 dark:from-sky-500/10 dark:to-cyan-500/10',

  // Text gradient для заголовков
  text: 'bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent',

  // Hover gradient для кнопок
  hover: 'from-sky-600 to-cyan-600 dark:from-sky-700 dark:to-cyan-700',
};

/**
 * COMPOSITE - Готовые комбинации для частых случаев
 */
export const composite = {
  // Карточка по умолчанию
  card: {
    container: 'bg-white dark:bg-gray-900 rounded-xl shadow-md dark:shadow-md border border-sky-200/50 dark:border-sky-800/50',
    hover: 'hover:shadow-lg dark:hover:shadow-sky-500/20 transition-all',
  },

  // Кнопка primary
  buttonPrimary: 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 dark:from-sky-600 dark:to-cyan-600 dark:hover:from-sky-700 dark:hover:to-cyan-700 text-white font-bold shadow-md dark:shadow-sky-500/20 hover:shadow-lg dark:hover:shadow-sky-500/30 transition-all',

  // Badge primary
  badgePrimary: 'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-200/50 dark:border-sky-800/50',

  // Section background
  sectionBg: 'bg-gradient-to-b from-white/50 to-white dark:from-gray-950/50 dark:to-gray-950',

  // Input field
  input: 'px-4 py-2 bg-white dark:bg-gray-900 border border-sky-200/50 dark:border-sky-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500',
};

/**
 * BREAKPOINTS - Адаптивные точки (соответствуют Tailwind)
 */
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * Z-INDEX - Слои для правильной наложения элементов
 */
export const zIndex = {
  dropdown: 50,
  sticky: 100,
  fixed: 200,
  modal: 500,
  popover: 750,
  notification: 1000,
};

/**
 * THEME CONTEXT - для адаптации под контекст страницы/компонента
 */
export const themeVariants = {
  // Нейтральная (по умолчанию для большинства)
  neutral: colors.primary,

  // Для специальных контекстов (если нужны другие цвета)
  marketplace: {
    light: {
      ...colors.primary.light,
    },
    dark: {
      ...colors.primary.dark,
    },
  },

  academy: {
    light: {
      ...colors.primary.light,
    },
    dark: {
      ...colors.primary.dark,
    },
  },

  profile: {
    light: {
      ...colors.primary.light,
    },
    dark: {
      ...colors.primary.dark,
    },
  },
};

/**
 * UTILITIES - функции-помощники для работы с токенами
 */
export const designTokenUtils = {
  /**
   * Объединить light и dark варианты цвета
   */
  mergeColorVariants: (light: string, dark: string) => `${light} ${dark}`,

  /**
   * Создать gradient с поддержкой dark mode
   */
  createGradient: (lightFrom: string, lightTo: string, darkFrom: string, darkTo: string) => 
    `bg-gradient-to-r ${lightFrom} ${lightTo} ${darkFrom} ${darkTo}`,

  /**
   * Создать composite класс для карточки с вариантом
   */
  createCardClasses: (variant: 'default' | 'elevated' = 'default') => {
    const variants = {
      default: composite.card.container,
      elevated: `${composite.card.container} shadow-lg dark:shadow-sky-500/20`,
    };
    return `${variants[variant]} ${composite.card.hover}`;
  },

  /**
   * Получить классы для любого элемента по типу
   */
  getElementClasses: (type: 'card' | 'button' | 'badge' | 'input', variant = 'default') => {
    const elements: Record<string, Record<string, string>> = {
      card: { default: composite.card.container },
      button: { default: composite.buttonPrimary },
      badge: { default: composite.badgePrimary },
      input: { default: composite.input },
    };
    return elements[type]?.[variant] || '';
  },
};

export default {
  colors,
  shadows,
  borderRadius,
  spacing,
  animations,
  gradients,
  composite,
  breakpoints,
  zIndex,
  themeVariants,
  ...designTokenUtils,
};
