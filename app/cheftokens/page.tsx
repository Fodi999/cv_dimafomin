"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Coins,
  TrendingUp,
  Brain,
  ChefHat,
  Camera,
  Award,
  MessageSquare,
  BookOpen,
  Sparkles,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShoppingBag,
  GraduationCap,
  Utensils
} from "lucide-react";

export default function ChefTokensPage() {
  const router = useRouter();
  
  // Mock user state (later replace with real auth)
  const [isLoggedIn] = useState(false); // Change to true to test logged-in state
  const [currentBalance] = useState(120);
  const [todayEarned] = useState(12);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* 🧠 1. HERO / WYJAŚNIENIE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/20 px-4 py-2 rounded-full mb-6">
            <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Twoja waluta świadomej kuchni
            </span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            ChefTokens — Twoja waluta<br />świadomej kuchni
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            ChefTokens pomagają podejmować mądre decyzje: planować, gotować i uczyć się bez chaosu.
          </p>

          {/* 3 Bullets */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-sky-50 dark:bg-sky-900/10 p-6 rounded-xl border border-sky-200 dark:border-sky-800">
              <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🔄 Kontrola decyzji, nie „paywall"
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tokeny uczą planowania, nie blokują dostępu
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🧠 Uczysz się myśleć jak kucharz
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Każda akcja to świadoma decyzja
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                ♻️ Mniej marnowania, więcej kontroli
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Planowanie zamiast chaosu
              </p>
            </div>
          </div>
        </motion.div>

        {/* 💰 2. TWOJE SALDO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          {isLoggedIn ? (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 rounded-2xl text-white shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Twoje ChefTokens</h2>
                  <p className="text-amber-100">Bieżące saldo</p>
                </div>
                <Coins className="w-12 h-12 text-amber-100" />
              </div>

              <div className="text-6xl font-bold mb-6">
                {currentBalance} CT
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-100" />
                  <span className="text-amber-100">+{todayEarned} CT dzisiaj</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-amber-100" />
                  <span className="text-amber-100">Status: aktywny</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Jak zdobyć ChefTokens
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Historia transakcji
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
              <Coins className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Twoje ChefTokens
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Zaloguj się, aby zobaczyć swoje saldo i historię
              </p>
              <button
                onClick={() => router.push("/auth/login")}
                className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white py-3 px-8 rounded-lg font-semibold transition-all inline-flex items-center gap-2"
              >
                Zaloguj się
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>

        {/* 🟢 3. JAK ZDOBYWASZ CHEFTOKENS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            Jak zdobywasz ChefTokens
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            ChefTokens nagradzają działanie, nie klikanie.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recipe completion */}
            <div className="bg-sky-50 dark:bg-sky-900/10 p-6 rounded-xl border border-sky-200 dark:border-sky-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Ugotowanie przepisu
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Każdy przepis, który zrealizujesz i oznaczysz jako „ugotowany"
              </p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">+5 CT</div>
              </div>
            </div>

            {/* AI Dialog */}
            <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Dialog z AI (zadanie)
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Ukończenie jednego zadania w dialogu z AI Mentor
              </p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">+2 CT</div>
              </div>
            </div>

            {/* Academy Module */}
            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl border border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Moduł w Akademii
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Ukończenie pełnego modułu z wszystkimi zadaniami
              </p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">+10 CT</div>
              </div>
            </div>

            {/* Photo Analysis */}
            <div className="bg-pink-50 dark:bg-pink-900/10 p-6 rounded-xl border border-pink-200 dark:border-pink-800 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Analiza dania
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Prześlij zdjęcie i otrzymaj analizę AI
              </p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">+5 CT</div>
              </div>
            </div>

            {/* Path Completion */}
            <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Ukończenie ścieżki
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Finalizacja całej ścieżki rozwoju w Akademii
              </p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">+50 CT</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🔴 4. NA CO WYDAJESZ CHEFTOKENS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            Na co wydajesz ChefTokens
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Każde użycie tokenów to świadoma decyzja, nie przypadkowy klik.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Queries */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Zapytania do AI
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Zadaj pytanie AI o produkt, technikę lub pairing
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-600 dark:text-purple-400 font-bold">1–3 CT</span>
                <span className="text-xs text-gray-500">za pytanie</span>
              </div>
            </div>

            {/* Premium Recipes */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-sky-400 dark:hover:border-sky-600 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Premium przepisy
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dostęp do zaawansowanych przepisów szefów kuchni
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sky-600 dark:text-sky-400 font-bold">5–15 CT</span>
                <span className="text-xs text-gray-500">za przepis</span>
              </div>
            </div>

            {/* Advanced Academy Paths */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Zaawansowane ścieżki Akademii
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Odblokuj zaawansowane kursy po ukończeniu podstaw
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-amber-600 dark:text-amber-400 font-bold">20–50 CT</span>
                <span className="text-xs text-gray-500">za ścieżkę</span>
              </div>
            </div>

            {/* Flavor Pairing */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-pink-400 dark:hover:border-pink-600 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Analizy smaków / pairing
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sprawdź, jakie produkty pasują do siebie
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-pink-600 dark:text-pink-400 font-bold">3–10 CT</span>
                <span className="text-xs text-gray-500">za analizę</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🔁 5. DLACZEGO TO DZIAŁA (FILOZOFIA) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 p-8 rounded-2xl border border-indigo-200 dark:border-indigo-800">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Dlaczego to działa
            </h2>

            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                <strong>ChefTokens nie są karą.</strong><br />
                Są mechanizmem, który:
              </p>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>uczy planowania</strong> — zamiast chaosu i impulsywnych decyzji</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>ogranicza chaos</strong> — każda akcja ma wartość i konsekwencje</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>wzmacnia dobre decyzje kuchenne</strong> — nagradzamy działanie, nie klikanie</span>
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Brak scrollowania bez sensu</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Każda akcja jest świadoma, nie przypadkowa
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Każda akcja ma wartość</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Uczysz się podejmować lepsze decyzje kulinarne
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 🧭 6. CTA (КУДА ДАЛЬШЕ) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Gdzie teraz?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <button
              onClick={() => router.push("/recipes")}
              className="bg-gradient-to-br from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white p-6 rounded-xl transition-all hover:shadow-lg flex flex-col items-center gap-3"
            >
              <ChefHat className="w-8 h-8" />
              <span className="font-semibold">Przejdź do Gotowania</span>
            </button>

            <button
              onClick={() => router.push("/assistant")}
              className="bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-6 rounded-xl transition-all hover:shadow-lg flex flex-col items-center gap-3"
            >
              <MessageSquare className="w-8 h-8" />
              <span className="font-semibold">Porozmawiaj z AI</span>
            </button>

            <button
              onClick={() => router.push("/academy")}
              className="bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-6 rounded-xl transition-all hover:shadow-lg flex flex-col items-center gap-3"
            >
              <GraduationCap className="w-8 h-8" />
              <span className="font-semibold">Rozwijaj się w Akademii</span>
            </button>

            <button
              onClick={() => router.push("/market")}
              className="bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-6 rounded-xl transition-all hover:shadow-lg flex flex-col items-center gap-3"
            >
              <ShoppingBag className="w-8 h-8" />
              <span className="font-semibold">Zobacz Rynek przepisów</span>
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
