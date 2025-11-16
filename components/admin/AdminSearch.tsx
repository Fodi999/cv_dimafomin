"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

interface AdminSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
}

export function AdminSearch({ 
  placeholder = "Пошук користувачів, замовлень, ID...", 
  onSearch,
  onClear 
}: AdminSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery("");
    onClear?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className={`relative flex items-center transition-all ${isFocused ? "ring-2 ring-purple-500" : ""} rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md`}>
        <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-3 flex-shrink-0" />
        
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="border-0 focus-visible:ring-0 focus-visible:outline-none bg-transparent pl-3 pr-10 py-2.5 text-sm placeholder-slate-400 dark:placeholder-slate-500"
        />

        {searchQuery && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </motion.button>
        )}
      </div>

      {/* Search Suggestions (opcional) */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3 z-50"
        >
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Пошук: <span className="font-medium text-slate-700 dark:text-slate-300">"{searchQuery}"</span>
          </p>
          <div className="space-y-2">
            <button className="w-full text-left text-sm px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              👤 Шукати в користувачах
            </button>
            <button className="w-full text-left text-sm px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              🛒 Шукати в замовленнях
            </button>
            <button className="w-full text-left text-sm px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              🪙 Шукати в транзакціях
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
