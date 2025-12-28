"use client";

import { useState } from "react";
import type { FridgeSettings, Priority } from "@/lib/settings-types";
import { SETTINGS_LABELS } from "@/lib/settings-types";
import { Refrigerator, ArrowUpDown } from "lucide-react";

interface Props {
  settings: FridgeSettings;
  onUpdate: (data: Partial<FridgeSettings>) => void;
}

export default function FridgeSettingsSection({ settings, onUpdate }: Props) {
  const [localSettings, setLocalSettings] = useState(settings);

  function toggleSetting(key: keyof Omit<FridgeSettings, "priorities">) {
    const updated = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(updated);
    onUpdate({ [key]: !localSettings[key] });
  }

  function movePriority(index: number, direction: "up" | "down") {
    const newPriorities = [...localSettings.priorities];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newPriorities.length) return;
    
    [newPriorities[index], newPriorities[targetIndex]] = 
      [newPriorities[targetIndex], newPriorities[index]];
    
    const updated = { ...localSettings, priorities: newPriorities };
    setLocalSettings(updated);
    onUpdate({ priorities: newPriorities });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Lodówka i planowanie
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Automatyczne decyzje i priorytety
        </p>
      </div>

      {/* Automatic Decisions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Refrigerator className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Automatyczne decyzje
          </label>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer bg-white dark:bg-gray-800 transition-colors">
            <span className="text-gray-900 dark:text-white">✅ Proponuj przepisy z lodówki</span>
            <input
              type="checkbox"
              checked={localSettings.autoSuggestRecipes}
              onChange={() => toggleSetting("autoSuggestRecipes")}
              className="w-5 h-5 text-purple-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer bg-white dark:bg-gray-800 transition-colors">
            <span className="text-gray-900 dark:text-white">⚠️ Ostrzegaj przed psuciem</span>
            <input
              type="checkbox"
              checked={localSettings.warnExpiring}
              onChange={() => toggleSetting("warnExpiring")}
              className="w-5 h-5 text-purple-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer bg-white dark:bg-gray-800 transition-colors">
            <span className="text-gray-900 dark:text-white">💸 Pokazuj tańsze alternatywy</span>
            <input
              type="checkbox"
              checked={localSettings.showCheaperAlternatives}
              onChange={() => toggleSetting("showCheaperAlternatives")}
              className="w-5 h-5 text-purple-500"
            />
          </label>
        </div>
      </div>

      {/* Priorities */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Priorytety (przeciągnij aby zmienić kolejność)
          </label>
        </div>
        
        <div className="space-y-2">
          {localSettings.priorities.map((priority, index) => (
            <div
              key={priority}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => movePriority(index, "up")}
                  disabled={index === 0}
                  className={`text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 ${index === 0 ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  ▲
                </button>
                <button
                  onClick={() => movePriority(index, "down")}
                  disabled={index === localSettings.priorities.length - 1}
                  className={`text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 ${index === localSettings.priorities.length - 1 ? "opacity-30 cursor-not-allowed" : ""}`}
                >
                  ▼
                </button>
              </div>
              
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-md">
                  {index + 1}
                </div>
                <span className="text-gray-900 dark:text-white font-medium">
                  {SETTINGS_LABELS.priorities[priority]}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">
          📌 Rules Engine używa tego porządku przy wyborze przepisów
        </p>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          🎯 Jak to działa?
        </h4>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Decision Engine sortuje przepisy według Twoich priorytetów:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
          <li>• Priorytet #1 = 3 punkty</li>
          <li>• Priorytet #2 = 2 punkty</li>
          <li>• Priorytet #3 = 1 punkt</li>
        </ul>
      </div>
    </div>
  );
}
