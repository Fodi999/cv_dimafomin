# 🎯 API Contract Implementation Guide

## 📋 Overview

Формальный API-контракт между Frontend и Backend согласно стандартам 2025.

**Статус:** ✅ Implemented  
**Дата:** 28 декабря 2025 г.  
**Версия:** 1.0.0

---

## 🏗️ Architecture

### **Before** (Legacy)
```typescript
// ❌ Inconsistent responses
return NextResponse.json({ success: true, data: profile });
return NextResponse.json({ error: "Not found" }, { status: 404 });
return new Response(JSON.stringify({ message: "OK" }));
```

### **After** (2025 Standard)
```typescript
// ✅ Unified ApiResponse<T>
return NextResponse.json<ApiResponse<UserProfile>>(
  createApiResponse(profile),
  { status: 200 }
);

// ✅ Unified ApiError
return NextResponse.json<ApiError>(
  createApiError("NOT_FOUND", "User not found"),
  { status: 404 }
);
```

---

## 📦 Core Types

### **1. ApiResponse<T>**

Используется для ВСЕХ успешных ответов (2xx).

```typescript
interface ApiResponse<T = unknown> {
  data: T;                    // Основные данные
  meta?: ApiResponseMeta;      // Метаданные (опционально)
}

interface ApiResponseMeta {
  requestId?: string;          // Для трейсинга
  timestamp?: string;          // ISO 8601
  version?: string;            // Версия API
  pagination?: ApiPagination;  // Для списков
}
```

**Пример:**
```typescript
{
  "data": {
    "id": "123",
    "email": "user@example.com",
    "name": "Dmitrij"
  },
  "meta": {
    "requestId": "req_1735401234_abc123",
    "timestamp": "2025-12-28T12:34:56.789Z"
  }
}
```

### **2. ApiError**

Используется для ВСЕХ ошибочных ответов (4xx, 5xx).

```typescript
interface ApiError {
  code: string;               // Machine-readable код
  message: string;            // Human-readable сообщение
  details?: Record<string, any>;  // Доп. детали
  fields?: ApiFieldError[];   // Ошибки валидации
  meta?: ApiErrorMeta;        // Метаданные ошибки
}

interface ApiFieldError {
  field: string;              // Имя поля
  message: string;            // Сообщение
  code?: string;              // Код ошибки
}
```

**Пример:**
```typescript
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid email format",
  "fields": [
    {
      "field": "email",
      "message": "Must be a valid email address",
      "code": "INVALID_FORMAT"
    }
  ],
  "meta": {
    "requestId": "req_1735401234_abc123",
    "timestamp": "2025-12-28T12:34:56.789Z"
  }
}
```

---

## 🛠️ Helper Functions

### **createApiResponse()**

Создает успешный ответ с метаданными.

```typescript
function createApiResponse<T>(
  data: T,
  meta?: ApiResponseMeta
): ApiResponse<T>

// Usage
const response = createApiResponse(userProfile, {
  requestId: crypto.randomUUID(),
});

return NextResponse.json<ApiResponse<UserProfile>>(
  response,
  { status: 200 }
);
```

### **createApiError()**

Создает ошибку с метаданными.

```typescript
function createApiError(
  code: string,
  message: string,
  details?: Record<string, any>,
  fields?: ApiFieldError[]
): ApiError

// Usage
return NextResponse.json<ApiError>(
  createApiError(
    ApiErrorCode.AUTH_REQUIRED,
    "Authentication required"
  ),
  { status: 401 }
);
```

### **createValidationError()**

Специальный хелпер для ошибок валидации.

```typescript
function createValidationError(
  message: string,
  fields: ApiFieldError[]
): ApiError

// Usage
return NextResponse.json<ApiError>(
  createValidationError(
    "Validation failed",
    [
      { field: "email", message: "Invalid format" },
      { field: "password", message: "Too short" }
    ]
  ),
  { status: 400 }
);
```

---

## 📚 Standard Error Codes

```typescript
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
```

