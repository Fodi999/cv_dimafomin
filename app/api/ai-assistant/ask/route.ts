import { NextRequest, NextResponse } from 'next/server';

// ====== AI REQUEST TYPES AND COSTS ======
type AIRequestType = 'recipe' | 'meal-idea' | 'technique' | 'learning-plan' | 'photo-check';

const REQUEST_COSTS: Record<AIRequestType, number> = {
  'recipe': 5,           // "Спроси AI-шефа рецепт" → 5 CT
  'meal-idea': 10,       // "Попроси идею ужина по ингредиентам" → 10 CT
  'technique': 3,        // "Попроси объяснить технику" → 3 CT
  'learning-plan': 20,   // "Создай персональный план курса" → 20 CT
  'photo-check': 50,     // "Сделай AI-проверку блюда по фото" → 50 CT
};

// Mock responses for demonstration (replace with OpenAI API calls)
const MOCK_RESPONSES: Record<AIRequestType, string> = {
  'recipe': `# 🍱 Твой уникальный рецепт: Futuristic Sushi Roll

## 🥘 Ингредиенты:
- 2 чашки вареного риса для суши
- 4 листа нори (морской лист)
- 200г лосося (сырого или копченого)
- 1 свежий огурец
- 1 авокадо
- 2 столовые ложки кунжута
- Соус соевый и васаби для подачи

## 👨‍🍳 Шаги приготовления:
1. Разложите первый лист нори блестящей стороной вниз на бамбуковый коврик
2. Равномерно распределите тонкий слой риса на нори (оставьте 2см сверху без риса)
3. На рис положите тонкие полоски лосося, огурца и авокадо
4. Посыпьте кунжутом
5. С помощью коврика плотно скатайте рулет, смочив край нори водой
6. Острым ножом нарежьте на 8 равных кусков
7. Подавайте с соевым соусом и васаби

⏱️ Время приготовления: 15 минут
🍽️ Порций: 4 (32 кусочка)
📊 Уровень сложности: Средний`,

  'meal-idea': `# 🍽️ Идеи ужина из твоих ингредиентов

## 🥇 Рекомендация #1: Куриный стир-фрай с овощами
**Время:** 20 минут | **Сложность:** Легко
Идеально использует: курица, морковь, сельдерей, соевый соус

## 🥈 Рекомендация #2: Паста Карбонара
**Время:** 15 минут | **Сложность:** Средне
Идеально использует: яйца, бекон, сливки, макароны

## 🥉 Рекомендация #3: Омлет с грибами
**Время:** 10 минут | **Сложность:** Очень легко
Идеально использует: яйца, грибы, сливочное масло

## ⭐ Доп. совет:
Сочетание твоих ингредиентов отлично подходит для азиатской кухни. Рекомендую закупить соевый соус и кунжутное масло для большего разнообразия!`,

  'technique': `# 🔪 Техника: Правильная нарезка овощей

## 📍 Основные типы нарезки:

### 1️⃣ Мелкая нарезка (Brunoise)
- Размер: 2-3 мм кубики
- Использование: супы, соусы
- Техника: Нарежьте овощ полосками → сложите полоски → режьте поперек

### 2️⃣ Соломка (Julienne)
- Размер: 2 мм × 2 мм × 50 мм
- Использование: стир-фрай, салаты
- Техника: Сначала нарежьте пластинки, затем полоски, затем кубики

### 3️⃣ Клинья (Wedge)
- Размер: треугольные куски
- Использование: картофель фри, гарниры
- Техника: Разрежьте пополам, затем на четвертины по диагонали

## 💡 Золотые правила:
✓ Держите нож под углом 20° к доске
✓ Используйте острый нож (безопаснее!)
✓ Кончик ножа должен оставаться на доске
✓ Практикуйте 10 минут в день = мастерство через месяц`,

  'learning-plan': `# 🎓 Твой персональный план обучения

## 📊 Анализ твоего уровня:
- **Текущий уровень:** Beginner (Новичок)
- **Сильные стороны:** Базовая нарезка, знание специй
- **Области для развития:** Тепловые техники, соусы

## 📅 8-Недельный план:

### Неделя 1-2: Основы
- [ ] Урок 1: Ножевые навыки (Нарезка 101)
- [ ] Урок 2: Тепловые техники
- [ ] Урок 3: Основные соусы

### Неделя 3-4: Азиатская кухня
- [ ] Урок 4: Основы японской кухни
- [ ] Урок 5: Приготовление суши
- [ ] Урок 6: Азиатские соусы

### Неделя 5-6: Продвинутые техники
- [ ] Урок 7: Ферментация
- [ ] Урок 8: Молекулярная кулинария

### Неделя 7-8: Практика
- [ ] Финальный проект: Создайте меню из 3 блюд
- [ ] Сертификат будет готов!

**Ожидаемый результат:** Вы станете Junior Chef уровня! 🎉`,

  'photo-check': `# 📸 Анализ твоего блюда

## 🎯 Общая оценка: 8.2/10 ⭐

### Внешний вид & Презентация
✅ **Хорошо (7/10)** - Блюдо красиво расложено, цвета гармоничны

### Текстуры & Консистенция
✅ **Отлично (9/10)** - Отчетливо видна консистенция каждого компонента

### Порционирование
⚠️ **Нужно улучшить (6/10)** - Порция выглядит немного большой, лучше увеличить декоративный элемент

### Детали & Гарнир
✅ **Отлично (9/10)** - Отличные гарниры и финальные штрихи

## 💡 Рекомендации для улучшения:
1. **Освещение:** Пробуйте снимать при естественном свете с боку
2. **Угол камеры:** 45° угол показывает объем лучше всего
3. **Плот расположения:** Использующите правило третей (3×3 сетка)
4. **Контрастная посуда:** Тарелка должна контрастировать с блюдом

## ⭐ Следующий уровень:
Попробуйте добавить дыму или льда для драматического эффекта!`,
};

