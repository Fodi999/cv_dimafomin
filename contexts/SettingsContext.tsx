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
   * Load settings from backend
   * Falls back to localStorage if API fails
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
      if (!isAuthenticated || !token) {
        console.warn("⚠️ Cannot update settings - not authenticated");
        return;
      }

      // Optimistic update
      const previous = settings;
      const optimistic = { ...settings, ...partial };
      setSettings(optimistic);
      setIsUpdating(true);

      try {
        console.log("⚙️ Updating settings:", partial);
        const updated = await apiUpdateSettings(partial);
        
        setSettings(updated);
        
        // Update cache
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
        
        console.log("✅ Settings updated:", updated);
      } catch (error) {
        console.error("❌ Failed to update settings:", error);
        
        // Rollback on error
        setSettings(previous);
        
        // TODO: Show toast notification
        if (typeof window !== "undefined") {
          alert("Nie udało się zapisać ustawień. Spróbuj ponownie.");
        }
      } finally {
        setIsUpdating(false);
      }
    },
    [settings, isAuthenticated, token]
  );

  /**
   * Load settings on mount when user changes
   */
  useEffect(() => {
    if (isAuthenticated && !userIsLoading) {
      loadSettings();
    } else if (!isAuthenticated) {
      setSettings(DEFAULT_SETTINGS);
      setIsLoaded(true);
    }
  }, [isAuthenticated, userIsLoading, loadSettings]);

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
