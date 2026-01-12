# 🔄 API Routes Migration Guide

**Goal:** Migrate all `app/api/**/*.ts` routes to use unified `proxyToBackend()`

---

## 📝 Before/After Pattern

### ❌ BEFORE (Old Pattern)

```typescript
// app/api/admin/ingredients/suggest/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://...";

export async function GET(request: NextRequest) {
  // Manual cookie extraction
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Manual query params
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  // Manual fetch
  const response = await fetch(`${BACKEND_URL}/api/admin/ingredients/suggest?q=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept-Language': 'pl'
    }
  });
  
  // Manual error handling
  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json(error, { status: response.status });
  }
  
  const data = await response.json();
  return NextResponse.json(data);
}
```

**Problems:**
- 30+ lines of boilerplate
- Inconsistent error handling
- No request ID
- No timeout
- Manual cookie extraction
- Hardcoded URLs

---

### ✅ AFTER (New Pattern)

```typescript
// app/api/admin/ingredients/suggest/route.ts
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '10';
  
  // Simple validation (optional)
  if (!query || query.length < 2) {
    return Response.json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Query must be at least 2 characters'
      }
    }, { status: 400 });
  }
  
  // Just proxy to backend - THAT'S IT!
  return proxyToBackend(request, {
    endpoint: `/admin/ingredients/suggest?q=${encodeURIComponent(query)}&limit=${limit}`,
    method: 'GET',
    timeout: 5000
  });
}
```

**Benefits:**
- 15 lines (50% less code)
- Consistent error format
- Auto request ID
- Auto timeout
- Auto cookie extraction
- Environment-aware URLs

---

## 🎯 Migration Steps

### Step 1: Install proxy helper

Already done ✅ - `lib/api/proxy.ts` exists

### Step 2: Update imports

```typescript
// Remove old imports
- import { cookies } from "next/headers";
- const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "...";

// Add new import
+ import { proxyToBackend } from "@/lib/api/proxy";
```

### Step 3: Replace route handler

```typescript
export async function GET(request: NextRequest) {
  // 1. Extract query params (if needed)
  const searchParams = request.nextUrl.searchParams;
  const param = searchParams.get('param');
  
  // 2. Simple validation (optional)
  if (!param) {
    return Response.json({
      success: false,
      error: { code: 'MISSING_FIELD', message: 'Missing param' }
    }, { status: 400 });
  }
  
  // 3. Proxy to backend
  return proxyToBackend(request, {
    endpoint: `/your/endpoint?param=${param}`,
    method: 'GET'
  });
}
```

### Step 4: For POST/PUT/PATCH with body

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Optional: validate required fields
  if (!body.name) {
    return Response.json({
      success: false,
      error: { code: 'MISSING_FIELD', message: 'Missing name' }
    }, { status: 400 });
  }
  
  return proxyToBackend(request, {
    endpoint: '/your/endpoint',
    method: 'POST',
    body // Automatically stringified
  });
}
```

### Step 5: For public endpoints (no auth)

```typescript
export async function GET(request: NextRequest) {
  return proxyToBackend(request, {
    endpoint: '/public/endpoint',
    method: 'GET',
    skipAuth: true // No token required
  });
}
```

---

## 📋 Files to Migrate (Priority Order)

### P0 - Critical (Migrate First)

```bash
# Auth endpoints
app/api/auth/login/route.ts
app/api/auth/register/route.ts
app/api/auth/me/route.ts
app/api/auth/logout/route.ts

# Settings
app/api/settings/route.ts

# Admin ingredients (CORS issues)
app/api/admin/ingredients/suggest/route.ts
app/api/admin/ingredients/resolve/route.ts
app/api/admin/ingredients/route.ts
app/api/admin/ingredients/[id]/route.ts

# Admin recipes (CORS issues)
app/api/admin/recipes/preview-ai/route.ts
app/api/admin/recipes/create-ai/route.ts
app/api/admin/recipes/[id]/route.ts
app/api/admin/recipes/route.ts
```

### P1 - High Priority

```bash
# User endpoints
app/api/user/profile/route.ts
app/api/user/language/route.ts
app/api/user/tokens/add/route.ts

# Fridge
app/api/fridge/items/route.ts
app/api/fridge/items/[id]/route.ts
app/api/fridge/add-missing/route.ts
app/api/fridge/deduct/route.ts

# Recipes (public)
app/api/recipes/route.ts
app/api/recipes/[id]/route.ts
app/api/recipes/available/route.ts
```

### P2 - Medium Priority

```bash
# Admin users
app/api/admin/users/route.ts
app/api/admin/users/[id]/route.ts
app/api/admin/users/[id]/role/route.ts
app/api/admin/users/[id]/status/route.ts

# Token bank
app/api/token-bank/me/route.ts
app/api/token-bank/me/transactions/route.ts

# Treasury
app/api/admin/treasury/stats/route.ts
app/api/public/treasury/route.ts
```

