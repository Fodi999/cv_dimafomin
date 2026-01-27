# 🚀 CreateDishFromRecipe — Quick Start Guide

## 📍 Что было создано

| Файл | Тип | Строк | Назначение |
|------|-----|-------|-----------|
| `components/admin/dishes/CreateDishFromRecipe.tsx` | Component | 493 | Основной UI компонент |
| `app/admin/dishes/page.tsx` | Page | 152 | Список всех блюд |
| `app/admin/dishes/new/[recipeId]/page.tsx` | Page | 30 | Wrapper для создания |
| `docs/DISH_CREATION_ARCHITECTURE_2026.md` | Docs | Полная документация | |

---

## 🎯 Главная идея в 3 пункта

1. **Вход**: Пользователь выбирает рецепт
2. **Финансы**: Система загружает себестоимость (из холодильника) и маржу
3. **Выход**: Блюдо создаётся в статусе `draft` с автопросчитанной ценой

```
Recipe (ингредиенты зафиксированы)
  ↓
Calculate Cost (backend)
  ↓
User sets Margin (UI slider)
  ↓
Auto-calculate Price (frontend formula)
  ↓
AI generates Description
  ↓
Save as Dish (draft status)
```

---

## 🔧 Как использовать

### Шаг 1: Добавить на страницу рецептов кнопку

**File:** `components/admin/recipes/RecipeCard.tsx` (или где-то там где показываются рецепты)

```tsx
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function RecipeCard({ recipe }) {
  const router = useRouter();

  return (
    <div>
      <h3>{recipe.title}</h3>
      {/* ... остальной контент рецепта ... */}
      
      <Button
        onClick={() => router.push(`/admin/dishes/new/${recipe.id}`)}
        variant="outline"
        className="mt-4 w-full"
      >
        🍽️ Создать блюдо из этого рецепта
      </Button>
    </div>
  );
}
```

### Шаг 2: Пользователь нажимает кнопку

→ Переход на `/admin/dishes/new/{recipeId}`

### Шаг 3: Форма загружается

Компонент `CreateDishFromRecipe` автоматически:

```typescript
// 1. Загружает рецепт
GET /api/admin/recipes/{recipeId}

// 2. Считает себестоимость
GET /api/admin/dishes/calculate-cost?recipeId={recipeId}

// 3. Показывает форму
```

### Шаг 4: Пользователь редактирует

```
[Название блюда] ← может отличаться от рецепта
[Маржа slider]  ← 30% (типично)
[Цена] ← auto-calculated: Cost ÷ (1 - Margin/100)
```

### Шаг 5: Превью

```
"Превью блюда"
├── Image
├── AI Description
├── Finance Summary (Cost / Margin / Price)
└── [Назад] [Создать]
```

### Шаг 6: Сохранение

```typescript
PATCH /api/admin/dishes/{dishId}
{
  "title": "Grilled Salmon Plate",
  "description": "...",
  "price": 14.29,
  "margin": 30
}

→ Redirect to /admin/dishes
```

---

## 🧠 Ключевые различия от CreateRecipeWithAI

| Параметр | Recipe | Dish |
|----------|--------|------|
| **Вход** | Название + Ингредиенты + Текст | Рецепт (ID) |
| **Редактируется** | Технология приготовления | Маржа и цена |
| **AI генерирует** | Steps, время, калории | Description |
| **Сохраняется как** | Recipe (can be edited) | Dish (draft → approved → published) |
| **Себестоимость** | ❌ Нет | ✅ Да (от холодильника) |

---

## 🔌 Backend API (требуется реализовать)

### Endpoint 1: Расчёт себестоимости

```http
GET /api/admin/dishes/calculate-cost?recipeId={recipeId}
Authorization: Bearer {token}
```

**Логика:**
```
1. Найти рецепт по ID
2. Прочитать ингредиенты (name, quantity, unit)
3. Для каждого ингредиента найти цену в холодильнике
4. Сумма: cost = sum(price per unit × quantity)
5. Вернуть cost
```

**Ответ:**
```json
{
  "cost": 10.50,
  "currency": "PLN"
}
```

---

### Endpoint 2: Генерация блюда

```http
POST /api/admin/dishes/generate-from-recipe
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "recipeId": "rec-123",
  "targetMargin": 30,
  "language": "ru"
}
```

**Логика:**
```
1. Найти рецепт
2. Создать новое блюдо:
   - recipeId = {recipeId}
   - title = recipe.title
   - status = "draft"
   - cost = calculate from recipe
   - margin = targetMargin
   - price = cost / (1 - margin/100)
3. AI: сгенерировать description на основе:
   - recipe.title
   - recipe.ingredients
   - targetMargin
   - language
4. Вернуть dish (с ID!)
```

**Ответ:**
```json
{
  "id": "dish-456",
  "title": "Grilled Salmon",
  "description": "Филе лосося гриль с овощами... (AI-generated)",
  "recipeId": "rec-123",
  "cost": 10.50,
  "margin": 30,
  "price": 14.29,
  "status": "draft"
}
```

---

### Endpoint 3: Обновление блюда

```http
PATCH /api/admin/dishes/{dishId}
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "title": "Grilled Salmon Plate",
  "description": "...",
  "price": 14.29,
  "margin": 30
}
```

**Ответ:**
```json
{
  "id": "dish-456",
  "title": "Grilled Salmon Plate",
  ...
}
```

