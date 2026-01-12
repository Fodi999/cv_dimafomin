# 🚀 Frontend Production Setup - Quick Start

**Status:** 📋 Infrastructure Ready | ⚠️ Migration Required (63% Complete)

---

## 🎯 What Was Done

### ✅ Infrastructure Created (100%)

1. **Environment Configuration**
   - `.env.local` - Development config with unified `NEXT_PUBLIC_API_BASE`
   - `.env.production` - Production config (Koyeb backend)

2. **Core Libraries**
   - `lib/api/proxy.ts` - Unified proxy helper (360 lines)
   - `lib/api/error-handler.ts` - Error handling by code (290 lines)

3. **Documentation**
   - `docs/FRONTEND_PRODUCTION_CHECKLIST.md` - Complete requirements
   - `docs/API_ROUTES_MIGRATION.md` - Step-by-step migration guide
   - `docs/FRONTEND_SETUP_SUMMARY.md` - Implementation summary
   - `docs/API_STRUCTURE_MAP.md` - Full API architecture map
   - `docs/examples/EXAMPLE_PROXY_ROUTE.ts` - Copy-paste template

4. **Component Fixes**
   - Admin autocomplete - Added AbortController

5. **Audit Script**
   - `scripts/audit-frontend.sh` - Automated verification

---

## ⚠️ What Needs Migration

Run audit to see current status:
```bash
./scripts/audit-frontend.sh
```

**Current Score:** 63% (12/19 checks passed)

### 🔴 Critical Issues (Must Fix)

1. **23 files** - Inconsistent env variables
2. **3 files** - HTTP status checks instead of error.code
3. **60 routes** - Not using proxyToBackend() yet

### 🟡 Warnings (Should Fix)

4. **3 components** - Autocomplete without AbortController
5. **All components** - Not using handleApiError() yet

---

## 🚀 Quick Start (1 hour to production-ready)

### Step 1: Run Audit (2 minutes)

```bash
cd /path/to/project
./scripts/audit-frontend.sh
```

This shows exactly what needs fixing.

---

### Step 2: Fix Environment Variables (15 minutes)

**Problem:** 23 files use `NEXT_PUBLIC_BACKEND_URL` or `NEXT_PUBLIC_API_URL`

**Find them:**
```bash
grep -r "NEXT_PUBLIC_BACKEND_URL\|NEXT_PUBLIC_API_URL" app/api --include="*.ts" -l
```

**Fix pattern:**
```typescript
// ❌ Before
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://...";

// ✅ After
import { getBackendUrl } from '@/lib/api/proxy';
const BACKEND_URL = getBackendUrl();
```

**Or (simpler):**
```typescript
// If just defining constant
const BACKEND_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/api'
  : (process.env.NEXT_PUBLIC_API_BASE || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api');
```

---

### Step 3: Fix HTTP Status Checks (10 minutes)

**Problem:** 3 files check `response.status === 401`

**Find them:**
```bash
grep -r "response\.status.*===.*40[13]" components lib src --include="*.tsx" --include="*.ts" -l
```

**Files:**
1. `src/lib/admin-api.ts:78`
2. `lib/auth-interceptor.ts:51`
3. `contexts/UserContext.tsx:74`

**Fix pattern:**
```typescript
// ❌ Before
if (response.status === 401) {
  router.push('/login');
}

// ✅ After
import { handleApiError } from '@/lib/api/error-handler';

try {
  const data = await fetchApi();
} catch (error) {
  handleApiError(error, {
    onUnauthorized: () => router.push('/login'),
    onForbidden: () => toast.error('Access denied'),
    onDefault: (message) => toast.error(message)
  });
}
```

---

### Step 4: Migrate Auth Routes (20 minutes)

**Most critical** - Start with auth endpoints.

**Files to migrate:**
- `app/api/auth/login/route.ts`
- `app/api/auth/register/route.ts`
- `app/api/auth/me/route.ts`
- `app/api/auth/logout/route.ts`

**Template:**
```typescript
// app/api/auth/login/route.ts
import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  return proxyToBackend(request, {
    endpoint: '/auth/login',
    method: 'POST',
    body,
    skipAuth: true // Login doesn't need token
  });
}
```

