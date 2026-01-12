# 🍳 Мультиязычный каталог рецептов

## 📋 Обзор

Реализована поддержка мультиязычных рецептов с автоматическим переключением языка и визуальным индикатором новых рецептов.

## 🎨 Фронтенд

### TypeScript интерфейс

```typescript
interface Recipe {
  id: string;
  title: string;           // Основное название (fallback)
  nameRu?: string;         // Русское название
  nameEn?: string;         // Английское название
  namePl?: string;         // Польское название
  nameUk?: string;         // Украинское название
  created_at?: string;     // ISO 8601 дата создания
  createdAt?: string;      // Альтернативное поле даты
  timeMinutes?: number;    // Время приготовления
  cooking_time?: number;   // Альтернативное поле времени
  difficulty?: 'easy' | 'medium' | 'hard';
  // ... остальные поля
}
```

### Утилиты (`lib/utils/recipe-helpers.ts`)

#### `getRecipeName(recipe, lang)`
Возвращает название рецепта на указанном языке с fallback-цепочкой:
```typescript
getRecipeName(recipe, 'ru') 
// Попытка: nameRu -> nameEn -> namePl -> nameUk -> title -> 'Без назви'
```

#### `isNewRecipe(createdAt)`
Проверяет, был ли рецепт создан в последние 7 дней:
```typescript
isNewRecipe(recipe.created_at) // true если < 7 дней
```

#### `formatRecipeDate(dateString, locale)`
Форматирует дату для отображения:
```typescript
formatRecipeDate(recipe.created_at, 'uk-UA') // "11.01.2026"
```

#### `getRecipeDescription(recipe, lang)`
Возвращает описание на указанном языке с fallback-цепочкой.

## 🎨 Компоненты

### RecipesTable
Таблица рецептов с мультиязычной поддержкой:
- ✅ Автоматическое переключение языка из контекста
- ✅ Бейдж "🆕 NEW" для рецептов младше 7 дней
- ✅ Колонка "Дата створення" с форматированием
- ✅ Мультиязычные названия

### RecipeCard
Карточка рецепта для grid-представления:
- ✅ Gradient-бейдж "NEW" с иконкой Sparkles
- ✅ Адаптивный дизайн
- ✅ Мультиязычные названия

## 🚀 Использование

### В компоненте
```tsx
import { RecipesTable } from '@/components/admin/catalog/recipes/RecipesTable';
import { useLanguage } from '@/contexts/LanguageContext';
import { getRecipeName, isNewRecipe } from '@/lib/utils/recipe-helpers';

function MyComponent() {
  const { language } = useLanguage(); // 'ru' | 'en' | 'pl'
  
  return (
    <>
      <h1>{getRecipeName(recipe, language)}</h1>
      {isNewRecipe(recipe.created_at) && <span>🆕 NEW</span>}
    </>
  );
}
```

### Бейдж "NEW"
Автоматически показывается для рецептов, созданных в последние 7 дней:
```tsx
{isNewRecipe(recipe.created_at) && (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
    <Sparkles className="w-3 h-3" />
    NEW
  </span>
)}
```

## 🎯 Фичи

### ✅ Реализовано
- [x] Мультиязычные названия рецептов (ru/en/pl/uk)
- [x] Автоматический fallback на доступный язык
- [x] Бейдж "NEW" для свежих рецептов (<7 дней)
- [x] Форматирование дат по локали
- [x] Колонка "Дата створення" в таблице
- [x] Адаптивный дизайн компонентов
- [x] TypeScript типизация

### 📝 API Backend
Ожидается, что бэкенд возвращает:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Fallback название",
      "nameRu": "Жареный Лосось",
      "nameEn": "Fried Salmon",
      "namePl": "Smażony Łosoś",
      "nameUk": "Смажений Лосось",
      "createdAt": "2026-01-05T10:00:00Z",
      "timeMinutes": 30,
      "difficulty": "easy"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1
  }
}
```

## 🔧 Настройка

1. **Импортируй утилиты**:
```typescript
import { getRecipeName, isNewRecipe } from '@/lib/utils/recipe-helpers';
```

2. **Используй LanguageContext**:
```typescript
const { language } = useLanguage();
```

3. **Получи локализованное название**:
```typescript
const name = getRecipeName(recipe, language);
```

## 📊 Примеры

### Карточка рецепта
```tsx
<RecipeCard 
  recipe={recipe} 
  onClick={() => handleView(recipe)} 
/>
```

### Таблица рецептов
```tsx
<RecipesTable
  recipes={recipes}
  isLoading={false}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## 🎨 Стилизация

Бейдж "NEW":
- Gradient: `from-blue-500 to-purple-600`
- Иконка: `Sparkles` из `lucide-react`
- Размер: `text-xs`, padding `px-2 py-0.5`

## 🧪 Тестирование

```typescript
// Тест утилиты isNewRecipe
const newRecipe = { created_at: new Date().toISOString() };
console.assert(isNewRecipe(newRecipe.created_at) === true);

const oldRecipe = { created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() };
console.assert(isNewRecipe(oldRecipe.created_at) === false);
```

---

**✨ Готово!** Рецепты теперь отображаются с правильным языком и бейджем "NEW" для свежих блюд.
