# Profile V2 Roadmap 🚀

## Philosophy
**Profile = центр управления человеком, не admin panel**

Профиль отвечает на 4 вопроса:
1. **Кто я?** → Имя, уровень, XP
2. **Как я справляюсь?** → Budget, waste, progress
3. **Что я делал?** → Historia (last actions)
4. **Что дальше?** → Clear CTAs

---

## ✅ Current State (V1)

### What's Working:
- ✅ Clean 3-tab structure (Przegląd, Statystyki, Zasoby)
- ✅ Overview tab answers all 4 questions
- ✅ Statystyki tab has pure analytics
- ✅ Compact layout (fits on one page)
- ✅ 2-column layout on desktop (Stats sidebar + Content)

### What Needs Improvement:
- ⚠️ Too much info at once in Overview
- ⚠️ Some analytics duplicated between Overview and Statystyki
- ⚠️ No charts in Statystyki (just numbers)
- ⚠️ No unified design system for components

---

## 🔜 Next Steps (Priority Order)

### ✅ Step 1: Polish Statystyki Tab 📊 **[COMPLETED]**
**Goal**: Add visual analytics with charts

**Completed**:
- ✅ Weekly budget chart (spending over time) - `BudgetChart.tsx`
- ✅ Waste % trend (last 4 weeks) - `WasteChart.tsx`
- ✅ Cooked vs Consumed comparison - `CookedVsConsumedChart.tsx`
- ✅ Category breakdown donut chart - `CategoryChart.tsx`
- ✅ 2-column grid layout (4 charts)
- ✅ All charts use pure CSS/SVG + Framer Motion (no external libs)
- ✅ Responsive design (1 col mobile, 2 cols desktop)
- ✅ Animated entrance effects (staggered)
- ✅ Documentation created: `PROFILE_CHARTS_DOCUMENTATION.md`

**Implementation Details**:
- Charts folder: `components/profile/charts/`
- 4 chart components: BudgetChart, WasteChart, CategoryChart, CookedVsConsumedChart
- Mock data currently used (ready for backend integration)
- Design: Gradient backgrounds, animated bars/lines, color-coded legends
- Performance: Lightweight (~100KB), GPU-accelerated animations

**Next**: Connect real backend data (see charts documentation)

---

### Step 2: Unified Design System 🎨
**Goal**: Reusable components for consistency

**Create**:
```typescript
// KPI Component (для метрик)
components/profile/common/KPICard.tsx
Props: { icon, label, value, color, trend? }

// CTA Component (для действий)
components/profile/common/CTACard.tsx
Props: { icon, title, subtitle, onClick, gradient }

// History Row Component
components/profile/common/HistoryRow.tsx
Props: { type, text, timestamp, icon }
```

**Benefits**:
- Consistent spacing, colors, animations
- Easy to add new KPIs
- Reusable across all tabs

---

### Step 3: Overview Tab Simplification ✨
**Goal**: Overview, not dashboard

**Keep Only**:
1. Level progress bar (Кто я?)
2. Weekly budget (one-line progress)
3. Last 2 actions (Что я делал?)
4. 2 CTAs (Что дальше?)

**Remove**:
- Detailed action history → move to Statystyki
- Multiple progress bars → keep only most important

**Result**: Ultra-clean, fast to scan, answers 4 questions

---

### Step 4: Zasoby Tab Enhancement 📦
**Goal**: My content center

**Add**:
- [ ] Recipe cards with thumbnails (not just counts)
- [ ] Filter by date (last week, month, all)
- [ ] Quick actions: View, Cook again, Delete
- [ ] Cart preview (not just count)
- [ ] Course cards (not just count)

**Files to update**:
- `components/profile/tabs/ResourcesTab.tsx`
- Create: `components/profile/resources/RecipeCard.tsx`
- Create: `components/profile/resources/CourseCard.tsx`

---

### Step 5: Settings Section 🛠️
**Goal**: User preferences (future)

**When needed, create**:
- Language selector (PL / EN / UA)
- Currency selector (PLN / EUR / USD)
- Goals selector:
  - Похудение (weight loss)
  - Budżet (save money)
  - Muscle gain
  - Waste reduction

**Not now** - wait until users ask for it

---

## 📐 Technical Architecture

### Component Structure:
```
components/profile/
  ├── SimpleProfileHeader.tsx       ✅ Done
  ├── QuickStats.tsx                ✅ Done (sidebar)
  ├── ProfileTabs.tsx               ✅ Done
  ├── tabs/
  │   ├── OverviewTab.tsx           ✅ V1 Done → needs simplification
  │   ├── StatsTab.tsx              ✅ V1 Done → needs charts
  │   └── ResourcesTab.tsx          ✅ V1 Done → needs cards
  ├── common/                       🔜 Step 2
  │   ├── KPICard.tsx
  │   ├── CTACard.tsx
  │   └── HistoryRow.tsx
  ├── charts/                       🔜 Step 1
  │   ├── BudgetChart.tsx
  │   ├── WasteChart.tsx
  │   └── CategoryChart.tsx
  └── resources/                    🔜 Step 4
      ├── RecipeCard.tsx
      └── CourseCard.tsx
```

---

## 🎯 Design Principles

1. **Overview = Быстрый взгляд**
   - 10 секунд = понял всё
   - Ответы на 4 вопроса
   - Минимум скролла

2. **Statystyki = Глубокая аналитика**
   - Все детали тут
   - Charts, trends, comparisons
   - Для тех, кто хочет понять "как я справляюсь?"

3. **Zasoby = Мой контент**
   - Что у меня есть
   - Быстрый доступ к saved/cooked/own
   - Управление контентом

4. **Unified Components**
   - Один стиль везде
   - Reusable blocks
   - Easy to extend

---

## 🚀 After Profile (Next Features)

After Profile is polished:

1. **Assistant Page Refactor**
   - AIRecommendationCard
   - AIMessageCard
   - Presets → Decision Engine

2. **Fridge Page Enhancement**
   - Smart expiry alerts
   - Category grouping
   - Quick add flow

3. **Recipe Page Polish**
   - Cooking mode improvements
   - Ingredient substitutions
   - Shopping list integration

---

## 📊 Success Metrics

Profile is successful when:
- ✅ User understands their progress in < 10 seconds
- ✅ Clear next actions (CTAs)
- ✅ All data in one place (no hunting)
- ✅ Beautiful, не перегруженный
- ✅ Works without scroll on 1080p+

Current status: **80% there** 🎉

---

## Notes from Review

> Профиль сейчас:
> ✅ логически правильный
> ✅ продуктово сильный
> ✅ готов к масштабированию
> 
> Он уже лучше, чем у 90% food-приложений.

**Next**: Focus on Steps 1-2 (Charts + Design System)
