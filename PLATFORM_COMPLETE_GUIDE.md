# 🍽️ Modern Food Academy - Complete Platform Overview

## 📌 Project Identity

**Name**: Modern Food Academy  
**Tagline**: Ukrainian/Polish platform for modern cooking education with AI-powered mentor  
**Core Concept**: Learn modern culinary techniques, earn ChefTokens, use AI-Mentor for help  
**AI Mentor**: Dima Fomin (professional chef & educator)  
**Language**: Ukrainian (primary), Polish (secondary)  

---

## 🎯 Core Features

### 1. **User Profiles** ✅
- Complete user profiles with:
  - Personal info (name, email, bio, location)
  - Health data (age, weight, height, daily calories)
  - Allergies and dietary restrictions
  - Fitness goals
  - ChefTokens balance
  - Achievement badges
  - Courses completed

**Current Status**: ✅ UI Complete  
**Files**: `components/profile/`, `app/profile/`  

### 2. **Academy** (Courses & Learning) ✅
- Complete course management system
- Course modules and lessons
- Progress tracking
- Certificates of completion
- Leaderboard (by XP)
- Community discussion

**Current Status**: ✅ UI Complete  
**Files**: `app/academy/`, `components/academy/`  

### 3. **Marketplace** (Recipe Store) ✅
- Browse and buy recipes
- Recipe ratings and reviews
- Chef recommendations
- Purchase with ChefTokens
- My Purchases section

**Current Status**: ✅ UI Complete  
**Files**: `app/market/`, `components/market/`  

### 4. **Chat with AI-Mentor** ✅
- Real-time chat with Dima Fomin (AI)
- Ask cooking questions
- Analyze food photos
- Generate recipes based on ingredients
- Token cost system for each query type

**Current Status**: ✅ UI Complete + Hook implemented  
**Files**: `components/chat/`, `hooks/useChat.ts`  

### 5. **Fridge** (Smart Pantry) ⏳
- Log ingredients you have
- Track expiration dates
- Get "What to cook?" recommendations
- Integration with recipes
- Nutrition calculations

**Current Status**: 🔲 UI Partial  
**Files**: `app/fridge/`, `components/fridge/`  

### 6. **Wallet** (Token Economy) ✅
- View token balance
- Transaction history
- Send tokens to other users
- Buy more tokens with real money
- Detailed financial dashboard

**Current Status**: ✅ UI Complete  
**Files**: `components/profile/WalletCard.tsx`, `components/profile/WalletDetailSheet.tsx`  

### 7. **Admin Panel** ✅
- Manage all users
- Allocate/revoke tokens
- View system statistics
- Manage orders
- Configure platform

**Current Status**: ✅ UI Complete, needs API  
**Files**: `app/admin/`, `src/lib/admin-api.ts`  

---

## 💰 Token Economy System

### ChefTokens Overview

**Purpose**: In-app currency that powers the ecosystem

**How to Earn**:
- ✅ Complete courses (50-500 tokens per course)
- ✅ Write course reviews (10-50 tokens)
- ✅ Participate in community (5-20 tokens per post)
- ✅ Daily login bonus (5-10 tokens)
- ✅ Level up (100-500 tokens per level)
- ✅ Leaderboard rewards (monthly, top 10)

**How to Spend**:
- 💬 Chat with AI-Mentor:
  - Simple question: 5 tokens
  - Recipe generation: 15 tokens
  - Photo analysis: 15 tokens
- 🛒 Buy recipes in marketplace: 10-100 tokens per recipe
- 🎁 Send to friends: Variable amount

**Premium Features**:
- 💎 Buy tokens with money:
  - $4.99 = 100 tokens
  - $9.99 = 300 tokens
  - $24.99 = 1000 tokens
  - $69.99 = 3500 tokens

### Token Flow Diagram
```
┌─────────────────────┐
│   Earn Tokens       │
├─────────────────────┤
│ • Complete course   │
│ • Write review      │
│ • Community posts   │
│ • Login bonus       │
│ • Level up          │
│ • Leaderboard       │
└──────────────────────
        ↓
   [Wallet]
        │
    ┌───┴───────────────────┐
    │                       │
    ↓                       ↓
[Spend]                [Save/Send]
    │                       │
  ├─────────────┐      Invest
  │             │      in skills
  ↓             ↓
[Chat]      [Market]
  │             │
  • Ask         • Buy
  • Analyze     • Learn
  • Generate    • Grow
```

---

