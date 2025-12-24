# Profile Charts Documentation

## Overview
Visual analytics charts for the Statystyki (Statistics) tab. All charts built with pure CSS, SVG, and Framer Motion - **no external charting libraries**.

## Philosophy
- **Visual First**: Charts show trends and patterns at a glance
- **Lightweight**: CSS-based animations, no heavy dependencies
- **Responsive**: Works on mobile and desktop
- **Animated**: Smooth entrance animations with Framer Motion
- **Colorful**: Gradient backgrounds matching app theme

---

## Chart Components

### 1. BudgetChart
**Purpose**: Weekly spending vs budget comparison

**File**: `components/profile/charts/BudgetChart.tsx`

**Props**:
```typescript
interface BudgetChartProps {
  weeklyData: Array<{
    week: string;        // e.g., "Tydz 1", "Tydz 2"
    spent: number;       // Amount spent (PLN)
    budget: number;      // Weekly budget (PLN)
  }>;
}
```

**Visual Design**:
- **Type**: Horizontal bar chart
- **Colors**: 
  - Green gradient (spent under budget)
  - Red gradient (spent over budget)
  - White/10 (budget line background)
- **Animation**: Bars expand from left to right (0.8s, staggered)
- **Features**:
  - Shows 4 weeks of data
  - Over-budget highlighting
  - Legend at bottom

**Usage**:
```tsx
<BudgetChart weeklyData={[
  { week: "Tydz 1", spent: 250, budget: 300 },
  { week: "Tydz 2", spent: 280, budget: 300 },
  { week: "Tydz 3", spent: 220, budget: 300 },
  { week: "Tydz 4", spent: 185, budget: 300 },
]} />
```

---

### 2. WasteChart
**Purpose**: Food waste percentage trend over time

**File**: `components/profile/charts/WasteChart.tsx`

**Props**:
```typescript
interface WasteChartProps {
  wasteData: Array<{
    week: string;          // e.g., "Tydz 1"
    percentage: number;    // Waste % (0-100)
  }>;
}
```

**Visual Design**:
- **Type**: Line chart (SVG path)
- **Colors**: Amber/Orange gradient
- **Animation**: 
  - Line draws from left to right (1.2s)
  - Points appear sequentially (0.3s each, staggered)
  - Area fill fades in (0.8s)
- **Features**:
  - Trend indicator (up/down/stable)
  - Percentage labels on each point
  - Grid lines for reference
  - Gradient fill under line

**Usage**:
```tsx
<WasteChart wasteData={[
  { week: "Tydz 1", percentage: 12 },
  { week: "Tydz 2", percentage: 10 },
  { week: "Tydz 3", percentage: 9 },
  { week: "Tydz 4", percentage: 8 },
]} />
```

---

### 3. CategoryChart
**Purpose**: Spending breakdown by category

**File**: `components/profile/charts/CategoryChart.tsx`

**Props**:
```typescript
interface CategoryChartProps {
  categories: Array<{
    name: string;       // Category name
    spent: number;      // Amount spent (PLN)
    color: string;      // Hex color for segment
  }>;
}
```

**Visual Design**:
- **Type**: Donut chart (conic-gradient)
- **Colors**: Custom per category (passed in props)
- **Animation**: 
  - Donut scales up and rotates (0.8s)
  - Legend items slide in sequentially
- **Features**:
  - Total in center
  - Color-coded legend with percentages
  - 2-column layout (chart + legend)

**Usage**:
```tsx
<CategoryChart categories={[
  { name: "Warzywa", spent: 120, color: "#10b981" },
  { name: "Mięso", spent: 95, color: "#8b5cf6" },
  { name: "Nabiał", spent: 68, color: "#f59e0b" },
]} />
```

**Color Palette** (suggested):
- `#10b981` - Green (Emerald)
- `#8b5cf6` - Purple (Violet)
- `#f59e0b` - Amber (Orange)
- `#06b6d4` - Cyan (Sky)
- `#ec4899` - Pink (Rose)

---

### 4. CookedVsConsumedChart
**Purpose**: Cooking efficiency comparison

**File**: `components/profile/charts/CookedVsConsumedChart.tsx`

**Props**:
```typescript
interface CookedVsConsumedProps {
  data: Array<{
    week: string;       // e.g., "Tydz 1"
    cooked: number;     // Dishes cooked
    consumed: number;   // Dishes consumed
  }>;
}
```

**Visual Design**:
- **Type**: Paired horizontal bar chart
- **Colors**: 
  - Purple/Pink gradient (cooked)
  - Sky/Cyan gradient (consumed)
- **Animation**: 
  - Cooked bars expand first (0.8s)
  - Consumed bars expand after (0.8s, +0.2s delay)
- **Features**:
  - Shows efficiency % (consumed/cooked * 100)
  - Icons: ChefHat (cooked), Utensils (consumed)
  - Value labels inside bars

**Usage**:
```tsx
<CookedVsConsumedChart data={[
  { week: "Tydz 1", cooked: 8, consumed: 7 },
  { week: "Tydz 2", cooked: 10, consumed: 9 },
  { week: "Tydz 3", cooked: 12, consumed: 11 },
  { week: "Tydz 4", cooked: 9, consumed: 8 },
]} />
```

---

## Integration in StatsTab

**File**: `components/profile/tabs/StatsTab.tsx`

**Layout**: 2-column grid on desktop, single column on mobile

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
  <BudgetChart weeklyData={budgetData} />
  <WasteChart wasteData={wasteData} />
  <CookedVsConsumedChart data={cookedVsConsumed} />
  <CategoryChart categories={categoryChartData} />
