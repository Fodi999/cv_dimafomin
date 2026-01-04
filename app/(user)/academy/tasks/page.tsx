"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, TrendingUp, Target, Users, Award, Filter } from "lucide-react";
import { TasksList } from "@/components/tasks/TasksList";

const CATEGORIES = [
  { id: 'all', label: 'Всі завдання', icon: Trophy, color: 'text-gray-600' },
  { id: 'daily', label: 'Щоденні', icon: Calendar, color: 'text-blue-500' },
  { id: 'weekly', label: 'Тижневі', icon: TrendingUp, color: 'text-purple-500' },
  { id: 'learning', label: 'Навчання', icon: Target, color: 'text-green-500' },
  { id: 'social', label: 'Соціальні', icon: Users, color: 'text-pink-500' },
  { id: 'achievements', label: 'Досягнення', icon: Award, color: 'text-violet-500' },
];

export default function TasksPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleTaskComplete = (taskId: string) => {
    console.log("Task completed:", taskId);
    // Show success notification
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-amber-500" />
            Завдання
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Виконуйте завдання, заробляйте ChefTokens та розвивайте свої кулінарні навички!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Виконано</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">12</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">В процесі</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">5</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Зароблено</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">320 CT</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Категорії</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : cat.color}`} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tasks List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TasksList 
            category={selectedCategory === 'all' ? undefined : selectedCategory}
            onTaskComplete={handleTaskComplete}
          />
        </motion.div>
      </div>
    </div>
  );
}
