/**
 * Unified API Client
 * 
 * CHANGELOG:
 * - 2025-12-26: Refactored monolithic api.ts (1557 lines) into modular structure
 * - Renamed: market/ → marketplace/
 * - Renamed: /ai/analyze → /ai/culinary/analyze
 * - Renamed: /mentor/chat → /ai/chef-mentor
 * - Changed: /user/{id}/purchases → /marketplace/my-purchases
 * - Disabled: /auth/logout (temporarily stubbed)
 * - Disabled: /auth/me (temporarily stubbed)
 */

// Re-export base utilities and types
export { apiFetch, API_BASE_URL } from './api/base';
export type { ApiOptions, ApiResponse, ApiError } from './api/base';

// Re-export API contract types
export {
  ApiErrorCode,
  createApiResponse,
  createApiError,
  createValidationError,
  isApiResponse,
  isApiError,
} from './api/types';

export type {
  ApiResponseMeta,
  ApiPagination,
  ApiFieldError,
  ApiErrorMeta,
  ApiErrorCodeType,
  // Domain types
  UserProfile,
  AuthResponse,
  LanguageChangeResponse,
  SettingsResponse,
  FridgeItem,
  Recipe,
  RecipeIngredient,
  RecipeStep,
  RecipeNutrition,
  Task,
  Wallet,
  WalletTransaction,
  // Request types
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  UpdateSettingsRequest,
  AddFridgeItemRequest,
  MatchRecipesRequest,
} from './api/types';

// Re-export all API modules
export { authApi } from './api/auth';
export { aiApi, aiChatApi } from './api/ai';
export { uploadApi } from './api/upload';
export { walletApi } from './api/wallet';
export { tasksApi } from './api/tasks';
export { fridgeApi } from './api/fridge';
export { userApi } from './api/user';
export { adminApi } from './api/admin';
export { contactApi } from './api/contact';
export { healthApi } from './api/health';
export { recipeMatchingApi } from './api/recipe-matching';

// Re-export recipe matching types
export type {
  RecipeMatchParams,
  RecipeMatchIngredient,
  RecipeMatchEconomy,
  RecipeMatch,
  CookRecipeParams,
  CookRecipeResult,
  RecipeMatchResponse,
  AIRecommendationResult,
} from './api/recipe-matching';

// Import all APIs for default export
import { authApi } from './api/auth';
import { aiApi, aiChatApi } from './api/ai';
import { uploadApi } from './api/upload';
import { walletApi } from './api/wallet';
import { tasksApi } from './api/tasks';
import { fridgeApi } from './api/fridge';
import { userApi } from './api/user';
import { adminApi } from './api/admin';
import { contactApi } from './api/contact';
import { healthApi } from './api/health';
import { recipeMatchingApi } from './api/recipe-matching';

/**
 * Default API object (backwards compatibility)
 * Usage: import api from '@/lib/api'
 */
export default {
  auth: authApi,
  ai: aiApi,
  aiChat: aiChatApi,
  upload: uploadApi,
  wallet: walletApi,
  tasks: tasksApi,
  fridge: fridgeApi,
  contact: contactApi,
  health: healthApi,
  user: userApi,
  admin: adminApi,
  recipeMatching: recipeMatchingApi,
};
