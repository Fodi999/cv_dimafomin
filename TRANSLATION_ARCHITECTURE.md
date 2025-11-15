# 🌐 Архитектура переводов Modern Food Academy

## 📊 Общая структура

```
Приложение имеет двойную систему переводов:

┌─────────────────────────────────────────────────────┐
│           ЯЗЫКИ (Language Context)                   │
│  ┌─────────────────────────────────────────────────┤
│  │ 🇵🇱 Polski (pl)       🇺🇦 Українська (ua)      │
│  └─────────────────────────────────────────────────┘
│
│  /lib/translations.ts (901 строка)
│  ├── pl: { nav, hero, about, portfolio, skills... }
│  └── ua: { nav, hero, about, portfolio, skills... }
│
│  /lib/profile-translations.ts (~180 строк)
│  ├── uk: { myProfile, tokens, balance... }
│  └── pl: { myProfile, tokens, balance... }
│
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ Основные компоненты системы

### 1️⃣ Language Context (`/contexts/LanguageContext.tsx`)

**Задача**: Управление текущим языком и предоставление переводов всему приложению

```typescript
interface LanguageContextType {
  language: Language;           // 'pl' | 'ua'
  setLanguage: (lang: Language) => void;  // Переключатель языка
  t: typeof translations[Language];       // Объект переводов для текущего языка
}
```

**Функции**:
- ✅ Загружает язык из localStorage при монтировании
- ✅ Сохраняет выбор языка в localStorage
- ✅ Предоставляет `useLanguage()` хук всему приложению
- ✅ Обрабатывает переключение языка в реальном времени

**Использование**:
```tsx
const { language, setLanguage, t } = useLanguage();

// Переключить язык
<button onClick={() => setLanguage('ua')}>Українська</button>
<button onClick={() => setLanguage('pl')}>Polski</button>

// Использовать переводы
<h1>{t.hero.title}</h1>
<p>{t.about.name}</p>
```

---

### 2️⃣ Главный файл переводов (`/lib/translations.ts`)

**Размер**: 901 строка

**Структура**:
```typescript
export type Language = 'pl' | 'ua';

