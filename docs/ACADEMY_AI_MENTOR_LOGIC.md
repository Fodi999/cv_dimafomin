# AI Mentor Logic - Task Completion Criteria

## 🎯 Architecture Philosophy

**AI Mentor ≠ Болтун**
- AI mentor НЕ ведет бесконечный диалог
- Он **фиксирует прогресс** и **двигает дальше**
- Имеет четкие **критерии завершения задания**

## ✅ Task Completion Criteria

### 1. `ai-question` - Understanding Concepts
**Цель**: Студент понимает разницу между продуктом и ингредиентом

**Критерии завершения:**
- ✅ Упоминает "продукт" (świeży, jako całość)
- ✅ Упоминает "ингредиент" ИЛИ качество (świeżość, jakość, termin)
- ✅ Показывает понимание контекста (не просто повторяет слова)

**Feedback при выполнении:**
```
Dokładnie! Widzisz produkt, a nie tylko składnik.
Zadanie zaliczone (+5 ChefTokens).
Przejdźmy do kolejnego zadania.
```

**Hint если не выполнено:**
```
Pomyśl o różnicy między 'produktem' (świeży ogórek) a 'składnikiem' (ogórek w recepturze).
```

---

### 2. `decision` - Justified Choices
**Цель**: Студент принимает решение с обоснованием

**Критерии завершения:**
- ✅ Объясняет ПОЧЕМУ (dlatego że, ponieważ, bo)
- ✅ Понимает ПОСЛЕДСТВИЯ (będzie, stanie, wpłynie)
- ✅ Минимум 10 слов (показывает обдуманность)

**Feedback при выполнении:**
```
Świetna decyzja z jasnym uzasadnieniem!
Zadanie zaliczone (+5 ChefTokens).
Przejdźmy do kolejnego zadania.
```

**Hint если не выполнено:**
```
Wyjaśnij DLACZEGO tak zdecydowałeś i CO TO ZMIENI.
```

---

### 3. `analysis` - Observations + Conclusions
**Цель**: Студент замечает детали и делает выводы

**Критерии завершения:**
- ✅ Замечает детали (zauważyłem, widzę, spostrzegam)
- ✅ Делает выводы (więc, zatem, dlatego, to znaczy)
- ✅ Конкретика (не общие слова)

**Feedback при выполнении:**
```
Doskonała analiza z konkretnymi wnioskami!
Zadanie zaliczone (+5 ChefTokens).
Przejdźmy do kolejnego zadania.
```

**Hint если не выполнено:**
```
CO zauważyłeś i CO Z TEGO WYNIKA?
```

---

### 4. `practice` - Action + Reasoning
**Цель**: Студент описывает конкретное действие с обоснованием

**Критерии завершения:**
- ✅ Описывает действие (zrobię, będę, zastosuj)
- ✅ Объясняет зачем (aby, żeby, w celu, dlatego)
- ✅ Показывает план (не просто "сделаю")

**Feedback при выполнении:**
```
Świetnie! Widzę konkretny plan działania.
Zadanie zaliczone (+5 ChefTokens).
Przejdźmy do kolejnego zadania.
```

**Hint если не выполнено:**
```
CO DOKŁADNIE zrobisz i PO CO?
```

---

### 5. `reflection` - Self-Analysis + Future Plan
**Цель**: Студент анализирует опыт и планирует на будущее

**Критерии завершения:**
- ✅ Рефлексия опыта (nauczyłem, zrozumiałem, teraz wiem)
- ✅ План на будущее (następnym razem, w przyszłości, będę pamiętał)
- ✅ Показывает рост (не просто "было интересно")

**Feedback при выполнении:**
```
Doskonała refleksja! Widzę prawdziwe zrozumienie.
Zadanie zaliczone (+10 ChefTokens).  // ⚠️ +10 для reflection!
Przejdźmy do kolejnego zadania.
```

**Hint если не выполнено:**
```
CZEGO SIĘ NAUCZYŁEŚ i JAK TO WYKORZYSTASZ?
```

---

## 🔄 State Machine Logic

