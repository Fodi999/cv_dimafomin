# i18n System Documentation

## 📚 Обзор

Система интернационализации проекта построена на industry-standard паттернах с автоматической проверкой покрытия, AI-translations layer и dev-warnings.

## 🏗️ Архитектура

```
i18n/
├── pl/          # Polish (reference language)
│   ├── common.ts
│   ├── navigation.ts
│   ├── academy.ts
│   ├── auth.ts
│   ├── profile.ts
│   ├── recipes.ts
│   ├── tokens.ts
│   ├── admin.ts
│   ├── errors.ts
│   └── market.ts
├── en/          # English
└── ru/          # Russian

lib/i18n/
├── dictionaries/    # Aggregation layer
│   ├── pl.ts
│   ├── en.ts
│   └── ru.ts
├── getDictionary.ts    # Lazy loading
├── types.ts            # TypeScript types
└── ai-translations.ts  # AI-generated tracking

scripts/
└── check-i18n-coverage.ts  # Coverage checker

components/dev/
└── I18nDevWarning.tsx      # Dev-time warnings
```

## 🚀 Использование

### 1. Базовое использование

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

export default function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t.academy.hero.title}</h1>
      <p>{t.academy.hero.subtitle}</p>
      <button>{t.common.save}</button>
    </div>
  );
}
```

### 2. TypeScript Autocomplete

Система полностью типизирована:

```tsx
// ✅ Правильно - TypeScript подскажет все ключи
t.academy.hero.title

// ❌ Ошибка компиляции - несуществующий ключ
t.academy.hero.nonExistent
```

### 3. Добавление новых переводов

**Шаг 1**: Добавить в Polish (reference language)

```ts
// i18n/pl/common.ts
export const common = {
  save: "Zapisz",
  cancel: "Anuluj",
  newKey: "Nowy klucz",  // 👈 Новый ключ
} as const;
```

**Шаг 2**: Добавить в English

```ts
// i18n/en/common.ts
export const common = {
  save: "Save",
  cancel: "Cancel",
  newKey: "New key",  // 👈 Новый ключ
} as const;
```

**Шаг 3**: Добавить в Russian

```ts
// i18n/ru/common.ts
export const common = {
  save: "Сохранить",
  cancel: "Отмена",
  newKey: "Новый ключ",  // 👈 Новый ключ
} as const;
```

**Шаг 4**: Проверить покрытие

```bash
npm run check:i18n
```

## 🤖 AI-Translations Layer

### Использование AI для переводов

```ts
// lib/i18n/ai-translations.ts

export const aiTranslations = {
  en: {
    academy: {
      hero: {
        // Помечаем AI-generated переводы
        badge: "[AI] Platform for culinary learning",
      },
    },
  },
  
  ru: {
    academy: {
      hero: {
        badge: "[AI] Платформа для кулинарного обучения",
      },
    },
  },
};
```

### Глоссарий терминов

```ts
aiTranslations.glossary = {
  en: {
    'ChefTokens': 'ChefTokens',  // Не переводится
    'recipe': 'recipe',
    'sushi': 'sushi',
  },
  ru: {
    'ChefTokens': 'ChefTokens',  // Не переводится
    'recipe': 'рецепт',
    'sushi': 'суши',
  },
};
```

## 🔍 Coverage Checker

### Запуск проверки

```bash
# Одноразовая проверка
npm run check:i18n

# Watch mode (автоперезапуск при изменениях)
npm run check:i18n:watch
```

### Типы проблем

1. **Missing Keys** ❌
   - Ключ есть в `pl`, но отсутствует в `en` или `ru`
   - Блокирует сборку

2. **Extra Keys** ⚠️
   - Ключ есть в `en`/`ru`, но отсутствует в `pl`
   - Warning (не блокирует)

3. **AI-Generated** 🤖
   - Перевод помечен маркером `[AI]`, `[TODO]`, `[TRANSLATE]`
   - Требует ревью

4. **Empty Values** 🚫
   - Пустая строка или `...`
   - Блокирует сборку

### Пример отчёта

```
🔍 Checking i18n coverage...

  Checking domain: common
  Checking domain: navigation
  Checking domain: academy

📊 Coverage Report:
──────────────────────────────────────────────────────
Total keys: 247
Missing keys: 0
Extra keys: 0
AI-generated: 5
Empty values: 0

🤖 AI-Generated (needs review):
  en/academy: hero.badge
  en/academy: hero.subtitle
  ru/academy: hero.badge
  ru/academy: hero.subtitle
  ru/recipes: filters.difficulty

