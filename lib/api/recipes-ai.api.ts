/**
 * AI-assisted recipes API
 * Minimal input → AI generates full recipe
 */

import { apiFetch } from './base';

export interface AIRecipeIngredient {
  ingredientId: string;
  amount: number;
  unit: string;
}

export interface AIRecipeInput {
  title: string;
  ingredients: AIRecipeIngredient[];
  instructions: string; // Single text block, no steps
}

export interface AIRecipePreview {
  title: string;
  canonicalName: string;
  summary: string;
  steps: string[];
  servings: number;
  time: number; // minutes
  difficulty: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: Array<{
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
