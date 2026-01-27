/**
 * 🇵🇱 Polish AI Message Dictionary
 * 
 * Single source of truth for all AI-related messages.
 * Backend returns CODE, frontend renders Polish text.
 * 
 * Pattern:
 * - Backend: { code: "NO_RECIPES_FOR_FRIDGE", context: { fridgeItems: 5 } }
 * - Frontend: aiMessages[code](context) → { title, description, actions }
 */

export type AIMessageAction = {
  id: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  icon?: string;
};

export type AIMessage = {
  title: string;
  description: string;
  level?: 'info' | 'warning' | 'success' | 'error';
  actions?: AIMessageAction[];
  dismissible?: boolean;
};

export type AIMessageContext = Record<string, any>;

export type AIMessageGenerator = (context?: AIMessageContext) => AIMessage;

/**
 * 📚 AI Message Catalog
 * 
 * Each entry is a function that takes context and returns a message object.
 * This allows dynamic content based on context values.
 */
export const aiMessages: Record<string, AIMessageGenerator> = {
  // 🔍 Recipe Matching - Empty Results
  NO_RECIPES_FOR_FRIDGE: (ctx = {}) => {
    const fridgeCount = ctx.fridgeItems || 0;
    const recipeCount = ctx.totalRecipes || 0;
    
    // Правильное склонение для польского языка
    const getFridgeWord = (n: number) => {
      if (n === 1) return 'produkt';
      if (n >= 2 && n <= 4) return 'produkty';
      return 'produktów';
    };
    
    const getRecipeWord = (n: number) => {
      if (n === 1) return 'przepis';
      if (n >= 2 && n <= 4) return 'przepisy';
      return 'przepisów';
    };
    
    return {
      title: 'Nie znaleźliśmy pasujących przepisów',
      description: fridgeCount && recipeCount
        ? `Masz ${fridgeCount} ${getFridgeWord(fridgeCount)} w lodówce.\nW katalogu dostępnych jest ${recipeCount} ${getRecipeWord(recipeCount)}, ale żaden nie pasuje do aktualnych składników.\n\n💡 Dodaj więcej produktów do lodówki, aby odblokować więcej przepisów AI.`
        : fridgeCount 
          ? `Masz ${fridgeCount} ${getFridgeWord(fridgeCount)} w lodówce, ale żaden przepis nie pasuje do tych składników.\n\n💡 Spróbuj dodać bardziej popularne składniki.`
          : 'Nie znaleźliśmy przepisów pasujących do Twojej lodówki.\n\n💡 Dodaj produkty do lodówki, aby AI mogło znaleźć idealne przepisy dla Ciebie.',
      level: 'info' as const,
      actions: [
        { id: 'ADD_PRODUCTS', label: 'Dodaj produkty do lodówki', variant: 'primary' as const, icon: 'Plus' },
        { id: 'VIEW_SAVED', label: 'Zobacz zapisane', variant: 'secondary' as const, icon: 'Save' },
        ...(recipeCount ? [{ 
          id: 'VIEW_CATALOG', 
          label: `Zobacz katalog (${recipeCount} ${getRecipeWord(recipeCount)})`, 
          variant: 'ghost' as const, 
          icon: 'Search' 
        }] : [{ 
          id: 'VIEW_CATALOG', 
          label: 'Przeglądaj katalog', 
          variant: 'ghost' as const, 
          icon: 'Search' 
        }]),
      ],
      dismissible: true,
    };
  },

  // 🔍 Recipe Matching - All Recipes Viewed
  ALL_RECIPES_VIEWED: (ctx = {}) => ({
    title: 'Wszystkie przepisy już obejrzane',
    description: ctx.viewedCount && ctx.totalRecipes
      ? `Obejrzałeś już ${ctx.viewedCount} z ${ctx.totalRecipes} dostępnych ${ctx.totalRecipes === 1 ? 'przepisu' : 'przepisów'} dla Twojej lodówki. Chcesz zobaczyć je od nowa?`
      : ctx.viewedCount 
        ? `Obejrzałeś już ${ctx.viewedCount} ${ctx.viewedCount === 1 ? 'przepis' : 'przepisów'}. Chcesz zobaczyć je od nowa?`
        : 'Przejrzałeś już wszystkie dostępne przepisy dla Twojej lodówki.',
    level: 'info',
    actions: [
      { id: 'RESET_VIEWED', label: 'Zobacz od nowa', variant: 'primary', icon: 'RefreshCw' },
      { id: 'ADD_PRODUCTS', label: 'Dodaj produkty', variant: 'secondary', icon: 'Plus' },
    ],
    dismissible: true,
  }),

  // 🔄 No More Recipes Available
  NO_MORE_RECIPES: (ctx = {}) => ({
    title: 'To już wszystkie przepisy',
    description: 'Przejrzałeś wszystkie dostępne przepisy dla Twojej lodówki. Możesz dodać więcej produktów, aby odblokować nowe możliwości!',
    level: 'info',
    actions: [
      { id: 'ADD_PRODUCTS', label: 'Dodaj produkty', variant: 'primary', icon: 'Plus' },
      { id: 'VIEW_FRIDGE', label: 'Zobacz lodówkę', variant: 'secondary', icon: 'Refrigerator' },
      { id: 'VIEW_CATALOG', label: 'Przeglądaj katalog', variant: 'ghost', icon: 'Search' },
    ],
    dismissible: true,
  }),

  // 🧊 Empty Fridge
  EMPTY_FRIDGE: (ctx = {}) => {
    const recipeCount = ctx.totalRecipes || 0;
    const getRecipeWord = (n: number) => {
      if (n === 1) return 'przepis';
      if (n >= 2 && n <= 4) return 'przepisy';
      return 'przepisów';
    };
    
    return {
      title: 'Lodówka jest pusta',
      description: recipeCount
        ? `W katalogu dostępnych jest ${recipeCount} ${getRecipeWord(recipeCount)}.\n\n💡 Dodaj produkty do lodówki, aby AI mogło znaleźć idealne przepisy dla Ciebie.`
        : '💡 Dodaj produkty do lodówki, aby AI mogło znaleźć idealne przepisy dla Ciebie.',
      level: 'info' as const,
      actions: [
        { id: 'ADD_PRODUCTS', label: 'Dodaj produkty', variant: 'primary' as const, icon: 'Plus' },
        ...(recipeCount ? [{ 
          id: 'VIEW_CATALOG', 
          label: `Zobacz katalog (${recipeCount} ${getRecipeWord(recipeCount)})`, 
          variant: 'ghost' as const, 
          icon: 'Search' 
        }] : [{ 
          id: 'VIEW_CATALOG', 
          label: 'Przeglądaj katalog', 
          variant: 'ghost' as const, 
          icon: 'Search' 
        }]),
      ],
      dismissible: true,
    };
  },

  // ⚠️ Few Ingredients Warning
  FEW_INGREDIENTS: (ctx = {}) => {
    const fridgeCount = ctx.fridgeItems || 0;
    const recipeCount = ctx.totalRecipes || 0;
    const getFridgeWord = (n: number) => {
      if (n === 1) return 'produkt';
      if (n >= 2 && n <= 4) return 'produkty';
      return 'produktów';
    };
    const getRecipeWord = (n: number) => {
      if (n === 1) return 'przepis';
      if (n >= 2 && n <= 4) return 'przepisy';
      return 'przepisów';
    };
    
    return {
      title: 'Mało składników w lodówce',
      description: fridgeCount && recipeCount
        ? `Masz tylko ${fridgeCount} ${getFridgeWord(fridgeCount)} w lodówce.\nW katalogu jest ${recipeCount} ${getRecipeWord(recipeCount)}.\n\n💡 Dodaj więcej produktów, aby dostać lepsze rekomendacje AI!`
        : fridgeCount
          ? `Masz tylko ${fridgeCount} ${getFridgeWord(fridgeCount)} w lodówce.\n\n💡 Dodaj więcej, aby dostać lepsze rekomendacje!`
          : '💡 Dodaj więcej składników, aby AI mogło znaleźć więcej przepisów.',
      level: 'warning' as const,
      actions: [
        { id: 'ADD_PRODUCTS', label: 'Dodaj produkty', variant: 'primary' as const, icon: 'Plus' },
        ...(recipeCount ? [{ 
          id: 'VIEW_CATALOG', 
          label: `Przeglądaj katalog (${recipeCount})`, 
          variant: 'ghost' as const, 
          icon: 'Search' 
        }] : []),
      ],
      dismissible: true,
    };
  },

  // ❌ Generic Failure (Network, 500, etc.)
  FETCH_FAILED: (ctx = {}) => ({
    title: 'Nie udało się pobrać danych',
    description: ctx.message || 'Sprawdź połączenie internetowe i spróbuj ponownie.',
    level: 'error',
    actions: [
      { id: 'RETRY', label: 'Spróbuj ponownie', variant: 'primary', icon: 'RefreshCw' },
    ],
    dismissible: true,
  }),

  // 🍳 Recipe Generation Failed
  RECIPE_GENERATION_FAILED: (ctx = {}) => ({
    title: 'Nie udało się wygenerować przepisu',
    description: ctx.message || 'AI nie mogło utworzyć przepisu. Spróbuj ponownie lub dodaj więcej produktów.',
    level: 'error',
    actions: [
      { id: 'RETRY', label: 'Spróbuj ponownie', variant: 'primary', icon: 'RefreshCw' },
      { id: 'ADD_PRODUCTS', label: 'Dodaj produkty', variant: 'secondary', icon: 'Plus' },
    ],
    dismissible: true,
  }),

  // 🔐 Authentication Required
  AUTH_REQUIRED: (ctx = {}) => {
    const recipeCount = ctx.totalRecipes || 0;
    const getRecipeWord = (n: number) => {
      if (n === 1) return 'przepis';
      if (n >= 2 && n <= 4) return 'przepisy';
      return 'przepisów';
    };
    
    return {
      title: 'Wymagana autoryzacja',
      description: recipeCount
        ? `W katalogu dostępnych jest ${recipeCount} ${getRecipeWord(recipeCount)}.\n\n💡 Zaloguj się, aby korzystać z AI Asystenta i generować spersonalizowane przepisy na podstawie Twojej lodówki.`
        : '💡 Zaloguj się, aby korzystać z AI Asystenta i generować przepisy.',
      level: 'warning' as const,
      actions: [
        { id: 'LOGIN', label: 'Zaloguj się', variant: 'primary' as const, icon: 'LogIn' },
        ...(recipeCount ? [{ 
          id: 'VIEW_CATALOG', 
          label: `Przeglądaj katalog (${recipeCount} ${getRecipeWord(recipeCount)})`, 
          variant: 'secondary' as const, 
          icon: 'Search' 
        }] : []),
      ],
      dismissible: false,
    };
  },

  // ✅ Recipe Created Successfully
  RECIPE_CREATED: (ctx = {}) => ({
    title: 'Przepis gotowy!',
    description: ctx.title 
      ? `Utworzono przepis: "${ctx.title}". Możesz go teraz ugotować lub zapisać na później.`
      : 'AI utworzyło dla Ciebie przepis na podstawie składników z lodówki.',
    level: 'success',
    actions: [
      { id: 'COOK_NOW', label: 'Ugotuj teraz', variant: 'primary', icon: 'ChefHat' },
      { id: 'SAVE_RECIPE', label: 'Zapisz', variant: 'secondary', icon: 'Save' },
    ],
    dismissible: true,
  }),

  // 🛒 Missing Ingredients
  MISSING_INGREDIENTS: (ctx = {}) => ({
    title: 'Brakuje składników',
    description: ctx.missingCount
      ? `Potrzebujesz jeszcze ${ctx.missingCount} ${ctx.missingCount === 1 ? 'składnik' : 'składników'}, aby ugotować ten przepis.`
      : 'Niektóre składniki nie są dostępne w Twojej lodówce.',
    level: 'warning',
    actions: [
      { id: 'ADD_TO_SHOPPING_LIST', label: 'Dodaj do listy zakupów', variant: 'primary', icon: 'ShoppingCart' },
      { id: 'ADD_TO_FRIDGE', label: 'Dodaj do lodówki', variant: 'secondary', icon: 'Plus' },
    ],
    dismissible: true,
  }),

  // 🎉 Recipe Cooked Successfully
  RECIPE_COOKED: (ctx = {}) => ({
    title: 'Smacznego!',
    description: ctx.usedValue && ctx.savedValue
      ? `Wykorzystano składniki o wartości ${ctx.usedValue} ${ctx.currency}. Uratowano ${ctx.savedValue} ${ctx.currency} przed marnowaniem!`
      : 'Przepis oznaczony jako ugotowany. Składniki zostały odjęte z lodówki.',
    level: 'success',
    actions: [
      { id: 'VIEW_FRIDGE', label: 'Sprawdź lodówkę', variant: 'ghost', icon: 'Refrigerator' },
    ],
    dismissible: true,
  }),

  // 📊 Low Budget Warning
  LOW_BUDGET: (ctx = {}) => ({
    title: 'Uwaga na budżet',
    description: ctx.remaining && ctx.limit
      ? `Zostało Ci ${ctx.remaining} ${ctx.currency} z ${ctx.limit} ${ctx.currency} tygodniowego budżetu.`
      : 'Zbliżasz się do limitu tygodniowego budżetu.',
    level: 'warning',
    actions: [
      { id: 'VIEW_WALLET', label: 'Zobacz portfel', variant: 'primary', icon: 'Wallet' },
      { id: 'ADJUST_BUDGET', label: 'Dostosuj budżet', variant: 'secondary', icon: 'Settings' },
    ],
    dismissible: true,
  }),

  // 🔄 Backend is Processing
  AI_PROCESSING: () => ({
    title: 'AI analizuje...',
    description: 'Przetwarzamy dane z Twojej lodówki. To może potrwać kilka sekund.',
    level: 'info',
    actions: [],
    dismissible: false,
  }),

  // 📝 No Saved Recipes
  NO_SAVED_RECIPES: () => ({
    title: 'Brak zapisanych przepisów',
    description: 'Nie masz jeszcze żadnych zapisanych przepisów. Zacznij od wygenerowania nowego lub przeglądnij katalog.',
    level: 'info',
    actions: [
      { id: 'GENERATE_RECIPE', label: 'Generuj przepis', variant: 'primary', icon: 'Sparkles' },
      { id: 'VIEW_CATALOG', label: 'Przeglądaj katalog', variant: 'secondary', icon: 'Search' },
    ],
    dismissible: true,
  }),

  // ⚠️ Expiring Ingredients
  EXPIRING_INGREDIENTS: (ctx = {}) => ({
    title: 'Produkty tracą świeżość',
    description: ctx.count
      ? `${ctx.count} ${ctx.count === 1 ? 'produkt traci' : 'produkty tracą'} świeżość. Znajdź przepis, zanim się zmarnują!`
      : 'Niektóre produkty w lodówce tracą świeżość.',
    level: 'warning',
    actions: [
      { id: 'FIND_URGENT_RECIPES', label: 'Znajdź przepisy', variant: 'primary', icon: 'Search' },
      { id: 'VIEW_FRIDGE', label: 'Sprawdź lodówkę', variant: 'secondary', icon: 'Refrigerator' },
    ],
    dismissible: true,
  }),
};

