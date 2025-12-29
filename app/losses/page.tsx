/**
 * Page: Loss History
 * Route: /losses
 * Purpose: Professional loss tracking without guilt-based UX
 * Philosophy: Frontend shows WHAT happened (facts), AI explains WHY later
 */

"use client";

import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Download, AlertCircle, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFridgeLosses } from "@/hooks/useFridgeLosses";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LossesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { losses, summary, loading, error, refetch } = useFridgeLosses(30);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {t?.losses?.title || "Historia strat"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t?.losses?.subtitle || "Analiza ekonomiki kuchni"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {t?.losses?.actions?.refresh || "Обновить"}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
              <Download className="w-4 h-4" />
              {t?.losses?.actions?.export || "Eksportuj"}
            </button>
          </div>
        </motion.div>

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            {t?.losses?.summary?.title?.replace("{days}", "30") || "За последние 30 дней:"}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Products count */}
            <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Package className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                  {summary.products}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t?.losses?.summary?.products?.replace("{count}", String(summary.products)) || "продуктов"}
                </p>
              </div>
            </div>

            {/* Total loss */}
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <span className="text-3xl">💰</span>
              <div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {summary.totalLoss.toFixed(2)} PLN
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t?.losses?.summary?.totalLoss || "потерь"}
                </p>
              </div>
            </div>

            {/* Average loss */}
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <span className="text-3xl">📊</span>
              <div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                  {summary.avgLoss.toFixed(2)} PLN
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t?.losses?.summary?.avgLoss?.replace("{amount}", summary.avgLoss.toFixed(2)) || "Średnia потрата"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Events List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : losses.length > 0 ? (
          <div className="space-y-4">
            {losses.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {event.name}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <strong>{t?.losses?.event?.reason || "Przyczyna"}:</strong>
                        {getReasonLabel(event.reason)}
                      </span>
                      <span className="flex items-center gap-1">
                        <strong>{t?.losses?.event?.quantity || "Ilość"}:</strong>
                        {event.quantity} {event.unit}
                      </span>
                    </div>
                  </div>
                  
                  {/* Loss amount */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      –{event.loss.toFixed(2)} PLN
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {t?.losses?.event?.loss || "Potrata"}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div>
                    <p className="text-gray-500 dark:text-gray-500 mb-1">
                      {t?.losses?.event?.added || "Dodano"}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(event.addedDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-500 mb-1">
                      {t?.losses?.event?.expired || "Przeterminowane"}
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(event.expiryDate)}
                    </p>
                  </div>
                </div>

                {/* Context (if available) */}
                {event.context && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>{t?.losses?.event?.context || "Kontekst"}:</strong> {event.context}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          // Empty state
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg"
          >
            <div className="flex justify-center mb-4">
              <Package className="w-16 h-16 text-green-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {t?.losses?.empty?.title || "Brak зафиксированных потерь"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t?.losses?.empty?.description?.replace("{days}", "30") || "За последние 30 дней не было утилизаций"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
