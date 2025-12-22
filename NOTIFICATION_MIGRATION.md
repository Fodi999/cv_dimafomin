# Unified Notification System - Migration Complete ✅

## Что было сделано

### 1. ✅ Создана архитектура единой системы уведомлений

**Файлы:**
- `lib/notifications/types.ts` - TypeScript типы
- `lib/notifications/catalog.ts` - Каталог текстов
- `contexts/NotificationContext.tsx` - Provider и хук
- `components/common/AIHintCard.tsx` - Универсальный компонент
- `NOTIFICATION_SYSTEM.md` - Документация

**Типы уведомлений:**
- **Toast** - короткие статусы (успех/ошибка), исчезают автоматически
- **Hint** - контентные подсказки на странице, не исчезают сами
- **Inline** - ошибки валидации форм (будущее)

### 2. ✅ Интеграция в приложение

**app/layout.tsx:**
```tsx
<NotificationProvider>
  {children}
  <Toaster richColors position="top-center" />
</NotificationProvider>
```

### 3. ✅ Миграция Assistant page

**Было (дублирование логики):**
```tsx
// ❌ Три разных способа показать уведомление
toast.error(...)
sonnerToast("...", { ... })
setMatchesError(message)

// ❌ Разные тексты в разных местах
"Nie znaleźliśmy przepisów"
"No recipes available"
"Dodaj więcej składników"
```

**Стало (единый интерфейс):**
```tsx
// ✅ Один способ для всех уведомлений
const notify = useNotify();

// Toast (auto-dismiss)
notify.success("Smacznego!", "Wykorzystano składniki");
notify.error("Błąd", "Nie udało się załadować");

// Hint (persistent, with actions)
notify.hint({
  kind: "hint",
  level: "info",
  title: "Nie znaleźliśmy przepisów",
  description: result.message,
  actions: [
    { label: "Dodaj produkty", onClick: () => router.push('/fridge') },
    { label: "Zamknij", onClick: () => notify.clearHint() }
  ]
});

// Show hint card in UI
{notify.currentHint && (
  <AIHintCard
    notice={notify.currentHint}
    onDismiss={() => notify.clearHint()}
  />
)}
```

### 4. ✅ Удалено дублирование

**Удалено:**
- ❌ `useToast()` hook (старый)
- ❌ `<ToastContainer>` (старый)
- ❌ `matchesError` state (дублировал hint)
- ❌ Inline Sonner toast с кастомными стилями
- ❌ Хардкоженные тексты в компонентах

**Добавлено:**
- ✅ Единый `useNotify()` hook
- ✅ Централизованный каталог текстов
- ✅ Универсальный `<AIHintCard>` компонент
- ✅ TypeScript контракты

## Преимущества новой системы

### 1. **Единый голос бота**
Все тексты в одном месте (`NoticeCatalog`):
```typescript
NO_RECIPES: {
  title: "Nie znaleźliśmy pasującego przepisu",
  description: "Dodaj kilka podstawowych składników...",
}
```

### 2. **Предсказуемость**
Одинаковая логика везде:
```typescript
// Backend возвращает requiresUserAction: true → hint (persistent)
// Backend возвращает requiresUserAction: false → toast (auto-close)
notify.fromApiResponse(result);
```

### 3. **Типобезопасность**
```typescript
type Notice = {
  kind: "toast" | "hint" | "inline";
  level: "success" | "info" | "warning" | "error";
  title: string;
  description?: string;
  actions?: NoticeAction[];
};
```

### 4. **Меньше кода**
- Было: ~150 строк дублированной логики в Assistant page
- Стало: ~15 строк с `useNotify()`

### 5. **Легко тестировать**
```typescript
const mockNotify = {
  success: jest.fn(),
  error: jest.fn(),
  hint: jest.fn(),
};
```

## Правила использования

### ✅ Когда использовать Toast:
- Успешное сохранение/удаление
- Ошибки сети/API
- Быстрые статусы действий

### ✅ Когда использовать Hint:
- "Нет данных" + подсказка что делать
- Требуется действие пользователя (requiresUserAction)
- Empty states с кнопками

### ❌ Не использовать:
- Toast для "нет данных"
- Hint для ошибок сети
- Кастомные Sonner toasts с инлайн-стилями

## API Examples

### Базовые уведомления
```typescript
const notify = useNotify();

// Toast
notify.success("Zapisano!");
notify.error("Błąd", "Sprawdź połączenie");
notify.warning("Uwaga", "Brak składników");
notify.info("Info", "Nowa wersja dostępna");

// Hint
notify.hint({
  kind: "hint",
  level: "info",
  title: "Twoja lodówka jest pusta",
  description: "Dodaj produkty aby zobaczyć przepisy",
  actions: [
    CommonActions.goToFridge(),
    CommonActions.dismiss(() => notify.clearHint())
  ]
});
```

### Использование каталога
```typescript
// Показать готовое уведомление из каталога
notify.showCatalogNotice("NO_RECIPES", {
  actions: [
    CommonActions.goToFridge(),
    CommonActions.goToSavedRecipes(),
  ]
});

// Кастомизировать текст
notify.showCatalogNotice("RECIPE_SAVED", {
  description: "Przepis dodany do ulubionych!"
});
```

### Обработка API ответов
```typescript
async function loadData() {
  try {
    const response = await api.getRecommendation();
    
    // Smart handler - автоматически решает toast vs hint
    notify.fromApiResponse(response, {
      onRetry: () => loadData(),
      onDismiss: () => notify.clearHint()
    });
    
  } catch (err) {
    notify.error("Błąd sieci", "Sprawdź połączenie");
  }
}
```

## Миграция других страниц

### Шаг 1: Заменить импорты
```typescript
// ❌ Старый способ
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/common/Toast";
import { toast as sonnerToast } from "sonner";

// ✅ Новый способ
import { useNotify } from "@/contexts/NotificationContext";
import { AIHintCard } from "@/components/common/AIHintCard";
import { CommonActions } from "@/lib/notifications/catalog";
```

### Шаг 2: Заменить хук
```typescript
// ❌ Старый способ
const toast = useToast();
toast.success("Zapisano", "Przepis dodany");

// ✅ Новый способ
const notify = useNotify();
notify.success("Zapisano", "Przepis dodany");
```

### Шаг 3: Заменить hint logic
```typescript
// ❌ Старый способ
const [errorState, setErrorState] = useState(null);
{errorState && <CustomErrorCard message={errorState} />}

// ✅ Новый способ
{notify.currentHint && (
  <AIHintCard
    notice={notify.currentHint}
    onDismiss={() => notify.clearHint()}
  />
)}
```

### Шаг 4: Удалить старые компоненты
```typescript
// ❌ Удалить из return
<ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
<Toaster richColors position="top-center" />

// ✅ Toaster уже в layout.tsx, ничего не нужно
```

## Next Steps

1. ✅ Migrate Assistant page (DONE)
2. ⏳ Migrate Fridge page
3. ⏳ Migrate Recipe pages
4. ⏳ Migrate Profile pages
5. ⏳ Add inline validation for forms
6. ⏳ Add analytics tracking for notifications

## Статистика

**До миграции:**
- 3 разных системы уведомлений
- ~200 строк дублированного кода
- Тексты хардкожены в 10+ местах
- Нет типобезопасности

**После миграции:**
- 1 единая система
- ~50 строк в NotificationContext
- Все тексты в NoticeCatalog
- Полная типобезопасность
- Легко тестировать

## Документация

См. `NOTIFICATION_SYSTEM.md` для полной документации и примеров использования.
