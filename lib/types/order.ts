/**
 * Order Types for Customer
 * 
 * Статусы заказов фиксируются на фронтенде для UI-контракта
 */

export type OrderStatus =
  | "new"
  | "paid"
  | "processing"
  | "cooking"
  | "ready"
  | "completed"
  | "cancelled";

export interface OrderItem {
  id: string;
  dishId: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g., "ORD-2451"
  date: string; // ISO date string
  status: OrderStatus;
  items: OrderItem[];
  itemsCount: number;
  total: number;
  currency?: string; // Default: "PLN"
}

export interface OrderDetails extends Order {
  // Additional fields for order details page
  createdAt: string;
  updatedAt?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
  };
  paymentMethod?: string;
  statusHistory?: Array<{
    status: OrderStatus;
    timestamp: string;
  }>;
}

/**
 * Get status badge configuration
 */
export function getOrderStatusConfig(status: OrderStatus) {
  switch (status) {
    case "new":
      return {
        label: "Новый",
        color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400",
        icon: "🟡",
      };
    case "paid":
      return {
        label: "Оплачен",
        color: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
        icon: "🔵",
      };
    case "processing":
      return {
        label: "В обработке",
        color: "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400",
        icon: "🟠",
      };
    case "cooking":
      return {
        label: "Готовится",
        color: "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
        icon: "🟣",
      };
    case "ready":
      return {
        label: "Готов",
        color: "bg-cyan-100 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400",
        icon: "🔷",
      };
    case "completed":
      return {
        label: "Завершён",
        color: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
        icon: "🟢",
      };
    case "cancelled":
      return {
        label: "Отменён",
        color: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400",
        icon: "🔴",
      };
  }
}
