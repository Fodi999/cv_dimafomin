"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coins, TrendingUp, Lock, Wallet, RefreshCw } from "lucide-react";
import { useUser } from "@/contexts/UserContext"; // 🔑 Импортируем useUser

interface TreasuryData {
  balance: number;
  totalIssued: number;
  totalCirculating: number;
  lockedForRewards: number;
  available: number;
}

export default function RealTimeTreasuryBalance() {
  const { token } = useUser(); // 🔑 Получаем токен из контекста
  const [treasuryData, setTreasuryData] = useState<TreasuryData>({
    balance: 0,
    totalIssued: 0,
    totalCirculating: 0,
    lockedForRewards: 0,
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
      
      console.log("🔑 Fetching treasury with token...");
      
      // Cookie автоматически отправляется браузером + добавляем Authorization header
      const res = await fetch("/api/admin/token-bank/treasury", {
        credentials: "include", // Важно! Включает отправку cookies
        headers: {
          "Authorization": `Bearer ${token}`, // 🔑 Добавляем токен в заголовок
        },
      });

      console.log("📊 Treasury response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Treasury error:", errorText);
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      
      setTreasuryData({
        balance: data.balance || 0,
        totalIssued: data.totalIssued || 0,
        totalCirculating: data.totalCirculating || 0,
        lockedForRewards: data.lockedForRewards || 0,
        available: data.available || 0,
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
    // EventSource автоматически отправляет cookies
    let events: EventSource | null = null;
    
    try {
      events = new EventSource("/api/admin/treasury/stream", {
        withCredentials: true, // Важно! Включает отправку cookies
      });

      events.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setTreasuryData({
          balance: data.balance || 0,
          totalIssued: data.totalIssued || 0,
          totalCirculating: data.totalCirculating || 0,
          lockedForRewards: data.lockedForRewards || 0,
          available: data.available || 0,
        });
        setLastUpdate(new Date());
      };

      events.onerror = () => {
        console.log("SSE connection closed, falling back to polling");
        events?.close();
      };
    } catch (err) {
      console.log("SSE not available, using polling");
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
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 shadow-xl border border-violet-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Token Treasury</h2>
            <p className="text-xs text-violet-200">
              Оновлено: {lastUpdate.toLocaleTimeString('uk-UA')}
            </p>
          </div>
        </div>
        
        <button
          onClick={fetchInitial}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          title="Оновити"
        >
          <RefreshCw className="w-5 h-5 text-white" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg text-red-100 text-sm">
          {error}
        </div>
      )}

      {/* Main Balance */}
      <div className="mb-6 text-center">
        <p className="text-sm text-violet-200 mb-2">Загальний баланс казначейства</p>
        <motion.div
          className="text-5xl md:text-6xl font-bold text-white"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatedNumber value={treasuryData.balance} />
          <span className="text-2xl ml-2 text-violet-200">CT</span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Issued */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-violet-200" />
            <p className="text-xs text-violet-200">Випущено</p>
          </div>
          <p className="text-2xl font-bold text-white">
            <AnimatedNumber value={treasuryData.totalIssued} />
          </p>
        </motion.div>

        {/* Circulating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-300" />
            <p className="text-xs text-violet-200">В обігу</p>
          </div>
          <p className="text-2xl font-bold text-white">
            <AnimatedNumber value={treasuryData.totalCirculating} />
          </p>
        </motion.div>

        {/* Locked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-amber-300" />
            <p className="text-xs text-violet-200">Заблоковано</p>
          </div>
          <p className="text-2xl font-bold text-white">
            <AnimatedNumber value={treasuryData.lockedForRewards} />
          </p>
        </motion.div>

        {/* Available */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-blue-300" />
            <p className="text-xs text-violet-200">Доступно</p>
          </div>
          <p className="text-2xl font-bold text-white">
            <AnimatedNumber value={treasuryData.available} />
          </p>
        </motion.div>
      </div>

      {/* Live Indicator */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="relative">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
        </div>
        <span className="text-xs text-violet-200">Live</span>
      </div>
    </div>
  );
}
