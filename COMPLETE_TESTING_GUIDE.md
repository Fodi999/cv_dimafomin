# 🧪 Complete Testing Guide - End-to-End

**Project:** CV Sushi Chef  
**Date:** November 12, 2025  
**Status:** ✅ **Ready for Full Testing**

---

## 📋 Testing Checklist

### 1. Authentication Flow

#### Register New User
- [ ] Go to `/register`
- [ ] Fill form with email, password
- [ ] Click "Зарегистрироваться"
- [ ] Should receive JWT token
- [ ] Token should be stored in localStorage
- [ ] Should auto-redirect to `/profile/dashboard`

**Expected:**
```javascript
localStorage.getItem("token") // Should have JWT
localStorage.getItem("role") // Should be "user"
localStorage.getItem("user") // Should have user data
```

#### Login with Existing User
- [ ] Go to `/login`
- [ ] Use registered email + password
- [ ] Click "Войти"
- [ ] Should receive JWT token
- [ ] Should redirect to `/profile/dashboard` (for regular users)
- [ ] Should redirect to `/admin/dashboard` (for admin users)

**Test Data:**
```
Email: testuser@example.com
Password: testpassword123
```

---

### 2. User Dashboard (`/profile/dashboard`)

#### Profile Loading
- [ ] Dashboard should load without errors
- [ ] Should show user profile header with:
  - User name
  - Email address
  - Avatar image
  - Level and XP
  - Token balance

**Expected Data:**
```
Name: Test User (from backend)
Email: testuser@example.com (from backend)
Level: 1 (from backend)
XP: 0 (from backend)
Tokens: 0 (from wallet endpoint)
Courses: 0 (from backend)
```

#### Stats Display
- [ ] Should show StatsGrid with:
  - Followers count
  - Following count
  - Courses completed
  - Achievements

#### Wallet Summary
- [ ] Should show wallet card with:
  - Token balance
  - Total earned
  - Total spent
  - Transaction count

**Expected:**
```
Balance: 0 tokens
Earned: 0
Spent: 0
Transactions: 0
```

#### Error Handling
- [ ] Close browser DevTools console
- [ ] Delete token from localStorage: `localStorage.removeItem("token")`
- [ ] Refresh page
- [ ] Should auto-redirect to `/login`

#### Loading State
- [ ] Loading spinner should appear briefly
- [ ] Then content should load
- [ ] Spinner should disappear

---

### 3. Admin Dashboard (`/admin/dashboard`)

#### Role-Based Access
- [ ] Regular user tries to access `/admin/dashboard`
- [ ] Should redirect to `/` (homepage)
- [ ] Should not show admin panel

#### Admin Access
- [ ] Login as admin user
- [ ] Should auto-redirect to `/admin/dashboard`
- [ ] Should show admin sidebar
- [ ] Should show dashboard stats

#### Admin Stats Display
- [ ] Should show DashboardStats with:
  - Total users count
  - Active users count
  - Total orders count
  - Total revenue

**Expected:**
```
Total Users: 1542 (mock data)
Active Users: 342 (mock data)
Total Orders: 4821 (mock data)
Revenue: 125430.50 (mock data)
```

#### Admin Users Table
- [ ] Should show UsersTable with:
  - User name
  - Email
  - Level
  - XP
  - Token balance
  - Created date

**Expected Columns:**
```
Name | Email | Level | XP | Tokens | Created
----|-------|-------|----|---------|---------
Ivan Petrov | ivan@... | 8 | 4200 | 2500 | 2024-01-15
```

#### Admin Orders Table
- [ ] Should show OrdersTable with:
  - Order ID
  - Customer name
  - Amount
  - Item count
  - Status
  - Date

**Expected Columns:**
```
ID | Customer | Amount | Items | Status | Date
---|----------|--------|-------|--------|-----
ORD-001 | Ivan P. | $45.99 | 3 | completed | 2024-11-10
```

#### Error Handling
- [ ] Close DevTools
- [ ] Delete role: `localStorage.removeItem("role")`
- [ ] Refresh page
- [ ] Should show error message
- [ ] "Вернуться на вход" button should work

---

### 4. API Endpoint Verification

