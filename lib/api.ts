// API Configuration and Helper Functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.dima-fomin.pl";

interface ApiOptions extends RequestInit {
  token?: string;
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
    const errorMessage = error.message || `HTTP ${response.status}`;
    const err = new Error(errorMessage) as Error & { status: number };
    err.status = response.status;
    throw err;
  }

  return response.json();
}

// ==================== AUTH API ====================

export const authApi = {
  login: async (email: string, password: string) => {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name: string, email: string, password: string) => {
    return apiFetch("/auth/register", {
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
  getDashboard: async (userId: string, token?: string) => {
    return apiFetch(`/user/${userId}/dashboard`, { token });
  },

  // Courses
  getCourses: async () => {
    return apiFetch("/academy/courses");
  },

  getCourse: async (id: string) => {
    return apiFetch(`/academy/courses/${id}`);
  },

  // Leaderboard
  getLeaderboard: async () => {
    return apiFetch("/academy/leaderboard");
  },

  // Certificates
  getCertificates: async (token: string) => {
    return apiFetch("/academy/certificates", { token });
  },

  downloadCertificate: async (certificateId: string, token: string) => {
    return apiFetch(`/academy/certificates/${certificateId}/download`, { token });
  },
};

// ==================== MARKET API ====================

export const marketApi = {
  // Recipes
  getRecipes: async (filters?: {
    search?: string;
    difficulty?: string;
    sort?: string;
  }) => {
    const params = new URLSearchParams(filters as Record<string, string>);
    return apiFetch(`/market/recipes?${params}`);
  },

  getRecipe: async (id: string) => {
    return apiFetch(`/market/recipes/${id}`);
  },

  // Purchase
  purchaseRecipe: async (recipeId: string, token: string) => {
    return apiFetch("/market/purchase", {
      method: "POST",
      token,
      body: JSON.stringify({ recipeId }),
    });
  },

  // User's purchased recipes
  getPurchasedRecipes: async (token: string) => {
    return apiFetch("/market/my-recipes", { token });
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

// Export default API object
export default {
  auth: authApi,
  academy: academyApi,
  market: marketApi,
  contact: contactApi,
};
