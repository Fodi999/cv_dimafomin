"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TreasuryData {
  balance: number;
  totalIssued?: number;
  totalCirculating?: number;
  lockedForRewards?: number;
  available?: number;
}

export default function HeroTreasuryWidget() {
  const { t } = useLanguage();
  const [treasury, setTreasury] = useState<TreasuryData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Функция для получения данных казначейства (публичный endpoint)
    const fetchTreasury = async () => {
      try {
        console.log("💰 [HeroTreasury] Fetching public treasury data...");
        const response = await fetch("/api/public/treasury");
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ [HeroTreasury] Treasury data received:", data);
          
          // Проверяем структуру данных и нормализуем её
          if (data.balance !== undefined) {
            // Данные уже в правильном формате
            setTreasury(data);
          } else if (data.data?.balance !== undefined) {
            // Данные вложены в data.data
            setTreasury(data.data);
          } else {
            // Неожиданная структура, используем fallback
            console.warn("⚠️ [HeroTreasury] Unexpected data structure:", data);
            setTreasury({
              balance: 999994000,
              totalIssued: 1000000000,
              totalCirculating: 994000,
            });
          }
          updateTime();
        } else {
          console.error("❌ [HeroTreasury] Failed to fetch:", response.status);
          // Устанавливаем фиктивные данные для демонстрации
          setTreasury({
            balance: 999994000,
            totalIssued: 1000000000,
            totalCirculating: 994000,
          });
          updateTime();
        }
      } catch (error) {
        console.error("❌ [HeroTreasury] Fetch error:", error);
        // Устанавливаем фиктивные данные для демонстрации
        setTreasury({
          balance: 999994000,
          totalIssued: 1000000000,
          totalCirculating: 994000,
        });
        updateTime();
      } finally {
        setIsLoading(false);
      }
    };

    // Обновление времени
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setLastUpdated(`${hours}:${minutes}:${seconds}`);
    };

    // Первая загрузка
    fetchTreasury();

    // Обновление каждые 30 секунд
    const interval = setInterval(() => {
      fetchTreasury();
    }, 30000);

    // Обновление времени каждую секунду
    const timeInterval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []); // Нет зависимостей - работает для всех

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pl-PL").format(num);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-block bg-white/5 backdrop-blur-md border border-sky-400/30 rounded-2xl p-4 sm:p-6 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="animate-spin">
            <Coins className="w-8 h-8 text-sky-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400">{t.academy.treasury.loading}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!treasury) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className="inline-block bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-sky-400/40 rounded-2xl p-4 sm:p-6 shadow-2xl hover:shadow-sky-500/20 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-500/20 rounded-lg">
            <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">{t.academy.treasury.title}</h3>
            <p className="text-xs text-gray-400">{t.academy.treasury.subtitle}</p>
          </div>
        </div>
        
        {/* Last Updated */}
        {lastUpdated && (
          <div className="text-right">
            <p className="text-xs text-gray-500">{t.academy.treasury.updated}</p>
            <p className="text-xs font-mono text-sky-400">{lastUpdated}</p>
          </div>
        )}
      </div>

      {/* Balance */}
      <div className="bg-gradient-to-r from-sky-500/20 to-cyan-500/20 rounded-xl p-4 mb-3">
        <div className="flex items-baseline gap-2">
          <motion.span
            key={treasury.balance}
            initial={{ scale: 1.1, color: "#38bdf8" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.3 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300"
          >
            {formatNumber(treasury.balance)}
          </motion.span>
          <span className="text-base sm:text-lg text-sky-400 font-semibold">ChefTokens</span>
        </div>
      </div>
      
      {/* Description */}
      <div className="text-xs sm:text-sm text-gray-400 leading-relaxed">
        <p>{t.academy.treasury.description}</p>
      </div>
    </motion.div>
  );
}
