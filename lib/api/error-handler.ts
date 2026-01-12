/**
 * 🎯 ЕДИНЫЙ Error Handler для API ответов
 * 
 * ПРАВИЛО: НИКОГДА не проверять response.status === 401
 * ВСЕГДА проверять error.code === 'UNAUTHORIZED'
 * 
 * Backend возвращает структурированные ошибки:
 * {
 *   "success": false,
 *   "error": {
 *     "code": "UNAUTHORIZED" | "FORBIDDEN" | "VALIDATION_ERROR" | ...,
 *     "message": "Human-readable message",
 *     "fields": { "email": "Invalid format" }
 *   },
 *   "meta": {
 *     "request_id": "uuid"
 *   }
 * }
 */

export type ApiErrorCode =
  // Auth errors
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  
  // Validation errors
  | 'VALIDATION_ERROR'
  | 'INVALID_INPUT'
  | 'MISSING_FIELD'
  
  // Resource errors
  | 'NOT_FOUND'
  | 'ALREADY_EXISTS'
  | 'CONFLICT'
  
  // Business logic errors
  | 'INSUFFICIENT_TOKENS'
  | 'RECIPE_LIMIT_REACHED'
  | 'INGREDIENT_NOT_AVAILABLE'
  
  // System errors
  | 'INTERNAL_ERROR'
  | 'SERVICE_UNAVAILABLE'
  | 'TIMEOUT'
  | 'NETWORK_ERROR'
  
  // Generic
  | 'BACKEND_ERROR'
  | 'HTTP_ERROR'
  | 'PARSE_ERROR'
  | 'UNKNOWN_ERROR';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  fields?: Record<string, string>;
  request_id?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  meta?: {
    request_id: string;
    [key: string]: any;
  };
}

/**
 * Check if response is an error
 */
export function isApiError(response: any): response is ApiErrorResponse {
  return response && response.success === false && response.error;
}

/**
 * Extract error from various response formats
 */
export function extractError(response: any): ApiError {
  if (isApiError(response)) {
    return response.error;
  }
  
  // Legacy format
  if (response.error) {
    return {
      code: response.error.code || 'UNKNOWN_ERROR',
      message: response.error.message || 'Unknown error',
      fields: response.error.fields,
      request_id: response.meta?.request_id
    };
  }
  
  // Plain error object
  if (response instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: response.message
    };
  }
  
  // Unknown format
  return {
    code: 'UNKNOWN_ERROR',
    message: String(response)
  };
}

/**
 * 🚨 MAIN ERROR HANDLER
 * 
 * Использовать во ВСЕХ компонентах вместо проверки HTTP статусов
 * 
 * @example
 * ```tsx
 * try {
 *   const data = await fetchApi('/api/endpoint');
 * } catch (error) {
 *   handleApiError(error, {
 *     onUnauthorized: () => router.push('/login'),
 *     onForbidden: () => toast.error('Access denied'),
 *     onValidation: (fields) => setErrors(fields),
 *     onDefault: (message) => toast.error(message)
 *   });
 * }
 * ```
 */
export interface ErrorHandlers {
  /** Auth required - redirect to login */
  onUnauthorized?: () => void;
  
  /** No permission - show message */
  onForbidden?: () => void;
  
  /** Validation failed - show field errors */
  onValidation?: (fields: Record<string, string>, message: string) => void;
  
  /** Resource not found */
  onNotFound?: () => void;
  
  /** Insufficient tokens/credits */
  onInsufficientTokens?: () => void;
  
  /** Network/timeout error - show retry */
  onNetworkError?: () => void;
  
  /** Default handler for all other errors */
  onDefault?: (message: string, code: ApiErrorCode) => void;
}

export function handleApiError(
  error: any,
  handlers: ErrorHandlers
): void {
  // Extract structured error
  const apiError = extractError(error);
  
  console.error(`[API Error] ${apiError.code}:`, apiError.message, {
    fields: apiError.fields,
    request_id: apiError.request_id
  });
  
  // Log to Sentry (if configured)
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, {
      tags: {
        error_code: apiError.code,
        request_id: apiError.request_id
      },
      extra: {
        message: apiError.message,
        fields: apiError.fields
      }
    });
  }
  
  // Route to appropriate handler based on error.code
  switch (apiError.code) {
    case 'UNAUTHORIZED':
    case 'INVALID_TOKEN':
    case 'TOKEN_EXPIRED':
      if (handlers.onUnauthorized) {
        handlers.onUnauthorized();
        return;
      }
      break;
      
    case 'FORBIDDEN':
      if (handlers.onForbidden) {
        handlers.onForbidden();
        return;
      }
      break;
      
    case 'VALIDATION_ERROR':
    case 'INVALID_INPUT':
    case 'MISSING_FIELD':
      if (handlers.onValidation && apiError.fields) {
        handlers.onValidation(apiError.fields, apiError.message);
        return;
      }
      break;
      
    case 'NOT_FOUND':
      if (handlers.onNotFound) {
        handlers.onNotFound();
        return;
      }
      break;
      
    case 'INSUFFICIENT_TOKENS':
      if (handlers.onInsufficientTokens) {
        handlers.onInsufficientTokens();
        return;
      }
      break;
      
    case 'NETWORK_ERROR':
    case 'TIMEOUT':
    case 'SERVICE_UNAVAILABLE':
      if (handlers.onNetworkError) {
        handlers.onNetworkError();
        return;
      }
      break;
  }
  
  // Default handler for all unhandled errors
  if (handlers.onDefault) {
    handlers.onDefault(apiError.message, apiError.code);
  }
}

