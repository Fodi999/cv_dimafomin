# 🔧 Backend Fix: AI Language Control

## 🎯 ПРОБЛЕМА

**Сейчас:** Frontend отправляет язык в payload → Backend использует этот язык для AI → Несоответствие между UI и AI

**Правильно:** Backend берет язык из `user.Settings.Language` → AI всегда отвечает на языке пользователя → UI и AI синхронизированы

---

## ✅ ЧТО ИМЕННО СДЕЛАТЬ НА БЭКЕНДЕ (ПО ПУНКТАМ)

### 1️⃣ НЕ БРАТЬ язык из frontend payload

❌ **ПЛОХО:**
```go
// ❌ НЕ ИСПОЛЬЗОВАТЬ язык из payload
lang := payload.Language
```

✅ **ПРАВИЛЬНО:**
```go
// ✅ Брать язык из настроек пользователя (один источник истины)
lang := user.Settings.Language
```

**Почему:** Frontend может отправить любой язык (даже случайно). Единственный источник истины — это `user.Settings.Language` из базы данных.

---

### 2️⃣ Принудительно задать язык в system prompt

```go
func buildSystemPrompt(userLanguage string) string {
    // Мапим внутренний формат в человеческий
    langName := mapLanguage(userLanguage) // "pl" -> "Polish", "ru" -> "Russian", "en" -> "English"
    
    systemPrompt := fmt.Sprintf(`You are a professional culinary AI assistant.

CRITICAL RULES:
- Respond strictly in %s language.
- Do NOT mix languages.
- Do NOT transliterate.
- Use metric units unless specified otherwise.
- Tone: mentor, friendly, concise.

Example responses:
- Polish: "Świetny wybór! Polecam dodać..."
- Russian: "Отличный выбор! Рекомендую добавить..."
- English: "Great choice! I recommend adding..."
`, langName)
    
    return systemPrompt
}

// Helper function
func mapLanguage(code string) string {
    switch code {
    case "pl":
        return "Polish"
    case "ru":
        return "Russian"
    case "en":
        return "English"
    default:
        return "English" // Fallback
    }
}
```

---

### 3️⃣ Требовать JSON-ответ от AI

```go
systemPrompt += `
RESPONSE FORMAT:
Return output ONLY as valid JSON.
Do not include markdown code blocks (no \`\`\`json).
Do not include extra text before or after JSON.

Example valid response:
{"reason": "Отличный выбор! Эти ингредиенты...", "suggestions": [...]}
`
```

**Почему:** Предотвращает ответы вида:
```
Here's the JSON:
```json
{"reason": "..."}
```
```

---

### 4️⃣ Логировать язык (для дебага)

```go
log.Printf("[AI] User ID: %s, Language enforced: %s", user.ID, lang)
log.Printf("[AI] System prompt language: %s", mapLanguage(lang))
```

**Зачем:** Поможет при дебаге — сразу видно, какой язык использовался для AI-запроса.

---

## 📍 ГДЕ ПРИМЕНИТЬ (примеры endpoint'ов)

### Пример 1: AI Recipe Generation
```go
func (h *Handler) GenerateRecipeWithAI(c *gin.Context) {
    // ❌ СТАРЫЙ КОД
    // var payload struct {
    //     Language string `json:"language"`
    // }
    // json.NewDecoder(c.Request.Body).Decode(&payload)
    // lang := payload.Language
    
    // ✅ НОВЫЙ КОД
    userID := c.GetString("user_id")
    user, err := h.userRepo.GetByID(userID)
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to get user"})
        return
    }
    
    lang := user.Settings.Language // Единственный источник истины
    log.Printf("[AI] Recipe generation - User: %s, Language: %s", userID, lang)
    
    systemPrompt := buildSystemPrompt(lang)
    
    // ... остальная логика
}
```

### Пример 2: AI Fridge Analysis
```go
func (h *Handler) AnalyzeFridge(c *gin.Context) {
    userID := c.GetString("user_id")
    user, err := h.userRepo.GetByID(userID)
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to get user"})
        return
    }
    
    lang := user.Settings.Language
    log.Printf("[AI] Fridge analysis - User: %s, Language: %s", userID, lang)
    
    systemPrompt := fmt.Sprintf(`You are a culinary AI assistant analyzing a fridge.

CRITICAL: Respond ONLY in %s language.

Task: Analyze ingredients and suggest recipes.
Format: Return valid JSON only.
`, mapLanguage(lang))
    
    // ... остальная логика
}
```

### Пример 3: AI Chat
```go
func (h *Handler) ChatWithAI(c *gin.Context) {
    userID := c.GetString("user_id")
    user, err := h.userRepo.GetByID(userID)
    if err != nil {
        c.JSON(500, gin.H{"error": "Failed to get user"})
        return
    }
    
    lang := user.Settings.Language
    log.Printf("[AI] Chat message - User: %s, Language: %s", userID, lang)
    
    systemPrompt := buildSystemPrompt(lang)
    
    // ... остальная логика
}
```

---

## 🖥 ЧТО ОСТАЁТСЯ НА ФРОНТЕНДЕ

Frontend делает **ТОЛЬКО** это:

### ✅ UI переводы
```tsx
const { t } = useLanguage();

