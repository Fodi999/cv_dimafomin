# 🔐 Admin Dashboard Testing Instructions

**Date:** November 12, 2025  
**Status:** ✅ Admin account verified and ready

---

## ✅ Admin Account Details

```
Email: admin@example.com
Password: admin_password_123
Role: admin
ID: 7ec8aba4-8195-4be1-a9a8-067c30aae306
```

---

## 🧪 Test Method 1: Browser Console (Recommended)

### Step 1: Open Browser
1. Open http://localhost:3000 in your browser
2. Press `F12` to open DevTools
3. Go to **Console** tab

### Step 2: Set Admin Credentials
Copy and paste this in the console:

```javascript
// Set admin token
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ZWM4YWJhNC04MTk1LTRiZTEtYTlhOC0wNjdjMzBhYWUzMDYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzYzMDI2MjAzLCJpYXQiOjE3NjI5Mzk4MDN9.4YYwwhh95SLXBtu5GKSkb8X8jMJaOI0slN6O8of4rdw');

// Set admin role
localStorage.setItem('role', 'admin');

// Set admin user data
localStorage.setItem('user', JSON.stringify({
  id: '7ec8aba4-8195-4be1-a9a8-067c30aae306',
  name: 'System Administrator',
  email: 'admin@example.com',
  role: 'admin'
}));

console.log('✅ Admin credentials set!');
console.log('Token:', localStorage.getItem('token'));
console.log('Role:', localStorage.getItem('role'));
console.log('User:', localStorage.getItem('user'));
```

### Step 3: Navigate to Admin Dashboard
In the console, type:

```javascript
window.location.href = '/admin/dashboard'
```

Or just navigate directly: http://localhost:3000/admin/dashboard

### Expected Result
✅ You should see:
- Admin dashboard loads
- Dashboard statistics visible
- Users table displays
- Orders table displays
- No error messages
- Admin sidebar visible

---

## 🧪 Test Method 2: Login Flow

### Step 1: Clear LocalStorage
In browser console:
```javascript
localStorage.clear();
console.log('✅ Cleared!');
```

### Step 2: Go to Login Page
Navigate to http://localhost:3000/login

### Step 3: Login with Admin Credentials
- Email: `admin@example.com`
- Password: `admin_password_123`
- Click "Войти"

### Expected Result
✅ Should automatically redirect to `/admin/dashboard`

**Why?** The login page detects `role === "admin"` and redirects to `/admin/dashboard` instead of `/profile/dashboard`

---

## 🧪 Test Method 3: Compare User vs Admin

### Test Regular User
1. Clear localStorage: `localStorage.clear()`
2. Navigate to http://localhost:3000/login
3. Register as regular user (any email)
4. **Expected:** Redirects to `/profile/dashboard`

### Test Admin User
1. Go to http://localhost:3000/login
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin_password_123`
3. **Expected:** Redirects to `/admin/dashboard`

This proves role-based routing is working! ✅

---

## 🔍 What to Check on Admin Dashboard

### Dashboard Statistics
- [ ] Shows "Total Users" count
- [ ] Shows "Active Users" count
- [ ] Shows "Total Orders" count
- [ ] Shows revenue/stats

### Users Table
- [ ] Table header visible
- [ ] User data displays
- [ ] Shows columns: Name, Email, Level, XP, Tokens, etc.
- [ ] Can scroll through users

### Orders Table
- [ ] Table header visible
- [ ] Order data displays
- [ ] Shows columns: Order ID, Customer, Amount, Status, etc.
- [ ] Can scroll through orders

### Navigation
- [ ] Admin sidebar visible on left
- [ ] Can navigate between sections
- [ ] Logout button works
- [ ] Logout clears localStorage
- [ ] Logout redirects to `/login`

---

## 🔐 Security Checks

### Check 1: Regular User Cannot Access Admin
1. Clear localStorage: `localStorage.clear()`
2. Register as regular user
3. Try to navigate to `/admin/dashboard`
4. **Expected:** Redirects to `/` (home page)

**Proof:** In `/app/admin/dashboard/page.tsx`:
```typescript
if (role !== "admin") {
  router.push("/");
  return;
}
```

### Check 2: Missing Token Redirects
1. Clear localStorage: `localStorage.clear()`
2. Navigate to `/admin/dashboard`
3. **Expected:** Shows error message "Вы не авторизованы"

### Check 3: Admin-Only API Protection
Test in terminal:
```bash
# Without admin token - should fail
curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/dashboard" \
  -H "Authorization: Bearer user_token" | jq .

# Expected: Error or 403 Forbidden

# With admin token - should work
curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/dashboard" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ZWM4YWJhNC04MTk1LTRiZTEtYTlhOC0wNjdjMzBhYWUzMDYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzYzMDI2MjAzLCJpYXQiOjE3NjI5Mzk4MDN9.4YYwwhh95SLXBtu5GKSkb8X8jMJaOI0slN6O8of4rdw" | jq .

