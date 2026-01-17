/**
 * 🚀 ЕДИНЫЙ Proxy Helper для Next.js API Routes
 * 
 * ПРАВИЛА:
 * 1. Используется ТОЛЬКО в app/api/**​/route.ts
 * 2. НЕ содержит бизнес-логики
 * 3. Только проксирование + headers + error handling
 * 4. Все route.ts должны выглядеть одинаково
 * 
 * @see docs/API_STRUCTURE_MAP.md
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Generate unique request ID (UUID v4)
 */
function generateRequestId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get backend URL from environment
 * CRITICAL: Must be consistent across all API routes
 * RETURNS BASE URL WITHOUT /api - endpoints MUST include /api prefix
 */
export function getBackendUrl(): string {
  // ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ - БЕЗ /api на конце
  // Всегда используем Koyeb для стабильности
  return 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';
}

export interface ProxyOptions {
  /** Backend endpoint (e.g., "/admin/ingredients/suggest") */
  endpoint: string;
  
  /** HTTP method */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  
  /** Request body (for POST/PUT/PATCH) */
  body?: any;
  
  /** Additional headers */
  headers?: Record<string, string>;
  
  /** Request timeout in ms (default: 30000) */
  timeout?: number;
  
  /** Skip auth token (for public endpoints) */
  skipAuth?: boolean;
  
  /** Custom request ID (optional, auto-generated if not provided) */
  requestId?: string;
}

export interface ProxyResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string>;
    request_id?: string;
  };
  meta?: {
    request_id: string;
    backend_url: string;
    duration_ms: number;
  };
}

/**
 * 🎯 MAIN PROXY FUNCTION
 * 
 * Проксирует запрос на Go backend с правильными headers
 * 
 * @example
 * ```ts
 * export async function GET(request: NextRequest) {
 *   return proxyToBackend({
 *     endpoint: '/admin/ingredients/suggest',
 *     method: 'GET'
 *   });
 * }
 * ```
 */