**Usage:**
```typescript
import { ApiErrorCode } from "@/lib/api";

return NextResponse.json<ApiError>(
  createApiError(
    ApiErrorCode.AUTH_REQUIRED, // ✅ Type-safe
    "Please log in"
  ),
  { status: 401 }
);
```

---

## 🎯 Implementation Examples

### **Example 1: GET /api/auth/me**

```typescript
import { NextRequest, NextResponse } from "next/server";
import {
  createApiResponse,
  createApiError,
  ApiErrorCode,
  type UserProfile,
  type ApiResponse,
  type ApiError,
} from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader) {
      return NextResponse.json<ApiError>(
        createApiError(
          ApiErrorCode.AUTH_REQUIRED,
          "Authentication required"
        ),
        { status: 401 }
      );
    }

    // Fetch from backend
    const userData = await fetchUserFromBackend(authHeader);
    
    return NextResponse.json<ApiResponse<UserProfile>>(
      createApiResponse(userData, {
        requestId: crypto.randomUUID(),
      }),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiError>(
      createApiError(
        ApiErrorCode.INTERNAL_ERROR,
        "Internal server error",
        { error: error instanceof Error ? error.message : String(error) }
      ),
      { status: 500 }
    );
  }
}
```

### **Example 2: PATCH /api/settings**

```typescript
import { NextRequest, NextResponse } from "next/server";
import {
  createApiResponse,
  createApiError,
  createValidationError,
  ApiErrorCode,
  type SettingsResponse,
  type ApiResponse,
  type ApiError,
} from "@/lib/api";

export async function PATCH(req: NextRequest) {
  try {
    const body: any = await req.json();
    
    // Reject deprecated field
    if ("language" in body) {
      return NextResponse.json<ApiError>(
        createValidationError(
          "Language cannot be updated via settings API",
          [{
            field: "language",
            message: "Use cookie-based language system instead",
            code: "DEPRECATED_FIELD",
          }]
        ),
        { status: 400 }
      );
    }

    const updated: SettingsResponse = {
      theme: body.theme || "system",
      timeFormat: body.timeFormat || "24h",
      units: body.units || "metric",
      notifications: body.notifications || { email: true, push: false },
      privacy: body.privacy || { publicProfile: true, showEmail: false },
    };
    
    return NextResponse.json<ApiResponse<SettingsResponse>>(
      createApiResponse(updated, {
        requestId: crypto.randomUUID(),
      }),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiError>(
      createApiError(
        ApiErrorCode.INTERNAL_ERROR,
        "Failed to update settings",
        { error: error instanceof Error ? error.message : String(error) }
      ),
      { status: 500 }
    );
  }
}
```

### **Example 3: POST /api/recipes/match**

```typescript
export async function POST(req: NextRequest) {
  try {
    const body: MatchRecipesRequest = await req.json();
    
    // Validate
    if (!body.ingredients || body.ingredients.length === 0) {
      return NextResponse.json<ApiError>(
        createValidationError(
          "At least one ingredient is required",
          [{ field: "ingredients", message: "Cannot be empty" }]
        ),
        { status: 400 }
      );
    }

    const matches = await matchRecipesFromBackend(body);
    
    return NextResponse.json<ApiResponse<Recipe[]>>(
      createApiResponse(matches, {
        requestId: crypto.randomUUID(),
        pagination: {
          page: 1,
          limit: 10,
          total: matches.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiError>(
      createApiError(
        ApiErrorCode.INTERNAL_ERROR,
        "Failed to match recipes"
      ),
      { status: 500 }
    );
  }
}
```

---

## 🔄 Frontend Integration

### **apiFetch() Auto-Unwraps**

`apiFetch()` автоматически распаковывает `ApiResponse<T>`:

```typescript
// Backend returns: { data: {...}, meta: {...} }
// apiFetch returns: {...} (unwrapped data)

const profile = await userApi.getUserProfile();
// profile: UserProfile (not ApiResponse<UserProfile>!)
```

### **Error Handling**

