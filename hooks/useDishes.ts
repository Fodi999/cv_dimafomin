/**
 * Dishes Hooks
 * 
 * Frontend 2026 principles:
 * - Only data fetching
 * - No business logic
 * - Server state via API
 */

import { useState, useEffect } from "react";
import {
  getAdminDishes,
  getDish,
  generateDishFromRecipe,
  updateDish,
  approveDish,
  publishDish,
  deleteDish,
  getMarketplaceDishes,
  type Dish,
  type DishesListParams,
  type GenerateDishPayload,
  type UpdateDishPayload,
  type MarketplaceDishesParams,
} from "@/lib/api/dishes";

// ═══════════════════════════════════════════════════════════
// ADMIN HOOKS
// ═══════════════════════════════════════════════════════════

/**
 * Fetch admin dishes list
 */
export function useAdminDishes(params?: DishesListParams) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAdminDishes(params);
      setDishes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch dishes"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [params?.status, params?.limit, params?.offset]);

  return { dishes, isLoading, error, refetch };
}

/**
 * Fetch single dish
 */
export function useDish(id: string | null) {
  const [dish, setDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    if (!id) {
      setDish(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getDish(id);
      setDish(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch dish"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [id]);

  return { dish, isLoading, error, refetch };
}

/**
 * Generate dish from recipe
 */
export function useGenerateDish() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generate = async (payload: GenerateDishPayload): Promise<Dish | null> => {
    try {
      setIsGenerating(true);
      setError(null);
      const dish = await generateDishFromRecipe(payload);
      return dish;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to generate dish"));
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating, error };
}

/**
 * Update dish
 */
export function useUpdateDish() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, payload: UpdateDishPayload): Promise<Dish | null> => {
    try {
      setIsUpdating(true);
      setError(null);
      const dish = await updateDish(id, payload);
      return dish;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update dish"));
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return { update, isUpdating, error };
}

/**
 * Approve dish
 */
export function useApproveDish() {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approve = async (id: string): Promise<Dish | null> => {
    try {
      setIsApproving(true);
      setError(null);
      const dish = await approveDish(id);
      return dish;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to approve dish"));
      return null;
    } finally {
      setIsApproving(false);
    }
  };

  return { approve, isApproving, error };
}

/**
 * Publish dish
 */
export function usePublishDish() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const publish = async (id: string): Promise<Dish | null> => {
    try {
      setIsPublishing(true);
      setError(null);
      const dish = await publishDish(id);
      return dish;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to publish dish"));
      return null;
    } finally {
      setIsPublishing(false);
    }
  };

  return { publish, isPublishing, error };
}

/**
 * Delete dish
 */
export function useDeleteDish() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteDishById = async (id: string): Promise<boolean> => {
    try {
      setIsDeleting(true);
      setError(null);
      await deleteDish(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete dish"));
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteDish: deleteDishById, isDeleting, error };
}

// ═══════════════════════════════════════════════════════════
// MARKETPLACE HOOKS
// ═══════════════════════════════════════════════════════════

/**
 * Fetch marketplace dishes (public)
 */
export function useMarketplaceDishes(params?: MarketplaceDishesParams) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMarketplaceDishes(params);
      setDishes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch dishes"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [params?.category, params?.limit, params?.offset]);

  return { dishes, isLoading, error, refetch };
}
