# 📊 PAGES AUDIT - Modern Food Academy

**Дата:** 25 декабря 2025  
**Всего страниц:** 38  
**Цель:** Проверить соответствие Design System

---

## 📋 Структура сайта

### 🏠 **Main Pages (7)**

| # | Path | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 1 | `/` | ✅ REFERENCE | - | Main page - Design System эталон |
| 2 | `/fridge` | ⚠️ PARTIAL | HIGH | Uses PageLayout, needs Container/Card |
| 3 | `/assistant` | ⚠️ PARTIAL | HIGH | Uses PageLayout, custom styles |
| 4 | `/recipes` | ⚠️ PARTIAL | HIGH | Uses PageLayout, needs Grid refactor |
| 5 | `/profile` | ❌ NO | 🔴 CRITICAL | No PageLayout + conflicts with academy/user |
| 6 | `/market` | ❓ UNKNOWN | MEDIUM | Need to check |
| 7 | `/cheftokens` | ❓ UNKNOWN | MEDIUM | Rename to /profile/tokens? |

---

### 🎓 **Academy Section (13)**

| # | Path | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 8 | `/academy` | ❓ UNKNOWN | HIGH | Hub page |
| 9 | `/academy/courses` | ❓ UNKNOWN | HIGH | Course catalog |
| 10 | `/academy/courses/[id]` | ❓ UNKNOWN | HIGH | Course details |
| 11 | `/academy/paths/[pathId]` | ❓ UNKNOWN | MEDIUM | Learning path |
| 12 | `/academy/paths/[pathId]/modules/[moduleId]` | 👁️ CURRENT | MEDIUM | Module page (user is here) |
| 13 | `/academy/tasks` | ❓ UNKNOWN | MEDIUM | Task list |
| 14 | `/academy/feed` | ❓ UNKNOWN | 🔴 CRITICAL | DUPLICATE with community? |
| 15 | `/academy/community` | ❓ UNKNOWN | 🔴 CRITICAL | DUPLICATE with feed? |
| 16 | `/academy/certificates` | ❓ UNKNOWN | LOW | User certificates |
| 17 | `/academy/leaderboard` | ❓ UNKNOWN | LOW | Rankings |
| 18 | `/academy/earn-tokens` | ❓ UNKNOWN | MEDIUM | Token earning guide |
| 19 | `/academy/create` | ❌ NO | 🔴 CRITICAL | 900 lines! Needs refactor |
| 20 | `/academy/user/[id]` | ❌ DUPLICATE | 🔴 CRITICAL | DUPLICATE with /profile/[id] |

---

### 🍳 **Recipes Section (4)**

| # | Path | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 21 | `/recipes` | ⚠️ PARTIAL | HIGH | Uses PageLayout + PageGrid |
| 22 | `/recipes/[id]` | ❓ UNKNOWN | HIGH | Recipe details |
| 23 | `/recipes/[id]/cook` | ❓ UNKNOWN | MEDIUM | Cooking mode |
| 24 | `/recipes/saved` | ❓ UNKNOWN | MEDIUM | Saved recipes |

---

### 👤 **Profile Section (3)**

| # | Path | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 25 | `/profile` | ❌ NO | 🔴 CRITICAL | Own profile, needs full refactor + API consolidation |
| 26 | `/profile/[id]` | ❌ DUPLICATE | 🔴 CRITICAL | DUPLICATE with /academy/user/[id] |
| 27 | `/profile/new` | ❓ UNKNOWN | MEDIUM | Profile creation |

---

### 🛒 **Market Section (2)**

| # | Path | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 28 | `/market` | ❓ UNKNOWN | MEDIUM | Product catalog |
| 29 | `/market/[id]` | ❓ UNKNOWN | MEDIUM | Product details |

---

### 🔧 **Admin Section (11)**

| # | Path | Status | Priority | Notes |
|---|------|--------|----------|-------|
| 30 | `/admin` | ❓ UNKNOWN | LOW | Admin dashboard |
| 31 | `/admin/dashboard` | ❓ UNKNOWN | LOW | Main dashboard |
| 32 | `/admin/users` | ❓ UNKNOWN | LOW | User management |
| 33 | `/admin/courses` | ❓ UNKNOWN | LOW | Course management |
| 34 | `/admin/courses/create` | ❓ UNKNOWN | LOW | Create course |
| 35 | `/admin/recipes` | ❓ UNKNOWN | LOW | Recipe management |
| 36 | `/admin/recipes/create` | ❓ UNKNOWN | LOW | Create recipe |
| 37 | `/admin/orders` | ❓ UNKNOWN | LOW | Order management |
| 38 | `/admin/token-bank` | ❓ UNKNOWN | LOW | Token bank |
| 39 | `/admin/activity-log` | ❓ UNKNOWN | LOW | Activity logs |
| 40 | `/admin/integrations` | ❓ UNKNOWN | LOW | Integrations |
| 41 | `/admin/settings` | ❓ UNKNOWN | LOW | Admin settings |

