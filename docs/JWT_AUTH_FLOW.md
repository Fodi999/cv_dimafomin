# JWT Authentication Flow - Frontend Implementation

**Date**: 2026-01-15  
**Status**: ✅ Fully Implemented

## Overview
Frontend correctly implements JWT authentication with proper token management and transmission.

---

## 1. Login Flow

### User Login (`contexts/AuthContext.tsx`)
```typescript
const login = async (email: string, password: string): Promise<string> => {
  // 1. Send credentials to API
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // 2. Extract token from response
  const data = await response.json();
  const { token, user } = data.data;
  
  // 3. Store token in localStorage
  localStorage.setItem("token", token);
  localStorage.setItem("role", user.role);
  
  // 4. Store token in cookies (for middleware)
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
  document.cookie = `role=${user.role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
  
  // 5. Update React state
  setToken(token);
  setRole(user.role);
  
  return getRedirectUrl(user.role); // Returns "/admin/dashboard" or "/profile"
};
```

### Backend Proxy (`app/api/auth/login/route.ts`)
```typescript
export async function POST(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/auth/login',
    method: 'POST',
    skipAuth: true  // Login doesn't require existing auth
  });
}
```

---

## 2. Token Transmission

### All Protected API Requests

#### Method 1: From Cookies (Server-Side)
Used in API routes (`app/api/**/*.ts`):

```typescript
// lib/api/proxy.ts
export async function proxyToBackend(request: NextRequest, options: ProxyOptions) {
  // Extract token from cookies (Next.js 15 syntax)
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  // Add to backend request headers
  headers['Authorization'] = `Bearer ${token}`;
  
  // Forward to backend
  const response = await fetch(backendUrl, { headers });
}
```

#### Method 2: From localStorage (Client-Side)
Used in React hooks (`hooks/*.ts`):

```typescript
// hooks/useIngredients.ts
const fetchIngredients = useCallback(async () => {
  const token = localStorage.getItem("token");
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Language": language,
    },
  });
}, [filters]);
```

---

## 3. Protected Hooks Implementation

### Example: `useIngredients.ts`
```typescript
export function useIngredients() {
  const fetchIngredients = useCallback(async () => {
    const token = localStorage.getItem("token"); // ✅ Get JWT
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send in Authorization header
        "Content-Type": "application/json",
      },
    });
  }, [filters]);
}
```

### Other Protected Hooks
All hooks correctly implement JWT transmission:
- ✅ `useAdminRecipes.ts` - 4 occurrences
- ✅ `useAdminUsers.ts` - 6 occurrences  
- ✅ `useAdminStats.ts` - 3 occurrences
- ✅ `useIngredients.ts` - 5 occurrences
- ✅ `useRecipeGeneration.ts` - 1 occurrence
- ✅ `useRecipeStats.ts` - 1 occurrence
- ✅ `useAI.ts` - 1 occurrence

---

## 4. Token Storage

### Dual Storage Strategy
```typescript
// 1. localStorage - for client-side JavaScript access
localStorage.setItem("token", token);

// 2. Cookies - for server-side (middleware) access
document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
```

### Why Both?
- **localStorage**: Fast access for client-side React hooks
- **Cookies**: Accessible in Next.js middleware and API routes

---

## 5. Logout Flow

```typescript
const logout = () => {
  // Clear localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  
  // Clear cookies
  document.cookie = "token=; path=/; max-age=0";
  document.cookie = "role=; path=/; max-age=0";
  
  // Clear React state
  setToken(null);
  setRole(null);
};
```

---

## 6. Recent Fixes (2026-01-15)

### Fixed Routes
Changed from manual implementation to `proxyToBackend`:

1. **`/api/admin/ingredients/suggest`** ✅
   - Before: Manual fetch with localhost fallback
   - After: Uses `proxyToBackend` helper

2. **`/api/admin/ingredients/resolve`** ✅
   - Before: Manual token extraction
   - After: Uses `proxyToBackend` helper

3. **`/api/generate-recipe`** ✅
   - Before: `localhost:8080` fallback
   - After: Hardcoded Koyeb URL

---

## 7. Verification Checklist

### ✅ Token Acquisition
- [x] Login API returns JWT token
- [x] Token stored in localStorage
- [x] Token stored in cookies
- [x] React state updated with token

### ✅ Token Transmission
- [x] All API routes use `proxyToBackend` (extracts from cookies)
- [x] All React hooks read from localStorage
- [x] Authorization header format: `Bearer <token>`
- [x] No localhost URLs in production code

### ✅ Token Lifecycle
- [x] Token persists across page reloads (localStorage)
- [x] Token accessible in middleware (cookies)
- [x] Token cleared on logout
- [x] Unauthorized requests handled (401 status)

---

## 8. Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LOGIN                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  AuthContext.login()              │
        │  POST /api/auth/login             │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  proxyToBackend()                 │
        │  → Go Backend                     │
        │  ← { token, user }                │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Store Token:                     │
        │  - localStorage.setItem()         │
        │  - document.cookie =              │
        └───────────────────────────────────┘
                            │
        ┌───────────────────┴────────────────────┐
        │                                        │
        ▼                                        ▼
┌─────────────────┐                  ┌──────────────────┐
│ CLIENT-SIDE     │                  │ SERVER-SIDE      │
│ (React Hooks)   │                  │ (API Routes)     │
├─────────────────┤                  ├──────────────────┤
│ localStorage    │                  │ cookies          │
│ .getItem()      │                  │ .get('token')    │
│                 │                  │                  │
│ fetch(url, {    │                  │ proxyToBackend({ │
│   headers: {    │                  │   endpoint,      │
│     Auth: Bearer│                  │   method         │
│   }             │                  │ })               │
│ })              │                  │                  │
└─────────────────┘                  └──────────────────┘
        │                                        │
        └───────────────────┬────────────────────┘
                            ▼
        ┌───────────────────────────────────┐
        │  Go Backend                       │
        │  Receives: Authorization: Bearer  │
        │  Validates JWT                    │
        │  Returns: Protected Data          │
        └───────────────────────────────────┘
```

---

## 9. Example Request Flow

### Admin Ingredients Fetch
```typescript
// 1. User triggers fetch
useIngredients.fetchIngredients()

// 2. Hook reads token
const token = localStorage.getItem("token");

// 3. Makes request to Next.js API
fetch('/api/admin/ingredients', {
  headers: { Authorization: `Bearer ${token}` }
})

// 4. Next.js API extracts token from cookies
const cookieStore = await cookies();
const token = cookieStore.get('token')?.value;

// 5. Proxy forwards to Go backend
fetch('https://yeasty-madelaine...koyeb.app/api/admin/ingredients', {
  headers: { Authorization: `Bearer ${token}` }
})

// 6. Go backend validates JWT and returns data
```

---

## Conclusion
✅ **Frontend correctly implements JWT authentication**:
- Token acquired during login
- Token stored in both localStorage and cookies
- Token sent in `Authorization: Bearer <token>` header
- All API routes use consistent proxy approach
- No localhost URLs in production code
