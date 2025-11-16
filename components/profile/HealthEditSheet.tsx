"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface HealthEditSheetProps {
  isOpen: boolean;
  onClose: () => void;
  age?: number;
  weight?: number;
  height?: number;
  dailyCalories?: number;
  allergies?: string[];
  dietaryRestrictions?: string[];
  fitnessGoal?: string;
  onSave: (data: HealthData) => Promise<void>;
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

export function HealthEditSheet({
  isOpen,
  onClose,
  age = 0,
  weight = 0,
  height = 0,
  dailyCalories = 2000,
  allergies = [],
  dietaryRestrictions = [],
  fitnessGoal = "maintenance",
  onSave,
}: HealthEditSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "dailyCalories" ? parseInt(value) || 0 : parseInt(value) || 0,
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }));
  };

  const addRestriction = () => {
    if (newRestriction.trim()) {
      setFormData((prev) => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, newRestriction.trim()],
      }));
      setNewRestriction("");
    }
  };

  const removeRestriction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save health profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />

          {/* Sliding Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-full max-w-md bg-gray-950 z-50 shadow-2xl overflow-y-auto border-l border-gray-800"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Профіль здоров'я
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-900 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="px-6 pt-8 pb-20 space-y-6">
              {/* Age Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Вік (років)
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
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
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
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
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
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
                  name="dailyCalories"
                  value={formData.dailyCalories}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
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
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
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
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addAllergy()}
                    placeholder="Введіть алергію..."
                    className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addAllergy}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    +
                  </motion.button>
                </div>
                {formData.allergies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.allergies.map((allergy, idx) => (
                      <motion.button
                        key={idx}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeAllergy(idx)}
                        className="bg-rose-500/20 border border-rose-400/40 text-rose-300 px-3 py-1 rounded-lg text-sm font-medium hover:bg-rose-500/30 transition-colors"
                      >
                        ✕ {allergy}
                      </motion.button>
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
                    onChange={(e) => setNewRestriction(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addRestriction()}
                    placeholder="Веган, без глютену, тощо..."
                    className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addRestriction}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    +
                  </motion.button>
                </div>
                {formData.dietaryRestrictions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.dietaryRestrictions.map((restriction, idx) => (
                      <motion.button
                        key={idx}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeRestriction(idx)}
                        className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3 py-1 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors"
                      >
                        ✕ {restriction}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl font-bold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Збереження..." : "Зберегти"}
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
