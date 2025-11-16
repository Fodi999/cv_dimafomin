# 🏗️ Admin Panel Architecture Diagram

## 1. System-wide View

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Modern Food Academy Platform                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐         │
│  │   Users        │  │   Academy      │  │   Market      │         │
│  │ • Profiles     │  │ • Courses      │  │ • Recipes     │         │
│  │ • Roles        │  │ • Progress     │  │ • Purchases   │         │
│  │ • Wallets      │  │ • Certificates │  │ • Reviews     │         │
│  └────────────────┘  └────────────────┘  └───────────────┘         │
│                            ▲                    ▲                    │
│                            │                    │                    │
│                    ┌───────────────────────────────┐                 │
│                    │   Admin Panel (Complete)      │                 │
│                    │  - Управляет всем             │                 │
│                    └───────────────────────────────┘                 │
│                            │                                         │
│     ┌──────────────────────┼──────────────────────┐                 │
│     │                      │                      │                 │
│  📊 Dashboard         🪙 Token Bank         👥 Users        ⚙️ Settings │
│  • Stats              • Allocate            • Edit           • Notifications │
│  • Charts             • Revoke              • Delete          • Dark mode    │
│  • Real-time          • Transactions        • Change role    • Backup       │
│                                                               • Security     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. Admin Panel Navigation Flow

```
/admin (redirect)
    │
    └──> /admin/dashboard  (Primary Entry Point)
         ├──> Stats & Metrics
         ├──> Users Table (inline)
         └──> Orders Table (inline)
         
         Side Navigation:
         ├──> /admin/users       (User Management)
         │    ├─ Search
         │    ├─ Edit profile
         │    ├─ Change role
         │    └─ Delete user
         │
         ├──> /admin/token-bank  (Token Management)
         │    ├─ View all wallets
         │    ├─ Allocate tokens
         │    ├─ Revoke tokens
         │    └─ Token stats
         │
         └──> /admin/settings    (Admin Settings)
              ├─ Notifications
              ├─ Dark mode
              ├─ Backup settings
              ├─ Security
              └─ Logout
```

## 3. Component Architecture

```
/admin/dashboard/page.tsx
│
├─── [ROLE CHECK] ◄──── localStorage.role === 'admin'?
│    └─ NO → redirect to '/'
│    └─ YES → continue
│
├─── fetchData() ◄──── useEffect([router])
│    ├─ GET /api/admin/dashboard
│    ├─ GET /api/admin/users
│    └─ GET /api/admin/orders
│
├─── <DashboardStats>
│    ├─ totalUsers
│    ├─ activeUsers
│    ├─ totalOrders
│    └─ totalTokens
│
├─── <UsersTable>
│    ├─ Search input
│    ├─ Columns: Name, Email, Role, Level, XP, Tokens
│    └─ Actions: Edit, Delete
│
└─── <OrdersTable>
     ├─ Search input
     ├─ Columns: ID, User, Amount, Status, Date
     └─ Actions: View, Update Status
```

## 4. Token Bank Flow

```
Admin Dashboard
    │
    └─> Click Users Row
        │
        └─> Modal: "Allocate Tokens"
            │
            ├─ [User ID] (auto-filled)
            ├─ [Amount] (input)
            ├─ [Reason] (dropdown)
            │  ├─ bonus
            │  ├─ reward
            │  ├─ refund
            │  └─ admin_allocation
            │
            └─> Click "Allocate"
                │
                └─> POST /api/admin/token-bank/allocate
                    │
                    ├─ Backend:
                    │  ├─ Find user token bank
                    │  ├─ Add amount to balance
                    │  ├─ Record transaction
                    │  └─ Return 200 OK
                    │
                    └─> Frontend:
                       ├─ Update local state
                       ├─ Show success toast
                       └─ Refresh table
```

## 5. User Management Flow

