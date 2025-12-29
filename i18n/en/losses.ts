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
    totalLoss: "Total losses",
    avgLoss: "Average loss: {amount} PLN",
    loss: "{amount} PLN losses",
    averageLoss: "Average loss: {amount} PLN",
    noLosses: "No losses in this period",
  },

  // List section
  list: {
    title: "Utilized products",
    subtitle: "Chronological log of disposal events",
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

  // Event details
  event: {
    reason: "Reason",
    quantity: "Quantity",
    loss: "Loss",
    added: "Added",
    expired: "Expired",
    context: "Context",
  },
  
  // Reasons
  reason: {
    expired: "Expiry date passed",
    spoiled: "Product spoiled",
    forgotten: "Product forgotten",
    damaged: "Product damaged",
    mistake: "Mistake",
    other: "Other reason",
  },

  // Reasons (для getReasonLabel)
  reasons: {
    expired: "Expiry date passed",
    damaged: "Product damaged",
    spoiled: "Product spoiled",
    mistake: "Mistake",
  },
  
  // Messages
  messages: {
    loading: "Loading history...",
    error: "Error loading data",
    empty: "History is empty",
    emptyDescription: "Expired products will appear here.",
  },

  // Empty state
  empty: {
    title: "No recorded losses",
    description: "No utilizations in the last {days} days",
  },
  
  // Filters
  filters: {
    period: "Period",
    days7: "7 days",
    days30: "30 days",
    days90: "90 days",
    all: "All",
  },

  // Actions
  actions: {
    refresh: "Refresh",
    export: "Export",
  },
  
  // Charts (optional)
  charts: {
    byDay: "Losses by day",
    byWeek: "Losses by week",
    topLosses: "Top-3 most expensive losses",
  },
} as const;
