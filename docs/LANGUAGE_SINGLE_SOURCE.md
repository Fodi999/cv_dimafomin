# Language Single Source of Truth

## 📋 Problem Fixed

**BEFORE (WRONG ❌):**
```typescript
// base.ts
headers: {
  "Accept-Language": "pl" // Hardcoded!
}
```

**AFTER (CORRECT ✅):**
```typescript
// base.ts
import { LANGUAGE_STORAGE_KEY } from "@/lib/i18n/constants";

function getCurrentLanguage(): string {
  if (typeof window === "undefined") return "en";
  const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY); // "lang"
  return storedLang || "en";
}

headers: {
  "Accept-Language": getCurrentLanguage() // Dynamic!
}
```

---

## 🎯 Architecture: Single Source of Truth

### Storage Key
**Constant:** `LANGUAGE_STORAGE_KEY = "lang"`  
**Location:** `lib/i18n/constants.ts`

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  USER ACTION: Click language switcher                   │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│  LanguageContext.setLanguage(lang)                      │
│  ✅ Writes to: localStorage["lang"] = lang              │
│  ✅ Writes to: document.cookie (for middleware)         │
│  ✅ Updates React state                                 │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│  API Call: fridgeApi.getItems(token)                    │
│  ↓                                                       │
│  base.ts: apiFetch()                                    │
│  ✅ Reads from: localStorage["lang"]                    │
│  ✅ Sets header: "Accept-Language": "ru"                │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│  Backend receives Accept-Language header                │
│  ✅ Returns translated ingredient names                 │
│  ✅ Example: "Łosoś" (pl) vs "Salmon" (en) vs "Лосось"  │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Details

### 1. Constants (`lib/i18n/constants.ts`)
```typescript
export const LANGUAGE_STORAGE_KEY = "lang";
export const LANGUAGE_COOKIE_KEY = "lang";
export const DEFAULT_LANGUAGE = "pl";
export const SUPPORTED_LANGUAGES = ["pl", "en", "ru"] as const;
```

### 2. LanguageContext (`contexts/LanguageContext.tsx`)
**Writes to localStorage:**
```typescript
const setLanguage = (lang: Language) => {
  // Update cookie
  document.cookie = `${LANGUAGE_COOKIE_KEY}=${lang}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}`;
  
  // ✅ Update localStorage (SINGLE SOURCE OF TRUTH)
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }
  
  // Update React state
  setLanguageState(lang);
};
```

**Reads on mount:**
```typescript
useEffect(() => {
  if (!hasCheckedStorage.current && typeof window !== "undefined") {
    hasCheckedStorage.current = true;
    
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && savedLanguage !== language) {
      console.log(`🔄 Restoring saved language: ${savedLanguage}`);
      setLanguageState(savedLanguage as Language);
    }
  }
}, []);
```

### 3. API Base (`lib/api/base.ts`)
**Reads from localStorage:**
```typescript
import { LANGUAGE_STORAGE_KEY } from "@/lib/i18n/constants";

function getCurrentLanguage(): string {
  if (typeof window === "undefined") return "en";
  const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  console.log(`🌍 [base.ts] Reading language: "${storedLang}"`);
  return storedLang || "en";
}

export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, language, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": language || getCurrentLanguage(), // ✅ Dynamic!
    ...(fetchOptions.headers as Record<string, string>),
  };
  
  // ... rest of fetch logic
}
```

---

## 📊 Why This Architecture?

### ❌ Problems with Old Approach:
1. **Hardcoded language** in `base.ts`: `"Accept-Language": "pl"`
2. **Mismatch** between frontend UI language and API requests
3. **User selects Russian** → sees Russian UI
4. **Backend receives Polish header** → returns Polish ingredient names
5. **Result:** UI in Russian, data in Polish 🤦

### ✅ Benefits of New Approach:
1. **Single source of truth**: `localStorage["lang"]`
2. **Automatic sync**: LanguageContext writes, base.ts reads
3. **No React dependency**: `base.ts` doesn't need useContext
4. **Consistent data**: UI language = API language
5. **User selects Russian** → UI in Russian + API returns Russian names ✅

---

## 🧪 Testing

### Test Case 1: Change Language
1. Open app (default: Polish)
2. Check localStorage: `localStorage.getItem("lang")` → `"pl"`
3. Click language switcher → Select "Russian"
4. Check localStorage: `localStorage.getItem("lang")` → `"ru"`
5. Open DevTools → Network → Check `Accept-Language` header
6. **Expected:** `Accept-Language: ru`

### Test Case 2: Page Reload
1. Set language to Russian
2. Reload page (F5)
3. Check that UI stays in Russian
4. Check that API requests have `Accept-Language: ru`

### Test Case 3: New API Call
1. Set language to English
2. Add product to fridge
3. Check Network tab for `/api/fridge/items` POST
4. **Expected header:** `Accept-Language: en`
5. **Expected response:** Ingredient names in English

---

## 🚀 Migration Checklist

- [x] Import `LANGUAGE_STORAGE_KEY` in `base.ts`
- [x] Update `getCurrentLanguage()` to use constant
- [x] Remove hardcoded `"pl"` fallback → use `"en"`
- [x] Add console.log for debugging
- [x] Verify LanguageContext uses same key
- [x] Create documentation

---

## 📝 Related Files

- `lib/i18n/constants.ts` - Language constants
- `lib/api/base.ts` - API fetch wrapper (reads language)
- `contexts/LanguageContext.tsx` - Language state management (writes language)
- `components/LanguageSwitcher.tsx` - UI component

---

## 🔍 Debugging

**Check current language:**
```javascript
// In browser console
localStorage.getItem("lang") // Should return "pl", "en", or "ru"
```

**Monitor API calls:**
```javascript
// In DevTools → Network → Headers
// Look for "Accept-Language" header in request
```

**Force language change:**
```javascript
// In browser console
localStorage.setItem("lang", "ru");
window.location.reload();
```

---

**Last Updated:** 2024-01-20  
**Status:** ✅ Implemented  
**Migration:** Complete
