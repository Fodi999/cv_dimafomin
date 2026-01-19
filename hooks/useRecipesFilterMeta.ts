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
            { value: 'italian', label: 'Італійська', icon: 'pizza' },
            { value: 'japanese', label: 'Японська', icon: 'soup' },
            { value: 'ukrainian', label: 'Українська', icon: 'wheat' }
          ],
          difficulties: [
            { value: 'easy', label: 'Легкий', icon: 'circle-green' },
            { value: 'medium', label: 'Середній', icon: 'circle-yellow' },
            { value: 'hard', label: 'Складний', icon: 'circle-red' }
          ],
          statuses: [
            { value: 'draft', label: 'Чернетка', icon: 'file-edit' },
            { value: 'published', label: 'Опубліковано', icon: 'check-circle' },
            { value: 'archived', label: 'Архів', icon: 'archive' }
          ],
          sortOptions: [
            { value: 'created_at', label: 'За датою створення', icon: 'calendar' },
            { value: 'title', label: 'За назвою', icon: 'text' },
            { value: 'views', label: 'За переглядами', icon: 'eye' },
            { value: 'cooking_time', label: 'За часом приготування', icon: 'clock' }
          ],
          sortOrders: [
            { value: 'desc', label: 'За спаданням', icon: 'arrow-down' },
            { value: 'asc', label: 'За зростанням', icon: 'arrow-up' }
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