---

### Endpoint 4: Список блюд

```http
GET /api/admin/dishes
Authorization: Bearer {token}
```

**Ответ:**
```json
{
  "dishes": [
    {
      "id": "dish-456",
      "title": "Grilled Salmon",
      "recipeId": "rec-123",
      "cost": 10.50,
      "margin": 30,
      "price": 14.29,
      "imageUrl": "https://...",
      "status": "draft",
      "createdAt": "2026-01-27T..."
    }
  ]
}
```

---

## ✅ Checklist интеграции

### Frontend (уже готово ✅)

- [x] Компонент CreateDishFromRecipe создан
- [x] Страница /admin/dishes создана
- [x] Страница /admin/dishes/new/[recipeId] создана
- [x] UI финансового блока (Cost / Margin / Price)
- [x] Auto-calculation формула: Price = Cost ÷ (1 - M/100)
- [x] Mode система (edit → preview → saving)
- [x] Loader / Toast notifications
- [x] TypeScript типы
- [x] 0 ошибок компиляции

### Backend (нужно реализовать)

- [ ] Endpoint: GET /api/admin/dishes/calculate-cost
- [ ] Endpoint: POST /api/admin/dishes/generate-from-recipe
- [ ] Endpoint: PATCH /api/admin/dishes/{id}
- [ ] Endpoint: GET /api/admin/dishes
- [ ] Database schema для Dish
- [ ] AI интеграция для description
- [ ] Cost calculation logic (recipe + fridge prices)

### Testing (нужно проверить)

- [ ] Создать блюдо через UI
- [ ] Verify cost загруженна правильно
- [ ] Verify price auto-calculated
- [ ] Verify AI description сгенерирована
- [ ] Verify блюдо сохранено как draft
- [ ] Verify redirect на /admin/dishes работает
- [ ] Test на мобильных (slider маржи)

---

## 🎬 Демонстрация flow'а

```
USER                           FRONTEND                        BACKEND
────────────────────────────────────────────────────────────────────────

1. Нажимает на рецепт
   "Grilled Salmon"
                          
                            GET /recipes/rec-123
                            ────────────────────→
                                                  ✅ Returns recipe data

2. Нажимает "Создать блюдо"
                            
                            GET /calculate-cost?recipeId=rec-123
                            ────────────────────→
                                                  Lookup recipe: 200g salmon (50 PLN/kg) + 200g rice (2 PLN/kg) + vegetables
                                                  cost = 10 + 0.4 + 1 = 11.40 PLN
                                                  ✅ Returns { cost: 11.40 }

3. Видит форму:
   - Название: "Grilled Salmon"
   - Маржа: 30% (default)
   - Цена: 16.29 (auto)
   
   Меняет маржу на 40%
                            
                            (только frontend math)
                            Price = 11.40 ÷ (1 - 0.4) = 19.00 PLN

4. Нажимает "Превью с AI"
                            
                            POST /generate-from-recipe
                            { recipeId, margin: 40, language: "ru" }
                            ────────────────────→
                                                  Create Dish(draft):
                                                  - title: "Grilled Salmon"
                                                  - cost: 11.40
                                                  - margin: 40
                                                  - price: 19.00
                                                  
                                                  AI: сгенерировать description
                                                  
                                                  ✅ Returns { id: "dish-456", description: "Филе лосося с овощами..." }

5. Видит превью:
   - Image
   - Title: "Grilled Salmon"
   - Description: "Филе лосося с овощами..."
   - Cost: 11.40 / Margin: 40% / Price: 19.00
   
   Нажимает "Создать блюдо"
                            
                            PATCH /dishes/dish-456
                            { title, description, price, margin, status }
                            ────────────────────→
                                                  Update Dish to draft
                                                  ✅ Success

6. Видит toast: "✅ Блюдо успешно создано!"
                            
                            Redirect to /admin/dishes
                            
                            Видит список блюд:
                            ├── [Image] Grilled Salmon
                            │   Cost: 11.40 | Margin: 40% | Price: 19.00
                            │   Status: DRAFT
```

---

## 💬 Часто задаваемые вопросы

### Q: Почему маржа именно 30% по умолчанию?
**A:** В ресторане типичная маржа 30-50%. 30% - хороший баланс между прибыльностью и конкурентоспособностью.

### Q: Что произойдёт если рецепт будет изменён?
**A:** Себестоимость блюда останется зафиксирована на момент создания. Это нужно для стабильности цен.

### Q: Как пересчитать себестоимость если холодильник изменился?
**A:** Нужно добавить кнопку "Recalculate cost" в редактировании блюда. (Future enhancement)

### Q: Может ли быть маржа < 10% или > 100%?
**A:** Нет, UI ограничивает диапазон 10-100%. Меньше 10% = убыток, больше 100% = нереалистично.

### Q: Когда блюдо доступно клиентам?
**A:** Когда статус `published`. Сейчас создаётся как `draft`.

---

## 📞 Support

Если есть вопросы по архитектуре:
- Смотри `docs/DISH_CREATION_ARCHITECTURE_2026.md` (полная информация)
- Смотри комментарии в коде `CreateDishFromRecipe.tsx`
- Проверь примеры в этом файле

---

**Версия:** 1.0
**Дата:** 27 января 2026
**Статус:** ✅ Готово к тестированию
