// ai-client.ts - Клієнт для роботи з AI API

const AI_API_BASE_URL = "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai";

export interface AISessionRequest {
  sessionId?: string | null;
  message: string;
  image?: string | null;
  language?: string;
}

export interface AISessionResponse {
  status?: string;
  data?: {
    sessionId?: string;
    message?: string;
    isComplete?: boolean;
    recipe?: any;
  };
  sessionId?: string;
  message?: string;
  isComplete?: boolean;
  recipe?: any;
}

export interface Recipe {
  title: string;
  description?: string;
  ingredients?: Array<{
    name: string;
    quantity?: string;
    unit?: string;
  }>;
  steps?: string[];
  servings?: number;
  timeMinutes?: number;
  difficulty?: string;
  imageUrl?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

/**
 * Ініціалізує нову AI сесію
 */
export async function initializeAISession(language: string = "ua"): Promise<AISessionResponse> {
  const response = await fetch(`${AI_API_BASE_URL}/chef-mentor/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Початок",
      language: language
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  try {
    return await response.json();
  } catch (e) {
    console.error("Failed to parse AI session initialization response:", e);
    throw new Error("Invalid JSON response from AI API");
  }
}

/**
 * Відправляє повідомлення в AI сесію
 */
export async function sendAIMessage(request: AISessionRequest): Promise<AISessionResponse> {
  const response = await fetch(`${AI_API_BASE_URL}/chef-mentor/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  try {
    return await response.json();
  } catch (e) {
    console.error("Failed to parse AI message response:", e);
    throw new Error("Invalid JSON response from AI API");
  }
}

/**
 * Завантажує зображення для рецепту
 */
export async function uploadRecipeImage(recipeId: string, imageUrl: string): Promise<void> {
  const response = await fetch(`${AI_API_BASE_URL}/recipes/${recipeId}/image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    throw new Error(`Image upload error: ${response.status}`);
  }
}

/**
 * Нормалізує відповідь від AI (підтримка різних форматів)
 */
export function normalizeAIResponse(data: any): {
  sessionId?: string;
  message?: string;
  isComplete?: boolean;
  recipe?: Recipe;
} {
  // Format 1: {status: "success", data: {...}}
  if (data.status === "success" && data.data) {
    return data.data;
  }
  
  // Format 2: Direct object {message, sessionId, ...}
  if (data.message || data.sessionId) {
    return {
      sessionId: data.sessionId,
      message: data.message,
      isComplete: data.isComplete,
      recipe: data.recipe,
    };
  }

  // Unknown format
  console.error("❌ Unknown AI response format:", data);
  throw new Error("Invalid AI response format");
}

/**
 * Витягує текст повідомлення з відповіді
 */
export function extractMessageText(content: string | any): string {
  // If content is object, extract message
  if (typeof content === "object" && content !== null) {
    return content.message || JSON.stringify(content, null, 2);
  }
  
  // If string is JSON, parse it carefully
  if (typeof content === "string" && content.startsWith("{")) {
    try {
      const parsed = JSON.parse(content);
      if (parsed.message) {
        return parsed.message;
      }
    } catch (e) {
      // Not valid JSON, return as is
      console.warn("Failed to parse content as JSON:", e);
    }
  }
  
  return String(content);
}
