/**
 * Fridge translations (EN)
 * Холодильник, продукты, сроки годности
 */

export const fridge = {
  // Page title
  title: "Fridge",
  subtitle: "Manage ingredients and expiry dates",
  backButton: "Back",
  
  // Stats
  stats: {
    products: "Products",
    fridgeValue: "Fridge Value",
    lossRisk: "Loss Risk",
    quickUse: "Products for quick use",
    noPrices: "No prices",
  },
  
  // Categories
  categories: {
    title: "Browse products by category",
    all: "All",
    meat: "Meat",
    dairy: "Dairy",
    vegetables: "Vegetables",
    fruits: "Fruits",
    other: "Other",
  },
  
  // Item properties
  item: {
    quantity: "Quantity",
    pricePerKg: "Price/kg",
    pricePerL: "Price/l",
    totalCost: "Total cost",
    expiryDate: "Expiry date",
    addedDate: "Added",
    noExpiryDate: "No date",
    stable: "stable",
  },
  
  // Item status
  status: {
    expired: "Expired",
    critical: "Use soon",
    fresh: "Fresh",
    unknown: "Unknown status",
    dontUse: "Don't use",
    useNow: "Use now",
    daysLeft: "{days} day left",
    daysLeftPlural: "{days} days left",
    stillDays: "{days} day left",
    stillDaysPlural: "{days} days left",
  },
  
  // Warnings
  warnings: {
    quickUseTitle: "⚠️ Products requiring quick use",
    quickUseMessage: "Products worth {amount} PLN will spoil soon. AI can suggest what to cook with them.",
    hint: "Hint: Products with short expiry dates will be marked with a warning — AI will suggest what to cook first.",
  },
  
  // Losses summary (for fridge page)
  lossesSummary: {
    title: "⚠️ Losses in the last {days} days",
    products: "products",
    totalLoss: "loss",
    viewHistory: "View history",
  },
  
  // Actions
  actions: {
    addProduct: "Add product",
    editProduct: "Edit product",
    deleteProduct: "Delete product",
    updatePrice: "Update price",
    updateQuantity: "Update quantity",
    viewPriceHistory: "View price history",
    generateRecipe: "Generate AI recipe",
  },
  
  // Messages
  messages: {
    loading: "Loading products...",
    error: "Error loading products",
    empty: "Your fridge is empty",
    addSuccess: "✅ Product added to fridge!",
    deleteSuccess: "Product deleted",
    updateSuccess: "Product updated",
  },
  
  // Form
  form: {
    productName: "Product name",
    category: "Category",
    quantity: "Quantity",
    unit: "Unit",
    price: "Price",
    expiryDate: "Expiry date",
    optional: "Optional",
    save: "Save",
    cancel: "Cancel",
  },
} as const;
