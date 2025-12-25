# 🔴 DUPLICATES & CONFLICTS ANALYSIS

**Дата:** 25 декабря 2025  
**Цель:** Выявить дубликаты, конфликты и архитектурные проблемы  
**Статус:** 🔴 CRITICAL - Требуется немедленное решение

---

## 🔴 CRITICAL Issues (Требуют немедленного решения)

### 1. Profile vs Academy User - ДУБЛИКАТ

**Конфликт:**
```
app/academy/user/[id]/page.tsx   ❌ 274 строки - Academy user profile
app/profile/[id]/page.tsx        ❌ 232 строки - Public user profile
app/profile/page.tsx             ✅ Own profile
app/profile/new/page.tsx         ⚠️ Profile creation
```

**Анализ кода:**

#### `/academy/user/[id]` (274 строки):
```tsx
// Использует academyApi.getProfile()
const profile = await academyApi.getProfile(userId);
// Показывает: posts, followers, following, awards
// UI: custom layout, нет PageLayout
// Фичи: follow/unfollow, tabs (posts/saved)
```

#### `/profile/[id]` (232 строки):
```tsx
// Использует userApi
const profile = await userApi.getProfile(userId);
// Показывает: posts, transactions, health data
// UI: использует ProfileView component
// Фичи: follow/unfollow, message, back button
```

**Проблема:**
- ❌ **ДВА API** для одного пользователя (academyApi vs userApi)
- ❌ **ДВА layout** (custom vs ProfileView)
- ❌ **РАЗНЫЕ данные** (awards vs health data)
- ❌ **Дублирование логики** (follow/unfollow в обоих)
- ❌ **Разные стили** (нет единой системы)

**Решение:**

✅ **ВАРИАНТ A (рекомендуемый):**
```
/profile
  /page.tsx          // Own profile (current user)
  /[id]/page.tsx     // Public profile (any user)
  
DELETE: /academy/user/[id]
```

**Логика:**
- Profile — единая точка входа для ВСЕХ пользователей
- Academy context доступен внутри profile (tabs, courses, etc.)
- Один API, один компонент, один источник правды

✅ **ВАРИАНТ B (если academy context критичен):**
```
/academy/user/[id]  → REDIRECT to /profile/[id]

# В /profile/[id]:
if (from === 'academy') {
  // Show academy-specific tabs (courses, certificates)
}
```

**Action Items:**
1. ❗️ **ВЫБРАТЬ** вариант A или B
2. ❗️ Объединить API (userApi + academyApi)
3. ❗️ Удалить `/academy/user/[id]` или превратить в redirect
4. ❗️ Миграция на единый ProfileView component
5. ❗️ Тесты на все profile routes

**Priority:** 🔴 CRITICAL  
**Effort:** 4-6 hours  
**Impact:** HIGH (устраняет дублирование кода + API)

---

### 2. Academy Create - НЕЯСНАЯ ОТВЕТСТВЕННОСТЬ

**Проблема:**
```
app/academy/create/page.tsx         ❌ 900 строк! Создание рецептов
app/admin/recipes/create/page.tsx   ❓ Создание рецептов (admin)
app/admin/courses/create/page.tsx   ❓ Создание курсов (admin)
```

**Анализ кода:**

#### `/academy/create` (900 строк!):
```tsx
export default function CreateRecipePage() {
  // Создание РЕЦЕПТА в academy feed
  // Фичи:
  // - Upload image
  // - AI generation (prompt)
  // - Ingredients + nutrition
  // - Steps
  // - Category, difficulty, time
  
  // НЕТ проверки прав доступа!
  // НЕТ роли (admin/user/chef)
}
```

**Вопросы:**
1. Кто может создавать? User? Chef? Admin?
2. Это для academy feed или для catalog?
3. Почему 900 строк в одном файле?
4. Где валидация и права доступа?

