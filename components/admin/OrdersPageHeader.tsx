"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, Download, Plus } from "lucide-react";
import { AdminSearch } from "./AdminSearch";

interface OrdersPageHeaderProps {
  onSearch?: (query: string) => void;
  totalOrders?: number;
  onFilterChange?: (filters: any) => void;
}

export function OrdersPageHeader({ 
  onSearch, 
  totalOrders = 0,
  onFilterChange 
}: OrdersPageHeaderProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const statusOptions = [
    { value: "all", label: "Всі замовлення", color: "gray" },
    { value: "pending", label: "В ожиданні", color: "yellow" },
    { value: "processing", label: "В обробці", color: "blue" },
    { value: "completed", label: "Завершено", color: "green" },
    { value: "cancelled", label: "Скасовано", color: "red" },
  ];

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    onFilterChange?.({ status: status === "all" ? "" : status });
  };

  const handleExport = () => {
    console.log("Експорт замовлень...");
    // TODO: реализовать экспорт в CSV/Excel
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Title and Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Замовлення
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Всього замовлень: <span className="font-semibold text-purple-600">{totalOrders}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Експорт
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Нове замовлення
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <AdminSearch 
        placeholder="Шукати за номером замовлення, клієнтом, email..."
        onSearch={onSearch || (() => {})}
      />

      {/* Status Filters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Статус
          </h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? "Сховати" : "Показати більше"}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {statusOptions.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStatusChange(option.value)}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                selectedStatus === option.value || (selectedStatus === "" && option.value === "all")
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {option.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Advanced Filters - Optional */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Date From */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                От дата
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                До дата
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
              />
            </div>

            {/* Amount Range */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                Сума від
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
              />
            </div>

            {/* Amount To */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                Сума до
              </label>
              <input
                type="number"
                placeholder="9999"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-colors"
            >
              Застосувати фільтри
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium text-sm transition-colors"
            >
              Очистити
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
