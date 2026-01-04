# 🧭 Navigation Architecture - Unified Design System

## 📊 Current Structure Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        🌐 WEBSITE STRUCTURE                          │
└─────────────────────────────────────────────────────────────────────┘

                              ROOT (/)
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              🔓 PUBLIC      👤 USER      🛡️ ADMIN
                    │            │            │
         ┌──────────┴─────┐     │            │
         │                │     │            │
    Landing Page    Academy    │            │
    (Marketing)    (Preview)   │            │
                               │            │
                    ┌──────────┴──────────┐ │
                    │                     │ │
                /fridge              /admin/*
                /recipes                 │
                /assistant               │
                /tokens           admin/dashboard
                /academy          admin/users
                /market           admin/recipes
                /losses           admin/settings
                /profile          ...and more
```

---

## 🎨 Three Navigation Components - Unified Style

### **1️⃣ NavigationBurger** (Landing - Public)
**Location:** `/components/NavigationBurger.tsx`  
**Used in:** Root layout (`/app/page.tsx`)  
**Visibility:** Hidden on `/admin/*` and user routes (`/fridge`, `/recipes`, etc.)

**Color Scheme:** 🔵 Sky/Cyan (Blue) + 🟡 Amber highlights  
**Logo Icon:** `BrainCircuit`  
**Logo Text:** "Modern Food Academy"

**Menu Structure:**
```
🏠 ОСНОВНІ
  ├─ Головна (/)
  ├─ Як це працює (/how-it-works)
  └─ Про нас (/about)

🍳 ФУНКЦІЇ (with badges)
  ├─ Холодильник (/fridge) [CORE]
  ├─ Рецепти (/recipes) [AI]
  ├─ AI Асистент (/assistant) [AI] ⭐
  ├─ Збережені (/recipes/saved)
  └─ Маркет (/market)

📚 РОЗВИТОК
  ├─ Академія (/academy)
  └─ Бібліотека (/library)

💰 ТОКЕНИ
  └─ ChefTokens (/tokens)

👤 ПРОФІЛЬ
  ├─ Мій профіль (/profile)
  └─ Налаштування (/settings)

🔐 AUTH (if not logged in)
  └─ Увійти (opens AuthModal)
```

**Status:** ⚠️ Needs cleanup - remove user-specific items (fridge, assistant, etc.)

---

### **2️⃣ UserNavigation** (User App)
**Location:** `/components/layout/UserNavigation.tsx`  
**Used in:** User Layout (`/app/(user)/layout.tsx`)  
**Visibility:** Shows on all user routes (`/fridge`, `/recipes`, `/assistant`, etc.)

**Color Scheme:** 🔵 Sky/Cyan (Blue)  
**Logo Icon:** `BrainCircuit`  
**Logo Text:** "Modern Food Academy"  
**Logo Link:** `/fridge` (user dashboard)

**Menu Structure:**
```
🍳 КУХНЯ
  ├─ Холодильник (/fridge)
  ├─ Рецепти (/recipes)
  ├─ AI Асистент (/assistant)
  ├─ Мої рецепти (/recipes/saved)
  └─ Маркет (/market)

📚 РОЗВИТОК
  └─ Академія (/academy)

💰 ЕКОНОМІКА
  └─ Токени (/tokens)

👤 ПРОФІЛЬ
  └─ Мій профіль (/profile)

🚪 Вийти (logout → redirect to /)
```

**User Info Display:**
- Avatar (first letter of name)
- Name + Email
- Stats: Level, XP, ChefTokens

**Status:** ✅ Complete and working

---

### **3️⃣ AdminNavigation** (Admin Panel)
**Location:** `/components/layout/AdminNavigation.tsx`  
**Used in:** Admin Layout (`/app/admin/layout.tsx`)  
**Visibility:** Shows on all admin routes (`/admin/*`)

**Color Scheme:** 🔴 Red/Orange (Admin-specific)  
**Logo Icon:** `Shield`  
**Logo Text:** "Admin Panel"  
**Logo Subtitle:** "Administrator" or "Superadmin"  
**Logo Link:** `/admin/dashboard`

**Menu Structure:** (Role-based from `navigation-schema.ts`)
```
📊 OVERVIEW
  └─ Dashboard (/admin/dashboard)

👥 USERS
  ├─ All Users (/admin/users)
  ├─ Roles & Permissions (/admin/users/roles) [admin, superadmin only]
  └─ Activity Log (/admin/activity-log)

🍽️ CONTENT
  ├─ Recipes (/admin/recipes)
  ├─ Ingredients (/admin/ingredients)
  ├─ Courses (/admin/courses)
  └─ Localization (/admin/localization)

🧠 AI & LOGIC
  ├─ AI Scenarios (/admin/ai-scenarios)
  ├─ Prompts (/admin/prompts)
  └─ AI Logs (/admin/ai-logs) [feature flag]

💰 ECONOMY
  ├─ Token Bank (/admin/token-bank)
  ├─ Transactions (/admin/transactions)
  └─ Rewards (/admin/rewards)

🛒 OPERATIONS [feature flag]
  ├─ Orders (/admin/orders)
  ├─ Payments (/admin/payments)
  └─ Subscriptions (/admin/subscriptions)

🔌 INTEGRATIONS [feature flag]
  ├─ API Keys (/admin/integrations/api-keys)
  ├─ Webhooks (/admin/integrations/webhooks)
  └─ External Services (/admin/integrations/services)

⚙️ SETTINGS
  ├─ System Config (/admin/settings)
  ├─ Security (/admin/settings/security)
  └─ Logs (/admin/settings/logs)

🚪 Logout (logout → redirect to /)
```

**Admin Info Display:**
- Shield icon avatar
- Name + Email
- Role badge: "ADMIN" or "SUPERADMIN" (red text)

**Status:** ✅ Complete and working

---

## 🎭 Unified Style Components

All three navigations share the **exact same visual style**:

### **Header (Fixed)**
```tsx
height: 64px (h-16)
position: fixed top-0 left-0
background: white/60 dark:bg-gray-900/40
backdrop-blur: md
border-bottom: border-white/20
z-index: 40
```

**Layout:** `[Burger Button] [Logo] ... [Right Icons]`

### **Burger Button**
- Size: 40px (p-2)
- Icon: `Menu` / `X` (animated rotation)
- Hover: scale 1.05, bg-gray-100
- Tap: scale 0.95

### **Logo**
- Icon background: Gradient rounded-lg
  - **Landing/User:** `from-sky-500 to-cyan-500`
  - **Admin:** `from-red-500 to-orange-500`
- Hover: scale 1.08, rotate 5°
- Text: 2 lines (title + subtitle)

### **Overlay**
```tsx
position: fixed inset-0
background: black/50
backdrop-blur: sm
z-index: 40
Animation: fade in/out
```

### **Sidebar**
```tsx
width: 320px (w-80)
height: 100vh
position: fixed top-0 left-0
background: white dark:bg-gray-900
shadow: 2xl
z-index: 50
overflow-y: auto
Animation: slide from left (-300px to 0)
Spring: damping 25, stiffness 200
```

**Padding:** `p-6`

### **Category Divider**
```tsx
<div className="flex items-center gap-2">
  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
    {categoryLabel}
  </span>
  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
</div>
```

### **Menu Item (Inactive)**
```tsx
padding: px-3 py-2
border-left: 4px transparent
background: transparent
text: gray-700 dark:gray-300
hover:
  - background: gray-100 dark:gray-900/50
  - x-translate: 8px
```

### **Menu Item (Active)**
```tsx
padding: px-3 py-2
border-left: 4px solid
  - Landing/User: border-sky-500
  - Admin: border-red-500
background: gradient-to-r
  - Landing/User: from-sky-500/20 to-cyan-500/20
  - Admin: from-red-500/20 to-orange-500/20
text:
  - Landing/User: sky-600 dark:sky-400
  - Admin: red-600 dark:red-400
```

**Active Indicator:** 
- Dot: `w-1.5 h-1.5 rounded-full`
- Color: Sky-500 (User) or Red-500 (Admin)
- Animation: `layoutId` for smooth transitions

### **Description**
```tsx
font-size: 10px (text-[10px])
margin-top: 2px (mt-0.5)
margin-left: 28px (ml-7) - aligns with label after icon
color:
  - Active: sky-500/80 (User) or red-500/80 (Admin)
  - Inactive: gray-500
```

### **Logout Button**
```tsx
margin-top: 24px (mt-6)
padding-top: 24px (pt-6)
border-top: gray-200 dark:gray-800
width: 100%
flex items-center gap-3
padding: px-3 py-3
color: red-600 dark:red-400
hover: bg-red-50 dark:bg-red-900/20
```

---

## 🔐 Route Protection (Middleware)

**File:** `/middleware.ts`

### **Protected Routes**
```typescript
const PROTECTED_USER_ROUTES = [
  "/fridge",
  "/recipes",
  "/assistant",
  "/tokens",
  "/academy",
  "/market",
  "/losses",
  "/profile",
];
```

### **Access Logic**

| User Type | Can Access | Redirected From | Redirected To |
|-----------|-----------|-----------------|---------------|
| 🔓 Guest | `/`, `/academy`, `/pricing`, `/about` | `/fridge`, `/admin` | `/` |
| 👤 User (authenticated) | All user routes + public | `/admin` | `/fridge` |
| 🛡️ Admin/Superadmin | `/admin/*` + public | `/fridge`, `/recipes`, etc. | `/admin/dashboard` |

### **Middleware Flow**
```
Request → Check cookies (token, role)
          ↓
    ┌─────┴─────┐
    │ No token? │ → Protected route? → Redirect to /
    └─────┬─────┘
          │
    ┌─────┴─────┐
    │ Has token │
    └─────┬─────┘
          │
    ┌─────┴──────┐
    │ role=admin │ → Trying /fridge? → Redirect to /admin
    └─────┬──────┘
          │
    ┌─────┴─────┐
    │ role=user │ → Trying /admin? → Redirect to /fridge
    └─────┬─────┘
          │
      Allow access
```

---

## 📂 File Structure

```
components/
├── NavigationBurger.tsx          # 🔵 Landing (Public)
└── layout/
    ├── UserNavigation.tsx        # 🔵 User App
    └── AdminNavigation.tsx       # 🔴 Admin Panel

app/
├── layout.tsx                     # Root layout (providers, NavigationBurger)
├── page.tsx                       # Landing page
├── (user)/                        # 👤 Route Group
│   ├── layout.tsx                # UserLayout + UserNavigation
│   ├── page.tsx                  # User Dashboard
│   ├── fridge/
│   ├── recipes/
│   ├── assistant/
│   └── ...
└── admin/                         # 🛡️ Admin
    ├── layout.tsx                # AdminLayout + AdminNavigation
    ├── dashboard/
    ├── users/
    └── ...

lib/admin/
└── navigation-schema.ts          # Admin menu configuration (RBAC + feature flags)

middleware.ts                      # Route protection logic
```

---

## 🎯 Key Features

### **1. Route Groups in Next.js**
- `(user)` folder doesn't add `/user` to URL
- `app/(user)/fridge` renders as `/fridge` ✅
- Allows shared layouts without URL prefixes

### **2. Role-Based Access Control (RBAC)**
- Admin navigation filtered by role:
  - `admin` - basic admin access
  - `superadmin` - full access including roles/permissions
  - `moderator`, `support` - limited access (future)

### **3. Feature Flags**
- Sections can be hidden via feature flags:
  - `operations` - e-commerce features
  - `integrations` - API/webhook management
  - `ai_logs` - AI debugging logs

### **4. Multilingual Support**
- All labels have `{en, ru, pl}` translations
- Language selected from `LanguageContext`
- Admin navigation uses `getLocalizedLabel()`

### **5. Animation & Transitions**
- Framer Motion for smooth animations
- Layout animations with `layoutId`
- Spring physics for sidebar slide
- Staggered menu item appearance

### **6. Responsive Design**
- Mobile-first approach
- Touch-friendly tap targets (44px min)
- Backdrop blur for modern glassmorphism
- Dark mode support throughout

---

## 🚀 Usage Examples

### **Landing Page**
```tsx
// app/page.tsx
import NavigationBurger from "@/components/NavigationBurger";

export default function LandingPage() {
  return (
    <>
      <NavigationBurger /> {/* Hidden on user/admin routes */}
      <main>
        {/* Landing content */}
      </main>
    </>
  );
}
```

### **User Page**
```tsx
// app/(user)/fridge/page.tsx
// UserNavigation automatically included via layout.tsx