#### Profile Endpoint
```bash
# Get token first (from login)
TOKEN="your_jwt_token"

# Test profile endpoint
curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/user/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

# Expected response:
# {
#   "data": {
#     "userId": "uuid",
#     "name": "Test User",
#     "email": "testuser@example.com",
#     "level": 1,
#     "xp": 0,
#     "avatarUrl": "",
#     "completedCourses": 0,
#     "walletBalance": 0,
#     "role": "student"
#   },
#   "success": true
# }
```

#### Wallet Endpoint
```bash
TOKEN="your_jwt_token"

curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/user/wallet" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

# Expected response:
# {
#   "data": {
#     "userId": "uuid",
#     "balance": 0,
#     "currency": "tokens",
#     "totalEarned": 0,
#     "totalSpent": 0,
#     "earnings": { ... },
#     "spending": { ... },
#     "transactionCount": 0
#   },
#   "success": true
# }
```

#### Dashboard Endpoint
```bash
TOKEN="your_jwt_token"

curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/user/dashboard" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .

# Expected response includes:
# {
#   "profile": { ... },
#   "courseProgress": [ ... ],
#   "recentActivity": [ ... ],
#   "recommendations": [ ... ],
#   "recentTransactions": [ ... ]
# }
```

#### Admin Endpoints
```bash
ADMIN_TOKEN="your_admin_jwt_token"

# Admin dashboard stats
curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/dashboard" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" | jq .

# Admin users
curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" | jq .

# Admin orders
curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/orders" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" | jq .
```

---

### 5. Navigation Testing

#### User Navigation
- [ ] From dashboard, click logout button
- [ ] Should clear localStorage
- [ ] Should redirect to `/login`

#### Admin Navigation
- [ ] From admin panel, logout button should work
- [ ] Should clear localStorage
- [ ] Should redirect to `/login`

#### Protected Routes
- [ ] Try to access `/admin/dashboard` as regular user
- [ ] Should redirect to `/`
- [ ] Try to access `/profile/dashboard` without token
- [ ] Should redirect to `/login`

---

### 6. Browser DevTools Verification

#### Console Logs
Open DevTools (F12) → Console tab:
- [ ] Should see `[ProfileDashboard] Профиль загружен:` log
- [ ] Should see `[ProfileDashboard] Кошелек загружен:` log
- [ ] Should NOT see any TypeScript errors
- [ ] Should NOT see any red error messages

#### Network Tab
Open DevTools → Network tab:
- [ ] Should see API calls to backend
- [ ] Profile endpoint: `GET /api/user/profile`
- [ ] Wallet endpoint: `GET /api/user/wallet`
- [ ] All requests should have `Authorization: Bearer` header
- [ ] Responses should be 200 OK
- [ ] Response bodies should have `"success": true`

#### LocalStorage
Open DevTools → Application → LocalStorage:
- [ ] After login should see:
  ```
  token: "eyJ0eXAiOiJKV1QiLCJhbGc..."
  role: "user" or "admin"
  user: "{\"id\":\"...\",\"name\":\"...\"}"
  ```
- [ ] After logout should be empty

---

### 7. Error Scenarios

#### Invalid Token
- [ ] Modify token in localStorage (add random chars)
- [ ] Refresh dashboard
- [ ] Should show error or mock data
- [ ] Console should show warning logs

#### Network Error
- [ ] Open DevTools
- [ ] Go to Network tab
- [ ] Right-click → Throttling → Offline
- [ ] Refresh dashboard
- [ ] Should fallback to mock data
- [ ] Should NOT crash

#### Missing Authorization Header
```bash
# This should fail
curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/user/profile"

# Expected: 401 Unauthorized or 403 Forbidden
```

#### Expired Token (if backend supports)
- [ ] Use old/expired token
- [ ] Should show error
- [ ] Should suggest logout and login again

---

### 8. Responsive Design Testing

#### Mobile View (375px width)
- [ ] Profile dashboard should be responsive
- [ ] Text should be readable
- [ ] Buttons should be clickable
- [ ] No horizontal scroll

#### Tablet View (768px width)
- [ ] Admin dashboard should be responsive
- [ ] Sidebar should not overflow
- [ ] Tables should be scrollable
- [ ] Content should fit screen

#### Desktop View (1920px width)
- [ ] All elements should layout properly
- [ ] Tables should display full content
- [ ] Sidebar should be visible
- [ ] No overlapping elements

**Test with:**
```bash
# Chrome DevTools - Ctrl+Shift+I
# Click device toggle (top-left)
# Test different screen sizes
```

---

### 9. Performance Testing

