# 🎯 Profile V3: Information Hierarchy & User Control Center

## 📋 Overview

**Date:** 25 December 2025
**Philosophy:** Profile = Personal Kitchen Control Center (not admin panel, not just stats)

This refactor establishes **clear information hierarchy** with distinct semantic levels.

---

## 🧠 The Problem (Before)

### ❌ Issues Identified:
1. **Mixed semantic levels** - Personal data, analytics, navigation, actions all in one flat plane
2. **No visual hierarchy** - "451 PLN Oszczędzono" (primary KPI) looked equal to "Produkty w lodówce" (secondary metric)
3. **Duplicate edit buttons** - "Edytuj profil" and "Edytuj" confusing users
4. **Unclear tabs** - Przegląd/Statystyki/Zasoby existed but didn't clearly differentiate content

### User Confusion:
> "Это статистика? профиль? отчёт? дашборд?" (Is this stats? profile? report? dashboard?)

---

## ✨ The Solution (After)

### 🎯 Page Role:
**Personal Kitchen Management Center**
- NOT settings page
- NOT just statistics
- CONTROL center for progress and decisions

---

## 🏗️ New Structure (5 Blocks)

### 🔝 Block 1: Identity (Minimal, Quiet)
**Purpose:** Who am I?  
**Components:**
- `SimpleProfileHeader.tsx`
- Name + Avatar + Email
- Single "Edytuj profil" button (no duplication)
- Level badge (subtle, not primary)
- ChefTokens balance
- **Subtitle:** "💼 Twoje centrum zarządzania kuchnią"

**Visual Weight:** LOW (background info)

```tsx
<SimpleProfileHeader
  name="Dima Fomin"
  email="fodi85@gmail.ru"
  level={1}
  chefTokens={0}
  onEdit={handleEditProfile}
/>
<p className="text-center text-gray-600 mt-2">
  💼 Twoje centrum zarządzania kuchnią
</p>
```

---

### 🔥 Block 2: Hero KPI (Main Metrics)
**Purpose:** How am I doing? (PRIMARY ANSWER)  
**Components:**
- `HeroKPI.tsx` (NEW)

**Visual Hierarchy:**
1. **PRIMARY KPI:** Oszczędzono (451 PLN) - BIGGEST card (2x width), emerald gradient, trending indicator
2. **Secondary KPIs:** Equal size, less visual weight
   - Ugotowane (12 przepisów)
   - Produkty w lodówce (28)
   - ChefTokens (0 CT) - removed, moved to header

**Layout:** 4-column grid (mobile: 1 col, tablet: 2 cols, desktop: 4 cols)

```tsx
<HeroKPI
  savedMoney={451}         // PRIMARY - biggest card
  cookedRecipes={12}       // secondary
  fridgeItems={28}         // secondary
  chefTokens={0}           // secondary
/>
```

**Design Tokens:**
- Primary card: `sm:col-span-2` (double width), `p-6`, `text-5xl`
- Secondary cards: `col-span-1`, `p-4`, `text-4xl`
- Colors: Emerald (money), Violet (cooking), Sky (fridge), Amber (tokens)

---

### 📈 Block 3: Progress & Control
**Purpose:** Am I on track? (Motivation)  
**Components:**
- `ProgressControl.tsx` (NEW)

**Content:**
1. **Level Progress**
   - Poziom 1
   - XP bar: 2450 / 5000
   - "49% do następnego poziomu"

2. **Weekly Budget Tracker**
   - Budget: 185 / 300 PLN
   - Color indicators:
     - 🟢 Green (< 70%): "✅ Świetnie! Pozostało X PLN"
     - 🟡 Yellow (70-90%): "⚠️ Uwaga! Pozostało X PLN"
     - 🔴 Red (> 90%): "🚨 Przekroczono budżet o X PLN"

**Layout:** 2-column grid (mobile: 1 col, desktop: 2 cols)

```tsx
<ProgressControl
  level={1}
  xp={2450}
  maxXp={5000}
  weeklyBudget={300}
  weeklySpent={185}
/>
```

---

### 🧭 Block 4: Tabs (Meaningful Content Separation)
**Purpose:** What do I want to see?  
**Components:**
- `ProfileTabs.tsx`
- `OverviewTab.tsx` (REFACTORED)
- `StatsTab.tsx`
- `ResourcesTab.tsx`

#### Tab 1: Przegląd (Overview) - DEFAULT
**Content:**
- ⏰ Ostatnie działania (Last 3 actions with icons)
- 🧭 Co dalej? (2 CTA buttons ONLY)

**Philosophy:** 
- Level/Budget removed (moved to Block 3)
- Only history + next actions
- Answers: "Co ja robiłem? Co dalej?"

```tsx
<OverviewTab
  lastActions={[...]}  // Last 3 only
/>
```

#### Tab 2: Statystyki (Analytics)
**Content:**
- 📊 Charts only (Budget, Waste, Cooked vs Consumed, Category breakdown)
- 📈 Numbers + insights
- NO actions/CTAs

**Philosophy:** Pure analytics, no mixing with actions

#### Tab 3: Zasoby (Resources)
**Content:**
- 📘 Moje przepisy (Zapisane/Ugotowane/Własne)
- 🛒 Koszyk
- 🎓 Kupione receptury z Market

**Philosophy:** My owned content/purchases

---

### 🚀 Block 5: Actions (CTAs) - INTEGRATED IN OVERVIEW TAB
**Purpose:** What can I do next?  
**Location:** Inside OverviewTab (not separate block)

**2 Buttons ONLY:**
1. **🧊 Dodaj produkty** → `/fridge` (Sky/Cyan gradient)
2. **🤖 Otwórz AI** → `/assistant` (Violet/Purple gradient)

