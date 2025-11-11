/**
 * API Client с автоматической подстановкой JWT токена
 * Отправляет Authorization: Bearer <token> во все запросы
 * 
 * Использует нормализованный URL через getApiUrl()
 * для предотвращения двойных /api в пути
 */

import { getToken } from '@/src/utils/auth';
import { getApiUrl } from '@/src/utils/api-url';

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  [key: string]: any;
}

interface FetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

/**
 * Универсальная функция для API запросов
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    headers = {},
    requiresAuth = true,
    ...fetchOptions
  } = options;

  // Использовать нормализованный URL (предотвращает /api/api/...)
  const url = getApiUrl(endpoint);
  
  // Подготавливаем заголовки
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Добавляем токен если требуется и он существует
  if (requiresAuth) {
    const token = getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    console.log(`[API] ${fetchOptions.method || 'GET'} ${endpoint}`);
    
    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    // Обрабатываем статус коды
    if (response.status === 401 || response.status === 403) {
      console.error(`[API] Unauthorized access (${response.status})`);
      // Очищаем токен и редиректим на логин
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
      console.error(`[API] Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // Парсим ответ
    const data = await response.json();
    console.log(`[API] Success:`, data);
    console.log(`[API] 🔍 Структура ответа:`, {
      hasData: 'data' in data,
      dataStructure: data.data ? Object.keys(data.data) : 'N/A',
      hasToken: 'token' in data,
      hasUser: 'user' in data,
      hasSuccess: 'success' in data,
    });
    
    return data as T;
  } catch (error) {
    console.error(`[API] Request failed:`, error);
    throw error;
  }
}

/**
 * GET запрос
 */
export async function apiGet<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST запрос
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options: FetchOptions = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT запрос
 */
export async function apiPut<T = any>(
  endpoint: string,
  body?: any,
  options: FetchOptions = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE запрос
 */
export async function apiDelete<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * PATCH запрос
 */
export async function apiPatch<T = any>(
  endpoint: string,
  body?: any,
  options: FetchOptions = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}
