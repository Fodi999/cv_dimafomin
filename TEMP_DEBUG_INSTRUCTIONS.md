# 🔧 DEBUG: Clear Cache and Test

## Проблема
Рецепты загружаются из localStorage cache, поэтому не видим новые данные с backend.

## Решение

### 1. Откройте DevTools Console
Нажмите `F12` или `Cmd+Option+I`

### 2. Очистите localStorage
```javascript
localStorage.removeItem('assistant_recipe_matches');
localStorage.removeItem('assistant_show_matches');
localStorage.removeItem('assistant_current_recipe_index');
localStorage.removeItem('assistant_viewed_recipe_ids');
console.log('✅ Cache cleared!');
```

### 3. Перезагрузите страницу
```javascript
location.reload();
```

### 4. Нажмите "Найти рецепты"
Кликните на кнопку "Найти рецепты" / "Znajdź przepisy"

### 5. Проверьте логи
Должны появиться:
```
🎯 cook_now scenario: Loading recipes from GET /api/recipes/match
✅ Received X recipe matches from catalog
🔍 [Assistant Page] First recipe from API: {...}
🔍 [Recipe Match API] Raw backend response: {...}
🧪 [AIRecommendationCard] Backend ingredient data: {...}
```

---

## Что проверяем

### Ожидаем увидеть в логе:
```javascript
{
  raw: {
    ingredientId: "...",
    name: "свежие яйца",        // ✅ Локализованное
    name_en: "fresh eggs",       // ✅ Английский
    name_pl: "świeże jajka",    // ✅ Польский  
    name_ru: "свежие яйца",     // ✅ Русский
    quantity: 2,
    unit: "шт"
  }
}
```

### Если увидим:
```javascript
{
  name: "fresh eggs",
  name_en: undefined,  // ❌ Проблема!
  name_pl: undefined,
  name_ru: undefined
}
```

Значит backend НЕ отправляет переводы!
