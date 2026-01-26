/**
 * useAIRecommendation Hook
 * 
 * 🎯 ЦЕЛЬ: Управление состоянием AI рекомендации
 * 
 * Возвращает:
 * - data: полностью готовые данные от backend
 * - loading: идёт загрузка
 * - error: ошибка загрузки
 * - refetch: перезагрузить рекомендацию
 * 
 * 🔄 ИНТЕГРАЦИЯ: Автоматически сохраняет рецепт в RecipeContext
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchAIRecipe, fetchNextAIRecipe } from '@/lib/api/ai-recipe';
import type { AIRecipeResponse } from '@/lib/types/ai-recipe';

export function useAIRecommendation(
  token: string | null,
  onRecipeLoaded?: (data: AIRecipeResponse) => void
) {
  const [data, setData] = useState<AIRecipeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🔒 Используем ref для callback чтобы избежать лишних re-renders
  const onRecipeLoadedRef = useRef(onRecipeLoaded);
  
  useEffect(() => {
    onRecipeLoadedRef.current = onRecipeLoaded;
  }, [onRecipeLoaded]);

  /**
   * Загрузить AI рекомендацию
   */
  const loadRecipe = useCallback(async () => {
    if (!token) {
      setError('No authentication token');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchAIRecipe(token);
      
      // ✅ Если рецептов нет - это не ошибка, просто пустой результат
      if (!response) {
        setData(null);
        setError('no_recipes'); // Специальный код ошибки для UI
        console.log('ℹ️ No recipes available - user may need to add ingredients');
      } else {
        setData(response);
        
        // ✅ Вызвать callback если передан (через ref для стабильности)
        if (onRecipeLoadedRef.current) {
          onRecipeLoadedRef.current(response);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI unavailable');
      console.error('❌ Failed to load AI recipe:', err);
    } finally {
      setLoading(false);
    }
  }, [token]); // ✅ Только token в зависимостях

  /**
   * Загрузить следующую рекомендацию (skip текущую)
   */
  const loadNext = useCallback(async () => {
    if (!token || !data) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchNextAIRecipe(token, data.recipe.id);
      
      // ✅ Если следующего рецепта нет - показываем сообщение
      if (!response) {
        setData(null);
        setError('no_more_recipes');
        console.log('ℹ️ No more recipes available');
      } else {
        setData(response);
        
        // ✅ Вызвать callback если передан (через ref для стабильности)
        if (onRecipeLoadedRef.current) {
          onRecipeLoadedRef.current(response);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load next recipe');
      console.error('❌ Failed to load next AI recipe:', err);
    } finally {
      setLoading(false);
    }
  }, [token, data]); // ✅ Только token и data в зависимостях

  /**
   * Initial load
   */
  useEffect(() => {
    loadRecipe();
  }, [loadRecipe]);

  return {
    data,
    loading,
    error,
    refetch: loadRecipe,
    loadNext,
  };
}
