/**
 * Query Builder Utilities
 * Helper functions for building API query strings with filters
 */

import { RecipesFilters } from '@/hooks/useAdminRecipes';

/**
 * Build query string from filters object
 * Automatically skips empty values and 'all' defaults
 */
export function buildRecipesQueryString(filters: RecipesFilters): string {
  const params = new URLSearchParams();
  
  // Search
  if (filters.search && filters.search.trim()) {
    params.append('search', filters.search.trim());
  }
  
  // Cuisine/Category
  if (filters.cuisine && filters.cuisine !== 'all') {
    params.append('cuisine', filters.cuisine);
  }
  
  // Difficulty
  if (filters.difficulty && filters.difficulty !== 'all') {
    params.append('difficulty', filters.difficulty);
  }
  
  // Status
  if (filters.status && filters.status !== 'all') {
    params.append('status', filters.status);
  }
  
  // Sort
  if (filters.sortBy) {
    params.append('sortBy', filters.sortBy);
  }
  
  if (filters.sortOrder) {
    params.append('sortOrder', filters.sortOrder);
  }
  
  // Pagination
  params.append('page', filters.page.toString());
  params.append('limit', filters.limit.toString());
  
  return params.toString();
}

/**
 * Parse query string into filters object
 * Useful for restoring filters from URL
 */
export function parseRecipesQueryString(queryString: string): Partial<RecipesFilters> {
  const params = new URLSearchParams(queryString);
  const filters: Partial<RecipesFilters> = {};
  
  const search = params.get('search');
  if (search) filters.search = search;
  
  const cuisine = params.get('cuisine');
  if (cuisine) filters.cuisine = cuisine;
  
  const difficulty = params.get('difficulty');
  if (difficulty) filters.difficulty = difficulty;
  
  const status = params.get('status');
  if (status) filters.status = status;
  
  const sortBy = params.get('sortBy');
  if (sortBy) filters.sortBy = sortBy;
  
  const sortOrder = params.get('sortOrder');
  if (sortOrder) filters.sortOrder = sortOrder as 'asc' | 'desc';
  
  const page = params.get('page');
  if (page) filters.page = parseInt(page, 10);
  
  const limit = params.get('limit');
  if (limit) filters.limit = parseInt(limit, 10);
  
  return filters;
}

/**
 * Get human-readable label for filter value
 */
export function getFilterLabel(filterType: string, value: string): string {
  const labels: Record<string, Record<string, string>> = {
    cuisine: {
      italian: 'Італійська',
      japanese: 'Японська',
      ukrainian: 'Українська',
      chinese: 'Китайська',
      french: 'Французька',
      american: 'Американська',
      mexican: 'Мексиканська',
      indian: 'Індійська',
      thai: 'Тайська',
      mediterranean: 'Середземноморська',
      asian: 'Азійська',
      european: 'Європейська'
    },
    difficulty: {
      easy: 'Легкий',
      medium: 'Середній',
      hard: 'Складний'
    },
    status: {
      draft: 'Чернетка',
      published: 'Опубліковано',
      archived: 'Архів'
    },
    sortBy: {
      created_at: 'За датою створення',
      title: 'За назвою',
      cooking_time: 'За часом приготування',
      views: 'За переглядами'
    },
    sortOrder: {
      asc: 'За зростанням',
      desc: 'За спаданням'
    }
  };
  
  return labels[filterType]?.[value] || value;
}
