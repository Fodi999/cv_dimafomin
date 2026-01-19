/**
 * Unified API Contract
 * 
 * Формальный контракт между Frontend и Backend
 * Используется во ВСЕХ API routes и клиентских запросах
 * 
 * @standards 2025 Enterprise Grade
 * @version 1.0.0
 * @created 2025-12-28
 */

// ============================================================================
// CORE API RESPONSE TYPES
// ============================================================================

/**
 * Стандартный успешный ответ API
 * 
 * Все успешные ответы (2xx) должны соответствовать этому типу
 * 
 * @example
 * ```typescript
 * return NextResponse.json<ApiResponse<UserProfile>>({
 *   data: profile,
 *   meta: { requestId: uuid() }
 * });
 * ```
 */
export interface ApiResponse<T = unknown> {
  /**
   * Данные ответа
   * Тип определяется generic параметром
   */
  data: T;

  /**
   * Метаданные ответа (опционально)
   */
  meta?: ApiResponseMeta;
}

/**
 * Метаданные API ответа
 */
export interface ApiResponseMeta {
  /**
   * Уникальный ID запроса для трейсинга
   */
  requestId?: string;

  /**
   * Timestamp ответа (ISO 8601)
   */
  timestamp?: string;

  /**
   * Версия API
   */
  version?: string;

  /**
   * Пагинация (для списков)
   */
  pagination?: ApiPagination;
}

/**
 * Пагинация для списков
 */
export interface ApiPagination {
  /** Текущая страница (1-based) */
  page: number;

  /** Элементов на странице */
  limit: number;

  /** Всего элементов */
  total: number;

  /** Всего страниц */
  totalPages: number;

  /** Есть ли следующая страница */
  hasNext: boolean;

  /** Есть ли предыдущая страница */
  hasPrev: boolean;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Стандартная ошибка API
 * 
 * Все ошибочные ответы (4xx, 5xx) должны соответствовать этому типу
 * 
 * @example
 * ```typescript
 * return NextResponse.json<ApiError>({
 *   code: "AUTH_REQUIRED",
 *   message: "Authentication required",
 *   details: { redirect: "/login" }
 * }, { status: 401 });
 * ```
 */
export interface ApiError {
  /**
   * Machine-readable код ошибки
   * Используется для программной обработки
   * 
   * @example "AUTH_REQUIRED", "VALIDATION_ERROR", "NOT_FOUND"
   */
  code: string;

  /**
   * Human-readable сообщение ошибки
   * Может показываться пользователю
   */
  message: string;

  /**
   * Дополнительные детали ошибки (опционально)
   */
  details?: Record<string, any>;

  /**
   * Поля с ошибками валидации (опционально)
   */
  fields?: ApiFieldError[];

  /**
   * Метаданные ошибки
   */
  meta?: ApiErrorMeta;
}

/**
 * Ошибка валидации поля
 */
export interface ApiFieldError {
  /** Имя поля */
  field: string;

  /** Сообщение об ошибке */
  message: string;

  /** Код ошибки валидации */
  code?: string;
}

/**
 * Метаданные ошибки
 */
export interface ApiErrorMeta {
  /** Request ID для трейсинга */
  requestId?: string;

  /** Timestamp ошибки */
  timestamp?: string;

