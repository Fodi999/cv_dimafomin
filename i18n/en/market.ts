/**
 * English translations - Market domain
 */

export const market = {
  // Hero section
  title: "Recipe Market",
  subtitle: "Discover and purchase original recipes from the best chefs",
  searchPlaceholder: "Search recipes...",
  
  // Filters
  filters: {
    all: "All",
    difficulty: "Difficulty level",
    cuisine: "Cuisine",
    dietary: "Diet",
    time: "Preparation time"
  },
  
  // Recipe card
  card: {
    buy: "Buy now",
    preview: "Preview",
    author: "Author",
    difficulty: "Difficulty",
    time: "Time",
    servings: "Servings",
    price: "Price",
    chefTokens: "ChefTokens"
  },
  
  // Common
  loading: "Loading...",
  error: "Error loading recipes",
  noResults: "No recipes found",
  
  // Purchase
  purchase: {
    success: "Recipe purchased!",
    error: "Purchase error",
    insufficient: "Insufficient ChefTokens"
  }
} as const;