**Проблема:**
- ❌ **900 строк** в одном компоненте (монолит)
- ❌ **Неясная роль** (user vs admin)
- ❌ **Дубликат** с admin/recipes/create?
- ❌ **Нет прав доступа** (кто угодно может создать?)

**Решение:**

✅ **ВАРИАНТ A (User-generated content):**
```
/academy/create  → Stays (for users to share recipes)
/admin/recipes/create → Admin-only (for official catalog)

Разделение:
- Academy create = Social feed posts (users share recipes)
- Admin create = Official catalog recipes (curated)
```

✅ **ВАРИАНТ B (Consolidate):**
```
DELETE: /academy/create

/admin/recipes/create → Universal recipe creation
  - Check role (admin vs user)
  - If user → create in academy feed
  - If admin → create in catalog
```

**Рекомендация:** ВАРИАНТ A

**Но требуется:**
1. ❗️ Разбить `/academy/create` на компоненты (900 строк!)
2. ❗️ Добавить проверку прав (isAuthenticated)
3. ❗️ Ясно документировать: academy = UGC, admin = official
4. ❗️ Переиспользовать компоненты между academy и admin

**Action Items:**
1. ❗️ Разбить на компоненты:
   - `CreateRecipeForm` (reusable)
   - `IngredientInput` (reusable)
   - `StepEditor` (reusable)
   - `AIPromptGenerator` (reusable)
2. ❗️ Добавить guard: `if (!user) redirect('/login')`
3. ❗️ Документировать в README: academy vs admin создание

**Priority:** 🟠 HIGH  
**Effort:** 6-8 hours (refactor + components)  
**Impact:** HIGH (900 строк → ~300 строк + reusability)

---

## 🟠 MEDIUM Issues (Требуют проверки)

### 3. Feed vs Community - ПОТЕНЦИАЛЬНЫЙ ДУБЛИКАТ

**Анализ:**
```
app/academy/feed/page.tsx         256 строк - Global recipe feed
app/academy/community/page.tsx    322 строк - Community posts
```

#### `/academy/feed` (256 строк):
```tsx
// Показывает: Recipe posts (global)
// Фичи: Search, Trending, Create button
// UI: RecipePostCard list
// Сортировка: Latest, Trending
```

#### `/academy/community` (322 строк):
```tsx
// Показывает: Recipe posts (filtered)
// Фичи: Search, Filter (all/trending/following), Create button
// UI: RecipePostCard list
// Сортировка: All, Trending, Following
```

**Проблема:**
- ⚠️ **Почти идентичный функционал**
- ⚠️ **Оба показывают recipe posts**
- ⚠️ **Разница только в фильтрах?**

**Решение:**

✅ **ВАРИАНТ A (Объединить):**
```
DELETE: /academy/feed

/academy/community
  - Tabs: Feed | Trending | Following
  - Search
  - Filter
```

✅ **ВАРИАНТ B (Разделить логически):**
```
/academy/feed       → PERSONAL feed (following + recommended)
/academy/community  → GLOBAL community (all users, explore)

Разделение:
- Feed = Personalized content (for you)
- Community = Explore all (discover)
```

**Рекомендация:** Проверить analytics

**Если:**
- Feed и Community используются ОДИНАКОВО → Объединить (ВАРИАНТ A)
- Разные use cases → Оставить (ВАРИАНТ B), но унифицировать UI

**Action Items:**
1. ❓ Проверить: чем feed отличается от community в продукте?
2. ❓ Analytics: какая страница используется чаще?
3. ✅ Если объединяем: оставить `/academy/community` с tabs
4. ✅ Если разделяем: документировать разницу + переиспользовать компоненты

**Priority:** 🟡 MEDIUM  
**Effort:** 2-4 hours  
**Impact:** MEDIUM (упрощение навигации)

---

### 4. Tokens - ТРИ УРОВНЯ ОДНОЙ СУЩНОСТИ

**Анализ:**
```
app/academy/earn-tokens/page.tsx   ❓ User токенов (earn)
app/cheftokens/page.tsx            ❓ Dashboard токенов
app/admin/token-bank/page.tsx      ❓ Admin управление
```

