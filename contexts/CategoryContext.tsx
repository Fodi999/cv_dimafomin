"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchCategories, type Category } from '@/lib/api/categoryApi';
import { useLanguage } from './LanguageContext';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType>({
  categories: [],
  loading: true,
  error: null,
  refetch: async () => {},
});

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('[CategoryContext] No token available, using fallback categories');
        // Will use fallback categories from categoryApi
      }
      
      const data = await fetchCategories(language, token || '');
      setCategories(data);
      console.log(`[CategoryContext] Loaded ${data.length} categories for language: ${language}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load categories';
      console.error('[CategoryContext] Error loading categories:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load categories on mount and when language changes
  useEffect(() => {
    loadCategories();
  }, [language]);

  return (
    <CategoryContext.Provider value={{ 
      categories, 
      loading, 
      error,
      refetch: loadCategories 
    }}>
      {children}
    </CategoryContext.Provider>
  );
}

/**
 * Hook to access ingredient categories
 * 
 * @returns Categories context with categories, loading state, and refetch function
 * 
 * @example
 * const { categories, loading } = useCategories();
 * 
 * if (loading) return <Spinner />;
 * 
 * return categories.map(cat => (
 *   <button key={cat.key}>
 *     {cat.icon} {cat.label}
 *   </button>
 * ));
 */
export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within CategoryProvider');
  }
  return context;
};