<h1>{t?.recipes?.title}</h1>  // "Przepisy" / "Recipes" / "Рецепты"
```

### ✅ Отображение AI-ответа (как есть)
```tsx
<p>{ai.reason}</p>  // AI уже ответил на правильном языке
```

### ❌ НЕ управляет языком AI
```tsx
// ❌ УДАЛИТЬ такой код:
const payload = {
    ingredients: [...],
    language: language  // ← НЕ НУЖНО
};
```

---

## 🧪 ПРОВЕРКА, ЧТО СДЕЛАНО ПРАВИЛЬНО

### Тест 1: Смена языка
1. Зайти в настройки
2. Переключить язык → `ru` (Russian)
3. Перезагрузить страницу
4. Попросить AI создать рецепт
5. **✅ AI отвечает на русском**

### Тест 2: Консистентность
1. Убедиться, что `user.Settings.Language = "ru"` в БД
2. Сделать любой AI-запрос (рецепт, анализ холодильника, чат)
3. **✅ AI всегда отвечает на русском**

### Тест 3: Независимость от frontend
1. Открыть DevTools → Network
2. Найти AI-запрос
3. Посмотреть payload → `language` не должно быть
4. **✅ Backend берет язык из `user.Settings.Language`**

### Тест 4: Логи
Проверить backend логи:
```
[AI] User ID: 123, Language enforced: ru
[AI] System prompt language: Russian
```

---

## 📋 ЧЕКЛИСТ ДЛЯ BACKEND-РАЗРАБОТЧИКА

- [ ] Найти все AI endpoint'ы (генерация рецептов, анализ холодильника, чат)
- [ ] Удалить использование `payload.Language`
- [ ] Добавить `lang := user.Settings.Language`
- [ ] Обновить `systemPrompt` с принудительным языком
- [ ] Добавить требование JSON-формата в prompt
- [ ] Добавить логирование языка
- [ ] Создать функцию `mapLanguage(code string) string`
- [ ] Протестировать на всех языках (pl, en, ru)
- [ ] Проверить логи

---

## 🟢 КОРОТКО (ДЛЯ ПАМЯТИ)

| Вопрос | Ответ |
|--------|-------|
| **Где хранить язык?** | Backend (`user.Settings.Language`) |
| **Где решать язык AI?** | Backend (в system prompt) |
| **Где принуждать язык?** | Backend (`Respond strictly in %s language`) |
| **Что делает frontend?** | Только UI переводы (`t?.recipes?.title`) |
| **Откуда брать язык?** | ✅ Из БД `user.Settings.Language` <br> ❌ НЕ из payload |

---

## 🔗 Связанные документы

- `LANGUAGE_BUTTON_DEBUG.md` - Дебаг переключения языка на фронте
- `LANGUAGE_SYNC_COMPLETE.md` - История синхронизации языка
- `JWT_AUTH_FLOW.md` - Как получить `user_id` из JWT

---

## 📞 Контакт

Если есть вопросы по реализации — пиши в чат или комментарии в PR.

**Главное:** Один источник истины = `user.Settings.Language` 🎯
