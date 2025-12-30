/**
 * Fridge translations (EN)
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
    bread: "Bread",
    drinks: "Drinks",
    fish: "Fish",
    other: "Other",
    
    // 🔥 Backend category mapping (Polish → English)
    "Mięso": "Meat",
    "Nabiał": "Dairy",
    "Warzywa": "Vegetables",
    "Owoce": "Fruits",
    "Pieczywo": "Bread",
    "Napoje": "Drinks",
    "Ryby": "Fish",
    "Inne": "Other",
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
    invalidDate: "Invalid date",
    dateError: "Date error",
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
    deleteSuccess: "✅ Product deleted!",
    updateSuccess: "Product updated",
    priceUpdated: "✅ Price updated!",
    quantityUpdated: "✅ Quantity updated!",
    deleteError: "Error deleting product",
    priceError: "Error updating price",
    quantityError: "Error updating quantity",
    authRequired: "Authorization required",
    authRequiredDesc: "Log in to manage your fridge",
    loginButton: "Log in",
  },

  // Price modal
  priceModal: {
    title: "Add price",
    priceFor: "Price per:",
    amount: "Amount:",
    amountPlaceholder: "e.g. 3.20",
    estimatedValue: "Estimated product value:",
    invalidPrice: "Enter a valid price (greater than 0)",
    saving: "Saving...",
    save: "Save price",
    cancel: "Cancel",
    saveError: "Error saving price",
    units: {
      kg: "kilogram (kg)",
      l: "liter (l)",
      szt: "piece (pc)",
    },
  },
  
  // Form
  form: {
    productName: "Product name",
    productLabel: "Product",
    searchPlaceholder: "Search for product (e.g. milk, eggs)...",
    selectedProduct: "Selected product",
    unit: "Unit",
    expiryDate: "Expiry date",
    expiryInDays: "{{days}} days",
    category: "Category",
    quantity: "Quantity",
    quantityPlaceholder: "e.g. 500 {{unit}}",
    selectProductFirst: "Select a product first",
    priceLabel: "Price",
    priceRecommended: "(recommended - for savings calculations)",
    pricePlaceholder: "e.g. 50",
    pricePerLabel: "PLN per",
    priceWarning: "Without price we won't show how much you save on recipes. Add price to see real savings!",
    selectProduct: "Select a product from the list",
    invalidQuantity: "Enter a valid quantity (greater than 0)",
    addError: "Error adding product",
    adding: "Adding...",
    addButton: "Add to fridge",
    optional: "Optional",
    save: "Save",
    cancel: "Cancel",
    addToFridgeTitle: "Add product to fridge",
    addToFridgeDesc: "Search for a product and enter quantity. Backend will automatically calculate expiry date.",
    updatePriceTitle: "Add product price",
    updatePriceDesc: "Enter price per selected unit. System will automatically calculate total value.",
    updateQuantityTitle: "Change product quantity",
    updateQuantityDesc: "Update product quantity. Total price will be recalculated automatically.",
    currency: "Currency",
    estimatedTotal: "Estimated total cost:",
    noResults: "No products found for",
    tryDifferentName: "Try entering a different name",
  },
  
  // Flow CTAs
  flow: {
    whatNext: "What now? 🎯",
    checkRecipes: "Check what you can cook",
    askAI: "Ask AI what to do",
  },
  
  // Empty state
  emptyState: {
    title: "Add products to:",
    reason1: "Get AI recipe suggestions",
    reason2: "Use products before expiry",
    reason3: "Avoid buying duplicates",
  },
  
  emptyCategory: "No products in category {{category}}",
} as const;
