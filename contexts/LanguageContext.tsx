"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import type { Language } from '@/lib/types/settings';
import { getDictionary } from '@/lib/i18n/getDictionary';
import type { Dictionary } from '@/lib/i18n/types';

export type Locale = Language; // Alias for backward compatibility

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => Promise<void>;
  isLoading: boolean;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Language Provider
 * 
 * ✅ INDUSTRY-STANDARD PATTERN (Google/Vercel/Shopify):
 * /api/settings → SettingsContext.language → LanguageProvider → Dictionary Object → UI
 * 
 * ✅ NEW: Type-safe object access instead of function calls
 * OLD: t("profile.edit")
 * NEW: t.profile.info.name (with full autocomplete!)
 * 
 * Backend является единственным источником правды для языка
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSettings, isUpdating, isLoaded } = useSettings();
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);

  /**
   * Load dictionary when language changes
   * Uses lazy loading for optimal bundle size
   */
  useEffect(() => {
    let mounted = true;

    async function loadDictionary() {
      try {
        const dict = await getDictionary(settings.language);
        if (mounted) {
          setDictionary(dict);
        }
      } catch (error) {
        console.error("Failed to load dictionary:", error);
        // Fallback to Polish
        const fallbackDict = await getDictionary("pl");
        if (mounted) {
          setDictionary(fallbackDict);
        }
      }
    }

    loadDictionary();

    return () => {
      mounted = false;
    };
  }, [settings.language]);

  /**
   * Change language
   * Triggers PATCH /api/settings automatically via SettingsContext
   */
  const setLanguage = async (lang: Locale) => {
    if (lang === settings.language) return;
    
    // Update via SettingsContext (handles optimistic update + API)
    await updateSettings({ language: lang });
    
    // Update localStorage for guest users / fast reload
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", lang);
    }
  };

  // Show loading state while dictionary loads
  if (!dictionary || !isLoaded) {
    return null; // or <LoadingSpinner />
  }

  return (
    <LanguageContext.Provider
      value={{
        language: settings.language,
        setLanguage,
        isLoading: isUpdating || !isLoaded,
        t: dictionary
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
