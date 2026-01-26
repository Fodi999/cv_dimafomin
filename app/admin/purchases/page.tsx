/**
 * Purchases Page - Закупки
 * Route: /admin/purchases
 * Purpose: Операционный контроль закупок — точка входа денег в систему
 * Features: История закупок, поставщики, влияние на себестоимость и маржу
 */

"use client";

import { useState } from "react";
import {
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  Plus,
  Eye,
  RotateCcw,
  Trash2,
  Calendar,
  Building2,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Clock,
  PackageCheck,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Типы данных
type PurchaseStatus = "planned" | "purchased" | "received";

interface Purchase {
  id: string;
  date: string;
  supplier: string;
  itemsCount: number;
  totalAmount: number;
  status: PurchaseStatus;
}

interface Supplier {
  id: string;
  name: string;
  contact: string;
  purchasesCount: number;
  averagePrice: number;
  lastPurchase: string;
}

export default function PurchasesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

  // Mock данные
  const purchases: Purchase[] = [
    {
      id: "1",
      date: "2026-01-25",
      supplier: "Рыбный рынок 'Океан'",
      itemsCount: 5,
      totalAmount: 1250.50,
      status: "received",
    },
    {
      id: "2",
      date: "2026-01-24",
      supplier: "Овощная база 'Свежесть'",
      itemsCount: 8,
      totalAmount: 320.00,
      status: "purchased",
    },
    {
      id: "3",
      date: "2026-01-23",
      supplier: "Мясной цех 'Премиум'",
      itemsCount: 3,
      totalAmount: 890.00,
      status: "planned",
    },
  ];

  const suppliers: Supplier[] = [
    {
      id: "1",
      name: "Рыбный рынок 'Океан'",
      contact: "+48 123 456 789",
      purchasesCount: 12,
      averagePrice: 1150.00,
      lastPurchase: "2026-01-25",
    },
    {
      id: "2",
      name: "Овощная база 'Свежесть'",
      contact: "info@svezh.ru",
      purchasesCount: 8,
      averagePrice: 280.00,
      lastPurchase: "2026-01-24",
    },
    {
      id: "3",
      name: "Мясной цех 'Премиум'",
      contact: "+48 987 654 321",
      purchasesCount: 5,
      averagePrice: 850.00,
      lastPurchase: "2026-01-23",
    },
  ];

  // KPI расчёты
  const purchasesThisMonth = purchases.length;
  const totalPurchasesAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const activeSuppliers = suppliers.length;
  const averageMargin = 32.5; // Mock

  const getStatusBadge = (status: PurchaseStatus) => {
    switch (status) {
      case "planned":
        return (
          <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
            <Clock className="w-3 h-3 mr-1" />
            Запланирована
          </Badge>
        );
      case "purchased":
        return (
          <Badge className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400">
            <ShoppingCart className="w-3 h-3 mr-1" />
            Куплено
          </Badge>
        );
      case "received":
        return (
          <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
            <PackageCheck className="w-3 h-3 mr-1" />
            Оприходовано
          </Badge>
        );
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

  const handleCreatePurchase = () => {
    setIsCreateDialogOpen(true);
    setWizardStep(1);
  };

  const handleWizardNext = () => {
    if (wizardStep < 3) {
      setWizardStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handleWizardBack = () => {
    if (wizardStep > 1) {
      setWizardStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handleWizardFinish = () => {
    // TODO: Сохранение закупки
    setIsCreateDialogOpen(false);
    setWizardStep(1);
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <ShoppingCart className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            Закупки
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Что, у кого, когда и по какой цене вы покупаете — и как это влияет на себестоимость и маржу
          </p>
        </div>
        <Button onClick={handleCreatePurchase} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Создать закупку
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Закупок за месяц
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchasesThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">шт</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Сумма закупок
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPurchasesAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">PLN</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Активных поставщиков
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSuppliers}</div>
            <p className="text-xs text-muted-foreground mt-1">шт</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Средняя маржа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMargin}%</div>
            <p className="text-xs text-muted-foreground mt-1">после закупок</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="purchases" className="h-full flex flex-col">
          <TabsList className="flex-shrink-0">
            <TabsTrigger value="purchases">Активные закупки</TabsTrigger>
            <TabsTrigger value="suppliers">Поставщики</TabsTrigger>
          </TabsList>

          {/* Tab: Активные закупки */}
          <TabsContent value="purchases" className="flex-1 overflow-y-auto mt-4">
            {purchases.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Здесь будут ваши закупки</h3>
                  <p className="text-muted-foreground mb-6">
                    Создавайте закупки, чтобы:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 mb-6 text-left max-w-md mx-auto">
                    <li>• контролировать расходы</li>
                    <li>• понимать себестоимость блюд</li>
                    <li>• автоматически пополнять склад</li>
                  </ul>
                  <Button onClick={handleCreatePurchase} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Создать первую закупку
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Закупки</CardTitle>
                  <CardDescription>
                    История закупок с датами, поставщиками и статусами
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Дата</TableHead>
                        <TableHead>Поставщик</TableHead>
                        <TableHead>Кол-во позиций</TableHead>
                        <TableHead>Общая сумма</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              {formatDate(purchase.date)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                              {purchase.supplier}
                            </div>
                          </TableCell>
                          <TableCell>{purchase.itemsCount}</TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(purchase.totalAmount)}
                          </TableCell>
                          <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" title="Открыть">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Повторить">
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Удалить" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Поставщики */}
          <TabsContent value="suppliers" className="flex-1 overflow-y-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Поставщики</CardTitle>
                <CardDescription>
                  Справочник поставщиков для анализа цен и прогноза закупок
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Контакт</TableHead>
                      <TableHead>Кол-во закупок</TableHead>
                      <TableHead>Средняя цена</TableHead>
                      <TableHead>Последняя закупка</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            {supplier.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {supplier.contact.includes("@") ? (
                              <Mail className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Phone className="w-4 h-4 text-muted-foreground" />
                            )}
                            {supplier.contact}
                          </div>
                        </TableCell>
                        <TableCell>{supplier.purchasesCount}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(supplier.averagePrice)}
                        </TableCell>
                        <TableCell>{formatDate(supplier.lastPurchase)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Info Block - Связь с другими страницами */}
      <div className="flex-shrink-0 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Связь с другими страницами
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Закупка</strong> → <strong>Оприходование</strong> → продукты в <strong>Складе</strong> → 
              себестоимость в <strong>Рецептах</strong> → маржа в <strong>Экономике</strong>. 
              Ассистент рекомендует создавать закупки при нехватке ингредиентов.
            </p>
          </div>
        </div>
      </div>

      {/* Dialog: Создание закупки (Wizard) */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Создать закупку</DialogTitle>
            <DialogDescription>
              {wizardStep === 1 && "Шаг 1: Выберите поставщика"}
              {wizardStep === 2 && "Шаг 2: Добавьте продукты"}
              {wizardStep === 3 && "Шаг 3: Подтвердите закупку"}
            </DialogDescription>
          </DialogHeader>

          {/* Wizard Step 1: Поставщик */}
          {wizardStep === 1 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Поставщик</Label>
                <select
                  id="supplier"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Выберите поставщика</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить нового поставщика
                </Button>
              </div>
            </div>
          )}

          {/* Wizard Step 2: Продукты */}
          {wizardStep === 2 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Поиск по каталогу продуктов</Label>
                <Input placeholder="Начните вводить название продукта..." />
              </div>
              <div className="space-y-2">
                <Label>Добавленные продукты</Label>
                <div className="border rounded-lg p-4 min-h-[200px] flex items-center justify-center text-muted-foreground">
                  <p className="text-sm">Продукты будут добавлены здесь</p>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Step 3: Итог */}
          {wizardStep === 3 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Итоговая сумма</Label>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  0.00 PLN
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  После подтверждения закупка будет создана. Оприходование можно будет выполнить позже.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                onClick={handleWizardBack}
                disabled={wizardStep === 1}
              >
                Назад
              </Button>
              <div className="flex gap-2">
                {wizardStep < 3 ? (
                  <Button onClick={handleWizardNext}>
                    Далее
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleWizardFinish}>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Создать закупку
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
