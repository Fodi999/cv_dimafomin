# ChefTokens Page — Educational Model

**Status**: ✅ Implemented (UI only, no backend yet)  
**Date**: 24 grudnia 2025  
**Priority**: HIGH (explains core product model)

---

## 🎯 Objective

ChefTokens page answers **3 critical questions** for users:
1. **Co to są ChefTokens?** → Educational currency for conscious cooking
2. **Jak je zdobywam?** → Reward actions, not clicks
3. **Na co je wydaję?** → Conscious decisions, not random spending

**Key Philosophy**: ChefTokens = educational mechanism, **NOT** paywall or crypto.

---

## 📊 Page Structure (6 Blocks)

### **1. Hero / Wyjaśnienie** (Top)
**Title**: ChefTokens — Twoja waluta świadomej kuchni  
**Subtitle**: ChefTokens pomagają podejmować mądre decyzje: planować, gotować i uczyć się bez chaosu.

**3 Core Principles** (cards):
- 🔄 **Kontrola decyzji, nie „paywall"** → Tokens teach planning, don't block access
- 🧠 **Uczysz się myśleć jak kucharz** → Every action is a conscious decision
- ♻️ **Mniej marnowania, więcej kontroli** → Planning instead of chaos

**Visual Design**:
- Amber badge with Coins icon: "Twoja waluta świadomej kuchni"
- Large heading (5xl font)
- 3 colored cards: Sky (blue), Purple, Green
- Each card: colored circle icon + bold title + description

---

### **2. Twoje saldo** (Balance Card)
**Purpose**: Show user's current balance and motivate earning

**Logged In State** (isLoggedIn = true):
```tsx
<div className="bg-gradient-to-r from-amber-500 to-orange-500">
  <h2>Twoje ChefTokens</h2>
  <div>120 CT</div>
  <div>
    +12 CT dzisiaj
    Status: aktywny
  </div>
  <buttons>
    - Jak zdobyć ChefTokens
    - Historia transakcji
  </buttons>
</div>
```

**Not Logged In State** (isLoggedIn = false):
```tsx
<div className="bg-gradient-to-r from-gray-100 to-gray-200 border-dashed">
  <Coins icon (gray) />
  <h2>Twoje ChefTokens</h2>
  <p>Zaloguj się, aby zobaczyć swoje saldo i historię</p>
  <button>Zaloguj się →</button>
</div>
```

**Variables** (mock, replace with real data later):
- `currentBalance`: 120 CT
- `todayEarned`: +12 CT
- `isLoggedIn`: false (default)

---

### **3. Jak zdobywasz ChefTokens** (Earning Methods)
**Heading**: Jak zdobywasz ChefTokens  
**Subtitle**: ChefTokens nagradzają działanie, nie klikanie.

**5 Earning Cards**:

1. **🍳 Ugotowanie przepisu → +5 CT**
   - Color: Sky (blue)
   - Description: "Każdy przepis, który zrealizujesz i oznaczysz jako „ugotowany""

2. **💬 Dialog z AI (zadanie) → +2 CT**
   - Color: Purple
   - Description: "Ukończenie jednego zadania w dialogu z AI Mentor"

3. **🎓 Moduł w Akademii → +10 CT**
   - Color: Amber (gold)
   - Description: "Ukończenie pełnego modułu z wszystkimi zadaniami"

4. **📸 Analiza dania → +5 CT**
   - Color: Pink
   - Description: "Prześlij zdjęcie i otrzymaj analizę AI"

5. **🏆 Ukończenie ścieżki → +50 CT**
   - Color: Green
   - Description: "Finalizacja całej ścieżki rozwoju w Akademii"
   - Layout: Span 2 columns on medium screens

**Grid**: 3 columns on large screens, 2 on medium, 1 on mobile

---

### **4. Na co wydajesz ChefTokens** (Spending Options)
**Heading**: Na co wydajesz ChefTokens  
**Subtitle**: Każde użycie tokenów to świadoma decyzja, nie przypadkowy klik.

