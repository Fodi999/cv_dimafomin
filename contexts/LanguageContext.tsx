"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, Dictionary } from '@/lib/i18n/types';
import { 
  DEFAULT_LANGUAGE, 
  LANGUAGE_COOKIE_KEY, 
  LANGUAGE_STORAGE_KEY,
  LANGUAGE_COOKIE_MAX_AGE 
} from '@/lib/i18n/constants';
import { getDictionary } from '@/lib/i18n/getDictionary';

export type Locale = Language;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  initialLanguage = DEFAULT_LANGUAGE,
  dictionary: initialDictionary,
  children 
}: { 
  initialLanguage?: Language;
  dictionary?: Dictionary;
  children: React.ReactNode;
}) {
  const [language] = useState<Language>(initialLanguage);
  const [dictionary, setDictionary] = useState<Dictionary | null>(initialDictionary || null);
  const [isLoading, setIsLoading] = useState(!initialDictionary);

  useEffect(() => {
    if (!dictionary) {
      let mounted = true;

      async function loadDictionary() {
        try {
          setIsLoading(true);
          const dict = await getDictionary(language);
          if (mounted) {
            setDictionary(dict);
          }
        } catch (error) {
          console.error("Failed to load dictionary:", error);
          const fallbackDict = await getDictionary(DEFAULT_LANGUAGE);
          if (mounted) {
            setDictionary(fallbackDict);
          }
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      }

      loadDictionary();

      return () => {
        mounted = false;
      };
    }
  }, [language, dictionary]);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    
    document.cookie = `${LANGUAGE_COOKIE_KEY}=${lang}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; samesite=lax`;
    
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
    
    window.location.reload();
  };

  if (!dictionary) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isLoading,
        t: dictionary
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