## 🏗️ Architecture Overview

### Navigation Structure

```
Modern Food Academy
├─ 🏠 Home (Landing Page)
│
├─ 👤 Profile
│  ├─ Personal Info (editable)
│  ├─ Health Data (age, weight, calories)
│  ├─ Wallet & Transactions
│  ├─ My Courses (progress)
│  └─ Achievements & Badges
│
├─ 🎓 Academy (Learning Platform)
│  ├─ Browse Courses
│  ├─ My Courses (in progress)
│  ├─ Completed Courses
│  ├─ Certificates
│  ├─ Community Forum
│  ├─ Create Course (instructor)
│  └─ Leaderboard
│
├─ 🛒 Marketplace (Recipe Store)
│  ├─ Browse Recipes
│  ├─ Recipe Details (ratings, reviews)
│  ├─ My Purchases
│  ├─ Favorite Recipes
│  └─ Checkout (pay with tokens)
│
├─ 💬 Chat (AI Mentor)
│  ├─ Chat History
│  ├─ Ask Questions
│  ├─ Photo Analysis
│  ├─ Recipe Generation
│  └─ Token Balance Display
│
├─ 🧊 Fridge (Smart Pantry)
│  ├─ My Ingredients
│  ├─ What Can I Cook?
│  ├─ Expiration Tracker
│  └─ Nutrition Dashboard
│
├─ 🛡️ Admin (Admin Only)
│  ├─ Dashboard (stats)
│  ├─ Users Management
│  ├─ Token Bank
│  ├─ Orders
│  └─ Settings
│
└─ 🔐 Auth
   ├─ Login
   ├─ Register
   └─ Profile Setup
```

### Data Flow

