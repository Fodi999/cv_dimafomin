"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle, 
  Lock, 
  Play,
  Coins,
  Clock,
  Layers,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { getPathById } from "@/lib/academy/paths-data";
import type { ModuleStatus } from "@/lib/academy/paths-data";

export default function PathDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pathId = params.pathId as string;
  
  const path = getPathById(pathId);

  if (!path) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ścieżka nie znaleziona
          </h1>
          <button
            onClick={() => router.push("/academy")}
            className="text-sky-600 hover:text-sky-700 font-medium"
          >
            ← Powrót do Akademii
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: ModuleStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "available":
      case "in-progress":
        return <Play className="w-6 h-6 text-sky-600" />;
      case "locked":
        return <Lock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusButton = (status: ModuleStatus) => {
    switch (status) {
      case "available":
        return {
          text: "Rozpocznij",
          className: "bg-sky-600 hover:bg-sky-700 text-white"
        };
      case "in-progress":
        return {
          text: "Kontynuuj",
          className: "bg-amber-600 hover:bg-amber-700 text-white"
        };
      case "locked":
        return {
          text: "Zablokowany",
          className: "bg-gray-400 cursor-not-allowed text-gray-600"
        };
      case "completed":
        return {
          text: "Ukończony",
          className: "bg-green-600 text-white cursor-default"
        };
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/academy")}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Powrót do Akademii
        </motion.button>

        {/* Path Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {path.title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            {path.goal}
          </p>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Postęp</span>
              <span>{path.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-sky-600 to-cyan-600 h-3 rounded-full transition-all"
                style={{ width: `${path.progress}%` }}
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>{path.totalModules} modułów</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{path.totalDuration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                +{path.totalReward} ChefTokens
              </span>
            </div>
          </div>
        </motion.div>

        {/* Modules List */}
        <div className="space-y-6 mb-12">
          {path.modules.map((module, index) => {
            const statusBtn = getStatusButton(module.status);
            const isLocked = module.status === "locked";

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
                  isLocked
                    ? "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-70"
                    : "bg-white dark:bg-gray-900 border-sky-200 dark:border-sky-800 hover:border-sky-400 dark:hover:border-sky-600"
                }`}
              >
                {/* Module number & status icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(module.status)}
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        Moduł {module.number}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {module.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                    <Coins className="w-4 h-4" />
                    +{module.totalReward}
                  </div>
                </div>

                {/* Idea (core concept) */}
                <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-lg mb-4 border-l-4 border-sky-600">
                  <p className="text-sm font-semibold text-sky-900 dark:text-sky-300">
                    💡 Kluczowa idea: {module.idea}
                  </p>
                </div>

                {/* Intro */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                  {module.intro}
                </p>

                {/* Tasks preview */}
                <div className="mb-4 space-y-2">
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Zadania w module:
                  </div>
                  {module.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{task.title} (+{task.reward} ChefTokens)</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  disabled={isLocked}
                  onClick={() => !isLocked && router.push(`/academy/paths/${pathId}/modules/${module.id}`)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${statusBtn.className}`}
                >
                  {statusBtn.text}
                </button>

                {isLocked && (
                  <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-2">
                    Ukończ poprzedni moduł, aby odblokować
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* AI Mentor Preview (inline) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border-2 border-purple-200 dark:border-purple-800"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                AI Mentor będzie Cię prowadził
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                W każdym module AI-Mentor zadaje pytania, analizuje Twoje odpowiedzi i pomaga myśleć jak szef kuchni. 
                To nie test — to dialog, który rozwija Twoje myślenie.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
