/**
 * User Settings - Single Source of Truth
 * 
 * CRITICAL: All settings types defined here
 * NO duplicates in UI components or contexts
 */

// Language
export type Language = "pl" | "en" | "ru";

// Time format
export type TimeFormat = "12h" | "24h";

// Measurement units
export type Units = "metric" | "kitchen";

// AI Style
export type AIStyle = "calm" | "professional" | "demanding";

/**
 * Complete user settings object
 * Backend is the source of truth
 */
export interface UserSettings {
  // Core settings
  language: Language;
  timeFormat: TimeFormat;
  units: Units;
  
  // AI preferences
  aiStyle: AIStyle;
  
  // Optional metadata
  updatedAt?: string;
}

/**
 * Partial settings for updates
 * Only changed fields are sent to backend
 */
export type PartialSettings = Partial<UserSettings>;

/**
 * Default settings for new users / fallback
 */
export const DEFAULT_SETTINGS: UserSettings = {
  language: "pl",
  timeFormat: "24h",
  units: "metric",
  aiStyle: "professional"
};

/**
 * Type guards
 */
export function isValidLanguage(lang: string): lang is Language {
  return ["pl", "en", "ru"].includes(lang);
}

export function isValidTimeFormat(format: string): format is TimeFormat {
  return ["12h", "24h"].includes(format);
}

export function isValidUnits(units: string): units is Units {
  return ["metric", "kitchen"].includes(units);
}

export function isValidAIStyle(style: string): style is AIStyle {
  return ["calm", "professional", "demanding"].includes(style);
}