```
Frontend (Next.js 16)
    ↓
Context API (UserContext, LanguageContext)
    ↓
Custom Hooks (useChat, useWallet, etc.)
    ↓
API Client (lib/api.ts, lib/admin-api.ts)
    ↓
Backend API (koyeb.app)
    ↓
Database
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Shadcn UI
- **State Management**: React Context + useState
- **Form Handling**: HTML forms + validation

### Backend (To be implemented)
- **Framework**: Node.js (Express/Fastify)
- **Database**: PostgreSQL (recommended)
- **Auth**: JWT tokens
- **API Style**: RESTful
- **Hosting**: koyeb.app (already deployed)

### DevOps
- **Version Control**: Git
- **Deployment**: Vercel (frontend) + koyeb.app (backend)
- **Package Manager**: npm/yarn
- **Build Tools**: Next.js built-in

---

## 📡 API Endpoints (30+ mapped)

### Authentication (3 endpoints)
```
POST   /auth/login           (username, password)
POST   /auth/register        (email, name, password)
POST   /auth/logout          (token validation)
```

### User Profile (5 endpoints)
```
GET    /user/profile         (fetch user data)
PUT    /user/profile         (update name, email, bio)
POST   /user/avatar          (upload avatar image)
GET    /user/health          (fetch health data)
PUT    /user/health          (update health metrics)
```

### Wallet (5 endpoints)
```
GET    /wallet/balance       (current tokens)
GET    /wallet/transactions  (history)
PUT    /wallet/deduct-tokens (spend tokens)
POST   /wallet/send          (send to user)
POST   /wallet/purchase      (buy tokens with money)
```

### Academy (6 endpoints)
```
GET    /academy/courses      (list all courses)
GET    /academy/courses/:id  (course details)
POST   /academy/enroll       (join course)
POST   /academy/complete     (finish course, earn tokens)
GET    /academy/progress     (user progress)
GET    /academy/leaderboard  (top students)
```

### Marketplace (4 endpoints)
```
GET    /marketplace/recipes  (list recipes)
GET    /marketplace/recipes/:id (recipe details)
POST   /marketplace/purchase (buy recipe)
GET    /marketplace/my-purchases (my recipes)
```

### Chat & AI (4 endpoints)
```
POST   /ai/chef-mentor/session (create session)
POST   /ai/chef-mentor/message (send message)
POST   /ai/analyze-image       (photo analysis)
POST   /ai/generate-recipe     (create recipe)
```

### Fridge (3 endpoints)
```
GET    /fridge/ingredients   (my ingredients)
POST   /fridge/add-ingredient (add to pantry)
POST   /fridge/what-to-cook  (get recommendations)
```

### Admin (8+ endpoints)
```
GET    /admin/stats          (system statistics)
GET    /admin/users          (all users)
PUT    /admin/users/:id      (edit user)
DELETE /admin/users/:id      (delete user)
GET    /admin/orders         (all orders)
GET    /admin/token-bank     (token statistics)
POST   /admin/token-bank/allocate (add tokens)
POST   /admin/token-bank/revoke   (remove tokens)
```

---

## 📊 Implementation Status

| Feature | UI | API | Database | Status |
|---------|----|----|----------|--------|
| Auth | ✅ | ❌ | ❌ | Partial |
| Profiles | ✅ | ❌ | ❌ | Ready for API |
| Academy | ✅ | ❌ | ❌ | Ready for API |
| Marketplace | ✅ | ❌ | ❌ | Ready for API |
| Chat | ✅ | ⚠️ | ❌ | Partial (mock AI) |
| Fridge | ⚠️ | ❌ | ❌ | In Progress |
| Wallet | ✅ | ❌ | ❌ | Ready for API |
| Admin | ✅ | ❌ | ❌ | Ready for API |

---

## 🚀 6-Phase Implementation Plan

### Phase 1: Profile API Integration
**Timeline**: 3-4 days  
**Tasks**:
- [ ] Connect GET /user/profile
- [ ] Connect PUT /user/profile
- [ ] Connect avatar upload
- [ ] Connect health data endpoints
**Impact**: Users can see/edit their profiles

### Phase 2: Wallet & Token System
**Timeline**: 4-5 days  
**Tasks**:
- [ ] Implement token balance retrieval
- [ ] Add token deduction system
- [ ] Implement token sending
- [ ] Integrate with chat (cost tracking)
**Impact**: Token economy becomes real

### Phase 3: Academy Integration
**Timeline**: 5-6 days  
**Tasks**:
- [ ] Connect course listing
- [ ] Implement enrollment
- [ ] Track progress
- [ ] Award tokens on completion
**Impact**: Users can take real courses

### Phase 4: Marketplace Integration
**Timeline**: 4-5 days  
**Tasks**:
- [ ] Connect recipe catalog
- [ ] Implement purchase system
- [ ] Integrate token deduction
- [ ] Track purchase history
**Impact**: Recipe economy works

### Phase 5: Chat & AI Enhancement
**Timeline**: 4-5 days  
**Tasks**:
- [ ] Connect token cost system
- [ ] Implement Vision API (photo analysis)
- [ ] Add recipe generation with API
- [ ] Track token usage
**Impact**: AI provides real value

### Phase 6: Admin & Analytics
**Timeline**: 3-4 days  
**Tasks**:
- [ ] Implement all admin endpoints
- [ ] Add audit logging
- [ ] Create analytics dashboard
- [ ] User management system
**Impact**: Platform becomes manageable

**Total Timeline**: 3-4 weeks of development

---

## 📁 Project Structure

```
/workspace
├─ README.md                     (Project overview)
├─ package.json                  (Dependencies)
├─ tsconfig.json                 (TypeScript config)
├─ tailwind.config.ts            (Tailwind config)
├─ next.config.ts                (Next.js config)
│
├─ app/                          (Main Next.js App Router)
│  ├─ page.tsx                   (Home page)
│  ├─ layout.tsx                 (Root layout)
│  ├─ (chat)/                    (Chat section)
│  ├─ academy/                   (Learning platform)
│  ├─ admin/                     (Admin panel)
│  ├─ auth/                      (Login/Register)
│  ├─ fridge/                    (Smart pantry)
│  ├─ market/                    (Marketplace)
│  ├─ profile/                   (User profile)
│  └─ [other routes]/
│
├─ components/                   (Reusable components)
│  ├─ profile/                   (Profile components)
│  ├─ admin/                     (Admin components)
│  ├─ chat/                      (Chat components)
│  ├─ academy/                   (Course components)
│  ├─ market/                    (Marketplace components)
│  ├─ common/                    (Shared components)
│  └─ ui/                        (UI primitives)
│
├─ hooks/                        (Custom React hooks)
│  ├─ useChat.ts                 (Chat logic)
│  ├─ useWallet.ts               (Wallet logic)
│  ├─ useProfileTranslations.ts  (Translation)
│  └─ [other hooks]/
│
├─ lib/                          (Utilities & API clients)
│  ├─ api.ts                     (Main API client)
│  ├─ admin-api.ts               (Admin API client)
│  ├─ types.ts                   (TypeScript types)
│  ├─ constants.ts               (Constants)
│  └─ [other utilities]/
│
├─ contexts/                     (React Context)
│  ├─ UserContext.tsx            (User data & auth)
│  └─ LanguageContext.tsx        (i18n)
│
├─ public/                       (Static assets)
│  ├─ icons/                     (App icons)
│  ├─ manifest.json              (PWA manifest)
│  └─ [other assets]/
│
└─ [documentation]/              (Markdown docs)
   ├─ NAVIGATION_ARCHITECTURE.md  (How sections connect)
   ├─ API_INTEGRATION_FLOW.md     (API endpoints + examples)
   ├─ CHAT_LOGIC_DETAILED.md      (Chat implementation)
   ├─ ADMIN_PANEL_OVERVIEW.md     (Admin panel guide)
   ├─ ADMIN_PANEL_ARCHITECTURE.md (Admin diagrams)
   └─ ADMIN_PANEL_COMPLETE.md     (Full admin summary)