export default function FridgePage() {
  return (
    <div className="pt-16"> {/* Offset for fixed header */}
      {/* Fridge content */}
    </div>
  );
}
```

### **Admin Page**
```tsx
// app/admin/dashboard/page.tsx
// AdminNavigation automatically included via layout.tsx

export default function AdminDashboard() {
  return (
    <div className="pt-16"> {/* Offset for fixed header */}
      {/* Dashboard content */}
    </div>
  );
}
```

---

## ✅ Current Status

| Component | Status | Color Scheme | Notes |
|-----------|--------|--------------|-------|
| NavigationBurger | ⚠️ Needs cleanup | Sky/Cyan | Remove user items, keep only public |
| UserNavigation | ✅ Complete | Sky/Cyan | Working correctly |
| AdminNavigation | ✅ Complete | Red/Orange | Role-based, feature flags |
| Middleware | ✅ Complete | N/A | Protects all routes |
| Route Groups | ✅ Complete | N/A | Clean URLs working |

---

## 🔧 Pending Tasks

1. **LandingNavigation Cleanup**
   - Remove: Холодильник, AI Асистент, Збережені, Маркет, Токени
   - Keep: Головна, Як це працює, Академія, Ціни, Увійти
   
2. **Optional: Separate Component**
   - Create `LandingNavigation.tsx` as distinct from User menu
   - Use in root layout instead of NavigationBurger

3. **TypeScript Cache**
   - Restart TS Server to clear old file references
   - `Cmd+Shift+P` → "TypeScript: Restart TS Server"

---

## 📚 Related Documentation

- **[ARCHITECTURE_ROUTING.md](./ARCHITECTURE_ROUTING.md)** - Full 3-zone architecture explanation
- **[navigation-schema.ts](../lib/admin/navigation-schema.ts)** - Admin menu configuration
- **[middleware.ts](../middleware.ts)** - Route protection logic
- **[AuthContext.tsx](../contexts/AuthContext.tsx)** - Authentication + redirects

---

**Last Updated:** 2026-01-04  
**Architecture Version:** 3.0 (Unified Navigation System)
