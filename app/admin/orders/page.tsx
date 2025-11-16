"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { OrdersPageHeader } from "@/components/admin/OrdersPageHeader";
import { OrdersTable } from "@/components/admin/OrdersTableEnhanced";

const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD-2451",
    customer: "Іван Петров",
    email: "ivan@example.com",
    amount: 45.99,
    items: 3,
    status: "completed" as const,
    date: "2024-01-15",
    paymentMethod: "Credit Card",
  },
  {
    id: "2",
    orderNumber: "ORD-2450",
    customer: "Марія Сидорова",
    email: "maria@example.com",
    amount: 32.50,
    items: 2,
    status: "processing" as const,
    date: "2024-01-14",
    paymentMethod: "PayPal",
  },
  {
    id: "3",
    orderNumber: "ORD-2449",
    customer: "Алексей Иванов",
    email: "alexey@example.com",
    amount: 78.25,
    items: 5,
    status: "pending" as const,
    date: "2024-01-13",
    paymentMethod: "Credit Card",
  },
  {
    id: "4",
    orderNumber: "ORD-2448",
    customer: "Анна Коваль",
    email: "anna@example.com",
    amount: 120.00,
    items: 4,
    status: "completed" as const,
    date: "2024-01-12",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "5",
    orderNumber: "ORD-2447",
    customer: "Петро Бондар",
    email: "petro@example.com",
    amount: 55.75,
    items: 2,
    status: "cancelled" as const,
    date: "2024-01-11",
    paymentMethod: "Credit Card",
  },
];

export default function OrdersPage() {
  const [orders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(lowerQuery) ||
        order.customer.toLowerCase().includes(lowerQuery) ||
        order.email.toLowerCase().includes(lowerQuery)
    );

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (filters: any) => {
    if (!filters.status) {
      setFilteredOrders(orders);
      return;
    }

    const filtered = orders.filter((order) => order.status === filters.status);
    setFilteredOrders(filtered);
  };

  const handleViewOrder = (order: any) => {
    console.log("Переглянути замовлення:", order);
  };

  const handleEditOrder = (order: any) => {
    console.log("Редагувати замовлення:", order);
  };

  const handleDeleteOrder = (order: any) => {
    console.log("Видалити замовлення:", order);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <OrdersPageHeader
        totalOrders={orders.length}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      <OrdersTable
        orders={filteredOrders}
        onView={handleViewOrder}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
      />

      {filteredOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Замовлення не знайдено
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
            Спробуйте змінити фільтри або параметри пошуку.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
