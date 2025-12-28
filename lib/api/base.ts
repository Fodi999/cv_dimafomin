/**
 * Base API configuration and fetch wrapper
 */

export const API_BASE_URL = "/api";

export interface ApiOptions extends RequestInit {
  token?: string;
  language?: string; // Add language support
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Get current language from localStorage (fallback for when context is not available)
 */
function getCurrentLanguage(): string {
  if (typeof window === "undefined") return "pl";
  return localStorage.getItem("preferred-language") || "pl";
}

/**
 * Get auth token from localStorage (fallback for when context is not available)
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token"); // ✅ Правильний ключ
}

/**
 * Generic API fetch wrapper with error handling
 * Automatically adds Authorization and Accept-Language headers
 */
export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, language, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": language || getCurrentLanguage(), // Always send language
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Auto-add token from localStorage if not provided
  const authToken = token || getAuthToken();
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`📡 API Call: ${fetchOptions.method || 'GET'} ${url}`);
  
  // Log request body for POST/PUT requests
  if (fetchOptions.body) {
    console.log(`📤 Request body:`, fetchOptions.body);
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include', // 🍪 Send cookies with request for cookie-based auth
    // Add cache: 'no-store' to avoid caching 404 responses
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
      // Response is not JSON (e.g., HTML error page)
      error = {
        message: `HTTP ${response.status}: ${response.statusText}`,
        body: responseText || "No response body",
      };
    }
    
    // Extract error message from nested 'data' field if present
    let errorMessage = error.message || error.error || error.data?.message || error.data?.error || `HTTP ${response.status}`;
    
    // Log detailed error info
    console.error(`❌ API Error ${response.status}:`, {
      endpoint,
      method: fetchOptions.method || 'GET',
      status: response.status,
      message: errorMessage,
      fullError: error,
    });
    
    // Create error with status code
    const err = new Error(errorMessage) as Error & { status: number };
    err.status = response.status;
    throw err;
  }

  let result: any;
  try {
    result = await response.json();
  } catch (e) {
    // Response is not JSON - this shouldn't happen for successful responses
    console.error("Failed to parse response as JSON:", e);
    throw new Error("Invalid JSON response from server");
  }
  
  console.log(`✅ Response data:`, result);
  
  // Handle backend response format: { success: true, data: {...} }
  if (result.data !== undefined) {
    return result.data as T;
  }
  
  return result as T;
}