// ====== MOCK: Get user balance from database ======
async function getUserBalance(userId: string, token: string): Promise<number> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api'}/user/tokens`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to get user balance:', response.status);
      return 0;
    }

    const data = await response.json();
    return data.data?.balance || data.balance || 0;
  } catch (error) {
    console.error('Error fetching user balance:', error);
    return 0;
  }
}

// ====== MOCK: Deduct tokens from user balance ======
async function deductTokens(
  userId: string,
  amount: number,
  reason: string,
  token: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api'}/wallet/spend`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount,
          reason: `AI Request: ${reason}`,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || 'Failed to deduct tokens',
      };
    }

    const data = await response.json();
    return {
      success: true,
      newBalance: data.data?.balance || data.balance,
    };
  } catch (error) {
    console.error('Error deducting tokens:', error);
    return {
      success: false,
      error: 'Server error while processing tokens',
    };
  }
}

// ====== MAIN API HANDLER ======
export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing token' },
        { status: 401 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { userId, type, prompt } = body;

    if (!userId || !type || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, type, prompt' },
        { status: 400 }
      );
    }

    if (!REQUEST_COSTS[type as AIRequestType]) {
      return NextResponse.json(
        {
          error: `Invalid request type. Allowed types: ${Object.keys(REQUEST_COSTS).join(', ')}`,
        },
        { status: 400 }
      );
    }

    // 3. Get user's current balance
    const balance = await getUserBalance(userId, token);
    const cost = REQUEST_COSTS[type as AIRequestType];

    console.log(`[AI Assistant] User ${userId} balance: ${balance}, request cost: ${cost}`);

    // 4. Check if user has enough tokens
    if (balance < cost) {
      return NextResponse.json(
        {
          error: `Insufficient tokens. You have ${balance} CT but need ${cost} CT.`,
          balance,
          required: cost,
          shortage: cost - balance,
        },
        { status: 402 } // Payment Required
      );
    }

    // 5. Deduct tokens from user balance
    const deductResult = await deductTokens(
      userId,
      cost,
      `${type} request`,
      token
    );

    if (!deductResult.success) {
      return NextResponse.json(
        { error: deductResult.error || 'Failed to process token deduction' },
        { status: 500 }
      );
    }

    // 6. Generate AI response
    // TODO: Replace with actual OpenAI API call
    const response = MOCK_RESPONSES[type as AIRequestType] ||
      `Response for ${type}: ${prompt}`;

    // 7. Log the request
    console.log(`[AI Assistant] Successfully processed ${type} request for user ${userId}`);
    console.log(`[AI Assistant] Tokens deducted: ${cost}, New balance: ${deductResult.newBalance}`);

    // 8. Return success response
    return NextResponse.json(
      {
        success: true,
        data: {
          requestId: `req_${Date.now()}`,
          type,
          prompt,
          response,
          costCT: cost,
          newBalance: deductResult.newBalance,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[AI Assistant] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ====== GET: List available AI request types and costs ======
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      availableTypes: Object.keys(REQUEST_COSTS),
      costs: REQUEST_COSTS,
      descriptions: {
        'recipe': 'Generate a unique recipe by name or description',
        'meal-idea': 'Get meal ideas based on available ingredients',
        'technique': 'Get step-by-step explanation of any cooking technique',
        'learning-plan': 'Create a personalized learning plan based on your level',
        'photo-check': 'Analyze a photo of your dish and get feedback',
      },
    },
  });
}
