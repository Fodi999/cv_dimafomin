/**
 * Settings API Client
 * 
 * Pure API layer - NO business logic
 * Single source of truth: backend
 */

import type { UserSettings, PartialSettings } from "@/lib/types/settings";

/**
 * Get current user settings from backend
 * 
 * @returns UserSettings object
 * @throws Error if request fails
 */
export async function getSettings(): Promise<UserSettings> {
  // Use Next.js API route to avoid CORS
  const response = await fetch("/api/settings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch settings: ${response.status}`);
  }

  const data = await response.json();
  
  // Handle new ApiResponse<SettingsResponse> format
  if (data.data) {
    return data.data as UserSettings;
  }
  
  return data as UserSettings;
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
  console.log(`🌐 [API] updateSettings called with:`, settings);
  
  // Use Next.js API route to avoid CORS
  const response = await fetch("/api/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(settings),
  });

  console.log(`🌐 [API] Response status: ${response.status}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ [API] Failed to update settings: ${response.status}`, errorText);
    throw new Error(`Failed to update settings: ${response.status}`);
  }

  const data = await response.json();
  console.log(`✅ [API] Settings updated successfully:`, data);
  
  // Handle new ApiResponse<SettingsResponse> format
  if (data.data) {
    return data.data as UserSettings;
  }
  
  return data as UserSettings;
}

