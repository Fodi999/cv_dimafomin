# 🍽️ CreateDishFromRecipe — Новый компонент для создания блюд

## 📋 Обзор

**CreateDishFromRecipe** — это новый компонент для создания карточки блюда на основе готового рецепта, с управлением маржой/ценой и AI-описанием.

**Основная трансформация:**

```
Recipe UI (ингредиенты + текст)
  ↓
Dish UI (себестоимость + маржа + цена)
```

---

## 🎯 Ключевые отличия от CreateRecipeWithAI

### ❌ Что убрано

| Элемент | Причина |
|---------|---------|
| **IngredientAutocomplete** | Dish создаётся ИЗ рецепта, ингредиенты уже зафиксированы |
| **WeightInput** | Изменение ингредиентов не нужно |
| **rawCookingText / Textarea** | Технология приготовления из рецепта |
| **Steps generation** | AI генерирует steps при создании рецепта, не блюда |
| **validateForm для ингредиентов** | Заменено валидацией финансов |

### ✅ Что осталось (UX pipeline)

| Компонент | Статус |
|-----------|--------|
| **Card / CardHeader / CardContent** | ✅ Сохранен |
| **Mode система** | ✅ edit → preview → saving |
| **Image preview** | ✅ Сохранен |
| **Toast notifications** | ✅ Сохранена |
| **Loader2 / Loading states** | ✅ Сохранены |
| **Preview → Confirm → Save flow** | ✅ Сохранен |

### 🆕 Что добавлено (финансовая логика)

```typescript
// Входной параметр
interface CreateDishFromRecipeProps {
  recipeId: string; // Обязательно
}

// Финансовое состояние
const [cost, setCost] = useState<number>(0);       // От backend
const [margin, setMargin] = useState<number>(30);  // % (10–100)
const [price, setPrice] = useState<number>(0);     // Auto-calculated
```

---

## 🔄 Жизненный цикл (Lifecycle)

### Этап 1: Загрузка рецепта + себестоимость

```typescript
useEffect(() => {
  async function loadRecipeContext() {
    // 1. Загружаем рецепт: GET /api/admin/recipes/{recipeId}
    const recipeRes = await fetch(`/api/admin/recipes/${recipeId}`);
    const recipe = await recipeRes.json();
    
    setRecipeTitle(recipe.data.title);
    setImagePreview(recipe.data.imageUrl);
    
    // 2. Считаем себестоимость: GET /api/admin/dishes/calculate-cost?recipeId={id}
    const costRes = await fetch(
      `/api/admin/dishes/calculate-cost?recipeId=${recipeId}`
    );
    const costData = await costRes.json();
    
    setCost(costData.cost); // Зафиксирована, не меняется
  }
  
  loadRecipeContext();
}, [recipeId]);
```

**Важно:** 
- `cost` считается **только один раз** на основе текущего состояния холодильника
- `cost` **не меняется** при изменении маржи
- Frontend **ничего не считает сам**, только отображает

### Этап 2: Пользователь редактирует параметры

```typescript
// Пользователь меняет ТОЛЬКО маржу
const [margin, setMargin] = useState<number>(30);

// Цена автоматически пересчитывается
useEffect(() => {
  if (cost > 0 && margin > 0) {
    const calculated = cost / (1 - margin / 100);
    setPrice(Number(calculated.toFixed(2)));
  }
}, [cost, margin]);
```

**Формула:**
$$\text{Price} = \frac{\text{Cost}}{1 - \frac{\text{Margin}}{100}}$$

**Пример:**
- Cost = 10 PLN
- Margin = 30%
- Price = 10 ÷ (1 - 0.3) = 10 ÷ 0.7 = **14.29 PLN**

### Этап 3: Preview с AI

```typescript
const handlePreview = async () => {
  const res = await fetch("/api/admin/dishes/generate-from-recipe", {
    method: "POST",
    body: JSON.stringify({
      recipeId,
      targetMargin: margin,
      language,
    }),
  });
  
  const data = await res.json();
  // Backend возвращает: { id, description, ... }
  
  setPreview({
    id: data.id,        // Блюдо УЖЕ создано на backend
    title: dishTitle,
    description: data.description, // AI-генерированное
    cost,
    price,
    margin,
    status: "draft",
  });
};
```

**Ключевой момент:** Блюдо **СОЗДАЁТСЯ НА PREVIEW ЭТАПЕ**, не на save.

### Этап 4: Сохранение (PATCH)

