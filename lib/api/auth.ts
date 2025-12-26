import { apiFetch } from './base';
import type { AuthResponse } from '../types';

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
