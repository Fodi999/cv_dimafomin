import { useState, useEffect } from 'react';

export interface FilterOption {
  value: string;
  label: string;
  icon?: string;
}

export interface RecipesFilterMeta {
  cuisines: FilterOption[];
  difficulties: FilterOption[];
  statuses: FilterOption[];
  sortOptions: FilterOption[];
  sortOrders: FilterOption[];
  timeRanges: FilterOption[];
  caloriesRanges: FilterOption[];
  sourceTypes: FilterOption[];
}

/**
 * Hook to fetch filter meta information for recipes catalog
 * Returns available options for all filters
 */
export function useRecipesFilterMeta() {
  const [filterMeta, setFilterMeta] = useState<RecipesFilterMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilterMeta = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/recipes/filters/meta');
        
        if (!response.ok) {
          throw new Error('Failed to fetch filter options');
        }

        const data = await response.json();
        setFilterMeta(data.data);
        setError(null);
      } catch (err: any) {
        console.error('[useRecipesFilterMeta] Error:', err);
        setError(err.message);
        
        // Fallback to default options if API fails
        setFilterMeta({
          cuisines: [
            { value: 'italian', label: 'Італійська', icon: '🇮🇹' },
            { value: 'japanese', label: 'Японська', icon: '🇯🇵' },
            { value: 'ukrainian', label: 'Українська', icon: '🇺🇦' }
          ],
          difficulties: [
            { value: 'easy', label: 'Легкий', icon: '🟢' },
            { value: 'medium', label: 'Середній', icon: '🟡' },
            { value: 'hard', label: 'Складний', icon: '🔴' }
          ],
          statuses: [
            { value: 'draft', label: 'Чернетка', icon: '📝' },
            { value: 'published', label: 'Опубліковано', icon: '✅' },
            { value: 'archived', label: 'Архів', icon: '📦' }
          ],
          sortOptions: [
            { value: 'created_at', label: 'За датою створення', icon: '📅' },
            { value: 'title', label: 'За назвою', icon: '🔤' }
          ],
          sortOrders: [
            { value: 'desc', label: 'За спаданням', icon: '⬇️' },
            { value: 'asc', label: 'За зростанням', icon: '⬆️' }
          ],
          timeRanges: [],
          caloriesRanges: [],
          sourceTypes: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterMeta();
  }, []);

  return { filterMeta, isLoading, error };
}
