/**
 * Fridge utilities for calculations and transformations
 */

import type { FridgeItem, FreshnessStatus } from './types';

/**
 * Get unit divisor for price calculations (g→kg, ml→l)
 */
export function getUnitDivisor(unit: string): number {
  switch (unit.toLowerCase()) {
    case 'g': return 1000;   // grams → kilograms
    case 'ml': return 1000;  // milliliters → liters
    case 'pcs':
    case 'szt': return 1;    // pieces
    default: return 1;
  }
}

/**
 * Calculate freshness status based on days left
 */
export function getFreshnessStatus(daysLeft: number | null): FreshnessStatus {
  if (daysLeft === null) return 'fresh'; // No expiry date
  if (daysLeft <= 1) return 'danger';
  if (daysLeft <= 3) return 'warning';
  return 'fresh';
}

/**
 * Calculate current value of a fridge item based on remaining quantity
 */
export function calculateCurrentValue(item: FridgeItem): number {
  if (!item.pricePerUnit) return 0;
  
  const remaining = item.quantityRemaining ?? item.quantity;
  const divisor = getUnitDivisor(item.unit);
  const quantityInPriceUnits = remaining / divisor;
  
  return quantityInPriceUnits * item.pricePerUnit;
}

/**
 * Calculate usage percentage (how much was consumed)
 */
export function calculateUsagePercent(item: FridgeItem): number {
  const total = item.quantityTotal ?? item.quantity;
  const remaining = item.quantityRemaining ?? item.quantity;
  
  if (total === 0) return 0;
  return ((total - remaining) / total) * 100;
}

/**
 * Calculate total fridge value based on remaining quantities
 * ✅ CORRECT: Uses remaining amounts, not purchase amounts
 */
export function calculateFridgeValue(items: FridgeItem[]): number {
  return items.reduce((sum, item) => {
    return sum + calculateCurrentValue(item);
  }, 0);
}

/**
 * Count items expiring soon (within N days)
 */
export function countExpiringSoon(items: FridgeItem[], withinDays: number = 2): number {
  return items.filter(item => 
    item.daysLeft !== null && item.daysLeft <= withinDays
  ).length;
}

/**
 * Normalize category (temporary fix until backend is updated)
 */
export function normalizeCategoryByName(category: string, name: string): string {
  const n = name.toLowerCase();
  
  // Fix oil categorization (масло = oil, NOT condiment)
  if (n.includes('масло') || n.includes('olej') || n.includes('oil')) {
    return 'oil';
  }
  
  // Fix sauce categorization
  if (n.includes('соус') || n.includes('sos') || n.includes('sauce')) {
    return 'sauce';
  }
  
  // Fix salt categorization
  if (n.includes('соль') || n.includes('sól') || n.includes('salt')) {
    return 'condiment';
  }
  
  return category;
}

/**
 * Enrich fridge item with calculated fields
 * Adds: freshness, currentValue, usagePercent
 */
export function enrichFridgeItem(item: FridgeItem): FridgeItem {
  // Set defaults for new fields if backend doesn't provide them
  const quantityTotal = item.quantityTotal ?? item.quantity;
  const quantityRemaining = item.quantityRemaining ?? item.quantity;
  
  return {
    ...item,
    quantityTotal,
    quantityRemaining,
    freshness: getFreshnessStatus(item.daysLeft),
    currentValue: calculateCurrentValue(item),
    usagePercent: calculateUsagePercent(item),
    // ✅ DON'T MODIFY categoryKey - backend is source of truth
  };
}

/**
 * Freshness styling configuration
 */
export const freshnessStyles = {
  fresh: {
    border: 'border-green-500',
    bg: 'bg-green-50 dark:bg-green-950/20',
    text: 'text-green-700 dark:text-green-400',
    icon: '🟢',
  },
  warning: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    text: 'text-yellow-700 dark:text-yellow-400',
    icon: '🟡',
  },
  danger: {
    border: 'border-red-500',
    bg: 'bg-red-50 dark:bg-red-950/20',
    text: 'text-red-700 dark:text-red-400',
    icon: '🔴',
  },
} as const;
