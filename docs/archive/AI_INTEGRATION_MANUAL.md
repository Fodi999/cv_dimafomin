# 🚀 Инструкция по интеграции AI в /fridge

Все компоненты готовы! Осталось добавить их на страницу вручную (replace_string_in_file портит файл).

## 1️⃣ Добавьте импорты (строка 13-14 после QuantitySheet):

```typescript
import FridgeAIActions from "@/components/fridge/FridgeAIActions";
import AIResultModal from "@/components/fridge/AIResultModal";
```

## 2️⃣ Добавьте состояние (после строки 28, после quantitySheetItem):

```typescript
// AI Analysis states
const [aiLoading, setAiLoading] = useState(false);
const [aiModalOpen, setAiModalOpen] = useState(false);
const [aiResult, setAiResult] = useState<{ title: string; content: string } | null>(null);
```

## 3️⃣ Добавьте функцию handleAIAnalyze (после функции handleUpdateQuantity, перед return):

```typescript
const handleAIAnalyze = async (goal: "recipe_today" | "plan_3days" | "use_expiring" | "spending_analysis") => {
  try {
    setAiLoading(true);
    setError(null);
    
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const titles = {
      recipe_today: "🍳 Что приготовить сегодня",
      plan_3days: "📅 План на 3 дня",
      use_expiring: "♻️ Что срочно использовать",
      spending_analysis: "💸 Анализ расходов",
    };

    setAiResult({ title: titles[goal], content: "" });
    setAiModalOpen(true);

    const response = await fetch("/api/ai/fridge/analyze", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "AI analysis failed");
    }

    const data = await response.json();
    console.log("[FridgePage] AI Response:", data);

    setAiResult({
      title: titles[goal],
      content: data.analysis || data.message || JSON.stringify(data, null, 2),
    });
  } catch (err: any) {
    console.error("AI Analysis failed:", err);
    setError(err.message || "Błąd podczas analizy AI");
    setAiModalOpen(false);
    setTimeout(() => setError(null), 5000);
  } finally {
    setAiLoading(false);
  }
};
```

## 4️⃣ Добавьте UI компонент (после `<FridgeStats items={items} />`):

```tsx
{/* 🤖 AI Assistant Actions */}
{items.length > 0 && (
  <FridgeAIActions 
    onAnalyze={handleAIAnalyze} 
    loading={aiLoading}
  />
)}
```

## 5️⃣ Добавьте модальное окно (перед закрывающим `</div>` в самом конце return, перед последним `</div>`):

```tsx
{/* AI Result Modal */}
<AIResultModal
  isOpen={aiModalOpen}
  onClose={() => setAiModalOpen(false)}
  title={aiResult?.title || "AI Analysis"}
  content={aiResult?.content || ""}
  loading={aiLoading}
/>
```

## ✅ Готово!

После этого на странице /fridge появятся 4 красочные кнопки AI:
- 🍳 Что приготовить сегодня  
- 📅 План на 3 дня  
- ♻️ Что срочно использовать  
- 💸 Анализ расходов

При клике на любую кнопку:
1. Открывается модальное окно с loading spinner
2. Отправляется запрос в `/api/ai/fridge/analyze`
3. Backend собирает данные холодильника и отправляет в AI
4. Результат отображается в красивом модальном окне

## 🎯 Что уже готово:

✅ `FridgeAIActions.tsx` - компонент с 4 кнопками
✅ `AIResultModal.tsx` - модальное окно для результата
✅ `/api/ai/fridge/analyze/route.ts` - API endpoint
✅ Backend интеграция с AI

Осталось только добавить код на страницу!
