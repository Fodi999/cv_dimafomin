/**
 * API Module Exports
 * Central export point for all API clients
 */

// Auth
export { authApi } from './auth';

// Fridge
export { fridgeApi } from './fridge';

// Notifications
export { notificationsApi } from './notifications';

// Recipes
export { recipeApi } from './recipe';

// Tasks
export { tasksApi } from './tasks';

// User
export { userApi } from './user';

// AI
export { aiApi } from './ai';

// Categories
export * from './categoryApi';

// Types (re-export commonly used types)
export type { RecipeMatch, RecipeMatchIngredient } from './recipe-matching';