---

## 📊 Статистика по статусу

### Design System Compliance:

```
✅ REFERENCE (эталон):    1 страница  (2.6%)
⚠️ PARTIAL (частично):    3 страницы (7.9%)
❌ NO (не соответствует):  2 страницы (5.3%)
🔴 DUPLICATES (дубликаты): 4 страницы (10.5%)
❓ UNKNOWN (не проверено): 28 страниц (73.7%)
```

### Приоритет рефакторинга:

```
🔴 CRITICAL: 6 страниц (15.8%) - Дубликаты + архитектурные проблемы
HIGH:        7 страниц (18.4%) - Основные user-facing
MEDIUM:      10 страниц (26.3%) - Важные, но не критичные
LOW:         15 страниц (39.5%) - Admin, вспомогательные
```

### 🔴 CRITICAL Issues:
1. `/profile/[id]` + `/academy/user/[id]` — ДУБЛИКАТ (2 страницы, 2 API, разные данные)
2. `/academy/feed` + `/academy/community` — ПОТЕНЦИАЛЬНЫЙ ДУБЛИКАТ
3. `/academy/create` — 900 строк, нужен рефакторинг
4. `/cheftokens` — переименовать в `/profile/tokens`

---

## 🎯 План аудита

### Phase 1: HIGH Priority (10 страниц)
**Срок:** 1-2 дня

1. ✅ `/` - Main page (REFERENCE)
2. ⚠️ `/fridge` - Needs Container/Card refactor
3. ⚠️ `/assistant` - Remove custom styles
4. ⚠️ `/recipes` - Grid refactor
5. ❌ `/profile` - Full PageLayout migration
6. ❓ `/market` - Check & refactor
7. ❓ `/academy` - Check & refactor
8. ❓ `/academy/courses` - Check & refactor
9. ❓ `/academy/courses/[id]` - Check & refactor
10. ❓ `/recipes/[id]` - Check & refactor

### Phase 2: MEDIUM Priority (10 страниц)
**Срок:** 2-3 дня

11. `/academy/paths/[pathId]`
12. `/academy/paths/[pathId]/modules/[moduleId]`
13. `/academy/tasks`
14. `/recipes/[id]/cook`
15. `/recipes/saved`
16. `/profile/[id]`
17. `/market/[id]`
18. `/cheftokens`
19-20. Other academy pages

### Phase 3: LOW Priority (18 страниц)
**Срок:** по мере необходимости

21-38. Admin pages
- Dashboard
- Management pages
- Settings
- Создание контента

**Note:** Admin pages могут иметь свой стиль (отличный от user-facing), но должны использовать те же tokens.

---

## 🔍 Checklist для каждой страницы

### Проверить:
- [ ] Использует `PageLayout` wrapper
- [ ] Использует `Container/Section/Card` из Containers.tsx
- [ ] Нет inline styles (`style={{}}`)
- [ ] Нет кастомных цветов (`bg-[#hex]`)
- [ ] Нет кастомных радиусов (`rounded-[px]`)
- [ ] Нет кастомных размеров (`w-[px]`)
- [ ] Использует animations из design-system.ts
- [ ] Spacing соответствует 8px base
- [ ] Typography соответствует главной
- [ ] Responsive (mobile-first)
- [ ] Dark mode работает

### Если НЕТ хотя бы по одному пункту:
→ Страница требует рефакторинга

---

## 🚀 Quick Wins (можно сделать быстро)

### 1. `/fridge` - 15 минут
- Обернуть content в `<Container>`
- Заменить кастомные card'ы на `<Card>`
- Использовать `<Grid>` для списка продуктов

### 2. `/assistant` - 20 минут
- Удалить `pt-[80px]` и другие хардкоды
- Использовать `<AnimatedContainer>` вместо custom motion
- Заменить grid на `<PageGrid>`

### 3. `/recipes` - 15 минут
- Уже использует `PageGrid`, проверить props
- Убедиться что card'ы используют `<Card>` из Containers

### 4. `/profile` - 30 минут
- Добавить `<PageLayout>` wrapper
- Заменить custom header на `<PageHeader>`
- Использовать `<Section>` для блоков

