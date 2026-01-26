/**
 * Orders Page - Заказы
 * Route: /admin/orders
 * Purpose: Точка фиксации дохода и потребления ингредиентов
 * Features: История заказов, статусы, детали блюд и ингредиентов, связь со складом и экономикой
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Plus,
  Eye,
  Calendar,
  User,
  DollarSign,
  Package,
  TrendingUp,
  XCircle,
  Clock,
  ChefHat,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Типы данных
type OrderStatus = "new" | "processing" | "cooking" | "completed" | "cancelled";
type OrderChannel = "online" | "pos" | "delivery" | "marketplace";

interface OrderDish {
  id: string;
  name: string;
  quantity: number;
  price: number;
  costPrice?: number; // Себестоимость
}

interface OrderIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  source: string; // С какого склада / партии
}

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email?: string;
  phone?: string;
  amount: number;
  items: number;
  status: OrderStatus;
  channel: OrderChannel;
  date: string;
  dishes: OrderDish[];
  ingredients?: OrderIngredient[]; // Для завершённых заказов
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");

  // Mock данные
  const orders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD-2451",
      customer: "Иван Петров",
      email: "ivan@example.com",
      phone: "+48 123 456 789",
      amount: 125.50,
      items: 3,
      status: "completed",
      channel: "online",
      date: "2026-01-26",
      dishes: [
        { id: "1", name: "Ролл Филадельфия", quantity: 2, price: 45.00, costPrice: 28.50 },
        { id: "2", name: "Ролл Калифорния", quantity: 1, price: 35.50, costPrice: 22.00 },
      ],
      ingredients: [
        { id: "1", name: "Лосось", quantity: 200, unit: "г", source: "Партия #123" },
        { id: "2", name: "Рис", quantity: 300, unit: "г", source: "Партия #456" },
        { id: "3", name: "Нори", quantity: 2, unit: "лист", source: "Партия #789" },
      ],
    },
    {
      id: "2",
      orderNumber: "ORD-2450",
      customer: "Мария Сидорова",
      email: "maria@example.com",
      phone: "+48 987 654 321",
      amount: 89.00,
      items: 2,
      status: "cooking",
      channel: "pos",
      date: "2026-01-26",
      dishes: [
        { id: "3", name: "Сет 'Семейный'", quantity: 1, price: 89.00, costPrice: 55.00 },
      ],
    },
    {
      id: "3",
      orderNumber: "ORD-2449",
      customer: "Алексей Иванов",
      email: "alexey@example.com",
      amount: 156.75,
      items: 4,
      status: "processing",
      channel: "delivery",
      date: "2026-01-26",
      dishes: [
        { id: "4", name: "Ролл Филадельфия", quantity: 2, price: 45.00 },
        { id: "5", name: "Суши сет", quantity: 1, price: 66.75 },
      ],
    },
    {
      id: "4",
      orderNumber: "ORD-2448",
      customer: "Анна Коваль",
      email: "anna@example.com",
      amount: 45.00,
      items: 1,
      status: "new",
      channel: "online",
      date: "2026-01-26",
      dishes: [
        { id: "6", name: "Ролл Филадельфия", quantity: 1, price: 45.00 },
      ],
    },
    {
      id: "5",
      orderNumber: "ORD-2447",
      customer: "Петр Бондар",
      email: "petro@example.com",
      amount: 78.50,
      items: 2,
      status: "cancelled",
      channel: "marketplace",
      date: "2026-01-25",
      dishes: [
        { id: "7", name: "Ролл Калифорния", quantity: 2, price: 39.25 },
      ],
    },
  ];

  // Фильтрация
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesChannel = channelFilter === "all" || order.channel === channelFilter;

    return matchesSearch && matchesStatus && matchesChannel;
  });

  // KPI расчёты
  const today = new Date().toISOString().split("T")[0];
  const ordersToday = orders.filter((o) => o.date === today && o.status !== "cancelled");
  const revenueToday = ordersToday
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.amount, 0);
  const averageCheck =
    ordersToday.length > 0
      ? ordersToday.reduce((sum, o) => sum + o.amount, 0) / ordersToday.length
      : 0;
  const cancellationsToday = orders.filter(
    (o) => o.date === today && o.status === "cancelled"
  ).length;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
            <Clock className="w-3 h-3 mr-1" />
            Новый
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            В обработке
          </Badge>
        );
      case "cooking":
        return (
          <Badge className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
            <ChefHat className="w-3 h-3 mr-1" />
            Готовится
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Завершён
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
            <XCircle className="w-3 h-3 mr-1" />
            Отменён
          </Badge>
        );
    }
  };

  const getChannelLabel = (channel: OrderChannel) => {
    switch (channel) {
      case "online":
        return "Онлайн";
      case "pos":
        return "Касса";
      case "delivery":
        return "Доставка";
      case "marketplace":
        return "Маркетплейс";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} PLN`;
  };

  const calculateOrderMargin = (order: Order) => {
    if (order.status !== "completed" || !order.dishes.some((d) => d.costPrice)) {
      return null;
    }
    const totalCost = order.dishes.reduce(
      (sum, d) => sum + (d.costPrice || 0) * d.quantity,
      0
    );
    const margin = order.amount - totalCost;
    const marginPercent = (margin / order.amount) * 100;
    return { margin, marginPercent };
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <ShoppingCart className="h-7 w-7 text-purple-600 dark:text-purple-400" />
            Заказы
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Что продано, кому, за сколько — и какие ингредиенты ушли со склада
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Новый заказ
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Заказов за сегодня
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersToday.length}</div>
            <p className="text-xs text-muted-foreground mt-1">шт</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Выручка
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueToday)}</div>
            <p className="text-xs text-muted-foreground mt-1">завершённые заказы</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Средний чек
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageCheck)}</div>
            <p className="text-xs text-muted-foreground mt-1">сегодня</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Отмены / потери
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {cancellationsToday}
            </div>
            <p className="text-xs text-muted-foreground mt-1">за сегодня</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="flex-shrink-0">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-slate-400 size-5" />
              <Input
                placeholder="Поиск по номеру заказа, имени клиента, email или телефону..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="new">Новый</SelectItem>
                  <SelectItem value="processing">В обработке</SelectItem>
                  <SelectItem value="cooking">Готовится</SelectItem>
                  <SelectItem value="completed">Завершён</SelectItem>
                  <SelectItem value="cancelled">Отменён</SelectItem>
                </SelectContent>
              </Select>

              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Канал" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все каналы</SelectItem>
                  <SelectItem value="online">Онлайн</SelectItem>
                  <SelectItem value="pos">Касса</SelectItem>
                  <SelectItem value="delivery">Доставка</SelectItem>
                  <SelectItem value="marketplace">Маркетплейс</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Здесь появятся заказы клиентов</h3>
              <p className="text-muted-foreground mb-4">
                Каждый заказ автоматически:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 mb-6 text-left max-w-md mx-auto">
                <li>• уменьшает склад</li>
                <li>• считает себестоимость</li>
                <li>• влияет на прибыль</li>
              </ul>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Создать тестовый заказ
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order, idx) => {
            const margin = calculateOrderMargin(order);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={order.id} className="border-0">
                      <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div className="flex items-center gap-4 text-left flex-1 w-full">
                          {/* Left: Order Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-bold text-slate-900 dark:text-white">
                                {order.orderNumber}
                              </p>
                              {getStatusBadge(order.status)}
                              <Badge variant="outline" className="text-xs">
                                {getChannelLabel(order.channel)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {order.customer}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(order.date)}
                              </div>
                            </div>
                          </div>

                          {/* Right: Summary */}
                          <div className="hidden sm:flex items-center gap-4 text-sm">
                            <div className="text-right">
                              <p className="font-semibold text-green-600 dark:text-green-400">
                                {formatCurrency(order.amount)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.items} {order.items === 1 ? "товар" : "товаров"}
                              </p>
                            </div>
                            {margin && (
                              <div className="text-right border-l pl-4">
                                <p className="text-xs text-muted-foreground">Маржа</p>
                                <p className="font-semibold text-blue-600 dark:text-blue-400">
                                  {formatCurrency(margin.margin)} ({margin.marginPercent.toFixed(1)}%)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-6 py-4 space-y-4 border-t">
                        {/* Блюда в заказе */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <ChefHat className="w-4 h-4" />
                            Блюда в заказе
                          </h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Название</TableHead>
                                <TableHead className="text-center">Количество</TableHead>
                                <TableHead className="text-right">Цена</TableHead>
                                {order.status === "completed" && (
                                  <TableHead className="text-right">Себестоимость</TableHead>
                                )}
                                <TableHead className="text-right">Сумма</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.dishes.map((dish) => (
                                <TableRow key={dish.id}>
                                  <TableCell className="font-medium">{dish.name}</TableCell>
                                  <TableCell className="text-center">{dish.quantity}</TableCell>
                                  <TableCell className="text-right">
                                    {formatCurrency(dish.price)}
                                  </TableCell>
                                  {order.status === "completed" && (
                                    <TableCell className="text-right text-muted-foreground">
                                      {dish.costPrice ? formatCurrency(dish.costPrice) : "-"}
                                    </TableCell>
                                  )}
                                  <TableCell className="text-right font-semibold">
                                    {formatCurrency(dish.price * dish.quantity)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Ингредиенты (только для завершённых заказов) */}
                        {order.status === "completed" && order.ingredients && (
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Ингредиенты (списаны со склада)
                            </h4>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Продукт</TableHead>
                                    <TableHead className="text-right">Количество</TableHead>
                                    <TableHead>Источник</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.ingredients.map((ing) => (
                                    <TableRow key={ing.id}>
                                      <TableCell className="font-medium">{ing.name}</TableCell>
                                      <TableCell className="text-right">
                                        {ing.quantity} {ing.unit}
                                      </TableCell>
                                      <TableCell className="text-muted-foreground">
                                        {ing.source}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}

                        {/* Итоговая информация */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            {order.email && (
                              <p>
                                <strong>Email:</strong> {order.email}
                              </p>
                            )}
                            {order.phone && (
                              <p>
                                <strong>Телефон:</strong> {order.phone}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Итого</p>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(order.amount)}
                            </p>
                            {margin && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Маржа: {formatCurrency(margin.margin)} ({margin.marginPercent.toFixed(1)}%)
                              </p>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Info Block - Связь с другими модулями */}
      <div className="flex-shrink-0 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
              Связь с другими модулями
            </p>
            <p className="text-xs text-purple-800 dark:text-purple-200">
              <strong>Заказ</strong> → <strong>Блюдо</strong> → <strong>Рецепт</strong> → <strong>Склад</strong>. 
              При завершении заказа списываются ингредиенты со склада, считается себестоимость и маржа для 
              <strong> Экономики</strong>. <strong>Ассистент</strong> анализирует популярность блюд и предупреждает о нехватке ингредиентов.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