```typescript
try {
  const profile = await userApi.getUserProfile();
  console.log(profile.name);
} catch (error) {
  // error.message содержит ApiError.message
  console.error(error.message);
  
  // Для детальной обработки используйте try-catch на fetch уровне
}
```

### **Type-Safe Requests**

```typescript
import type {
  LoginRequest,
  AuthResponse,
  ApiResponse,
  ApiError,
} from "@/lib/api";

// Request type
const loginData: LoginRequest = {
  email: "user@example.com",
  password: "password123",
};

// Response type
const response: AuthResponse = await authApi.login(
  loginData.email,
  loginData.password
);
```

---

## ✅ Migration Checklist

### **Phase 1: Core Infrastructure** ✅
- [x] Create `lib/api/types.ts` with all contract types
- [x] Update `lib/api/base.ts` to support new format
- [x] Export types from `lib/api.ts`
- [x] Add helper functions: `createApiResponse`, `createApiError`, `createValidationError`
- [x] Add type guards: `isApiResponse`, `isApiError`

### **Phase 2: Critical Endpoints** ✅
- [x] Update `/api/auth/me/route.ts`
- [x] Update `/api/settings/route.ts`
- [ ] Update `/api/user/profile/route.ts`

### **Phase 3: Remaining Endpoints**
- [ ] `/api/auth/login/route.ts`
- [ ] `/api/auth/register/route.ts`
- [ ] `/api/fridge/items/route.ts`
- [ ] `/api/recipes/match/route.ts`
- [ ] `/api/tasks/route.ts`
- [ ] ... (остальные ~25 эндпоинтов)

### **Phase 4: Documentation**
- [x] Create API Contract Guide
- [ ] Update `BACKEND_INTEGRATION_STRUCTURE.md`
- [ ] Add examples to README

### **Phase 5: Testing**
- [ ] Test all updated endpoints
- [ ] Verify type-safety on frontend
- [ ] Check error handling
- [ ] Load testing

---

## 📊 Benefits

### **1. Type Safety**
```typescript
// ❌ Before: any type
const data = await fetch("/api/user/profile").then(r => r.json());

// ✅ After: fully typed
const profile: UserProfile = await userApi.getUserProfile();
```

### **2. Consistent Errors**
```typescript
// ❌ Before: unpredictable
{ error: "Not found" }
{ success: false, message: "..." }
{ errors: [...] }

// ✅ After: unified
{
  "code": "NOT_FOUND",
  "message": "User not found",
  "meta": { "requestId": "..." }
}
```

### **3. Traceability**
```typescript
// ✅ Every response has requestId
{
  "data": {...},
  "meta": {
    "requestId": "req_1735401234_abc123",  // 🔍 Trace logs
    "timestamp": "2025-12-28T12:34:56.789Z"
  }
}
```

### **4. Future-Proof**
```typescript
// Easy to add new features
interface ApiResponseMeta {
  requestId?: string;
  timestamp?: string;
  version?: string;
  rateLimit?: {        // ✅ New field
    remaining: number;
    reset: string;
  };
}
```

---

## 🚨 Breaking Changes

### **Language Field Removed from Settings**

```typescript
// ❌ Old: language in Settings API
PATCH /api/settings
{ "language": "ru" }

// ✅ New: cookie-based
document.cookie = "lang=ru";
window.location.reload();
```

**Reason:** Language is now SSR-safe via cookie system.

---

## 📖 Related Documentation

- `lib/api/types.ts` - All contract types
- `lib/api/base.ts` - apiFetch implementation
- `docs/BACKEND_INTEGRATION_STRUCTURE.md` - Architecture overview
- `docs/I18N_SSR_IMPLEMENTATION.md` - Cookie-based language system

---

## 🎯 Next Steps

1. **Migrate remaining endpoints** (~25 routes)
2. **Update frontend API clients** to use new types
3. **Add request ID logging** для трейсинга
4. **Setup error monitoring** (Sentry integration)
5. **Write integration tests**

---

**Последнее обновление:** 28 декабря 2025 г.  
**Статус:** Phase 2 Complete (2/3 critical endpoints migrated)
