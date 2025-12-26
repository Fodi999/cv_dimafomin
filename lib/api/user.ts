import { API_BASE_URL, apiFetch } from './base';
import type { ProfileData, CourseData } from '../types';

export const userApi = {
  /**
   * GET /api/user/profile
   * Получить профиль текущего пользователя
   */
  getProfile: async (token: string): Promise<ProfileData> => {
    return apiFetch<ProfileData>("/user/profile", { token });
  },

  /**
   * PUT /api/user/profile
   * Обновить профиль пользователя
   */
  updateProfile: async (data: {
    name?: string;
    email?: string;
    bio?: string;
    location?: string;
    phone?: string;
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
    language?: string;
  }, token: string): Promise<ProfileData> => {
    return apiFetch<ProfileData>("/user/profile", {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    });
  },

  /**
   * POST /api/user/avatar
   * Загрузить аватар пользователя
   */
  uploadAvatar: async (file: File, token: string): Promise<{ url: string; size: number; uploadedAt: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${API_BASE_URL}/user/avatar`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let error: any;
      try {
        error = await response.json();
      } catch (e) {
        error = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      const err = new Error(error.message || error.error) as Error & { status: number };
      err.status = response.status;
      throw err;
    }

    return response.json();
  },

  /**
   * GET /api/user/settings
   * Получить настройки пользователя
   */
  getSettings: async (token: string): Promise<{
    language: string;
    theme: "light" | "dark" | "auto";
    notifications: Record<string, boolean>;
    privacy: Record<string, boolean>;
    preferences: Record<string, any>;
  }> => {
    return apiFetch("/user/settings", { token });
  },

  /**
   * PUT /api/user/settings
   * Обновить настройки пользователя
   */
  updateSettings: async (data: {
    language?: string;
    theme?: "light" | "dark" | "auto";
    notifications?: Record<string, boolean>;
    privacy?: Record<string, boolean>;
    preferences?: Record<string, any>;
  }, token: string): Promise<any> => {
    return apiFetch("/user/settings", {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    });
  },

  /**
   * GET /api/user/courses
   * Получить список пройденных и активных курсов пользователя
   */
  getCourses: async (token: string, filters?: {
    status?: "completed" | "in-progress" | "not-started";
    category?: string;
    sort?: "recent" | "progress" | "rating";
    limit?: number;
    offset?: number;
  }): Promise<{ courses: CourseData[]; total: number; page: number }> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.offset) params.append("offset", filters.offset.toString());

    return apiFetch(`/user/courses?${params}`, { token });
  },

  /**
   * GET /api/user/progress
   * Получить общий прогресс обучения пользователя
   */
  getProgress: async (token: string): Promise<{
    currentLevel: number;
    currentXp: number;
    xpToNextLevel: number;
    totalXp: number;
    coursesCompleted: number;
    coursesInProgress: number;
    lessonsCompleted: number;
    totalLessons: number;
    achievements: any[];
    streak: {
      current: number;
      longest: number;
      lastActivityDate: string;
    };
    recentActivity: any[];
  }> => {
    return apiFetch("/user/progress", { token });
  },

  /**
   * GET /api/user/stats
   * Получить личную статистику пользователя
   */
  getStats: async (token: string): Promise<{
    posts: {
      total: number;
      thisMonth: number;
      thisWeek: number;
      avgLikes: number;
      avgComments: number;
    };
    followers: {
      total: number;
      thisMonth: number;
    };
    following: number;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
      views: number;
    };
    recipes: {
      published: number;
      sold: number;
      totalEarnings: number;
      avgRating: number;
      reviews: number;
    };
    studyTime: {
      thisWeek: number;
      thisMonth: number;
      total: number;
      avgPerDay: number;
    };
    completionRate: number;
  }> => {
    return apiFetch("/user/stats", { token });
  },

  /**
   * GET /api/user/tokens
   * Получить информацию о Chef токенах пользователя
   */
  getTokens: async (token: string, filters?: {
    limit?: number;
    offset?: number;
    type?: "earned" | "spent" | "bonus" | "purchase" | "refund";
  }): Promise<{
    balance: number;
    earned: number;
    spent: number;
    available: number;
    transactions: any[];
    nextResetDate?: string;
    monthlyLimit?: number;
    monthlyUsed?: number;
  }> => {
    const params = new URLSearchParams();
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.offset) params.append("offset", filters.offset.toString());
    if (filters?.type) params.append("type", filters.type);

    return apiFetch(`/user/tokens?${params}`, { token });
  },

  /**
   * GET /api/user/wallet
   * Получить информацию о кошельке и способах оплаты
   */
  getWallet: async (token: string, options?: {
    include_purchases?: boolean;
    include_subscriptions?: boolean;
    limit?: number;
  }): Promise<{
    chefTokens: {
      balance: number;
      currency: string;
    };
    paymentMethods: any[];
    purchases: any[];
    subscriptions?: any[];
    totalSpent: number;
    totalEarnings: number;
    nextPaymentDate?: string;
  }> => {
    const params = new URLSearchParams();
    if (options?.include_purchases !== undefined) params.append("include_purchases", options.include_purchases.toString());
    if (options?.include_subscriptions !== undefined) params.append("include_subscriptions", options.include_subscriptions.toString());
    if (options?.limit) params.append("limit", options.limit.toString());

    return apiFetch(`/user/wallet?${params}`, { token });
  },

  /**
   * GET /api/users/{userId}
   * Получить публичный профиль конкретного пользователя
   */
  getUserProfile: async (userId: string, token?: string | null) => {
    const actualToken = token || undefined;
    return apiFetch<ProfileData>(`/users/${userId}`, { 
      ...(actualToken && { token: actualToken }) 
    });
  },
};