```

---

## 🎓 Team Roles

### Frontend Developer
- Builds UI components
- Manages state & hooks
- Implements responsive design
- Handles client-side validation

### Backend Developer
- Creates API endpoints
- Manages database
- Implements authentication
- Handles token logic

### Product Manager
- Defines features
- Prioritizes tasks
- Gathers requirements
- Communicates with team

### Designer
- Creates mockups
- Designs UI/UX
- Defines design system
- Ensures brand consistency

---

## 🔗 Key Documentation Files

1. **NAVIGATION_ARCHITECTURE.md**
   - How all sections interconnect
   - User journey examples
   - Data flow between features

2. **API_INTEGRATION_FLOW.md**
   - All 30+ endpoints detailed
   - Request/response examples
   - Dependency diagrams

3. **CHAT_LOGIC_DETAILED.md**
   - Chat system breakdown
   - Token cost structure
   - 4 expansion phases

4. **ADMIN_PANEL_OVERVIEW.md**
   - Admin feature guide
   - Step-by-step instructions
   - API details

5. **ADMIN_PANEL_ARCHITECTURE.md**
   - Visual diagrams
   - Data models
   - Security matrix

---

## 💡 Key Insights

### What Makes This Platform Unique
1. **Token Economy**: Unlike free alternatives, tokens create value & engagement
2. **AI Integration**: Dima Fomin's expertise accessible to everyone
3. **Holistic Learning**: Courses + recipes + health = complete culinary education
4. **Community**: Share knowledge, earn tokens, build reputation

### Technical Advantages
1. **Next.js 16**: Modern, scalable, great DX
2. **TypeScript**: Type safety reduces bugs
3. **Tailwind CSS**: Fast, consistent styling
4. **Mobile-First**: Works on any device
5. **PWA Ready**: Can work offline (with service worker)

### Competitive Positioning
- vs. MasterClass: More interactive, cheaper, community-driven
- vs. Udemy: Focused on modern cooking, better UI
- vs. Specialized culinary sites: Has AI mentor + tokens

---

## 📈 Success Metrics

- **User Growth**: Target 10K users in first 3 months
- **Course Completion**: 70%+ completion rate
- **Token Transactions**: 5K+ daily transactions
- **User Retention**: 40%+ monthly retention
- **AI Chat Usage**: 50%+ users interact with mentor
- **Marketplace Revenue**: $10K+ monthly revenue

---

## 🎯 Next Immediate Steps

1. **This Week**
   - [ ] Review all 4 admin documentation files
   - [ ] Start backend auth system
   - [ ] Create database schema

2. **Next Week**
   - [ ] Implement Phase 1 (Profile API)
   - [ ] Connect real data to profile
   - [ ] Test with real users

3. **Week 3**
   - [ ] Implement Phase 2 (Wallet)
   - [ ] Test token transactions
   - [ ] Deploy to staging

4. **Week 4+**
   - [ ] Continue remaining phases
   - [ ] Gather user feedback
   - [ ] Iterate on features

---

## 📞 Resources

- **API Base URL**: https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api
- **Frontend**: Deployed on Vercel
- **GitHub**: [your repo URL]
- **Figma**: [design system link if available]

---

**Project Status**: 🟡 **In Progress - UI Complete, API Starting**  
**Last Updated**: 2025-01-15  
**Owner**: Modern Food Academy Team  
**License**: [Your License]

---

This document serves as the **master reference** for the entire Modern Food Academy platform. Refer back here when questions arise about architecture, features, or implementation plans.

🚀 **Let's build the future of culinary education!**
