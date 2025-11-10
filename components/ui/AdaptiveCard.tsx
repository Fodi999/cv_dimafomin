"use client";

import React from 'react';
import { composite, colors, shadows, animations } from '@/lib/design-tokens';

interface AdaptiveCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  hover?: boolean;
  className?: string;
}

/**
 * AdaptiveCard - переиспользуемая карточка с поддержкой вариантов
 * 
 * Варианты:
 * - default: стандартная карточка с тенью
 * - elevated: карточка с повышенной тенью
 * - outlined: карточка только с границей, без фона
 */
export default function AdaptiveCard({
  children,
  variant = 'default',
  hover = true,
  className = '',
}: AdaptiveCardProps) {
  const variants = {
    default: `${composite.card.container}`,
    elevated: `${composite.card.container} shadow-lg dark:shadow-sky-500/30`,
    outlined: `rounded-xl border border-sky-200/50 dark:border-sky-800/50 bg-transparent`,
  };

  const hoverClass = hover ? composite.card.hover : '';

  return (
    <div className={`${variants[variant]} ${hoverClass} transition-all ${className}`}>
      {children}
    </div>
  );
}
