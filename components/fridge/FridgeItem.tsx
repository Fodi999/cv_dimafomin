"use client";

import { motion } from "framer-motion";
import { Trash2, AlertCircle, CheckCircle2, AlertTriangle, Clock, Edit2, DollarSign, Timer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedIngredientName } from "@/lib/i18n/translateIngredient";
import { formatLocalizedDate } from "@/lib/i18n/formatDate";
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
  const { t, language } = useLanguage();
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

  // ✅ Безопасное форматирование даты с локализацией
  const formatExpirationDate = (expiresAt?: string | null): string => {
    if (!expiresAt) {
      return t?.fridge?.item?.noExpiryDate || "No date";
    }
    
    try {
      const date = new Date(expiresAt);
      if (isNaN(date.getTime())) {
        return t?.fridge?.item?.invalidDate || "Invalid date";
      }
      return formatLocalizedDate(date, language);
    } catch (err) {
      console.error('[FridgeItem] Date parsing error:', err);
      return t?.fridge?.item?.dateError || "Date error";
    }
  };

  const getStatusConfig = (status: string, daysLeft: number | null) => {
    switch (status) {
      case "fresh":
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: "text-emerald-600 dark:text-emerald-400",
          bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
          borderColor: "border-emerald-200 dark:border-emerald-800/30",
          label: t?.fridge?.status?.fresh || "Fresh",
          description: daysLeft === null 
            ? (t?.fridge?.status?.noExpiry || "No expiry date")
            : daysLeft > 30 
              ? (t?.fridge?.status?.stillDaysPlural?.replace('{days}', String(daysLeft)) || `Still ${daysLeft} days`)
              : (t?.fridge?.status?.daysLeftPlural?.replace('{days}', String(daysLeft)) || `${daysLeft} days left`),
        };
      case "ok":
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800/30",
          label: t?.fridge?.status?.fresh || "Fresh",
          description: daysLeft === null
            ? (t?.fridge?.status?.noExpiry || "No expiry date")
            : daysLeft > 7 
              ? (t?.fridge?.status?.stillDaysPlural?.replace('{days}', String(daysLeft)) || `${daysLeft} days left`)
              : (t?.fridge?.status?.daysLeftPlural?.replace('{days}', String(daysLeft)) || `${daysLeft} days`),
        };
      case "warning":
        return {
          icon: <Clock className="w-5 h-5" />,
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-50 dark:bg-orange-900/20",
          borderColor: "border-orange-200 dark:border-orange-800/30",
          label: t?.fridge?.status?.critical || "Use soon",
          description: daysLeft === null
            ? (t?.fridge?.status?.noExpiry || "No expiry date")
            : (t?.fridge?.status?.daysLeftPlural?.replace('{days}', String(daysLeft)) || `${daysLeft} days left`),
        };
      case "critical":
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800/30",
          label: t?.fridge?.status?.useNow || "Use now!",
          description: daysLeft === null
            ? (t?.fridge?.status?.noExpiry || "No expiry date")
            : daysLeft === 0 
              ? (t?.fridge?.status?.lastDay || "Last day") 
              : (t?.fridge?.status?.daysLeftPlural?.replace('{days}', String(daysLeft)) || `${daysLeft} days`),
        };
      case "expired":
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-800/30",
          label: t?.fridge?.status?.expired || "Expired",
          description: t?.fridge?.status?.dontUse || "Don't use",
        };
      default:
        return {
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          borderColor: "border-gray-200 dark:border-gray-800/30",
          label: t?.fridge?.status?.unknown || "Unknown status",
          description: "",
        };
    }
  };

  const statusConfig = getStatusConfig(item.status, item.daysLeft);
  
  // ✅ Получаем локализованное имя напрямую из объекта ингредиента
  const translatedName = getLocalizedIngredientName(item.ingredient as any, language);
  
  // ✅ Переводим категорию
  const translatedCategory = t?.fridge?.categories?.[item.ingredient.category] || item.ingredient.category;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.03 }}
      className={`
        relative p-4 rounded-xl border-l-4 
        ${statusConfig.borderColor}
        bg-white dark:bg-slate-800 
        hover:shadow-md transition-all
        flex items-center gap-4
      `}
    >
      {/* Иконка статуса */}
      <div className={`flex-shrink-0 ${statusConfig.color}`}>
        {statusConfig.icon}
      </div>

      {/* Название и категория */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight truncate">
          {translatedName}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {translatedCategory}
        </p>
      </div>

      {/* Количество */}
      <div className="flex-shrink-0 text-right">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap">
            {item.quantity} {item.unit}
          </span>
          <button
            onClick={() => onQuantityClick?.(item)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-gray-400 hover:text-blue-600"
            title={t?.fridge?.actions?.updateQuantity || "Change quantity"}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Цена (если есть) */}
      {item.totalPrice !== undefined && item.totalPrice !== null && item.pricePerUnit ? (
        <div className="flex-shrink-0 text-right">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
              {item.totalPrice.toFixed(2)} {item.currency === 'PLN' ? 'PLN' : item.currency}
            </span>
            <button
              onClick={() => onPriceClick?.(item)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors text-gray-400 hover:text-blue-600"
              title="Zmień cenę"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {(item.pricePerUnit * (item.unit === 'g' || item.unit === 'ml' ? 1000 : 1)).toFixed(2)}{' '}
            PLN/{item.unit === 'g' ? 'kg' : item.unit === 'ml' ? 'l' : 'pc'}
          </div>
        </div>
      ) : (
        <button
          onClick={() => onPriceClick?.(item)}
          className="flex-shrink-0 px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold rounded-lg transition-all"
        >
          {t?.fridge?.actions?.updatePrice || "Add price"}
        </button>
      )}

      {/* Срок годности */}
      <div className="flex-shrink-0 text-right min-w-[100px]">
        <div className={`text-xs font-medium ${statusConfig.color}`}>
          {statusConfig.label}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {formatExpirationDate(item.expiresAt)}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 flex items-center gap-1">
          <Timer className="w-3.5 h-3.5" />
          {statusConfig.description}
        </div>
      </div>

      {/* Кнопка удаления */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(item.id)}
        className="flex-shrink-0 p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-500 dark:text-red-400"
        title={t?.fridge?.actions?.deleteProduct || "Delete product"}
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