export const translations = {
  pl: {
    nav: { home, about, portfolio, skills, ... },
    hero: { title, subtitle, tagline, ... },
    about: { title, intro, name, paragraph1, ... },
    portfolio: { title, items, descriptions },
    skills: { title, items },
    experience: { title, steps },
    contact: { title, form fields, ... },
    footer: { title, copyright },
    academy: {
      dashboard: { ... },  // Все переводы для академии
      community: { ... },  // Сообщество
      leaderboard: { ... },
      certificates: { ... },
      profile: { ... },
      earnTokens: { ... }
    },
    market: { ... },
    auth: { ... }
  },

  ua: {
    // Идентичная структура, но на украинском языке
    nav: { home, about, portfolio, skills, ... },
    hero: { ... },
    // ... всё остальное
  }
}
```

**9 основных разделов**:

| Раздел | Описание | Ключи |
|--------|---------|-------|
| **nav** | Навигационное меню | home, about, login, logout, search |
| **hero** | Герой секция | title, subtitle, tagline, ctaPrimary, ctaSecondary |
| **about** | Информация о программе | title, intro, name, paragraph1-3, quote |
| **portfolio** | Портфолио (18 блюд) | title, items, descriptions |
| **skills** | Умения/курсы (9 курсов) | title, items |
| **experience** | Путь обучения (6 шагов) | title, steps |
| **contact** | Контакты и форма | title, form fields, social links |
| **footer** | Подвал | title, copyright, keywords |
| **academy** | 🎓 Вся система обучения | dashboard, community, wallet, earnTokens, profile |
| **market** | 🏪 Маркетплейс | title, search, sort, difficulty |
| **auth** | 🔐 Авторизация | login, register, password |

---

### 3️⃣ Переводы профиля (`/lib/profile-translations.ts`)

**Размер**: ~180 строк

**Структура**:
```typescript
export const profileTranslations = {
  uk: {
    myProfile,       // "Мій профіль"
    tokenBalance,    // "Баланс ChefTokens"
    tokens,          // "токени"
    earn,            // "Заробити"
    buy,             // "Купити"
    refresh,         // "Оновити"
    publications,    // "Публікації"
    followers,       // "Підписники"
    following,       // "Слідкую"
    // ... і так далі
  },
  pl: {
    // Идентичная структура на польском
    myProfile,
    tokenBalance,
    tokens,
    // ...
  }
}
```

**Почему отдельный файл?**
- Профиль имеет специфичные переводы
- Облегчает поддержку и актуализацию
- Позволяет использовать `useProfileTranslations()` хук

---

### 4️⃣ Хук профиля (`/hooks/useProfileTranslations.ts`)

**Назначение**: Предоставить переводы профиля с текущим языком

```typescript
export function useProfileTranslations() {
  const { language } = useLanguage();
  
  return {
    translations: profileTranslations[language],
    language
  };
}
```

**Использование на /app/profile/page.tsx**:
```tsx
const { translations, language } = useProfileTranslations();
<h1>{translations.myProfile}</h1>
```

---

## 📍 Места использования переводов

```
├── /app/layout.tsx
│   └── <LanguageProvider> ← ОБЁРТКА ДЛЯ ВСЕГО ПРИЛОЖЕНИЯ
│
├── /app/page.tsx (Главная)
│   ├── <Navigation /> ← useLanguage() для меню
│   ├── <Hero /> ← t.hero.*
│   ├── <About /> ← t.about.*
│   ├── <Portfolio /> ← t.portfolio.*
│   ├── <Skills /> ← t.skills.*
│   ├── <Experience /> ← t.experience.*
│   ├── <Contact /> ← t.contact.*
│   └── <Footer /> ← t.footer.*
│
├── /app/academy/page.tsx
│   └── useLanguage() для переводов академии
│
├── /app/academy/courses/page.tsx
│   └── Используеть t.academy.dashboard.*
│
├── /app/(chat)/create-chat/page.tsx
│   └── useLanguage() для чата
│
├── /app/profile/page.tsx
│   └── useProfileTranslations() для переводов профиля
│
├── /app/market/page.tsx
│   └── useLanguage() для маркетплейса
│
└── /components/**/*.tsx
    └── Все компоненты могут использовать useLanguage()
```

---

## 🔄 Поток данных

```
┌──────────────────────────────────────┐
│  User clicks Language Button         │
│  (English/Polski/Українська)         │
└──────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────┐
│  setLanguage('ua') или setLanguage('pl')
└──────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────┐
│  LanguageContext обновляется         │
│  localStorage.setItem('language', lang)
└──────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────┐
│  t = translations[language]          │
│  получает правильные переводы        │
└──────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────┐
│  Компоненты перерендеряются          │
│  с новыми переводами                │
└──────────────────────────────────────┘
```

---

## 📋 Полная иерархия разделов

### `translations.pl.nav` (Навигация)
```
home          = 'Główna'
about         = 'O mnie'
portfolio     = 'Portfolio'
skills        = 'Umiejętności'
experience    = 'Doświadczenie'
contact       = 'Kontakt'
login         = 'Zaloguj się'
logout        = 'Wyloguj się'
search        = 'Szukaj projektów...'
```

### `translations.pl.hero` (Герой)
```
title           = 'Sztuka Sushi od Podstaw...'
subtitle        = 'Otwieram nową przestrzeń edukacyjną online'
tagline         = 'Akademia online dla tych...'
description     = 'Uczę nie tylko...'
ctaPrimary      = 'Zacznij naukę bezpłatnie'
ctaSecondary    = 'Zobacz Portfolio'
```

### `translations.pl.about` (О программе)
```
title           = 'O Akademii'
intro           = 'Twój nauczyciel:'
name            = 'Dima Fomin'
paragraph1      = 'Witaj w Culinary Academy...'
paragraph2      = 'Każdy kurs to połączenie...'
paragraph3      = 'Specjalizuję się w...'
quote           = 'Moja filozofia...'
imageAlt        = 'Dima Fomin - Szef Kuchni...'
```

### `translations.pl.portfolio` (Портфолио - 18 блюд)
```
items[0]        = '01. Signature Roll'
items[1]        = '02. Premium Selection'
...
items[17]       = '18. Exquisite Taste'

