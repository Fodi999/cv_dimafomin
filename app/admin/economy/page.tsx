"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle,
  BarChart3,
  PieChart,
  LineChart,
  Filter,
  Info,
  Link as LinkIcon
} from "lucide-react";
import { useFridgeLosses } from "@/hooks/useFridgeLosses";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Economy Page - Финансовая аналитика
 * 
 * Вопрос, на который отвечает: "Зарабатываю ли я деньги, где теряю, и что с этим делать?"
 * 
 * Инструмент для владельца бизнеса, не отчёт для бухгалтера.
 * Данные формируются автоматически на основе:
 * - Склад (цены, остатки)
 * - Списания (потери)
 * - Блюда (цены продажи) - в разработке
 * - Заказы (выручка) - в разработке
 */
export default function EconomyPage() {
  const { t, language } = useLanguage();
  const [period, setPeriod] = useState(30); // Дни для фильтра
  const { losses, summary: lossesSummary, loading: lossesLoading } = useFridgeLosses(period);

  // Mock данные (пока нет backend)
  const revenue = 0; // Выручка за период
  const costOfGoods = 0; // Себестоимость
  const grossProfit = revenue - costOfGoods; // Валовая прибыль
  const totalLosses = lossesSummary.totalLoss; // Потери из списаний
  const margin = revenue > 0 ? ((grossProfit - totalLosses) / revenue) * 100 : 0;

  // Форматирование чисел
  const formatCurrency = (value: number) => {
    if (value === 0) return "—";
    return `${value.toFixed(2)} PLN`;
  };

  const formatPercent = (value: number) => {
    if (value === 0) return "—%";
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
            <Wallet className="h-6 w-6 text-green-600" />
            Экономика кухни
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Зарабатываю ли я деньги, где теряю, и что с этим делать?
          </p>
        </div>

        {/* Period Filter */}
        <Select value={String(period)} onValueChange={(v) => setPeriod(Number(v))}>
          <SelectTrigger className="w-[140px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 дней</SelectItem>
            <SelectItem value="30">30 дней</SelectItem>
            <SelectItem value="90">90 дней</SelectItem>
            <SelectItem value="365">365 дней</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Выручка */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Выручка за период
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(revenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              источник: заказы / блюда
            </p>
          </CardContent>
        </Card>

        {/* Валовая прибыль */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Валовая прибыль
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(grossProfit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Выручка − Себестоимость
            </p>
          </CardContent>
        </Card>

        {/* Потери */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Потери
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(totalLosses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              из страницы «Списания»
            </p>
          </CardContent>
        </Card>

        {/* Маржа */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Маржа
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercent(margin)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              (Прибыль − Потери) / Выручка
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="pnl" className="h-full flex flex-col">
          <TabsList className="flex-shrink-0">
            <TabsTrigger value="pnl">P&L</TabsTrigger>
            <TabsTrigger value="losses">Потери</TabsTrigger>
            <TabsTrigger value="margins">Маржинальность</TabsTrigger>
            <TabsTrigger value="dynamics">Динамика</TabsTrigger>
          </TabsList>

          {/* P&L Tab */}
          <TabsContent value="pnl" className="flex-1 overflow-y-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-green-600" />
                  Прибыль и убытки (P&L)
                </CardTitle>
                <CardDescription>
                  Формируется автоматически на основе заказов, склада и списаний
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <span className="font-medium">Выручка</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(revenue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <span className="font-medium">Себестоимость</span>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(costOfGoods)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <span className="font-medium">Потери</span>
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(totalLosses)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-500 dark:border-green-600">
                    <span className="font-bold text-lg">Итоговая прибыль</span>
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(grossProfit - totalLosses)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Потери Tab */}
          <TabsContent value="losses" className="flex-1 overflow-y-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  Потери и утечки
                </CardTitle>
                <CardDescription>
                  Потери рассчитываются автоматически на основе холодильника и списаний
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lossesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm text-muted-foreground mb-1">Потери за период</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {formatCurrency(totalLosses)}
                        </p>
                      </div>
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm text-muted-foreground mb-1">% от выручки</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {revenue > 0 ? formatPercent((totalLosses / revenue) * 100) : "—%"}
                        </p>
                      </div>
                    </div>

                    {/* Top 3 категории потерь */}
                    <div>
                      <h3 className="font-semibold mb-3">Топ-3 категории потерь</h3>
                      {losses.length > 0 ? (
                        <div className="space-y-2">
                          {losses.slice(0, 3).map((loss, idx) => (
                            <div
                              key={loss.id}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-500">#{idx + 1}</span>
                                <span className="font-medium">{loss.name}</span>
                              </div>
                              <span className="font-bold text-red-600 dark:text-red-400">
                                {loss.loss.toFixed(2)} PLN
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Нет данных о потерях за выбранный период
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Маржинальность Tab */}
          <TabsContent value="margins" className="flex-1 overflow-y-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Маржинальность блюд
                </CardTitle>
                <CardDescription>
                  Будет доступно после настройки блюд и продаж
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Маржинальность блюд</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Здесь будет таблица с маржинальностью каждого блюда:
                  </p>
                  <div className="max-w-2xl mx-auto">
                    <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 space-y-2 text-left">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Блюдо</span>
                        <span className="text-muted-foreground">Цена продажи</span>
                        <span className="text-muted-foreground">Себестоимость</span>
                        <span className="text-muted-foreground">Маржа</span>
                      </div>
                      <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                      <div className="flex items-center justify-between text-sm py-2">
                        <span className="text-muted-foreground italic">Данные появятся автоматически</span>
                        <span className="text-muted-foreground italic">—</span>
                        <span className="text-muted-foreground italic">—</span>
                        <span className="text-muted-foreground italic">—</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Динамика Tab */}
          <TabsContent value="dynamics" className="flex-1 overflow-y-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-purple-600" />
                  Динамика
                </CardTitle>
                <CardDescription>
                  Период синхронизирован с фильтром сверху ({period} дней)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <LineChart className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Графики динамики</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Здесь будут графики:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-6">
                      <LineChart className="w-12 h-12 text-purple-400 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">Прибыль по дням</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-6">
                      <TrendingDown className="w-12 h-12 text-red-400 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">Потери по дням</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-6">
                      <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-2 opacity-50" />
                      <p className="text-sm font-medium">Маржа по неделям</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Data Sources Info */}
      <div className="flex-shrink-0 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Источники данных
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-200">
              Экономика агрегирует данные из: <strong>Склад</strong> (цены, остатки), <strong>Списания</strong> (потери), 
              <strong> Блюда</strong> (цены продажи — в разработке), <strong>Заказы</strong> (выручка — в разработке). 
              Данные формируются автоматически, ручной ввод не требуется.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
