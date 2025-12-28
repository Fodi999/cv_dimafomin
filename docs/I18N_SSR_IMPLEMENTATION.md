# SSR-Safe Language System - Implementation Guide

**Дата**: 28 декабря 2025  
**Статус**: ✅ Реализовано

---

## 🎯 Что реализовано

Полностью SSR-safe система языков с cookies как источником истины.

### ✅ Компоненты системы

1. **`lib/i18n/constants.ts`** - Константы и типы
2. **`middleware.ts`** - Гарантирует наличие cookie
3. **`contexts/LanguageContext.tsx`** - Cookie-first Provider
4. **`app/layout.tsx`** - Server-side чтение cookie + загрузка словаря

---

## 🔄 Flow работы

```
┌─────────────────────────────────────────────────────┐
│ 1. User Request                                     │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 2. middleware.ts                                    │
│    - Читает cookie "lang"                           │
│    - Валидирует (pl/en/ru)                          │
│    - Устанавливает/обновляет cookie                 │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 3. app/layout.tsx (Server Component)                │
│    - Читает cookie через cookies()                  │
│    - Загружает dictionary через getDictionary()     │
│    - Передаёт в LanguageProvider                    │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 4. LanguageProvider (Client Component)              │
│    - Получает initialLanguage + dictionary          │
│    - Создаёт context                                │
│    - SSR: язык одинаков на сервере и клиенте        │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 5. useLanguage() в компонентах                      │
│    - const { t, language, setLanguage } = ...       │
│    - <h1>{t.common.welcome}</h1>                    │
└─────────────────────────────────────────────────────┘
```

---

## 📝 Использование

### В компонентах

```tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t.common.welcome}</h1>
      <p>{t.profile.info.name}</p>
      
      <button onClick={() => setLanguage("en")}>
        Switch to English
      </button>
      
      <p>Current language: {language}</p>
    </div>
  );
}
```

### LanguageSwitcher

```tsx
"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div>
      <button 
        onClick={() => setLanguage("pl")}
        disabled={language === "pl"}
      >
        🇵🇱 Polski
      </button>
      
      <button 
        onClick={() => setLanguage("en")}
        disabled={language === "en"}
      >
        🇬🇧 English
      </button>
      
      <button 
        onClick={() => setLanguage("ru")}
        disabled={language === "ru"}
      >
        🇷🇺 Русский
      </button>
    </div>
  );
}
```

---

## 🔧 Техническая реализация

### 1. Constants (`lib/i18n/constants.ts`)

```typescript
export const DEFAULT_LANGUAGE = "pl" as const;
export const SUPPORTED_LANGUAGES = ["pl", "en", "ru"] as const;
export type Language = typeof SUPPORTED_LANGUAGES[number];

export const LANGUAGE_COOKIE_KEY = "lang";
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 год

export function isSupportedLanguage(lang: string): lang is Language {
  return SUPPORTED_LANGUAGES.includes(lang as Language);
}
```

### 2. Middleware (`middleware.ts`)

```typescript
export function middleware(req: NextRequest) {
  const cookieLang = req.cookies.get(LANGUAGE_COOKIE_KEY)?.value;
  
  const lang = cookieLang && isSupportedLanguage(cookieLang)
    ? cookieLang
    : DEFAULT_LANGUAGE;
  
  const res = NextResponse.next();
  
  res.cookies.set(LANGUAGE_COOKIE_KEY, lang, {
    path: "/",
    maxAge: LANGUAGE_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  
  return res;
}
```

**Роль**: Гарантирует, что cookie "lang" всегда существует и валиден.

### 3. Server Layout (`app/layout.tsx`)

```typescript
export default async function RootLayout({ children }) {
  // 1. Read cookie
  const cookieStore = await cookies();
  const langCookie = cookieStore.get(LANGUAGE_COOKIE_KEY)?.value;
  const language: Language = langCookie && isSupportedLanguage(langCookie) 
    ? langCookie 
    : DEFAULT_LANGUAGE;

  // 2. Load dictionary server-side
  const dictionary = await getDictionary(language);

  return (
    <html lang={language}>
      <body>
        <LanguageProvider 
          initialLanguage={language} 
          dictionary={dictionary}
        >
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
```

**Роль**: Загружает правильный словарь на сервере, передаёт в Provider.

### 4. Language Provider (`contexts/LanguageContext.tsx`)

