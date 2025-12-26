import { apiFetch } from './base';

export const tasksApi = {
  // Get all tasks for current user
  getTasks: async (token: string, filters?: {
    status?: 'available' | 'pending' | 'completed';
    category?: 'daily' | 'weekly' | 'special' | 'learning' | 'social' | 'achievements';
  }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    return apiFetch(`/tasks?${params}`, { token });
  },

  // Submit task completion
  submitTask: async (taskId: string, proof?: any, token?: string) => {
    return apiFetch(`/tasks/${taskId}/submit`, {
      method: "POST",
      token,
      body: JSON.stringify({ proof }),
    });
  },

  // Get user's task history
  getUserTasks: async (userId: string, token: string) => {
    return apiFetch(`/tasks/user/${userId}`, { token });
  },
};
