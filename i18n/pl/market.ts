/**
 * Polish translations - Market domain
 * Tłumaczenia polskie - domena Rynek przepisów
 */

export const market = {
  // Hero section
  title: "Rynek Przepisów",
  subtitle: "Odkryj i kup autorskie przepisy od najlepszych kucharzy",
  searchPlaceholder: "Szukaj przepisów...",
  
  // Filters
  filters: {
    all: "Wszystkie",
    difficulty: "Poziom trudności",
    cuisine: "Kuchnia",
    dietary: "Dieta",
    time: "Czas przygotowania"
  },
  
  // Recipe card
  card: {
    buy: "Kup teraz",
    preview: "Podgląd",
    author: "Autor",
    difficulty: "Trudność",
    time: "Czas",
    servings: "Porcje",
    price: "Cena",
    chefTokens: "ChefTokens"
  },
  
  // Common
  loading: "Ładowanie...",
  error: "Błąd ładowania przepisów",
  noResults: "Nie znaleziono przepisów",
  
  // Purchase
  purchase: {
    success: "Przepis zakupiony!",
    error: "Błąd zakupu",
    insufficient: "Niewystarczająca ilość ChefTokens"
  }
} as const;
