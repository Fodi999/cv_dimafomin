/**
 * Economy Page - Financial Analytics
 * 
 * Manages:
 * - Profit tracking
 * - Losses analysis
 * - Gross margin
 * - Financial dynamics
 */

import { Metadata } from "next";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Экономика | Admin",
  description: "Финансовая аналитика и маржинальность",
};

export default function EconomyPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Wallet className="h-8 w-8 text-green-600" />
            Экономика
          </h1>
          <p className="text-muted-foreground mt-2">
            Прибыль, потери, маржинальность и финансовая динамика
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <DollarSign className="h-4 w-4" />
            Выручка за месяц
          </div>
          <div className="text-2xl font-bold text-green-600">-</div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            Валовая прибыль
          </div>
          <div className="text-2xl font-bold text-green-600">-</div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingDown className="h-4 w-4" />
            Потери
          </div>
          <div className="text-2xl font-bold text-red-600">-</div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4" />
            Маржа
          </div>
          <div className="text-2xl font-bold">-%</div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-8 text-center">
        <Wallet className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Раздел в разработке</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Здесь будет полная финансовая аналитика: прибыль, потери, 
          маржинальность по блюдам и категориям, динамика за периоды.
        </p>
        <div className="mt-6 text-sm text-muted-foreground">
          <p className="font-medium mb-2">Планируемый функционал:</p>
          <ul className="space-y-1">
            <li>✓ Прибыль и убытки (P&L)</li>
            <li>✓ Валовая маржа по блюдам</li>
            <li>✓ Анализ потерь и списаний</li>
            <li>✓ Динамика за день/неделю/месяц</li>
            <li>✓ Топ прибыльных и убыточных блюд</li>
            <li>✓ Прогноз на основе трендов</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
