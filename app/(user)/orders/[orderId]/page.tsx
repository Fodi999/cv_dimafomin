"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Package, CheckCircle2, Clock, ChefHat, Truck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderDetails, getOrderStatusConfig, OrderStatus } from "@/lib/types/order";

// Mock данные заказов (в реальности будут из API)
const mockOrderDetails: Record<string, OrderDetails> = {
  "1": {
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
    createdAt: "2026-01-15T14:30:00Z",
    updatedAt: "2026-01-15T15:45:00Z",
    customerName: "Иван Иванов",
    customerEmail: "ivan@example.com",
    customerPhone: "+48 123 456 789",
    deliveryAddress: {
      street: "ul. Example 123",
      city: "Варшава",
      postalCode: "00-000",
    },
    paymentMethod: "Наличными при получении",
    statusHistory: [
      { status: "new", timestamp: "2026-01-15T14:30:00Z" },
      { status: "paid", timestamp: "2026-01-15T14:32:00Z" },
      { status: "processing", timestamp: "2026-01-15T14:35:00Z" },
      { status: "cooking", timestamp: "2026-01-15T14:40:00Z" },
      { status: "ready", timestamp: "2026-01-15T15:30:00Z" },
      { status: "completed", timestamp: "2026-01-15T15:45:00Z" },
    ],
  },
  "2": {
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
    createdAt: "2026-01-14T18:20:00Z",
    updatedAt: "2026-01-14T18:45:00Z",
    customerName: "Иван Иванов",
    customerEmail: "ivan@example.com",
    customerPhone: "+48 123 456 789",
    deliveryAddress: {
      street: "ul. Example 123",
      city: "Варшава",
      postalCode: "00-000",
    },
    paymentMethod: "Наличными при получении",
    statusHistory: [
      { status: "new", timestamp: "2026-01-14T18:20:00Z" },
      { status: "paid", timestamp: "2026-01-14T18:22:00Z" },
      { status: "processing", timestamp: "2026-01-14T18:25:00Z" },
      { status: "cooking", timestamp: "2026-01-14T18:45:00Z" },
    ],
  },
  "3": {
    id: "3",
    orderNumber: "ORD-2449",
    date: "2026-01-13T12:15:00Z",
    status: "paid",
    items: [
      { id: "5", dishId: "6", name: "Мохито ролл", quantity: 1, price: 35, subtotal: 35 },
    ],
    itemsCount: 1,
    total: 35.0,
    createdAt: "2026-01-13T12:15:00Z",
    customerName: "Иван Иванов",
    customerEmail: "ivan@example.com",
    customerPhone: "+48 123 456 789",
    paymentMethod: "Наличными при получении",
    statusHistory: [
      { status: "new", timestamp: "2026-01-13T12:15:00Z" },
      { status: "paid", timestamp: "2026-01-13T12:17:00Z" },
    ],
  },
};

/**
 * Order Details Page
 * Route: /orders/[orderId]
 * Purpose: View order details and status timeline
 */
export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const orderId = params.orderId as string;
  const order = mockOrderDetails[orderId];

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Заказ не найден
          </h2>
          <Button onClick={() => router.push("/orders")}>
            Вернуться к заказам
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getOrderStatusConfig(order.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status timeline icons
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "new":
        return <Clock className="w-5 h-5" />;
      case "paid":
        return <CheckCircle2 className="w-5 h-5" />;
      case "processing":
        return <Package className="w-5 h-5" />;
      case "cooking":
        return <ChefHat className="w-5 h-5" />;
      case "ready":
        return <Truck className="w-5 h-5" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
    }
  };

  const statusOrder: OrderStatus[] = [
    "new",
    "paid",
    "processing",
    "cooking",
    "ready",
    "completed",
  ];

  const getStatusIndex = (status: OrderStatus) => {
    return statusOrder.indexOf(status);
  };

  const isStatusCompleted = (status: OrderStatus, currentStatus: OrderStatus) => {
    return getStatusIndex(status) <= getStatusIndex(currentStatus);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {order.orderNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {formatDate(order.date)}
            </p>
          </div>
          <Badge className={`${statusConfig.color} text-lg px-4 py-2`}>
            {statusConfig.icon} {statusConfig.label}
          </Badge>
        </motion.div>

        <div className="space-y-6">
          {/* Status Timeline */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Статус заказа</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusOrder.map((status, index) => {
                    const statusHistoryItem = order.statusHistory?.find(
                      (h) => h.status === status
                    );
                    const isCompleted = isStatusCompleted(status, order.status);
                    const isCurrent = status === order.status;

                    return (
                      <div key={status} className="flex items-start gap-4">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            isCompleted
                              ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                          }`}
                        >
                          {getStatusIcon(status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p
                                className={`font-semibold ${
                                  isCompleted
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-400"
                                }`}
                              >
                                {getOrderStatusConfig(status).label}
                              </p>
                              {statusHistoryItem && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatTime(statusHistoryItem.timestamp)}
                                </p>
                              )}
                            </div>
                            {isCurrent && (
                              <Badge variant="outline" className="ml-2">
                                Текущий
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Информация о заказе</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Номер заказа</p>
                  <p className="font-semibold">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Дата создания</p>
                  <p className="font-semibold">{formatDate(order.createdAt)}</p>
                </div>
                {order.paymentMethod && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Способ оплаты</p>
                    <p className="font-semibold">{order.paymentMethod}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Всего</p>
                  <p className="font-semibold text-lg text-purple-600 dark:text-purple-400">
                    {order.total.toFixed(2)} PLN
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Блюда в заказе</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead className="text-right">Количество</TableHead>
                    <TableHead className="text-right">Цена</TableHead>
                    <TableHead className="text-right">Итого</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.price.toFixed(2)} PLN</TableCell>
                      <TableCell className="text-right font-semibold">
                        {item.subtotal.toFixed(2)} PLN
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="font-bold text-right">
                      Итого:
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg text-purple-600 dark:text-purple-400">
                      {order.total.toFixed(2)} PLN
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Customer Info */}
          {(order.customerName || order.customerEmail || order.customerPhone) && (
            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.customerName && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Имя</p>
                    <p className="font-semibold">{order.customerName}</p>
                  </div>
                )}
                {order.customerEmail && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-semibold">{order.customerEmail}</p>
                  </div>
                )}
                {order.customerPhone && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Телефон</p>
                    <p className="font-semibold">{order.customerPhone}</p>
                  </div>
                )}
                {order.deliveryAddress && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Адрес доставки</p>
                    <p className="font-semibold">
                      {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.postalCode}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
