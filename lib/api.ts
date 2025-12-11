// API Configuration and Helper Functions
//
// CHANGELOG:
// - Renamed: market/ → marketplace/
// - Renamed: /ai/analyze → /ai/culinary/analyze
// - Renamed: /mentor/chat → /ai/chef-mentor
// - Changed: /user/{id}/purchases → /marketplace/my-purchases
// - Disabled: /auth/logout (temporarily stubbed)
// - Disabled: /auth/me (temporarily stubbed)
//

import type {
  ProfileData,
  DashboardData,
  RecipeData,
  CourseData,
  LeaderboardData,
  AuthResponse,
  UploadResponse,
} from "./types";

// API_BASE_URL теперь указывает на локальный Next.js сервер, который проксирует к Go бэкенду
const API_BASE_URL = "/api";

interface ApiOptions extends RequestInit {
  token?: string;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Generic API fetch wrapper with error handling
 */
async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
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

// ==================== AUTH API ====================

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    console.log("🔐 Attempting login with email:", email);
    try {
      const response = await apiFetch<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      console.log("✅ Login successful, response:", response);
      return response;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    console.log("📝 Attempting registration with email:", email);
    try {
      const response = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      console.log("✅ Registration successful, response:", response);
      return response;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  },

  // Temporarily disabled
  logout: async (token: string) => {
    // TODO: Implement logout endpoint on backend
    console.warn("Logout endpoint not implemented yet");
    return Promise.resolve({ success: true });
  },

  // Temporarily disabled
  getMe: async (token: string) => {
    // TODO: Implement getMe endpoint on backend
    console.warn("GetMe endpoint not implemented yet");
    return Promise.resolve(null);
  },
};

// ==================== ACADEMY API ====================

export const academyApi = {
  // Dashboard
  getDashboard: async (userId: string, token?: string): Promise<DashboardData> => {
    return apiFetch<DashboardData>(`/user/${userId}/dashboard`, { token });
  },

  // User Profile
  getProfile: async (userId: string, token?: string): Promise<ProfileData> => {
    return apiFetch<ProfileData>(`/user/profile`, { token });
  },

  updateProfile: async (userId: string, data: any, token: string): Promise<ProfileData> => {
    return apiFetch<ProfileData>(`/user/profile`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    });
  },

  // Recipe Posts (Community Feed)
  getAllPosts: async (filters?: {
    limit?: number;
    offset?: number;
    category?: string;
    difficulty?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.offset) params.append("offset", filters.offset.toString());
    if (filters?.category) params.append("category", filters.category);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    return apiFetch(`/posts?${params}`);
  },

  getUserPosts: async (userId: string, token?: string) => {
    return apiFetch(`/posts`, { token });
  },

  createPost: async (data: any, token: string) => {
    return apiFetch("/recipes", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  },

  // Courses
  getCourses: async (language = "pl", category?: string): Promise<CourseData[]> => {
    const params = new URLSearchParams();
    if (language) params.append("language", language);
    if (category) params.append("category", category);
    return apiFetch<CourseData[]>(`/academy/courses?${params}`);
  },

  getCourse: async (id: string): Promise<CourseData> => {
    return apiFetch<CourseData>(`/academy/courses/${id}`);
  },

  // Leaderboard
  getLeaderboard: async (sortBy = "xp", language = "pl", limit = 10): Promise<LeaderboardData> => {
    const params = new URLSearchParams();
    if (sortBy) params.append("sortBy", sortBy);
    if (language) params.append("language", language);
    if (limit) params.append("limit", limit.toString());
    return apiFetch<LeaderboardData>(`/leaderboard?${params}`);
  },

  // Certificates
  getCertificates: async (userId: string, token?: string) => {
    return apiFetch(`/user/${userId}/certificates`, { token });
  },

  generateCertificate: async (courseId: string, userId: string, token: string) => {
    return apiFetch(`/academy/certificate/${courseId}`, {
      method: "POST",
      token,
      body: JSON.stringify({ userId }),
    });
  },

  downloadCertificate: async (certificateId: string, token: string) => {
    return apiFetch(`/academy/certificates/${certificateId}/download`, { token });
  },
};

// ==================== MARKETPLACE API ====================

export const marketplaceApi = {
  // Recipes
  getRecipes: async (filters?: {
    category?: string;
    difficulty?: string;
    maxPrice?: number;
    minRating?: number;
    sortBy?: string;
  }): Promise<RecipeData[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.difficulty) params.append("difficulty", filters.difficulty);
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.minRating) params.append("minRating", filters.minRating.toString());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    return apiFetch<RecipeData[]>(`/marketplace/recipes?${params}`);
  },

  getRecipe: async (id: string): Promise<RecipeData> => {
    return apiFetch<RecipeData>(`/marketplace/recipes/${id}`);
  },

  // Purchase
  purchaseRecipe: async (recipeId: string, buyerId: string, token: string) => {
    return apiFetch("/marketplace/purchase", {
      method: "POST",
      token,
      body: JSON.stringify({ recipeId, buyerId }),
    });
  },

  // User's purchased recipes
  getPurchasedRecipes: async (userId: string, token: string): Promise<RecipeData[]> => {
    return apiFetch<RecipeData[]>(`/marketplace/my-purchases`, { token });
  },

  // Seller statistics
  getSellerStats: async (userId: string, token?: string) => {
    return apiFetch(`/marketplace/stats/${userId}`, { token });
  },
};

// ==================== AI API ====================

