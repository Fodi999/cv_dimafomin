import { apiFetch } from './base';

export const adminApi = {
  // ===== USERS ENDPOINTS =====
  
  /**
   * GET /api/admin/users
   * Получить всех пользователей
   */
  getUsers: async (token: string) => {
    return apiFetch("/admin/users", { token });
  },

  /**
   * PUT /api/admin/users/{id}
   * Обновить пользователя
   */
  updateUser: async (id: string, data: any, token: string) => {
    return apiFetch(`/admin/users/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE /api/admin/users/{id}
   * Удалить пользователя
   */
  deleteUser: async (id: string, token: string) => {
    return apiFetch(`/admin/users/${id}`, {
      method: "DELETE",
      token,
    });
  },

  /**
   * PATCH /api/admin/users/update-role
   * Обновить роль пользователя
   */
  updateUserRole: async (userId: string, role: string, token: string) => {
    return apiFetch("/admin/users/update-role", {
      method: "PATCH",
      token,
      body: JSON.stringify({ userId, role }),
    });
  },

  // ===== ORDERS ENDPOINTS =====

  /**
   * GET /api/admin/orders
   * Получить все заказы
   */
  getOrders: async (token: string) => {
    return apiFetch("/admin/orders", { token });
  },

  /**
   * GET /api/admin/orders/recent
   * Получить 10 последних заказов
   */
  getRecentOrders: async (token: string) => {
    return apiFetch("/admin/orders/recent", { token });
  },

  /**
   * PUT /api/admin/orders/{id}/status
   * Обновить статус заказа
   */
  updateOrderStatus: async (orderId: string, status: string, token: string) => {
    return apiFetch(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      token,
      body: JSON.stringify({ status }),
    });
  },

  // ===== STATS ENDPOINT =====

  /**
   * GET /api/admin/stats
   * Получить статистику
   */
  getStats: async (token: string) => {
    return apiFetch("/admin/stats", { token });
  },

  // ===== TOKEN BANK ENDPOINTS =====
  
  /**
   * GET /api/admin/token-bank
   * Получить все token banks пользователей
   */
  getTokenBanks: async (token?: string) => {
    return apiFetch("/admin/token-bank", { token });
  },

  /**
   * POST /api/admin/token-bank/allocate
   * Выделить токены пользователю
   */
  allocateTokens: async (userId: string, amount: number, reason: string, token?: string) => {
    return apiFetch("/admin/token-bank/allocate", {
      method: "POST",
      token,
      body: JSON.stringify({ userId, amount, reason }),
    });
  },

  /**
   * GET /api/admin/token-bank/treasury
   * Получить баланс казначейства
   */
  getTreasuryBalance: async (token: string) => {
    return apiFetch("/admin/token-bank/treasury", { token });
  },

  /**
   * GET /api/admin/treasury/stats
   * Получить детальную статистику казначейства
   */
  getTreasuryStats: async (token: string) => {
    return apiFetch("/admin/treasury/stats", { token });
  },

  // ===== TASKS MANAGEMENT ENDPOINTS =====

  /**
   * POST /api/admin/tasks
   * Создать новое задание
   */
  createTask: async (taskData: {
    title: string;
    description: string;
    reward: number;
    category: string;
    duration?: string;
    requirements?: string[];
  }, token: string) => {
    return apiFetch("/admin/tasks", {
      method: "POST",
      token,
      body: JSON.stringify(taskData),
    });
  },

  /**
   * POST /api/admin/tasks/{taskId}/approve
   * Подтвердить выполнение задания
   */
  approveTask: async (taskId: string, userId: string, token: string) => {
    return apiFetch(`/admin/tasks/${taskId}/approve`, {
      method: "POST",
      token,
      body: JSON.stringify({ userId }),
    });
  },

  /**
   * GET /api/admin/tasks
   * Получить все задания
   */
  getAdminTasks: async (token: string, filters?: {
    status?: string;
    category?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    return apiFetch(`/admin/tasks?${params}`, { token });
  },

  /**
   * GET /api/admin/tasks/pending
   * Получить задания ожидающие одобрения
   */
  getPendingApprovals: async (token: string) => {
    return apiFetch("/admin/tasks/pending", { token });
  },
};
