"use client";

import { motion } from "framer-motion";
import { Heart, AlertCircle, Target, Flame, Weight, Users, Leaf } from "lucide-react";
import { composite } from "@/lib/design-tokens";

interface HealthProfileProps {
  age?: number;
  weight?: number;
  height?: number;
  dailyCalories?: number;
  allergies?: string[];
  dietaryRestrictions?: string[];
  fitnessGoal?: string;
  onUpdate?: (data: HealthData) => void;
  onEditClick?: () => void;
}

interface HealthData {
  age: number;
  weight: number;
  height: number;
  dailyCalories: number;
  allergies: string[];
  dietaryRestrictions: string[];
  fitnessGoal: string;
}

export function HealthProfile({
  age = 0,
  weight = 0,
  height = 0,
  dailyCalories = 2000,
  allergies = [],
  dietaryRestrictions = [],
  fitnessGoal = "maintenance",
  onUpdate,
  onEditClick,
}: HealthProfileProps) {
  const formData: HealthData = {
    age,
    weight,
    height,
    dailyCalories,
    allergies,
    dietaryRestrictions,
    fitnessGoal,
  };

  // Calculate BMI
  const bmi = height > 0 ? (weight / (height * height)) * 10000 : 0;
  const bmiCategory = bmi < 18.5 ? "Недостаточный" : bmi < 25 ? "Норма" : bmi < 30 ? "Избыточний" : "Ожирення";
  const bmiColor = bmi < 18.5 ? "text-blue-500" : bmi < 25 ? "text-green-500" : bmi < 30 ? "text-yellow-500" : "text-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${composite.card.container} ${composite.card.hover} overflow-hidden`}
    >
      {/* Title */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-700/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Профіль здоров'я
          </h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEditClick}
          className={`px-3 py-2 ${composite.buttonPrimary} rounded-lg text-xs sm:text-sm font-semibold transition-all`}
        >
          ✏️ Редагувати
        </motion.button>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6">
        <div className="space-y-6">
          {/* Basic Stats - 3 Columns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Age */}
            <div className="rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm"
                 style={{ background: "rgba(59, 130, 246, 0.08)" }}>
              <p className="text-xs text-gray-400 mb-2">Вік</p>
              <p className="text-2xl font-bold text-blue-300">
                {age > 0 ? age : "—"}
              </p>
              <p className="text-xs text-gray-500 mt-1">років</p>
            </div>

            {/* Weight */}
            <div className="rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm"
                 style={{ background: "rgba(168, 85, 247, 0.08)" }}>
              <div className="flex items-center gap-1 mb-2">
                <Weight className="w-3 h-3 text-purple-400" />
                <p className="text-xs text-gray-400">Вага</p>
              </div>
              <p className="text-2xl font-bold text-purple-300">
                {weight > 0 ? weight : "—"}
              </p>
              <p className="text-xs text-gray-500 mt-1">кг</p>
            </div>

            {/* Height */}
            <div className="rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm"
                 style={{ background: "rgba(34, 197, 234, 0.08)" }}>
              <p className="text-xs text-gray-400 mb-2">Ріст</p>
              <p className="text-2xl font-bold text-cyan-300">
                {height > 0 ? height : "—"}
              </p>
              <p className="text-xs text-gray-500 mt-1">см</p>
            </div>

            {/* BMI */}
            <div className="rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm"
                 style={{ background: "rgba(249, 115, 22, 0.08)" }}>
              <p className="text-xs text-gray-400 mb-2">ІМТ</p>
              <p className="text-2xl font-bold text-orange-300">
                {bmi > 0 ? bmi.toFixed(1) : "—"}
              </p>
              {bmi > 0 && <p className={`text-xs mt-1 font-semibold ${bmiColor}`}>{bmiCategory}</p>}
            </div>

            {/* Daily Calories */}
            <div className="rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm"
                 style={{ background: "rgba(239, 68, 68, 0.08)" }}>
              <div className="flex items-center gap-1 mb-2">
                <Flame className="w-3 h-3 text-red-400" />
                <p className="text-xs text-gray-400">Денна норма</p>
              </div>
              <p className="text-2xl font-bold text-red-300">
                {dailyCalories}
              </p>
              <p className="text-xs text-gray-500 mt-1">ккал</p>
            </div>

            {/* Fitness Goal */}
            {fitnessGoal && (
              <div className="rounded-xl p-4 border border-gray-700/30 backdrop-blur-sm"
                   style={{ background: "rgba(34, 197, 94, 0.08)" }}>
                <div className="flex items-center gap-1 mb-2">
                  <Target className="w-3 h-3 text-emerald-400" />
                  <p className="text-xs text-gray-400">Фітнес-ціль</p>
                </div>
                <p className="text-sm font-bold text-emerald-300">
                  {fitnessGoal === "weight_loss" && "Схуднення"}
                  {fitnessGoal === "muscle_gain" && "М'язи"}
                  {fitnessGoal === "maintenance" && "Підтримка"}
                  {fitnessGoal === "endurance" && "Витривалість"}
                </p>
              </div>
            )}
          </div>

          {/* Allergies */}
          {allergies.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold text-white">Алергії</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy, idx) => (
                  <div
                    key={idx}
                    className="bg-rose-500/15 border border-rose-400/40 text-rose-300 px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    ⚠️ {allergy}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dietary Restrictions */}
          {dietaryRestrictions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Дієтичні обмеження</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {dietaryRestrictions.map((restriction, idx) => (
                  <div
                    key={idx}
                    className="bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    🌱 {restriction}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
