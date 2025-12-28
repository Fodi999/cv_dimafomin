"use client";

import { useState } from "react";
import type { CulinaryProfile, SkillLevel, UserGoal, DietType } from "@/lib/settings-types";
import { SETTINGS_LABELS } from "@/lib/settings-types";
import { ChefHat, Target, AlertCircle, Leaf } from "lucide-react";

interface Props {
  settings: CulinaryProfile;
  onUpdate: (data: Partial<CulinaryProfile>) => void;
}

export default function CulinaryProfileSection({ settings, onUpdate }: Props) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [newAllergy, setNewAllergy] = useState("");
  const [newExcluded, setNewExcluded] = useState("");

  function handleSkillLevel(level: SkillLevel) {
    const updated = { ...localSettings, skillLevel: level };
    setLocalSettings(updated);
    onUpdate({ skillLevel: level });
  }

  function toggleGoal(goal: UserGoal) {
    const goals = localSettings.goals.includes(goal)
      ? localSettings.goals.filter((g) => g !== goal)
      : [...localSettings.goals, goal];
    
    const updated = { ...localSettings, goals };
    setLocalSettings(updated);
    onUpdate({ goals });
  }

  function addAllergy() {
    if (!newAllergy.trim()) return;
    const allergies = [...localSettings.allergies, newAllergy.trim()];
    setLocalSettings({ ...localSettings, allergies });
    onUpdate({ allergies });
    setNewAllergy("");
  }

  function removeAllergy(allergy: string) {
    const allergies = localSettings.allergies.filter((a) => a !== allergy);
    setLocalSettings({ ...localSettings, allergies });
    onUpdate({ allergies });
  }

  function addExcluded() {
    if (!newExcluded.trim()) return;
    const excluded = [...localSettings.excludedProducts, newExcluded.trim()];
    setLocalSettings({ ...localSettings, excludedProducts: excluded });
    onUpdate({ excludedProducts: excluded });
    setNewExcluded("");
  }

  function removeExcluded(product: string) {
    const excluded = localSettings.excludedProducts.filter((p) => p !== product);
    setLocalSettings({ ...localSettings, excludedProducts: excluded });
    onUpdate({ excludedProducts: excluded });
  }

  function handleDiet(diet: DietType) {
    const updated = { ...localSettings, diet };
    setLocalSettings(updated);
    onUpdate({ diet });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Profil kulinarny
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          AI dostosuje się do Twojego poziomu i celów
        </p>
      </div>

      {/* Skill Level */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Poziom użytkownika
          </label>
        </div>
        <div className="space-y-2">
          {(["beginner", "intermediate", "professional"] as SkillLevel[]).map((level) => {
            const isActive = localSettings.skillLevel === level;
            
            return (
              <button
                key={level}
                onClick={() => handleSkillLevel(level)}
                className={`
                  w-full px-4 py-3 rounded-xl border-2 text-left
                  transition-all duration-200
                  ${isActive
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30"
                    : "border-gray-200 hover:border-purple-300"
                  }
                `}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {SETTINGS_LABELS.skillLevel[level]}
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500">
          📌 AI zmieni: styl wyjaśnień, złożoność rozwiązań, głębokość analizy
        </p>
      </div>

      {/* User Goals */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Twoje cele (możesz wybrać kilka)
          </label>
        </div>
        <div className="space-y-2">
          {(Object.keys(SETTINGS_LABELS.goals) as UserGoal[]).map((goal) => {
            const isActive = localSettings.goals.includes(goal);
            
            return (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`
                  w-full px-4 py-3 rounded-xl border-2 text-left
                  transition-all duration-200 flex items-center gap-3
                  ${isActive
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30"
                    : "border-gray-200 hover:border-purple-300"
                  }
                `}
              >
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center
                  ${isActive ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/300" : "border-gray-300"}
                `}>
                  {isActive && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-900 dark:text-white">
                  {SETTINGS_LABELS.goals[goal]}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500">
          📌 Rules Engine i AI używają tego przy rekomendacjach
        </p>
      </div>

      {/* Allergies */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Alergie
          </label>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addAllergy()}
            placeholder="np. mleko, orzechy"
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={addAllergy}
            className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/300 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            Dodaj
          </button>
        </div>
        {localSettings.allergies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {localSettings.allergies.map((allergy) => (
              <span
                key={allergy}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-2"
              >
                {allergy}
                <button
                  onClick={() => removeAllergy(allergy)}
                  className="hover:text-red-900"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Excluded Products */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Produkty wykluczone
          </label>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newExcluded}
            onChange={(e) => setNewExcluded(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addExcluded()}
            placeholder="np. wieprzowina, alkohol"
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={addExcluded}
            className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/300 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            Dodaj
          </button>
        </div>
        {localSettings.excludedProducts.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {localSettings.excludedProducts.map((product) => (
              <span
                key={product}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
              >
                {product}
                <button
                  onClick={() => removeExcluded(product)}
                  className="hover:text-gray-900 dark:text-white"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Diet Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-green-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Dieta (opcjonalnie)
          </label>
        </div>
        <select
          value={localSettings.diet}
          onChange={(e) => handleDiet(e.target.value as DietType)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900 dark:text-white"
        >
          <option value="none">Brak</option>
          <option value="vegetarian">Wegetariańska</option>
          <option value="vegan">Wegańska</option>
          <option value="pescatarian">Pescatariańska</option>
          <option value="keto">Keto</option>
          <option value="paleo">Paleo</option>
        </select>
      </div>
    </div>
  );
}
