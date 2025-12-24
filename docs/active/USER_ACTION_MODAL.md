# User Action Toast Implementation (Sonner)

## 📋 Summary

Fixed the issue where "No recipes found" messages were shown as auto-closing toasts that users couldn't read in time.

**Solution**: Using **Sonner** toast library with action buttons instead of modal windows.

## ❌ Problem

When the backend returned:
```json
{
  "success": false,
  "message": "We couldn't find any recipes matching your fridge. Try adding more ingredients!",
  "error": "No recipes available"
}
```

The frontend would show a **toast notification** that auto-closed after 3-5 seconds, preventing users from reading important messages.

## ✅ Solution

### 1. Backend Flag: `requiresUserAction`

Backend now returns a flag to indicate if the message requires user confirmation:

```json
{
  "success": false,
  "error": "No recipes available",
  "message": "We couldn't find any recipes matching your fridge. Try adding more ingredients!",
  "requiresUserAction": true  // ← New flag
}
```

### 2. Frontend Logic (Sonner Toast with Glassmorphism)

```typescript
if (result.requiresUserAction) {
  // Show persistent toast with glassmorphism effect (Polish language)
  sonnerToast("Nie znaleźliśmy przepisów dla Twojej lodówki", {
    duration: Infinity, // Don't auto-close
    description: "💡 Dodaj więcej składników lub zobacz zapisane przepisy",
    className: "backdrop-blur-xl bg-gradient-to-br from-purple-500/90 to-pink-500/90 border border-purple-300/50 shadow-2xl text-white",
    descriptionClassName: "text-purple-100",
    action: {
      label: "Dodaj produkty",
      onClick: () => router.push('/fridge'),
    },
    cancel: {
      label: "Zamknij",
      onClick: () => {}, // Just close
    },
  });
  // DON'T set matchesError - we only show Sonner toast, not purple card
} else {
  // Show auto-closing toast
  toast.info(result.error);
}
```

**Glassmorphism Features**:
- `backdrop-blur-xl` - Blurred background (glass effect)
- `bg-gradient-to-br from-purple-500/90 to-pink-500/90` - Gradient with transparency
- `border border-purple-300/50` - Semi-transparent border
- `shadow-2xl` - Deep shadow for depth
- `text-white` - White text for contrast
- `text-purple-100` - Light purple description text

**Important**: When `requiresUserAction = true`, we show **ONLY** Sonner toast (no purple card below). This avoids duplicate buttons and mixed languages.

### 3. When to Use Each

#### ✅ Persistent Toast (requiresUserAction = true)
- **Empty fridge** → No recipes available
- **User must take action** (add ingredients, adjust preferences)
- **Important information** user needs to read
- Includes **action buttons** ("Dodaj produkty", "Zamknij")
- Closes **only on user click**
- Shows at **top-center** of screen

#### ❌ Auto-Close Toast (requiresUserAction = false or undefined)
- **Technical errors** (400 Bad Request, 500 Internal Error)
- **Informational messages** (success confirmations)
- Auto-closes after 3-5 seconds

## 🏗️ Implementation Details

### Files Changed

#### 1. `lib/api.ts`
- Updated `AIRecommendationResult` type to include `requiresUserAction?: boolean`
- Backend response type includes the new flag
- API function passes flag to frontend

```typescript
export type AIRecommendationResult =
  | { status: 'ok'; recipe: RecipeMatch }
  | { status: 'no-results'; message: string; error?: string; requiresUserAction?: boolean };
```

#### 2. **Installed Sonner via shadcn**
```bash
npx shadcn@latest add sonner
```

This created:
- `components/ui/sonner.tsx` - Pre-configured Toaster component with theme support

#### 3. `app/assistant/page.tsx`
- Imported `sonner` toast and `Toaster` component
- Removed modal state and component
- Updated `loadRecipeMatches()` to show Sonner toast with actions
- Added `<Toaster />` at component root

