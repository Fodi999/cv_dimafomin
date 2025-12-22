/**
 * Unified Notice Catalog
 * 
 * Single source of truth for all notification texts.
 * Ensures consistent "bot voice" across the app.
 */

import type { Notice, NoticeAction } from "./types";

export type NoticeCatalogKey =
  | "NO_RECIPES"
  | "NO_RECIPES_EMPTY_FRIDGE"
  | "NO_RECIPES_ALL_VIEWED"
  | "FETCH_FAILED"
  | "NETWORK_ERROR"
  | "RECIPE_SAVED"
  | "RECIPE_COOKED"
  | "AUTH_REQUIRED"
  | "FRIDGE_UPDATED"
  | "INGREDIENTS_ADDED"
  | "INVALID_DATA";

type NoticeCatalogEntry = {
  title: string;
  description: string;
  level: Notice["level"];
  kind: Notice["kind"];
};

export const NoticeCatalog: Record<NoticeCatalogKey, NoticeCatalogEntry> = {
  // Recipe matching states
  NO_RECIPES: {
    title: "Nie znaleźliśmy pasującego przepisu",
    description: "Dodaj kilka podstawowych składników lub zobacz zapisane przepisy",
    level: "info",
    kind: "hint",
  },
  NO_RECIPES_EMPTY_FRIDGE: {
    title: "Twoja lodówka jest pusta",
    description: "Dodaj 3–5 podstawowych produktów, aby AI mogło polecić przepisy",
    level: "warning",
    kind: "hint",
  },
  NO_RECIPES_ALL_VIEWED: {
    title: "Obejrzałeś wszystkie dopasowane przepisy",
    description: "Dodaj więcej składników lub kliknij 'Odśwież' aby zacząć od nowa",
    level: "info",
    kind: "hint",
  },

  // Network/API errors
  FETCH_FAILED: {
    title: "Coś poszło nie tak",
    description: "Nie udało się pobrać danych. Spróbuj ponownie za chwilę",
    level: "error",
    kind: "toast",
  },
  NETWORK_ERROR: {
    title: "Brak połączenia",
    description: "Sprawdź połączenie internetowe i spróbuj ponownie",
    level: "error",
    kind: "toast",
  },

  // Success states
  RECIPE_SAVED: {
    title: "Przepis zapisany!",
    description: "Znajdziesz go w sekcji 'Zapisane przepisy'",
    level: "success",
    kind: "toast",
  },
  RECIPE_COOKED: {
    title: "Smacznego!",
    description: "Składniki zostały odjęte z lodówki",
    level: "success",
    kind: "toast",
  },
  FRIDGE_UPDATED: {
    title: "Lodówka zaktualizowana",
    description: "Zmiany zostały zapisane",
    level: "success",
    kind: "toast",
  },
  INGREDIENTS_ADDED: {
    title: "Składniki dodane",
    description: "Produkty zostały dodane do lodówki",
    level: "success",
    kind: "toast",
  },

  // Validation/auth errors
  AUTH_REQUIRED: {
    title: "Wymagana autoryzacja",
    description: "Zaloguj się, aby kontynuować",
    level: "warning",
    kind: "toast",
  },
  INVALID_DATA: {
    title: "Błąd w danych",
    description: "Sprawdź czy wszystkie pola są wypełnione poprawnie",
    level: "error",
    kind: "toast",
  },
};

/**
 * Helper: Build common actions for hints
 */
export const CommonActions = {
  goToFridge: (): NoticeAction => ({
    label: "Dodaj produkty",
    onClick: () => {
      if (typeof window !== "undefined") {
        window.location.href = "/fridge";
      }
    },
    variant: "primary",
  }),

  goToSavedRecipes: (): NoticeAction => ({
    label: "Zobacz zapisane",
    onClick: () => {
      if (typeof window !== "undefined") {
        window.location.href = "/recipes/saved";
      }
    },
    variant: "secondary",
  }),

  goToCatalog: (): NoticeAction => ({
    label: "Przeglądaj katalog",
    onClick: () => {
      if (typeof window !== "undefined") {
        window.location.href = "/recipes";
      }
    },
    variant: "secondary",
  }),

  dismiss: (onDismiss?: () => void): NoticeAction => ({
    label: "Zamknij",
    onClick: () => onDismiss?.(),
    variant: "ghost",
  }),

  retry: (onRetry: () => void): NoticeAction => ({
    label: "Spróbuj ponownie",
    onClick: onRetry,
    variant: "primary",
  }),

  refresh: (onRefresh: () => void): NoticeAction => ({
    label: "Odśwież",
    onClick: onRefresh,
    variant: "primary",
  }),
};

/**
 * Helper: Get notice by code with optional action overrides
 */
export function getNotice(
  code: NoticeCatalogKey,
  overrides?: Partial<Notice>
): Notice {
  const catalog = NoticeCatalog[code];

  return {
    code,
    title: catalog.title,
    description: catalog.description,
    level: catalog.level,
    kind: catalog.kind,
    dismissible: true,
    ...overrides,
  };
}

/**
 * Helper: Translate English backend messages to Polish
 * (temporary solution until backend returns Polish messages)
 */
export function translateBackendMessage(message: string): string {
  const translations: Record<string, string> = {
    // Recipe matching messages
    "We couldn't find any recipes matching your fridge. Try adding more ingredients!": 
      "Nie znaleźliśmy przepisów pasujących do Twojej lodówki. Spróbuj dodać więcej składników!",
    
    "No recipes found for your fridge":
      "Nie znaleziono przepisów dla Twojej lodówki",
    
    "Try adding more ingredients":
      "Spróbuj dodać więcej składników",
    
    "Add more ingredients or check saved recipes":
      "Dodaj więcej składników lub zobacz zapisane przepisy",
    
    // Error messages
    "Failed to fetch recipes":
      "Nie udało się pobrać przepisów",
    
    "Network error":
      "Błąd sieci",
    
    "Authorization required":
      "Wymagana autoryzacja",
    
    // Success messages
    "Recipe saved successfully":
      "Przepis zapisany pomyślnie",
    
    "Recipe cooked successfully":
      "Przepis ugotowany pomyślnie",
  };

  // Return translated message if exists, otherwise return original
  return translations[message] || message;
}
