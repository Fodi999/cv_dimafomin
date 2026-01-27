/**
 * Dishes API Client
 * 
 * Frontend 2026 principles:
 * - Only fetch + typing
 * - No business logic
 * - No calculations
 * - Only API calls
 */

import { authFetch } from "./authFetch";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export type DishStatus = "draft" | "approved" | "published";

export interface Dish {
  id: string;
  recipeId: string;
  title: string;
  description: string;
  price: number;
  margin: number;
  cost: number; // ✅ Backend calculates
  status: DishStatus;
  isAvailable: boolean; // ✅ Backend decides
  language: string;
  imageUrl?: string;
  recipe?: {
    id: string;
    title: string;
    difficulty: string;
    cookingTime: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GenerateDishPayload {
  recipeId: string;
  targetMargin: number;
  language: string;
}

export interface UpdateDishPayload {
  title?: string;
  description?: string;
  price?: number;
  margin?: number;
}

export interface DishesListParams {
  status?: DishStatus;
  limit?: number;
  offset?: number;
}

export interface MarketplaceDishesParams {
  category?: string;
  limit?: number;
  offset?: number;
}

// ═══════════════════════════════════════════════════════════
// ADMIN API
// ═══════════════════════════════════════════════════════════

/**
 * Generate dish from recipe
 * POST /api/admin/dishes/generate-from-recipe
 */
export async function generateDishFromRecipe(
  payload: GenerateDishPayload
): Promise<Dish> {
  const response = await authFetch("/api/admin/dishes/generate-from-recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to generate dish");
  }

  const data = await response.json();
  return data.data || data;
}

/**
 * Get admin dishes list
 * GET /api/admin/dishes
 */
export async function getAdminDishes(
  params?: DishesListParams
): Promise<Dish[]> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.offset) queryParams.append("offset", params.offset.toString());

  const url = `/api/admin/dishes${queryParams.toString() ? `?${queryParams}` : ""}`;
  const response = await authFetch(url);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch dishes");
  }

  const data = await response.json();
  return data.data || data;
}

/**
 * Get single dish
 * GET /api/admin/dishes/:id
 */
export async function getDish(id: string): Promise<Dish> {
  const response = await authFetch(`/api/admin/dishes/${id}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch dish");
  }

  const data = await response.json();
  return data.data || data;
}

/**
 * Update dish
 * PATCH /api/admin/dishes/:id
 */
export async function updateDish(
  id: string,
  payload: UpdateDishPayload
): Promise<Dish> {
  const response = await authFetch(`/api/admin/dishes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update dish");
  }

  const data = await response.json();
  return data.data || data;
}

/**
 * Approve dish (draft → approved)
 * POST /api/admin/dishes/:id/approve
 */
export async function approveDish(id: string): Promise<Dish> {
  const response = await authFetch(`/api/admin/dishes/${id}/approve`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to approve dish");
  }

  const data = await response.json();
  return data.data || data;
}

/**
 * Publish dish (approved → published)
 * POST /api/admin/dishes/:id/publish
 */
export async function publishDish(id: string): Promise<Dish> {
  const response = await authFetch(`/api/admin/dishes/${id}/publish`, {
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to publish dish");
  }

  const data = await response.json();
  return data.data || data;
}

/**
 * Delete dish
 * DELETE /api/admin/dishes/:id
 */
export async function deleteDish(id: string): Promise<void> {
  const response = await authFetch(`/api/admin/dishes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete dish");
  }
}

// ═══════════════════════════════════════════════════════════
// MARKETPLACE API (PUBLIC)
// ═══════════════════════════════════════════════════════════

/**
 * Get marketplace dishes (published + available only)
 * GET /api/marketplace/dishes
 */
export async function getMarketplaceDishes(
  params?: MarketplaceDishesParams
): Promise<Dish[]> {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append("category", params.category);
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.offset) queryParams.append("offset", params.offset.toString());

  const url = `/api/marketplace/dishes${queryParams.toString() ? `?${queryParams}` : ""}`;
  const response = await fetch(url); // Public endpoint

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch marketplace dishes");
  }

  const data = await response.json();
  return data.data || data;
}
