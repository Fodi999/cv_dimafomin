/**
 * Decision Engine messages with multi-language support
 */

export type Locale = "pl" | "en" | "ru";
export type AIGoal = "cook_now" | "expiring_soon" | "save_money" | "quick_meal";

export const DECISION_ENGINE_MESSAGES = {
  cook_now: {
    pl: "Znalazłem przepisy, które możesz ugotować TERAZ z lodówki!",
    en: "I found recipes you can cook NOW from your fridge!",
    ru: "Я нашел рецепты, которые ты можешь приготовить СЕЙЧАС из холодильника!"
  },
  expiring_soon: {
    pl: "Te produkty psują się w ciągu 24h - użyj je jak najszybciej!",
    en: "These products expire within 24h - use them ASAP!",
    ru: "Эти продукты портятся в течение 24ч - используй их как можно скорее!"
  },
  save_money: {
    pl: "Gotuj z tego co masz - zero dodatkowych zakupów!",
    en: "Cook with what you have - zero extra shopping!",
    ru: "Готовь из того что есть - никаких дополнительных покупок!"
  },
  quick_meal: {
    pl: "Szybkie dania gotowe w 30 minut lub mniej!",
    en: "Quick meals ready in 30 minutes or less!",
    ru: "Быстрые блюда готовы за 30 минут или меньше!"
  }
};

export const RECIPE_REASONS = {
  cook_now: {
    hasAll: {
      pl: "Masz wszystkie składniki w lodówce",
      en: "You have all ingredients in the fridge",
      ru: "У тебя есть все ингредиенты в холодильнике"
    },
    partial: (matchPercent: number) => ({
      pl: `Masz ${matchPercent}% składników - reszta to podstawowe produkty`,
      en: `You have ${matchPercent}% of ingredients - rest are basic items`,
      ru: `У тебя ${matchPercent}% ингредиентов - остальное базовые продукты`
    })
  },
  expiring_soon: {
    critical: {
      pl: "Zużywa produkty, które psują się dziś!",
      en: "Uses products that expire today!",
      ru: "Использует продукты, которые портятся сегодня!"
    },
    warning: {
      pl: "Zużywa produkty z krótkim terminem",
      en: "Uses products with short expiry",
      ru: "Использует продукты с коротким сроком"
    },
    default: {
      pl: "Najlepsza opcja na wykorzystanie produktów",
      en: "Best option to use your products",
      ru: "Лучший вариант использовать продукты"
    }
  },
  save_money: {
    noShopping: {
      pl: "Zero dodatkowych zakupów - oszczędzasz 100%",
      en: "Zero extra shopping - you save 100%",
      ru: "Никаких дополнительных покупок - экономишь 100%"
    },
    saved: (saved: number) => ({
      pl: `Oszczędzasz ${saved.toFixed(2)} PLN używając produktów z lodówki`,
      en: `You save ${saved.toFixed(2)} PLN using fridge products`,
      ru: `Экономишь ${saved.toFixed(2)} PLN используя продукты из холодильника`
    }),
    default: {
      pl: "Maksymalne wykorzystanie tego co masz",
      en: "Maximum use of what you have",
      ru: "Максимальное использование того что есть"
    }
  },
  quick_meal: (time: number) => ({
    pl: `Gotowe w ${time} minut - proste i szybkie`,
    en: `Ready in ${time} minutes - simple and fast`,
    ru: `Готово за ${time} минут - просто и быстро`
  })
};

/**
 * Get message for goal in specified language
 */
export function getMessageForGoal(goal: AIGoal, language: Locale): string {
  return DECISION_ENGINE_MESSAGES[goal][language];
}

/**
 * Get reason why this recipe matches the goal
 */
export function getReasonForGoal(goal: AIGoal, recipe: any, language: Locale): string {
  const hasAllIngredients = recipe.ingredientsMissing?.length === 0;
  const matchPercent = recipe.matchPercentage || 0;
  
  switch (goal) {
    case "cook_now":
      return hasAllIngredients 
        ? RECIPE_REASONS.cook_now.hasAll[language]
        : RECIPE_REASONS.cook_now.partial(matchPercent)[language];
    
    case "expiring_soon":
      if (recipe.expiryPriority === "critical") {
        return RECIPE_REASONS.expiring_soon.critical[language];
      }
      if (recipe.expiryPriority === "warning") {
        return RECIPE_REASONS.expiring_soon.warning[language];
      }
      return RECIPE_REASONS.expiring_soon.default[language];
    
    case "save_money":
      if (hasAllIngredients) {
        return RECIPE_REASONS.save_money.noShopping[language];
      }
      const saved = recipe.economy?.savedMoney || 0;
      if (saved > 0) {
        return RECIPE_REASONS.save_money.saved(saved)[language];
      }
      return RECIPE_REASONS.save_money.default[language];
    
    case "quick_meal":
      const time = recipe.timeMinutes || recipe.cookingTime || 30;
      return RECIPE_REASONS.quick_meal(time)[language];
    
    default:
      const defaults = {
        pl: "Dopasowane do Twoich produktów",
        en: "Matched to your products",
        ru: "Подобрано под твои продукты"
      };
      return defaults[language];
  }
}
