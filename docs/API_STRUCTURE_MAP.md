# API Structure Map

## 📂 Структура API Routes и Client Libraries

### 🎯 Принцип работы

```
Browser (Frontend)
    ↓
lib/api/*.ts (Client-side functions)
    ↓
/api/* (Next.js API Routes - Proxy)
    ↓
Backend (Koyeb/Heroku)
```

---

## 📋 Полная структура

### 🔐 **AUTH** - Аутентификация

| Client Function | Next.js API Route | Backend Endpoint |
|----------------|-------------------|------------------|
| `lib/api/auth.ts` | `/api/auth/login/route.ts` | `POST /api/auth/login` |
| | `/api/auth/register/route.ts` | `POST /api/auth/register` |
| | `/api/auth/logout/route.ts` | `POST /api/auth/logout` |
| | `/api/auth/me/route.ts` | `GET /api/auth/me` |

**Методы:**
- `login(email, password)`
- `register(userData)`
- `logout()`
- `getCurrentUser()`

---

### 🛡️ **ADMIN** - Административная панель

#### 📦 Ingredients (Продукты)

| Client Function | Next.js API Route | Backend Endpoint | Status |
|----------------|-------------------|------------------|--------|
| `lib/api/ingredients.api.ts` | `/api/admin/ingredients/route.ts` | `GET /api/admin/ingredients` | ✅ |
| `getIngredientSuggestions()` | `/api/admin/ingredients/suggest/route.ts` | `GET /api/admin/ingredients/suggest` | ✅ Fixed |
| `createIngredient()` | `/api/admin/ingredients/route.ts` | `POST /api/admin/ingredients` | ✅ |
| `resolveIngredient()` | `/api/admin/ingredients/resolve/route.ts` | `POST /api/admin/ingredients/resolve` | ✅ |
| `deleteIngredient(id)` | `/api/admin/ingredients/[id]/route.ts` | `DELETE /api/admin/ingredients/:id` | ✅ |

**Note:** `suggest` теперь использует `fetch('/api/...')` вместо `apiFetch()` для избежания CORS.

#### 🍳 Recipes (Рецепты)

| Client Function | Next.js API Route | Backend Endpoint | Status |
|----------------|-------------------|------------------|--------|
| `lib/api/recipes-ai.api.ts` | `/api/admin/recipes/preview-ai/route.ts` | `POST /api/admin/recipes/preview-ai` | ✅ Fixed |
| `previewRecipeWithAI()` | | | Uses `fetch()` |
| `createRecipeWithAI()` | `/api/admin/recipes/create-ai/route.ts` | `POST /api/admin/recipes/create-ai` | ✅ Fixed |
| | `/api/admin/recipes/route.ts` | `GET /api/admin/recipes` | ✅ |
| | `/api/admin/recipes/[id]/route.ts` | `GET/PUT/DELETE /api/admin/recipes/:id` | ✅ Fixed |

**Note:** AI recipes используют `quantity` вместо `amount`, `rawCookingText` вместо `instructions`.

#### 👥 Users (Пользователи)

| Client Function | Next.js API Route | Backend Endpoint |
|----------------|-------------------|------------------|
| `lib/api/admin.ts` | `/api/admin/users/route.ts` | `GET /api/admin/users` |
| `getUsers()` | | |
| `deleteUser(id)` | `/api/admin/users/[id]/route.ts` | `DELETE /api/admin/users/:id` |
| `updateUserRole()` | `/api/admin/users/[id]/role/route.ts` | `PATCH /api/admin/users/:id/role` |
| `updateUserStatus()` | `/api/admin/users/[id]/status/route.ts` | `PATCH /api/admin/users/:id/status` |
| `getUserStats()` | `/api/admin/users/stats/route.ts` | `GET /api/admin/users/stats` |

#### 🪙 Token Bank & Treasury