**No noise.** No extra buttons. Clear next steps.

```tsx
<div className="grid grid-cols-2 gap-3">
  <button onClick={() => router.push("/fridge")}>
    Dodaj produkty
  </button>
  <button onClick={() => router.push("/assistant")}>
    Otwórz AI
  </button>
</div>
```

---

## 📐 Visual Hierarchy Summary

| Level | Block | Visual Weight | Size | Colors |
|-------|-------|---------------|------|--------|
| 5 (Lowest) | Identity | Subtle | Compact header | Gray/Sky |
| 1 (HIGHEST) | Hero KPI | **DOMINANT** | **Large cards** | **Emerald** (primary) |
| 2 | Progress & Control | Important | Medium bars | Violet + Green/Yellow/Red |
| 3 | Tabs Content | Content area | Variable | Tab-specific |
| 4 | CTAs | Action-focused | Medium buttons | Sky + Violet |

---

## 🎨 Design Tokens

### Color Palette by Purpose:
- **Money/Savings:** Emerald (`from-emerald-500/20 to-green-500/20`)
- **Cooking:** Violet (`from-violet-500/20 to-purple-500/20`)
- **Fridge/Products:** Sky (`from-sky-500/20 to-cyan-500/20`)
- **Level/XP:** Amber (`from-amber-500/20 to-orange-500/20`)
- **Budget Safe:** Green (`from-emerald-500 to-green-500`)
- **Budget Warning:** Yellow (`from-amber-500 to-yellow-500`)
- **Budget Danger:** Red (`from-rose-500 to-red-500`)

### Spacing System:
- Block gaps: `mb-3 sm:mb-4` (12-16px)
- Card padding: `p-3 sm:p-4` (12-16px) for secondary, `p-4 sm:p-6` (16-24px) for primary
- Grid gaps: `gap-3 sm:gap-4` (12-16px)

### Typography Scale:
- Primary KPI: `text-4xl sm:text-5xl` (36-48px)
- Secondary KPI: `text-3xl sm:text-4xl` (30-36px)
- Headings: `text-sm sm:text-base` (14-16px)
- Body: `text-[11px] sm:text-xs` (11-12px)
- Captions: `text-[9px] sm:text-[10px]` (9-10px)

---

## 🚀 Implementation Files

### New Components Created:
1. **`components/profile/HeroKPI.tsx`** - Hero metrics with visual hierarchy
2. **`components/profile/ProgressControl.tsx`** - Level + Budget trackers with color indicators

### Modified Components:
1. **`app/profile/page.tsx`** - Restructured with 5-block layout
2. **`components/profile/tabs/OverviewTab.tsx`** - Removed Level/Budget duplication, kept history + CTAs
3. **`components/profile/SimpleProfileHeader.tsx`** - Already clean (no changes needed)

### Deprecated Components:
- ~~`QuickStats.tsx`~~ - Replaced by HeroKPI.tsx (better hierarchy)

---

## 📊 User Flow

```
User lands on /profile
  ↓
1. Sees identity (who am I?)
   "Dima Fomin - Poziom 1 - 0 CT"
  ↓
2. Sees PRIMARY answer (how am I doing?)
   "💰 451 PLN Oszczędzono" ← BIGGEST, GREENEST
  ↓
3. Sees progress (am I on track?)
   "Level XP: 49% | Budget: 62% (green)"
  ↓
4. Chooses tab:
   - Przegląd → history + next steps
   - Statystyki → charts
   - Zasoby → my content
  ↓
5. Takes action:
   "Dodaj produkty" or "Otwórz AI"
```

---

## 🎯 Strategic Context

**This is not just a website. This is:**
- ✅ SaaS product
- ✅ With gamification (levels, XP, tokens)
- ✅ With economy (budget, savings, ChefTokens)
- ✅ With AI assistant

**Profile = Main Retention Screen**

Focus: **Not adding features, but arranging meaning.**

---

## ✅ Checklist

- [x] Identity block minimal (no noise)
- [x] Hero KPI with PRIMARY metric (Oszczędzono biggest)
- [x] Progress & Control block (Level + Budget)
- [x] Tabs clearly differentiated (Przegląd/Statystyki/Zasoby)
- [x] Only 2 CTAs (Dodaj produkty + Otwórz AI)
- [x] Page subtitle ("Twoje centrum zarządzania kuchnią")
- [x] Remove duplicate edit buttons
- [x] Visual hierarchy established (5 levels)
- [x] Color-coded budget indicators (green/yellow/red)

---

## 🔜 Next Steps

### Backend Integration:
- [ ] Fetch real `savedMoney` from `/api/profile/stats`
- [ ] Fetch real `weeklySpent` from `/api/profile/budget/current`
- [ ] Fetch real `lastActions` from `/api/profile/history?limit=3`
- [ ] Real-time updates via WebSocket for balance changes

### UX Enhancements:
- [ ] Add toast notifications for token earnings
- [ ] Animate number counters on Hero KPI cards
- [ ] Add skeleton loaders for data fetching states
- [ ] Implement swipe gestures for mobile tab navigation

### Analytics:
- [ ] Track which KPI users click most (heatmap)
- [ ] Measure time spent per tab (engagement)
- [ ] A/B test CTA button colors (conversion rate)

---

## 📚 References

- **PROFILE_V2_ROADMAP.md** - Previous charts implementation
- **PROFILE_CHARTS_DOCUMENTATION.md** - Chart component guide
- **USER_ACTION_MODAL.md** - User interaction patterns
- **NOTIFICATION_SYSTEM.md** - Real-time update architecture

---

**✨ Result:** Profile now has clear **information hierarchy** and functions as a **control center**, not a data dump.