descriptions[0] = 'Signature Roll — равновага...'
descriptions[1] = 'Prémium Selection — harmonia...'
...
```

### `translations.pl.skills` (Навыки - 9 курсов)
```
title           = 'Umiejętności, które zdobędziesz...'
subtitle        = 'Program nauczania łączy...'

items[0].title  = 'Nigiri & Sashimi'
items[0].description = 'Technika krojenia...'

items[1].title  = 'Maki & Uramaki'
items[1].description = 'Kreatywne rolowanie...'

...9 курсов всего
```

### `translations.pl.experience` (Путь обучения - 6 шагов)
```
title           = 'Путь Обучения'
subtitle        = 'Как это работает'

steps[0].number = '1'
steps[0].title  = 'Зареєстуйтесь...'
steps[0].description = '...'
steps[0].bonus  = '🎁 Бонус...'

...6 шагов всего
```

### `translations.pl.academy` (БОЛЬШОЙ раздел - Академия)

#### `academy.dashboard` (Панель управления)
```
title           = 'Мій Дашборд'
completedCourses = 'Завершені курси'
certificates    = 'Сертифікати'
activeCourses   = 'Активні курси'
progress        = 'Прогрес'

earnTokens {
  title         = 'Як заробити ChefTokens'
  completeLessons = 'Завершіть урок'
  completeCourses = 'Завершіть курс'
  // ... 7 способів заробити
}

wallet {
  title         = 'Гаманець ChefTokens'
  balance       = 'Поточний баланс'
  totalEarned   = 'Всього заробено'
  totalSpent    = 'Всього витрачено'
  
  modal {
    emptyMessage = 'У вас немає ChefTokens'
    hasTokensMessage = 'У вас є ChefTokens'
    buyButton   = 'Купити токени'
    earnButton  = 'Заробити токени'
  }
  
  type {
    earned      = 'Заробовано'
    spent       = 'Витрачено'
  }
  
  reasons {
    courseCompletion = 'Завершення курсу'
    lessonComplete   = 'Завершення уроку'
    achievement      = 'Досягнення'
    dailyBonus       = 'Щоденний бонус'
    // ...
  }
}
```

#### `academy.community` (Сообщество)
```
title           = 'Сообщество'
createPost      = 'Создать пост'
totalPosts      = 'Всего постов'
activeChefs     = 'Активных шефов'

photoLabel     = 'Фото'
titleLabel     = 'Название'
descriptionLabel = 'Описание'
difficultyLabel = 'Уровень сложности'
// ... форма создания поста
```

### `translations.pl.market` (Маркетплейс)
```
title           = 'Маркетплейс рецептів'
subtitle        = 'Купуйте рецепти за ChefTokens'
search          = 'Пошук рецептів…'

difficulty {
  all           = 'Все рівні'
  beginner      = 'Початківець'
  intermediate  = 'Середній'
  advanced      = 'Продвинутий'
}

sort {
  popular       = 'Популярні'
  newest        = 'Нові'
  priceLow      = 'Ціна (зростання)'
  priceHigh     = 'Ціна (спадання)'
  rating        = 'Рейтинг'
}
```

### `translations.pl.auth` (Авторизация)
```
loginTitle      = 'Вход'
loginSubtitle   = 'Войдите в свой аккаунт'
registerTitle   = 'Регистрация'
registerSubtitle = 'Создайте новый аккаунт'

email           = 'Email'
password        = 'Пароль'
confirmPassword = 'Подтвердить пароль'
name            = 'Имя'

rememberMe      = 'Помнить меня'
forgotPassword  = 'Забыли пароль?'
loginButton     = 'Войти'
registerButton  = 'Создать аккаунт'
```

---

## 🔧 Типизация

```typescript
// Тип языка
export type Language = 'pl' | 'ua';

// Тип всех переводов для одного языка
export type Translations = typeof translations['pl'];

// Все ключи переводов (для type-safe доступа)
export type TranslationKey = 'nav' | 'hero' | 'about' | ... ;

