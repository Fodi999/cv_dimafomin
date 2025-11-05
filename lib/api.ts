// API Configuration and Helper Functions

import type {
  ProfileData,
  DashboardData,
  RecipeData,
  CourseData,
  LeaderboardData,
  AuthResponse,
  UploadResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api";

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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    // Add cache: 'no-store' to avoid caching 404 responses
    cache: 'no-store',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }));
    
    // Only throw on non-404 errors or include status in error
    const errorMessage = error.message || error.error || `HTTP ${response.status}`;
    const err = new Error(errorMessage) as Error & { status: number };
    err.status = response.status;
    throw err;
  }

  const result = await response.json();
  
  // Handle backend response format: { success: true, data: {...} }
  if (result.data !== undefined) {
    return result.data as T;
  }
  
  return result as T;
}

// ==================== AUTH API ====================

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  logout: async (token: string) => {
    return apiFetch("/auth/logout", {
      method: "POST",
      token,
    });
  },

  getMe: async (token: string) => {
    return apiFetch("/auth/me", { token });
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
    return apiFetch<ProfileData>(`/user/${userId}/profile`, { token });
  },

  updateProfile: async (userId: string, data: any, token: string): Promise<ProfileData> => {
    return apiFetch<ProfileData>(`/user/${userId}/profile`, {
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
    return apiFetch(`/user/${userId}/posts`, { token });
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

// ==================== MARKET API ====================

export const marketApi = {
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
    return apiFetch<RecipeData[]>(`/market/recipes?${params}`);
  },

  getRecipe: async (id: string): Promise<RecipeData> => {
    return apiFetch<RecipeData>(`/market/recipes/${id}`);
  },

  // Purchase
  purchaseRecipe: async (recipeId: string, buyerId: string, token: string) => {
    return apiFetch("/market/purchase", {
      method: "POST",
      token,
      body: JSON.stringify({ recipeId, buyerId }),
    });
  },

  // User's purchased recipes
  getPurchasedRecipes: async (userId: string, token: string): Promise<RecipeData[]> => {
    return apiFetch<RecipeData[]>(`/user/${userId}/purchases`, { token });
  },

  // Seller statistics
  getSellerStats: async (userId: string, token?: string) => {
    return apiFetch(`/market/stats/${userId}`, { token });
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
    return apiFetch("/ai/analyze", {
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
    return apiFetch("/mentor/chat", {
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

// ==================== HEALTH CHECK ====================

export const healthApi = {
  check: async () => {
    return apiFetch("/health");
  },
};

// Export default API object
export default {
  auth: authApi,
  academy: academyApi,
  market: marketApi,
  ai: aiApi,
  upload: uploadApi,
  contact: contactApi,
  health: healthApi,
};
