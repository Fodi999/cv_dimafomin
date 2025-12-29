/**
 * Base API configuration and fetch wrapper
 */

import {
  isApiResponse,
  isApiError,
} from "./types";
import type {
  ApiResponse,
  ApiError,
} from "./types";

// Use backend API URL from environment variable, fallback to Next.js routes
// IMPORTANT: Always use backend API for data endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE
  ? `${process.env.NEXT_PUBLIC_API_BASE}/api`
  : "/api";

export interface ApiOptions extends RequestInit {
  token?: string;
  language?: string;
}

// Re-export types for convenience
export type { ApiResponse, ApiError } from "./types";

/**
 * Get current language from localStorage
 */
function getCurrentLanguage(): string {
  if (typeof window === "undefined") return "pl";
  return localStorage.getItem("preferred-language") || "pl";
}

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Generic API fetch wrapper with error handling
 * Supports new ApiResponse<T> format with backwards compatibility
 */
export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, language, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": language || getCurrentLanguage(),
    ...(fetchOptions.headers as Record<string, string>),
  };

  const authToken = token || getAuthToken();
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`📡 API Call: ${fetchOptions.method || 'GET'} ${url}`);
  
  if (fetchOptions.body) {
    console.log(`� Request body:`, fetchOptions.body);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include',
    cache: 'no-store',
  });

  console.log(`📥 Response status: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    let error: any;
    let responseText = "";
    
    try {
      responseText = await response.text();
      error = JSON.parse(responseText);
    } catch (e) {
      error = {
        code: "PARSE_ERROR",
        message: `Failed to parse error response: ${response.statusText}`,
        details: { responseText: responseText.substring(0, 200) }
      };
    }

    if (isApiError(error)) {
      console.error(`❌ API Error [${error.code}]:`, error.message);
      if (error.fields) {
        console.error(`📋 Field errors:`, error.fields);
      }
      throw new Error(error.message);
    }
    
    const errorMessage = error.message || error.error || `HTTP ${response.status}`;
    console.error(`❌ HTTP ${response.status}:`, errorMessage);
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (isApiResponse<T>(data)) {
    console.log(`✅ API Success (new format):`, data.meta);
    return data.data;
  }

  console.log(`✅ API Success (legacy format)`);
  return data as T;
}
