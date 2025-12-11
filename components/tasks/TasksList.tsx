"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Clock, 
  CheckCircle, 
  Loader2, 
  Coins,
  Calendar,
  Target,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { tasksApi } from "@/lib/api";

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: 'daily' | 'weekly' | 'special' | 'learning' | 'social' | 'achievements';
  status: 'available' | 'pending' | 'completed';
  progress?: number;
  maxProgress?: number;
  deadline?: string;
  requirements?: string[];
}

interface TasksListProps {
  category?: string;
  onTaskComplete?: (taskId: string) => void;
}

const CATEGORY_CONFIG = {
  daily: { icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800' },
  weekly: { icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800' },
  special: { icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800' },
  learning: { icon: Target, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-200 dark:border-green-800' },
  social: { icon: Trophy, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30', border: 'border-pink-200 dark:border-pink-800' },
  achievements: { icon: Trophy, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-200 dark:border-violet-800' },
};

export function TasksList({ category, onTaskComplete }: TasksListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Необхідно увійти в систему");
        return;
      }

      const filters: any = {};
      if (category) filters.category = category;

      const data = await tasksApi.getTasks(token, filters);
      setTasks((data as any)?.tasks || []);
    } catch (err: any) {
      console.error("Error loading tasks:", err);
      setError(err.message || "Помилка завантаження завдань");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [category]);

  const handleSubmitTask = async (taskId: string) => {
    try {
      setSubmitting(taskId);
      const token = localStorage.getItem("authToken");
      if (!token) return;

      await tasksApi.submitTask(taskId, {}, token);
      
      // Update task status locally
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'pending' as const }
          : task
      ));

      onTaskComplete?.(taskId);
    } catch (err: any) {
      console.error("Error submitting task:", err);
      alert(err.message || "Помилка відправки завдання");
    } finally {
      setSubmitting(null);
    }
  };

  const getTaskIcon = (task: Task) => {
    const Icon = CATEGORY_CONFIG[task.category]?.icon || Trophy;
    return Icon;
  };

  const getTimeRemaining = (deadline?: string) => {
    if (!deadline) return null;
    
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return "Прострочено";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}год`;
    
    const days = Math.floor(hours / 24);
    return `${days}дн`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={loadTasks}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Спробувати ще раз
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
        <p className="text-gray-500 text-sm">Немає доступних завдань</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => {
          const Icon = getTaskIcon(task);
          const config = CATEGORY_CONFIG[task.category];
          const isSubmitting = submitting === task.id;
          const progressPercent = task.maxProgress 
            ? (task.progress || 0) / task.maxProgress * 100 
            : 0;

          return (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-xl p-4 border ${config?.border} ${config?.bg} hover:shadow-lg transition-all`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white/50 dark:bg-black/20`}>
                  <Icon className={`w-5 h-5 ${config?.color}`} />
                </div>
                
                {task.deadline && (
                  <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    {getTimeRemaining(task.deadline)}
                  </div>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">
                {task.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {task.description}
              </p>

              {/* Progress Bar */}
              {task.maxProgress && task.maxProgress > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Прогрес</span>
                    <span>{task.progress || 0}/{task.maxProgress}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className={`h-full ${config?.color?.replace('text-', 'bg-')}`}
                    />
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    +{task.reward} CT
                  </span>
                </div>

                {task.status === 'completed' ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    Виконано
                  </div>
                ) : task.status === 'pending' ? (
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                    <Clock className="w-4 h-4" />
                    На перевірці
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubmitTask(task.id)}
                    disabled={isSubmitting}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Відправка...
                      </span>
                    ) : (
                      'Виконати'
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