### P3 - Low Priority

```bash
# Meta endpoints
app/api/meta/categories/route.ts
app/api/meta/cuisines/route.ts
app/api/meta/countries/route.ts

# Stats
app/api/stats/public/route.ts

# Catalog
app/api/catalog/ingredients/search/route.ts
```

---

## 🔧 Automated Migration Script

Create this script to automate the migration:

```bash
#!/bin/bash
# migrate-routes.sh

# Find all route files
find app/api -name "route.ts" -type f | while read file; do
  echo "Checking $file..."
  
  # Check if already uses proxyToBackend
  if grep -q "proxyToBackend" "$file"; then
    echo "  ✅ Already migrated"
  else
    echo "  ⚠️  Needs migration"
    
    # Check for problematic patterns
    if grep -q "NEXT_PUBLIC_BACKEND_URL\|NEXT_PUBLIC_API_URL" "$file"; then
      echo "  ❌ Uses old env var"
    fi
    
    if grep -q "const.*cookies.*=.*await cookies()" "$file"; then
      echo "  ❌ Manual cookie extraction"
    fi
  fi
done
```

Run it:
```bash
chmod +x migrate-routes.sh
./migrate-routes.sh
```

---

## ✅ Verification Checklist

After migrating each file:

- [ ] File imports `proxyToBackend` from `@/lib/api/proxy`
- [ ] No direct `fetch()` to backend
- [ ] No manual cookie extraction
- [ ] No `NEXT_PUBLIC_BACKEND_URL` or `NEXT_PUBLIC_API_URL`
- [ ] Uses `NEXT_PUBLIC_API_BASE` (via proxy helper)
- [ ] Returns structured error format: `{ success: false, error: { code, message } }`
- [ ] No business logic (only validation + proxying)
- [ ] Build succeeds: `npm run build`
- [ ] Endpoint works in development
- [ ] Logs show request ID

---

## 🧪 Testing After Migration

```bash
# 1. Build succeeds
npm run build

# 2. Start dev server
npm run dev

# 3. Test endpoint
curl -X GET "http://localhost:3000/api/admin/ingredients/suggest?q=томат" \
  -H "Cookie: token=YOUR_TOKEN" \
  -v

# 4. Check response format
# Should have:
# - "success": true/false
# - "data": {...} or "error": {...}
# - "meta": { "request_id": "..." }

# 5. Check logs
# Should see:
# [Proxy] <request_id> → GET http://localhost:8080/api/admin/ingredients/suggest?q=томат
# [Proxy] <request_id> ← 200 (123ms)
```

---

## 🚨 Common Migration Issues

### Issue 1: Missing body in POST

**Error:** Backend returns 400 "Missing body"

**Cause:**
```typescript
// Wrong
return proxyToBackend(request, {
  endpoint: '/endpoint',
  method: 'POST'
  // Missing body!
});
```

**Fix:**
```typescript
const body = await request.json();

return proxyToBackend(request, {
  endpoint: '/endpoint',
  method: 'POST',
  body // Add body
});
```

---

### Issue 2: Query params not encoded

**Error:** Backend returns 400 "Invalid query"

**Cause:**
```typescript
// Wrong - special chars not encoded
endpoint: `/suggest?q=${query}`
```

**Fix:**
```typescript
// Right - use encodeURIComponent
endpoint: `/suggest?q=${encodeURIComponent(query)}`
```

---

### Issue 3: 401 on public endpoints

**Error:** "Authentication required"

**Cause:**
```typescript
// Wrong - tries to get auth token for public endpoint
return proxyToBackend(request, {
  endpoint: '/public/stats',
  method: 'GET'
});
```

**Fix:**
```typescript
return proxyToBackend(request, {
  endpoint: '/public/stats',
  method: 'GET',
  skipAuth: true // Add this
});
```

---

## 📊 Migration Progress Tracker

Create this file to track progress:

```markdown
# app/api Routes Migration Status

## Auth (4 routes)
- [ ] login/route.ts
- [ ] register/route.ts
- [ ] me/route.ts
- [ ] logout/route.ts

## Admin Ingredients (4 routes)
- [ ] route.ts
- [ ] [id]/route.ts
- [ ] suggest/route.ts
- [ ] resolve/route.ts

## Admin Recipes (4 routes)
- [ ] route.ts
- [ ] [id]/route.ts
- [ ] preview-ai/route.ts
- [ ] create-ai/route.ts

... (continue for all categories)

**Total:** 0/55 routes migrated (0%)
```

---

**Ready to start?** Begin with P0 files!
