/**
 * AI-assisted recipes API
 * Minimal input → AI generates full recipe
 */

import { apiFetch } from './base';

export interface AIRecipeIngredient {
  ingredientId: string;
  quantity: number; // Main field expected by backend
  unit: string;
}

export interface AIRecipeInput {
  title: string;
  ingredients: AIRecipeIngredient[];
  rawCookingText: string; // Single text block - AI will parse into steps
}

export interface AIRecipeStep {
  order: number;
  text: string;
  time?: number; // minutes for this step
}

export interface AIRecipePreview {
  title: string;
  canonicalName?: string; // Optional - may not always be returned
  summary?: string; // Optional
  description?: string; // Alternative field name
  steps: AIRecipeStep[]; // Array of step objects with text and time
  servings: number;
  time_minutes?: number; // Backend uses snake_case
  time?: number; // Fallback
  difficulty?: string; // Optional
  nutrition?: { // Made optional - backend may not always return it
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients?: Array<{ // Optional
    ingredientId: string;
    name: string;
    amount: number;
    unit: string;
  }>;
}

export interface AIRecipeCreated {
  id: string;
  title: string;
  canonicalName: string;
  // ... full recipe DTO
}

/**
 * Preview recipe with AI
 * POST /api/admin/recipes/preview-ai
 */
export async function previewRecipeWithAI(input: AIRecipeInput): Promise<AIRecipePreview> {
  return apiFetch('/admin/recipes/preview-ai', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Create recipe with AI
 * POST /api/admin/recipes/create-ai
 */
export async function createRecipeWithAI(input: AIRecipeInput): Promise<AIRecipeCreated> {
  return apiFetch('/admin/recipes/create-ai', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
