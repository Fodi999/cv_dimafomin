# 🔧 Исправление: Локальный Next.js API route

## Проблема

```bash
POST /api/admin/ingredients
Body: { "inputName": "абрикос" }

Response: 400 Bad Request
"inputName, inputLang, category, and unit are required"
```

**Причина**: Next.js API route (`/app/api/admin/ingredients/route.ts`) всё ещё использовал **старый контракт** с валидацией:

```typescript
// ❌ СТАРЫЙ КОД
if (!body.inputName || !body.inputLang || !body.category || !body.unit) {
  return NextResponse.json(
    { error: 'inputName, inputLang, category, and unit are required' },
    { status: 400 }
  );
}
```

## Решение

### ✅ Исправлен файл: `/app/api/admin/ingredients/route.ts`

**До:**
```typescript
// Валидация ВСЕХ полей
if (!body.inputName || !body.inputLang || !body.category || !body.unit) {
  return NextResponse.json(
    { error: 'inputName, inputLang, category, and unit are required' },
    { status: 400 }
  );
}

// Отправка ВСЕХ полей в backend
body: JSON.stringify(body)
```

**После:**
```typescript
// Валидация ТОЛЬКО inputName
if (!body.inputName?.trim()) {
  return NextResponse.json(
    { error: 'inputName is required' },
    { status: 400 }
  );
}

// Отправка ТОЛЬКО inputName в backend (остальное AI сам определит)
body: JSON.stringify({ inputName: body.inputName.trim() })
```

## Архитектура

```
Frontend UI
    ↓
  POST { inputName: "абрикос" }
    ↓
Next.js API Route (/api/admin/ingredients)
  ✅ Валидация: только inputName
  ✅ Прокси в backend
    ↓
Go Backend (Koyeb)
  🤖 AI classification (Groq)
  🌍 Translation (RU/EN/PL)
  📦 Category detection
  📏 Unit selection
    ↓
Database (PostgreSQL)
    ↓
Response: {
  namePl: "morela",
  nameEn: "apricot",
  nameRu: "абрикос",
  category: "fruit",
  unit: "g"
}
```

## Почему curl работал, а UI - нет?

| Метод | URL | Результат |
|-------|-----|-----------|
| `curl` | `https://yeasty-madelaine-fodi999...` | ✅ OK (прямой Go backend) |
| UI | `http://localhost:3000/api/admin/ingredients` | ❌ 400 (Next.js proxy со старой валидацией) |

**UI** → Next.js API proxy (со старым контрактом) ❌  
**curl** → Go backend напрямую (с новым контрактом) ✅

## Что было исправлено

1. ✅ Удалена валидация `inputLang`, `category`, `unit` в Next.js route
2. ✅ Оставлена только валидация `inputName`
3. ✅ Body передаётся как `{ inputName }` вместо всего объекта
4. ✅ Добавлен `.trim()` для inputName
5. ✅ Обновлены комментарии в коде

## Тестирование

### Локальный запрос (должен работать):

```bash
curl -X POST http://localhost:3000/api/admin/ingredients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"inputName":"абрикос"}'
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "message": "Ingredient created via AI classification",
  "data": {
    "namePl": "morela",
    "nameEn": "apricot",
    "nameRu": "абрикос",
    "category": "fruit",
    "unit": "g"
  }
}
```

### UI тест:

1. Открыть Admin → Catalog → Products
2. Нажать "Добавить продукт"
3. Ввести "абрикос"
4. Нажать "Создать"
5. Должен появиться toast: `"Добавлено: morela · fruit"`

## Важно

❌ **Не делать на фронте:**
- Определение категории
- Определение единицы измерения
- Перевод
- Нормализацию

✅ **Делать на фронте:**
- Только базовую валидацию (пустое поле, длина)
- Отправку одного поля `inputName`

## Backend ответственность

Backend через AI (Groq) определяет:
- ✅ Category (fruit, vegetable, protein, etc.)
- ✅ Unit (g, ml, pcs)
- ✅ Translations (RU/EN/PL)
- ✅ Normalized value
- ✅ Проверку дубликатов

## Следующие шаги

После перезапуска Next.js (`npm run dev`):
- ✅ UI должен работать с локальным backend
- ✅ Форма отправляет только `inputName`
- ✅ Backend отвечает с полными данными
- ✅ Toast показывает правильное сообщение