```typescript
export function LanguageProvider({ 
  initialLanguage = DEFAULT_LANGUAGE,
  dictionary: initialDictionary,
  children 
}: { 
  initialLanguage?: Language;
  dictionary?: Dictionary;
  children: React.ReactNode;
}) {
  const [language] = useState<Language>(initialLanguage);
  const [dictionary, setDictionary] = useState<Dictionary | null>(
    initialDictionary || null
  );
  
  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    
    // 1. Update cookie
    document.cookie = `${LANGUAGE_COOKIE_KEY}=${lang}; path=/; max-age=${LANGUAGE_COOKIE_MAX_AGE}`;
    
    // 2. Update localStorage (fallback)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    
    // 3. Reload for SSR consistency
    window.location.reload();
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

**Роль**: Создаёт context, обрабатывает смену языка с reload.

---

## ✅ Преимущества

### 🎯 SSR-Safe
- ✅ Cookie синхронизирован между сервером и клиентом
- ✅ Нет hydration mismatch
- ✅ Язык определяется ДО рендера

### 🚀 Performance
- ✅ Dictionary загружается server-side (оптимизация)
- ✅ Lazy loading для client-side навигации
- ✅ Минимальный bundle size

### 🔒 Type-Safe
- ✅ Полный TypeScript autocomplete
- ✅ `t.domain.key` вместо `t("domain.key")`
- ✅ Compile-time проверка ключей

### 🌐 SEO
- ✅ `<html lang={language}>` правильный с SSR
- ✅ Metadata может использовать язык
- ✅ Crawlers видят правильный контент

---

## 🔄 Workflow смены языка

1. **User кликает на переключатель**
   ```tsx
   <button onClick={() => setLanguage("en")}>EN</button>
   ```

2. **setLanguage() обновляет cookie**
   ```typescript
   document.cookie = "lang=en; path=/; max-age=31536000"
   ```

3. **localStorage обновляется (fallback)**
   ```typescript
   localStorage.setItem("lang", "en")
   ```

4. **Page reload**
   ```typescript
   window.location.reload()
   ```

5. **Middleware обрабатывает новый request**
   - Видит cookie "lang=en"
   - Подтверждает валидность

6. **Server Layout загружает EN dictionary**
   ```typescript
   const dictionary = await getDictionary("en")
   ```

7. **UI рендерится на английском**
   - SSR: правильный HTML
   - Client: hydration без mismatch

---

## 🛠️ Troubleshooting

### Проблема: Язык сбрасывается после reload

**Причина**: Cookie не устанавливается  
**Решение**: Проверить middleware.ts и matcher config

```typescript
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
```

### Проблема: Hydration mismatch warning

**Причина**: Язык отличается на сервере и клиенте  
**Решение**: Убедиться что layout.tsx читает cookie правильно

```typescript
const cookieStore = await cookies(); // await обязателен!
```

### Проблема: setLanguage() не работает

**Причина**: Context не доступен  
**Решение**: Компонент должен быть внутри LanguageProvider

```tsx
// ❌ Неправильно
<MyComponent />
<LanguageProvider>...</LanguageProvider>

// ✅ Правильно
<LanguageProvider>
  <MyComponent />
</LanguageProvider>
```

---

## 📊 Сравнение с другими подходами

| Подход | SSR-Safe | Performance | Type-Safe | Complexity |
|--------|----------|-------------|-----------|------------|
| **Cookie-first** (наш) | ✅ | ✅ | ✅ | 🟢 Low |
| LocalStorage only | ❌ | ⚠️ | ✅ | 🟢 Low |
| URL params (`/en/page`) | ✅ | ✅ | ⚠️ | 🟡 Medium |
| Database + Session | ✅ | ❌ | ✅ | 🔴 High |
| Accept-Language header | ⚠️ | ✅ | ⚠️ | 🟡 Medium |

---

## 🎓 Best Practices

### ✅ DO

- Use cookies as source of truth
- Load dictionary server-side in layout
- Reload page after language change (SSR consistency)
- Validate language in middleware
- Type all dictionary keys

### ❌ DON'T

- Don't store language only in localStorage
- Don't read `navigator.language` on every render
- Don't change language without reload (breaks SSR)
- Don't skip middleware validation
- Don't use string keys (`t("key")`)

---

## 🚀 Следующие шаги

### Готово ✅
- [x] Constants и типы
- [x] Middleware с cookie
- [x] Cookie-first LanguageProvider
- [x] Server layout integration
- [x] Type-safe context

### Опционально ⏳
- [ ] Backend sync (PATCH /api/user/settings)
- [ ] Analytics tracking (язык в events)
- [ ] A/B testing переводов
- [ ] Translation memory для редакторов

---

## 📚 Связанные документы

- [I18N_SYSTEM.md](./I18N_SYSTEM.md) - Полная документация системы
- [I18N_QUICK_START.md](./I18N_QUICK_START.md) - Быстрый старт
- [I18N_DEPRECATION_PLAN.md](./I18N_DEPRECATION_PLAN.md) - План миграции legacy

---

*Последнее обновление: 28 декабря 2025*  
*Статус: ✅ Production Ready*