#### Load Time
- [ ] Dashboard should load in < 2 seconds
- [ ] No loading spinner after 3 seconds
- [ ] Smooth transitions between pages

#### API Response Time
```bash
# Measure response time
time curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/user/profile" \
  -H "Authorization: Bearer $TOKEN" | jq .

# Should be < 1000ms
```

#### Bundle Size
```bash
cd /Users/dmitrijfomin/Desktop/cv-sushi_chef
npm run build

# Check build output size
```

---

### 10. TypeScript & Code Quality

#### No TypeScript Errors
```bash
cd /Users/dmitrijfomin/Desktop/cv-sushi_chef

# Check for errors
npm run type-check

# Should output: ✓ No errors found
```

#### ESLint
```bash
npm run lint

# Should have no critical errors
```

#### Build Success
```bash
npm run build

# Should complete without errors
```

---

## 🧪 Test Execution Plan

### Phase 1: Authentication (Est. 10 min)
1. Register new user
2. Verify token storage
3. Login with existing user
4. Check redirect to correct dashboard

### Phase 2: User Dashboard (Est. 15 min)
1. Load profile page
2. Verify API calls in Network tab
3. Check data display
4. Test error handling
5. Test logout flow

### Phase 3: Admin Dashboard (Est. 15 min)
1. Login as admin
2. Verify access control
3. Check stats display
4. Check tables display
5. Test logout flow

### Phase 4: API Verification (Est. 10 min)
1. Test all endpoints with curl
2. Check response structures
3. Verify headers
4. Check error responses

### Phase 5: Responsive Design (Est. 10 min)
1. Test mobile view
2. Test tablet view
3. Test desktop view
4. Check no layout issues

### Phase 6: Performance (Est. 5 min)
1. Measure load times
2. Check API response times
3. Check bundle size

### Phase 7: Code Quality (Est. 5 min)
1. Run type-check
2. Run linter
3. Run build

---

## ✅ Success Criteria

All tests should PASS:
- ✅ User can register and login
- ✅ Correct dashboard loads based on role
- ✅ Real backend data displays
- ✅ Wallet data displays
- ✅ Admin tables display correctly
- ✅ Logout works properly
- ✅ All API endpoints respond 200 OK
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ No ESLint errors
- ✅ Responsive on all devices
- ✅ Load time < 2 seconds

---

## 📊 Test Results Template

### Date: ____________
### Tester: ____________

| Test | Expected | Actual | Pass? |
|------|----------|--------|-------|
| Register user | Redirect to dashboard | _____ | [ ] |
| Login user | Redirect to dashboard | _____ | [ ] |
| Profile loads | Show real data | _____ | [ ] |
| Wallet loads | Show balance | _____ | [ ] |
| Admin access (admin user) | Show admin panel | _____ | [ ] |
| Admin access (regular user) | Redirect to / | _____ | [ ] |
| Logout | Redirect to /login | _____ | [ ] |
| API Profile endpoint | 200 OK response | _____ | [ ] |
| API Wallet endpoint | 200 OK response | _____ | [ ] |
| API Admin endpoints | 200 OK response | _____ | [ ] |
| No TypeScript errors | ✓ Pass | _____ | [ ] |
| No console errors | ✓ Pass | _____ | [ ] |
| Mobile responsive | No issues | _____ | [ ] |
| Load time < 2s | ✓ Pass | _____ | [ ] |

---

## 🐛 Bug Reporting Template

If you find issues during testing:

```
**Bug Title:** [Brief description]

**Date Found:** [Date]

**Test Case:** [Which test found it]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Error Message:**
[If any - from console]

**Screenshots:**
[If applicable]

**Browser/Device:**
[Chrome 120, Safari iOS 17, etc]

**Additional Notes:**
[Any other relevant info]
```

---

## 📞 Contact & Support

**Frontend Issues:**
- Check console logs for errors
- Look at Network tab for API failures
- Verify token in localStorage

**Backend Issues:**
- Check backend server status
- Test endpoints with curl
- Check backend logs

**Deployment:**
- Backend: Koyeb
- Frontend: Vercel (or local dev)

---

## 📝 Notes

- All API calls require valid JWT token
- Admin endpoints require `role === "admin"`
- Mock data is fallback for missing endpoints
- All timestamps are UTC
- Tokens expire after 24 hours (backend setting)

---

**Last Updated:** November 12, 2025  
**Status:** ✅ Ready for Testing

