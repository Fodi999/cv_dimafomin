/**
 * Frontend-first синхронизация между Складом и Списаниями
 * 
 * Это UX-ожидание, которое потом 1-в-1 повторит backend.
 * Пока без backend, делаем визуальную синхронизацию через состояние.
 */

import { FridgeItem } from "@/lib/types";
import { LossItemUI, LossItemType } from "@/lib/types/warehouse-ui";
import { isExpired, calculateDaysLeft } from "@/lib/types/warehouse-ui";
import { getLocalizedIngredientName } from "@/lib/i18n/translateIngredient";

/**
 * Преобразует FridgeItem в LossItemUI для EXPIRED продуктов
 */
export function convertExpiredToLoss(
  item: FridgeItem,
  language: "en" | "ru" | "pl" = "ru"
): LossItemUI | null {
  if (!isExpired(item.expiresAt)) {
    return null;
  }

  const productName = getLocalizedIngredientName(item.ingredient as any, language);
  const amount = item.computed?.totalCost || item.currentValue || 0;

  return {
    id: `loss-${item.id}-${Date.now()}`,
    productName,
    quantity: item.quantityRemaining ?? item.quantity,
    unit: item.unit,
    amount,
    type: "EXPIRED" as LossItemType,
    occurredAt: new Date().toISOString(),
    expiryDate: item.expiresAt || undefined,
  };
}

/**
 * Находит все EXPIRED продукты в списке склада
 */
export function findExpiredItems(items: FridgeItem[]): FridgeItem[] {
  return items.filter((item) => isExpired(item.expiresAt));
}

/**
 * Преобразует все EXPIRED продукты в LossItemUI
 */
export function convertAllExpiredToLosses(
  items: FridgeItem[],
  language: "en" | "ru" | "pl" = "ru"
): LossItemUI[] {
  const expiredItems = findExpiredItems(items);
  return expiredItems
    .map((item) => convertExpiredToLoss(item, language))
    .filter((loss): loss is LossItemUI => loss !== null);
}

/**
 * Mock-логика синхронизации (для визуализации)
 * 
 * В реальности это будет делать backend, но на фронтенде мы показываем,
 * как это должно работать визуально.
 */
export function syncWarehouseToLosses(
  warehouseItems: FridgeItem[],
  language: "en" | "ru" | "pl" = "ru"
): {
  activeWarehouseItems: FridgeItem[];
  expiredLosses: LossItemUI[];
} {
  // 1. Фильтруем EXPIRED из склада
  const activeWarehouseItems = warehouseItems.filter((item) => !isExpired(item.expiresAt));

  // 2. Преобразуем EXPIRED в списания
  const expiredLosses = convertAllExpiredToLosses(warehouseItems, language);

  console.log('[warehouse-sync] 🔄 Synced:', {
    totalItems: warehouseItems.length,
    activeItems: activeWarehouseItems.length,
    expiredCount: expiredLosses.length,
  });

  return {
    activeWarehouseItems,
    expiredLosses,
  };
}
