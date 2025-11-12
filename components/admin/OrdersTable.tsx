"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, AlertCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface AdminOrder {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
  items: number;
}

interface OrdersTableProps {
  orders: AdminOrder[];
  onUpdateStatus?: (orderId: string, newStatus: string) => void;
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  pending: {
    color: "bg-yellow-100 text-yellow-700",
    icon: <Clock className="w-4 h-4" />,
    label: "⏳ В ожидании",
  },
  completed: {
    color: "bg-green-100 text-green-700",
    icon: <CheckCircle className="w-4 h-4" />,
    label: "✅ Завершен",
  },
  failed: {
    color: "bg-red-100 text-red-700",
    icon: <AlertCircle className="w-4 h-4" />,
    label: "❌ Ошибка",
  },
};

export function OrdersTable({
  orders,
  onUpdateStatus,
}: OrdersTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
          🛒 Заказы
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                ID Заказа
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Клиент
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Сумма
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Товаров
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Статус
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Дата
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order, idx) => {
              const status = statusConfig[order.status] || statusConfig.pending;

              return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-sm text-gray-900 dark:text-white">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                    {order.userName}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {order.items} товар(ов)
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {status.icon}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.date).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">Заказы не найдены</p>
        </div>
      )}
    </motion.div>
  );
}
