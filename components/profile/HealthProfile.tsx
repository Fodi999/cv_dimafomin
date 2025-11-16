"use client";

import { motion } from "framer-motion";
import { Heart, AlertCircle, Target, Flame, Weight, Users, Leaf } from "lucide-react";
import { useState } from "react";
import { composite, borderRadius, colors } from "@/lib/design-tokens";

interface HealthProfileProps {
  age?: number;
  weight?: number;
  height?: number;
  dailyCalories?: number;
  allergies?: string[];
  dietaryRestrictions?: string[];
  fitnessGoal?: string;
  onUpdate?: (data: HealthData) => void;
  isEditing?: boolean;
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
  isEditing: initialIsEditing = false,
}: HealthProfileProps) {
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [formData, setFormData] = useState<HealthData>({
    age,
    weight,
    height,
    dailyCalories,
    allergies,
    dietaryRestrictions,
    fitnessGoal,
  });
  const [newAllergy, setNewAllergy] = useState("");
  const [newRestriction, setNewRestriction] = useState("");

  const handleSave = () => {
    onUpdate?.(formData);
    setIsEditing(false);
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const addRestriction = () => {
    if (newRestriction.trim()) {
      setFormData(prev => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, newRestriction.trim()],
      }));
      setNewRestriction("");
    }
  };

  const removeRestriction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter((_, i) => i !== index),
    }));
  };

  // Calculate BMI
  const bmi = height > 0 ? (weight / (height * height)) * 10000 : 0;
  const bmiCategory = bmi < 18.5 ? "Недостаточный" : bmi < 25 ? "Норма" : bmi < 30 ? "Избыточный" : "Ожирение";
  const bmiColor = bmi < 18.5 ? "text-blue-500" : bmi < 25 ? "text-green-500" : bmi < 30 ? "text-yellow-500" : "text-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${composite.card.container} ${composite.card.hover} overflow-hidden`}
    >
      {/* Content */}
      <div className="px-4 pb-4 pt-4">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Профіль здоров'я
            </h2>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1 ${borderRadius.md} ${colors.primary.light.gradient} text-white text-sm font-semibold transition-all hover:shadow-lg`}
          >
            {isEditing ? "Скасувати" : "Редагувати"}
          </button>
        </div>

        {!isEditing ? (
          // View Mode
          <div className="space-y-3">
            {/* Basic Stats */}
            <div className="flex flex-wrap gap-3">
            {/* Age */}
              <div className={`${colors.primary.light.badge} p-3 ${borderRadius.md} flex-1 min-w-[120px]`}>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Вік</p>
                <p className={`text-xl font-bold ${colors.primary.light.text}`}>
                  {age > 0 ? age : "—"} років
                </p>
              </div>

              {/* Weight */}
              <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-400/30 p-3 rounded-md flex-1 min-w-[120px]">
                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                  <Weight className="w-3 h-3" /> Вага
                </p>
                <p className="text-xl font-bold text-violet-300">
                  {weight > 0 ? weight : "—"} кг
                </p>
              </div>

              {/* Height */}
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 p-3 rounded-md flex-1 min-w-[120px]">
                <p className="text-xs text-gray-400 mb-1">Ріст</p>
                <p className="text-xl font-bold text-cyan-300">
                  {height > 0 ? height : "—"} см
                </p>
              </div>

              {/* BMI */}
              <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-400/30 p-3 rounded-md flex-1 min-w-[120px]">
                <p className="text-xs text-gray-400 mb-1">ІМТ</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-bold text-orange-300">
                    {bmi > 0 ? bmi.toFixed(1) : "—"}
                  </p>
                  {bmi > 0 && <p className={`text-xs font-semibold ${bmiColor}`}>{bmiCategory}</p>}
                </div>
              </div>

              {/* Daily Calories */}
              <div className="bg-gradient-to-br from-rose-500/10 to-red-500/10 border border-rose-400/30 p-3 rounded-md flex-1 min-w-[120px]">
                <div className="flex items-center gap-1 mb-1">
                  <Flame className="w-3 h-3 text-rose-400" />
                  <p className="text-xs text-gray-400">Денна норма</p>
                </div>
                <p className="text-xl font-bold text-rose-300">
                  {dailyCalories} ккал
                </p>
              </div>

              {/* Fitness Goal */}
              {formData.fitnessGoal && (
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/30 p-3 rounded-md flex-1 min-w-[120px]">
                  <div className="flex items-center gap-1 mb-1">
                    <Target className="w-3 h-3 text-emerald-400" />
                    <p className="text-xs text-gray-400">Фітнес-ціль</p>
                  </div>
                  <p className="text-xs font-bold text-emerald-300">
                    {formData.fitnessGoal === "weight_loss" && "Схуднення"}
                    {formData.fitnessGoal === "muscle_gain" && "Набір м'язів"}
                    {formData.fitnessGoal === "maintenance" && "Підтримка"}
                    {formData.fitnessGoal === "endurance" && "Витривалість"}
                  </p>
                </div>
              )}
            </div>

            {/* Allergies */}
            {formData.allergies.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-semibold text-white">Алергії</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, idx) => (
                    <div
                      key={idx}
                      className="bg-rose-500/10 border border-rose-400/30 text-rose-300 px-2 py-0.5 rounded-full text-xs font-medium"
                    >
                      ⚠️ {allergy}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dietary Restrictions */}
            {formData.dietaryRestrictions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">Дієтичні обмеження</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.dietaryRestrictions.map((restriction, idx) => (
                    <div
                      key={idx}
                      className="bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 px-2 py-0.5 rounded-full text-xs font-medium"
                    >
                      🌱 {restriction}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-6">
            {/* Age Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Вік
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                className={`${composite.input}`}
                min="0"
                max="120"
              />
            </div>

            {/* Weight Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Вага (кг)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={e => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                className={`${composite.input}`}
                min="0"
                step="0.1"
              />
            </div>

            {/* Height Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Ріст (см)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={e => setFormData(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                className={`${composite.input}`}
                min="0"
                step="0.1"
              />
            </div>

            {/* Daily Calories Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Денна норма калорій (ккал)
              </label>
              <input
                type="number"
                value={formData.dailyCalories}
                onChange={e => setFormData(prev => ({ ...prev, dailyCalories: parseInt(e.target.value) || 2000 }))}
                className={`${composite.input}`}
                min="500"
                step="100"
              />
            </div>

            {/* Fitness Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Фітнес-ціль
              </label>
              <select
                value={formData.fitnessGoal}
                onChange={e => setFormData(prev => ({ ...prev, fitnessGoal: e.target.value }))}
                className={`${composite.input}`}
              >
                <option value="maintenance">Підтримка ваги</option>
                <option value="weight_loss">Схуднення</option>
                <option value="muscle_gain">Набір м'язової маси</option>
                <option value="endurance">Підвищення витривалості</option>
              </select>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Алергії
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={e => setNewAllergy(e.target.value)}
                  onKeyPress={e => e.key === "Enter" && addAllergy()}
                  placeholder="Введіть алергію..."
                  className={`${composite.input} flex-1`}
                />
                <button
                  onClick={addAllergy}
                  className={`px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white ${borderRadius.md} font-semibold transition-colors`}
                >
                  Додати
                </button>
              </div>
              {formData.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, idx) => (
                    <button
                      key={idx}
                      onClick={() => removeAllergy(idx)}
                      className="bg-rose-500/20 border border-rose-400/30 text-rose-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-rose-500/30 transition-colors"
                    >
                      ✕ {allergy}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Дієтичні обмеження
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newRestriction}
                  onChange={e => setNewRestriction(e.target.value)}
                  onKeyPress={e => e.key === "Enter" && addRestriction()}
                  placeholder="Введіть обмеження (веган, без глютену тощо)..."
                  className={`${composite.input} flex-1`}
                />
                <button
                  onClick={addRestriction}
                  className={`px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white ${borderRadius.md} font-semibold transition-colors`}
                >
                  Додати
                </button>
              </div>
              {formData.dietaryRestrictions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.dietaryRestrictions.map((restriction, idx) => (
                    <button
                      key={idx}
                      onClick={() => removeRestriction(idx)}
                      className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                    >
                      ✕ {restriction}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`w-full px-6 py-3 ${colors.primary.light.gradient} text-white ${borderRadius.lg} font-bold transition-all hover:shadow-lg`}
            >
              Зберегти зміни
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
