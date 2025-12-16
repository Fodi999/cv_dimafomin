"use client";

import { motion } from "framer-motion";
import { Trash2, AlertCircle, CheckCircle2, AlertTriangle, Clock, Edit2 } from "lucide-react";
import type { FridgeItem as FridgeItemType } from "@/lib/types";
import PriceTrend from "./PriceTrend";
import { useState, useEffect } from "react";

interface FridgeItemProps {
  item: FridgeItemType;
  onDelete: (id: string) => void;
  onPriceClick?: (item: FridgeItemType) => void;
  onQuantityClick?: (item: FridgeItemType) => void;
  index: number;
}

export default function FridgeItem({ item, onDelete, onPriceClick, onQuantityClick, index }: FridgeItemProps) {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

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
          emoji: "🟢",
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800/30",
          label: "Świeże",
          description: daysLeft > 7 ? `Jeszcze ${daysLeft} dni` : `${daysLeft} ${daysLeft === 1 ? 'dzień' : 'dni'} do końca`,
        };
      case "warning":
        return {
          icon: <Clock className="w-5 h-5" />,
          emoji: "🟡",
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-50 dark:bg-orange-900/20",
          borderColor: "border-orange-200 dark:border-orange-800/30",
          label: "Zużyj wkrótce",
          description: `Zostało ${daysLeft} ${daysLeft === 1 ? 'dzień' : 'dni'}`,
        };
      case "critical":
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          emoji: "🟠",
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800/30",
          label: "Zużyj dziś!",
          description: daysLeft === 0 ? "Ostatni dzień" : `${daysLeft} ${daysLeft === 1 ? 'dzień' : 'dni'}`,
        };
      case "expired":
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          emoji: "🔴",
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-800/30",
          label: "Przeterminowane",
          description: "Nie używaj",
        };
      default:
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          emoji: "⚪",
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
      whileHover={{ scale: 1.01 }}
      className={`relative p-5 rounded-xl border-2 ${statusConfig.borderColor} ${statusConfig.bgColor} dark:bg-slate-800/50 transition-all shadow-sm hover:shadow-md`}
    >
      {/* Header с названием и кнопкой удаления */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-3xl mt-0.5">{statusConfig.emoji}</div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
              {item.ingredient.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {item.ingredient.category}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(item.id)}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-500 dark:text-red-400 ml-2"
          title="Usuń produkt"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Grid с информацией */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Количество */}
        <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-slate-900/30 rounded-lg">
          <span className="text-xs text-gray-500 dark:text-gray-400">Ilość</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-gray-900 dark:text-white">
              {item.quantity} {item.unit}
            </span>
            <button
              onClick={() => onQuantityClick?.(item)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-gray-400 hover:text-blue-600"
              title="Zmień ilość"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Цена или кнопка добавления */}
        {item.totalPrice !== undefined && item.totalPrice !== null && item.pricePerUnit !== undefined ? (
          <div className="p-2 bg-white/50 dark:bg-slate-900/30 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Cena/{item.unit === 'g' ? 'kg' : item.unit === 'ml' ? 'l' : 'szt'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  {(item.pricePerUnit * (item.unit === 'g' || item.unit === 'ml' ? 1000 : 1)).toFixed(2)} {item.currency || 'PLN'}
                </span>
                <button
                  onClick={() => onPriceClick?.(item)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-gray-400 hover:text-blue-600"
                  title="Zmień cenę"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            {/* Индикатор тренда цены */}
            {token && (
              <div className="flex justify-end">
                <PriceTrend 
                  itemId={item.id} 
                  currentPrice={item.pricePerUnit} 
                  unit={item.unit}
                  token={token}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="col-span-1">
            <button
              onClick={() => onPriceClick?.(item)}
              className="w-full px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              Dodaj cenę
            </button>
          </div>
        )}
      </div>

      {/* Общая стоимость - если есть цена */}
      {item.totalPrice !== undefined && item.totalPrice !== null && (
        <div className="mb-3 p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-green-700 dark:text-green-400">Koszt całości</span>
            <span className="text-base font-bold text-green-600 dark:text-green-400">
              💰 {item.totalPrice.toFixed(2)} {item.currency || 'PLN'}
            </span>
          </div>
        </div>
      )}

      {/* Даты */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-xs">
          <span className="text-gray-500 dark:text-gray-400 block mb-0.5">Data ważności</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatExpirationDate(item.expiresAt)}
          </span>
        </div>
        {item.arrivedAt && (
          <div className="text-xs text-right">
            <span className="text-gray-500 dark:text-gray-400 block mb-0.5">Dodano</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatExpirationDate(item.arrivedAt)}
            </span>
          </div>
        )}
      </div>

      {/* Статус */}
      <div className={`flex items-center justify-between p-2.5 rounded-lg ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
        <p className={`font-semibold text-sm ${statusConfig.color}`}>
          {statusConfig.label}
        </p>
        {statusConfig.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {statusConfig.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
