/**
 * Fridge Calculation Utilities
 * ✅ ПРАВИЛЬНЫЕ формулы расчёта стоимости холодильника
 */

import type { FridgeItemVM } from '../mappers/fridge.mapper';

/**
 * Конвертирует единицы продукта в единицы цены
 * g → kg (÷1000), ml → l (÷1000), pcs → pcs (×1)
 */
function getUnitDivisor(unit: string): number {
  switch (unit.toLowerCase()) {
    case 'g':
    case 'ml':
      return 1000;
    default:
      return 1;
  }
}

/**
 * ✅ ПРАВИЛЬНЫЙ расчёт стоимости холодильника
 * Считает только по ОСТАТКАМ, а не по покупкам!
 * 
 * Формула: SUM((remainingAmount / divisor) × pricePerUnit)
 */
export function calculateFridgeValue(items: FridgeItemVM[]): number {
  return items.reduce((sum, item) => {
    if (!item.pricePerUnit || item.pricePerUnit <= 0) return sum;
    
    const divisor = getUnitDivisor(item.unit);
    const remainingInPriceUnits = item.remainingAmount / divisor;
    const currentValue = remainingInPriceUnits * item.pricePerUnit;
    
    return sum + currentValue;
  }, 0);
}

/**
 * Подсчёт продуктов, которые скоро испортятся
 * @param items - список продуктов
 * @param maxDays - максимум дней (по умолчанию 2)
 */
export function countExpiringSoon(items: FridgeItemVM[], maxDays: number = 2): number {
  return items.filter(item => item.daysLeft <= maxDays).length;
}

/**
 * Стоимость продуктов, которые скоро испортятся
 */
export function calculateExpiringSoonValue(items: FridgeItemVM[], maxDays: number = 2): number {
  const expiring = items.filter(item => item.daysLeft <= maxDays);
  return calculateFridgeValue(expiring);
}

/**
 * Группировка продуктов по статусу свежести
 */
export function groupByFreshness(items: FridgeItemVM[]) {
  return {
    fresh: items.filter(item => item.freshness === 'fresh'),
    warning: items.filter(item => item.freshness === 'warning'),
    danger: items.filter(item => item.freshness === 'danger'),
  };
}

/**
 * Стили для статуса свежести
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
};

/**
 * Форматирование процента использования
 */
export function formatUsagePercent(total: number, remaining: number): string {
  if (total <= 0) return '0%';
  const percent = ((total - remaining) / total) * 100;
  return `${Math.round(percent)}%`;
}

/**
 * Форматирование цены
 */
export function formatPrice(price: number, currency: string = 'PLN'): string {
  return `${price.toFixed(2)} ${currency}`;
}
