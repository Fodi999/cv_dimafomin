# ✅ Локализация + Backend-only AI Text

## 📅 Дата: 17.01.2026

## 🎯 Проблемы, которые были решены

### 1️⃣ Жёсткая локализация на PL
**Было**: Все тексты хардкодом на польском
**Стало**: Динамическая локализация через `useLanguage()` context

### 2️⃣ Frontend генерировал AI текст
**Было**: "masz 0 składników w lodówce (100% pokrycia)"
**Стало**: Backend передаёт `ai.title` и `ai.reason`, frontend только отображает

---

## ✅ Что было сделано

### 1. Создано 3 файла переводов

#### `i18n/pl/assistant.ts`
```typescript
export const assistant = {
  title: "AI Asystent Kuchenny",
  description: "Inteligentne rekomendacje na podstawie twojej lodówki",
  recommendation: "Rekomendacja AI",
  // ... 20+ ключей
}
```

#### `i18n/ru/assistant.ts`
```typescript
export const assistant = {
  title: "AI Кухонный ассистент",
  description: "Интеллектуальные рекомендации на основе вашего холодильника",
  // ...
}
```

#### `i18n/en/assistant.ts`
```typescript
export const assistant = {
  title: "AI Kitchen Assistant",
  description: "Intelligent recommendations based on your fridge contents",
  // ...
}
```

### 2. Обновлены словари

- ✅ `lib/i18n/dictionaries/pl.ts` - добавлен import `assistant`
- ✅ `lib/i18n/dictionaries/ru.ts` - добавлен import `assistant`
- ✅ `lib/i18n/dictionaries/en.ts` - добавлен import `assistant`
- ✅ `lib/i18n/types.ts` - добавлен `assistant` в тип `Dictionary`

### 3. Обновлена страница assistant

**Файл**: `app/(user)/assistant/page.tsx`

#### Добавлено:
```typescript
import { useLanguage } from "@/contexts/LanguageContext";

const { t } = useLanguage();
```

#### Заменено:

| Было (хардкод PL) | Стало (динамика) |
|-------------------|------------------|
| `"AI Asystent Kuchenny"` | `t.assistant.title` |
| `"Inteligentne rekomendacje..."` | `t.assistant.description` |
| `"Co chcesz zrobić?"` | `t.assistant.questionTitle` |
| `"Wymagana autoryzacja"` | `t.assistant.authRequired` |
| `"AI analizuje..."` | `t.assistant.loading` |

### 4. Убран frontend AI text из AIRecommendationCard

**Файл**: `components/assistant/AIRecommendationCard.tsx`

#### ❌ Удалена секция "DLACZEGO TEN PRZEPIS?" (строки 350-373):

```typescript
// ❌ БЫЛО:
<p>
  Ten przepis został zaproponowany, ponieważ:
  • masz {recipe.usedIngredients.length} składników w lodówce
  ({Math.round(recipe.coverage * 100)}% pokrycia)
  • możesz ugotować od razu
</p>

// ✅ СТАЛО:
// Эта секция полностью удалена
// Backend отправляет ai.title и ai.reason
// Frontend отображает их в parent component (page.tsx)
```

---

## 📊 Разделение ответственности (ПРАВИЛЬНОЕ)

| Слой | Отвечает за | Пример |
|------|-------------|--------|
| **Backend** | `matchRatio`, `confidence`, `scenario` | `"coverage": 0.95` |
| **AI (Backend)** | `title`, `reason`, `tip`, `ingredientsUsed` | `"У вас все ингредиенты для борща"` |
| **Frontend** | Только отображение | `<p>{data.ai.reason}</p>` |

### ❌ НЕ ПРАВИЛЬНО (было раньше):

```typescript
// Frontend сам формулировал текст
<p>
  masz {usedCount} składników ({coverage}% pokrycia)
</p>
```

### ✅ ПРАВИЛЬНО (сейчас):

```typescript
// Frontend просто отображает данные от backend
<p>{data.ai.title}</p>
<p>{data.ai.reason}</p>
```

