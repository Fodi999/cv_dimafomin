"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  MessageSquare, 
  Coins, 
  Clock, 
  Layers, 
  CheckCircle, 
  Lock,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Target,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { allPaths } from "@/lib/academy/paths-data";
import type { PathStatus } from "@/lib/academy/paths-data";

export default function AcademyPage() {
  const router = useRouter();
  const paths = allPaths;

  const benefits = [
    {
      icon: Brain,
      text: "Myślenie kucharza, nie kopiowanie przepisów"
    },
    {
      icon: TrendingUp,
      text: "Mniej marnowania produktów"
    },
    {
      icon: DollarSign,
      text: "Lepszy smak bez droższych zakupów"
    },
    {
      icon: Target,
      text: "Realne umiejętności na całe życie"
    }
  ];

  const getStatusButton = (status: PathStatus) => {
    switch (status) {
      case "available":
        return {
          text: "Rozpocznij",
          className: "bg-sky-600 hover:bg-sky-700 text-white",
          icon: ArrowRight
        };
      case "in-progress":
        return {
          text: "Kontynuuj",
          className: "bg-amber-600 hover:bg-amber-700 text-white",
          icon: ArrowRight
        };
      case "locked":
        return {
          text: "Zablokowana",
          className: "bg-gray-600 cursor-not-allowed text-gray-300",
          icon: Lock
        };
      case "completed":
        return {
          text: "Ukończona",
          className: "bg-green-600 text-white cursor-default",
          icon: CheckCircle
        };
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1️⃣ HERO BLOCK */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 pt-12"
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Akademia świadomego gotowania
          </h1>
          
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4 font-semibold">
            Rozwijaj myślenie kucharza, nie tylko ucz się przepisów
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Ścieżki rozwoju oparte na praktyce, dialogu z AI i realnych decyzjach w kuchni.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/academy/paths/foundations')}
              className="px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Rozpocznij pierwszą ścieżkę
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-sky-600 text-sky-600 dark:text-sky-400 font-semibold rounded-lg hover:bg-sky-50 dark:hover:bg-gray-700 transition-colors">
              Jak działa Akademia
            </button>
          </div>
        </motion.div>

        {/* 2️⃣ HOW IT WORKS - 3 Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Jak działa Akademia
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 p-8 rounded-2xl border-2 border-sky-200 dark:border-sky-800">
              <div className="w-16 h-16 bg-sky-600 rounded-2xl flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Ścieżki rozwoju
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Nie kursy, lecz logiczne ścieżki umiejętności
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl border-2 border-purple-200 dark:border-purple-800">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Dialog z AI
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                AI prowadzi Cię przez decyzje, analizę i praktykę
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-8 rounded-2xl border-2 border-amber-200 dark:border-amber-800">
              <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-4">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                ChefTokens
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Zdobywasz tokeny za postęp i świadome wybory
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3️⃣ CORE BLOCK - Ścieżki rozwoju */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Wybierz swoją ścieżkę rozwoju
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paths.map((path, index) => {
              const statusBtn = getStatusButton(path.status);
              const Icon = statusBtn.icon;
              const isLocked = path.status === "locked";

              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    isLocked
                      ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60"
                      : "bg-white dark:bg-gray-900 border-sky-200 dark:border-sky-800 hover:border-sky-400 dark:hover:border-sky-600 hover:shadow-xl"
                  }`}
                >
                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-6 h-6 text-gray-400" />
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {path.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {path.description}
                    </p>
                  </div>

                  {/* Progress indicator */}
                  {path.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Postęp</span>
                        <span>{path.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-sky-600 h-2 rounded-full transition-all"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{path.totalDuration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Layers className="w-4 h-4" />
                      <span>{path.totalModules} modułów</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        +{path.totalReward} ChefTokens
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    disabled={isLocked}
                    onClick={() => !isLocked && router.push(`/academy/paths/${path.id}`)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${statusBtn.className}`}
                  >
                    {statusBtn.text}
                    <Icon className="w-5 h-5" />
                  </button>

                  {isLocked && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-3">
                      Ukończ poprzednią ścieżkę, aby odblokować
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 4️⃣ VALUE BENEFITS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Co zyskasz
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {benefit.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* 5️⃣ AI MENTOR PREVIEW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 md:p-12 border-2 border-purple-200 dark:border-purple-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Left: Mock dialog */}
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Dlaczego wybrałeś ten produkt? Co Twoim zdaniem będzie smakować najlepiej w tym daniu?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-sky-100 dark:bg-sky-900/30 p-4 rounded-2xl ml-8">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Bo jest świeży i ma intensywny zapach...
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Świetnie! Teraz pomyśl: jak możesz użyć tego aromatu najefektywniej?
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Description */}
              <div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  AI-Mentor nie mówi Ci co robić
                </h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  On pyta, analizuje i pomaga podejmować decyzje — jak prawdziwy szef kuchni.
                </p>
                <Link href="/assistant">
                  <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                    Porozmawiaj z AI mentorem
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 6️⃣ FOOTER CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-sky-600 to-cyan-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pierwsza ścieżka jest darmowa
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Zacznij myśleć jak kucharz już dziś
            </p>
            <button 
              onClick={() => router.push('/academy/paths/foundations')}
              className="px-10 py-4 bg-white text-sky-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg flex items-center gap-2 mx-auto"
            >
              Rozpocznij ścieżkę
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