```typescript
// Import
import { toast as sonnerToast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

// In loadRecipeMatches():
if (result.requiresUserAction) {
  console.log("🔔 Showing Sonner toast with actions");
  sonnerToast.info(result.message, {
    duration: Infinity, // Never auto-close
    description: "💡 Dodaj więcej składników...",
    action: {
      label: "Dodaj produkty",
      onClick: () => router.push('/fridge'),
    },
    cancel: {
      label: "Zamknij",
      onClick: () => {},
    },
  });
}

// At component end:
<Toaster richColors position="top-center" />
```

## 🎯 User Experience

### Before (Auto-Close Toast)
1. User clicks "Pokaż przepisy"
2. Backend returns: no recipes found
3. Toast appears: "We couldn't find any recipes..."
4. Toast **auto-closes after 3 seconds**
5. User: "Wait, what did it say?!" 😕

### After (Sonner Persistent Toast)
1. User clicks "Pokaż przepisy"
2. Backend returns: no recipes found + `requiresUserAction: true`
3. **Sonner toast appears** at top-center with:
   - 🧠 Message: "We couldn't find any recipes..."
   - 💡 Description: "Dodaj więcej składników..."
   - 🟣 Button: "Dodaj produkty" (opens `/fridge`)
   - ⚪ Button: "Zamknij" (dismisses toast)
4. Toast **stays until user clicks button**
5. User reads message, chooses action 🎉

## 🎨 Sonner Features Used

### Built-in Features
- ✅ **Action buttons** - Primary and cancel actions
- ✅ **Infinite duration** - `duration: Infinity`
- ✅ **Rich colors** - `richColors` prop for colored icons
- ✅ **Theme support** - Automatic dark/light mode
- ✅ **Position control** - `position="top-center"`
- ✅ **Icons** - Info, Success, Error, Warning icons
- ✅ **Description** - Secondary text below title

### Example Configuration
```typescript
sonnerToast.info("Main message", {
  duration: Infinity,           // Never auto-close
  description: "💡 Help text",   // Secondary message
  action: {
    label: "Primary Action",
    onClick: () => { /* ... */ },
  },
  cancel: {
    label: "Cancel",
    onClick: () => { /* ... */ },
  },
});
```

## 🚀 Testing

### Test Case 1: Empty Fridge (requiresUserAction = true)
1. Empty your fridge in the app
2. Go to Assistant page
3. Click "Pokaż przepisy"
4. **Expected**: Sonner toast appears at **top-center** with:
   - Message: "We couldn't find any recipes matching your fridge..."
   - Description: "💡 Dodaj więcej składników..."
   - Button: "Dodaj produkty" → Opens `/fridge`
   - Button: "Zamknij" → Closes toast
5. Toast should **NOT auto-close**
6. Click any button → Toast dismisses

### Test Case 2: Technical Error (requiresUserAction = false)
1. Simulate 500 Internal Server Error
2. **Expected**: Regular toast notification (existing behavior)
3. Toast auto-closes after 3-5 seconds

## 📦 Deployment

- **Library**: Sonner (via shadcn)
- **Files changed**: 2
  - `lib/api.ts` (union type with flag)
  - `app/assistant/page.tsx` (Sonner integration)
  - `components/ui/sonner.tsx` (new component from shadcn)
- **Files removed**: 1
  - `components/common/UserActionModal.tsx` (replaced by Sonner)

## 🔮 Future Improvements

1. **Multiple actions** - Add more action buttons if needed
2. **Custom styling** - Match app's purple gradient theme
3. **Swipe to dismiss** - On mobile devices
4. **Queue management** - Handle multiple toasts elegantly
5. **Analytics** - Track toast interactions

## 📝 Advantages of Sonner vs Modal

| Feature | Modal | Sonner Toast |
|---------|-------|--------------|
| User interruption | **High** (blocks UI) | **Low** (overlay) |
| Mobile friendly | Requires scroll | ✅ Always visible |
| Multiple messages | Stacks (bad UX) | ✅ Queues nicely |
| Animation | Custom code | ✅ Built-in |
| Accessibility | Manual ARIA | ✅ Built-in |
| Code complexity | ~150 lines | **~10 lines** |
| Theme support | Manual | ✅ Automatic |
| Action buttons | Custom | ✅ Built-in |

---

**Author**: AI Assistant  
**Date**: 2025-12-22  
**Version**: 2.0 (Sonner)
