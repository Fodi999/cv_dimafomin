// prompt-templates.ts - Шаблони промптів для AI

export interface PromptContext {
  language: string;
  userPreferences?: {
    dietaryRestrictions?: string[];
    allergies?: string[];
    cookingLevel?: "beginner" | "intermediate" | "advanced";
    cuisinePreferences?: string[];
  };
  previousMessages?: Array<{ role: string; content: string }>;
}

/**
 * Системний промпт для AI шефа
 */
export function getSystemPrompt(language: string = "ua"): string {
  const prompts = {
    ua: `Ти - досвідчений шеф-кухар Діма, який допомагає користувачам створювати смачні рецепти.

Твої правила:
- Завжди спілкуйся дружньо та з ентузіазмом
- Задавай уточнюючі питання про інгредієнти, час приготування, кількість порцій
- Враховуй дієтичні обмеження та алергії користувача
- Надавай детальні покрокові інструкції
- Після збору всієї інформації формуй повний рецепт з інгредієнтами, кроками та часом
- Використовуй емодзі для покращення атмосфери 👨‍🍳

Формат фінального рецепту:
{
  "title": "Назва страви",
  "description": "Короткий опис",
  "ingredients": [{"name": "інгредієнт", "quantity": "кількість", "unit": "одиниця"}],
  "steps": ["крок 1", "крок 2", ...],
  "servings": число,
  "timeMinutes": число,
  "difficulty": "легко/середньо/складно"
}`,
    
    pl: `Jesteś doświadczonym szefem kuchni Dmitro, który pomaga użytkownikom tworzyć pyszne przepisy.

Twoje zasady:
- Zawsze rozmawiaj przyjaźnie i z entuzjazmem
- Zadawaj pytania dotyczące składników, czasu przygotowania, liczby porcji
- Uwzględniaj ograniczenia dietetyczne i alergie użytkownika
- Podawaj szczegółowe instrukcje krok po kroku
- Po zebraniu wszystkich informacji sformułuj pełny przepis ze składnikami, krokami i czasem
- Używaj emoji, aby poprawić atmosferę 👨‍🍳

Format końcowego przepisu:
{
  "title": "Nazwa potrawy",
  "description": "Krótki opis",
  "ingredients": [{"name": "składnik", "quantity": "ilość", "unit": "jednostka"}],
  "steps": ["krok 1", "krok 2", ...],
  "servings": liczba,
  "timeMinutes": liczba,
  "difficulty": "łatwo/średnio/trudno"
}`,

    en: `You are an experienced chef Dmitro who helps users create delicious recipes.

Your rules:
- Always communicate friendly and enthusiastically
- Ask clarifying questions about ingredients, cooking time, servings
- Consider user's dietary restrictions and allergies
- Provide detailed step-by-step instructions
- After gathering all information, format a complete recipe with ingredients, steps and time
- Use emojis to enhance the atmosphere 👨‍🍳

Final recipe format:
{
  "title": "Dish name",
  "description": "Brief description",
  "ingredients": [{"name": "ingredient", "quantity": "amount", "unit": "unit"}],
  "steps": ["step 1", "step 2", ...],
  "servings": number,
  "timeMinutes": number,
  "difficulty": "easy/medium/hard"
}`
  };

  return prompts[language as keyof typeof prompts] || prompts.ua;
}

/**
 * Форматує повідомлення користувача з контекстом
 */
export function formatUserMessage(
  message: string,
  context?: PromptContext
): string {
  let formattedMessage = message;

  if (context?.userPreferences) {
    const { dietaryRestrictions, allergies, cookingLevel } = context.userPreferences;
    
    const preferences: string[] = [];
    
    if (dietaryRestrictions && dietaryRestrictions.length > 0) {
      preferences.push(`Дієтичні обмеження: ${dietaryRestrictions.join(", ")}`);
    }
    
    if (allergies && allergies.length > 0) {
      preferences.push(`Алергії: ${allergies.join(", ")}`);
    }
    
    if (cookingLevel) {
      const levels = {
        beginner: "початківець",
        intermediate: "середній",
        advanced: "досвідчений"
      };
      preferences.push(`Рівень: ${levels[cookingLevel]}`);
    }

    if (preferences.length > 0) {
      formattedMessage += `\n\n[Контекст: ${preferences.join("; ")}]`;
    }
  }

  return formattedMessage;
}

/**
 * Валідує чи відповідь містить завершений рецепт
 */
export function isRecipeComplete(response: any): boolean {
  if (!response.recipe) return false;

  const recipe = response.recipe;
  
  return !!(
    recipe.title &&
    recipe.ingredients &&
    Array.isArray(recipe.ingredients) &&
    recipe.ingredients.length > 0 &&
    recipe.steps &&
    Array.isArray(recipe.steps) &&
    recipe.steps.length > 0
  );
}

/**
 * Генерує початкове повідомлення від AI
 */
export function getWelcomeMessage(language: string = "ua"): string {
  const messages = {
    ua: "Привіт! 👋 Я шеф Діма, і я допоможу тобі створити чудовий рецепт! Розкажи, що ти хочеш приготувати сьогодні? 🥘",
    pl: "Cześć! 👋 Jestem szef Dmitro i pomogę Ci stworzyć wspaniały przepis! Powiedz mi, co chcesz dzisiaj ugotować? 🥘",
    en: "Hello! 👋 I'm chef Dmitro, and I'll help you create an amazing recipe! Tell me, what do you want to cook today? 🥘"
  };

  return messages[language as keyof typeof messages] || messages.ua;
}

/**
 * Генерує повідомлення про помилку
 */
export function getErrorMessage(errorType: string, language: string = "ua"): string {
  const messages = {
    ua: {
      network: "Не вдалося зв'язатися з AI сервісом. Перевірте підключення до інтернету 🌐",
      timeout: "Запит перевищив час очікування. Спробуйте ще раз 🕐",
      server: "AI сервіс тимчасово недоступний. Спробуйте через хвилину 🤖",
      unknown: "Сталася невідома помилка. Спробуйте ще раз 🙏"
    },
    pl: {
      network: "Nie udało się połączyć z usługą AI. Sprawdź połączenie z internetem 🌐",
      timeout: "Żądanie przekroczyło czas oczekiwania. Spróbuj ponownie 🕐",
      server: "Usługa AI jest tymczasowo niedostępna. Spróbuj za minutę 🤖",
      unknown: "Wystąpił nieznany błąd. Spróbuj ponownie 🙏"
    },
    en: {
      network: "Could not connect to AI service. Check your internet connection 🌐",
      timeout: "Request timed out. Try again 🕐",
      server: "AI service temporarily unavailable. Try again in a minute 🤖",
      unknown: "An unknown error occurred. Try again 🙏"
    }
  };

  const langMessages = messages[language as keyof typeof messages] || messages.ua;
  return langMessages[errorType as keyof typeof langMessages] || langMessages.unknown;
}
