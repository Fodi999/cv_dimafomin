"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  amount: number;
  items: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
  paymentMethod: string;
}

interface OrdersTableProps {
  orders: Order[];
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (order: Order) => void;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2451",
    customer: "Іван Петров",
    email: "ivan@example.com",
    amount: 45.99,
    items: 3,
    status: "completed",
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
    status: "processing",
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
    status: "pending",
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
    status: "completed",
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
    status: "cancelled",
    date: "2024-01-11",
    paymentMethod: "Credit Card",
  },
];

const statusConfig = {
  pending: { label: "В ожиданні", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  processing: { label: "В обробці", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  completed: { label: "Завершено", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  cancelled: { label: "Скасовано", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
};

export function OrdersTable({ 
  orders = mockOrders, 
  onView, 
  onEdit, 
  onDelete 
}: OrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <Card>
      <CardHeader className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle>Таблиця замовлень</CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600 dark:text-slate-400">
              Елементів на сторінці:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <TableHead className="text-slate-900 dark:text-white font-semibold">Номер</TableHead>
                <TableHead className="text-slate-900 dark:text-white font-semibold">Клієнт</TableHead>
                <TableHead className="text-slate-900 dark:text-white font-semibold">Email</TableHead>
                <TableHead className="text-slate-900 dark:text-white font-semibold text-right">Сума</TableHead>
                <TableHead className="text-slate-900 dark:text-white font-semibold text-center">Товари</TableHead>
                <TableHead className="text-slate-900 dark:text-white font-semibold">Статус</TableHead>
                <TableHead className="text-slate-900 dark:text-white font-semibold">Дата</TableHead>
                <TableHead className="text-slate-900 dark:text-white font-semibold">Спосіб оплати</TableHead>
                <TableHead className="text-slate-900 dark:text-white font-semibold text-center">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <TableCell className="font-semibold text-slate-900 dark:text-white">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300">
                    {order.customer}
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300 text-sm">
                    {order.email}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900 dark:text-white">
                    ${order.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium text-sm">
                      {order.items}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusConfig[order.status].color}>
                      {statusConfig[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                    {new Date(order.date).toLocaleDateString("uk-UA")}
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                    {order.paymentMethod}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onView?.(order)}
                        className="p-1 rounded-md hover:bg-sky-100 dark:hover:bg-sky-900/30 text-sky-600 dark:text-sky-400 transition-colors"
                        title="Переглянути"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit?.(order)}
                        className="p-1 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition-colors"
                        title="Редагувати"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete?.(order)}
                        className="p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                        title="Видалити"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Сторінка <span className="font-semibold text-slate-900 dark:text-white">{currentPage}</span> з{" "}
            <span className="font-semibold text-slate-900 dark:text-white">{totalPages}</span>
            {" "}(Всього: <span className="font-semibold text-slate-900 dark:text-white">{orders.length}</span> замовлень)
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg font-medium text-sm transition-colors ${
                    currentPage === page
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                  }`}
                >
                  {page}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
