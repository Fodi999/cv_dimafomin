// index.ts - Головний експорт AI модуля

// Client
export {
  initializeAISession,
  sendAIMessage,
  uploadRecipeImage,
  normalizeAIResponse,
  extractMessageText,
} from "./ai-client";

export type {
  AISessionRequest,
  AISessionResponse,
  Recipe,
} from "./ai-client";

// Streaming
export {
  parseSSEStream,
  streamAIResponse,
  AIStreamManager,
  TokenAccumulator,
} from "./streaming";

export type {
  StreamingMessage,
} from "./streaming";

// Prompt Templates
export {
  getSystemPrompt,
  formatUserMessage,
  isRecipeComplete,
  getWelcomeMessage,
  getErrorMessage,
} from "./prompt-templates";

export type {
  PromptContext,
} from "./prompt-templates";

// Types
export type {
  AIMessage,
  AISession,
  RecipeIngredient,
  RecipeStep,
  RecipeNutrition,
  AIRecipe,
  AIRequest,
  AIResponse,
  StreamingToken,
  StreamingEvent,
  AIErrorType,
  AIError,
  AIConfig,
  ChatState,
  ChatAction,
} from "./types";

// Re-export commonly used utilities
import {
  initializeAISession,
  sendAIMessage,
  uploadRecipeImage,
  normalizeAIResponse,
} from "./ai-client";

import {
  getSystemPrompt,
  getWelcomeMessage,
  getErrorMessage,
  isRecipeComplete,
} from "./prompt-templates";

export const AI = {
  // Client methods
  initialize: initializeAISession,
  sendMessage: sendAIMessage,
  uploadImage: uploadRecipeImage,
  normalize: normalizeAIResponse,
  
  // Prompt helpers
  getSystemPrompt,
  getWelcomeMessage,
  getErrorMessage,
  
  // Validation
  isRecipeComplete,
};
