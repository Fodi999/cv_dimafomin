"use client";

import { motion } from "framer-motion";
import { Trash2, AlertCircle, CheckCircle2, AlertTriangle, Clock, Edit2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translateIngredient, generateIngredientSlug } from "@/lib/i18n/translateIngredient";
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
  const { t } = useLanguage();
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
      return t?.fridge?.item?.noExpiryDate || "No date";
    }
    
    try {
      const date = new Date(expiresAt);
      if (isNaN(date.getTime())) {
        return t?.fridge?.item?.invalidDate || "Invalid date";
      }
      return date.toLocaleDateString("pl-PL");
    } catch (err) {
      console.error('[FridgeItem] Date parsing error:', err);
      return t?.fridge?.item?.dateError || "Date error";
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
          label: t?.fridge?.status?.fresh || "Fresh",
          description: daysLeft > 7 
            ? (t?.fridge?.status?.stillDaysPlural?.replace('{days}', String(daysLeft)) || `${daysLeft} days left`)
            : (t?.fridge?.status?.daysLeftPlural?.replace('{days}', String(daysLeft)) || `${daysLeft} days`),
        };
      case "warning":
        return {
          icon: <Clock className="w-5 h-5" />,
          emoji: "🟡",
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-50 dark:bg-orange-900/20",
          borderColor: "border-orange-200 dark:border-orange-800/30",
          label: t?.fridge?.status?.critical || "Use soon",
          description: t?.fridge?.status?.daysLeftPlural?.replace('{days}', String(daysLeft)) || `${daysLeft} days left`,
        };
      case "critical":
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          emoji: "🟠",
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800/30",
          label: t?.fridge?.status?.useNow || "Use now!",
          description: daysLeft === 0 
            ? (t?.fridge?.status?.lastDay || "Last day") 
            : (t?.fridge?.status?.daysLeftPlural?.replace('{days}', String(daysLeft)) || `${daysLeft} days`),
        };
      case "expired":
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          emoji: "🔴",
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-800/30",
          label: t?.fridge?.status?.expired || "Expired",
          description: t?.fridge?.status?.dontUse || "Don't use",
        };
      default:
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          emoji: "⚪",
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-800/30",
          label: t?.fridge?.status?.unknown || "Unknown status",
          description: "",
        };
    }
  };

  const statusConfig = getStatusConfig(item.status, item.daysLeft || 0);
  
  // ✅ Переводим название ингредиента
  const ingredientSlug = item.ingredient.i18nKey || generateIngredientSlug(item.ingredient.name);
  const translatedName = translateIngredient(item.ingredient.name, ingredientSlug, t);
  
  // ✅ Переводим категорию
  const translatedCategory = t?.fridge?.categories?.[item.ingredient.category] || item.ingredient.category;

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
              {translatedName}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {translatedCategory}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(item.id)}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-500 dark:text-red-400 ml-2"
          title={t?.fridge?.actions?.deleteProduct || "Delete product"}
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Grid с информацией */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Количество */}
        <div className="flex items-start justify-between p-2 bg-white/50 dark:bg-slate-900/30 rounded-lg overflow-hidden">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{t?.fridge?.item?.quantity || "Quantity"}</span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-gray-900 dark:text-white whitespace-nowrap">
                {item.quantity} {item.unit}
              </span>
              <button
                onClick={() => onQuantityClick?.(item)}
                className="p-0.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-gray-400 hover:text-blue-600"
                title={t?.fridge?.actions?.updateQuantity || "Change quantity"}
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Цена или кнопка добавления */}
        {item.totalPrice !== undefined && item.totalPrice !== null && item.pricePerUnit !== undefined ? (
          <div className="flex items-start justify-between p-2 bg-white/50 dark:bg-slate-900/30 rounded-lg overflow-hidden">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {t?.fridge?.item?.pricePerKg || "Price"}/{item.unit === 'g' ? 'kg' : item.unit === 'ml' ? 'l' : 'szt'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-gray-900 dark:text-white whitespace-nowrap">
                  {(item.pricePerUnit * (item.unit === 'g' || item.unit === 'ml' ? 1000 : 1)).toFixed(2)}{' '}
                  <span className="text-xs font-normal">{item.currency === 'PLN' ? 'pln' : item.currency}</span>
                </span>
                <button
                  onClick={() => onPriceClick?.(item)}
                  className="p-0.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-gray-400 hover:text-blue-600"
                  title="Zmień cenę"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
              {/* Индикатор тренда под ценой */}
              {token && (
                <div className="flex-shrink-0">
                  <PriceTrend 
                    itemId={item.id} 
                    currentPrice={item.pricePerUnit} 
                    unit={item.unit}
                    token={token}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="col-span-1">
            <button
              onClick={() => onPriceClick?.(item)}
              className="w-full px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              {t?.fridge?.actions?.updatePrice || "Add price"}
            </button>
          </div>
        )}
      </div>

      {/* Общая стоимость - если есть цена */}
      {item.totalPrice !== undefined && item.totalPrice !== null && (
        <div className="mb-3 p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800/30 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-green-700 dark:text-green-400 whitespace-nowrap">{t?.fridge?.item?.totalCost || "Total cost"}</span>
            <span className="text-base font-bold text-green-600 dark:text-green-400 whitespace-nowrap">
              💰 {item.totalPrice.toFixed(2)}{' '}
              <span className="text-xs font-normal">{item.currency === 'PLN' ? 'pln' : item.currency}</span>
            </span>
          </div>
        </div>
      )}

      {/* Даты */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-xs overflow-hidden">
          <span className="text-gray-500 dark:text-gray-400 block mb-0.5">{t?.fridge?.item?.expiryDate || "Expiry date"}</span>
          <span className="font-semibold text-gray-900 dark:text-white block truncate">
            {formatExpirationDate(item.expiresAt)}
          </span>
        </div>
        {item.arrivedAt && (
          <div className="text-xs text-right overflow-hidden">
            <span className="text-gray-500 dark:text-gray-400 block mb-0.5">{t?.fridge?.item?.addedDate || "Added"}</span>
            <span className="font-semibold text-gray-900 dark:text-white block truncate">
              {formatExpirationDate(item.arrivedAt)}
            </span>
          </div>
        )}
      </div>

      {/* Статус */}
      <div className={`flex items-center justify-between p-2.5 rounded-lg ${statusConfig.bgColor} border ${statusConfig.borderColor} overflow-hidden`}>
        <p className={`font-semibold text-sm ${statusConfig.color} truncate`}>
          {statusConfig.label}
        </p>
        {statusConfig.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate ml-2">
            {statusConfig.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
