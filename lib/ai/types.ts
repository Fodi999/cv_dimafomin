// types.ts - TypeScript типи для AI модуля

export interface AIMessage {
  role: "ai" | "user" | "system";
  content: string;
  timestamp: number;
  metadata?: {
    model?: string;
    tokens?: number;
    isStreaming?: boolean;
  };
}

export interface AISession {
  id: string;
  createdAt: number;
  updatedAt: number;
  messages: AIMessage[];
  language: string;
  metadata?: {
    userId?: string;
    recipeGenerated?: boolean;
    completedAt?: number;
  };
}

export interface RecipeIngredient {
  name: string;
  quantity?: string;
  unit?: string;
  optional?: boolean;
}

export interface RecipeStep {
  order: number;
  instruction: string;
  duration?: number;
  tips?: string[];
}

export interface RecipeNutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

export interface AIRecipe {
  title: string;
  description?: string;
  ingredients: RecipeIngredient[];
  steps: string[] | RecipeStep[];
  servings?: number;
  timeMinutes?: number;
  difficulty?: "easy" | "medium" | "hard" | "легко" | "середньо" | "складно";
  cuisine?: string;
  category?: string;
  imageUrl?: string;
  nutrition?: RecipeNutrition;
  tags?: string[];
}

export interface AIRequest {
  sessionId?: string | null;
  message: string;
  image?: string | null;
  language?: string;
  context?: {
    dietaryRestrictions?: string[];
    allergies?: string[];
    cookingLevel?: "beginner" | "intermediate" | "advanced";
  };
}

export interface AIResponse {
  sessionId: string;
  message?: string;
  isComplete: boolean;
  recipe?: AIRecipe;
  suggestions?: string[];
  error?: {
    code: string;
    message: string;
  };
}

export interface StreamingToken {
  token: string;
  timestamp: number;
}

export interface StreamingEvent {
  type: "start" | "token" | "complete" | "error";
  data: any;
  timestamp: number;
}

export type AIErrorType = "network" | "timeout" | "server" | "validation" | "unknown";

export interface AIError {
  type: AIErrorType;
  message: string;
  originalError?: Error;
  timestamp: number;
}

export interface AIConfig {
  apiBaseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enableStreaming?: boolean;
  defaultLanguage?: string;
}

export interface ChatState {
  messages: AIMessage[];
  sessionId: string | null;
  isLoading: boolean;
  isStreaming: boolean;
  error: AIError | null;
  generatedRecipe: AIRecipe | null;
}

export type ChatAction =
  | { type: "ADD_MESSAGE"; payload: AIMessage }
  | { type: "SET_SESSION_ID"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_STREAMING"; payload: boolean }
  | { type: "SET_ERROR"; payload: AIError | null }
  | { type: "SET_RECIPE"; payload: AIRecipe | null }
  | { type: "RESET_CHAT" };
