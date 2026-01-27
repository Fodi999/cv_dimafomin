/**
 * Purchases Page - Procurement Management
 * 
 * Manages:
 * - Purchase history
 * - Suppliers
 * - Costs and pricing
 * - Impact on margins
 */

import { Metadata } from "next";
import { ShoppingCart, TrendingUp, Users, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Закупки | Admin",
  description: "Управление закупками и поставщиками",
};

export default function PurchasesPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            Закупки
          </h1>
          <p className="text-muted-foreground mt-2">
            Управление закупками, поставщиками и себестоимостью
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Package className="h-4 w-4" />
            Закупок за месяц
          </div>
          <div className="text-2xl font-bold">-</div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            Сумма закупок
          </div>
          <div className="text-2xl font-bold">-</div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            Активных поставщиков
          </div>
          <div className="text-2xl font-bold">-</div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            Средняя маржа
          </div>
          <div className="text-2xl font-bold">-</div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-8 text-center">
        <ShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Раздел в разработке</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Здесь будет управление закупками: история закупок, поставщики, 
          цены, влияние на маржу и себестоимость блюд.
        </p>
        <div className="mt-6 text-sm text-muted-foreground">
          <p className="font-medium mb-2">Планируемый функционал:</p>
          <ul className="space-y-1">
            <li>✓ История закупок с датами и суммами</li>
            <li>✓ База поставщиков с контактами</li>
            <li>✓ Отслеживание цен и их изменений</li>
            <li>✓ Расчет влияния на себестоимость</li>
            <li>✓ Прогноз закупок на основе расхода</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