/**
 * 🔍 Get message by code
 * 
 * @param code - Message code from backend
 * @param context - Dynamic context data
 * @returns AIMessage object or null if code not found
 */
export function getAIMessage(code: string, context?: AIMessageContext): AIMessage | null {
  const generator = aiMessages[code];
  if (!generator) {
    console.warn(`⚠️ Unknown AI message code: "${code}"`);
    return null;
  }
  return generator(context);
}

/**
 * 🎨 Default fallback message for unknown codes
 */
export const FALLBACK_MESSAGE: AIMessage = {
  title: 'Informacja',
  description: 'AI Asystent ma dla Ciebie komunikat.',
  level: 'info',
  actions: [],
  dismissible: true,
};

/**
 * 🛒 Market-specific AI messages
 */
export const marketMessages: Record<string, AIMessageGenerator> = {
  MARKET_EMPTY: () => ({
    title: 'Rynek jest pusty',
    description: 'Nie znaleźliśmy dostępnych przepisów ani kursów. Sprawdź ponownie później lub dodaj swoje pierwsze produkty do katalogu.',
    level: 'info',
    actions: [
      { id: 'go_academy', label: 'Przejdź do Akademii', variant: 'primary', icon: 'ChefHat' },
    ],
    dismissible: false,
  }),
  
  MARKET_NO_RESULTS: (ctx = {}) => ({
    title: 'Nie znaleźliśmy wyników',
    description: ctx.search 
      ? `Nie znaleźliśmy przepisów zawierających "${ctx.search}". Spróbuj innego wyszukiwania.`
      : 'Nie znaleźliśmy przepisów spełniających wybrane kryteria.',
    level: 'info',
    actions: [
      { id: 'clear_search', label: 'Wyczyść wyszukiwanie', variant: 'secondary', icon: 'RefreshCw' },
    ],
    dismissible: true,
  }),
  
  MARKET_ERROR: (ctx = {}) => ({
    title: 'Błąd ładowania przepisów',
    description: ctx.error 
      ? `Nie udało się załadować przepisów: ${ctx.error}`
      : 'Wystąpił błąd podczas ładowania przepisów z serwera.',
    level: 'error',
    actions: [
      { id: 'retry', label: 'Spróbuj ponownie', variant: 'primary', icon: 'RefreshCw' },
      { id: 'go_back', label: 'Wróć', variant: 'secondary', icon: 'ArrowLeft' },
    ],
    dismissible: false,
  }),
};

// Merge market messages into main catalog
Object.assign(aiMessages, marketMessages);