# Expected: Success response with admin data
```

---

## 📊 Console Debugging

Open DevTools → Console tab and check for these logs:

### Expected Logs
```
[AdminDashboard] Loading data with token: eyJ0eXAiOiJKV1QiLCJhbGc...
[AdminDashboard] Dashboard stats loaded successfully
[AdminDashboard] Users list loaded
[AdminDashboard] Orders list loaded
```

### Should NOT See
```
❌ [AdminDashboard] Error loading admin data
❌ [AdminDashboard] Redirect to / (user is not admin)
❌ TypeError: Cannot read properties...
```

---

## 🧪 Full Testing Checklist

### Authentication
- [ ] Admin login succeeds
- [ ] Token stored in localStorage
- [ ] Role "admin" stored in localStorage
- [ ] User data stored in localStorage

### Redirect Logic
- [ ] Admin login → Redirects to `/admin/dashboard` ✅
- [ ] User login → Redirects to `/profile/dashboard` ✅
- [ ] User tries `/admin/dashboard` → Redirects to `/` ✅
- [ ] No token tries `/admin/dashboard` → Shows error ✅

### Admin Dashboard Display
- [ ] Dashboard loads without errors
- [ ] Statistics visible
- [ ] Users table visible
- [ ] Orders table visible
- [ ] No console errors
- [ ] No TypeScript errors

### Data Loading
- [ ] Profile data loads (real or mock)
- [ ] Wallet data loads (real or mock)
- [ ] Admin stats load (real or mock)
- [ ] Users list loads (real or mock)
- [ ] Orders list loads (real or mock)

### Logout
- [ ] Logout button present
- [ ] Logout clears localStorage
- [ ] Logout redirects to `/login`
- [ ] After logout, `/admin/dashboard` shows error

### Error Handling
- [ ] API errors don't crash app
- [ ] Missing token shows error message
- [ ] Invalid role redirects properly
- [ ] Network errors show error message

---

## 💾 Save Admin Token for Later

If you want to reuse this admin token in the future, save it:

```bash
# Save to a file
echo "Admin Token (valid until Nov 18, 2025):" > admin_token.txt
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ZWM4YWJhNC04MTk1LTRiZTEtYTlhOC0wNjdjMzBhYWUzMDYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzYzMDI2MjAzLCJpYXQiOjE3NjI5Mzk4MDN9.4YYwwhh95SLXBtu5GKSkb8X8jMJaOI0slN6O8of4rdw" >> admin_token.txt

# Or use in terminal
ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3ZWM4YWJhNC04MTk1LTRiZTEtYTlhOC0wNjdjMzBhYWUzMDYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzYzMDI2MjAzLCJpYXQiOjE3NjI5Mzk4MDN9.4YYwwhh95SLXBtu5GKSkb8X8jMJaOI0slN6O8of4rdw"

curl -s "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/dashboard" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
```

---

## 📋 Test Results Template

### Date: ____________

| Test | Expected | Result | Pass? |
|------|----------|--------|-------|
| Admin login | Redirect to /admin/dashboard | | [ ] |
| Regular user login | Redirect to /profile/dashboard | | [ ] |
| User access admin dashboard | Redirect to / | | [ ] |
| Admin dashboard loads | Shows stats, tables | | [ ] |
| Users table displays | Shows user data | | [ ] |
| Orders table displays | Shows order data | | [ ] |
| Logout clears data | localStorage empty | | [ ] |
| No console errors | Console clean | | [ ] |
| No TypeScript errors | Build succeeds | | [ ] |

---

## 🔗 Quick Links

- User Dashboard: http://localhost:3000/profile/dashboard
- Admin Dashboard: http://localhost:3000/admin/dashboard
- Login Page: http://localhost:3000/login
- Register Page: http://localhost:3000/register
- Home Page: http://localhost:3000

---

## 🐛 Troubleshooting

### Problem: "Вы не авторизованы" on admin dashboard
**Solution:** Make sure token is set in localStorage
```javascript
// Check token
localStorage.getItem('token')  // Should return JWT string

// If empty, set it:
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
```

### Problem: Redirects to home page (`/`)
**Solution:** Check role is "admin"
```javascript
// Check role
localStorage.getItem('role')  // Should return "admin"

// If wrong, set it:
localStorage.setItem('role', 'admin')
```

### Problem: Admin dashboard shows mock data
**Solution:** This is expected. Backend endpoints exist but may not have real data yet.
Check console logs:
```javascript
// In DevTools console
console.log(localStorage.getItem('token'))
```

### Problem: Login doesn't redirect to admin dashboard
**Solution:** 
1. Check backend login response includes `role: "admin"`
2. Check frontend login page checks role correctly
3. See `/app/login/page.tsx` for redirect logic

---

## ✅ Success Criteria

You'll know admin dashboard is working when:

✅ Admin can login with credentials  
✅ Admin automatically redirects to `/admin/dashboard`  
✅ Admin dashboard loads without errors  
✅ Dashboard displays statistics  
✅ Tables display user/order data (real or mock)  
✅ Regular users cannot access admin dashboard  
✅ Logout works and clears all data  
✅ No console errors or warnings  
✅ No TypeScript compilation errors  

---

**Last Updated:** November 12, 2025  
**Admin Status:** ✅ Ready for Testing  
**Token Valid Until:** November 18, 2025

