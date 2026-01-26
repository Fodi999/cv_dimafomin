"use client";

import { useState } from "react";
import { Bot, MessageSquare } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

type CommunicationTone = "calm" | "friendly" | "brief";
type HintFrequency = "minimal" | "moderate" | "active";

export default function CustomerAIPreferencesSection() {
  const { settings, updateSettings } = useSettings();
  
  // Customer-specific AI preferences (stored in settings if needed)
  const [tone, setTone] = useState<CommunicationTone>("friendly");
  const [frequency, setFrequency] = useState<HintFrequency>("moderate");

  const handleToneChange = (newTone: CommunicationTone) => {
    setTone(newTone);
    // В будущем сохранять в settings
  };

  const handleFrequencyChange = (newFrequency: HintFrequency) => {
    setFrequency(newFrequency);
    // В будущем сохранять в settings
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          AI & Assistant
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Настройте помощника по заказам
        </p>
      </div>

      {/* Communication Tone */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Тон общения
          </label>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {(["calm", "friendly", "brief"] as CommunicationTone[]).map((t) => {
            const isActive = tone === t;
            const labels = {
              calm: "Спокойный",
              friendly: "Дружелюбный",
              brief: "Короткий",
            };
            
            return (
              <button
                key={t}
                onClick={() => handleToneChange(t)}
                className={`
                  px-4 py-3 rounded-xl border-2 text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 shadow-md"
                    : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {labels[t]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hint Frequency */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Частота подсказок
          </label>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {(["minimal", "moderate", "active"] as HintFrequency[]).map((f) => {
            const isActive = frequency === f;
            const labels = {
              minimal: "Минимум",
              moderate: "Умеренно",
              active: "Активно",
            };
            
            return (
              <button
                key={f}
                onClick={() => handleFrequencyChange(f)}
                className={`
                  px-4 py-3 rounded-xl border-2 text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 shadow-md"
                    : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {labels[f]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          💡 AI помощник помогает с заказами и рекомендациями блюд
        </p>
      </div>
    </div>
  );
}
