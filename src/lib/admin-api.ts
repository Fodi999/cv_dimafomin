/**
 * @deprecated LEGACY CODE - Use @/lib/api/admin instead
 * TODO: Migrate app/admin/token-bank/page.tsx to use @/lib/api/admin
 * 
 * Admin API Client
 * Клиент для работы с админ-панелью
 */

import { getToken } from '@/src/utils/auth';
import { getApiUrl } from '@/src/utils/api-url';

interface AdminUser {
  id: string;
  name?: string;
  email?: string;
  role?: 'student' | 'instructor' | 'admin';
  level?: number;
  xp?: number;
  chefTokens?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  newUsersThisMonth: number;
  ordersThisMonth: number;
}

interface AdminOrder {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  items?: any[];
}

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

/**
 * Fetch helper с автоматической подстановкой токена
 */
async function adminFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const url = getApiUrl(endpoint);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log(`[AdminAPI] ${options.method || 'GET'} ${endpoint}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      console.error('[AdminAPI] Unauthorized');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('[AdminAPI] Error:', error);
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log(`[AdminAPI] Success (${endpoint}):`, data);
    return data;
  } catch (error) {
    console.error(`[AdminAPI] Request failed:`, error);
    throw error;
  }
}

/**
 * Admin API Methods
 */
export const adminApi = {
  /**
   * Получить профиль администратора
   */
  async getProfile(): Promise<AdminProfile> {
    const response = await adminFetch<{ data: AdminProfile }>(
      '/api/admin/profile'
    );
    return response.data || response;
  },

  /**
   * Получить статистику системы
   */
  async getStats(): Promise<AdminStats> {
    const response = await adminFetch<{ data: AdminStats }>(
      '/api/admin/stats'
    );
    return response.data || response;
  },

  /**
   * Получить всех пользователей
   */
  async getUsers(): Promise<AdminUser[]> {
    const response = await adminFetch<{ data: AdminUser[] }>(
      '/api/admin/users'
    );
    return response.data || response;
  },

  /**
   * Обновить пользователя
   */
  async updateUser(
    userId: string,
    data: Partial<AdminUser>
  ): Promise<AdminUser> {
    const response = await adminFetch<{ data: AdminUser }>(
      `/api/admin/users/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return response.data || response;
  },

  /**
   * Обновить роль пользователя
   */
  async updateUserRole(
    userId: string,
    role: 'student' | 'instructor' | 'admin'
  ): Promise<{ message: string }> {
    return adminFetch<{ message: string }>(
      '/api/admin/users/update-role',
      {
        method: 'PATCH',
        body: JSON.stringify({ user_id: userId, role }),
      }
    );
  },

  /**
   * Удалить пользователя
   */
  async deleteUser(userId: string): Promise<{ message: string }> {
    return adminFetch<{ message: string }>(
      `/api/admin/users/${userId}`,
      {
        method: 'DELETE',
      }
    );
  },

  /**
   * Получить все заказы
   */
  async getOrders(): Promise<AdminOrder[]> {
    const response = await adminFetch<{ data: AdminOrder[] }>(
      '/api/admin/orders'
    );
    return response.data || response;
  },

  /**
   * Получить последние 10 заказов
   */
  async getRecentOrders(): Promise<AdminOrder[]> {
    const response = await adminFetch<{ data: AdminOrder[] }>(
      '/api/admin/orders/recent'
    );
    return response.data || response;
  },

  /**
   * Обновить статус заказа
   */
  async updateOrderStatus(
    orderId: string,
    status: 'pending' | 'completed' | 'cancelled'
  ): Promise<{ message: string }> {
    return adminFetch<{ message: string }>(
      `/api/admin/orders/${orderId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );
  },

  /**
   * Получить все токин-банки
   */
  async getTokenBanks(): Promise<any[]> {
    const response = await adminFetch<{ data: any[] }>(
      '/api/admin/token-bank'
    );
    return response.data || response;
  },

  /**
   * Получить статистику токинов
   */
  async getTokenStats(): Promise<any> {
    const response = await adminFetch<{ data: any }>(
      '/api/admin/token-bank/stats'
    );
    return response.data || response;
  },

  /**
   * Получить токин-банк пользователя
   */
  async getUserTokenBank(userId: string): Promise<any> {
    const response = await adminFetch<{ data: any }>(
      `/api/admin/token-bank/${userId}`
    );
    return response.data || response;
  },

  /**
   * Выделить токины пользователю
   */
  async allocateTokens(
    userId: string,
    amount: number,
    reason: string
  ): Promise<{ message: string }> {
    return adminFetch<{ message: string }>(
      '/api/admin/token-bank/allocate',
      {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, amount, reason }),
      }
    );
  },

  /**
   * Отозвать токины у пользователя
   */
  async revokeTokens(
    userId: string,
    amount: number,
    reason: string
  ): Promise<{ message: string }> {
    return adminFetch<{ message: string }>(
      '/api/admin/token-bank/revoke',
      {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, amount, reason }),
      }
    );
  },

  /**
   * Установить баланс токинов
   */
  async setTokenBalance(
    userId: string,
    balance: number
  ): Promise<{ message: string }> {
    return adminFetch<{ message: string }>(
      '/api/admin/token-bank/balance',
      {
        method: 'PUT',
        body: JSON.stringify({ user_id: userId, balance }),
      }
    );
  },
};
