/**
 * Единый UI-контракт между Складом и Списаниями
 * Frontend-first подход для синхронизации визуального состояния
 */

export type WarehouseItemStatus = "OK" | "WARNING" | "EXPIRED";

export interface WarehouseItemUI {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  expiresAt: string;
  status: WarehouseItemStatus;
  daysLeft: number | null;
}

export type LossItemType = "EXPIRED" | "MANUAL";

export interface LossItemUI {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  amount: number; // Сумма потери в PLN
  type: LossItemType;
  occurredAt: string; // ISO date string
  expiryDate?: string; // Дата истечения срока (для EXPIRED)
}

/**
 * Утилита для определения статуса на основе daysLeft
 */
export function getWarehouseStatus(daysLeft: number | null): WarehouseItemStatus {
  if (daysLeft === null) return "OK";
  if (daysLeft < 0) return "EXPIRED";
  if (daysLeft <= 2) return "WARNING";
  return "OK";
}

/**
 * Утилита для проверки, истек ли срок
 */
export function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  const expiryDate = new Date(expiresAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  return expiryDate < today;
}

/**
 * Утилита для вычисления daysLeft
 */
export function calculateDaysLeft(expiresAt: string | null): number | null {
  if (!expiresAt) return null;
  const expiryDate = new Date(expiresAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
