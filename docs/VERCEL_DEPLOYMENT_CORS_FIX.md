# 🚨 CRITICAL: CORS Configuration for Production

## Problem

**Frontend (Vercel)**: `https://dima-fomin.pl`  
**Backend (Koyeb)**: `https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app`

Current error:
```
Access to fetch at 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/catalog/ingredient-categories' 
from origin 'https://dima-fomin.pl' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## Required Backend Configuration

### Go Backend (Chi Router)

Add CORS middleware with production domain:

```go
package main

import (
    "github.com/go-chi/chi/v5"
    "github.com/go-chi/cors"
)

func main() {
    r := chi.NewRouter()
    
    // ✅ CORS Configuration
    r.Use(cors.Handler(cors.Options{
        AllowedOrigins: []string{
            "http://localhost:3000",           // Local development
            "http://localhost:3001",           // Local development (alt port)
            "https://dima-fomin.pl",           // ✅ Production domain
            "https://*.vercel.app",            // ✅ Vercel preview deployments
        },
        AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{
            "Accept",
            "Authorization",
            "Content-Type",
            "X-CSRF-Token",
            "Accept-Language",        // ✅ Required for i18n
        },
        ExposedHeaders:   []string{"Link"},
        AllowCredentials: true,
        MaxAge:           300, // 5 minutes
    }))
    
    // Your routes...
}
```

---

## Vercel Environment Variables

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project → **Settings** → **Environment Variables**
3. Add these variables for **Production, Preview, Development**:

```bash
# Backend API Configuration
NEXT_PUBLIC_API_BASE=https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api
NEXT_PUBLIC_API_URL=https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://dima-fomin.pl
```

4. Click **Save**
5. Go to **Deployments** → Find latest deployment → Click **⋯** → **Redeploy**

---

## Testing After Fix

### 1. Test CORS Headers

```bash
curl -I -X OPTIONS \
  https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/catalog/ingredient-categories \
  -H "Origin: https://dima-fomin.pl" \
  -H "Access-Control-Request-Method: GET"
```

**Expected response:**
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://dima-fomin.pl
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Accept, Authorization, Content-Type, Accept-Language
Access-Control-Allow-Credentials: true
```

### 2. Test in Browser

1. Open `https://dima-fomin.pl/assistant`
2. Open DevTools → Console
3. **Should NOT see:**
   - ❌ `ERR_CONNECTION_REFUSED` to `localhost:8080`
   - ❌ CORS errors from Koyeb
4. **Should see:**
   - ✅ Successful API calls to Koyeb backend
   - ✅ AI recipe recommendations loading

---

## Current Issues Summary

| Issue | Status | Fix Required By |
|-------|--------|----------------|
| Frontend tries `localhost:8080` | 🔴 CRITICAL | **Vercel** (env vars) |
| Backend blocks `dima-fomin.pl` | 🔴 CRITICAL | **Backend** (CORS config) |
| Zustand deprecation warning | 🟡 WARNING | Frontend (low priority) |

---

## Priority Actions

### **IMMEDIATE (Backend Team)**

1. Update CORS configuration to allow `https://dima-fomin.pl`
2. Deploy to Koyeb
3. Test with curl command above

### **IMMEDIATE (DevOps/Frontend)**

1. Add environment variables to Vercel
2. Redeploy on Vercel
3. Clear browser cache and test

### **After Both Fixed**

1. Test full user flow:
   - Login → Assistant → Add recipe → Kitchen Dashboard
2. Monitor production errors
3. Verify all API endpoints work

---

## Additional Notes

### Why localhost:8080 Still Appears?

Because `NEXT_PUBLIC_API_BASE` fallback is hardcoded:

```typescript
// lib/api/ai-recipe.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080/api';
```

On Vercel, if env var is missing, it falls back to localhost.

### Why CORS is Critical?

Browsers block cross-origin requests by default. Since:
- Frontend: `https://dima-fomin.pl` (domain A)
- Backend: `https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app` (domain B)

Backend MUST explicitly allow domain A in CORS headers.

---

## Contact

If issues persist after fixes:
1. Check backend logs on Koyeb
2. Check Vercel deployment logs
3. Share console errors from browser DevTools