**Вопрос:** Это дубликаты или разные роли?

**Логика (если правильная):**
```
/academy/earn-tokens  → How to earn (guide + missions)
/cheftokens           → My tokens dashboard (balance + history)
/admin/token-bank     → Admin control (mint/burn/transactions)
```

**Проблема:**
- ⚠️ **Часто токены выглядят "другим сайтом"** (разные стили)
- ⚠️ Нет единого token component

**Решение:**

✅ **Если это разные роли (корректно):**
```
/academy/earn-tokens  → Keep (how to earn)
/cheftokens           → Rename to /profile/tokens (consistency)
/admin/token-bank     → Keep (admin only)

Единая система:
- TokenBalance component (reusable)
- TokenTransaction component (reusable)
- TokenEarnMission component (reusable)
```

**Action Items:**
1. ❓ Проверить: `/cheftokens` = user dashboard или landing?
2. ✅ Если dashboard → переименовать в `/profile/tokens`
3. ✅ Создать shared components:
   - `TokenBalance`
   - `TokenHistory`
   - `TokenMission`
4. ✅ Применить Design System (единые colors, spacing)

**Priority:** 🟡 MEDIUM  
**Effort:** 3-4 hours  
**Impact:** MEDIUM (consistency + reusability)

---

## ✅ CORRECT Architecture (Оставить как есть)

### Recipes: Public + Admin (ПРАВИЛЬНО)
```
✅ app/recipes/page.tsx                // Catalog (public)
✅ app/recipes/[id]/page.tsx           // Recipe details (public)
✅ app/recipes/[id]/cook/page.tsx      // Cooking mode (user)
✅ app/recipes/saved/page.tsx          // Saved recipes (user)

✅ app/admin/recipes/page.tsx          // Recipe management (admin)
✅ app/admin/recipes/create/page.tsx   // Create recipe (admin)
```

**Почему это правильно:**
- ✅ Чёткое разделение: public / user / admin
- ✅ Нет дубликатов
- ✅ Каждая страница имеет свою зону ответственности

**Никаких изменений не требуется!**

---

### Courses: Academy + Admin (ПРАВИЛЬНО)
```
✅ app/academy/courses/page.tsx        // Course catalog (browse)
✅ app/academy/courses/[id]/page.tsx   // Course details (learn)

✅ app/admin/courses/page.tsx          // Course management (admin)
✅ app/admin/courses/create/page.tsx   // Create course (admin)
```

**Почему это правильно:**
- ✅ Academy = Learning (user-facing)
- ✅ Admin = Management (admin-only)
- ✅ Разные UI/UX (правильно)

**Требуется:** Применить Design System для consistency

---

### Admin Pages (ПРАВИЛЬНО)
```
✅ app/admin/dashboard/page.tsx
✅ app/admin/users/page.tsx
✅ app/admin/orders/page.tsx
✅ app/admin/activity-log/page.tsx
✅ app/admin/integrations/page.tsx
✅ app/admin/settings/page.tsx
```

**Почему это правильно:**
- ✅ Логическая группировка (admin section)
- ✅ Чёткие зоны ответственности
- ✅ Нет дубликатов

**Требуется:** AdminLayout + Design System tokens

---

## 📋 Action Plan

### Phase 1: CRITICAL (Сегодня)

#### 1.1 Profile Consolidation (4-6 hours)
- [ ] **Решить:** Вариант A или B для profile/user
- [ ] **Объединить API:** userApi + academyApi → profileApi
- [ ] **Удалить/Redirect:** `/academy/user/[id]`
- [ ] **Миграция:** Всё в `/profile/[id]`
- [ ] **Тесты:** Profile routes

#### 1.2 Academy Create Refactor (6-8 hours)
- [ ] **Разбить на компоненты:** 900 строк → 300 строк
  - [ ] CreateRecipeForm
  - [ ] IngredientInput
  - [ ] StepEditor
  - [ ] AIPromptGenerator