```typescript
const handleSave = async () => {
  // Блюдо уже существует (preview.id не пусто)
  // Просто редактируем параметры
  
  const res = await fetch(`/api/admin/dishes/${preview.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      title: preview.title,
      description: preview.description,
      price,
      margin,
      status: "draft",
    }),
  });
};
```

---

## 🎨 UI Архитектура

### Блок "Рецепт" (read-only)

```tsx
<Card className="bg-blue-50">
  <CardHeader>
    <CardTitle>📖 Основан на рецепте</CardTitle>
  </CardHeader>
  <CardContent>
    {imagePreview && <img src={imagePreview} />}
    <p>{recipeTitle}</p>
    <p className="text-xs">Ингредиенты и технология зафиксированы</p>
  </CardContent>
</Card>
```

### Блок "Название блюда"

```tsx
<div className="space-y-2">
  <Label>Название блюда в меню *</Label>
  <Input
    value={dishTitle}
    onChange={(e) => setDishTitle(e.target.value)}
    placeholder="Grilled Salmon Plate"
  />
  <p className="text-xs text-muted-foreground">
    Может отличаться от названия рецепта для маркетинга
  </p>
</div>
```

### Финансовый блок (главная часть)

```tsx
<div>
  <Label>Себестоимость (зафиксирована)</Label>
  <Input value={cost.toFixed(2)} disabled />
</div>

<div>
  <Label>Целевая маржа: {margin}%</Label>
  <input
    type="range"
    min={10}
    max={100}
    value={margin}
    onChange={(e) => setMargin(Number(e.target.value))}
  />
</div>

<div>
  <Label>Розничная цена (автоматическая)</Label>
  <Input value={price.toFixed(2)} disabled className="font-bold" />
</div>
```

### Preview (финальное подтверждение)

```tsx
<Card className="border-2 border-blue-500">
  <CardHeader>
    <CardTitle>Превью блюда</CardTitle>
  </CardHeader>
  <CardContent>
    {imagePreview && <img src={imagePreview} />}
    <h3>{preview.title}</h3>
    <p>{preview.description}</p>
    
    {/* Finance Summary */}
    <div className="grid grid-cols-3 gap-3">
      <div>
        <p className="text-xs">Себестоимость</p>
        <p className="font-bold">{preview.cost.toFixed(2)} PLN</p>
      </div>
      <div>
        <p className="text-xs">Маржа</p>
        <p className="font-bold">{preview.margin}%</p>
      </div>
      <div>
        <p className="text-xs">Цена</p>
        <p className="font-bold">{preview.price.toFixed(2)} PLN</p>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 📁 Структура файлов

```
components/admin/dishes/
├── CreateDishFromRecipe.tsx      ← Новый компонент (493 строки)
│   ├── Props: { recipeId: string }
│   ├── State: dishTitle, cost, margin, price, preview
│   ├── Modes: edit → preview → saving
│   └── API: calculate-cost, generate-from-recipe, PATCH

app/admin/dishes/
├── page.tsx                      ← Список всех блюд
├── new/[recipeId]/
│   └── page.tsx                  ← Обёртка для CreateDishFromRecipe
└── [id]/
    └── page.tsx                  ← Редактирование блюда (будет)
```

---

## 🔗 API Endpoints (требуется backend)

### 1. Загрузка рецепта

```http
GET /api/admin/recipes/{recipeId}
Authorization: Bearer {token}

Response:
{
  "data": {
    "id": "rec-123",
    "title": "Grilled Salmon",
    "imageUrl": "https://...",
    "ingredients": [...],
    "stepsRu": [...]
  }
}
```

### 2. Расчёт себестоимости

```http
GET /api/admin/dishes/calculate-cost?recipeId={recipeId}
Authorization: Bearer {token}

Response:
{
  "cost": 10.50,
  "currency": "PLN",
  "fridgeSnapshot": {...}
}
```

**Логика backend:**
- Берёт рецепт (ингредиенты + количество)
- Берёт текущие цены из холодильника
- Считает: `cost = sum(ingredient_price × quantity)`

### 3. Генерация превью с AI

```http
POST /api/admin/dishes/generate-from-recipe
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "recipeId": "rec-123",
  "targetMargin": 30,
  "language": "ru"
}

Response:
{
  "id": "dish-456",
  "title": "Grilled Salmon",
  "description": "Филе лосося... (AI-generated)",
  "status": "draft",
  "createdAt": "2026-01-27T..."
}
```

