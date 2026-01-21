"use client";

import { motion } from "framer-motion";
import { Trash2, AlertCircle, CheckCircle2, AlertTriangle, Clock, Edit2, DollarSign, Timer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedIngredientName } from "@/lib/i18n/translateIngredient";
import { formatLocalizedDate } from "@/lib/i18n/formatDate";
import { formatQuantityRange } from "@/lib/formatters/unitFormatter";
import type { FridgeItem as FridgeItemType } from "@/lib/types";
import PriceTrend from "./PriceTrend";
import { useState, useEffect, useRef } from "react";

interface FridgeItemProps {
  item: FridgeItemType;
  onDelete: (id: string) => void;
  onPriceClick?: (item: FridgeItemType) => void;
  onQuantityClick?: (item: FridgeItemType) => void;
  index: number;
  isHighlighted?: boolean; // 🆕 Highlight this item (from notification)
}

export default function FridgeItem({ item, onDelete, onPriceClick, onQuantityClick, index, isHighlighted }: FridgeItemProps) {
  const { t, language } = useLanguage();
  const [token, setToken] = useState<string>("");
  const itemRef = useRef<HTMLDivElement>(null); // 🆕 Ref for scrolling

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // 🆕 Auto-scroll to highlighted item
  useEffect(() => {
    if (isHighlighted && itemRef.current) {
      setTimeout(() => {
        itemRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 300); // Delay to wait for animation
    }
  }, [isHighlighted]);

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
  
  // ✅ Переводим категорию (используем categoryKey)
  const translatedCategory = t?.fridge?.categories?.[item.ingredient.categoryKey] || item.ingredient.categoryKey;

  // 🔥 Подсветка для продуктов с истекающим сроком
  const isCritical = item.status === 'critical';
  const isWarning = item.status === 'warning';
  
  // Critical (1-2 дня) - красная подсветка
  const criticalClasses = isCritical 
    ? 'ring-2 ring-red-500/60 dark:ring-red-400/60 bg-red-50/30 dark:bg-red-950/20 shadow-red-200/50 dark:shadow-red-900/50' 
    : '';
  
  // Warning (3-5 дней) - оранжевая подсветка
  const warningClasses = isWarning 
    ? 'ring-2 ring-orange-400/60 dark:ring-orange-500/60 bg-orange-50/30 dark:bg-orange-950/20 shadow-orange-200/50 dark:shadow-orange-900/50' 
    : '';

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className={`
        group relative rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        backdrop-blur-xl
        border border-slate-200/60 dark:border-slate-700/50
        shadow-sm hover:shadow-lg
        transition-all
        ${isHighlighted ? 'shadow-blue-500/20 ring-1 ring-blue-400/40' : ''}
        ${criticalClasses}
        ${warningClasses}
      `}
    >
      {/* 🔥 URGENT BADGE для критичных продуктов */}
      {isCritical && (
        <div className="absolute -top-2 -right-2 z-10">
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full shadow-lg flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3" />
            {t?.fridge?.item?.urgent || 'СРОЧНО!'}
          </motion.div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-start justify-between p-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
            {translatedName}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {translatedCategory}
          </p>
        </div>

        <span
          className={`
            ml-2 flex-shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-medium
            ${statusConfig.bgColor} ${statusConfig.color}
          `}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* PROGRESS */}
      {(item.quantityTotal ?? item.quantity) > 0 && (
        <div className="px-4 pb-3">
          <div className="h-[3px] rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${100 -
                  ((item.quantityRemaining ?? item.quantity) /
                    (item.quantityTotal ?? item.quantity)) *
                    100}%`
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`
                h-full rounded-full
                ${item.freshness === 'danger'
                  ? 'bg-red-500'
                  : item.freshness === 'warning'
                  ? 'bg-orange-500'
                  : 'bg-sky-500'}
              `}
            />
          </div>
        </div>
      )}

      {/* BODY */}
      <div className="grid grid-cols-3 gap-3 px-4 pb-3 text-xs">
        {/* Quantity */}
        <div>
          <p className="text-slate-500 dark:text-slate-400 mb-0.5">
            {t?.fridge?.item?.remaining || 'Remaining'}
          </p>
          <p className="font-semibold text-slate-900 dark:text-white">
            {formatQuantityRange(
              item.quantityRemaining ?? item.quantity,
              item.quantityTotal ?? item.quantity,
              item.unit,
              language
            )}
          </p>
        </div>

        {/* Price */}
        <div>
          <p className="text-slate-500 dark:text-slate-400 mb-0.5">
            {t?.fridge?.item?.totalCost || 'Value'}
          </p>
          {item.pricePerUnit !== undefined && item.pricePerUnit !== null && item.pricePerUnit > 0 ? (
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              {(item.currentValue || 0).toFixed(2)} {item.currency || 'PLN'}
            </p>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t?.fridge?.actions?.updatePrice || 'Add price'}
            </p>
          )}
        </div>

        {/* Expiry */}
        <div>
          <p className="text-slate-500 dark:text-slate-400 mb-0.5">
            {t?.fridge?.item?.expiryDate || 'Expiry'}
          </p>
          <p className="font-medium text-slate-700 dark:text-slate-300">
            {item.daysLeft !== null && item.daysLeft <= 7 
              ? `${item.daysLeft}d`
              : formatExpirationDate(item.expiresAt).split(' ').slice(0, 2).join(' ')}
          </p>
        </div>
      </div>

      {/* FOOTER ACTIONS - появляются при hover */}
      <div
        className="
          flex justify-end gap-1 px-3 pb-3
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
        "
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onQuantityClick?.(item)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={t?.fridge?.actions?.updateQuantity || "Change quantity"}
        >
          <Edit2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPriceClick?.(item)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={t?.fridge?.actions?.updatePrice || "Update price"}
        >
          <DollarSign className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(item.id)}
          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          title={t?.fridge?.actions?.deleteProduct || "Delete product"}
        >
          <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
        </motion.button>
      </div>
    </motion.div>
  );
}
