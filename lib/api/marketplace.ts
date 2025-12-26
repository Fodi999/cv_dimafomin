import { apiFetch } from './base';
import type { RecipeData } from '../types';

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
