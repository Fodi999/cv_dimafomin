/**
 * Admin Assistant Page - Бизнес-решения
 * Route: /admin/assistant
 * Purpose: AI помощник владельца для принятия бизнес-решений
 * Features: Рекомендации, привязка к деньгам, действия
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Package,
  ChefHat,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface BusinessRecommendation {
  id: string;
  type: "loss_prevention" | "revenue_optimization" | "inventory" | "menu";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: {
    value: number;
    currency: string;
    type: "save" | "earn";
  };
  actions: Array<{
    id: string;
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
}

export default function AdminAssistantPage() {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Mock recommendations - в будущем из API
  const recommendations: BusinessRecommendation[] = [
    {
      id: "1",
      type: "loss_prevention",
      priority: "high",
      title: "Продукты скоро просрочатся",
      description: "5 продуктов истекают в течение 3 дней. Риск потерь: 450 PLN",
      impact: {
        value: 450,
        currency: "PLN",
        type: "save",
      },
      actions: [
        { id: "view_inventory", label: "Посмотреть склад", href: "/admin/ingredients" },
        { id: "create_promotion", label: "Создать акцию", href: "/admin/catalog/products" },
      ],
    },
    {
      id: "2",
      type: "revenue_optimization",
      priority: "medium",
      title: "Низкая маржинальность блюда",
      description: "Блюдо 'Ролл Филадельфия' имеет маржу 15%. Рекомендуется пересмотреть рецепт или цену.",
      impact: {
        value: 120,
        currency: "PLN",
        type: "earn",
      },
      actions: [
        { id: "edit_recipe", label: "Редактировать рецепт", href: "/admin/catalog/recipes-list" },
        { id: "adjust_price", label: "Изменить цену", href: "/admin/catalog/products" },
      ],
    },
    {
      id: "3",
      type: "inventory",
      priority: "medium",
      title: "Заканчиваются ингредиенты",
      description: "Лосось (2.5 кг) и рис (5 кг) заканчиваются. Рекомендуется закупка.",
      impact: {
        value: 0,
        currency: "PLN",
        type: "save",
      },
      actions: [
        { id: "create_purchase", label: "Создать закупку", href: "/admin/purchases" },
        { id: "view_inventory", label: "Посмотреть склад", href: "/admin/ingredients" },
      ],
    },
    {
      id: "4",
      type: "menu",
      priority: "low",
      title: "Низкая популярность блюда",
      description: "Блюдо 'Ролл Калифорния' заказывают редко. Рассмотрите замену или акцию.",
      impact: {
        value: 80,
        currency: "PLN",
        type: "earn",
      },
      actions: [
        { id: "remove_dish", label: "Убрать из меню", onClick: () => console.log("Remove dish") },
        { id: "create_promotion", label: "Создать акцию", href: "/admin/catalog/products" },
      ],
    },
  ];

  // Фильтруем: только рекомендации с деньгами и не закрытые
  const filteredRecommendations = recommendations
    .filter((r) => !dismissed.has(r.id) && r.impact.value > 0)
    // Сортировка: Высокий → Средний → Низкий
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "loss_prevention":
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case "revenue_optimization":
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "inventory":
        return <Package className="w-5 h-5 text-blue-600" />;
      case "menu":
        return <ChefHat className="w-5 h-5 text-purple-600" />;
      default:
        return <Bot className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "loss_prevention":
        return "Предотвращение потерь";
      case "revenue_optimization":
        return "Оптимизация выручки";
      case "inventory":
        return "Склад";
      case "menu":
        return "Меню";
      default:
        return "Рекомендация";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400";
      case "medium":
        return "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400";
      case "low":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
    }
  };

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const totalImpact = filteredRecommendations.reduce((sum, r) => {
    return sum + (r.impact.type === "save" ? r.impact.value : r.impact.value);
  }, 0);

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
            <Bot className="w-6 h-6" />
            {t?.admin?.assistant?.title || "Бизнес-ассистент"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t?.admin?.assistant?.subtitle || "Рекомендации для оптимизации бизнеса"}
          </p>
        </div>

        {/* Total Impact KPI */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-right cursor-help">
                <p className="text-xs text-muted-foreground">Потенциальный эффект</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {totalImpact.toFixed(0)} PLN
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[250px]">
              <p className="text-xs">
                Это не реальная прибыль, а сумма предотвращённых потерь и потенциального роста дохода от выполнения рекомендаций.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Recommendations List - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredRecommendations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Всё под контролем</h3>
              <p className="text-muted-foreground">
                Сейчас нет критичных рекомендаций. Новые рекомендации появятся здесь автоматически на основе данных склада, списаний, блюд и заказов.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRecommendations.map((rec, idx) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`hover:shadow-lg transition-all ${
                rec.priority === "high" 
                  ? "border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10" 
                  : rec.priority === "medium"
                  ? "border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-950/10"
                  : "border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10"
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Icon */}
                      <div className={`p-2 rounded-lg ${
                        rec.priority === "high" 
                          ? "bg-red-100 dark:bg-red-900/20" 
                          : rec.priority === "medium"
                          ? "bg-orange-100 dark:bg-orange-900/20"
                          : "bg-blue-100 dark:bg-blue-900/20"
                      }`}>
                        {getTypeIcon(rec.type)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        {/* Заголовок и метки */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <Badge className={getPriorityColor(rec.priority)}>
                            Приоритет: {rec.priority === "high" ? "Высокий" : 
                             rec.priority === "medium" ? "Средний" : "Низкий"}
                          </Badge>
                          <Badge variant="outline">{getTypeLabel(rec.type)}</Badge>
                        </div>
                        
                        {/* Описание */}
                        <CardDescription className="text-sm">{rec.description}</CardDescription>
                      </div>
                    </div>
                    
                    {/* Крестик для закрытия */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDismiss(rec.id)}
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
                      title="Игнорировать эту рекомендацию"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    {/* Деньги (обязательно!) */}
                    <div className="flex items-center gap-2">
                      {rec.impact.type === "save" ? (
                        <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      )}
                      <span
                        className={`text-lg font-bold ${
                          rec.impact.type === "save"
                            ? "text-red-600 dark:text-red-400"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {rec.impact.type === "save" ? "🔻 Экономия" : "🔺 Доход"}:{" "}
                        {rec.impact.value} {rec.impact.currency}
                      </span>
                    </div>

                    {/* CTA-кнопки (контекстные действия) */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {rec.actions.map((action) => (
                        <Button
                          key={action.id}
                          variant={action.id === rec.actions[0].id ? "default" : "outline"}
                          size="sm"
                          asChild={!!action.href}
                          onClick={action.onClick}
                        >
                          {action.href ? (
                            <Link href={action.href} className="flex items-center gap-1">
                              {action.label}
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          ) : (
                            <>
                              {action.label}
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </>
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Data Sources Info */}
      <div className="flex-shrink-0 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
              Источники данных
            </p>
            <p className="text-xs text-purple-800 dark:text-purple-200">
              Ассистент анализирует данные из: <strong>Склад</strong> (остатки, сроки, цены), 
              <strong> Списания</strong> (потери), <strong>Блюда</strong> (себестоимость), 
              <strong> Заказы</strong> (популярность), <strong>Экономика</strong> (маржа). 
              Рекомендации формируются автоматически на основе этих данных.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