### Turn 1: Exploration
- AI задает первый вопрос из `aiQuestions[0]`
- **Не проверяет критерии** (студент еще не знает контекст)
- `shouldCompleteTask: false`

### Turn 2: Deeper Dive
- AI проверяет критерии
- Если **критерии выполнены** → завершает задание (умный студент!)
- Если **нет** → задает вопрос из `aiQuestions[1]` + hint

### Turn 3+: Completion or Guidance
- AI проверяет критерии снова
- Если **выполнены** → feedback + `shouldCompleteTask: true` + начисление токенов
- Если **нет** → конкретный hint из criteria check

---

## 🧠 Key Implementation Details

### 1. **Full Context Analysis**
```typescript
// ✅ ПРАВИЛЬНО: Анализируем ВСЮ историю, не только последний ответ
const allUserMessages = history
  .filter(msg => msg.role === "user")
  .map(msg => msg.message.toLowerCase())
  .join(" ");

const fullContext = `${allUserMessages} ${answerLower}`;
```

### 2. **Regex Patterns for Polish**
```typescript
// Примеры правильных паттернов
const mentionsProduct = /produkt|produktu|śwież|jako/.test(fullContext);
const hasReasoning = /dlatego że|ponieważ|bo|gdyż|przez to/.test(fullContext);
```

### 3. **Smart Feedback**
```typescript
// ✅ Конкретный feedback из criteria check
if (specificFeedback) {
  return `${specificFeedback}\nZadanie zaliczone (+5 ChefTokens).\nPrzejdźmy do kolejnego zadania.`;
}
```

---

## ❌ What Was WRONG Before

### Problem 1: No Completion Criteria
```typescript
// ❌ БЫЛО
const isThoughtful = answerLength >= 10; // Только длина!

// ✅ СТАЛО
const criteriaCheck = checkTaskCompletionCriteria(taskType, answerLower, history);
// Проверяет СМЫСЛ, не длину
```

### Problem 2: Infinite Loop
```typescript
// ❌ БЫЛО
"Interesujące! Rozwiń swoją myśl dalej." // Бесконечно

// ✅ СТАЛО
if (criteriaCheck.completed) {
  return { shouldCompleteTask: true, ... }; // Завершает!
}
```

### Problem 3: No Role of Mentor
```typescript
// ❌ БЫЛО: Chatbot without memory

// ✅ СТАЛО: Mentor with state machine
// - Проверяет критерии
// - Дает конкретные hints
// - Фиксирует прогресс
// - Двигает дальше
```

---

## 📊 Expected Results

### Before Fix
- ❌ AI бесконечно просит "rozwiń dalej"
- ❌ Не начисляет +5 токенов
- ❌ Не открывает Zadanie 2/2
- ❌ Студент застревает на одном задании

### After Fix
- ✅ AI проверяет конкретные критерии
- ✅ Дает конкретные hints если критерии не выполнены
- ✅ Завершает задание когда цель достигнута
- ✅ Начисляет токены (+5 или +10)
- ✅ Прогресс модуля: 1/2 → 2/2
- ✅ Открывается следующее задание

---

## 🚀 Next Steps (Future Improvements)

### 1. Add More Sophisticated NLP (Optional)
- Sentiment analysis для более точной оценки
- Named Entity Recognition для специфических терминов кулинарии

### 2. Adaptive Difficulty (Optional)
- Если студент быстро справляется → увеличить сложность
- Если застревает → дать более детальные hints

### 3. Real-Time Backend AI (Already Implemented)
- Endpoint: `/api/academy/ai/mentor` 
- Uses Go backend `/api/ai/chef-mentor` for actual AI responses
- Fallback to local logic if backend unavailable

---

## 📝 Summary

**Главное изменение:**
- От "длина ответа ≥ 10 слов" 
- К "проверка конкретных критериев для каждого типа задания"

**Результат:**
- AI mentor ведет себя как **наставник**, а не **болтун**
- Студенты видят **прогресс** и получают **конкретные подсказки**
- Система имеет четкий **state machine** с условиями завершения
