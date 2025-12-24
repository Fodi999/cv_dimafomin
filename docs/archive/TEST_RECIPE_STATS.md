# 🧪 Тестирование интеграции Recipe Stats

## Шаг 1: Проверить загрузку stats

### Открыть `/assistant` в браузере

В консоли браузера должно появиться:

```
📊 Recipe stats loaded: {
  totalRecipes: 428,
  byCategory: { breakfast: 120, lunch: 180, ... }
}
```

✅ **Если видишь это** - хук `useRecipeStats` работает корректно!

---

## Шаг 2: Проверить обогащение context

### Сценарий A: Пустая холодильник + клик "Pokaż przepisy"

**Ожидаемое поведение:**
1. Показывается `AIMessageCard`
2. В консоли должно быть:
   ```
   🔍 AI Response context: {
     code: "NO_RECIPES_FOR_FRIDGE" или "EMPTY_FRIDGE",
     context: {
       fridgeItems: 0,
       totalRecipes: 428  // ← ВАЖНО!
     },
     hasTotalRecipes: true,
     totalRecipes: 428
   }
   ```

**Текст на экране:**
```
🧊 Lodówka jest pusta

W katalogu dostępnych jest 428 przepisów.
Dodaj produkty do lodówki, aby AI mogło znaleźć idealne przepisy dla Ciebie.

[Dodaj produkty]  [Zobacz katalog (428)]
```

---

### Сценарий B: 5-10 продуктов в холодильнике, но нет совпадений

**Подготовка:**
1. Добавить 5-10 продуктов в холодильник (например, экзотические)
2. Кликнуть "Pokaż przepisy"

**Ожидаемое поведение:**
В консоли:
```
🔍 AI Response context: {
  code: "NO_RECIPES_FOR_FRIDGE",
  context: {
    fridgeItems: 9,
    matchedRecipes: 0,
    totalRecipes: 428  // ← ВАЖНО!
  },
  hasTotalRecipes: true,
  totalRecipes: 428
}
```

**Текст на экране:**
```
🔍 Nie znaleźliśmy pasujących przepisów

Masz 9 produktów w lodówce.
W katalogu dostępnych jest 428 przepisów,
ale żaden nie pasuje do aktualnych składników.

[Dodaj produkty do lodówki]  [Zobacz zapisane]  [Zobacz katalog (428)]
```

✅ **Это идеальный UX!** Пользователь понимает:
- Сколько у него продуктов (9)
- Сколько всего рецептов (428)
- Почему не нашлось совпадений
- Что делать дальше

---

### Сценарий C: Не залогинен

**Подготовка:**
1. Выйти из аккаунта (logout)
2. Открыть `/assistant`
3. Кликнуть "Pokaż przepisy"

**Ожидаемое поведение:**
```
⚠️ Wymagana autoryzacja

W katalogu dostępnych jest 428 przepisów.
Zaloguj się, aby korzystać z AI Asystenta i generować spersonalizowane przepisy.

[Zaloguj się]  [Przeglądaj katalog (428)]
```

---

## Шаг 3: Проверить ошибки TypeScript

```bash
cd /Users/dmitrijfomin/Desktop/cv-sushi_chef
npm run build
```

✅ Не должно быть ошибок компиляции

---

## 🐛 Что проверить если НЕ работает

### Проблема 1: В консоли нет "📊 Recipe stats loaded"

**Причина**: Хук не вызывается или API не отвечает

**Решение**:
1. Проверить `console.log` в начале `useRecipeStats`
2. Проверить Network tab: `GET /api/recipes/stats`
3. Проверить response: `{ success: true, data: { totalRecipes: 428 } }`

---

### Проблема 2: `hasTotalRecipes: false` в context

**Причина**: `stats` ещё не загрузились или `stats` = null

**Решение**:
Проверить в коде `AssistantPage`:
```tsx
context: { 
  totalRecipes: stats?.totalRecipes ?? 0  // ← должен быть ??
}
```

---

### Проблема 3: Текст не обновляется

**Причина**: Старый кэш или не перезагрузили страницу

**Решение**:
1. Hard Reload: `Cmd + Shift + R` (Mac) или `Ctrl + Shift + R` (Win)
2. Очистить localStorage: `localStorage.clear()`
3. Проверить `i18n/pl/ai.ts` - должны быть обновлённые тексты

---

## ✅ Критерии успеха

- [ ] В консоли: `📊 Recipe stats loaded: { totalRecipes: 428 }`
- [ ] В консоли: `🔍 AI Response context: { hasTotalRecipes: true, totalRecipes: 428 }`
- [ ] На экране: "W katalogu dostępnych jest 428 przepisów"
- [ ] Кнопка: "Zobacz katalog (428)"
- [ ] Нет ошибок TypeScript при `npm run build`

---

## 🎉 Когда всё работает

Пользователи увидят **контекстные, дружелюбные сообщения** вместо сухих ошибок:

### Было ❌
```
Nie znaleźliśmy przepisów
```

### Стало ✅
```
Masz 9 produktów w lodówce.
W katalogu jest 428 przepisów, ale żaden nie pasuje.
Dodaj więcej składników, aby odblokować przepisy!
```

**Это огромная разница в UX!** 🚀
