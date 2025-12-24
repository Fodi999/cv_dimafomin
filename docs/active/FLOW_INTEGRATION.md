# FLOW INTEGRATION — Operating System Kuchni

**Status**: ✅ Implemented (MVP)  
**Date**: 24 grudnia 2025  
**Priority**: CRITICAL (transforms website into coherent system)

---

## 🎯 Objective

Connect all pages into **one coherent flow** so users always know "co dalej?". Transform CV-Sushi from collection of pages into **operating system kuchni**.

---

## 🔥 KROK 1: Lodówka → Flow CTAs

### **Problem**
User adds products to fridge, success message appears, but then... what next? No guidance.

### **Solution**
After adding product, show **2 contextual CTAs** for 8 seconds:

**File**: `app/fridge/page.tsx`

**New State**:
```typescript
const [showFlowCTA, setShowFlowCTA] = useState(false);
```

**CTA Block** (appears after success):
```tsx
{showFlowCTA && (
  <motion.div className="mb-6 p-6 bg-gradient-to-r from-sky-50 to-cyan-50">
    <h3>Co teraz? 🎯</h3>
    <div className="grid md:grid-cols-2 gap-3">
      <button onClick={() => router.push("/recipes")}>
        🍳 Sprawdź, co możesz ugotować
      </button>
      <button onClick={() => router.push("/assistant")}>
        🤖 Zapytaj AI, co zrobić
      </button>
    </div>
  </motion.div>
)}
```

**Trigger**:
```typescript
await fridgeApi.addItem(data, token);
setSuccessMessage("✅ Produkt dodany do lodówki!");
setShowFlowCTA(true); // Show CTAs
setTimeout(() => {
  setSuccessMessage(null);
  setShowFlowCTA(false);
}, 8000); // 8 seconds
```

**Result**: User immediately knows next action after adding products.

---

## 🔥 KROK 2: Gotowanie → Contextual Actions

### **Problem**
Recipe cards in "Moja kuchnia" show status, but no clear action based on status.

### **Solution**
Contextual buttons based on recipe readiness:

**File**: `components/recipes/SavedRecipeCard.tsx`

**Status Logic**:
1. **canCookNow = true** → "🍳 Ugotuj teraz" (green button)
2. **missingIngredientsCount > 0** → "🥬 Dodaj do lodówki" (sky button)
3. Always show: "Zobacz szczegóły" (gray button)

**Updated Button**:
```tsx
{!recipe.canCookNow && recipe.missingIngredientsCount > 0 && (
  <button onClick={() => window.location.href = '/fridge'}>
    🥬 Dodaj do lodówki
  </button>
)}
```

**Result**: 
- If ready → Cook now
- If missing → Add to fridge first
- Always → See details

---

## 🔥 KROK 3: Moja kuchnia → Cooking Trigger

### **Problem**
"Ugotuj" button does nothing or just marks recipe as cooked (no process).

### **Solution**
Link "Ugotuj" button to **Cooking Mode** page:

**File**: `components/recipes/SavedRecipeCard.tsx`

**Updated Handler**:
```typescript
const handleCook = async () => {
  // Navigate to cooking mode
  window.location.href = `/recipes/${recipe.recipeId}/cook`;
};
```

**Result**: Clicking "Ugotuj" starts step-by-step cooking experience.

---

## 🔥 KROK 4: Tryb gotowania (MVP)

### **Purpose**
Simple **step-by-step cooking mode** that guides user through recipe and rewards completion.

**File**: `app/recipes/[id]/cook/page.tsx` (400+ lines)

### **Features**

#### **1. Progress Bar**
- Visual progress: "Krok 2 z 5" (40%)
- Animated gradient bar (sky to cyan)
- Percentage display

#### **2. Step Cards**
- Numbered circle badge (1, 2, 3...)
- Step title (bold, 2xl)
- Detailed description (paragraph)
- Animated transitions (slide left/right)

#### **3. Timer (Optional)**
```tsx
{step.timer && (
  <div className="bg-white p-6 rounded-xl">
    <Timer icon />
    <span>Zalecany czas: {step.timer} min</span>
    <button onClick={startTimer}>⏱️ Start timer</button>
  </div>
)}
```

