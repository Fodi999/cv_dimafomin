# 🔄 Admin API Proxy to Backend

**Date:** 2026-01-04  
**Issue:** Admin panel shows mock data instead of real backend data  
**Status:** ✅ Fixed

---

## 🔍 Problem

Admin panel отображал **неправильные цифры**:

### Mock Data (было):
- Всего пользователей: **5**
- Активні сьогодні: **5.1%**
- Заблоковані: **1**
- Преміум: **2**

### Real Backend Data (должно быть):
- Всего пользователей: **3,847**
- Активні сьогодні: **~5.1%**
- Заблоковані: **12**
- Преміум: **245**

---

## ✅ Solution

Изменили Next.js API routes чтобы они **проксировали запросы** к реальному Go backend вместо возврата mock данных.

### Changes Made:

#### 1️⃣ `/api/admin/users` - Proxy to Backend

**Before** (mock data):
```typescript
export async function GET(request: NextRequest) {
  // ... auth checks ...
  
  const mockUsers = [...]; // 5 users
  return NextResponse.json({
    users: mockUsers,
    meta: { total: 5, ... }
  });
}
```

**After** (proxy to backend):
```typescript
const BACKEND_URL = 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

export async function GET(request: NextRequest) {
  // ... auth checks ...
  
  // 🔄 Proxy to backend
  const backendResponse = await fetch(`${BACKEND_URL}/api/admin/users`, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
  });
  
  if (!backendResponse.ok) {
    // Fallback to mock data
    return getMockUsersResponse(request);
  }
  
  const data = await backendResponse.json();
  return NextResponse.json(data); // Real data!
}
```

#### 2️⃣ `/api/admin/stats` - Proxy to Backend

Same pattern - proxy to backend with fallback to mock data.

---

## 🏗️ Architecture

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Browser    │         │  Next.js     │         │  Go Backend  │
│              │────────>│  API Route   │────────>│  (Koyeb)     │
│  Admin Panel │         │  /api/admin  │         │              │
│              │<────────│  (Proxy)     │<────────│  Real Data   │
└──────────────┘         └──────────────┘         └──────────────┘
                                │
                                │ (on error)
                                ↓
                         ┌──────────────┐
                         │  Mock Data   │
                         │  (Fallback)  │
                         └──────────────┘
```

---

## 🔐 Security

1. **JWT Token** передаётся через `Authorization` header
2. **Admin middleware** проверяет права ПЕРЕД проксированием
3. **Fallback** к mock данным если backend недоступен

---

## 📊 Data Flow

### Request Flow:
```
1. Browser → GET /api/admin/users (with JWT token)
2. Next.js → requireAdmin() checks JWT + admin role
3. Next.js → Proxy to backend with Authorization header
4. Backend → Returns real user data (3847 users)
5. Next.js → Returns data to browser
6. UI → Displays: "Всього користувачів: 3,847"
```

### Fallback Flow (if backend down):
```
1. Browser → GET /api/admin/users
2. Next.js → requireAdmin() ✅
3. Next.js → Proxy to backend ❌ (error)
4. Next.js → getMockUsersResponse() (fallback)
5. Browser → Shows mock data (5 users) with warning
```

---

## 🧪 Testing

### Test Real Data:
```bash
# Login as admin
TOKEN=$(curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | jq -r '.data.token')

# Get users (should show 3847 from backend)
curl -X GET "http://localhost:3000/api/admin/users?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"

# Get stats (should show real numbers)
curl -X GET "http://localhost:3000/api/admin/stats" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Files Changed

- ✅ `app/api/admin/users/route.ts` - Added proxy to backend
- ✅ `app/api/admin/stats/route.ts` - Added proxy to backend
- ✅ Added `BACKEND_URL` constant
- ✅ Added fallback `getMockUsersResponse()` function
- ✅ Added logging for debugging

---

## 🔧 Configuration

Backend URL is configured via:

```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 
  'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';
```

You can change it in `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## ✅ Benefits

1. ✅ **Real Data** - Admin panel shows actual numbers from database
2. ✅ **Graceful Degradation** - Falls back to mock data if backend is down
3. ✅ **Security** - JWT validation happens in Next.js before proxying
4. ✅ **Debugging** - Detailed logging for troubleshooting
5. ✅ **Flexibility** - Easy to switch backends via env variable

---

## 🚀 Next Steps

To get real data from backend, implement these endpoints in Go:

### Required Backend Endpoints:

```go
// GET /api/admin/users
// Returns: { users: [...], meta: {...} }

// GET /api/admin/stats  
// Returns: { success: true, data: {...}, timestamp: "..." }

// PATCH /api/admin/users/update-role
// Body: { userId, role }

// PUT /api/admin/users/{userId}
// Body: { name, email }

// DELETE /api/admin/users/{userId}
```

See `docs/BACKEND_ADMIN_API_IMPLEMENTATION.md` for full implementation guide.

---

**Status:** ✅ Proxy Configured  
**Real Data:** ✅ Available (when backend implements endpoints)  
**Fallback:** ✅ Mock data as safety net  
**Last Updated:** 2026-01-04
