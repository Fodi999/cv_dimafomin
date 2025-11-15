# 📊 Структура локализации и переводов

## 🗂️ Архитектура файлов

```
cv-sushi_chef/
├── lib/
│   ├── translations.ts ⭐ (ГЛАВНЫЙ ФАЙЛ - 901 строка)
│   │   ├── Type: Language = 'pl' | 'ua'
│   │   └── translations = {
│   │       ├── pl: { ... } (Польский)
│   │       └── ua: { ... } (Украинский)
│   │
│   ├── profile-translations.ts (Профиль пользователя)
│   │   ├── Type: Language = 'uk' | 'pl'
│   │   └── profileTranslations = {
│   │       ├── uk: { ... }
│   │       └── pl: { ... }
│   │
│   ├── seo.ts (SEO метаданные)
│   │   └── language-specific metadata
│   │
│   └── constants.ts
│
├── contexts/
│   └── LanguageContext.tsx ⭐ (УПРАВЛЕНИЕ ЯЗЫКОМ)
│       ├── LanguageContextType {
│       │   ├── language: Language
│       │   ├── setLanguage: (lang) => void
│       │   └── t: translations[Language]
│       │
│       ├── LanguageProvider (провайдер)
│       └── useLanguage() (хук)
│
├── hooks/
│   └── useProfileTranslations.ts (Хук профиля)
│       └── returns { translations, language }
│
└── app/
    ├── academy/
    │   └── page.tsx (Использует useLanguage())
    │
    ├── (chat)/
    │   └── create-chat/
    │       └── page.tsx (использует useLanguage())
    │
    ├── profile/
    │   └── page.tsx (использует useProfileTranslations())
    │
    ├── market/
    │   └── page.tsx (использует useLanguage())
    │
    └── layout.tsx (обёрнут в LanguageProvider)
```

---

## 📝 Структура translations.ts (полная иерархия)

