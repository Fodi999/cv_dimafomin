"use client";

import React from 'react';
import { colors } from '@/lib/design-tokens';

interface AdaptiveBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  icon?: React.ReactNode;
  className?: string;
}

/**
 * AdaptiveBadge - переиспользуемый значок/бейдж с вариантами
 * 
 * Варианты:
 * - primary: sky/cyan (основной)
 * - success: emerald (успешный статус)
 * - warning: amber (предупреждение)
 * - error: rose (ошибка)
 * - accent: amber/orange (для токенов и важных элементов)
 */
export default function AdaptiveBadge({
  children,
  variant = 'primary',
  icon,
  className = '',
}: AdaptiveBadgeProps) {
  const variants = {
    primary: {
      light: colors.primary.light.badge,
      dark: colors.primary.dark.badge,
      text: `${colors.primary.light.text} ${colors.primary.dark.text}`,
    },
    success: {
      light: colors.success.light.badge,
      dark: colors.success.dark.badge,
      text: `${colors.success.light.text} ${colors.success.dark.text}`,
    },
    warning: {
      light: colors.warning.light.badge,
      dark: colors.warning.dark.badge,
      text: `${colors.warning.light.text} ${colors.warning.dark.text}`,
    },
    error: {
      light: colors.error.light.badge,
      dark: colors.error.dark.badge,
      text: `${colors.error.light.text} ${colors.error.dark.text}`,
    },
    accent: {
      light: colors.accent.light.badge,
      dark: colors.accent.dark.badge,
      text: `${colors.accent.light.text} ${colors.accent.dark.text}`,
    },
  };

  const selectedVariant = variants[variant];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
        ${selectedVariant.light} ${selectedVariant.dark}
        ${selectedVariant.text}
        ${className}
      `}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {children}
    </span>
  );
}
