"use client";

import { useState } from "react";
import type { BudgetSettings, BudgetMode, Currency } from "@/lib/settings-types";
import { SETTINGS_LABELS } from "@/lib/settings-types";
import { Wallet, DollarSign } from "lucide-react";

interface Props {
  settings: BudgetSettings;
  onUpdate: (data: Partial<BudgetSettings>) => void;
}

export default function BudgetSettingsSection({ settings, onUpdate }: Props) {
  const [localSettings, setLocalSettings] = useState(settings);

  function handleMode(mode: BudgetMode) {
    const updated = { ...localSettings, mode };
    setLocalSettings(updated);
    onUpdate({ mode });
  }

  function handleCurrency(currency: Currency) {
    const updated = { ...localSettings, currency };
    setLocalSettings(updated);
    onUpdate({ currency });
  }

  function handleLimit(value: string) {
    const limit = value === "" ? undefined : parseFloat(value);
    const updated = { ...localSettings, monthlyLimit: limit };
    setLocalSettings(updated);
    onUpdate({ monthlyLimit: limit });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Budżet
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tryb śledzenia wydatków i waluta
        </p>
      </div>

      {/* Budget Mode */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Tryb budżetu
          </label>
        </div>
        
        <div className="space-y-2">
          {(["passive", "active_warnings", "economy_mode"] as BudgetMode[]).map((mode) => {
            const isActive = localSettings.mode === mode;
            
            const descriptions = {
              passive: "Śledzi wydatki bez ostrzeżeń. Tylko statystyki.",
              active_warnings: "Pokazuje alerty gdy przekroczysz limity.",
              economy_mode: "Sugeruje zawsze najtańsze opcje.",
            };
            
            return (
              <button
                key={mode}
                onClick={() => handleMode(mode)}
                className={`
                  w-full px-4 py-4 rounded-xl border-2 text-left
                  transition-all duration-200
                  ${isActive
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30"
                    : "border-gray-200 hover:border-purple-300"
                  }
                `}
              >
                <div className="font-medium text-gray-900 mb-1">
                  {SETTINGS_LABELS.budgetMode[mode]}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {descriptions[mode]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Currency */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-purple-500" />
          <label className="text-sm font-semibold text-gray-900 dark:text-white">
            Waluta
          </label>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {(["PLN", "EUR", "USD"] as Currency[]).map((currency) => {
            const isActive = localSettings.currency === currency;
            const symbols = { PLN: "zł", EUR: "€", USD: "$" };
            
            return (
              <button
                key={currency}
                onClick={() => handleCurrency(currency)}
                className={`
                  px-4 py-3 rounded-xl border-2 text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300"
                    : "border-gray-200 hover:border-purple-300 text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {currency} ({symbols[currency]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Monthly Limit */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-gray-900 dark:text-white">
          Miesięczny limit (opcjonalnie)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={localSettings.monthlyLimit || ""}
            onChange={(e) => handleLimit(e.target.value)}
            placeholder="np. 500"
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
          />
          <span className="text-gray-600 font-medium">
            {localSettings.currency}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          Zostaw puste jeśli nie chcesz limitu
        </p>
      </div>
    </div>
  );
}
