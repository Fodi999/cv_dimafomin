"use client";

import { motion } from "framer-motion";
import { Trash2, AlertCircle, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import type { FridgeItem as FridgeItemType } from "@/lib/types";

interface FridgeItemProps {
  item: FridgeItemType;
  onDelete: (id: string) => void;
  index: number;
}

export default function FridgeItem({ item, onDelete, index }: FridgeItemProps) {
  // ✅ Защита от undefined
  if (!item || !item.ingredient) {
    console.error('[FridgeItem] Invalid item:', item);
    return null;
  }

  // ✅ Безопасное форматирование даты
  const formatExpirationDate = (expiresAt?: string | null): string => {
    if (!expiresAt) {
      return "Brak daty";
    }
    
    try {
      const date = new Date(expiresAt);
      if (isNaN(date.getTime())) {
        return "Nieprawidłowa data";
      }
      return date.toLocaleDateString("pl-PL");
    } catch (err) {
      console.error('[FridgeItem] Date parsing error:', err);
      return "Błąd daty";
    }
  };

  const getStatusConfig = (status: string, daysLeft: number) => {
    switch (status) {
      case "ok":
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800/30",
          label: "Świeże",
          description: daysLeft > 7 ? `Jeszcze ${daysLeft} dni` : `${daysLeft} ${daysLeft === 1 ? 'dzień' : 'dni'} do końca`,
        };
      case "warning":
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-50 dark:bg-orange-900/20",
          borderColor: "border-orange-200 dark:border-orange-800/30",
          label: "Zużyj wkrótce",
          description: `Zostało ${daysLeft} ${daysLeft === 1 ? 'dzień' : 'dni'}`,
        };
      case "critical":
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800/30",
          label: "Zużyj dziś!",
          description: daysLeft === 0 ? "Ostatni dzień" : `${daysLeft} ${daysLeft === 1 ? 'dzień' : 'dni'}`,
        };
      case "expired":
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-800/30",
          label: "Przeterminowane",
          description: "Nie używaj",
        };
      default:
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-800/30",
          label: "Nieznany status",
          description: "",
        };
    }
  };

  const statusConfig = getStatusConfig(item.status, item.daysLeft || 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor} dark:bg-slate-800/50 transition-all`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
            {item.ingredient.name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {item.ingredient.category}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(item.id)}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
          title="Usuń produkt"
        >
          <Trash2 className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="space-y-2">
        {/* Количество */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Ilość:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {item.quantity} {item.unit}
          </span>
        </div>

        {/* Дата истечения */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Data ważności:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {formatExpirationDate(item.expiresAt)}
          </span>
        </div>

        {/* Статус с улучшенной визуализацией */}
        <div className={`flex items-center gap-2 mt-3 p-3 rounded-lg ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
          <div className={statusConfig.color}>
            {statusConfig.icon}
          </div>
          <div className="flex-1">
            <p className={`font-semibold text-sm ${statusConfig.color}`}>
              {statusConfig.label}
            </p>
            {statusConfig.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {statusConfig.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