  /** Stack trace (только для dev) */
  stack?: string;
}

// ============================================================================
// STANDARD ERROR CODES
// ============================================================================

/**
 * Стандартные коды ошибок
 * Используйте эти константы вместо строк
 */
export const ApiErrorCode = {
  // 400 Bad Request
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_REQUEST: "INVALID_REQUEST",
  MISSING_FIELD: "MISSING_FIELD",
  
  // 401 Unauthorized
  AUTH_REQUIRED: "AUTH_REQUIRED",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  
  // 403 Forbidden
  FORBIDDEN: "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  
  // 404 Not Found
  NOT_FOUND: "NOT_FOUND",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  RECIPE_NOT_FOUND: "RECIPE_NOT_FOUND",
  
  // 409 Conflict
  ALREADY_EXISTS: "ALREADY_EXISTS",
  DUPLICATE_EMAIL: "DUPLICATE_EMAIL",
  
  // 429 Too Many Requests
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  
  // 500 Internal Server Error
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
} as const;

export type ApiErrorCodeType = typeof ApiErrorCode[keyof typeof ApiErrorCode];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Создать успешный API ответ
 * 
 * @example
 * ```typescript
 * return NextResponse.json(
 *   createApiResponse(profile),
 *   { status: 200 }
 * );
 * ```
 */
export function createApiResponse<T>(
  data: T,
  meta?: ApiResponseMeta
): ApiResponse<T> {
  return {
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

/**
 * Создать ошибку API
 * 
 * @example
 * ```typescript
 * return NextResponse.json(
 *   createApiError("AUTH_REQUIRED", "Please log in"),
 *   { status: 401 }
 * );
 * ```
 */
export function createApiError(
  code: string,
  message: string,
  details?: Record<string, any>,
  fields?: ApiFieldError[]
): ApiError {
  return {
    code,
    message,
    details,
    fields,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    },
  };
}

/**
 * Создать ошибку валидации
 */
export function createValidationError(
  message: string,
  fields: ApiFieldError[]
): ApiError {
  return createApiError(
    ApiErrorCode.VALIDATION_ERROR,
    message,
    undefined,
    fields
  );
}

/**
 * Генерировать request ID для трейсинга
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

// ============================================================================
// DOMAIN-SPECIFIC TYPES
// ============================================================================

/**
 * User Profile Response
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Auth Response
 */
export interface AuthResponse {
  user: UserProfile;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

/**
 * Language Change Response
 */
export interface LanguageChangeResponse {
  language: string;
  success: boolean;
}

/**
 * Settings Response
 */
export interface SettingsResponse {
  theme: "light" | "dark" | "system";
  timeFormat: "12h" | "24h";
  units: "metric" | "kitchen";
  notifications: {
    email: boolean;
    push: boolean;
  };
  privacy: {
    publicProfile: boolean;
    showEmail: boolean;
  };
}

/**
 * Fridge Item
 */
export interface FridgeItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiresAt?: string;
  addedAt: string;
}

/**
 * Recipe
 */
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageUrl?: string | null; // ← ДОБАВЛЕНО: URL изображения из Cloudinary
  cookingTime: number;
  difficulty: "easy" | "medium" | "hard";
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: RecipeStep[];
  nutrition?: RecipeNutrition;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  optional?: boolean;
}

export interface RecipeStep {
  step: number;
  instruction: string;
  duration?: number;
  image?: string;
}

export interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Task
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "achievement";
  status: "active" | "completed" | "expired";
  reward: {
    tokens: number;
    experience: number;
  };
  progress: {
    current: number;
    target: number;
  };
  expiresAt?: string;
}

/**
 * Wallet
 */
export interface Wallet {
  balance: number;
  currency: "CHEF";
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: "earn" | "spend" | "transfer";
  amount: number;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Проверка, является ли ответ успешным
 */
export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value
  );
}

/**
 * Проверка, является ли ответ ошибкой
 */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value
  );
}

// ============================================================================
// REQUEST TYPES
// ============================================================================

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

/**
 * Update Profile Request
 */
export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  avatar?: string;
}

/**
 * Update Settings Request
 */
export interface UpdateSettingsRequest {
  theme?: "light" | "dark" | "system";
  timeFormat?: "12h" | "24h";
  units?: "metric" | "kitchen";
  notifications?: {
    email?: boolean;
    push?: boolean;
  };
  privacy?: {
    publicProfile?: boolean;
    showEmail?: boolean;
  };
}

/**
 * Add Fridge Item Request
 */
export interface AddFridgeItemRequest {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiresAt?: string;
}

/**
 * Match Recipes Request
 */
export interface MatchRecipesRequest {
  ingredients: string[];
  maxMissingIngredients?: number;
  difficulty?: "easy" | "medium" | "hard";
  maxCookingTime?: number;
}