export async function proxyToBackend<T = any>(
  request: NextRequest,
  options: ProxyOptions
): Promise<NextResponse<ProxyResponse<T>>> {
  const startTime = Date.now();
  const requestId = options.requestId || generateRequestId();
  
  try {
    // 1. Extract auth token from cookies (Next.js 15 syntax)
    let token: string | undefined;
    
    if (!options.skipAuth) {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value;
      
      console.log(`[Proxy] ${requestId} 🔑 Token from cookies:`, token ? `${token.substring(0, 20)}...` : 'MISSING');
      
      if (!token) {
        // Check Authorization header as fallback
        const authHeader = request.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.substring(7);
          console.log(`[Proxy] ${requestId} 🔑 Token from Authorization header:`, token ? `${token.substring(0, 20)}...` : 'MISSING');
        }
      }
      
      if (!token) {
        console.error(`[Proxy] ${requestId} ❌ No auth token found`);
        return NextResponse.json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            request_id: requestId
          }
        }, { status: 401 });
      }
    }
    
    // 2. Build backend URL
    const backendBase = getBackendUrl();
    
    // Extract query params from request URL
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const backendUrl = queryString 
      ? `${backendBase}${options.endpoint}?${queryString}`
      : `${backendBase}${options.endpoint}`;
    
    console.log(`[Proxy] ${requestId} → ${options.method || 'GET'} ${backendUrl}`);
    
    // 3. Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Request-ID': requestId,
      ...options.headers
    };
    
    // Add auth token if present
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add language header (from request or default)
    const language = request.headers.get('Accept-Language') || 'pl';
    headers['Accept-Language'] = language;
    
    // 4. Prepare fetch options
    const fetchOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
      cache: 'no-store'
    };
    
    // Add body for POST/PUT/PATCH
    // Priority: options.body > request.body (auto-read)
    if (['POST', 'PUT', 'PATCH'].includes(options.method || '')) {
      if (options.body) {
        // Explicit body provided in options
        fetchOptions.body = JSON.stringify(options.body);
      } else {
        // Try to read body from request
        try {
          const requestBody = await request.json();
          if (requestBody) {
            fetchOptions.body = JSON.stringify(requestBody);
          }
        } catch (e) {
          // No body or invalid JSON - continue without body
          console.warn(`[Proxy] ${requestId} Could not parse request body:`, e);
        }
      }
    }
    
    // 5. Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);
    fetchOptions.signal = controller.signal;
    
    // 6. Make request to backend
    const response = await fetch(backendUrl, fetchOptions);
    clearTimeout(timeoutId);
    
    const duration = Date.now() - startTime;
    console.log(`[Proxy] ${requestId} ← ${response.status} ${response.statusText} (${duration}ms)`);
    
    // 7. Parse response
    let responseData: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      responseData = await response.json();
      console.log(`[Proxy] ${requestId} 📦 Response data:`, JSON.stringify(responseData).substring(0, 200));
    } else {
      const text = await response.text();
      console.warn(`[Proxy] ${requestId} ⚠️ Non-JSON response:`, text.substring(0, 200));
      responseData = { message: text };
    }
    
    // 8. Handle errors
    if (!response.ok) {
      // Backend returned error with structured format
      if (responseData.error) {
        return NextResponse.json({
          success: false,
          code: responseData.error.code || responseData.code || 'BACKEND_ERROR', // Support top-level code
          message: responseData.error.message || responseData.message || 'Backend error',
          error: responseData.error.message || responseData.message, // Legacy field
          suggestions: responseData.suggestions, // Pass through conflict suggestions
          fields: responseData.error.fields,
          meta: {
            request_id: responseData.meta?.request_id || requestId,
            backend_url: backendUrl,
            duration_ms: duration
          }
        }, { status: response.status });
      }
      
      // Generic HTTP error (fallback)
      return NextResponse.json({
        success: false,
        code: responseData.code || 'HTTP_ERROR',
        message: responseData.message || `Backend returned ${response.status}: ${response.statusText}`,
        error: responseData.message || `Backend returned ${response.status}: ${response.statusText}`,
        suggestions: responseData.suggestions, // Pass through conflict suggestions
        meta: {
          request_id: requestId,
          backend_url: backendUrl,
          duration_ms: duration
        }
      }, { status: response.status });
    }
    
    // 9. Success response
    const successResponse = {
      success: true,
      data: responseData.data || responseData,
      meta: responseData.meta || {
        request_id: requestId,
        backend_url: backendUrl,
        duration_ms: duration
      }
    };
    
    return NextResponse.json(successResponse, { 
      status: 200,
      headers: {
        'X-Request-ID': requestId
      }
    });
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[Proxy] ${requestId} ✗ Error:`, error);
    
    // Timeout error
    if (error.name === 'AbortError') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'TIMEOUT',
          message: `Request timeout after ${options.timeout || 30000}ms`,
          request_id: requestId
        },
        meta: {
          request_id: requestId,
          backend_url: options.endpoint,
          duration_ms: duration
        }
      }, { status: 504 });
    }
    
    // Connection refused (backend not running)
    if (error.cause?.code === 'ECONNREFUSED') {
      const backendUrl = getBackendUrl();
      console.error(`[Proxy] ${requestId} ❌ Backend not available at ${backendUrl}`);
      
      // В production это критическая ошибка
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({
          success: false,
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: 'Backend service is temporarily unavailable. Please try again in a moment.',
            request_id: requestId
          },
          meta: {
            request_id: requestId,
            backend_url: backendUrl + options.endpoint,
            duration_ms: duration
          }
        }, { status: 503 });
      }
      
      // В development даем подсказку
      return NextResponse.json({
        success: false,
        error: {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Backend service is not available. Please ensure the backend server is running.',
          request_id: requestId
        },
        meta: {
          request_id: requestId,
          backend_url: backendUrl + options.endpoint,
          duration_ms: duration,
          hint: 'Start backend server or set NEXT_PUBLIC_API_BASE to production URL'
        }
      }, { status: 503 });
    }
    
    // Network error (other)
    return NextResponse.json({
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || 'Failed to connect to backend',
        request_id: requestId
      },
      meta: {
        request_id: requestId,
        backend_url: options.endpoint,
        duration_ms: duration
      }
    }, { status: 503 });
  }
}

/**
 * Simple proxy without request object (for standalone usage)
 */
export async function simpleProxy<T = any>(
  options: ProxyOptions & { token?: string }
): Promise<ProxyResponse<T>> {
  const startTime = Date.now();
  const requestId = options.requestId || generateRequestId();
  
  try {
    const backendBase = getBackendUrl();
    const backendUrl = `${backendBase}${options.endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Request-ID': requestId,
      ...options.headers
    };
    
    if (options.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }
    
    const fetchOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
      cache: 'no-store'
    };
    
    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }
    
    const response = await fetch(backendUrl, fetchOptions);
    const responseData = await response.json();
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || {
          code: 'HTTP_ERROR',
          message: `HTTP ${response.status}`,
          request_id: requestId
        },
        meta: {
          request_id: requestId,
          backend_url: backendUrl,
          duration_ms: duration
        }
      };
    }
    
    return {
      success: true,
      data: responseData.data || responseData,
      meta: {
        request_id: requestId,
        backend_url: backendUrl,
        duration_ms: duration
      }
    };
    
  } catch (error: any) {
    const duration = Date.now() - startTime;
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message,
        request_id: requestId
      },
      meta: {
        request_id: requestId,
        backend_url: options.endpoint,
        duration_ms: duration
      }
    };
  }
}
