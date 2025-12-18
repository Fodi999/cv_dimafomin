"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Users, CheckCircle2 } from "lucide-react";
import type { Recipe } from "@/hooks/useAI";

interface DayPlan {
  day: string;
  date?: string;
  meals: Recipe[];
}

interface DayTimelineProps {
  plan: DayPlan[];
  onMarkDone: (recipe: Recipe) => void;
  loading?: boolean;
}

export function DayTimeline({ plan, onMarkDone, loading }: DayTimelineProps) {
  return (
    <div className="space-y-6">
      {plan.map((day, dayIndex) => (
        <motion.div
          key={dayIndex}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: dayIndex * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6"
        >
          {/* Day Header */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {day.day}
              </h3>
              {day.date && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {day.date}
                </p>
              )}
            </div>
          </div>

          {/* Meals */}
          <div className="space-y-4">
            {day.meals.map((meal, mealIndex) => (
              <motion.div
                key={mealIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (dayIndex * 0.1) + (mealIndex * 0.05) }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 rounded-xl p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {meal.title}
                    </h4>
                    
                    {meal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {meal.description}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {meal.timeMinutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{meal.timeMinutes} min</span>
                        </div>
                      )}
                      {meal.servings && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{meal.servings} porcji</span>
                        </div>
                      )}
                      {meal.difficulty && (
                        <div className="px-2 py-0.5 rounded-full bg-white/50 dark:bg-slate-800/50">
                          {meal.difficulty}
                        </div>
                      )}
                    </div>

                    {/* Ingredients Preview */}
                    {meal.ingredients && meal.ingredients.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Składniki:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {meal.ingredients.slice(0, 5).map((ing, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded-full bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                            >
                              {ing.name}
                            </span>
                          ))}
                          {meal.ingredients.length > 5 && (
                            <span className="text-xs px-2 py-1 text-gray-500">
                              +{meal.ingredients.length - 5} więcej
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Zrobione Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onMarkDone(meal)}
                    disabled={loading}
                    className="
                      px-4 py-2 rounded-lg
                      bg-gradient-to-r from-green-500 to-emerald-500
                      hover:from-green-600 hover:to-emerald-600
                      text-white font-semibold text-sm
                      shadow-md hover:shadow-lg
                      transition-all duration-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center gap-2
                      whitespace-nowrap
                    "
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Zrobione
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
