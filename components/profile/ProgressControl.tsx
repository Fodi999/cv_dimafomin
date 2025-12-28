"use client";

import { motion } from "framer-motion";
import { Award, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProgressControlProps {
  level: number;
  xp: number;
  maxXp: number;
  weeklyBudget: number;
  weeklySpent: number;
}

/**
 * Progress & Control Block
 * Shows: Level XP progress + Weekly budget tracker
 * Answers: "Jak mi idzie?" (How am I doing?)
 */
export function ProgressControl({
  level,
  xp,
  maxXp,
  weeklyBudget,
  weeklySpent,
}: ProgressControlProps) {
  const { t } = useLanguage();
  
  const xpPercentage = (xp / maxXp) * 100;
  const budgetPercentage = (weeklySpent / weeklyBudget) * 100;
  
  // Budget status: green (< 70%), yellow (70-90%), red (> 90%)
  const budgetStatus = 
    budgetPercentage < 70 ? "safe" : 
    budgetPercentage < 90 ? "warning" : 
    "danger";
  
  const budgetColors = {
    safe: {
      bg: "from-emerald-500/20 to-green-500/20",
      border: "border-emerald-500/40",
      text: "text-emerald-300",
      bar: "bg-gradient-to-r from-emerald-500 to-green-500",
      icon: CheckCircle2,
    },
    warning: {
      bg: "from-amber-500/20 to-yellow-500/20",
      border: "border-amber-500/40",
      text: "text-amber-300",
      bar: "bg-gradient-to-r from-amber-500 to-yellow-500",
      icon: AlertTriangle,
    },
    danger: {
      bg: "from-rose-500/20 to-red-500/20",
      border: "border-rose-500/40",
      text: "text-rose-300",
      bar: "bg-gradient-to-r from-rose-500 to-red-500",
      icon: AlertTriangle,
    },
  };
  
  const budgetTheme = budgetColors[budgetStatus];
  const BudgetIcon = budgetTheme.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl border border-violet-500/40 p-4 sm:p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-violet-400/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm sm:text-base font-semibold text-white">
                {t?.profile?.progress?.level || "Level"} {level}
              </h3>
            </div>
            <div className="text-xs sm:text-sm text-violet-300/80 font-medium">
              {xp} / {maxXp} XP
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="relative h-3 bg-violet-950/40 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercentage}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
            />
          </div>
          
          <div className="flex items-center gap-1.5 text-violet-300/70">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs">
              {Math.round(xpPercentage)}% {t?.profile?.progress?.toNextLevel?.replace("{percent}", "") || "to next level"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Weekly Budget Tracker */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className={`bg-gradient-to-br ${budgetTheme.bg} rounded-xl border ${budgetTheme.border} p-4 sm:p-5 relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BudgetIcon className={`w-5 h-5 ${budgetTheme.text}`} />
              <h3 className="text-sm sm:text-base font-semibold text-white">
                {t?.profile?.budget?.title || "Weekly budget"}
              </h3>
            </div>
            <div className={`text-xs sm:text-sm ${budgetTheme.text} font-medium`}>
              {weeklySpent} / {weeklyBudget} PLN
            </div>
          </div>
          
          {/* Budget Progress Bar */}
          <div className="relative h-3 bg-gray-950/40 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.7 }}
              className={`absolute inset-y-0 left-0 ${budgetTheme.bar} rounded-full`}
            />
          </div>
          
          <div className={`flex items-center gap-1.5 ${budgetTheme.text}/70`}>
            {budgetStatus === "safe" && (
              <span className="text-xs">
                {t?.profile?.budget?.remaining?.replace("{amount}", String(weeklyBudget - weeklySpent)) || 
                  `✅ Great! ${weeklyBudget - weeklySpent} PLN remaining`}
              </span>
            )}
            {budgetStatus === "warning" && (
              <span className="text-xs">⚠️ Uwaga! Pozostało {weeklyBudget - weeklySpent} PLN</span>
            )}
            {budgetStatus === "danger" && (
              <span className="text-xs">
                {t?.profile?.budget?.overBudget?.replace("{amount}", String(weeklySpent - weeklyBudget)) || 
                  `🚨 Over budget by ${weeklySpent - weeklyBudget} PLN`}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
