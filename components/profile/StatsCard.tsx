"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Award, Zap, BookOpen } from "lucide-react";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  color: "blue" | "green" | "purple" | "orange";
  index?: number;
}

// Unified subtle gradient - more transparent
const UNIFIED_GRADIENT = "rgba(139, 92, 246, 0.12)";

export function StatsCard({
  icon,
  label,
  value,
  change,
  color,
  index = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ translateY: -4 }}
      className="rounded-xl p-4 transition-all overflow-hidden border border-violet-500/10 flex items-center gap-3"
      style={{ 
        background: "rgba(139, 92, 246, 0.12)",
        backdropFilter: 'blur(18px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
      }}
    >
      {/* Icon */}
      <div className="flex-shrink-0 text-violet-300/60 opacity-70">
        <div className="w-6 h-6">
          {icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white/80 uppercase tracking-tight mb-0.5">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold text-white">
            {value}
          </p>
          {change && (
            <span className="text-xs font-semibold text-violet-300">
              {change}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface StatsGridProps {
  level?: number;
  xp?: number;
  maxXp?: number;
  balance?: number;
  coursesCount?: number;
}

export function StatsGrid({
  level = 1,
  xp = 450,
  maxXp = 1000,
  balance = 5000,
  coursesCount = 3,
}: StatsGridProps) {
  return (
    <div className="space-y-4">
      {/* Courses Section */}
      <div>
        <h3 className="font-semibold text-base text-white/80 uppercase tracking-tight mb-4">
          Мои курсы
        </h3>

        <div className="space-y-3">
          {/* Completed Course */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ translateY: -2 }}
            className="rounded-xl p-4 border border-violet-400/30 transition-all"
            style={{ 
              background: "rgba(139, 92, 246, 0.08)",
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-start gap-4">
              {/* Course Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-600 to-violet-400 rounded-lg flex items-center justify-center shadow-md">
                <Award className="w-6 h-6 text-white" />
              </div>

              {/* Course Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-white truncate">Майстер суші: професійний</h4>
                <p className="text-xs text-gray-300 mt-1">Завершено • 100%</p>
              </div>

              {/* Progress Circle */}
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 relative">
                <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700" />
                  <circle 
                    cx="20" 
                    cy="20" 
                    r="16" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    className="text-violet-500"
                    strokeDasharray="100.5"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-white">100%</span>
              </div>
            </div>
          </motion.div>

          {/* In Progress Course */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            whileHover={{ translateY: -2 }}
            className="rounded-xl p-4 border border-cyan-400/30 transition-all"
            style={{ 
              background: "rgba(34, 211, 238, 0.08)",
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-start gap-4">
              {/* Course Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>

              {/* Course Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-white truncate">Японська кухня для початківців</h4>
                <p className="text-xs text-gray-300 mt-1">В процесі • 30%</p>
              </div>

              {/* Progress Circle */}
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 relative">
                <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700" />
                  <circle 
                    cx="20" 
                    cy="20" 
                    r="16" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    className="text-cyan-500"
                    strokeDasharray="100.5"
                    strokeDashoffset="70.35"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-white">30%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
