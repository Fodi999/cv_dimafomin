/**
 * 🔢 useRecipeStats Hook
 * 
 * Global hook for fetching recipe statistics from catalog.
 * Used to enrich AI messages with context about available recipes.
 * 
 * Usage:
 * ```tsx
 * const { stats, loading } = useRecipeStats();
 * 
 * // stats.totalRecipes → total count
 * // stats.byCategory → breakdown by category
 * ```
 * 
 * Architecture:
 * - ✅ Single source of truth for recipe counts
 * - ✅ Fetched once per page load
 * - ✅ Used to enrich AI message context
 * - ❌ Backend AI does NOT know these numbers
 */

import { useEffect, useState } from 'react';

export type RecipeStats = {
  totalRecipes: number;
  byCategory: Record<string, number>;
};

type RecipeStatsResponse = {
  success: boolean;
  data?: RecipeStats;
  message?: string;
};

/**
 * Hook to fetch and cache recipe statistics
 * 
 * @returns Object with stats and loading state
 */
export function useRecipeStats() {
  const [stats, setStats] = useState<RecipeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Stats are public, but include token if available for consistency
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/recipes/stats', {
          method: 'GET',
          headers,
        });

        if (!mounted) return;

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: RecipeStatsResponse = await response.json();

        if (data.success && data.data) {
          setStats(data.data);
          setError(null);
        } else {
          throw new Error(data.message || 'Failed to fetch recipe stats');
        }
      } catch (err: any) {
        console.error('❌ Failed to load recipe stats:', err);
        if (mounted) {
          setError(err.message || 'Unknown error');
          // Set fallback stats to avoid breaking UI
          setStats({ totalRecipes: 0, byCategory: {} });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      mounted = false;
    };
  }, []);

  return { 
    stats, 
    loading, 
    error,
    // Convenience getters
    totalRecipes: stats?.totalRecipes ?? 0,
    byCategory: stats?.byCategory ?? {},
  };
}