### 4. Обновление блюда

```http
PATCH /api/admin/dishes/{dishId}
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "title": "Grilled Salmon Plate",
  "description": "...",
  "price": 14.29,
  "margin": 30,
  "status": "draft"
}

Response:
{
  "id": "dish-456",
  "title": "Grilled Salmon Plate",
  "price": 14.29,
  "margin": 30
}
```

---

## 💡 Использование компонента

### Пример 1: Новое блюдо из рецепта

```tsx
import { CreateDishFromRecipe } from "@/components/admin/dishes/CreateDishFromRecipe";

export default function CreateDishPage({ params }: { params: { recipeId: string } }) {
  return (
    <div>
      <h1>Создать блюдо</h1>
      <CreateDishFromRecipe recipeId={params.recipeId} />
    </div>
  );
}
```

### Пример 2: Интеграция со списком рецептов

```tsx
// В компоненте RecipeCard
<Button
  onClick={() => router.push(`/admin/dishes/new/${recipe.id}`)}
>
  Создать блюдо из этого рецепта
</Button>
```

---

## 🧪 Тестирование

### Checklist перед deploy

- [ ] Загруженные рецепты отображаются корректно
- [ ] Себестоимость загружается и фиксируется
- [ ] Маржа меняется (10-100%)
- [ ] Цена автоматически пересчитывается (Cost ÷ (1-M/100))
- [ ] Preview генерируется с AI описанием
- [ ] Блюдо сохраняется как draft
- [ ] Redirect на /admin/dishes после сохранения
- [ ] Работает на мобильных (слайдер маржи)

### Пример теста

```typescript
it('should calculate price correctly', () => {
  const cost = 10;
  const margin = 30;
  const expected = 10 / (1 - 0.3); // 14.29
  
  expect(calculatePrice(cost, margin)).toBe(14.29);
});
```

---

## 📊 Состояние Dish (для future reference)

```typescript
interface Dish {
  id: string;
  recipeId: string;           // Ссылка на рецепт
  title: string;              // Название в меню
  description: string;        // AI-description
  cost: number;               // Зафиксирована
  margin: number;             // % (10-100)
  price: number;              // Auto-calculated
  imageUrl?: string;          // Из рецепта
  
  // Статусы
  status: 'draft' | 'approved' | 'published';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;          // User ID
}
```

**Жизненный цикл статусов:**
```
draft (только создано)
  ↓
approved (одобрено владельцем)
  ↓
published (доступно в меню для клиентов)
```

---

## 🔮 Future enhancements

1. **Редактирование существующего блюда** (`/admin/dishes/[id]/edit`)
   - Смена рецепта
   - Смена маржи
   - Смена описания
   - История версий

2. **Bulk создание блюд** из нескольких рецептов
   - Выбрать рецепты
   - Задать маржу
   - Создать массово

3. **A/B тестирование цен**
   - Две версии одного блюда с разными ценами
   - Аналитика продаж

4. **Интеграция с оборотом**
   - Отслеживание рентабельности по блюдам
   - Alerts когда маржа < целевая

---

## ✅ Статус реализации

| Компонент | Статус | Файл |
|-----------|--------|------|
| **CreateDishFromRecipe** | ✅ Готов | `components/admin/dishes/` |
| **Список блюд (page.tsx)** | ✅ Готов | `app/admin/dishes/` |
| **Создание блюда (new)** | ✅ Готов | `app/admin/dishes/new/[recipeId]/` |
| **Редактирование блюда** | ⏳ TODO | `/admin/dishes/[id]/edit` |
| **Workflow draft→approved→published** | ⏳ TODO | Требуется UI для approvals |
| **Backend API endpoints** | ⏳ TODO | Требуется backend |

---

## 🚀 Следующие шаги

### Для backend:
1. Реализовать `POST /api/admin/dishes/calculate-cost`
2. Реализовать `POST /api/admin/dishes/generate-from-recipe`
3. Реализовать `PATCH /api/admin/dishes/{id}`
4. Реализовать `GET /api/admin/dishes`

### Для frontend:
1. Подключить CreateDishFromRecipe на страницу рецептов
2. Протестировать flow create → preview → save
3. Добавить редактирование блюда (`/admin/dishes/[id]/edit`)
4. Добавить workflow approvals (draft → approved → published)

---

**Создано:** 27 января 2026
**Версия:** 1.0
**Статус:** ✅ Готов к интеграции с backend
