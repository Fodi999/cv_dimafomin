"use client";

import React from 'react';
import { composite, colors, animations } from '@/lib/design-tokens';
import { motion } from 'framer-motion';

interface AdaptiveButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  loading?: boolean;
}

/**
 * AdaptiveButton - переиспользуемая кнопка с вариантами
 * 
 * Варианты:
 * - primary: основная кнопка с sky/cyan градиентом (по умолчанию)
 * - secondary: вторичная кнопка для дополнительных действий
 * - outline: кнопка только с границей
 * - ghost: кнопка только с текстом
 */
export default function AdaptiveButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  icon,
  loading = false,
}: AdaptiveButtonProps) {
  const variants = {
    primary: composite.buttonPrimary,
    secondary: `bg-sky-500/20 dark:bg-sky-500/30 text-sky-700 dark:text-sky-300 hover:bg-sky-500/30 dark:hover:bg-sky-500/40 font-semibold`,
    outline: `border-2 border-sky-500 dark:border-sky-400 text-sky-600 dark:text-sky-300 hover:bg-sky-500/10 dark:hover:bg-sky-500/20 font-semibold`,
    ghost: `text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 dark:hover:bg-sky-500/20 font-semibold`,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg
        transition-all
        flex items-center justify-center gap-2
        ${disabledClass}
        ${className}
      `}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      {icon && !loading && <span>{icon}</span>}
      {children}
    </motion.button>
  );
}
