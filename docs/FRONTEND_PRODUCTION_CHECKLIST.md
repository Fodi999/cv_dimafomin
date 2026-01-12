# ✅ Frontend Production Readiness Checklist

**Last Updated:** January 11, 2026  
**Status:** 🔄 IN PROGRESS

---

## 📋 Чек-лист обязательных настроек

### 1. ✅ ЕДИНЫЙ API BASE

**Requirement:** Одна переменная окружения для всего проекта

**Files:**
- ✅ `.env.local` - Created with `NEXT_PUBLIC_API_BASE=http://localhost:8080/api`
- ✅ `.env.production` - Created with production Koyeb URL

**What to check:**
```bash
# Search for inconsistent env vars (should return 0)
grep -r "NEXT_PUBLIC_BACKEND_URL\|NEXT_PUBLIC_API_URL" app/api --include="*.ts" | wc -l
```

**Current Status:** ⚠️ NEEDS FIX
- Found 20+ files using `NEXT_PUBLIC_BACKEND_URL` or `NEXT_PUBLIC_API_URL`
- Need to migrate all to `NEXT_PUBLIC_API_BASE`

**Action Items:**
- [ ] Replace all `NEXT_PUBLIC_BACKEND_URL` with `NEXT_PUBLIC_API_BASE`
- [ ] Replace all `NEXT_PUBLIC_API_URL` with `NEXT_PUBLIC_API_BASE`
- [ ] Use `getBackendUrl()` from `lib/api/proxy.ts`

---

### 2. ✅ Next.js API = ТОЛЬКО proxy

**Requirement:** Никакой бизнес-логики в app/api routes

**Files:**
- ✅ `lib/api/proxy.ts` - Created unified proxy helper
- ✅ `docs/examples/EXAMPLE_PROXY_ROUTE.ts` - Reference implementation

**What to check:**
```bash
# Look for business logic in API routes (should have minimal results)
grep -r "if.*role\|SELECT\|INSERT\|UPDATE\|DELETE\|aggregate\|calculate" app/api --include="*.ts"
```

**Current Status:** ⚠️ NEEDS AUDIT
- Most routes do simple proxying ✅
- Some routes may have validation logic (need review)

**Action Items:**
- [ ] Audit all `app/api/**/*.ts` files
- [ ] Move business logic to backend
- [ ] Keep only: auth extraction, basic validation, proxying

---

### 3. ✅ ЕДИНЫЙ proxy helper

**Requirement:** Все route.ts используют одинаковый код

**Files:**
- ✅ `lib/api/proxy.ts` - Created with `proxyToBackend()`

**Features:**
- ✅ Authorization header forwarding
- ✅ Accept-Language forwarding
- ✅ X-Request-ID generation
- ✅ Timeout handling (30s default)
- ✅ Structured error responses
- ✅ Next.js 15 cookies support

**Current Status:** ✅ CREATED, ⚠️ NOT USED YET

**Action Items:**
- [ ] Migrate `/app/api/admin/ingredients/suggest/route.ts` to use proxy
- [ ] Migrate `/app/api/admin/recipes/[id]/route.ts` to use proxy
- [ ] Migrate `/app/api/settings/route.ts` to use proxy
- [ ] Migrate remaining 50+ routes

---

### 4. ✅ Frontend API Client (lib/api)

**Requirement:** Компоненты используют `api.method()`, НЕ `fetch('/api/...')`

**Files:**
- ✅ `lib/api/ingredients.api.ts` - Has `getIngredientSuggestions()`
- ✅ `lib/api/recipes-ai.api.ts` - Has AI methods
- ✅ `lib/api/settings.ts` - Has settings methods
- ⚠️ Other files need review

**What to check:**
```bash
# Find components calling /api directly (should minimize)
grep -r "fetch.*'/api/" components --include="*.tsx" --include="*.ts"
```

**Current Status:** ⚠️ MIXED
- Some components use API clients ✅
- Others call `fetch('/api/...')` directly ❌

**Action Items:**
- [ ] Create missing API clients for all endpoints
- [ ] Update components to use API clients
- [ ] Remove direct `fetch()` calls from components

---

### 5. ✅ Обработка ошибок ТОЛЬКО по error.code

**Requirement:** НИКОГДА `if (res.status === 401)`, ВСЕГДА `if (error.code === 'UNAUTHORIZED')`

**Files:**
- ✅ `lib/api/error-handler.ts` - Created with `handleApiError()`

**Features:**
- ✅ Structured error types
- ✅ Code-based routing (`UNAUTHORIZED`, `FORBIDDEN`, `VALIDATION_ERROR`, etc.)
- ✅ i18n error messages
- ✅ Sentry integration
- ✅ Request ID logging

**What to check:**
```bash
# Find HTTP status checks (should be 0)
grep -r "response\.status.*===.*40[13]\|status.*===.*40[13]" components lib --include="*.tsx" --include="*.ts"
```

**Current Status:** ❌ FOUND 4 VIOLATIONS
- `src/lib/admin-api.ts:78` - Uses `response.status === 401`
- `lib/auth-interceptor.ts:51` - Uses `response.status === 401`
- `app/(user)/recipes/[id]/page.tsx:159` - Uses `response.status === 401`
- `contexts/UserContext.tsx:74` - Uses `response.status === 401`

