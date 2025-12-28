"use client";

import { useState } from "react";
import type { AIPreferences, MentorStyle, AIInterventionLevel } from "@/lib/settings-types";
import { SETTINGS_LABELS } from "@/lib/settings-types";
import { Bot, MessageSquare, Settings as SettingsIcon } from "lucide-react";

interface Props {
  settings: AIPreferences;
  onUpdate: (data: Partial<AIPreferences>) => void;
}

export default function AIPreferencesSection({ settings, onUpdate }: Props) {
  const [localSettings, setLocalSettings] = useState(settings);

  function handleMentorStyle(style: MentorStyle) {
    const updated = { ...localSettings, mentorStyle: style };
    setLocalSettings(updated);
    onUpdate({ mentorStyle: style });
  }

  function handleInterventionLevel(level: AIInterventionLevel) {
    const updated = { ...localSettings, interventionLevel: level };
    setLocalSettings(updated);
    onUpdate({ interventionLevel: level });
  }

  function handleStrictness(strictness: AIPreferences["strictness"]) {
    const updated = { ...localSettings, strictness };
    setLocalSettings(updated);
    onUpdate({ strictness });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          AI & Mentor
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Jaki szef prowadzi Twoją kuchnię?
        </p>
      </div>

      {/* Mentor Style - Only This Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Styl AI
          </label>
        </div>
        
        <div className="space-y-3">
          {(["mentor", "practical", "analytical"] as MentorStyle[]).map((style) => {
            const isActive = localSettings.mentorStyle === style;
            
            const descriptions = {
              mentor: "Spokojny nauczyciel — zadaje pytania, prowadzi krok po kroku",
              practical: "Profesjonalny szef — konkretnie, bez gadania",
              analytical: "Wymagający mistrz — pokazuje liczby, wymaga więcej",
            };
            
            const labels = {
              mentor: "🧘 Spokojny",
              practical: "�‍🍳 Profesjonalny",
              analytical: "🔥 Wymagający",
            };
            
            return (
              <button
                key={style}
                onClick={() => handleMentorStyle(style)}
                className={`
                  w-full px-5 py-4 rounded-xl border-2 text-left
                  transition-all duration-200 shadow-sm
                  ${isActive
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 shadow-md"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 bg-white dark:bg-gray-800"
                  }
                `}
              >
                <div className={`font-semibold mb-2 ${isActive ? "text-purple-700 dark:text-purple-300" : "text-gray-900 dark:text-white"}`}>
                  {labels[style]}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {descriptions[style]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          💡 To zmienia sposób, w jaki AI prowadzi lekcje w Akademii i pomaga wybierać przepisy
        </p>
      </div>
    </div>
  );
}
