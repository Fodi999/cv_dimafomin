import { API_BASE_URL, apiFetch } from './base';
import type { UploadResponse } from '../types';

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
