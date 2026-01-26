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
import { LANGUAGE_STORAGE_KEY } from "@/lib/i18n/constants";

// Use Next.js proxy routes instead of direct backend calls
// All API calls go through /api/* routes which proxy to backend
export const API_BASE_URL = '/api';

export interface ApiOptions extends RequestInit {
  token?: string;
  language?: string;
}

// Re-export types for convenience
export type { ApiResponse, ApiError } from "./types";

/**
 * ✅ Get current language from localStorage
 * Single source of truth: localStorage[LANGUAGE_STORAGE_KEY]
 * LanguageContext writes to it, base.ts reads from it
 */
function getCurrentLanguage(): string {
  if (typeof window === "undefined") return "en"; // Default for SSR
  const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  console.log(`🌍 [base.ts] Reading language from localStorage["${LANGUAGE_STORAGE_KEY}"]: "${storedLang}"`);
  return storedLang || "en"; // Default to "en" if not set
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
      
      // Проверяем, что это JSON, а не HTML (например, 404 страница)
      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const looksLikeJson = responseText.trim().startsWith("{") || responseText.trim().startsWith("[");
      
      if (responseText.trim() && (isJson || looksLikeJson)) {
        try {
          error = JSON.parse(responseText);
        } catch (parseError) {
          // Если не удалось распарсить как JSON, создаем объект ошибки
          error = {
            code: "INVALID_JSON",
            message: `${response.status} ${response.statusText}`,
            details: { 
              responseText: responseText.substring(0, 200),
              parseError: parseError instanceof Error ? parseError.message : String(parseError)
            }
          };
        }
      } else {
        // HTML или другой не-JSON ответ (например, 404 страница)
        error = {
          code: "NON_JSON_RESPONSE",
          message: `${response.status} ${response.statusText}`,
          details: { 
            contentType,
            responseText: responseText.substring(0, 200),
            hint: "Backend returned non-JSON response (possibly HTML error page)"
          }
        };
      }
    } catch (e) {
      console.error(`⚠️ Failed to read error response:`, e);
      error = {
        code: "READ_ERROR",
        message: `${response.status} ${response.statusText}`,
        details: { 
          readError: e instanceof Error ? e.message : String(e)
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
    
    // 🔍 DEBUG: Check daysLeft in fridge items
    if (data.data && typeof data.data === 'object' && 'items' in data.data) {
      const items = (data.data as any).items;
      if (Array.isArray(items) && items.length > 0) {
        console.log('[API base.ts] 🔍 First item daysLeft:', items[0].daysLeft, '(type:', typeof items[0].daysLeft, ')');
        
        // 🔍 Check for items with null daysLeft RIGHT AFTER JSON PARSE
        const nullItems = items.filter((item: any) => item.daysLeft === null);
        console.log('[API base.ts] 🔍 Items with NULL daysLeft:', nullItems.length);
        if (nullItems.length > 0) {
          console.log('[API base.ts] 🔍 First null item:', nullItems[0].ingredient?.name, '→ daysLeft:', nullItems[0].daysLeft);
        }
      }
    }
    
    return data.data;
  }

  console.log(`✅ API Success (legacy format) - returning whole response`);
  return data as T;
}
