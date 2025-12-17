"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { RecipeCard } from "./RecipeCard";
import type { AIResult, Recipe } from "@/hooks/useAI";

interface AIResultsProps {
  result: AIResult | null;
  loading: boolean;
  error: string | null;
  onAddToPlan?: (recipe: Recipe) => void;
  onMarkDone?: (recipe: Recipe) => void;
}

export function AIResults({ result, loading, error, onAddToPlan, onMarkDone }: AIResultsProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-12 space-y-4"
      >
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        <p className="text-gray-600 dark:text-gray-400">AI analizuje twoje produkty...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3"
      >
        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">Błąd analizy</h3>
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!result) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <p className="text-gray-500 dark:text-gray-400">
          Wybierz akcję powyżej, aby AI przeanalizowało twoją lodówkę
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="results"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        {/* Recipes */}
        {result.recipes && result.recipes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Propozycje przepisów
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {result.recipes.map((recipe, idx) => (
                <RecipeCard
                  key={recipe.id || idx}
                  recipe={recipe}
                  onAddToPlan={onAddToPlan}
                  onMarkDone={onMarkDone}
                />
              ))}
            </div>
          </div>
        )}

        {/* Text Analysis */}
        {result.analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl"
          >
            <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-3">
              Analiza AI
            </h3>
            <p className="text-purple-800 dark:text-purple-200 whitespace-pre-wrap">
              {result.analysis}
            </p>
          </motion.div>
        )}

        {/* Message */}
        {result.message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <p className="text-blue-800 dark:text-blue-200">{result.message}</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