```
/admin/users
│
├─ [Search Bar] ──> Filter by name/email
│
├─ <UsersTable>
│  ├─ User 1
│  │  ├─ [Edit] ──> Modal with form
│  │  │            ├─ Name (input)
│  │  │            ├─ Email (input)
│  │  │            └─ [Save] ──> PUT /api/admin/users/{id}
│  │  │
│  │  ├─ [Delete] ──> Confirm dialog
│  │  │               └─ [Yes] ──> DELETE /api/admin/users/{id}
│  │  │                           └─ Remove from table
│  │  │
│  │  └─ [Change Role] ──> Dropdown
│  │                       ├─ student
│  │                       ├─ instructor
│  │                       └─ admin
│  │                           └─ PATCH /api/admin/users/update-role
│  │
│  └─ User 2, 3, ... (same pattern)
│
└─ Pagination (if many users)
```

## 6. Data Model

```
┌─ Admin User (from localStorage)
│  ├─ id: string
│  ├─ name: string
│  ├─ email: string
│  ├─ role: 'admin'
│  └─ createdAt: ISO string
│
├─ DashboardStats
│  ├─ totalUsers: number
│  ├─ activeUsers: number
│  ├─ totalOrders: number
│  ├─ totalRevenue: number
│  ├─ pendingOrders: number
│  ├─ averageOrderValue: number
│  └─ totalTokensEarned: number
│
├─ AdminUser (from API)
│  ├─ id: string
│  ├─ name?: string
│  ├─ email?: string
│  ├─ role?: 'student' | 'instructor' | 'admin'
│  ├─ level?: number
│  ├─ xp?: number
│  ├─ chefTokens?: number
│  ├─ createdAt?: string
│  └─ updatedAt?: string
│
├─ AdminOrder
│  ├─ id: string
│  ├─ userId: string
│  ├─ userName: string
│  ├─ amount: number
│  ├─ status: 'pending' | 'completed' | 'cancelled'
│  ├─ createdAt: string
│  └─ items?: any[]
│
└─ TokenBank
   ├─ id: string
   ├─ userId: string
   ├─ userName?: string
   ├─ balance: number
   ├─ totalEarned: number
   ├─ totalSpent: number
   └─ lastTransaction?: string
```

## 7. API Request/Response Map

```
┌────────────────────────────────────┬──────────┬───────────────────────┐
│ Endpoint                           │ Method   │ Purpose               │
├────────────────────────────────────┼──────────┼───────────────────────┤
│ /api/admin/profile                 │ GET      │ Get admin profile     │
│ /api/admin/stats                   │ GET      │ Dashboard statistics  │
│ /api/admin/users                   │ GET      │ All users list        │
│ /api/admin/users/{id}              │ GET      │ Single user details   │
│ /api/admin/users/{id}              │ PUT      │ Update user (name)    │
│ /api/admin/users/update-role       │ PATCH    │ Change user role      │
│ /api/admin/users/{id}              │ DELETE   │ Delete user account   │
│ /api/admin/orders                  │ GET      │ All orders            │
│ /api/admin/orders/recent           │ GET      │ Last 10 orders        │
│ /api/admin/orders/{id}/status      │ PUT      │ Update order status   │
│ /api/admin/token-bank              │ GET      │ All token banks       │
│ /api/admin/token-bank/stats        │ GET      │ Token statistics      │
│ /api/admin/token-bank/{userId}     │ GET      │ User token bank       │
│ /api/admin/token-bank/allocate     │ POST     │ Add tokens to user    │
│ /api/admin/token-bank/revoke       │ POST     │ Remove tokens         │
│ /api/admin/token-bank/balance      │ PUT      │ Set exact balance     │
└────────────────────────────────────┴──────────┴───────────────────────┘
```

## 8. State Management

```
Dashboard State:
├─ stats: DashboardStats | null
├─ users: AdminUser[]
├─ orders: AdminOrder[]
├─ loading: boolean
├─ error: string | null
├─ checked: boolean (role verification)
└─ isAdmin: boolean (cached role check)

Users Page State:
├─ users: AdminUser[]
├─ filteredUsers: AdminUser[] (by search)
├─ loading: boolean
├─ error: string | null
├─ searchTerm: string
└─ actionInProgress: boolean

Token Bank Page State:
├─ tokenBanks: TokenBank[]
├─ filteredBanks: TokenBank[] (by search)
├─ stats: TokenStats | null
├─ loading: boolean
├─ error: string | null
├─ showAllocateModal: boolean
├─ selectedUserId: string | null
├─ allocateAmount: string
├─ allocateReason: string
└─ actionInProgress: boolean

Settings Page State:
├─ emailNotifications: boolean
├─ pushNotifications: boolean
├─ darkMode: boolean
├─ autoBackup: boolean
└─ savedMessage: string
```

