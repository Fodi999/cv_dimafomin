# 🐛 Debugging Language Switch Buttons

## Проблема
Кнопки переключения языка в настройках (`/profile/settings`) показывают ошибку:
```
Nie udało się zapisać ustawień. Spróbuj ponownie.
```

## Архитектура (как должно работать)

### 1️⃣ User clicks language button (RU/EN/PL)
```tsx
// CoreSettingsSection.tsx
<button onClick={() => handleLanguageChange('ru')}>
  🇷🇺 Русский
</button>
```

### 2️⃣ handleLanguageChange вызывается
```tsx
async function handleLanguageChange(lang: Language) {
  console.log(`🔍 [CoreSettings] handleLanguageChange called with: ${lang}`);
  
  // Step 1: Save to backend
  await updateSettings({ language: lang });
  
  // Step 2: Update UI (reload page)
  setLanguage(lang);
}
```

### 3️⃣ updateSettings из SettingsContext
```tsx
// SettingsContext.tsx
const updateSettings = async (partial: PartialSettings) => {
  console.log(`🔧 [SettingsContext] updateSettings called with:`, partial);
  
  // Optimistic update
  setSettings({ ...settings, ...partial });
  
  // API call
  const updated = await apiUpdateSettings(partial);
  
  console.log("✅ Settings updated:", updated);
}
```

### 4️⃣ API call к backend
```tsx
// lib/api/settings.ts
export async function updateSettings(settings: PartialSettings) {
  console.log(`🌐 [API] updateSettings called with:`, settings);
  
  const response = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(settings),
  });
  
  console.log(`🌐 [API] Response status: ${response.status}`);
  
  if (!response.ok) {
    throw new Error(`Failed: ${response.status}`);
  }
  
  return response.json();
}
```

### 5️⃣ Next.js API Route (proxy)
```tsx
// app/api/settings/route.ts
export async function PATCH(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/settings',
    method: 'PATCH'
  });
}
```

### 6️⃣ proxyToBackend
```tsx
// lib/api/proxy.ts
export async function proxyToBackend(request, options) {
  // 1. Get token from cookies
  const token = cookieStore.get('token')?.value;
  
  // 2. Read request body
  const body = await request.json(); // { language: "ru" }
  
  // 3. Call Go backend
  const response = await fetch(`${BACKEND_URL}/api/settings`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  // 4. Return response
  return NextResponse.json(await response.json());
}
```

### 7️⃣ Go Backend
```go
// handlers/settings.go
func UpdateSettings(c *gin.Context) {
  var input struct {
    Language string `json:"language"`
  }
  
  c.BindJSON(&input) // { language: "ru" }
  
  // Update in database
  db.Model(&user.Settings).Updates(input)
  
  c.JSON(200, gin.H{
    "data": updatedSettings,
  })
}
```

## 🔍 Как найти ошибку

### Шаг 1: Открой DevTools (F12)
1. Перейди на `/profile/settings`
2. Открой Console tab
3. Кликни на кнопку RU или EN

### Шаг 2: Проверь логи
Ты должен увидеть последовательность:

```
✅ Если всё OK:
🔍 [CoreSettings] handleLanguageChange called with: ru, current: pl
🔧 [SettingsContext] updateSettings called with: { language: "ru" }
🔧 [SettingsContext] isAuthenticated: true, token: true
🔄 [SettingsContext] Optimistic update applied: { language: "ru", ... }
⚙️ Updating settings: { language: "ru" }
🌐 [API] updateSettings called with: { language: "ru" }
🌐 [API] Response status: 200
✅ [API] Settings updated successfully: { data: { ... } }
✅ Settings updated: { language: "ru", ... }
🔄 [CoreSettings] Calling setLanguage to reload UI
```

```
❌ Если ошибка:
🔍 [CoreSettings] handleLanguageChange called with: ru
🔧 [SettingsContext] updateSettings called with: { language: "ru" }
🌐 [API] updateSettings called with: { language: "ru" }
🌐 [API] Response status: 401  ← ❌ ОШИБКА!
❌ [API] Failed to update settings: 401
❌ [CoreSettings] Failed to save language: Error: Failed to update settings: 401
```

### Шаг 3: Проверь Network tab
1. Открой DevTools → Network tab
2. Кликни на кнопку RU
3. Найди запрос `settings` (метод: PATCH)
4. Проверь:
   - **Request Headers** → Authorization: Bearer ... (должен быть токен)
   - **Request Payload** → `{ "language": "ru" }` (должны быть данные)
   - **Response Status** → 200 (должен быть успешный)
   - **Response Body** → должен быть JSON с обновлёнными настройками

## 🚨 Типовые ошибки

### ❌ 401 Unauthorized
**Причина:** Токен отсутствует или невалидный
**Решение:**
```bash
# Проверь, что токен есть в cookies
console.log(document.cookie.includes('token='));

# Если токена нет — перелогинься
```

### ❌ 500 Internal Server Error
**Причина:** Ошибка на Go backend
**Решение:**
```bash
# Проверь логи Go сервера
# Скопируй ошибку из терминала где запущен backend
```

### ❌ 400 Bad Request
**Причина:** Неверный формат данных
**Решение:**
```bash
# Проверь Request Payload в Network tab
# Должно быть: { "language": "ru" }
# НЕ должно быть: { "lang": "ru" } или пустой body
```

### ❌ Timeout
**Причина:** Backend не отвечает
**Решение:**
```bash
# Проверь, что Go backend запущен
curl http://localhost:8080/health

# Если не отвечает — перезапусти backend
```

## 📝 Чек-лист для дебага

- [ ] DevTools → Console открыта
- [ ] Логи `🔍 [CoreSettings]` появляются при клике
- [ ] Логи `🌐 [API]` показывают статус ответа
- [ ] Network tab → PATCH /api/settings есть в списке
- [ ] Request Payload содержит `{ "language": "..." }`
- [ ] Response Status = 200
- [ ] Response Body содержит `{ "data": { ... } }`
- [ ] Токен есть в cookies (document.cookie)
- [ ] Go backend запущен и отвечает

## 🎯 Следующий шаг

**После тестирования скопируй в чат:**

1. **Все логи из Console** (особенно ❌ красные ошибки)
2. **Скриншот Network tab** (запрос PATCH /api/settings)
3. **Response Status** и **Response Body** из Network tab

Это поможет точно определить, где именно происходит ошибка! 🚀