**See full guide:** `docs/API_ROUTES_MIGRATION.md`

---

### Step 5: Test (10 minutes)

```bash
# Build
npm run build

# Run dev server
npm run dev

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# Should return:
# {
#   "success": true,
#   "data": { "token": "...", "user": {...} },
#   "meta": { "request_id": "..." }
# }
```

---

### Step 6: Run Audit Again

```bash
./scripts/audit-frontend.sh
```

**Target:** 100% (19/19 checks passed)

---

## 📚 Documentation Guide

### For Quick Reference
- **README_FRONTEND.md** (this file) - Quick start
- `docs/examples/EXAMPLE_PROXY_ROUTE.ts` - Copy-paste template

### For Deep Dive
- `docs/FRONTEND_SETUP_SUMMARY.md` - What was done, what's needed
- `docs/FRONTEND_PRODUCTION_CHECKLIST.md` - Complete checklist
- `docs/API_ROUTES_MIGRATION.md` - Detailed migration guide
- `docs/API_STRUCTURE_MAP.md` - Full API architecture

### For Development
- `lib/api/proxy.ts` - Source code with JSDoc
- `lib/api/error-handler.ts` - Error handling patterns

---

## 🎯 Migration Priority

### P0 - Do First (1 hour)
1. ✅ Fix env variables (23 files)
2. ✅ Fix HTTP checks (3 files)
3. ✅ Migrate auth routes (4 files)

After this, system is **production-ready** (basic).

### P1 - Do Next (2 hours)
4. Migrate admin routes (12 files)
5. Migrate user/fridge routes (15 files)
6. Update components to use handleApiError()

After this, system is **production-ready** (stable).

### P2 - Polish (1 hour)
7. Migrate remaining routes (29 files)
8. Fix autocomplete components (3 files)
9. Add Sentry integration

After this, system is **production-ready** (perfect).

---

## 🔍 Verification Commands

```bash
# 1. Check env vars (should be 0)
grep -r "NEXT_PUBLIC_BACKEND_URL\|NEXT_PUBLIC_API_URL" app/api --include="*.ts" | wc -l

# 2. Check HTTP status (should be 0)
grep -r "response\.status.*===.*40[13]" components lib src --include="*.tsx" --include="*.ts" | wc -l

# 3. Check proxy usage (should increase from 0 to 60)
grep -r "proxyToBackend" app/api --include="*.ts" | wc -l

# 4. Run full audit
./scripts/audit-frontend.sh
```

---

## ✅ Success Criteria

**Before Migration:**
- ❌ 23 files with wrong env vars
- ❌ 3 files checking HTTP status
- ❌ 60 routes without proxy
- ❌ Score: 63%

**After Migration:**
- ✅ 0 files with wrong env vars
- ✅ 0 files checking HTTP status
- ✅ 60 routes with proxyToBackend()
- ✅ Score: 100%

---

## 🆘 Need Help?

### Common Issues

**Q: Build fails after migration**
```bash
# Check imports
npm run build 2>&1 | grep "Cannot find module"

# Fix import paths
# Should be: @/lib/api/proxy
# Not: ../../../lib/api/proxy
```

**Q: 401 errors in development**
```bash
# Check backend is running
curl http://localhost:8080/api/health

# Check .env.local has correct URL
cat .env.local | grep NEXT_PUBLIC_API_BASE
```

**Q: CORS errors still appear**
```bash
# Check you're not calling backend directly
grep -r "fetch.*8080" components --include="*.tsx"

# Should always go through /api routes
```

---

## 📞 Contact

**Created by:** GitHub Copilot  
**Date:** January 11, 2026  
**Based on:** Backend team requirements

**Questions?** See `docs/FRONTEND_SETUP_SUMMARY.md` for detailed explanation.

---

## 🎉 You're Ready!

Run audit, fix P0 issues, test, and deploy. That's it!

```bash
./scripts/audit-frontend.sh
# Fix issues shown
npm run build
npm run dev
# Test everything
# Deploy 🚀
```
