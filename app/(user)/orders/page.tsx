"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/orders/OrderCard";
import { Order } from "@/lib/types/order";
import { useRouter } from "next/navigation";

// Mock данные заказов
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2451",
    date: "2026-01-15T14:30:00Z",
    status: "completed",
    items: [
      { id: "1", dishId: "1", name: "Филадельфия ролл", quantity: 2, price: 32, subtotal: 64 },
      { id: "2", dishId: "3", name: "Лосось терияки боул", quantity: 1, price: 45, subtotal: 45 },
    ],
    itemsCount: 3,
    total: 109.0,
  },
  {
    id: "2",
    orderNumber: "ORD-2450",
    date: "2026-01-14T18:20:00Z",
    status: "cooking",
    items: [
      { id: "3", dishId: "2", name: "Калифорния ролл", quantity: 1, price: 28, subtotal: 28 },
      { id: "4", dishId: "4", name: "Мисо суп", quantity: 2, price: 18, subtotal: 36 },
    ],
    itemsCount: 3,
    total: 64.0,
  },
  {
    id: "3",
    orderNumber: "ORD-2449",
    date: "2026-01-13T12:15:00Z",
    status: "paid",
    items: [
      { id: "5", dishId: "6", name: "Мохито ролл", quantity: 1, price: 35, subtotal: 35 },
    ],
    itemsCount: 1,
    total: 35.0,
  },
];

/**
 * Orders Page
 * Route: /orders
 * Purpose: Order history and tracking
 */
export default function OrdersPage() {
  const router = useRouter();
  const [orders] = useState<Order[]>(mockOrders); // В будущем будет из API
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // В будущем здесь будет запрос к API
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Empty State
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="w-10 h-10 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Orders
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Order history and tracking
            </p>
          </motion.div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                No Orders Yet
              </CardTitle>
              <CardDescription>
                Your order history will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This page will show:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                <li>All your past and current orders</li>
                <li>Order status (New, Processing, Cooking, Completed, Cancelled)</li>
                <li>Order details (dishes, ingredients, total amount)</li>
                <li>Order tracking and updates</li>
              </ul>
              <Button
                onClick={() => router.push("/marketplace")}
                className="w-full"
              >
                Browse Marketplace
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Orders List
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Orders
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Order history and tracking
            </p>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Обновить
          </Button>
        </motion.div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
}
