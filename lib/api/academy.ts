import { apiFetch } from './base';
import type { ProfileData, DashboardData, CourseData, LeaderboardData } from '../types';

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
