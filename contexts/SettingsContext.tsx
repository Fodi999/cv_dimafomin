/**
 * Settings Context - Single Source of Truth
 * 
 * CRITICAL: Backend is the source of truth
 * localStorage only for fallback / cache
 */

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSettings, updateSettings as apiUpdateSettings } from "@/lib/api/settings";
import { DEFAULT_SETTINGS, type UserSettings, type PartialSettings } from "@/lib/types/settings";
import { useAuth } from "./AuthContext";
import { useUser } from "./UserContext";
import { LANGUAGE_COOKIE_KEY, LANGUAGE_COOKIE_MAX_AGE } from "@/lib/i18n/constants";

interface SettingsContextType {
  settings: UserSettings;
  isLoaded: boolean;
  isUpdating: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (partial: PartialSettings) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = "user-settings-cache";

/**
 * Settings Provider
 * 
 * Loads settings on mount if user is authenticated
 * Provides updateSettings with optimistic updates
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const { isLoading: userIsLoading } = useUser();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Load settings from backend and sync with cookie
   * 
   * 🔥 КРИТИЧНО: Backend = источник истины
   * Если backend.language !== cookie → обновить cookie
   */
  const loadSettings = useCallback(async () => {
    if (!isAuthenticated || !token) {
      console.log("⚙️ No user - using defaults");
      setSettings(DEFAULT_SETTINGS);
      setIsLoaded(true);
      return;
    }

    // ✅ КРИТИЧНО: Ждём пока UserContext загрузит профиль
    if (userIsLoading) {
      console.log("⚙️ Waiting for user profile to load...");
      return;
    }

    try {
      console.log("⚙️ Loading settings from backend...");
      const data = await getSettings();
      
      setSettings(data);
      setIsLoaded(true);
      
      // Cache to localStorage for offline/fast reload
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      
      console.log("✅ Settings loaded:", data);
      
      // 🔥 Sync language with cookie (backend is source of truth)
      if (typeof window !== "undefined" && data.language) {
        const currentCookieLang = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${LANGUAGE_COOKIE_KEY}=`))
          ?.split("=")[1];
        
        if (currentCookieLang !== data.language) {
          console.log(`🔄 Language mismatch: cookie="${currentCookieLang}", backend="${data.language}"`);
          console.log(`🔄 Updating cookie to match backend: ${data.language}`);
          
          // Update cookie to match backend
          document.cookie = `${LANGUAGE_COOKIE_KEY}=${data.language}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}; samesite=lax`;
          
          // Reload page to apply new language
          console.log("🔄 Reloading page with correct language...");
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("❌ Failed to load settings:", error);
      
      // Fallback to localStorage cache
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setSettings(parsed);
            console.log("📦 Using cached settings");
          } catch {
            setSettings(DEFAULT_SETTINGS);
          }
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
      
      setIsLoaded(true);
    }
  }, [isAuthenticated, token, userIsLoading]);

  /**
   * Update settings with optimistic update
   * 
   * @param partial - Changed settings
   */
  const updateSettings = useCallback(
    async (partial: PartialSettings) => {
      console.log(`🔧 [SettingsContext] updateSettings called with:`, partial);
      console.log(`🔧 [SettingsContext] isAuthenticated: ${isAuthenticated}, token: ${!!token}`);
      
      if (!isAuthenticated || !token) {
        console.warn("⚠️ Cannot update settings - not authenticated");
        return;
      }

      // Optimistic update
      const previous = settings;
      const optimistic = { ...settings, ...partial };
      setSettings(optimistic);
      setIsUpdating(true);
      
      console.log(`🔄 [SettingsContext] Optimistic update applied:`, optimistic);

      try {
        console.log("⚙️ Updating settings (sending FULL object):", optimistic);
        
        // ✅ КРИТИЧНО: Отправляем ВСЕ настройки, а не только partial
        // Backend требует полный объект для валидации
        const updated = await apiUpdateSettings(optimistic);
        
        setSettings(updated);
        
        // Update cache
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
        
        console.log("✅ Settings updated:", updated);
      } catch (error) {
        console.error("❌ Failed to update settings:", error);
        console.error("❌ Error details:", JSON.stringify(error, null, 2));
        
        // Rollback on error
        setSettings(previous);
        
        // Show error to user (non-blocking)
        if (typeof window !== "undefined") {
          console.error("🚨 ERROR: Nie udało się zapisać ustawień. Spróbuj ponownie.");
          // alert("Nie udało się zapisać ustawień. Spróbuj ponownie."); // Временно отключено для дебага
        }
      } finally {
        setIsUpdating(false);
      }
    },
    [settings, isAuthenticated, token]
  );

  /**
   * Load settings on mount when user changes
   * 
   * ✅ Fixed: removed loadSettings from deps to prevent infinite loop
   */
  useEffect(() => {
    if (isAuthenticated && !userIsLoading && !isLoaded) {
      loadSettings();
    } else if (!isAuthenticated) {
      setSettings(DEFAULT_SETTINGS);
      setIsLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userIsLoading]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoaded,
        isUpdating,
        loadSettings,
        updateSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * Hook to access settings
 * 
 * @throws Error if used outside SettingsProvider
 */
export function useSettings() {
  const context = useContext(SettingsContext);
  
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  
  return context;
}