**Logic**:
- If step has timer → Show timer UI
- "Start timer" button → Countdown begins
- When 0 → Show "✅ Czas minął!"

#### **4. Navigation**
```tsx
<div className="flex gap-4">
  <button onClick={handlePrevStep} disabled={isFirstStep}>
    ← Poprzedni krok
  </button>
  <button onClick={handleNextStep}>
    {isLastStep ? "✅ Zakończ gotowanie" : "Następny krok →"}
  </button>
</div>
```

**Logic**:
- "Poprzedni krok" disabled on first step
- "Następny krok" becomes "Zakończ gotowanie" on last step
- Each click marks step as completed (green dot indicator)

#### **5. Completion Screen**
```tsx
{isCompleted && (
  <motion.div>
    <Trophy icon (gold) />
    <h1>Gratulacje!</h1>
    <p>Udało Ci się ugotować {recipe.name}! 🎉</p>
    
    <div className="bg-amber-50 p-6 rounded-xl">
      <Coins icon />
      <span>+5 CT</span>
      <p>ChefTokens zdobyte za ugotowanie!</p>
    </div>
    
    <button onClick={handleComplete}>✅ Zapisz i zakończ</button>
  </motion.div>
)}
```

**What happens on "Zapisz i zakończ"**:
```typescript
const handleComplete = async () => {
  // TODO: Backend integration
  // - POST /api/recipes/cooked
  // - Award +5 ChefTokens
  // - Update fridge (subtract ingredients)
  // - Save to cooking history
  
  // MVP: Just redirect
  router.push("/recipes/saved?cooked=true");
};
```

---

## 📊 User Journey (Complete Flow)

### **Scenario 1: New User**
1. **Home page** → Sees value proposition
2. **Lodówka** → Adds products (pomidor, boczek, makaron)
3. **Success + CTA** → "Sprawdź, co możesz ugotować"
4. **Gotowanie** → Sees recipes, some "GOTOWE", some "BRAKUJE"
5. **Saves recipe** → Moves to "Moja kuchnia"
6. **Clicks "Ugotuj"** → Enters cooking mode
7. **Step-by-step** → Follows instructions, uses timer
8. **Completes** → Gets +5 CT, returns to Moja kuchnia

### **Scenario 2: Missing Ingredients**
1. **Moja kuchnia** → Recipe shows "BRAKUJE 2"
2. **Clicks "Dodaj do lodówki"** → Goes to Lodówka
3. **Adds missing items** → Success message
4. **CTA: "Sprawdź, co możesz ugotować"** → Back to recipes
5. **Now "GOTOWE"** → Can cook

### **Scenario 3: AI Help**
1. **Lodówka** → Has products, but unsure what to cook
2. **CTA: "Zapytaj AI, co zrobić"** → AI Assistant
3. **AI suggests** → Recipe based on fridge contents
4. **User saves** → Moja kuchnia
5. **Cooks** → Cooking mode → +5 CT

---

## 🎨 Visual Design

### **Flow CTAs** (Lodówka)
- Gradient background: Sky to Cyan (light theme)
- 2-column grid on desktop, stack on mobile
- Large emoji icons: 🍳 🤖
- Bold button text
- Shadow on hover

### **Cooking Mode**
- **Header**: ChefHat icon + "Tryb gotowania"
- **Progress bar**: 3px height, rounded, animated
- **Step card**: Gradient sky/cyan background, large padding
- **Timer**: White card, amber accent, countdown
- **Completion**: Trophy icon, amber reward card, green button

### **Colors**
- **Progress**: Sky-500 to Cyan-500
- **Success**: Green-600 to Emerald-600
- **Reward**: Amber-600 to Orange-600
- **Secondary**: Gray-100/800

---

## 🔧 Technical Details

### **State Management**

**Lodówka** (`app/fridge/page.tsx`):
```typescript
const [showFlowCTA, setShowFlowCTA] = useState(false);
```

