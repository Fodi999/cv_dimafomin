"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { AIRecipeResponse } from '@/lib/types/ai-recipe';

/**
 * AIRecommendationContext
 * 
 * 🎯 PURPOSE: Ephemeral state for AI recommendations
 * 
 * ✅ ONLY FOR:
 * - AI Assistant page
 * - Temporary recommendations from Rules Engine
 * - Current AI decision (CAN_COOK_NOW, ALMOST_READY, NEED_MORE)
 * 
 * ❌ NOT FOR:
 * - User-selected recipes (use RecipeContext)
 * - Saved recipes (use RecipeContext)
 * - Persistent storage (NO localStorage)
 * 
 * 📌 CRITICAL RULES:
 * - AI recommendations are transient, not persistent
 * - NEVER write from this context to RecipeContext
 * - NEVER save AI results to localStorage
 * - RecipeContext is ONLY updated on explicit user action (Ugotuj/Zapisz)
 * 
 * 🔄 LIFECYCLE:
 * - New recommendation → auto-clear excluded IDs (fresh start)
 * - Excluded IDs prevent duplicates (no extra re-renders)
 * - Page reload → AI recommendation fetched fresh (not from storage)
 */

interface AIRecommendationContextValue {
  // Current AI recommendation (ephemeral)
  currentRecommendation: AIRecipeResponse | null;
  
  // Set new AI recommendation
  setRecommendation: (recommendation: AIRecipeResponse) => void;
  
  // Clear recommendation
  clearRecommendation: () => void;
  
  // History of excluded recipe IDs (for "next recipe" feature)
  excludedRecipeIds: string[];
  addExcludedRecipe: (recipeId: string) => void;
  clearExcluded: () => void;
}

const AIRecommendationContext = createContext<AIRecommendationContextValue | undefined>(undefined);

export function AIRecommendationProvider({ children }: { children: ReactNode }) {
  const [currentRecommendation, setCurrentRecommendation] = useState<AIRecipeResponse | null>(null);
  const [excludedRecipeIds, setExcludedRecipeIds] = useState<string[]>([]);

  const setRecommendation = useCallback((recommendation: AIRecipeResponse) => {
    console.log('🤖 AIRecommendationContext: Setting recommendation', {
      recipeId: recommendation.recipe.id,
      scenario: recommendation.recipe.scenario,
      missingCount: recommendation.recipe.missingIngredients.length,
    });
    
    // ✅ Clear excluded IDs on new recommendation (new scenario = fresh start)
    setExcludedRecipeIds([]);
    setCurrentRecommendation(recommendation);
  }, []);

  const clearRecommendation = useCallback(() => {
    console.log('🤖 AIRecommendationContext: Clearing recommendation');
    setCurrentRecommendation(null);
  }, []);

  const addExcludedRecipe = useCallback((recipeId: string) => {
    console.log('🤖 AIRecommendationContext: Excluding recipe', recipeId);
    setExcludedRecipeIds(prev => 
      // ✅ Prevent duplicates (avoid extra re-renders and filter bugs)
      prev.includes(recipeId) ? prev : [...prev, recipeId]
    );
  }, []);

  const clearExcluded = useCallback(() => {
    console.log('🤖 AIRecommendationContext: Clearing excluded recipes');
    setExcludedRecipeIds([]);
  }, []);

  return (
    <AIRecommendationContext.Provider
      value={{
        currentRecommendation,
        setRecommendation,
        clearRecommendation,
        excludedRecipeIds,
        addExcludedRecipe,
        clearExcluded,
      }}
    >
      {children}
    </AIRecommendationContext.Provider>
  );
}

export function useAIRecommendation() {
  const context = useContext(AIRecommendationContext);
  if (context === undefined) {
    throw new Error('useAIRecommendation must be used within AIRecommendationProvider');
  }
  return context;
}