```typescript
export const translations = {
  // ЯЗЫК: ПОЛЬСКИЙ
  pl: {
    // 1️⃣ НАВИГАЦИЯ
    nav: {
      home, about, portfolio, skills, experience, contact,
      login, logout, search
    }

    // 2️⃣ ГЕРОЙ СЕКЦИЯ
    hero: {
      title, subtitle, tagline, description,
      ctaPrimary, ctaSecondary
    }

    // 3️⃣ О ПРОГРАММЕ
    about: {
      title, imageAlt, intro, name,
      paragraph1, paragraph2, paragraph3, quote
    }

    // 4️⃣ ПОРТФОЛИО
    portfolio: {
      title, subtitle, closeButton,
      items: [ '01. Signature Roll', '02. Premium Selection', ... ],
      descriptions: [ 'описание 1', 'описание 2', ... ]
    }

    // 5️⃣ НАВЫКИ
    skills: {
      title, subtitle, viewDetails, hideDetails,
      proficiencyLevel, competencyDetails,
      items: [
        { title: 'Nigiri & Sashimi', description: '...' },
        { title: 'Maki & Uramaki', description: '...' },
        ...
      ]
    }

    // 6️⃣ ОПЫТ (JOURNEY PATH)
    experience: {
      title, subtitle, journeyIntro, finalPath, pathSteps,
      ctaText, ctaButton,
      steps: [
        {
          number: '1',
          title: 'Зареєстуйтесь...',
          description: '...',
          bonus: '🎁 Бонус...',
          icon: 'user-plus'
        },
        ...
      ]
    }

    // 7️⃣ КОНТАКТЫ
    contact: {
      title, subtitle, formTitle, successMessage, responseTime,
      requestTypeLabel, requestTypePlaceholder,
      requestTypes: { learning, partnership, other },
      nameLabel, namePlaceholder,
      emailLabel, emailPlaceholder,
      messageLabel, messagePlaceholder,
      sendButton, sending,
      connectTitle, connectSubtitle,
      instagram, email, whatsapp, telegram,
      whatsappAction, telegramAction
    }

    // 8️⃣ ПОДВАЛ
    footer: {
      title, subtitle, copyright,
      madeWith, forPassion, keywords
    }

    // 9️⃣ АКАДЕМИЯ (DASHBOARD, КУРСЫ, СООБЩЕСТВО)
    academy: {
      dashboard: {
        title, subtitle, completedCourses, certificates,
        rating, totalHours, activeCourses, noActiveCourses,
        startLearning, enrollInCourse,
        level, xp, xpToNext, chefTokens, progress,
        myCertificates, issued, downloadPdf,
        aiRecommendations, aiSubtitle,
        viewCourse, viewRanking, goToMarketplace,
        allCertificates, loading, backToProfile,

        // Заработок токенов
        earnTokens: {
          title, subtitle,
          completeLessons, completeLessonsDesc,
          completeCourses, completeCoursesDesc,
          achievements, achievementsDesc,
          dailyBonus, dailyBonusDesc,
          referrals, referralsDesc,
          specialOffers, specialOffersDesc,
          sharePosts, sharePostsDesc,
          bonusTitle, bonusDesc,
          ctaTitle, ctaDesc,
          browseCourses, goToDashboard
        },

        // Кошелёк
        wallet: {
          title, balance, totalEarned, totalSpent,
          recentTransactions, noTransactions,
          earnedFor, spentOn, date, amount,
          infoNote,
          modal: {
            emptyMessage, hasTokensMessage,
            buyButton, earnButton,
            selectPackage, back, popular,
            paymentInfo, paymentMethods
          },
          type: { earned, spent },
          reasons: {
            courseCompletion, lessonComplete, achievement,
            dailyBonus, referral, coursePurchase,
            certificatePurchase, marketplace
          }
        }
      },

      // СООБЩЕСТВО
      community: {
        title, subtitle, createPost, createFirstPost,
        totalPosts, activeChefs, tokensEarned,
        searchPlaceholder, all, trending, following,
        noPosts,

        // Форма создания поста
        photoLabel, clickToUpload,
        titleLabel, titlePlaceholder, titleRequired,
        imageRequired, descriptionLabel, descriptionPlaceholder,
        difficultyLabel, beginner, intermediate, advanced,
        timeLabel, servingsLabel,
        ingredientsLabel, ingredientsRequired, ingredient, addIngredient,
        stepsLabel, stepsRequired, step, addStep,
        earnTokensInfo, earnTokensDesc,
        cancel, publish, publishing,

        // Карточка поста
        ingredients, steps, showMore, showLess,
        comments, addComment, noComments
      },

      // РЕЙТИНГ
      leaderboard: {
        title, subtitle
      },

      // СЕРТИФИКАТЫ
      certificates: {
        title, subtitle
      },

      // ПРОФИЛЬ
      profile: {
        title, subtitle, edit, save, cancel, saving,
        name, email, phone, location, bio, bioPlaceholder,
        noBio, role, learningHistory, socialMedia,
        notProvided, fillIn, profileUpdated,
        uploadSuccess, uploadError,
        inProgress, completed
      }
    },

    // 🔟 МАРКЕТПЛЕЙС
    market: {
      title, subtitle, search,
      difficulty: { all, beginner, intermediate, advanced },
      sort: { popular, newest, priceLow, priceHigh, rating },
      recipe: {
        buy, purchased, students,
        about, whatYouLearn, instructor
      }
    },

    // 1️⃣1️⃣ АВТОРИЗАЦИЯ
    auth: {
      loginTitle, loginSubtitle, registerTitle, registerSubtitle,
      loginTab, registerTab, email, emailPlaceholder,
      password, confirmPassword, name, namePlaceholder,
      rememberMe, forgotPassword,
      loginButton, registerButton, loading,
      passwordMismatch, noAccount, registerNow,
      haveAccount, loginNow
    }
  },

  // ЯЗЫК: УКРАИНСКИЙ
  ua: {
    // Полная структура как в 'pl', но на украинском языке
    nav: { ... },
    hero: { ... },
    about: { ... },
    portfolio: { ... },
    skills: { ... },
    experience: { ... },
    contact: { ... },
    footer: { ... },
    academy: { ... },
    market: { ... },
    auth: { ... }
  }
}
```

---

## 🔄 Структура profile-translations.ts

```typescript
export const profileTranslations = {
  uk: {
    myProfile, publications, followers, following,
    tokenBalance, tokens, earn, buy, refresh,
    startEarning, startEarningDesc,
    initializing, walletAvailable,
    transactionHistory, bonus,
    editProfile, toChat, toHome, logout,
    created, saved, courses,
    noPostsYet, noSavedYet, noCourses,
    name, aboutMe, location, phone, socialMedia,
    saveChanges, cancel, saving, loading
  },
  pl: {
    // Полная структура как в 'uk', но на польском языке
    ...
  }
}
```

