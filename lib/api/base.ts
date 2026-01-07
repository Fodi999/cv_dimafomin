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
export const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/api'
  : 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api';

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
    console.log(`🔑 Auth token present: ${authToken.substring(0, 20)}...`);
  } else {
    console.warn(`⚠️ No auth token available`);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`📡 API Call: ${fetchOptions.method || 'GET'} ${url}`);
  console.log(`📋 Headers:`, { ...headers, Authorization: headers.Authorization ? `Bearer ${headers.Authorization.substring(7, 27)}...` : 'none' });
  
  if (fetchOptions.body) {
    console.log(`📦 Request body:`, fetchOptions.body);
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
      console.log(`📥 Error response text:`, responseText.substring(0, 500));
      
      if (responseText.trim()) {
        error = JSON.parse(responseText);
      } else {
        error = {
          code: "NO_RESPONSE",
          message: `${response.status} ${response.statusText}`,
        };
      }
    } catch (e) {
      console.error(`⚠️ Failed to parse error response:`, e);
      error = {
        code: "PARSE_ERROR",
        message: `${response.status} ${response.statusText}`,
        details: { 
          responseText: responseText.substring(0, 200),
          parseError: e instanceof Error ? e.message : String(e)
        }
      };
    }

    if (isApiError(error)) {
      console.error(`❌ API Error [${error.code}]:`, error.message);
      if (error.fields) {
        console.error(`📋 Field errors:`, error.fields);
      }
      // Создаём объект ошибки с сохранением статуса и кода
      const apiError: any = new Error(error.message);
      apiError.status = response.status;
      apiError.statusCode = response.status;
      apiError.code = error.code;
      apiError.fields = error.fields;
      throw apiError;
    }
    
    const errorMessage = error.message || error.error || `HTTP ${response.status}: ${response.statusText}`;
    console.error(`❌ HTTP ${response.status}:`, errorMessage);
    // Создаём объект ошибки с сохранением статуса
    const httpError: any = new Error(errorMessage);
    httpError.status = response.status;
    httpError.statusCode = response.status;
    throw httpError;
  }

  const data = await response.json();
  console.log(`📦 Raw response data:`, data);

  if (isApiResponse<T>(data)) {
    console.log(`✅ API Success (new format) - returning data:`, data.data);
    return data.data;
  }

  console.log(`✅ API Success (legacy format) - returning whole response`);
  return data as T;
}
