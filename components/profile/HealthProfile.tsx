"use client";

import { motion } from "framer-motion";
import { Heart, AlertCircle, Target, Flame, Weight, Users, Leaf } from "lucide-react";
import { useState } from "react";

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
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
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
            className="px-3 py-1 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors"
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
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-3 rounded-md flex-1 min-w-[120px]">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Вік</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {age > 0 ? age : "—"} років
                </p>
              </div>

              {/* Weight */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-3 rounded-md flex-1 min-w-[120px]">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                  <Weight className="w-3 h-3" /> Вага
                </p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {weight > 0 ? weight : "—"} кг
                </p>
              </div>

              {/* Height */}
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 p-3 rounded-md flex-1 min-w-[120px]">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Ріст</p>
                <p className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
                  {height > 0 ? height : "—"} см
                </p>
              </div>

              {/* BMI */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-3 rounded-md flex-1 min-w-[120px]">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">ІМТ</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {bmi > 0 ? bmi.toFixed(1) : "—"}
                  </p>
                  {bmi > 0 && <p className={`text-xs font-semibold ${bmiColor}`}>{bmiCategory}</p>}
                </div>
              </div>

              {/* Daily Calories */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 p-3 rounded-md flex-1 min-w-[120px]">
                <div className="flex items-center gap-1 mb-1">
                  <Flame className="w-3 h-3 text-red-500" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Денна норма</p>
                </div>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">
                  {dailyCalories} ккал
                </p>
              </div>

              {/* Fitness Goal */}
              {formData.fitnessGoal && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-3 rounded-md flex-1 min-w-[120px]">
                  <div className="flex items-center gap-1 mb-1">
                    <Target className="w-3 h-3 text-green-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Фітнес-ціль</p>
                  </div>
                  <p className="text-xs font-bold text-green-600 dark:text-green-400">
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
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Алергії</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, idx) => (
                    <div
                      key={idx}
                      className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full text-xs font-medium"
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
                  <Leaf className="w-4 h-4 text-green-500" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Дієтичні обмеження</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.dietaryRestrictions.map((restriction, idx) => (
                    <div
                      key={idx}
                      className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full text-xs font-medium"
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
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Вік
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={e => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="120"
              />
            </div>

            {/* Weight Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Вага (кг)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={e => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.1"
              />
            </div>

            {/* Height Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Ріст (см)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={e => setFormData(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.1"
              />
            </div>

            {/* Daily Calories Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Денна норма калорій (ккал)
              </label>
              <input
                type="number"
                value={formData.dailyCalories}
                onChange={e => setFormData(prev => ({ ...prev, dailyCalories: parseInt(e.target.value) || 2000 }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="500"
                step="100"
              />
            </div>

            {/* Fitness Goal */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Фітнес-ціль
              </label>
              <select
                value={formData.fitnessGoal}
                onChange={e => setFormData(prev => ({ ...prev, fitnessGoal: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="maintenance">Підтримка ваги</option>
                <option value="weight_loss">Схуднення</option>
                <option value="muscle_gain">Набір м'язової маси</option>
                <option value="endurance">Підвищення витривалості</option>
              </select>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Алергії
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newAllergy}
                  onChange={e => setNewAllergy(e.target.value)}
                  onKeyPress={e => e.key === "Enter" && addAllergy()}
                  placeholder="Введіть алергію..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addAllergy}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
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
                      className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    >
                      ✕ {allergy}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Дієтичні обмеження
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newRestriction}
                  onChange={e => setNewRestriction(e.target.value)}
                  onKeyPress={e => e.key === "Enter" && addRestriction()}
                  placeholder="Введіть обмеження (веган, без глютену тощо)..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addRestriction}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
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
                      className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
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
              className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold transition-colors"
            >
              Зберегти зміни
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
