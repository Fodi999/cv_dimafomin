# 🌍 i18n System — Simple & Effective

## 📦 Architecture

**Гібридний підхід без next-intl:**
- ✅ React Context для стану мови
- ✅ localStorage для кешування
- ✅ Backend API для синхронізації між пристроями
- ✅ Простий хук `useTranslations()` для перекладів

## 🎯 Чому НЕ next-intl?

1. **Складна структура** — потребує `app/[locale]/*` структури
2. **Overkill** — для 3 мов не потрібна повна локалізація
3. **Server-side** — конфлікт з client-side user settings
4. **Простіше = краще** — React Context вистачає

---

## 🔧 Як це працює

### 1. Language Context

```tsx
// contexts/LanguageContext.tsx
export type Locale = "pl" | "en" | "ru";

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState<Locale>("pl");
  
  // 1. Load from localStorage on mount
  // 2. Load from backend if authenticated
  // 3. Save to both when changed
}
```

### 2. Translation Hook

```tsx
// hooks/useTranslations.ts
const translations = {
  pl: { "settings.title": "Ustawienia" },
  en: { "settings.title": "Settings" },
  ru: { "settings.title": "Настройки" },
};

export function useTranslations() {
  const { language } = useLanguage();
  const t = (key) => translations[language][key];
  return { t };
}
```

### 3. Usage in Components

```tsx
import { useTranslations } from "@/hooks/useTranslations";

export function MyComponent() {
  const { t } = useTranslations();
  
  return <h1>{t("settings.title")}</h1>;
}
```

---

## 📂 File Structure

```
contexts/
  LanguageContext.tsx     # React Context для мови
hooks/
  useTranslations.ts      # Хук для перекладів
lib/
  api/settings.ts         # API для збереження в backend
components/
  profile/settings/
    CoreSettingsSection.tsx  # Вибір мови
```

---

## ✅ Language Selection Flow

1. **Перший візит (незалогінений):**
   ```
   Browser language → localStorage → Polish (fallback)
   ```

2. **Після логіну:**
   ```
   Backend settings → Override localStorage → Sync across devices
   ```

3. **Зміна мови:**
   ```
   User clicks → Update Context → Save to backend → Save to localStorage
   ```

---

## 🎨 UI Pattern

```tsx
// CoreSettingsSection.tsx
<div>
  <h3>🌍 Język interfejsu</h3>
  <div className="flex gap-2">
    {["pl", "en", "ru"].map((lang) => (
      <button
        key={lang}
        onClick={() => setLanguage(lang)}
        className={language === lang ? "active" : ""}
      >
        {lang.toUpperCase()}
      </button>
    ))}
  </div>
</div>
```

---

## 🔄 Sync Strategy

| Location | When | Why |
|----------|------|-----|
| **localStorage** | Always | Offline fallback, instant load |
| **Backend API** | When logged in | Sync across devices |
| **React Context** | Runtime | Real-time UI updates |

---

## 📝 Adding New Translations

### Step 1: Add to dictionary

```ts
// hooks/useTranslations.ts
const translations = {
  pl: {
    "new.key": "Polski tekst",
  },
  en: {
    "new.key": "English text",
  },
  ru: {
    "new.key": "Русский текст",
  },
};
```

### Step 2: Use in component

```tsx
const { t } = useTranslations();
<p>{t("new.key")}</p>
```

---

## 🚀 Advantages

✅ **Простота** — всього 2 файли (Context + Hook)  
✅ **Швидкість** — без серверного рендерингу  
✅ **Гнучкість** — легко додати нові ключі  
✅ **Sync** — синхронізація через backend  
✅ **Offline** — працює без інтернету через localStorage  

---

## ⚠️ Limitations

❌ **Не підходить для:**
- SEO-критичних сторінок (landing pages)
- Статичної генерації з різними мовами
- Server-side метаданих

✅ **Чудово підходить для:**
- Dashboard UI
- User settings
- Interactive features
- Client-side apps

---

## 🎯 Current Status

✅ LanguageContext створено  
✅ useTranslations hook готовий  
✅ CoreSettingsSection інтегровано  
✅ Backend API endpoints працюють  
⏳ Потрібно додати більше перекладів  

---

## 📚 Next Steps

1. **Додати переклади для всіх секцій:**
   - AI Actions (assistant)
   - Recipe cards
   - Fridge UI
   - Academy

2. **Створити хелпери:**
   ```ts
   // Format dates based on language
   formatDate(date: Date, language: Locale): string
   
   // Format numbers/currency
   formatNumber(num: number, language: Locale): string
   ```

3. **Тестування:**
   - Перевірити перемикання мови
   - Тест синхронізації з backend
   - localStorage fallback

---

## 💡 Pro Tips

**1. Structured Keys:**
```ts
"module.component.label"  // ✅ Good
"buttonText"              // ❌ Bad
```

**2. Plurals:**
```ts
"recipes.count": {
  pl: (n: number) => n === 1 ? "1 przepis" : `${n} przepisów`,
  en: (n: number) => n === 1 ? "1 recipe" : `${n} recipes`,
}
```

**3. Interpolation:**
```ts
"welcome.message": (name: string) => `Witaj, ${name}!`
```

---

## 🔗 Related Files

- `contexts/LanguageContext.tsx` — Language state management
- `hooks/useTranslations.ts` — Translation dictionary & hook
- `lib/api/settings.ts` — Backend sync API
- `components/profile/settings/CoreSettingsSection.tsx` — UI для вибору мови

---

**Last Updated:** 27.12.2024  
**Status:** ✅ Production Ready (minimal viable version)
