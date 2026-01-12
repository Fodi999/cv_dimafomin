/**
 * Hook for AI-assisted recipe creation
 */

import { useState, useCallback } from 'react';
import { 
  previewRecipeWithAI, 
  createRecipeWithAI,
  saveRecipe as saveRecipeAPI,
  AIRecipeInput,
  AIRecipePreview,
  AIRecipeCreated,
  SaveRecipeRequest
} from '@/lib/api/recipes-ai.api';

export function useAIRecipe() {
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [preview, setPreview] = useState<AIRecipePreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Preview recipe with AI
   */
  const previewRecipe = useCallback(async (input: AIRecipeInput) => {
    try {
      setPreviewing(true);
      setError(null);
      
      const result = await previewRecipeWithAI(input);
      setPreview(result);
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to preview recipe';
      setError(errorMessage);
      throw err;
    } finally {
      setPreviewing(false);
    }
  }, []);

  /**
   * Create recipe with AI
   */
  const createRecipe = useCallback(async (input: AIRecipeInput) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await createRecipeWithAI(input);
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create recipe';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Save recipe (after preview/edit)
   */
  const saveRecipe = useCallback(async (recipe: SaveRecipeRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await saveRecipeAPI(recipe);
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save recipe';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear preview
   */
  const clearPreview = useCallback(() => {
    setPreview(null);
    setError(null);
  }, []);

  return {
    loading,
    previewing,
    preview,
    error,
    previewRecipe,
    createRecipe,
    saveRecipe,
    clearPreview,
  };
}
