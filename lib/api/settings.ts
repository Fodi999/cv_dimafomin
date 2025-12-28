/**
 * Settings API Client
 * 
 * Pure API layer - NO business logic
 * Single source of truth: backend
 */

import { apiFetch } from "./base";
import type { UserSettings, PartialSettings } from "@/lib/types/settings";

/**
 * Get current user settings from backend
 * 
 * @returns UserSettings object
 * @throws Error if request fails
 */
export async function getSettings(): Promise<UserSettings> {
  const response = await apiFetch<UserSettings>("/settings", {
    method: "GET"
  });
  
  return response;
}

/**
 * Update user settings (partial update)
 * 
 * Only sends changed fields to backend
 * 
 * @param settings - Partial settings object
 * @returns Updated UserSettings
 * @throws Error if request fails
 */
export async function updateSettings(
  settings: PartialSettings
): Promise<UserSettings> {
  const response = await apiFetch<UserSettings>("/settings", {
    method: "PATCH",
    body: JSON.stringify(settings)
  });
  
  return response;
}