| Client Function | Next.js API Route | Backend Endpoint |
|----------------|-------------------|------------------|
| | `/api/admin/token-bank/treasury/route.ts` | `GET /api/admin/token-bank/treasury` |
| | `/api/admin/treasury/stats/route.ts` | `GET /api/admin/treasury/stats` |
| | `/api/admin/treasury/stream/route.ts` | `GET /api/admin/treasury/stream` (SSE) |
| | `/api/admin/stats/route.ts` | `GET /api/admin/stats` |

---

### 👤 **USER** - Пользовательские данные

| Client Function | Next.js API Route | Backend Endpoint | Status |
|----------------|-------------------|------------------|--------|
| | `/api/user/profile/route.ts` | `GET /api/user/profile` | ✅ |
| | `/api/user/language/route.ts` | `GET/POST /api/user/language` | ✅ |
| | `/api/user/tokens/add/route.ts` | `POST /api/user/tokens/add` | ✅ |
| | `/api/user/tokens/deduct/route.ts` | `POST /api/user/tokens/deduct` | ✅ |

#### 💾 Saved Recipes

| Client Function | Next.js API Route | Backend Endpoint |
|----------------|-------------------|------------------|
| | `/api/user/recipes/saved/route.ts` | `GET /api/user/recipes/saved` |
| | `/api/user/recipes/saved/[id]/route.ts` | `DELETE /api/user/recipes/saved/:id` |
| | `/api/user/recipes/save/route.ts` | `POST /api/user/recipes/save` |

---

### ⚙️ **SETTINGS** - Настройки

| Client Function | Next.js API Route | Backend Endpoint | Status |
|----------------|-------------------|------------------|--------|
| `lib/api/settings.ts` | `/api/settings/route.ts` | `GET /api/user/profile` | ✅ Fixed |
| `getSettings()` | | | Uses `fetch()` |
| `updateSettings()` | | `PATCH /api/user/profile` | ✅ Fixed |

**Note:** Settings API теперь использует `await cookies()` (Next.js 15 syntax).

---

### 🍱 **FRIDGE** - Холодильник

| Client Function | Next.js API Route | Backend Endpoint |
|----------------|-------------------|------------------|
| `lib/api/fridge.ts` | `/api/fridge/items/route.ts` | `GET /api/fridge/items` |
| | `/api/fridge/items/[id]/route.ts` | `PUT/DELETE /api/fridge/items/:id` |
| | `/api/fridge/items/[id]/price/route.ts` | `PATCH /api/fridge/items/:id/price` |
| | `/api/fridge/items/[id]/price/history/route.ts` | `GET /api/fridge/items/:id/price/history` |
| | `/api/fridge/add-missing/route.ts` | `POST /api/fridge/add-missing` |
| | `/api/fridge/deduct/route.ts` | `POST /api/fridge/deduct` |

---

### 🍳 **RECIPES** - Рецепты (Public)

| Client Function | Next.js API Route | Backend Endpoint |
|----------------|-------------------|------------------|
| | `/api/recipes/route.ts` | `GET /api/recipes` |
| | `/api/recipes/[id]/route.ts` | `GET /api/recipes/:id` |
| | `/api/recipes/[id]/cook/route.ts` | `POST /api/recipes/:id/cook` |
| | `/api/recipes/[id]/add-missing-to-fridge/route.ts` | `POST /api/recipes/:id/add-missing` |
| | `/api/recipes/available/route.ts` | `GET /api/recipes/available` |
| | `/api/recipes/match/route.ts` | `POST /api/recipes/match` |
| | `/api/recipes/recommendations/route.ts` | `GET /api/recipes/recommendations` |

---

### 🤖 **AI** - Искусственный интеллект

| Client Function | Next.js API Route | Backend Endpoint |
|----------------|-------------------|------------------|
| `lib/api/ai.ts` | `/api/generate-recipe/route.ts` | `POST /api/ai/generate-recipe` |
| | `/api/ai/create-recipe-from-fridge/route.ts` | `POST /api/ai/create-recipe-from-fridge` |
| | `/api/ai/fridge/analyze/route.ts` | `POST /api/ai/fridge/analyze` |
| | `/api/ai/recalculate-recipe-economy/route.ts` | `POST /api/ai/recalculate-recipe-economy` |
| | `/api/academy/ai/mentor/route.ts` | `POST /api/academy/ai/mentor` |

