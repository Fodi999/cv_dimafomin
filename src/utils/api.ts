/**
 * API клиент с автоматической подстановкой JWT токена
 */

import type { ApiErrorResponse, LoginResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Получить токен из localStorage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Получить заголовки с авторизацией
   */
  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Основной метод для API запросов
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit & { method?: string; headers?: Record<string, string> } = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const method = options.method || 'GET';

    const config: RequestInit = {
      ...options,
      method,
      headers: this.getHeaders(options.headers || {}),
    };

    try {
      const response = await fetch(url, config);

      // Если ответ не OK, пытаемся распарсить ошибку
      if (!response.ok) {
        let errorData: ApiErrorResponse;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            error: `HTTP ${response.status}`,
            message: response.statusText,
            status: response.status,
          };
        }

        // Если 401 - очищаем токен (неавторизованный доступ)
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }

        const error = new Error(errorData.message || errorData.error) as Error & { status?: number };
        error.status = response.status;
        throw error;
      }

      // Пустой ответ (204 No Content)
      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * GET запрос
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  /**
   * POST запрос
   */
  async post<T>(
    endpoint: string,
    body?: Record<string, any>,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  /**
   * PUT запрос
   */
  async put<T>(
    endpoint: string,
    body?: Record<string, any>,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  /**
   * DELETE запрос
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }

  /**
   * PATCH запрос
   */
  async patch<T>(
    endpoint: string,
    body?: Record<string, any>,
    headers?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }
}

/**
 * Синглтон экземпляр API клиента
 */
export const api = new ApiClient();

/**
 * Утилита для логина (публичный доступ)
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/api/login', {
    email,
    password,
  });

  // Сохраняем токен и роль
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('role', response.role);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  }

  return response;
}

/**
 * Утилита для логаута
 */
export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
}

/**
 * Получить роль из localStorage
 */
export function getStoredRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('role');
}

/**
 * Получить токен из localStorage
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}