**Action Items:**
- [ ] Fix `src/lib/admin-api.ts` - Use `error.code`
- [ ] Fix `lib/auth-interceptor.ts` - Use `error.code`
- [ ] Fix `app/(user)/recipes/[id]/page.tsx` - Use `error.code`
- [ ] Fix `contexts/UserContext.tsx` - Use `error.code`

---

### 6. ✅ Autocomplete защищён

**Requirement:** query.length >= 2, debounce >= 300ms, AbortController

**Files:**
- ✅ `components/admin/recipes/IngredientAutocomplete.tsx` - FIXED with AbortController
- ⚠️ `components/fridge/IngredientAutocomplete.tsx` - Needs same fix

**Features:**
- ✅ Minimum 2 characters
- ✅ 300ms debounce
- ✅ AbortController (cancels previous requests)
- ✅ No retry on 500
- ✅ Empty result = [], not error

**Current Status:** ⚠️ PARTIALLY FIXED
- Admin autocomplete ✅ FIXED
- Fridge autocomplete ⚠️ NEEDS FIX

**Action Items:**
- [ ] Apply AbortController to `components/fridge/IngredientAutocomplete.tsx`
- [ ] Search for other autocomplete components
- [ ] Apply same pattern everywhere

---

### 7. ⚠️ Request ID логируется

**Requirement:** X-Request-ID в каждом запросе, логируется в Sentry/console

**Files:**
- ✅ `lib/api/proxy.ts` - Generates request IDs
- ✅ `lib/api/error-handler.ts` - Logs request IDs

**Current Status:** ⚠️ PARTIAL
- Proxy generates IDs ✅
- Error handler logs IDs ✅
- But most routes don't use proxy yet ❌

**Action Items:**
- [ ] Migrate all routes to use `proxyToBackend()`
- [ ] Verify X-Request-ID in browser DevTools
- [ ] Add Sentry integration
- [ ] Log IDs to console in development

---

### 8. ⚠️ Локальная разработка = прод-поведение

**Requirement:** Один и тот же код path для dev и prod

**Current Status:** ⚠️ NEEDS VERIFICATION
- API base URLs configured for both environments ✅
- Components should use same code ✅
- Need to test locally

**Action Items:**
- [ ] Start dev server: `npm run dev`
- [ ] Test all API calls
- [ ] Verify no direct backend calls
- [ ] Verify all routes go through `/api`

---

## 🎯 Priority Order (What to Fix First)

### P0 - CRITICAL (Breaking Production)
1. **Unified API Base** - Replace all env var inconsistencies
2. **HTTP Status Checks** - Fix 4 files using `response.status === 401`
3. **Migrate routes to proxy** - At least critical ones (auth, ingredients, recipes)

### P1 - HIGH (Prevents Debugging)
4. **Request ID logging** - Finish proxy migration
5. **Error handling** - Update all components to use `handleApiError()`

### P2 - MEDIUM (Quality of Life)
6. **API Clients** - Create missing clients, remove direct fetch()
7. **Fridge Autocomplete** - Add AbortController
8. **Local dev testing** - Verify everything works

---

## 🔍 Quick Verification Commands

```bash
# 1. Check for inconsistent env vars
grep -r "NEXT_PUBLIC_BACKEND_URL\|NEXT_PUBLIC_API_URL" app/api --include="*.ts" | wc -l
# Should be: 0

# 2. Check for HTTP status checks
grep -r "response\.status.*===.*40[13]" components lib --include="*.tsx" --include="*.ts" | wc -l
# Should be: 0

# 3. Check for direct fetch() in components
grep -r "fetch.*'/api/" components --include="*.tsx" | wc -l
# Should be: minimal

# 4. Check for business logic in API routes
grep -r "if.*role\|SELECT\|INSERT" app/api --include="*.ts" | wc -l
# Should be: 0

# 5. Verify proxy usage
grep -r "proxyToBackend" app/api --include="*.ts" | wc -l
# Should be: 50+ (one per route)
```

---

## ✅ Success Criteria

When all items are checked:
- ✅ One `NEXT_PUBLIC_API_BASE` variable
- ✅ All routes use `proxyToBackend()`
- ✅ No HTTP status checks in business logic
- ✅ All components use API clients
- ✅ Request IDs in all requests
- ✅ Autocomplete with AbortController
- ✅ Dev = Prod code paths
- ✅ No CORS errors
- ✅ All errors logged with request_id

---

## 📊 Current Progress

**Overall:** 35% Complete

| Category | Status | Progress |
|----------|--------|----------|
| API Base | ⚠️ Needs Fix | 50% |
| Proxy Helper | ✅ Created | 100% |
| Routes Migration | ❌ Not Started | 0% |
| Error Handling | ⚠️ Partial | 40% |
| API Clients | ⚠️ Partial | 60% |
| Request IDs | ⚠️ Partial | 30% |
| Autocomplete | ⚠️ Partial | 70% |
| Local Dev | ❌ Not Tested | 0% |

---

## 🚀 Next Steps

1. **Run verification commands** (see above)
2. **Fix P0 items** (API base, status checks, route migration)
3. **Test locally** (npm run dev)
4. **Deploy to production**
5. **Monitor errors** (Sentry, backend logs)

---

**Prepared by:** GitHub Copilot  
**Based on:** Backend team requirements (January 11, 2026)