export const aiApi = {
  // Review recipe
  reviewRecipe: async (recipeId: string, language = "pl", token?: string) => {
    return apiFetch("/ai/review-recipe", {
      method: "POST",
      token,
      body: JSON.stringify({ recipeId, language }),
    });
  },

  // Critique recipe
  critiqueRecipe: async (recipeId: string, language = "pl", token?: string) => {
    return apiFetch("/ai/critique", {
      method: "POST",
      token,
      body: JSON.stringify({ recipeId, language }),
    });
  },

  // Analyze recipe
  analyzeRecipe: async (data: {
    title: string;
    ingredients: string[];
    steps: string[];
    language?: string;
  }, token?: string) => {
    return apiFetch("/ai/culinary/analyze", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  },

  // Estimate price
  estimatePrice: async (data: {
    ingredients: string[];
    servings: number;
    difficulty: string;
  }, token?: string) => {
    return apiFetch("/ai/estimate-price", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  },

  // Mentor chat
  mentorChat: async (userId: string, message: string, language = "pl", token?: string) => {
    return apiFetch("/ai/chef-mentor", {
      method: "POST",
      token,
      body: JSON.stringify({ userId, message, language }),
    });
  },

  // Get ingredient nutrition info
  getIngredientNutrition: async (ingredientName: string, weight?: number, token?: string) => {
    const params = new URLSearchParams();
    params.append("name", ingredientName);
    if (weight) params.append("weight", weight.toString());
    return apiFetch(`/ai/ingredient-nutrition?${params}`, { token });
  },

  // Generate recipe with AI
  generateRecipe: async (data: {
    title: string;
    language?: string;
    category?: string;
  }, token?: string) => {
    return apiFetch("/ai/recipe-helper", {
      method: "POST",
      token,
      body: JSON.stringify({
        title: data.title,
        language: data.language || "ua",
        category: data.category,
      }),
    });
  },
};

// ==================== IMAGE UPLOAD API ====================

export const uploadApi = {
  uploadImage: async (imageUrl: string, token?: string): Promise<UploadResponse> => {
    return apiFetch<UploadResponse>("/upload/image", {
      method: "POST",
      token,
      body: JSON.stringify({ imageUrl }),
    });
  },

  uploadImageFile: async (file: File, token?: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("image", file);
    
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  },
};

// ==================== WALLET API ====================

export const walletApi = {
  // Get wallet balance (updated endpoint)
  getBalance: async (userId: string, token: string) => {
    return apiFetch(`/token-bank/me`, { token });
  },

  // Get transaction history (updated endpoint)
  getTransactions: async (userId: string, token: string, filters?: {
    limit?: number;
    offset?: number;
    type?: 'earned' | 'spent' | 'bonus' | 'purchase';
  }) => {
    const params = new URLSearchParams();
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.offset) params.append("offset", filters.offset.toString());
    if (filters?.type) params.append("type", filters.type);
    return apiFetch(`/token-bank/me/transactions?${params}`, { token });
  },

  // Purchase tokens
  purchaseTokens: async (userId: string, amount: number, paymentMethod: string, token: string) => {
    return apiFetch("/wallet/purchase", {
      method: "POST",
      token,
      body: JSON.stringify({ userId, amount, paymentMethod }),
    });
  },

  // Spend tokens
  spendTokens: async (userId: string, amount: number, reason: string, token: string) => {
    return apiFetch("/wallet/spend", {
      method: "POST",
      token,
      body: JSON.stringify({ userId, amount, reason }),
    });
  },
};

// ==================== AI CHAT API ====================

export const aiChatApi = {
  // Send message to AI
  sendMessage: async (message: string, context?: any, token?: string) => {
    return apiFetch("/ai/chat", {
      method: "POST",
      token,
      body: JSON.stringify({ message, context }),
    });
  },
};

// ==================== TASKS API ====================

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

// ==================== CONTACT API ====================

export const contactApi = {
  sendMessage: async (data: {
    name: string;
    email: string;
    message: string;
  }) => {
    return apiFetch("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// ==================== FRIDGE API ====================

export const fridgeApi = {
  // Get all items in user's fridge
  getItems: async (token: string) => {
    try {
      return await apiFetch("/fridge", { token });
    } catch (err: any) {
      // If endpoint doesn't exist, return empty array
      if (err.status === 404) {
        console.warn("Fridge endpoint not available (404)");
        return [];
      }
      throw err;
    }
  },

  // Add new item to fridge
  addItem: async (data: {
    name: string;
    category: 'protein' | 'vegetable' | 'condiment' | 'other';
    quantity: string;
    expiryDate: string;
  }, token: string) => {
    return apiFetch("/fridge", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  },

  // Get available items (suggestions)
  getAvailable: async (token: string) => {
    try {
      return await apiFetch("/fridge/available", { token });
    } catch (err: any) {
      if (err.status === 404) {
        console.warn("Fridge available endpoint not available (404)");
        return [];
      }
      throw err;
    }
  },

  // Update fridge item
  updateItem: async (id: string, data: {
    name?: string;
    category?: 'protein' | 'vegetable' | 'condiment' | 'other';
    quantity?: string;
    expiryDate?: string;
  }, token: string) => {
    return apiFetch(`/fridge/${id}`, {
      method: "PUT",
      token,
      body: JSON.stringify(data),
    });
  },

  // Remove item from fridge
  deleteItem: async (id: string, token: string) => {
    return apiFetch(`/fridge/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

// ==================== HEALTH CHECK ====================

export const healthApi = {
  check: async () => {
    return apiFetch("/health");
  },
};

// ==================== USER API ====================

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

// ==================== ADMIN API ====================

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

// Export default API object
export default {
  auth: authApi,
  academy: academyApi,
  marketplace: marketplaceApi,
  market: marketplaceApi, // Backward compatibility alias
  ai: aiApi,
  aiChat: aiChatApi,
  upload: uploadApi,
  wallet: walletApi,
  tasks: tasksApi,
  fridge: fridgeApi,
  contact: contactApi,
  health: healthApi,
  user: userApi,
  admin: adminApi,
};
