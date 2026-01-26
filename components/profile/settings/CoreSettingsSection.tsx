"use client";

import { Globe, Clock, Scale } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSession } from "@/contexts/SessionContext";
import type { Language, TimeFormat, Units } from "@/lib/types/settings";

export default function CoreSettingsSection() {
  const { session } = useSession();
  const isCustomerMode = session?.mode === 'customer';
  const { settings, updateSettings, isUpdating } = useSettings();
  const { t, language, setLanguage } = useLanguage();

  /**
   * Handle language change
   * 
   * ✅ ПРАВИЛЬНО: Сохраняет язык в БД, затем перезагружает UI
   * 
   * КРИТИЧНО: Один источник истины — backend
   * 
   * 1. PATCH /api/settings { "language": "ru" }
   * 2. Обновить UI через setLanguage (reload)
   * 
   * 👉 Backend и UI всегда совпадают
   */
  async function handleLanguageChange(lang: Language) {
    console.log(`🔍 [CoreSettings] handleLanguageChange called with: ${lang}, current: ${language}`);
    
    if (lang === language) {
      console.log(`⏭️ [CoreSettings] Same language, skipping`);
      return;
    }
    
    try {
      console.log(`🌍 [CoreSettings] Saving language to backend: ${lang}`);
      await updateSettings({ language: lang });
      console.log(`✅ [CoreSettings] Language saved to DB: ${lang}`);
      
      // ✅ ОБЯЗАТЕЛЬНО: Обновить UI через setLanguage
      console.log(`🔄 [CoreSettings] Calling setLanguage to update UI`);
      setLanguage(lang);
      console.log(`✅ [CoreSettings] Language UI updated to: ${lang}`);
    } catch (error) {
      console.error("❌ [CoreSettings] Failed to save language:", error);
      
      // Show error to user (non-blocking)
      if (typeof window !== "undefined") {
        console.error("🚨 ERROR: Nie udało się zapisać języka. Spróbuj ponownie.");
      }
    }
  }

  /**
   * Handle time format change
   * Auto-saves to backend
   */
  async function handleTimeFormatChange(format: TimeFormat) {
    if (format === settings.timeFormat) return;
    await updateSettings({ timeFormat: format });
  }

  /**
   * Handle units change
   * Auto-saves to backend
   */
  async function handleUnitsChange(units: Units) {
    if (units === settings.units) return;
    await updateSettings({ units: units });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t?.profile?.settings?.general?.title || "Ogólne"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t?.profile?.settings?.subtitle || "Proste ustawienia. Inteligentne działanie."}
        </p>
      </div>

      {/* Language */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            {t?.profile?.settings?.general?.language || "Język"}
          </label>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["pl", "en", "ru"] as Language[]).map((lang) => {
            const isActive = language === lang;
            const labels = { pl: "🇵🇱 Polski", en: "🇬🇧 English", ru: "🇷🇺 Русский" };
            
            return (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`
                  px-4 py-3 rounded-xl border-2 text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 shadow-md"
                    : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {labels[lang]}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          📌 {t?.profile?.settings?.general?.languageDescription || "Wpływa na: UI, teksty, AI-odpowiedzi, podpowiedzi, błędy"}
        </p>
      </div>

      {/* Time Format */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            {t?.profile?.settings?.general?.timeFormat || "Format czasu"}
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(["24h", "12h"] as TimeFormat[]).map((format) => {
            const isActive = settings.timeFormat === format;
            const labels = {
              "12h": t?.profile?.settings?.general?.timeFormat12h || "12-godzinny",
              "24h": t?.profile?.settings?.general?.timeFormat24h || "24-godzinny",
            };
            
            return (
              <button
                key={format}
                onClick={() => handleTimeFormatChange(format)}
                disabled={isUpdating}
                className={`
                  px-4 py-3 rounded-xl border-2 text-sm font-medium
                  transition-all duration-200 disabled:opacity-50
                  ${isActive
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 shadow-md"
                    : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {labels[format]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Unit System - Hidden for Customer Mode */}
      {!isCustomerMode && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-purple-500" />
            <label className="text-sm font-semibold text-gray-900 dark:text-white">
              {t?.profile?.settings?.general?.units || "Jednostki"}
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["metric", "kitchen"] as Units[]).map((system) => {
              const isActive = settings.units === system;
              const labels = {
                metric: t?.profile?.settings?.general?.unitsMetric || "Metryczne (g, ml)",
                kitchen: t?.profile?.settings?.general?.unitsKitchen || "Kuchenne (szklanki, łyżki)",
              };
              
              return (
                <button
                  key={system}
                  onClick={() => handleUnitsChange(system)}
                  disabled={isUpdating}
                  className={`
                    px-4 py-3 rounded-xl border-2 text-sm font-medium
                    transition-all duration-200 disabled:opacity-50
                    ${isActive
                      ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 shadow-md"
                      : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300"
                    }
                  `}
                >
                  {labels[system]}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            📌 {t?.profile?.settings?.general?.unitsDescription || "Ważne dla przepisów i AI"}
          </p>
        </div>
      )}

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ✨ {t?.profile?.settings?.general?.autoSave || "Zmiany są zapisywane automatycznie i stosowane natychmiast"}
        </p>
      </div>
    </div>
  );
}
