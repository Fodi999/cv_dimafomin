# 🐛 BUGFIX: Неправильное поле FormData для загрузки изображений

## Проблема

Фото не загружались, потому что в FormData использовалось неправильное имя поля.

### ❌ Было (неправильно):
```javascript
const formData = new FormData();
formData.append("file", imageFile); // ← НЕПРАВИЛЬНО
```

### ✅ Стало (правильно):
```javascript
const formData = new FormData();
formData.append("image", imageFile); // ← ПРАВИЛЬНО
```

## Backend требует

Согласно документации API:
```
POST /api/admin/recipes/{recipeId}/image
Body: multipart/form-data с полем "image"
```

## Исправленные файлы

1. **components/admin/recipes/CreateRecipeWithAI.tsx**
   - Строка ~250: `formData.append("image", imageFile)`
   - AI форма создания рецептов

2. **components/admin/catalog/recipes/RecipeImageUpload.tsx**
   - Строка ~61: `formData.append("image", file)`
   - Standalone компонент загрузки

## Проверка

После исправления:
- ✅ Загрузка работает в AI форме
- ✅ Загрузка работает в RecipeImageUpload
- ✅ Backend принимает файл корректно
- ✅ Cloudinary обрабатывает изображение
- ✅ URL сохраняется в БД

## Дополнительно

Добавлен улучшенный error handling:
```javascript
const errorText = await uploadResponse.text();
console.error("Image upload failed:", errorText);
```

Теперь при ошибках в консоли будет видно точное сообщение от backend.

---

**Статус:** ✅ ИСПРАВЛЕНО