---

### 🏪 **MARKETPLACE** - Маркетплейс

| Client Function | Next.js API Route | Backend Endpoint |
|----------------|-------------------|------------------|
| `lib/api/marketplace.ts` | `/api/market/recipes/route.ts` | `GET /api/market/recipes` |

---

### 📊 **META & PUBLIC** - Мета-данные

| Client Function | Next.js API Route | Backend Endpoint |
|----------------|-------------------|------------------|
| | `/api/meta/categories/route.ts` | `GET /api/meta/categories` |
| | `/api/meta/countries/route.ts` | `GET /api/meta/countries` |
| | `/api/meta/cuisines/route.ts` | `GET /api/meta/cuisines` |
| | `/api/meta/difficulties/route.ts` | `GET /api/meta/difficulties` |
| | `/api/stats/public/route.ts` | `GET /api/stats/public` |
| | `/api/public/treasury/route.ts` | `GET /api/public/treasury` |

---

### 🪙 **TOKEN BANK** - Токены пользователя

| Client Function | Next.js API Route | Backend Endpoint |
|----------------|-------------------|------------------|
| | `/api/token-bank/me/route.ts` | `GET /api/token-bank/me` |
| | `/api/token-bank/me/transactions/route.ts` | `GET /api/token-bank/me/transactions` |

---

### 📚 **CATALOG** - Каталог

| Client Function | Next.js API Route | Backend Endpoint |
|----------------|-------------------|------------------|
| | `/api/catalog/ingredients/search/route.ts` | `GET /api/catalog/ingredients/search` |

---

### ✅ **TASKS** - Задания

| Client Function | Next.js API Route | Backend Endpoint |
|----------------|-------------------|------------------|
| `lib/api/tasks.ts` | `/api/tasks/route.ts` | `GET /api/tasks` |

---

## 🔧 Недавние исправления (January 11, 2026)

### ✅ CORS Issues Fixed

**Problem:** Direct `apiFetch()` calls caused CORS errors in production.

**Solution:** Changed to `fetch('/api/...')` for Next.js API routes.

**Fixed Files:**
- `lib/api/settings.ts` → Uses `fetch('/api/settings')`
- `lib/api/recipes-ai.api.ts` → Uses `fetch('/api/admin/recipes/*')`
- `lib/api/ingredients.api.ts` → Uses `fetch('/api/admin/ingredients/suggest')`

### ✅ Next.js 15 Cookies Syntax Fixed

**Problem:** Used old `request.cookies.get()` (Next.js 14).

**Solution:** Updated to `await cookies()` (Next.js 15).

**Fixed Files:**
- `app/api/admin/ingredients/suggest/route.ts`
- `app/api/admin/recipes/[id]/route.ts` (GET/PUT/DELETE)
- `app/api/settings/route.ts` (GET/PATCH)

---

## 📝 Conventions

### 1. **API Route Structure**
```
app/api/{module}/{resource}/[id]/route.ts
```

### 2. **Client Library Structure**
```
lib/api/{module}.ts
```

### 3. **Naming Patterns**
- `route.ts` - Next.js API route handler
- `{module}.api.ts` - Client-side API functions (specialized)
- `{module}.ts` - Generic client-side API functions

### 4. **Cookie Access (Next.js 15)**
```typescript
import { cookies } from "next/headers";

const cookieStore = await cookies();
const token = cookieStore.get('token')?.value;
```

### 5. **Fetch Pattern (Client → Next.js API)**
```typescript
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(data)
});
```

---

## 🎯 Total API Routes: **79 directories, 55 files**

**Status:** ✅ All routes properly configured for Next.js 15  
**Build:** ✅ Successful  
**CORS:** ✅ No issues (using Next.js proxy)

---

**Last Updated:** January 11, 2026  
**Next.js Version:** 16.0.8 (Turbopack)
