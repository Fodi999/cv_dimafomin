/**
 * Admin Losses Page - Списания
 * Route: /admin/losses
 * Purpose: Professional loss tracking for business
 * Features: Table, filters, total losses in PLN, reasons
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Download, AlertCircle, Package, TrendingDown, Filter } from "lucide-react";
import { useFridgeLosses } from "@/hooks/useFridgeLosses";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminLossesPage() {
  const { t } = useLanguage();
  const [days, setDays] = useState(30);
  const { losses, summary, loading, error, refetch } = useFridgeLosses(days);

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get reason label
  const getReasonLabel = (reason: string) => {
    const key = reason as "expired" | "damaged" | "spoiled" | "mistake";
    return t?.losses?.reasons?.[key] || reason;
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-3 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            {t?.losses?.title || "Списания"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t?.losses?.subtitle || "Анализ потерь и утилизаций"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Filter */}
          <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 дней</SelectItem>
              <SelectItem value="30">30 дней</SelectItem>
              <SelectItem value="90">90 дней</SelectItem>
              <SelectItem value="365">Год</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {t?.losses?.actions?.refresh || "Обновить"}
          </Button>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {t?.losses?.actions?.export || "Экспорт"}
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex-shrink-0 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Products count */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t?.losses?.summary?.products || "Продуктов"}
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {summary.products}
              </p>
            </div>
          </div>
        </div>

        {/* Total loss */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t?.losses?.summary?.totalLoss || "Всего потерь"}
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {summary.totalLoss.toFixed(2)} PLN
              </p>
            </div>
          </div>
        </div>

        {/* Average loss */}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t?.losses?.summary?.avgLoss?.replace("{amount}", summary.avgLoss.toFixed(2)) || "Средняя потеря"}
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {summary.avgLoss.toFixed(2)} PLN
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : losses.length > 0 ? (
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Продукт
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Количество
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Причина
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Добавлено
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Просрочено
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">
                    Потеря (PLN)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {losses.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{event.name}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {event.quantity} {event.unit}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        event.reason === 'expired' 
                          ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800'
                          : 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                      }`}>
                        {event.reason === 'expired' ? '🔴 Просрочено' : getReasonLabel(event.reason)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(event.addedDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(event.expiryDate)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-red-600 dark:text-red-400">
                        {event.loss.toFixed(2)} PLN
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-12 text-center">
            <Package className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {t?.losses?.empty?.title || "Нет зафиксированных потерь"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t?.losses?.empty?.description?.replace("{days}", String(days)) || 
                `За последние ${days} дней не было утилизаций`}
            </p>
            
            {/* ℹ️ Информация о автоматическом формировании данных */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>ℹ️ Автоматическое формирование:</strong> Данные формируются автоматически на основе склада. Продукты с истекшим сроком годности автоматически появляются здесь.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
