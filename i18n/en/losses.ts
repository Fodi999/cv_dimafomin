/**
 * Losses translations (EN)
 * История потерь, утилизация продуктов
 */

export const losses = {
  // Page
  title: "Loss History",
  subtitle: "Kitchen economy analysis",
  backButton: "Back",
  
  // Navigation
  nav: {
    label: "Losses",
    description: "Product disposal history",
  },
  
  // Summary
  summary: {
    title: "Last {days} days",
    products: "{count} product",
    productsPlural: "{count} products",
    loss: "{amount} PLN losses",
    averageLoss: "Average loss: {amount} PLN",
    noLosses: "No losses in this period",
  },
  
  // Card
  card: {
    reason: "Reason",
    quantity: "Quantity",
    loss: "Loss",
    added: "Added",
    expired: "Expired",
    context: "Context",
    contextFridge: "Fridge",
  },
  
  // Reasons
  reason: {
    expired: "Expiry date passed",
    spoiled: "Product spoiled",
    forgotten: "Product forgotten",
    other: "Other reason",
  },
  
  // Messages
  messages: {
    loading: "Loading history...",
    error: "Error loading data",
    empty: "History is empty",
    emptyDescription: "Expired products will appear here.",
  },
  
  // Filters
  filters: {
    period: "Period",
    days7: "7 days",
    days30: "30 days",
    days90: "90 days",
    all: "All",
  },
  
  // Charts (optional)
  charts: {
    byDay: "Losses by day",
    byWeek: "Losses by week",
    topLosses: "Top-3 most expensive losses",
  },
} as const;
