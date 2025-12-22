# 🤖 AI-UX System Documentation

## 📋 Overview

The AI-UX System provides a **unified, consistent, and Polish-language** interface for all AI-related communication in the application.

### ✨ Key Principles

1. **Single Source of Truth**: All AI messages go through `AIMessageCard` component
2. **Backend Sends Codes**: Backend returns `{ code: string, context: object }`, not Polish text
3. **Frontend Owns Text**: All Polish translations live in `i18n/pl/ai.ts`
4. **Unified Actions**: All user actions route through `handleAIAction()`
5. **Toast for Tech**: Use toast only for network errors / 500s, NOT for AI logic

## 🎯 Why This Matters

### ❌ Before (Chaos)
```tsx
// 🤢 Different notification styles everywhere
toast.error("Nie znaleźliśmy przepisów")
notify.hint({ title: "...", description: "...", actions: [...] })
setMatchesError("Brak przepisów")
alert("Error!")

// 🤢 Polish text hardcoded in page.tsx
description: "Nie znaleźliśmy przepisów pasujących do Twojej lodówki"

// 🤢 Scattered action handlers
onClick={() => router.push('/fridge')}
onClick={() => loadRecipeMatches()}
```

### ✅ After (Clean)
```tsx
// ✨ ONE component for ALL AI communication
<AIMessageCard 
  code="NO_RECIPES_FOR_FRIDGE"
  context={{ fridgeItems: 5 }}
  onAction={handleAIAction}
/>

// ✨ Polish text centralized in dictionary
i18n/pl/ai.ts: 'NO_RECIPES_FOR_FRIDGE': (ctx) => ({ ... })

// ✨ ONE action handler for everything
handleAIAction('ADD_PRODUCTS') → router.push('/fridge')
```

## 📁 Architecture

### File Structure
```
i18n/pl/
  ai.ts                           # 🇵🇱 Polish message dictionary
components/ai/
  AIMessageCard.tsx               # 🎨 Single UI component for all AI messages
app/assistant/page.tsx            # 📄 Example usage
```

## 🔧 How It Works

### 1️⃣ Backend Response Format

Backend **NEVER** returns Polish text. Only codes + context.

```typescript
// ✅ CORRECT - Backend returns code
{
  success: false,
  code: "NO_RECIPES_FOR_FRIDGE",
  context: {
    fridgeItems: 5,
    viewedCount: 0
  }
}

// ❌ WRONG - Backend returns Polish text
{
  success: false,
  message: "Nie znaleźliśmy przepisów dla Twojej lodówki"
}
```

### 2️⃣ Polish Dictionary (`i18n/pl/ai.ts`)

All AI messages defined here. Each entry is a **function** that takes context and returns message object.

```typescript
export const aiMessages: Record<string, AIMessageGenerator> = {
  NO_RECIPES_FOR_FRIDGE: (ctx = {}) => ({
    title: 'Nie znaleźliśmy przepisów',
    description: ctx.fridgeItems 
      ? `Masz ${ctx.fridgeItems} produktów, ale żaden przepis nie pasuje.`
      : 'Nie znaleźliśmy przepisów pasujących do Twojej lodówki.',
    level: 'info',
    actions: [
      { id: 'ADD_PRODUCTS', label: 'Dodaj produkty', variant: 'primary', icon: 'Plus' },
      { id: 'VIEW_CATALOG', label: 'Przeglądaj katalog', variant: 'ghost', icon: 'Search' },
    ],
    dismissible: true,
  }),
  
  FETCH_FAILED: (ctx = {}) => ({
    title: 'Nie udało się pobrać danych',
    description: ctx.message || 'Sprawdź połączenie internetowe.',
    level: 'error',
    actions: [
      { id: 'RETRY', label: 'Spróbuj ponownie', variant: 'primary', icon: 'RefreshCw' },
    ],
    dismissible: true,
  }),
  
  // ... more messages
};
```

### 3️⃣ AIMessageCard Component

Single component that:
- Takes `code` (string) + `context` (object)
- Looks up message in dictionary
- Renders title, description, actions
- Calls `onAction(actionId)` when user clicks button

```tsx
<AIMessageCard
  code="NO_RECIPES_FOR_FRIDGE"
  context={{ fridgeItems: 5 }}
  onAction={handleAIAction}
  onDismiss={() => setAiResponse(null)}
/>
```

### 4️⃣ Unified Action Handler

**ONE FUNCTION** handles all AI-related actions. Routes user to correct page or triggers correct function.

```typescript
const handleAIAction = useCallback((actionId: string) => {
  switch (actionId) {
    case 'ADD_PRODUCTS':
      router.push('/fridge');
      break;
      
    case 'VIEW_CATALOG':
      router.push('/recipes');
      break;
      
    case 'RETRY':
      loadRecipeMatches();
      break;
      
    case 'LOGIN':
      openAuthModal('login');
      break;
      
    default:
      console.warn("⚠️ Unknown AI action:", actionId);
  }
}, [router, loadRecipeMatches, openAuthModal]);
```

## 🛠️ Usage Examples

### Example 1: Empty Fridge State

