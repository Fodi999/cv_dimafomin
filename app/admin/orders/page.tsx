"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShoppingCart, Search, Plus, Eye, Edit2, Trash2 } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  amount: number;
  items: number;
  status: "completed" | "processing" | "pending" | "cancelled";
  date: string;
  paymentMethod: string;
}

interface OrderDetailProps {
  label: string;
  value?: string;
  customContent?: React.ReactNode;
  isHighlight?: boolean;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ 
  label, 
  value, 
  customContent,
  isHighlight = false 
}) => (
  <div className="flex flex-col py-2 px-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</p>
    <div>
      {customContent ? (
        customContent
      ) : (
        <p className={`text-sm font-medium ${
          isHighlight
            ? "text-green-600 dark:text-green-400"
            : "text-slate-900 dark:text-white"
        }`}>
          {value}
        </p>
      )}
    </div>
  </div>
);

const mockOrders: Order[] = [
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
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "processing":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case "pending":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "✅ Завершено";
      case "processing":
        return "⏳ В обробці";
      case "pending":
        return "⏸️ В ожиданні";
      case "cancelled":
        return "❌ Скасовано";
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <ShoppingCart size={32} className="text-purple-600" />
            Замовлення
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Керуйте замовленнями системи
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
          <Plus size={18} />
          Нове замовлення
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6 bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/50">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400 size-5" />
          <Input
            placeholder="Пошук по номеру замовлення, імені або email..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
      </Card>

      {/* Orders Accordion */}
      <div className="space-y-3">
        {filteredOrders.map((order, idx) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="overflow-hidden bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/50">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={order.id} className="border-0">
                  <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div className="flex items-center gap-4 text-left flex-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{order.customer}</p>
                      </div>
                      {/* Desktop: Show preview info */}
                      <div className="hidden sm:flex gap-3 ml-4 text-sm">
                        <span className="text-green-600 dark:text-green-400 font-medium whitespace-nowrap">${order.amount.toFixed(2)}</span>
                        <span className="text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.items} товарів</span>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                        <span className="text-slate-600 dark:text-slate-400 whitespace-nowrap">{order.date}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 space-y-2 border-t border-slate-200 dark:border-slate-700">
                    {/* Info Grid - 3 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Email */}
                      <OrderDetail 
                        label="Email" 
                        value={order.email}
                      />

                      {/* Items */}
                      <OrderDetail 
                        label="Кількість товарів" 
                        value={order.items.toString()}
                      />

                      {/* Status */}
                      <OrderDetail 
                        label="Статус" 
                        customContent={
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        }
                      />

                      {/* Date */}
                      <OrderDetail 
                        label="Дата" 
                        value={new Date(order.date).toLocaleDateString("uk-UA", { 
                          year: "numeric", 
                          month: "long", 
                          day: "numeric" 
                        })}
                      />

                      {/* Payment Method */}
                      <OrderDetail 
                        label="Спосіб оплати" 
                        value={order.paymentMethod}
                      />

                      {/* Amount */}
                      <OrderDetail 
                        label="Сума" 
                        value={`$${order.amount.toFixed(2)}`}
                        isHighlight
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Button
                        size="sm"
                        className="flex items-center justify-center gap-1"
                      >
                        <Eye size={16} />
                        Переглянути
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center justify-center gap-1"
                      >
                        <Edit2 size={16} />
                        Редагувати
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-1"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
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