/**
 * Get user-friendly error message (with i18n support)
 */
export function getErrorMessage(
  code: ApiErrorCode,
  language: 'pl' | 'en' | 'ru' = 'pl'
): string {
  const messages: Record<string, Record<ApiErrorCode, string>> = {
    pl: {
      UNAUTHORIZED: 'Wymagane logowanie',
      FORBIDDEN: 'Brak uprawnień',
      INVALID_TOKEN: 'Nieprawidłowy token',
      TOKEN_EXPIRED: 'Token wygasł',
      VALIDATION_ERROR: 'Błąd walidacji',
      INVALID_INPUT: 'Nieprawidłowe dane',
      MISSING_FIELD: 'Brakujące pole',
      NOT_FOUND: 'Nie znaleziono',
      ALREADY_EXISTS: 'Już istnieje',
      CONFLICT: 'Konflikt danych',
      INSUFFICIENT_TOKENS: 'Niewystarczająca liczba tokenów',
      RECIPE_LIMIT_REACHED: 'Osiągnięto limit przepisów',
      INGREDIENT_NOT_AVAILABLE: 'Składnik niedostępny',
      INTERNAL_ERROR: 'Błąd wewnętrzny',
      SERVICE_UNAVAILABLE: 'Usługa niedostępna',
      TIMEOUT: 'Przekroczono limit czasu',
      NETWORK_ERROR: 'Błąd sieci',
      BACKEND_ERROR: 'Błąd serwera',
      HTTP_ERROR: 'Błąd HTTP',
      PARSE_ERROR: 'Błąd parsowania',
      UNKNOWN_ERROR: 'Nieznany błąd'
    },
    en: {
      UNAUTHORIZED: 'Login required',
      FORBIDDEN: 'Access denied',
      INVALID_TOKEN: 'Invalid token',
      TOKEN_EXPIRED: 'Token expired',
      VALIDATION_ERROR: 'Validation error',
      INVALID_INPUT: 'Invalid input',
      MISSING_FIELD: 'Missing field',
      NOT_FOUND: 'Not found',
      ALREADY_EXISTS: 'Already exists',
      CONFLICT: 'Data conflict',
      INSUFFICIENT_TOKENS: 'Insufficient tokens',
      RECIPE_LIMIT_REACHED: 'Recipe limit reached',
      INGREDIENT_NOT_AVAILABLE: 'Ingredient not available',
      INTERNAL_ERROR: 'Internal error',
      SERVICE_UNAVAILABLE: 'Service unavailable',
      TIMEOUT: 'Request timeout',
      NETWORK_ERROR: 'Network error',
      BACKEND_ERROR: 'Server error',
      HTTP_ERROR: 'HTTP error',
      PARSE_ERROR: 'Parse error',
      UNKNOWN_ERROR: 'Unknown error'
    },
    ru: {
      UNAUTHORIZED: 'Требуется авторизация',
      FORBIDDEN: 'Доступ запрещён',
      INVALID_TOKEN: 'Недействительный токен',
      TOKEN_EXPIRED: 'Токен истёк',
      VALIDATION_ERROR: 'Ошибка валидации',
      INVALID_INPUT: 'Неверные данные',
      MISSING_FIELD: 'Отсутствует поле',
      NOT_FOUND: 'Не найдено',
      ALREADY_EXISTS: 'Уже существует',
      CONFLICT: 'Конфликт данных',
      INSUFFICIENT_TOKENS: 'Недостаточно токенов',
      RECIPE_LIMIT_REACHED: 'Достигнут лимит рецептов',
      INGREDIENT_NOT_AVAILABLE: 'Ингредиент недоступен',
      INTERNAL_ERROR: 'Внутренняя ошибка',
      SERVICE_UNAVAILABLE: 'Сервис недоступен',
      TIMEOUT: 'Превышено время ожидания',
      NETWORK_ERROR: 'Ошибка сети',
      BACKEND_ERROR: 'Ошибка сервера',
      HTTP_ERROR: 'HTTP ошибка',
      PARSE_ERROR: 'Ошибка парсинга',
      UNKNOWN_ERROR: 'Неизвестная ошибка'
    }
  };
  
  return messages[language]?.[code] || messages.en[code] || 'Error';
}