**Backend sends:**
```json
{
  "success": false,
  "code": "EMPTY_FRIDGE",
  "context": {}
}
```

**Frontend renders:**
```tsx
{aiResponse && !aiResponse.success && (
  <AIMessageCard
    code={aiResponse.code!}
    context={aiResponse.context}
    onAction={handleAIAction}
    onDismiss={() => setAiResponse(null)}
  />
)}
```

**User sees:**
```
ℹ️  Lodówka jest pusta                                    [AI]
    Dodaj produkty do lodówki, aby AI mogło znaleźć 
    idealne przepisy dla Ciebie.
    
    [Dodaj produkty]  [Przeglądaj katalog]
```

### Example 2: All Recipes Viewed

**Backend sends:**
```json
{
  "success": false,
  "code": "ALL_RECIPES_VIEWED",
  "context": {
    "viewedCount": 12
  }
}
```

**User sees:**
```
ℹ️  Wszystkie przepisy już obejrzane                     [AI]
    Obejrzałeś już 12 przepisów. Chcesz zobaczyć je od nowa?
    
    [Zobacz od nowa]  [Dodaj produkty]
```

### Example 3: Network Error

**Backend sends:**
```json
{
  "success": false,
  "code": "FETCH_FAILED",
  "context": {
    "message": "Nie udało się załadować przepisu"
  }
}
```

**User sees:**
```
❌  Nie udało się pobrać danych                           [AI]
    Nie udało się załadować przepisu
    
    [Spróbuj ponownie]
```

## 📝 Adding New AI Messages

### Step 1: Add to Dictionary

Edit `i18n/pl/ai.ts`:

```typescript
export const aiMessages = {
  // ... existing messages
  
  MY_NEW_MESSAGE: (ctx = {}) => ({
    title: 'Tytuł komunikatu',
    description: ctx.userName 
      ? `Witaj, ${ctx.userName}! To jest opis.`
      : 'To jest domyślny opis.',
    level: 'info', // 'info' | 'warning' | 'error' | 'success'
    actions: [
      { id: 'MY_ACTION', label: 'Przycisk', variant: 'primary', icon: 'Plus' },
    ],
    dismissible: true,
  }),
};
```

### Step 2: Add Action Handler (if needed)

Edit `handleAIAction()` in your page:

```typescript
const handleAIAction = useCallback((actionId: string) => {
  switch (actionId) {
    // ... existing cases
    
    case 'MY_ACTION':
      // Do something
      console.log('Custom action triggered!');
      router.push('/my-page');
      break;
      
    default:
      console.warn("⚠️ Unknown AI action:", actionId);
  }
}, [router]);
```

### Step 3: Backend Returns Code

Update backend to return new code:

```typescript
// Backend (Node.js)
return res.json({
  success: false,
  code: 'MY_NEW_MESSAGE',
  context: {
    userName: user.name,
  },
});
```

### Step 4: Done! 🎉

Frontend automatically renders Polish message with actions.

## 🎨 Styling

AIMessageCard automatically styles based on `level`:

| Level | Icon | Color |
|-------|------|-------|
| `info` | ℹ️ Info | Blue |
| `warning` | ⚠️ AlertTriangle | Yellow |
| `error` | ❌ AlertCircle | Red |
| `success` | ✅ CheckCircle | Green |

All cards include:
- AI badge (purple, top-right)
- Level icon (left side)
- Title (bold, large)
- Description (smaller text, supports `\n` newlines)
- Action buttons (optional)
- Dismiss button (if `dismissible: true`)

## 🔀 When to Use Toast vs AIMessageCard

### ✅ Use AIMessageCard for:

- **AI logic results** ("No recipes found", "Recipe generated")
- **User decisions needed** ("Add products?" → buttons)
- **Multi-step guidance** ("Do X, then Y, then Z")
- **Context-specific advice** (based on fridge state, budget, etc.)

### ✅ Use Toast for:

- **Network errors** (500, timeout, no internet)
- **Quick confirmations** ("Saved!", "Deleted!")
- **Auth expiration** ("Token expired, please re-login")
- **Background operations** ("Uploading...", "Syncing...")

### ❌ NEVER Use:

- `alert()` / `confirm()` / `prompt()`
- Hardcoded Polish strings in `.tsx` files
- Multiple notification systems in same component
- `setError()` states with conditional rendering

## 📊 Message Catalog Reference