**Итого Quick Wins:** ~1.5 часа работы для 4 главных страниц

---

## 📋 Detailed Status (проверенные страницы)

### ✅ `/` - Main Page (REFERENCE)
**Status:** ✅ Perfect (эталон)
**Components:**
- Uses `DynamicMetaTags`, `StructuredData`, `ScrollProgress`, `ScrollToTop`
- Section-based layout (Hero, About, Courses, etc.)
- Consistent spacing (py-16 sm:py-24)
- Glass cards with backdrop-blur
- Gradient hero (from-gray-950 via-sky-950 to-cyan-950)
- Framer Motion animations (fadeUp, fadeDown)

**No changes needed** - это REFERENCE для всех

---

### ⚠️ `/fridge` - Fridge Management
**Status:** ⚠️ PARTIAL (uses PageLayout, но не Container/Card)
**Current:**
```tsx
<PageLayout background="gradient-blue">
  <PageHeader title="Moja Lodówka" icon={<Refrigerator />} />
  {/* Custom divs, no Container/Card */}
</PageLayout>
```

**Issues:**
- ❌ No `<Container>` wrapper
- ❌ Custom card styling (inline classes)
- ❌ No `<Grid>` for product list

**Action:** Refactor to use Container/Card/Grid

---

### ⚠️ `/assistant` - AI Assistant
**Status:** ⚠️ PARTIAL (uses PageLayout, custom styles)
**Current:**
```tsx
<PageLayout background="gradient-purple">
  <PageHeader title="AI Asystent" icon={<Sparkles />} />
  {/* 1092 lines, много custom стилей */}
</PageLayout>
```

**Issues:**
- ❌ Huge file (1092 lines)
- ❌ Custom animations (не из design-system)
- ❌ Custom grid classes
- ❌ Hardcoded spacing (mt-8, mb-6, etc.)

**Action:** 
1. Разбить на компоненты
2. Использовать animations из design-system
3. Заменить grid на `<PageGrid>`

---

### ⚠️ `/recipes` - Recipe Catalog
**Status:** ⚠️ PARTIAL (uses PageLayout + PageGrid)
**Current:**
```tsx
<PageLayout background="default">
  <PageHeader title="Gotowanie" icon={<ChefHat />} />
  <PageGrid columns={3} gap="md">
    {recipes.map(...)}
  </PageGrid>
</PageLayout>
```

**Issues:**
- ⚠️ Uses old `RecipeCard` component (не из Containers)
- ⚠️ Filter section uses custom styling

**Action:** 
1. Migrate to `UnifiedRecipeCard`
2. Wrap filters in `<Card>`

---

### ❌ `/profile` - User Profile
**Status:** ❌ NO (not using PageLayout at all)
**Current:**
```tsx
<main className="min-h-screen bg-white dark:bg-gray-900 pt-20">
  <div className="max-w-7xl mx-auto px-4">
    {/* Custom profile structure */}
  </div>
</main>
```

**Issues:**
- ❌ No `<PageLayout>` wrapper
- ❌ No `<Container>`, `<Section>`, `<Card>`
- ❌ Custom spacing (pt-20, px-4)
- ❌ Custom max-width (max-w-7xl)
- ❌ No ScrollProgress/ScrollToTop

**Action:** Full migration to Design System

---

## 🎯 Next Actions

### Immediate (сегодня):
1. Проверить `/market` page
2. Проверить `/academy` page
3. Проверить `/academy/courses` page
4. Создать детальный план рефакторинга

### This Week:
1. Refactor HIGH priority pages (10 страниц)
2. Create reusable components for academy section
3. Migrate recipe details page

### This Month:
1. Refactor MEDIUM priority pages
2. Audit admin section
3. Create admin-specific components (if needed)

---

## 📝 Notes

### Admin Pages:
Admin pages могут иметь **другой layout** (sidebar, tables, forms), но должны:
- ✅ Использовать те же **colors** из design-system
- ✅ Использовать те же **spacing** (8px base)
- ✅ Использовать те же **typography**
- ✅ Использовать те же **shadows** и **radius**
- ⚠️ Могут НЕ использовать PageLayout (свой AdminLayout)

### Dynamic Routes:
Страницы с `[id]`, `[pathId]` etc. проверяются **вместе** с их catalog pages:
- `/recipes` + `/recipes/[id]` = одна секция
- `/academy/courses` + `/academy/courses/[id]` = одна секция

---

**Автор:** GitHub Copilot  
**Last Updated:** 25 декабря 2025  
**Next Review:** После Phase 1 refactoring