// Вложенные типы
type NavTranslations = Translations['nav'];
type HeroTranslations = Translations['hero'];
type AcademyTranslations = Translations['academy'];
```

---

## 💾 localStorage

**Ключ**: `'language'`

**Значения**: `'pl'` | `'ua'`

**Когда сохраняется**:
- При загрузке страницы LanguageContext читает из localStorage
- При вызове `setLanguage()` значение сохраняется в localStorage

**Пример**:
```javascript
localStorage.setItem('language', 'ua');     // Сохранить украинский
const lang = localStorage.getItem('language'); // Получить язык пользователя
```

---

## 🚀 Как добавить новый язык

### Шаг 1: Обновить тип Language
```typescript
// /lib/translations.ts (строка 1)
export type Language = 'pl' | 'ua' | 'ru'; // ← Добавить 'ru'
```

### Шаг 2: Добавить переводы
```typescript
// /lib/translations.ts (после ua: { ... })
export const translations = {
  pl: { ... },
  ua: { ... },
  ru: {
    nav: { home: 'Главная', about: 'Обо мне', ... },
    hero: { ... },
    // Весь остальной контент
  }
}
```

### Шаг 3: Обновить profile-translations.ts
```typescript
// /lib/profile-translations.ts
export const profileTranslations = {
  uk: { ... },
  pl: { ... },
  ru: { // ← Новый язык
    myProfile: 'Мой профиль',
    tokenBalance: 'Баланс ChefTokens',
    // ...
  }
}
```

### Шаг 4: Добавить кнопку переключения в UI
```tsx
<button onClick={() => setLanguage('ru')}>Русский</button>
```

---

## 📊 Статистика переводов

| Компонент | Строк | Языки | Назначение |
|-----------|-------|-------|-----------|
| **translations.ts** | 901 | pl, ua | Основные переводы (9 разделов) |
| **profile-translations.ts** | ~180 | uk, pl | Переводы профиля |
| **LanguageContext.tsx** | ~50 | - | Управление языком |
| **useProfileTranslations.ts** | ~20 | - | Хук доступа к переводам профиля |
| **Всего строк кода** | ~1100 | 2 языка | Полная двуязычная система |

---

## ⚙️ Технические детали

### Провайдер обёртывает всё приложение
```tsx
// /app/layout.tsx
<LanguageProvider>
  {children}
</LanguageProvider>
```

### Загрузка языка из localStorage
```typescript
useEffect(() => {
  const savedLanguage = localStorage.getItem('language') as Language;
  if (savedLanguage && (savedLanguage === 'pl' || savedLanguage === 'ua')) {
    setLanguageState(savedLanguage);
  }
}, []);
```

### Переключение языка с сохранением
```typescript
const setLanguage = (lang: Language) => {
  setLanguageState(lang);
  localStorage.setItem('language', lang);
};
```

---

## 🎯 Best Practices

✅ **Использование**:
```tsx
// ✅ ПРАВИЛЬНО - используйте хук
const { t } = useLanguage();
<h1>{t.hero.title}</h1>

// ✅ ПРАВИЛЬНО - для профиля
const { translations } = useProfileTranslations();
<div>{translations.myProfile}</div>
```

❌ **Не делайте**:
```tsx
// ❌ НЕПРАВИЛЬНО - импортировать translations напрямую
import { translations } from '@/lib/translations';
<h1>{translations.pl.hero.title}</h1> // Не меняется при смене языка!
```

---

## 🔗 Связанные файлы

- 📄 `/lib/translations.ts` - Основной файл переводов (901 строка)
- 📄 `/lib/profile-translations.ts` - Переводы профиля (~180 строк)
- 📄 `/contexts/LanguageContext.tsx` - Провайдер языка (~50 строк)
- 📄 `/hooks/useProfileTranslations.ts` - Хук профиля (~20 строк)
- 🖼️ `/components/LanguageSwitcher.tsx` - Кнопка смены языка

---

## 📞 Поддержка новых переводов

Для добавления нового языка нужно:
1. Перевести 901 строку в `translations.ts`
2. Перевести ~180 строк в `profile-translations.ts`
3. Обновить тип `Language`
4. Добавить кнопку переключения в UI
5. Всё! Остальное работает автоматически благодаря типизации

---

**Обновлено**: 15 ноября 2025 г.
**Версия архитектуры**: 2.0
**Статус**: ✅ Production Ready
