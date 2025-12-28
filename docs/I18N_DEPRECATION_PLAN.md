# i18n Legacy Files - Deprecation Plan

## 📋 Статус файлов

### ✅ Готовы к удалению

#### 1. ~~`lib/i18n-dictionary.ts`~~ ✅ УДАЛЁН
- **Статус**: ✅ УДАЛЁН (28.12.2025)
- **Причина**: Не использовался в коде

#### 2. ~~`lib/translations.ts`~~ ✅ УДАЛЁН
- **Статус**: ✅ УДАЛЁН (28.12.2025)
- **Миграция**: `LanguageSwitcher.tsx` → `lib/i18n/types.ts`

---

### ⚠️ Требуют миграции
- **Статус**: ⚠️ ИСПОЛЬЗУЕТСЯ (1 место)
- **Импорты**:
  - `hooks/useProfileTranslations.ts` - полноценное использование
- **Замена**: использовать `useLanguage()` и `t.profile.*`
- **План**:
  1. Найти компоненты, использующие `useProfileTranslations`
  2. Мигрировать на `useLanguage()`
  3. Удалить хук `useProfileTranslations`
  4. Удалить файл

#### 4. `hooks/useTranslations.ts`
- **Статус**: ⚠️ ИСПОЛЬЗУЕТСЯ (2 компонента)
- **Импорты**:
  - `components/assistant/AIActions.tsx`
  - `components/profile/settings/CoreSettingsSection.tsx`
- **Замена**: использовать `useLanguage()` из `LanguageContext`
- **План**:
  1. Мигрировать оба компонента
  2. Удалить хук

---

## 🎯 План миграции (поэтапный)

### Phase 1: Удаление неиспользуемого файла ✅
```bash
# Безопасно - нет зависимостей
rm lib/i18n-dictionary.ts
git add lib/i18n-dictionary.ts
git commit -m "chore: remove unused i18n-dictionary.ts"
```

### Phase 2: Миграция LanguageSwitcher
**Файл**: `components/LanguageSwitcher.tsx`

**Было**:
```tsx
import type { Language } from "@/lib/translations";
```

**Стало**:
```tsx
import type { Language } from "@/lib/i18n/types";
```

**После миграции**:
```bash
# Проверить, что нет других импортов
grep -r "from.*lib/translations" --include="*.ts" --include="*.tsx"

# Если чисто - удалить
rm lib/translations.ts
git add .
git commit -m "chore: migrate to new i18n types, remove legacy translations.ts"
```

### Phase 3: Миграция useProfileTranslations
**Файл**: `app/profile/[id]/page.tsx`

**Было**:
```tsx
const { t } = useProfileTranslations();
// t("profile.stats.recipes")
```

**Стало**:
```tsx
const { t } = useLanguage();
// t.profile.stats.recipes
```

**Действия**:
1. Найти все использования `useProfileTranslations`
2. Заменить на `useLanguage()`
3. Обновить синтаксис с `t("key")` на `t.domain.key`
4. Удалить `hooks/useProfileTranslations.ts`
5. Удалить `lib/profile-translations.ts`

**Команды**:
```bash
# Найти все использования
grep -r "useProfileTranslations" --include="*.tsx" --include="*.ts"

# После миграции
rm hooks/useProfileTranslations.ts
rm lib/profile-translations.ts
git add .
git commit -m "refactor: migrate from useProfileTranslations to useLanguage"
```

### Phase 4: Миграция useTranslations
**Файлы**:
- `components/assistant/AIActions.tsx`
- `components/profile/settings/CoreSettingsSection.tsx`

**Было**:
```tsx
import { useTranslations } from "@/hooks/useTranslations";
const { t } = useTranslations();
// t("common.save")
```

**Стало**:
```tsx
import { useLanguage } from "@/contexts/LanguageContext";
const { t } = useLanguage();
// t.common.save
```

**Действия**:
1. Обновить импорты
2. Изменить синтаксис ключей
3. Проверить типы
4. Удалить `hooks/useTranslations.ts`