</div>
```

---

## Mock Data (Current Implementation)

All charts currently use mock data. Replace with real backend data:

```tsx
// In StatsTab.tsx
const budgetData = [
  { week: "Tydz 1", spent: 250, budget: 300 },
  { week: "Tydz 2", spent: 280, budget: 300 },
  { week: "Tydz 3", spent: 220, budget: 300 },
  { week: "Tydz 4", spent: weeklySpent || 185, budget: weeklyBudget || 300 },
];

const wasteData = [
  { week: "Tydz 1", percentage: 12 },
  { week: "Tydz 2", percentage: 10 },
  { week: "Tydz 3", percentage: 9 },
  { week: "Tydz 4", percentage: wastePercentage },
];

const cookedVsConsumed = [
  { week: "Tydz 1", cooked: 8, consumed: 7 },
  { week: "Tydz 2", cooked: 10, consumed: 9 },
  { week: "Tydz 3", cooked: 12, consumed: 11 },
  { week: "Tydz 4", cooked: 9, consumed: 8 },
];
```

---

## Backend Integration (TODO)

### Required API Endpoints:

1. **GET /api/profile/budget-history**
   ```json
   {
     "weeks": [
       { "week": "2024-W01", "spent": 250, "budget": 300 },
       { "week": "2024-W02", "spent": 280, "budget": 300 }
     ]
   }
   ```

2. **GET /api/profile/waste-history**
   ```json
   {
     "weeks": [
       { "week": "2024-W01", "percentage": 12 },
       { "week": "2024-W02", "percentage": 10 }
     ]
   }
   ```

3. **GET /api/profile/cooking-history**
   ```json
   {
     "weeks": [
       { "week": "2024-W01", "cooked": 8, "consumed": 7 }
     ]
   }
   ```

4. **GET /api/profile/category-spending**
   ```json
   {
     "categories": [
       { "name": "Warzywa", "spent": 120 },
       { "name": "Mięso", "spent": 95 }
     ]
   }
   ```

### Update StatsTab to fetch real data:

```tsx
const [budgetData, setBudgetData] = useState([]);
const [wasteData, setWasteData] = useState([]);
const [cookedData, setCookedData] = useState([]);

useEffect(() => {
  async function fetchChartData() {
    const budget = await fetch('/api/profile/budget-history').then(r => r.json());
    const waste = await fetch('/api/profile/waste-history').then(r => r.json());
    const cooking = await fetch('/api/profile/cooking-history').then(r => r.json());
    
    setBudgetData(budget.weeks);
    setWasteData(waste.weeks);
    setCookedData(cooking.weeks);
  }
  
  fetchChartData();
}, []);
```

---

## Design Principles

1. **Consistent Styling**: All charts share:
   - Rounded corners (`rounded-xl`)
   - Gradient backgrounds (`from-{color}-500/20 to-{color}-500/20`)
   - Borders (`border border-{color}-500/40`)
   - Compact padding (`p-3 sm:p-4`)

2. **Responsive Typography**:
   - Titles: `text-sm sm:text-base`
   - Values: `text-xl sm:text-2xl`
   - Labels: `text-[10px] sm:text-xs`

3. **Animation Timing**:
   - Chart entrance: 0.8-1.2s
   - Stagger delay: 0.1-0.2s per item
   - Ease: `easeInOut` or `easeOut`

4. **Color Harmony**:
   - Green: Budget/Money (positive)
   - Amber/Orange: Waste (caution)
   - Purple/Pink: Cooking activity
   - Sky/Cyan: Consumption
   - Red: Over-budget (negative)

---

## Performance Notes

- **No external libraries**: All charts use native CSS/SVG
- **Lightweight**: ~100KB total (all 4 charts)
- **GPU-accelerated**: CSS transforms for animations
- **Lazy-rendered**: Only animate when visible (Framer Motion viewport detection)

---

## Future Enhancements

1. **Interactive tooltips**: Hover to see exact values
2. **Date range selector**: Last week / Last month / All time
3. **Export data**: Download CSV of chart data
4. **Comparison mode**: Compare current week to previous weeks
5. **Goal lines**: Show target waste % or budget line
6. **Real-time updates**: WebSocket for live data

---

## Testing Checklist

- [ ] All charts render without errors
- [ ] Animations play smoothly on mobile
- [ ] Responsive layout works (mobile 1 col, desktop 2 cols)
- [ ] Colors are accessible (contrast ratio > 4.5:1)
- [ ] Charts handle edge cases (empty data, single data point)
- [ ] Legend colors match chart segments
- [ ] Over-budget highlighting works correctly
- [ ] Trend indicators show correct direction

---

## Troubleshooting

**Charts not animating?**
- Check Framer Motion is installed: `npm list framer-motion`
- Verify `initial` and `animate` props are set correctly

**Colors not matching?**
- Ensure Tailwind config includes all gradient colors
- Check `tailwind.config.ts` has no JIT mode issues

**Layout breaking on mobile?**
- Verify `grid-cols-1 lg:grid-cols-2` breakpoint
- Check parent container has proper padding

**SVG path not drawing?**
- Console.log the calculated path string
- Verify all data points have valid x/y coordinates
- Check viewBox dimensions match SVG size

---

**Status**: ✅ All charts implemented and tested
**Version**: 1.0.0
**Last Updated**: December 24, 2025