---

## 🎯 Как использовать

### 1️⃣ На странице (использование useLanguage)
```tsx
'use client';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Page() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      <h1>{t.hero.title}</h1> {/* Автоматически на текущем языке */}
      <button onClick={() => setLanguage('ua')}>Українська</button>
      <button onClick={() => setLanguage('pl')}>Polski</button>
    </>
  );
}
```

### 2️⃣ На странице профиля (использование useProfileTranslations)
```tsx
import { useProfileTranslations } from '@/hooks/useProfileTranslations';

export default function ProfilePage() {
  const { translations, language } = useProfileTranslations();

  return <h1>{translations.myProfile}</h1>;
}
```

### 3️⃣ Вложенный доступ
```tsx
// Простой доступ
const heroTitle = t.hero.title;
const skillsItems = t.academy.dashboard.earnTokens.title;

// Динамический доступ
const menuItem = t.nav[key]; // key: 'home' | 'about' | ...
const academySection = t.academy.dashboard.wallet.type.earned;
```

---

## 📊 Статистика

| Файл | Строк | Языки | Главная роль |
|------|-------|-------|-------------|
| **translations.ts** | 901 | pl, ua | Основные переводы всего приложения |
| **profile-translations.ts** | ~180 | uk, pl | Переводы для профиля пользователя |
| **LanguageContext.tsx** | ~50 | - | Управление текущим языком + localStorage |
| **useProfileTranslations.ts** | ~20 | - | Хук для доступа к переводам профиля |

---

## 🔧 Технические детали

### Типы
```typescript
export type Language = 'pl' | 'ua';
export type Translations = typeof translations[Language];
export type TranslationKey = keyof typeof profileTranslations.uk;
```

### Хранилище
- **localStorage**: ключ `'language'` хранит выбранный язык
- **useState**: текущее состояние языка в LanguageContext

### Провайдер
- Обёртывает всё приложение в `layout.tsx`
- Загружает язык из localStorage при первой загрузке
- Обновляет localStorage при изменении языка

---

## 🎨 Иерархия разделов (9 основных)

1. **nav** - Навигация меню
2. **hero** - Герой секция (заголовок, описание)
3. **about** - Информация о программе
4. **portfolio** - Портфолио (18 проектов)
5. **skills** - Навыки/умения (9 курсов)
6. **experience** - Путь обучения (6 шагов)
7. **contact** - Контактная форма + социальные сети
8. **footer** - Подвал сайта
9. **academy** - Полная система обучения (dashboard, community, wallet, etc.)
10. **market** - Маркетплейс рецептов
11. **auth** - Авторизация

---

## 📌 Ключевые отличия польский vs украинский

| Раздел | Польский (pl) | Украинский (ua) |
|--------|--------------|-----------------|
| nav.home | 'Główna' | 'Головна' |
| hero.title | 'Sztuka Sushi od Podstaw...' | 'Мистецтво Суші з Нуля...' |
| auth.loginButton | 'Zaloguj się' | 'Увійти' |
| academy.wallet.title | 'Portfel ChefTokens' | 'Гаманець ChefTokens' |

---

## 🚀 Как добавить новый язык

1. Добавить тип в `Language`:
   ```typescript
   export type Language = 'pl' | 'ua' | 'ru'; // ← Добавить 'ru'
   ```

2. Добавить объект переводов в `translations`:
   ```typescript
   export const translations = {
     pl: { ... },
     ua: { ... },
     ru: { ... } // ← Новый язык
   }
   ```

3. Обновить хук `useLanguage()` если нужно

4. Добавить кнопку переключения на UI

---

## ⚙️ Где используется

- ✅ `/app/layout.tsx` - обёртка LanguageProvider
- ✅ `/app/academy/page.tsx` - страница академии
- ✅ `/app/(chat)/create-chat/page.tsx` - чат
- ✅ `/app/profile/page.tsx` - профиль
- ✅ `/app/market/page.tsx` - маркетплейс
- ✅ Все компоненты используют `useLanguage()` или `useProfileTranslations()`