**Команды**:
```bash
# Найти все использования
grep -r "useTranslations" --include="*.tsx" --include="*.ts" | grep -v "useProfileTranslations"

# После миграции
rm hooks/useTranslations.ts
git add .
git commit -m "refactor: migrate from useTranslations to useLanguage"
```

---

## 📊 Checklist миграции

- [x] **lib/i18n-dictionary.ts** ✅
  - [x] Проверить отсутствие импортов
  - [x] Удалить файл

- [x] **lib/translations.ts** ✅
  - [x] Обновить `LanguageSwitcher.tsx`
  - [x] Проверить отсутствие других импортов
  - [x] Удалить файл

- [ ] **lib/profile-translations.ts**
  - [ ] Найти все использования `useProfileTranslations`
  - [ ] Мигрировать компоненты
  - [ ] Удалить `hooks/useProfileTranslations.ts`
  - [ ] Удалить файл

- [ ] **hooks/useTranslations.ts**
  - [ ] Мигрировать `AIActions.tsx`
  - [ ] Мигрировать `CoreSettingsSection.tsx`
  - [ ] Проверить отсутствие других использований
  - [ ] Удалить файл

---

## 🔍 Команды для проверки

### Проверить импорты файла
```bash
# translations.ts
grep -r "from.*translations" --include="*.ts" --include="*.tsx" | grep -v "useTranslations"

# i18n-dictionary.ts
grep -r "from.*i18n-dictionary" --include="*.ts" --include="*.tsx"

# profile-translations.ts
grep -r "from.*profile-translations" --include="*.ts" --include="*.tsx"

# useTranslations
grep -r "useTranslations" --include="*.ts" --include="*.tsx" | grep -v "useProfileTranslations"

# useProfileTranslations
grep -r "useProfileTranslations" --include="*.ts" --include="*.tsx"
```

### Проверить, что нет TypeScript ошибок
```bash
npx tsc --noEmit
```

### Проверить coverage
```bash
npm run check:i18n
```

---

## ⚡ Быстрая миграция (одной командой)

После того, как все компоненты мигрированы, можно удалить всё сразу:

```bash
# Проверить, что нет импортов
grep -r "from.*translations\|from.*i18n-dictionary\|from.*profile-translations\|useTranslations\|useProfileTranslations" \
  --include="*.ts" --include="*.tsx" \
  --exclude-dir=node_modules --exclude-dir=.next

# Если вывод пустой - безопасно удалить
rm lib/i18n-dictionary.ts
rm lib/translations.ts
rm lib/profile-translations.ts
rm hooks/useTranslations.ts
rm hooks/useProfileTranslations.ts

# Коммит
git add .
git commit -m "chore: remove all legacy i18n files

- Removed i18n-dictionary.ts (unused)
- Removed translations.ts (migrated to i18n/types.ts)
- Removed profile-translations.ts (migrated to i18n/pl/profile.ts)
- Removed useTranslations hook (migrated to useLanguage)
- Removed useProfileTranslations hook (migrated to useLanguage)

All components now use unified i18n system with t.domain.key pattern"
```

---

## 📈 Метрики после завершения

**До миграции**:
- Legacy файлов: 5
- Legacy хуков: 2
- Паттернов доступа: 3 (`t("key")`, `translations.key`, `profileTranslations.key`)

**После миграции**:
- Legacy файлов: 0 ✅
- Legacy хуков: 0 ✅
- Паттернов доступа: 1 (`t.domain.key`) ✅

**Преимущества**:
- ✅ Единый паттерн во всём проекте
- ✅ Меньше файлов для поддержки
- ✅ Полная типизация
- ✅ Лучше autocomplete
- ✅ Проще onboarding новых разработчиков

---

## 🎓 Обучение команды

После удаления legacy файлов:

1. **Обновить README.md** - добавить секцию про новую i18n систему
2. **Провести code review** - показать новый паттерн
3. **Обновить шаблоны** - добавить примеры с `useLanguage()`
4. **Добавить в CI/CD** - проверку `npm run check:i18n`

---

*Последнее обновление: 28 декабря 2025*  
*Статус: 🟡 В процессе*  
*Прогресс: 2/5 файлов (40%)* ✅