---

## 🎨 UX Изменения

### Страница /assistant

#### Секция "Question":
- ✅ Динамический заголовок (`t.assistant.questionTitle`)
- ✅ Динамическое описание (`t.assistant.questionDescription`)

#### Loading state:
- ✅ Локализованный текст (`t.assistant.loading`)

#### Auth Required:
- ✅ Локализованные тексты (`t.assistant.authRequired`, `t.assistant.loginButton`)

#### AI Context:
- ✅ Показывается `data.ai.title` (от backend)
- ✅ Показывается `data.ai.reason` (от backend)
- ✅ Показывается `data.ai.tip` если есть (от backend)

#### Ingredients from fridge:
- ✅ Заголовок локализован (`t.assistant.ingredientsFromFridge`)
- ✅ Список ингредиентов из `data.ai.ingredientsUsed` (от backend)

---

## 🧪 Как проверить

### 1. Проверить локализацию

```bash
npm run dev
```

Переключить язык в UI:
- 🇵🇱 PL → "AI Asystent Kuchenny"
- 🇷🇺 RU → "AI Кухонный ассистент"
- 🇬🇧 EN → "AI Kitchen Assistant"

### 2. Проверить AI текст

Открыть `/assistant`:
- ✅ Должен показаться блок с `ai.title` и `ai.reason`
- ✅ НЕ должно быть "masz X składników w lodówce (Y% pokrycia)"
- ✅ Текст должен быть от backend, а не сгенерирован frontend

### 3. Проверить Network

DevTools → Network → `/api/ai-recipe/recommendation`:

```json
{
  "data": {
    "ai": {
      "title": "Идеальное блюдо для сегодня!",
      "reason": "У вас есть все необходимые ингредиенты...",
      "ingredientsUsed": ["яйца", "мука", "молоко"]
    }
  }
}
```

---

## 📝 Переводы assistant

### Ключи (20+):

| Ключ | PL | RU | EN |
|------|----|----|-----|
| `title` | AI Asystent Kuchenny | AI Кухонный ассистент | AI Kitchen Assistant |
| `description` | Inteligentne rekomendacje... | Интеллектуальные рекомендации... | Intelligent recommendations... |
| `questionTitle` | Co chcesz zrobić? | Что вы хотите сделать? | What would you like to do? |
| `loading` | AI analizuje... | AI анализирует... | AI is analyzing... |
| `canCookNow` | Gotuj teraz | Готовить сейчас | Cook now |
| `almostReady` | Zobacz czego brakuje | Посмотреть чего не хватает | See what's missing |
| `ingredientsFromFridge` | Składniki z twojej lodówki | Ингредиенты из холодильника | Ingredients from your fridge |

---

## 🚀 Результат

### До:
- ❌ Тексты хардкодом на PL
- ❌ Frontend генерировал AI текст ("masz X składników...")
- ❌ Дублирование логики (backend считает → frontend пересчитывает)

### После:
- ✅ Динамическая локализация (PL/RU/EN)
- ✅ AI текст ТОЛЬКО от backend
- ✅ Frontend только отображает
- ✅ Чистая архитектура (разделение ответственности)

---

## 📚 Изменённые файлы

1. ✅ `i18n/pl/assistant.ts` - создан
2. ✅ `i18n/ru/assistant.ts` - создан
3. ✅ `i18n/en/assistant.ts` - создан
4. ✅ `lib/i18n/dictionaries/pl.ts` - обновлён
5. ✅ `lib/i18n/dictionaries/ru.ts` - обновлён
6. ✅ `lib/i18n/dictionaries/en.ts` - обновлён
7. ✅ `lib/i18n/types.ts` - обновлён
8. ✅ `app/(user)/assistant/page.tsx` - локализован
9. ✅ `components/assistant/AIRecommendationCard.tsx` - убран frontend AI text

---

**Дата**: 17.01.2026  
**Статус**: ✅ Завершено  
**Тестирование**: Требуется проверка на 3 языках
