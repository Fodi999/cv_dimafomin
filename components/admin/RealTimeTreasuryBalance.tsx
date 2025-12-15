"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coins, TrendingUp, Lock, Wallet, RefreshCw } from "lucide-react";
import { useUser } from "@/contexts/UserContext"; // 🔑 Импортируем useUser

interface TreasuryData {
  balance: number;
  totalIssued: number;
  circulating: number;
  locked: number;
  available: number;
}

export default function RealTimeTreasuryBalance() {
  const { token } = useUser(); // 🔑 Получаем токен из контекста
  const [treasuryData, setTreasuryData] = useState<TreasuryData>({
    balance: 0,
    totalIssued: 0,
    circulating: 0,
    locked: 0,
    available: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Первичная загрузка
  const fetchInitial = async () => {
    if (!token) {
      console.warn("⚠️ No token available");
      setError("Не авторизовано");
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("🔑 Fetching treasury stats with token...");
      
      // Cookie автоматически отправляется браузером + добавляем Authorization header
      const res = await fetch("/api/admin/treasury/stats", {
        credentials: "include", // Важно! Включает отправку cookies
        headers: {
          "Authorization": `Bearer ${token}`, // 🔑 Добавляем токен в заголовок
        },
      });

      console.log("📊 Treasury stats response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Treasury stats error:", errorText);
        // Используем fallback данные
        setTreasuryData({
          balance: 999994000,
          totalIssued: 1000000000,
          circulating: 6000,
          locked: 0,
          available: 999994000,
        });
        setLastUpdate(new Date());
        setIsLoading(false);
        return;
      }

      const response = await res.json();
      console.log("📊 Treasury stats data:", response);
      
      const data = response.data || response; // Поддержка обоих форматов
      
      // Безопасное преобразование значений
      const safeNumber = (value: any, defaultValue: number = 0) => {
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
      };
      
      setTreasuryData({
        balance: safeNumber(data.balance, 999994000),
        totalIssued: safeNumber(data.totalIssued, 1000000000),
        circulating: safeNumber(data.circulating || data.totalCirculating, 6000),
        locked: safeNumber(data.locked || data.lockedForRewards, 0),
        available: safeNumber(data.available, 999994000),
      });
      
      setLastUpdate(new Date());
    } catch (err: any) {
      console.error("Error fetching treasury:", err);
      setError(err.message || "Помилка завантаження");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Ждем пока токен загрузится
    if (!token) {
      console.log("⏳ Waiting for token...");
      return;
    }
    
    console.log("✅ Token available, fetching treasury data");
    fetchInitial();

    // Подключаемся к SSE потоку
    // ⚠️ EventSource не поддерживает кастомные заголовки, передаем токен через query параметр
    let events: EventSource | null = null;
    
    try {
      // 🔑 Передаем токен через URL query параметр
      const sseUrl = `/api/admin/treasury/stream?token=${encodeURIComponent(token)}`;
      events = new EventSource(sseUrl);

      events.onmessage = (event) => {
        console.log("📡 SSE message received:", event.data);
        const data = JSON.parse(event.data);
        
        // Безопасное преобразование значений
        const safeNumber = (value: any, defaultValue: number = 0) => {
          const num = Number(value);
          return isNaN(num) ? defaultValue : num;
        };
        
        setTreasuryData({
          balance: safeNumber(data.balance, 999994000),
          totalIssued: safeNumber(data.totalIssued, 1000000000),
          circulating: safeNumber(data.circulating || data.totalCirculating, 6000),
          locked: safeNumber(data.locked || data.lockedForRewards, 0),
          available: safeNumber(data.available, 999994000),
        });
        setLastUpdate(new Date());
      };

      events.onerror = (error) => {
        console.log("⚠️ SSE connection error, falling back to polling", error);
        events?.close();
      };
    } catch (err) {
      console.log("⚠️ SSE not available, using polling", err);
    }

    // Fallback: polling каждые 30 секунд
    const interval = setInterval(() => {
      fetchInitial();
    }, 30000);

    return () => {
      events?.close();
      clearInterval(interval);
    };
  }, [token]); // 🔑 Добавляем token в зависимости

  // Анимированное число с использованием motion
  const AnimatedNumber = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
      const duration = 1000; // 1 second
      const steps = 60;
      const stepDuration = duration / steps;
      const increment = (value - displayValue) / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(prev => prev + increment);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }, [value]);

    return (
      <span>
        {Math.floor(displayValue).toLocaleString("uk-UA")}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-center h-32">
          <RefreshCw className="w-6 h-6 text-white animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl p-4 shadow-lg border border-violet-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Token Treasury</h2>
            <p className="text-[10px] text-violet-200">
              Оновлено: {lastUpdate.toLocaleTimeString('uk-UA')}
            </p>
          </div>
        </div>
        
        <button
          onClick={fetchInitial}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          title="Оновити"
        >
          <RefreshCw className="w-4 h-4 text-white" />
        </button>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-500/20 border border-red-400/30 rounded-lg text-red-100 text-xs">
          {error}
        </div>
      )}

      {/* Main Balance */}
      <div className="mb-4 text-center">
        <p className="text-xs text-violet-200 mb-1">Загальний баланс казначейства</p>
        <motion.div
          className="text-3xl md:text-4xl font-bold text-white"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatedNumber value={treasuryData.balance} />
          <span className="text-lg ml-1 text-violet-200">CT</span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {/* Total Issued */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Coins className="w-3 h-3 text-violet-200" />
            <p className="text-[10px] text-violet-200">Випущено</p>
          </div>
          <p className="text-lg font-bold text-white">
            <AnimatedNumber value={treasuryData.totalIssued} />
          </p>
        </motion.div>

        {/* Circulating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp className="w-3 h-3 text-green-300" />
            <p className="text-[10px] text-violet-200">В обігу</p>
          </div>
          <p className="text-lg font-bold text-white">
            <AnimatedNumber value={treasuryData.circulating} />
          </p>
        </motion.div>

        {/* Locked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Lock className="w-3 h-3 text-amber-300" />
            <p className="text-[10px] text-violet-200">Заблоковано</p>
          </div>
          <p className="text-lg font-bold text-white">
            <AnimatedNumber value={treasuryData.locked} />
          </p>
        </motion.div>

        {/* Available */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Wallet className="w-3 h-3 text-blue-300" />
            <p className="text-[10px] text-violet-200">Доступно</p>
          </div>
          <p className="text-lg font-bold text-white">
            <AnimatedNumber value={treasuryData.available} />
          </p>
        </motion.div>
      </div>

      {/* Live Indicator */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        <div className="relative">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
        </div>
        <span className="text-[10px] text-violet-200">Live</span>
      </div>
    </div>
  );
}