- [ ] **Добавить guards:** isAuthenticated check
- [ ] **Документировать:** Academy vs Admin создание
- [ ] **Переиспользование:** Components в admin

---

### Phase 2: MEDIUM (Эта неделя)

#### 2.1 Feed vs Community Resolution (2-4 hours)
- [ ] **Анализ:** Чем feed отличается от community?
- [ ] **Решение:** Объединить или разделить
- [ ] **Действие:** Implement chosen variant
- [ ] **UI Unification:** Shared components

#### 2.2 Tokens Unification (3-4 hours)
- [ ] **Rename:** `/cheftokens` → `/profile/tokens`
- [ ] **Создать components:**
  - [ ] TokenBalance
  - [ ] TokenHistory
  - [ ] TokenMission
- [ ] **Apply Design System:** Единые стили

---

### Phase 3: LOW (По мере необходимости)

#### 3.1 Design System Application
- [ ] Apply to Academy pages
- [ ] Apply to Admin pages
- [ ] Apply to Profile pages

#### 3.2 Layout Consolidation
- [ ] PublicLayout (recipes, market, etc.)
- [ ] AcademyLayout (courses, paths, etc.)
- [ ] AdminLayout (dashboard, management)
- [ ] ProfileLayout (user profile)

---

## 🎯 Decision Matrix

### Profile vs Academy User

| Критерий | Вариант A (Consolidate) | Вариант B (Redirect) |
|----------|------------------------|----------------------|
| Effort | 6 hours | 2 hours |
| Code reduction | 🟢 -200 строк | 🟡 -50 строк |
| API complexity | 🟢 Simple (one API) | 🟡 Complex (two APIs) |
| UX clarity | 🟢 Clear (one profile) | 🟡 Confusing (two routes) |
| **Recommendation** | ✅ **ВЫБРАТЬ** | ⚠️ Quick fix |

### Academy Create

| Критерий | Вариант A (Split roles) | Вариант B (Consolidate) |
|----------|-------------------------|-------------------------|
| Clarity | 🟢 Clear separation | 🟡 Needs role check |
| Effort | 8 hours | 10 hours |
| Flexibility | 🟢 UGC + Official | 🟡 One flow |
| **Recommendation** | ✅ **ВЫБРАТЬ** | ⚠️ More complex |

### Feed vs Community

| Критерий | Вариант A (Merge) | Вариант B (Split logic) |
|----------|-------------------|-------------------------|
| Simplicity | 🟢 One page | 🟡 Two pages |
| User confusion | 🟢 Clear | 🟡 "What's diff?" |
| Effort | 3 hours | 1 hour |
| **Recommendation** | ✅ If same use case | ✅ If different intent |

**→ Требуется product decision!**

---

## 📊 Impact Summary

### Code Reduction:
```
Before: ~2000 строк дублированного кода
After:  ~800 строк + shared components

Savings: 1200 строк (60% reduction)
```

### Architecture:
```
Before: 
- 2 profile systems
- 900-line monolith
- Unclear token pages
- Feed/Community confusion

After:
- 1 profile system
- Component-based architecture
- Clear token hierarchy
- Unified social pages
```

### Maintenance:
```
Before: Change profile → update 2 places
After:  Change profile → update 1 place

Time saved: 50% on future features
```

---

## 🚨 Immediate Actions (TODAY)

1. ❗️ **DECIDE:** Profile consolidation strategy (A or B)
2. ❗️ **DECIDE:** Feed vs Community (merge or split?)
3. ❗️ **START:** Refactor `/academy/create` (900 строк!)
4. ❗️ **DOCUMENT:** Architecture decisions in README

---

**Автор:** GitHub Copilot  
**Priority:** 🔴 CRITICAL  
**Estimated Total Effort:** 15-20 hours  
**Expected Impact:** 60% code reduction + Clear architecture
