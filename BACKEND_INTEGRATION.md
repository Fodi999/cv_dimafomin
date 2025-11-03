# 🔗 Backend Integration Guide

## ✅ UUID Implementation Complete

### Current Status
Frontend теперь использует правильные UUID форматы для работы с бэкендом.

---

## 📋 UUID Usage

### Mock Users (Development)
```typescript
// Dima Fomin (Instructor)
const DIMA_UUID = "ef03cd81-71fd-429f-bb5f-8be5c9172ca8";

// Anna Kowalska (Student)
const ANNA_UUID = "fba50be3-e3c5-4d73-8ed8-cfb6422f7034";
```

### New User Registration
При регистрации нового пользователя автоматически генерируется UUID v4:
```typescript
import { generateUUID } from "@/lib/uuid";

const newUserId = generateUUID();
// Пример: "a3f2c1e5-7b8d-4c9a-b2e1-f4d6a8c7b9e0"
```

---

## 🔧 API Integration Points

### 1. Dashboard API
**Current Implementation:**
```typescript
// lib/api.ts
getDashboard: async (userId: string, token?: string) => {
  return apiFetch(`/user/${userId}/dashboard`, { token });
}

// Usage in component
const data = await academyApi.getDashboard(user.id, token);
```

**Backend Endpoint:**
```
GET /api/user/{userId}/dashboard
Response: { stats, activeCourses, certificates, recommendations }
```

### 2. Authentication Flow

#### Login
```typescript
// contexts/UserContext.tsx
const login = async (email: string, password: string) => {
  // TODO: Replace mock with real API
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  // data = { token: "jwt...", user: { id: "uuid...", ... } }
  
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("userId", data.user.id); // Store UUID
  setUser(data.user);
}
```

#### Registration
```typescript
const register = async (name: string, email: string, password: string) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  
  const data = await response.json();
  // Backend generates UUID and returns user object
  // data = { token: "jwt...", user: { id: "generated-uuid", ... } }
  
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("userId", data.user.id);
  setUser(data.user);
}
```

---

## 🛠 Helper Functions

### UUID Utils (`lib/uuid.ts`)

#### Generate UUID
```typescript
import { generateUUID } from "@/lib/uuid";

const newId = generateUUID();
// Returns: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
```

#### Validate UUID
```typescript
import { isValidUUID } from "@/lib/uuid";

isValidUUID("ef03cd81-71fd-429f-bb5f-8be5c9172ca8"); // true
isValidUUID("123"); // false
```

#### Extract User ID from JWT
```typescript
import { getUserIdFromToken } from "@/lib/uuid";

const token = localStorage.getItem("authToken");
const userId = getUserIdFromToken(token);
// Returns UUID from token payload
```

---

## 📝 Migration Checklist

### ✅ Completed
- [x] UUID helper functions created (`lib/uuid.ts`)
- [x] UserContext updated to use UUID instead of numeric IDs
- [x] Dashboard API endpoint fixed (`/user/:id/dashboard`)
- [x] Mock users use real backend UUIDs
- [x] New registrations generate valid UUIDs

### 🔄 TODO: API Integration
- [ ] Replace mock login with real API call
- [ ] Replace mock register with real API call
- [ ] Implement token validation on app load
- [ ] Add token refresh logic
- [ ] Implement profile update API
- [ ] Implement avatar upload to Cloudinary
- [ ] Add error handling for API failures

---

## 🎯 Testing

### Test with Real Backend
```typescript
// 1. Login as Dima Fomin
await login("fodi85999@gmail.com", "password");
// Should fetch dashboard from: GET /api/user/ef03cd81-71fd-429f-bb5f-8be5c9172ca8/dashboard

// 2. Login as Anna Kowalska
await login("anna@example.com", "password");
// Should fetch dashboard from: GET /api/user/fba50be3-e3c5-4d73-8ed8-cfb6422f7034/dashboard

// 3. Register new user
await register("Jan Nowak", "jan@example.com", "password");
// Backend returns new UUID, frontend uses it for all subsequent API calls
```

### Verify UUID Format
```bash
# All user IDs should match UUID v4 format:
# xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
#                ^--- version 4 indicator
#                     ^--- variant indicator (8, 9, a, or b)
```

---

## 🚨 Important Notes

1. **Never hardcode UUIDs in production** - Always get from backend
2. **Always validate UUID format** before API calls
3. **Store userId in localStorage** for persistence
4. **Extract userId from JWT token** if backend includes it
5. **Generate UUID only on backend** for new users

---

## 📞 Backend API Reference

### Base URL
```
Production: https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app
Development: http://localhost:3001
```

### Available Endpoints (with UUID)
```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/user/:userId/dashboard
GET    /api/user/:userId/profile
PATCH  /api/user/:userId/profile
GET    /api/user/:userId/courses
```

### Example Response Format
```json
{
  "user": {
    "id": "ef03cd81-71fd-429f-bb5f-8be5c9172ca8",
    "name": "Dima Fomin",
    "email": "fodi85999@gmail.com",
    "role": "instructor"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## ✅ Status: Ready for Backend Integration

Frontend готов к работе с backend API! Все UUID используются в правильном формате. 🚀
