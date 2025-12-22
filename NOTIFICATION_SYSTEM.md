# Unified Notification System

## Архитектура

Единая система уведомлений с тремя типами:

1. **Toast** - короткие статусы (успех/ошибка), исчезают автоматически
2. **Hint** - контентные подсказки на странице, не исчезают сами
3. **Inline** - ошибки валидации форм (будущее)

## Использование

### 1. Базовые уведомления

```typescript
import { useNotify } from "@/contexts/NotificationContext";

function MyComponent() {
  const notify = useNotify();

  // Toast notifications (auto-dismiss)
  notify.success("Zapisano!", "Przepis został dodany");
  notify.error("Błąd", "Nie udało się zapisać");
  notify.warning("Uwaga", "Sprawdź połączenie");
  notify.info("Info", "Nowa wersja dostępna");

  // Hint notification (persistent, in-page)
  notify.hint({
    kind: "hint",
    level: "info",
    title: "Twoja lodówka jest pusta",
    description: "Dodaj produkty aby zobaczyć przepisy",
    actions: [
      {
        label: "Dodaj produkty",
        onClick: () => router.push('/fridge'),
        variant: "primary"
      },
      {
        label: "Zamknij",
        onClick: () => notify.clearHint(),
        variant: "ghost"
      }
    ]
  });
}
```

### 2. Używanie каталога текстов

```typescript
import { useNotify } from "@/contexts/NotificationContext";
import { CommonActions } from "@/lib/notifications/catalog";

function RecipePage() {
  const notify = useNotify();
  const router = useRouter();

  // Show predefined notice from catalog
  notify.showCatalogNotice("NO_RECIPES", {
    actions: [
      CommonActions.goToFridge(),
      CommonActions.goToSavedRecipes(),
      CommonActions.dismiss(() => notify.clearHint())
    ]
  });

  // Or customize
  notify.showCatalogNotice("RECIPE_SAVED");
}
```

### 3. Обработка API ответов

```typescript
import { useNotify } from "@/contexts/NotificationContext";

async function loadRecipes() {
  const notify = useNotify();
  
  try {
    const response = await recipeMatchingApi.getRecommendation(...);
    
    // Smart handler - decides toast vs hint automatically
    notify.fromApiResponse(response, {
      onRetry: () => loadRecipes(),
      onDismiss: () => notify.clearHint()
    });
    
  } catch (err) {
    notify.error("Błąd sieci", "Sprawdź połączenie");
  }
}
```

### 4. Показ Hint на странице

```typescript
import { useNotify } from "@/contexts/NotificationContext";
import { AIHintCard } from "@/components/common/AIHintCard";

function AssistantPage() {
  const notify = useNotify();

  return (
    <div>
      {/* Show current hint if exists */}
      {notify.currentHint && (
        <AIHintCard
          notice={notify.currentHint}
          onDismiss={() => notify.clearHint()}
        />
      )}
      
      {/* Rest of page content */}
    </div>
  );
}
```

## Правила использования

### Когда использовать Toast:
- ✅ Успешное сохранение/удаление
- ✅ Ошибки сети/API
- ✅ Быстрые статусы действий
- ❌ Не для "нет данных"
- ❌ Не для валидации форм

### Когда использовать Hint:
- ✅ "Нет данных" + подсказка что делать
- ✅ Требуется действие пользователя (requiresUserAction)
- ✅ Empty states с кнопками
- ❌ Не для ошибок сети
- ❌ Не для успешных операций

## Catalog Codes

```typescript
// Recipe states
"NO_RECIPES" - нет рецептов (hint)
"NO_RECIPES_EMPTY_FRIDGE" - пустая lodówka (hint)
"NO_RECIPES_ALL_VIEWED" - все просмотрены (hint)

// Success states
"RECIPE_SAVED" - рецепт сохранен (toast)
"RECIPE_COOKED" - рецепт приготовлен (toast)
"FRIDGE_UPDATED" - lodówka обновлена (toast)

// Errors
"FETCH_FAILED" - ошибка загрузки (toast)
"NETWORK_ERROR" - нет сети (toast)
"AUTH_REQUIRED" - нужна авторизация (toast)
```

## API Response Contract

Backend должен возвращать:

```typescript
{
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  requiresUserAction?: boolean; // ← KEY: hint vs toast
  statusCode?: number;
}
```

**Правило:**
- `requiresUserAction: true` → **Hint** (persistent)
- `requiresUserAction: false` или отсутствует → **Toast** (auto-dismiss)

## Migration Guide

### Before (old code):
```typescript
// ❌ Duplicate logic
setMatchesError(result.message);
toast.error(result.message);

sonnerToast("Title", {
  description: result.message,
  action: { ... },
  cancel: { ... }
});
```

### After (unified):
```typescript
// ✅ Single source of truth
notify.fromApiResponse(result, {
  onDismiss: () => notify.clearHint()
});

// Or explicit:
notify.showCatalogNotice("NO_RECIPES", {
  actions: [
    CommonActions.goToFridge(),
    CommonActions.dismiss(() => notify.clearHint())
  ]
});
```

## Benefits

1. **Единый голос** - все тексты в одном месте (catalog)
2. **Предсказуемость** - одинаковая логика везде
3. **Типобезопасность** - TypeScript контракты
4. **Тестируемость** - легко мокать useNotify()
5. **Масштабируемость** - добавить новый тип легко

## Next Steps

1. ✅ Add NotificationProvider to layout
2. ✅ Migrate Assistant page
3. ⏳ Migrate Fridge page
4. ⏳ Migrate Recipe pages
5. ⏳ Add inline validation for forms