──────────────────────────────────────────────────────
⚠️  Coverage check passed with warnings.
```

## 🎨 Dev Warnings

В development mode автоматически показываются предупреждения о проблемах с переводами.

### Добавление в layout

```tsx
// app/layout.tsx
import { I18nDevWarning } from '@/components/dev/I18nDevWarning';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <I18nDevWarning />  {/* 👈 Добавить сюда */}
      </body>
    </html>
  );
}
```

### Использование HOC

```tsx
import { withI18nWarnings } from '@/components/dev/I18nDevWarning';

function MyComponent() {
  return <div>Content</div>;
}

export default withI18nWarnings(MyComponent);
```

## 📋 Чеклист для переводов

### Перед добавлением нового ключа

- [ ] Ключ добавлен в `pl` (reference language)
- [ ] Ключ добавлен в `en`
- [ ] Ключ добавлен в `ru`
- [ ] Проверено `npm run check:i18n`
- [ ] TypeScript компилируется без ошибок
- [ ] Значения не содержат AI-маркеров
- [ ] Значения не пустые

### Перед удалением ключа

- [ ] Ключ удалён из всех языков (pl, en, ru)
- [ ] Компоненты не используют этот ключ (проверить grep)
- [ ] `npm run check:i18n` проходит успешно
- [ ] TypeScript компилируется без ошибок

### Перед коммитом

```bash
# 1. Проверить покрытие
npm run check:i18n

# 2. Проверить типы
npx tsc --noEmit

# 3. Запустить линтер
npm run lint

# 4. Проверить в браузере
npm run dev
```

## 🔧 CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/i18n-check.yml
name: i18n Coverage Check

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run check:i18n
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
npm run check:i18n || {
  echo "❌ i18n coverage check failed!"
  echo "Run 'npm run check:i18n' to see details"
  exit 1
}
```

## 🐛 Troubleshooting

### Ошибка: "Missing keys"

**Проблема**: Ключ есть в `pl`, но отсутствует в `en` или `ru`.

**Решение**:
1. Найти ключ в польском файле
2. Добавить перевод в английский файл
3. Добавить перевод в русский файл
4. Запустить `npm run check:i18n`

### Ошибка: "Type 'Dictionary' has no property 'X'"

**Проблема**: TypeScript не видит новый ключ.

**Решение**:
1. Проверить, что ключ добавлен в `i18n/pl/domain.ts`
2. Перезапустить TypeScript сервер (VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server")
3. Проверить, что используется правильный путь (`t.domain.key`)

### Warning: "AI-generated translation"

**Проблема**: Перевод помечен как AI-generated.

**Решение**:
1. Проверить перевод с native speaker
2. Убрать маркер `[AI]` / `[TODO]` / `[TRANSLATE]`
3. Запустить `npm run check:i18n`

## 📖 Best Practices

### 1. Структура ключей

```ts
// ✅ Хорошо: иерархическая структура
t.academy.hero.title
t.academy.hero.subtitle
t.academy.about.projectTitle

// ❌ Плохо: плоская структура
t.academyHeroTitle
t.academyHeroSubtitle
```

### 2. Именование

```ts
// ✅ Хорошо: описательные имена
t.auth.login.submitButton
t.recipes.filters.difficulty

// ❌ Плохо: сокращения и неясные имена
t.auth.btn1
t.rec.flt
```

### 3. Значения

```ts
// ✅ Хорошо: полные фразы
"Click here to start learning"

// ❌ Плохо: HTML/JSX в переводах
"Click <a href='/learn'>here</a> to start"

// ✅ Хорошо: параметризация вне переводов
const link = <a href="/learn">{t.common.clickHere}</a>;
```

### 4. Консистентность

Используйте глоссарий из `ai-translations.ts`:

```ts
// ✅ Хорошо: консистентные термины
"AI Mentor"  // везде одинаково
"ChefTokens" // везде одинаково

// ❌ Плохо: разные варианты
"AI Mentor" / "AI-Mentor" / "Ai Mentor"
"ChefTokens" / "Chef Tokens" / "chef tokens"
```

## 🎯 Roadmap

- [x] Базовая структура i18n
- [x] TypeScript типизация
- [x] Lazy loading
- [x] Coverage checker
- [x] AI-translations layer
- [x] Dev warnings
- [ ] Pre-commit hooks
- [ ] CI/CD integration
- [ ] Translation memory
- [ ] Context-aware translations
- [ ] Pluralization support
- [ ] Date/time formatting
- [ ] Number formatting

## 📞 Support

Вопросы? Проблемы?
- Проверьте [Troubleshooting](#-troubleshooting)
- Запустите `npm run check:i18n` для диагностики
- Проверьте TypeScript ошибки: `npx tsc --noEmit`
