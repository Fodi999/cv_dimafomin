# 🧊 Fridge-Chat Integration Documentation

## Overview
Пользователи могут добавлять ингредиенты из рецептов прямо в свой холодильник через чат с AI Chef.

## Workflow

### 1. User Requests Recipe
- Пользователь пишет запрос в чат: "Хочу паста карбонара"
- AI Chef помогает построить рецепт через conversation

### 2. Recipe Complete
- Когда рецепт готов, AI возвращает `isComplete: true`
- Фронтенд получает `suggestedActions`:
  ```json
  {
    "suggestedActions": [
      "save_recipe",
      "save_ingredients_to_fridge",
      "generate_meal_plan"
    ]
  }
  ```

### 3. User Clicks "В холодильник"
- Нажимает кнопку "🧊 В холодильник" в сообщении AI
- Фронтенд отправляет ингредиенты на `/api/ai/save-ingredients`

### 4. Backend Saves to Fridge
- Сохраняет каждый ингредиент в таблицу `user_fridge`
- Возвращает количество сохраненных элементов
- Пользователь видит подтверждение в чате

## Frontend Components

### ChatMessages.tsx
```tsx
// Новое поле в интерфейсе Message
interface Message {
  role: "ai" | "user";
  content: string;
  timestamp: number;
  suggestedActions?: string[];  // ← New!
}

// Новый пропс
onSuggestedAction?: (action: string) => void;

// В JSX отображает кнопки действий
{msg.suggestedActions && (
  <div className="flex gap-2">
    {msg.suggestedActions.map(action => (
      <button onClick={() => onSuggestedAction?.(action)}>
        {actionLabels[action]}
      </button>
    ))}
  </div>
)}
```

### create-chat/page.tsx
```tsx
// Обработчик предложенных действий
const handleSuggestedAction = async (action: string) => {
  switch (action) {
    case "save_ingredients_to_fridge":
      await saveIngredientsToFridge();
      break;
    case "save_recipe":
      await handlePublish();
      break;
    case "generate_meal_plan":
      // TODO: Implement
      break;
  }
};

// Сохранение ингредиентов
const saveIngredientsToFridge = async () => {
  const response = await fetch(
    "/api/ai/save-ingredients",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        ingredients: recipe.ingredients.map(ing => ({
          name: ing.name,
          amount: parseInt(ing.quantity),
          unit: ing.unit
        }))
      })
    }
  );
};
```

## API Endpoints

### POST /api/ai/save-ingredients
Сохраняет ингредиенты в холодильник пользователя

**Authentication:** Required (Bearer JWT Token)

**Request:**
```json
{
  "ingredients": [
    {
      "name": "Pasta",
      "amount": 400,
      "unit": "g"
    },
    {
      "name": "Eggs",
      "amount": 3,
      "unit": "pcs"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "ingredients saved to fridge",
  "count": 2
}
```

**Errors:**
- `401 Unauthorized` - Missing JWT token
- `400 Bad Request` - Empty ingredients list
- `500 Internal Server Error` - Database error

## Database

### user_fridge table
```
id: UUID (primary key)
user_id: UUID (foreign key)
product: string (ingredient name)
quantity: integer
unit: string (g, ml, pcs, etc.)
available: boolean (default: true)
added_at: timestamp
```

## Button Labels

```typescript
const actionLabels = {
  "save_recipe": "💾 Сохранить рецепт",
  "save_ingredients_to_fridge": "🧊 В холодильник",
  "generate_meal_plan": "📅 План питания",
};
```

## Error Handling

### No ingredients to save
```tsx
if (!generatedRecipe?.ingredients?.length) {
  addAIMessage("❌ Нет ингредиентов для сохранения");
  return;
}
```

### User not authenticated
```tsx
const token = localStorage.getItem("authToken");
if (!token) {
  addAIMessage("❌ Требуется авторизация");
  return;
}
```

### API Error
```tsx
if (!response.ok) {
  const error = await response.json();
  addAIMessage(`❌ Ошибка: ${error.error}`);
}
```

## Usage Flow

1. **Open Chat** → `/chat/create-chat`
2. **Request Recipe** → "Паста карбонара"
3. **Describe** → Conversation to complete recipe
4. **See Suggestions** → AI shows action buttons
5. **Click Button** → "🧊 В холодильник"
6. **Confirm** → "✅ Добавлено 4 ингредиентов!"
7. **View Fridge** → `/fridge` to see saved items

## Future Enhancements

- [ ] Meal plan generation from fridge items
- [ ] Recipe recommendations based on available ingredients
- [ ] Automatic expiry tracking
- [ ] Shopping list generation
- [ ] Batch operations (multiple recipes at once)
- [ ] Ingredient substitution suggestions