## 9. Error Handling & Fallbacks

```
Try to fetch API data
    │
    ├─ Success ────────> Use real data
    │
    └─ Error
        │
        ├─ Network error? ───> Use mock data + show "Using test data" alert
        ├─ 401/403? ────────> Redirect to /login
        ├─ 404? ────────────> Use mock data + warning
        └─ Server error? ───> Show error alert + use mock data

Mock Data Strategy:
- mockStats (7 metrics)
- mockUsers (50 sample users)
- mockOrders (20 sample orders)
- mockTokenBanks (5 sample token banks)
```

## 10. Security Checks

```
Frontend:
1. Check localStorage.role === 'admin'
   └─ If NOT, redirect to '/'

2. Every API request includes:
   ├─ Authorization: Bearer {token}
   ├─ Content-Type: application/json
   └─ Proper error handling for 401/403

Backend (To be implemented):
1. Verify JWT token
2. Check user.role === 'admin'
3. Audit log all changes
   └─ who, what, when, why
4. Prevent cascade deletes
5. Rate limit admin operations
```

## 11. Mobile Responsive Design

```
Desktop (1024px+):
┌─────────────────────────────────┐
│ Header    │ Content Area        │
│ Stats     │ Stats (4 cols)      │
│ Nav       │ UsersTable (Desktop)│
│           │ OrdersTable (Desktop)
└─────────────────────────────────┘

Tablet (768px - 1024px):
┌────────────────────────┐
│ Header (hamburger)     │
│ Stats (2x2 grid)       │
│ UsersTable (3 cols)    │
│ OrdersTable (3 cols)   │
└────────────────────────┘

Mobile (< 768px):
┌──────────────┐
│ Header       │
│ Stats (1 col)│
│ Search       │
│ Users (cards)│
│ Orders (cards)
└──────────────┘
```

## 12. Permission Matrix

```
┌──────────────────────┬─────────┬────────────┬────────┐
│ Action               │ Student │ Instructor │ Admin  │
├──────────────────────┼─────────┼────────────┼────────┤
│ View /admin          │    ❌   │     ❌     │   ✅   │
│ View dashboard       │    ❌   │     ❌     │   ✅   │
│ View users list      │    ❌   │     ❌     │   ✅   │
│ Edit user data       │    ❌   │     ❌     │   ✅   │
│ Delete user          │    ❌   │     ❌     │   ✅   │
│ Allocate tokens      │    ❌   │     ❌     │   ✅   │
│ Revoke tokens        │    ❌   │     ❌     │   ✅   │
│ View settings        │    ❌   │     ❌     │   ✅   │
│ Change user role     │    ❌   │     ❌     │   ✅   │
│ View analytics       │    ❌   │     ❌     │   ✅   │
└──────────────────────┴─────────┴────────────┴────────┘
```

## 13. Integration Points with Main Platform

```
Admin Panel ◄─────────────────────────────► User Profiles
            ├─ Edit user info
            ├─ Change role
            └─ View profile

Admin Panel ◄─────────────────────────────► Wallet System
            ├─ Allocate tokens
            ├─ Revoke tokens
            ├─ View transactions
            └─ Update balance

Admin Panel ◄─────────────────────────────► Academy
            ├─ View course sales
            ├─ Monitor enrollments
            └─ Check completion rates

Admin Panel ◄─────────────────────────────► Marketplace
            ├─ Monitor recipe sales
            ├─ View orders
            └─ Manage transactions

Admin Panel ◄─────────────────────────────► Chat/AI
            ├─ Monitor usage
            ├─ Check token consumption
            └─ View analytics
```

---

**Generated**: 2025-01-15  
**For**: Modern Food Academy Admin System  
**Status**: ✅ All diagrams current