**4 Spending Cards**:

1. **✨ Zapytania do AI → 1–3 CT**
   - Icon: Sparkles (purple)
   - Description: "Zadaj pytanie AI o produkt, technikę lub pairing"
   - Hover: Purple border

2. **👨‍🍳 Premium przepisy → 5–15 CT**
   - Icon: ChefHat (sky)
   - Description: "Dostęp do zaawansowanych przepisów szefów kuchni"
   - Hover: Sky border

3. **🎓 Zaawansowane ścieżki Akademii → 20–50 CT**
   - Icon: GraduationCap (amber)
   - Description: "Odblokuj zaawansowane kursy po ukończeniu podstaw"
   - Hover: Amber border

4. **🍽️ Analizy smaków / pairing → 3–10 CT**
   - Icon: Utensils (pink)
   - Description: "Sprawdź, jakie produkty pasują do siebie"
   - Hover: Pink border

**Grid**: 2 columns on medium+ screens, 1 on mobile

---

### **5. Dlaczego to działa** (Philosophy)
**Purpose**: Explain the "why" behind ChefTokens

**Heading**: Dlaczego to działa

**Main Text**:
> **ChefTokens nie są karą.**  
> Są mechanizmem, który:
> - ✅ **uczy planowania** — zamiast chaosu i impulsywnych decyzji
> - ✅ **ogranicza chaos** — każda akcja ma wartość i konsekwencje
> - ✅ **wzmacnia dobre decyzje kuchenne** — nagradzamy działanie, nie klikanie

**2 Comparison Cards**:

1. **❌ Brak scrollowania bez sensu**
   - Red XCircle icon
   - Text: "Każda akcja jest świadoma, nie przypadkowa"

2. **✅ Każda akcja ma wartość**
   - Green CheckCircle icon
   - Text: "Uczysz się podejmować lepsze decyzje kulinarne"

**Visual Design**:
- Gradient background: Indigo to Purple
- White cards inside with icons + text
- Max width: 3xl (centered)

---

### **6. CTA — Gdzie teraz?** (Navigation)
**Heading**: Gdzie teraz?

**4 CTA Buttons** (gradient cards):

1. **🍳 Przejdź do Gotowania** → `/recipes`
   - Gradient: Sky to Cyan
   - Icon: ChefHat

2. **💬 Porozmawiaj z AI** → `/assistant`
   - Gradient: Purple to Pink
   - Icon: MessageSquare

3. **🎓 Rozwijaj się w Akademii** → `/academy`
   - Gradient: Amber to Orange
   - Icon: GraduationCap

4. **🛍️ Zobacz Rynek przepisów** → `/market`
   - Gradient: Green to Emerald
   - Icon: ShoppingBag

**Grid**: 4 columns on large screens, 2 on medium, 1 on mobile  
**Hover**: Shadow-lg + scale effect

---

## 🎨 Visual Design Tokens

### **Colors**
- **Amber/Orange** (primary): Token currency theme
- **Sky** (blue): Actions (recipes, cooking)
- **Purple**: AI interactions
- **Green**: Achievement (path completion)
- **Pink**: Analysis (photo, pairing)

### **Typography**
- Hero title: `text-5xl font-bold`
- Section headings: `text-3xl font-bold`
- Card titles: `text-lg font-bold`
- Body text: `text-sm text-gray-600 dark:text-gray-400`
- Token amounts: `text-2xl font-bold` (colored)

### **Spacing**
- Section margins: `mb-16`
- Card padding: `p-6` or `p-8`
- Grid gaps: `gap-6`
- Button padding: `py-3 px-6` or `py-3 px-8`

### **Animations**
- Framer Motion: `initial={{ opacity: 0, y: 20 }}`
- Stagger delays: 0.1s increments
- Hover effects: `hover:shadow-lg transition-all`

---

## 🚫 What NOT to Do

**CRITICAL: Avoid these mistakes**:

❌ **DON'T**:
- Complex tables or charts
- Crypto terminology (blockchain, wallet, NFT)
- "Kup pakiet" or "Subskrypcja" buttons
- Aggressive sales language
- Technical jargon

✅ **DO**:
- Simple, clear language (Polish)
- Focus on education and learning
- Show value, not price
- Explain benefits, not features
- Make it feel like a game mechanic, not a payment system

---

## 🔧 Implementation Details

### **File Structure**
```
app/cheftokens/page.tsx (570 lines)
├── Hero (title + 3 principles cards)
├── Balance Card (logged in / not logged in)
├── Earning Methods (5 cards grid)
├── Spending Options (4 cards grid)
├── Philosophy Block (gradient box + 2 comparison cards)
└── CTA Navigation (4 buttons)
```

### **State Management**
```typescript
const [isLoggedIn] = useState(false);  // Mock auth state
const [currentBalance] = useState(120); // Mock balance
const [todayEarned] = useState(12);    // Mock daily earnings
```

**TODO (later)**:
- Connect to real AuthContext
- Fetch balance from `/api/user/cheftokens`
- Add transaction history endpoint
- Enable "Jak zdobyć" and "Historia" buttons

### **Navigation Integration**
**File**: `components/NavigationBurger.tsx`

**Updated**:
```typescript
{
  label: "ChefTokens",
  href: "/cheftokens",  // Changed from "/market"
  icon: <Coins className="w-5 h-5" />,
  description: "Twoja waluta świadomej kuchni",
  category: "Ekonomia",
}
```

**isActive Function**:
```typescript
if (href === "/cheftokens" && pathname === "/cheftokens") return true;
```

---

## ✅ Success Criteria

- [x] Page created with 6 blocks (Hero, Balance, Earn, Spend, Philosophy, CTA)
- [x] Mock balance card (logged in / not logged in states)
- [x] 5 earning methods cards with icons and rewards
- [x] 4 spending options cards with price ranges
- [x] Philosophy block explaining "why it works"
- [x] 4 CTA buttons navigating to main features
- [x] Navigation updated (ChefTokens link added)
- [x] Responsive design (mobile/tablet/desktop)
- [x] Dark mode support
- [x] Framer Motion animations
- [x] No TypeScript errors
- [x] Clean, educational tone (not sales-y)

---

## 🚀 Next Steps

### **Priority 1: Backend Integration** (later)
- Create `/api/user/cheftokens` endpoint
- Return: `{ balance, todayEarned, status, transactions[] }`
- Connect to real user authentication
- Save/load balance from database

### **Priority 2: Transaction History**
- Create `/api/user/cheftokens/history` endpoint
- Show: date, action, amount (+/-), balance after
- Filter by: all / earned / spent
- Pagination (last 50 transactions)

### **Priority 3: Real-time Updates**
- Update balance when user earns tokens (Academy, AI, Recipes)
- Show toast notification: "+5 CT — Przepis ugotowany!"
- Sync balance across pages (global state)

### **Priority 4: Earning Flow Integration**
- Link Academy completion → +10 CT
- Link Recipe cooking → +5 CT
- Link AI task → +2 CT
- Link Path completion → +50 CT

---

## 📝 Files Modified

1. **app/cheftokens/page.tsx** (NEW)
   - 570 lines
   - 6 blocks: Hero, Balance, Earn, Spend, Philosophy, CTA
   - Mock data: 120 CT balance, +12 CT today
   - Responsive grid layouts
   - Framer Motion animations

2. **components/NavigationBurger.tsx** (UPDATED)
   - Changed ChefTokens href: `/market` → `/cheftokens`
   - Updated description: "Twoja waluta świadomej kuchni"
   - Added isActive check for `/cheftokens`

---

## 🎉 Implementation Complete!

✅ **ChefTokens page is live and educational**  
✅ **Users can understand the 3 core questions**  
✅ **Visual design is clean and motivating**  
✅ **No paywall feeling — pure education**  
✅ **Ready for user testing**

**Access**: http://localhost:3000/cheftokens 🚀

**Next**: Backend integration when user system is ready.