| Code | Title (PL) | When to Use |
|------|-----------|-------------|
| `NO_RECIPES_FOR_FRIDGE` | Nie znaleźliśmy przepisów | Empty search results, user has ingredients but no matches |
| `ALL_RECIPES_VIEWED` | Wszystkie przepisy już obejrzane | User viewed all available recipes, suggest reset |
| `EMPTY_FRIDGE` | Lodówka jest pusta | User has 0 ingredients in fridge |
| `FEW_INGREDIENTS` | Mało składników | User has < 3 ingredients, suggest adding more |
| `FETCH_FAILED` | Nie udało się pobrać danych | Network error, 500, timeout |
| `RECIPE_GENERATION_FAILED` | Nie udało się wygenerować przepisu | AI failed to create recipe, suggest retry |
| `AUTH_REQUIRED` | Wymagana autoryzacja | User not logged in, feature requires auth |
| `RECIPE_CREATED` | Przepis gotowy! | AI successfully generated recipe |
| `MISSING_INGREDIENTS` | Brakuje składników | Recipe requires items not in fridge |
| `RECIPE_COOKED` | Smacznego! | Recipe marked as cooked, ingredients deducted |
| `LOW_BUDGET` | Uwaga na budżet | Weekly budget limit approaching |
| `AI_PROCESSING` | AI analizuje... | Long-running AI operation, show spinner |
| `NO_SAVED_RECIPES` | Brak zapisanych przepisów | User has no saved recipes, suggest actions |
| `EXPIRING_INGREDIENTS` | Produkty tracą świeżość | Some ingredients near expiry date |

## 🌍 Future: Multi-Language Support

When adding English/Russian:

### Step 1: Create Language Files
```
i18n/
  pl/ai.ts   # Polish (current)
  en/ai.ts   # English (new)
  ru/ai.ts   # Russian (new)
```

### Step 2: Update AIMessageCard

```tsx
import { getAIMessage } from "@/i18n/[currentLang]/ai";

// Auto-switch based on user's language preference
const currentLang = useLanguage(); // 'pl' | 'en' | 'ru'
const message = getAIMessage(code, context, currentLang);
```

### Step 3: Backend Stays Same!

Backend **still** sends only codes:
```json
{ "code": "NO_RECIPES_FOR_FRIDGE", "context": {...} }
```

Frontend decides which language to show based on user settings.

## 🐛 Debugging

### Problem: Message Not Showing

**Check:**
1. Is `code` in `aiMessages` dictionary? (`i18n/pl/ai.ts`)
2. Is `aiResponse.success === false`? (won't show if `success: true`)
3. Is `aiResponse.code` defined? (undefined won't render)

### Problem: Action Not Working

**Check:**
1. Is `actionId` in `handleAIAction()` switch statement?
2. Is `onAction={handleAIAction}` passed to `AIMessageCard`?
3. Check browser console for warnings: `⚠️ Unknown AI action: ...`

### Problem: Wrong Polish Text

**Fix:**
Edit `i18n/pl/ai.ts` → find message code → update `title` or `description`

### Problem: Missing Context Data

**Backend should send:**
```json
{
  "code": "NO_RECIPES_FOR_FRIDGE",
  "context": { "fridgeItems": 5 }  // ← Must be object
}
```

**Frontend receives:**
```tsx
<AIMessageCard 
  code="NO_RECIPES_FOR_FRIDGE"
  context={{ fridgeItems: 5 }}  // ← Passed to message generator
/>
```

## 📈 Migration Guide

### Migrating Old Code to New System

**Before:**
```tsx
// OLD: Multiple notification systems
import { useNotify } from "@/contexts/NotificationContext";
const notify = useNotify();

if (!recipes) {
  notify.hint({
    title: "Nie znaleźliśmy przepisów",
    description: "Spróbuj dodać więcej produktów",
    actions: [
      { label: "Dodaj produkty", onClick: () => router.push('/fridge') }
    ]
  });
}
```

**After:**
```tsx
// NEW: Single AIMessageCard component
import { AIMessageCard } from "@/components/ai/AIMessageCard";
const [aiResponse, setAiResponse] = useState(null);

if (!recipes) {
  setAiResponse({
    code: 'NO_RECIPES_FOR_FRIDGE',
    context: { fridgeItems: items.length },
    success: false,
  });
}

// In JSX:
{aiResponse && !aiResponse.success && (
  <AIMessageCard
    code={aiResponse.code!}
    context={aiResponse.context}
    onAction={handleAIAction}
    onDismiss={() => setAiResponse(null)}
  />
)}
```

## ✅ Benefits

1. **Consistency**: All AI messages look the same, predictable UX
2. **i18n Ready**: Easy to add English/Russian/other languages
3. **Maintainability**: One place to edit Polish text (`i18n/pl/ai.ts`)
4. **Testability**: Mock `code` + `context`, test different scenarios
5. **Type Safety**: TypeScript ensures correct `code` + `context` structure
6. **Clean Code**: No more `if (error)` spaghetti in page components
7. **Reusability**: Same `AIMessageCard` used everywhere

## 🎯 Best Practices

### DO ✅

- **Use codes**, not Polish strings, from backend
- **Centralize text** in `i18n/pl/ai.ts`
- **Use AIMessageCard** for all AI communication
- **Add context data** for dynamic messages
- **Use toast** only for network/tech errors

### DON'T ❌

- **Don't** hardcode Polish in page components
- **Don't** use multiple notification systems
- **Don't** use `alert()` / `confirm()`
- **Don't** send Polish text from backend
- **Don't** use AIMessageCard for non-AI messages (use toast)

## 📚 References

- **Component**: `components/ai/AIMessageCard.tsx`
- **Dictionary**: `i18n/pl/ai.ts`
- **Example Usage**: `app/assistant/page.tsx`
- **Type Definitions**: `AIMessage`, `AIMessageAction`, `AIMessageGenerator`

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
