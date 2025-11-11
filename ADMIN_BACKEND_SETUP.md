# Admin Panel - Backend API Setup Guide

## Overview
The frontend admin panel is now fully implemented and styled, but requires 8 backend API endpoints to be functional. This document outlines what needs to be built on the backend.

## Current Status
✅ **Frontend**: Admin panel fully styled with all pages ready
✅ **Authentication**: Role-based access control working (JWT tokens with role field)
✅ **API Client**: Centralized `adminApi` object created in `lib/api.ts`
❌ **Backend**: API endpoints missing (returning 404)

## Required Backend Endpoints

### 1. **Get All Users**
```
GET /api/admin/users
Headers: Authorization: Bearer {token}
Response: 
{
  "users": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "role": "admin|instructor|student",
      "createdAt": "ISO-8601 date"
    }
  ]
}
```

### 2. **Update User**
```
PUT /api/admin/users/{id}
Headers: Authorization: Bearer {token}
Body:
{
  "name": "string",
  "email": "string",
  "role": "admin|instructor|student"
}
Response: Updated user object
```

### 3. **Delete User**
```
DELETE /api/admin/users/{id}
Headers: Authorization: Bearer {token}
Response: { "success": true } or { "error": "message" }
```

### 4. **Update User Role**
```
PATCH /api/admin/users/update-role
Headers: Authorization: Bearer {token}
Body:
{
  "userId": "uuid",
  "role": "admin|instructor|student"
}
Response: { "success": true, "user": {...} }
```

### 5. **Get All Orders**
```
GET /api/admin/orders
Headers: Authorization: Bearer {token}
Response:
{
  "orders": [
    {
      "id": "uuid",
      "userName": "string",
      "userEmail": "string",
      "amount": "number",
      "status": "pending|completed|cancelled",
      "createdAt": "ISO-8601 date",
      "items": []
    }
  ]
}
```

### 6. **Get Recent Orders (Last 10)**
```
GET /api/admin/orders/recent
Headers: Authorization: Bearer {token}
Response: Same as above, limited to 10 most recent
```

### 7. **Update Order Status**
```
PUT /api/admin/orders/{id}/status
Headers: Authorization: Bearer {token}
Body:
{
  "status": "pending|completed|cancelled"
}
Response: Updated order object
```

### 8. **Get Admin Statistics**
```
GET /api/admin/stats
Headers: Authorization: Bearer {token}
Response:
{
  "totalUsers": number,
  "totalOrders": number,
  "totalRevenue": number,
  "adminCount": number,
  "instructorCount": number,
  "studentCount": number
}
```

## Security Requirements

✅ **All endpoints MUST:**
1. Require valid JWT token with `Authorization: Bearer {token}` header
2. Verify user role is "admin" (only admins can access)
3. Return 401 for missing/invalid token
4. Return 403 for non-admin users
5. Return 404 for not found resources
6. Return 400 for validation errors

## Frontend Implementation Details

### API Client (`lib/api.ts`)
The frontend has a centralized `adminApi` object:

```typescript
export const adminApi = {
  // Users
  getUsers: (token) => apiFetch("/admin/users", { token }),
  updateUser: (id, data, token) => apiFetch(`/admin/users/${id}`, { method: "PUT", token, body: ... }),
  deleteUser: (id, token) => apiFetch(`/admin/users/${id}`, { method: "DELETE", token }),
  updateUserRole: (userId, role, token) => apiFetch("/admin/users/update-role", { method: "PATCH", token, body: ... }),
  
  // Orders
  getOrders: (token) => apiFetch("/admin/orders", { token }),
  getRecentOrders: (token) => apiFetch("/admin/orders/recent", { token }),
  updateOrderStatus: (orderId, status, token) => apiFetch(`/admin/orders/${orderId}/status`, { method: "PUT", token, body: ... }),
  
  // Stats
  getStats: (token) => apiFetch("/admin/stats", { token }),
};
```

### Authentication Flow
1. User logs in with admin credentials
2. Backend returns JWT token with `role: "admin"` in payload
3. Token stored in localStorage as `authToken`
4. Frontend extracts role from JWT for fallback (if profile endpoint fails)
5. All admin API calls send `Authorization: Bearer {authToken}` header

### Frontend Pages Using These Endpoints

**`/app/admin/page.tsx`** (Dashboard)
- Uses: `adminApi.getStats(token)`
- Displays: Total users, orders, revenue, user breakdown

**`/app/admin/users/page.tsx`** (User Management)
- Uses: `adminApi.getUsers(token)`, `deleteUser()`, `updateUserRole()`
- Features: Search, role filtering, delete, role change

**`/app/admin/orders/page.tsx`** (Order Management)
- Uses: `adminApi.getOrders(token)`, `updateOrderStatus()`
- Features: Search by name/email/ID, status filtering, status updates

**`/app/admin/settings/page.tsx`** (Settings)
- Currently: localStorage-based (no API calls)
- Future: Could add settings persistence endpoint

## Testing the Admin Panel

1. **Login as Admin**
   - Email: `admin@example.com`
   - Password: `admin_password_123` (or your configured password)

2. **Verify Authentication**
   - Check browser console for role: `admin`
   - Navigate to `/admin` - should show admin dashboard
   - Navigate to `/profile` - should show role badge "⚔️ Администратор"

3. **Test Each Endpoint**
   - Dashboard: Should load stats
   - Users page: Should list all users
   - Orders page: Should list all orders
   - Try search/filter features
   - Try updating statuses/roles

## Error Handling

The frontend API client (`apiFetch` in `lib/api.ts`) handles:
- ✅ Network errors
- ✅ 404 Not Found
- ✅ 401 Unauthorized
- ✅ 500 Server errors
- ✅ Response validation

Errors log to console with format:
```
❌ API Error 404: {endpoint, method, status, message}
```

## Integration Points

### Before Backend Implementation
Backend should ensure:
1. ✅ JWT tokens include `role` field in payload
2. ✅ Role-based access control middleware exists
3. ✅ User management endpoints exist (could extend existing user endpoints)
4. ✅ Order management endpoints exist (could extend existing order endpoints)

### Token Payload Example
```json
{
  "userId": "7ec8aba4-8195-4be1-a9a8-067c30aae306",
  "email": "admin@example.com",
  "role": "admin",
  "exp": 1762904491,
  "iat": 1762818091
}
```

## Documentation Files Created

1. **ADMIN_BACKEND_SETUP.md** (this file) - Backend requirements
2. **ADMIN_USAGE_GUIDE.md** - How to use the admin panel
3. **ADMIN_DESIGN_UPDATE.md** - Design system migration details
4. **ADMIN_SEPARATION_FIX.md** - Role-based authentication explanation
5. **ADMIN_LOGIN_GUIDE.md** - Login and access guide

## Next Steps

1. ✅ **Frontend**: All admin pages ready
2. ⏳ **Backend**: Implement 8 API endpoints above
3. ⏳ **Testing**: Test all endpoints with admin account
4. ⏳ **Production**: Deploy with fully functional admin panel

## Color Palette Reference

Admin panel uses the main site's design system:
- **Primary**: `#3BC864` (Green) - Main action buttons, badges
- **Secondary**: `#C5E98A` (Light Green) - Supporting elements
- **Accent**: `#2B6A79` (Blue) - Alternative actions
- **Destructive**: `#EF4444` (Red) - Delete/danger actions
- **Background**: `#FEF9F5` (Light)
- **Foreground**: `#240F24` (Dark)

All styling uses CSS variables from `globals.css` for automatic dark mode support.
