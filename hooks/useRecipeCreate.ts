/**
 * Hook for Recipe Creation
 * Backend generates canonicalName automatically
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { recipeApi } from '@/lib/api/recipe';
import type { Recipe, RecipeCreateRequest } from '@/lib/types/recipe';

interface UseRecipeCreateOptions {
  onSuccess?: (recipe: Recipe) => void;
  onError?: (error: Error) => void;
}

interface UseRecipeCreateReturn {
  creating: boolean;
  error: string | null;
  createdRecipe: Recipe | null;
  createRecipe: (data: RecipeCreateRequest) => Promise<Recipe | null>;
  reset: () => void;
}

/**
 * Hook для создания рецепта
 * 
 * ВАЖНО: canonicalName генерируется backend'ом
 * - Frontend передает localName (любой язык)
 * - Backend возвращает Recipe с canonicalName
 * 
 * @example
 * ```tsx
 * const { createRecipe, creating } = useRecipeCreate({
 *   onSuccess: (recipe) => {
 *     router.push(`/recipes/${recipe.canonicalName}`);
 *   }
 * });
 * 
 * const handleSubmit = async (formData) => {
 *   await createRecipe({
 *     localName: "Яичница",
 *     namePl: "Jajecznica",
 *     nameEn: "Scrambled Eggs",
 *     nameRu: "Яичница",
 *     difficulty: "easy",
 *     timeMinutes: 10,
 *     servings: 2,
 *     ingredients: [...],
 *   });
 * };
 * ```
 */
export function useRecipeCreate(options?: UseRecipeCreateOptions): UseRecipeCreateReturn {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdRecipe, setCreatedRecipe] = useState<Recipe | null>(null);
  
  const createRecipe = useCallback(async (data: RecipeCreateRequest): Promise<Recipe | null> => {
    setCreating(true);
    setError(null);
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log('📝 Creating recipe:', {
        localName: data.localName,
        names: { pl: data.namePl, en: data.nameEn, ru: data.nameRu },
        difficulty: data.difficulty,
        timeMinutes: data.timeMinutes,
      });
      
      const response = await recipeApi.createRecipe(data, token);
      
      console.log('✅ Recipe created:', {
        canonicalName: response.data.recipe.canonicalName,
        id: response.data.recipe.id,
      });
      
      setCreatedRecipe(response.data.recipe);
      
      toast.success('Recipe created successfully!', {
        description: `Canonical name: ${response.data.recipe.canonicalName}`,
      });
      
      if (options?.onSuccess) {
        options.onSuccess(response.data.recipe);
      }
      
      return response.data.recipe;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create recipe';
      console.error('❌ Recipe creation failed:', errorMessage);
      
      setError(errorMessage);
      toast.error('Failed to create recipe', {
        description: errorMessage,
      });
      
      if (options?.onError && err instanceof Error) {
        options.onError(err);
      }
      
      return null;
      
    } finally {
      setCreating(false);
    }
  }, [options]);
  
  const reset = useCallback(() => {
    setCreating(false);
    setError(null);
    setCreatedRecipe(null);
  }, []);
  
  return {
    creating,
    error,
    createdRecipe,
    createRecipe,
    reset,
  };
}

/**
 * Hook для обновления рецепта
 */
interface UseRecipeUpdateReturn {
  updating: boolean;
  error: string | null;
  updatedRecipe: Recipe | null;
  updateRecipe: (canonicalName: string, data: Partial<RecipeCreateRequest>) => Promise<Recipe | null>;
  reset: () => void;
}

export function useRecipeUpdate(options?: UseRecipeCreateOptions): UseRecipeUpdateReturn {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedRecipe, setUpdatedRecipe] = useState<Recipe | null>(null);
  
  const updateRecipe = useCallback(async (
    canonicalName: string,
    data: Partial<RecipeCreateRequest>
  ): Promise<Recipe | null> => {
    setUpdating(true);
    setError(null);
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log('📝 Updating recipe:', canonicalName, data);
      
      const response = await recipeApi.updateRecipe(canonicalName, data, token);
      
      console.log('✅ Recipe updated:', response.data.recipe.canonicalName);
      
      setUpdatedRecipe(response.data.recipe);
      
      toast.success('Recipe updated successfully!');
      
      if (options?.onSuccess) {
        options.onSuccess(response.data.recipe);
      }
      
      return response.data.recipe;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update recipe';
      console.error('❌ Recipe update failed:', errorMessage);
      
      setError(errorMessage);
      toast.error('Failed to update recipe', {
        description: errorMessage,
      });
      
      if (options?.onError && err instanceof Error) {
        options.onError(err);
      }
      
      return null;
      
    } finally {
      setUpdating(false);
    }
  }, [options]);
  
  const reset = useCallback(() => {
    setUpdating(false);
    setError(null);
    setUpdatedRecipe(null);
  }, []);
  
  return {
    updating,
    error,
    updatedRecipe,
    updateRecipe,
    reset,
  };
}