**Cooking Mode** (`app/recipes/[id]/cook/page.tsx`):
```typescript
const [currentStep, setCurrentStep] = useState(0);
const [completedSteps, setCompletedSteps] = useState<number[]>([]);
const [isCompleted, setIsCompleted] = useState(false);
const [timerActive, setTimerActive] = useState(false);
const [timerSeconds, setTimerSeconds] = useState(0);
```

### **Timer Logic**
```typescript
useEffect(() => {
  let interval: NodeJS.Timeout;
  if (timerActive && timerSeconds > 0) {
    interval = setInterval(() => {
      setTimerSeconds((prev) => prev <= 1 ? 0 : prev - 1);
    }, 1000);
  }
  return () => clearInterval(interval);
}, [timerActive, timerSeconds]);
```

### **Data Structure** (Mock)
```typescript
const recipe = {
  id: "carbonara",
  name: "Spaghetti Carbonara",
  steps: [
    {
      id: 1,
      title: "Przygotuj składniki",
      description: "Wytnij boczek...",
      timer: null,
    },
    {
      id: 2,
      title: "Ugotuj makaron",
      description: "Zagotuj wodę...",
      timer: 10, // minutes
    },
    // ...
  ],
  totalTime: 25,
  servings: 4,
};
```

---

## ✅ Success Criteria

- [x] Lodówka shows "Co teraz?" CTAs after adding products
- [x] CTAs navigate to /recipes and /assistant
- [x] SavedRecipeCard shows "Dodaj do lodówki" if missing ingredients
- [x] "Ugotuj" button navigates to cooking mode
- [x] Cooking mode displays steps 1-by-1
- [x] Timer works (countdown, visual feedback)
- [x] Navigation works (prev/next, disabled states)
- [x] Completion screen shows +5 CT reward
- [x] "Zapisz i zakończ" redirects to Moja kuchnia
- [x] No TypeScript errors
- [x] Responsive design (mobile/desktop)
- [x] Framer Motion animations

---

## 🚀 Next Steps (Backend Integration)

### **Priority 1: Cooking History**
```typescript
POST /api/recipes/cooked
{
  recipeId: "carbonara",
  completedAt: "2025-12-24T14:30:00Z",
  earnedTokens: 5
}
```

Response:
```typescript
{
  success: true,
  tokensAwarded: 5,
  totalTokens: 125,
  cookedCount: 3
}
```

### **Priority 2: Fridge Update**
After cooking, subtract used ingredients from fridge:
```typescript
PATCH /api/fridge/subtract
{
  recipeId: "carbonara",
  ingredients: [
    { name: "boczek", quantity: 200, unit: "g" },
    { name: "makaron", quantity: 400, unit: "g" },
    { name: "jajka", quantity: 4, unit: "szt" }
  ]
}
```

### **Priority 3: Real Recipe Data**
Replace mock `getMockRecipe()` with API call:
```typescript
GET /api/recipes/${recipeId}/steps
```

Response:
```typescript
{
  id: "carbonara",
  name: "Spaghetti Carbonara",
  steps: [...],
  totalTime: 25,
  servings: 4,
  difficulty: "easy"
}
```

---

## 📝 Files Modified

1. **app/fridge/page.tsx** (UPDATED)
   - Added `showFlowCTA` state
   - Added "Co teraz?" CTA block after success message
   - Triggers on product add, auto-hides after 8 seconds

2. **components/recipes/SavedRecipeCard.tsx** (UPDATED)
   - Changed "Dodaj do zakupów" → "Dodaj do lodówki"
   - Routes to `/fridge` instead of shopping list
   - Updated `handleCook` to navigate to cooking mode

3. **app/recipes/[id]/cook/page.tsx** (NEW)
   - 400+ lines
   - Complete cooking mode MVP
   - Step-by-step navigation
   - Timer with countdown
   - Completion screen with +5 CT reward
   - Mock data (to be replaced with API)

---

## 🎉 Result

✅ **System is now connected!**  
✅ **Users know "co dalej?" at every step**  
✅ **Flow: Lodówka → Recipes → Cooking → Completion**  
✅ **Feels like operating system, not collection of pages**

**Access cooking mode**: http://localhost:3000/recipes/carbonara/cook

**Next**: Backend integration for history, tokens, fridge updates.
