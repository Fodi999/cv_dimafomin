/**
 * Recipes translations (EN)
 */

export const recipes = {
  list: {
    title: "Recipes",
    subtitle: "Discover and create amazing dishes",
    search: "Search recipes...",
    filter: "Filter",
    sort: "Sort",
    viewGrid: "Grid view",
    viewList: "List view",
    noRecipes: "No recipes found",
    createFirst: "Create your first recipe",
  },

  filters: {
    title: "Filters",
    category: "Category",
    difficultyLabel: "Difficulty level",
    timeLabel: "Preparation time",
    cuisine: "Cuisine",
    diet: "Diet",
    clear: "Clear filters",
    apply: "Apply",
    
    categories: {
      all: "All",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      dessert: "Dessert",
      snack: "Snack",
      appetizer: "Appetizer",
      soup: "Soup",
      salad: "Salad",
      beverage: "Beverage",
    },

    difficultyOptions: {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
    },

    timeOptions: {
      under15: "Under 15 min",
      under30: "Under 30 min",
      under60: "Under 1 hour",
      over60: "Over 1 hour",
    },
  },

  sort: {
    newest: "Newest",
    oldest: "Oldest",
    popular: "Most popular",
    rated: "Highest rated",
    quickest: "Quickest",
  },

  card: {
    new: "New",
    featured: "Featured",
    premium: "Premium",
    saved: "Saved",
    servings: "servings",
    time: "min",
    difficulty: "Difficulty",
    rating: "Rating",
    reviews: "reviews",
    calories: "kcal",
    viewRecipe: "View recipe",
    saveRecipe: "Save",
    shareRecipe: "Share",
    editRecipe: "Edit",
    deleteRecipe: "Delete",
  },

  detail: {
    backToRecipes: "Back to recipes",
    overview: "Overview",
    ingredients: "Ingredients",
    instructions: "Instructions",
    nutrition: "Nutrition",
    reviews: "Reviews",
    
    info: {
      prepTime: "Prep time",
      cookTime: "Cook time",
      totalTime: "Total time",
      servings: "Servings",
      difficulty: "Difficulty",
      cuisine: "Cuisine",
      category: "Category",
      author: "Author",
      published: "Published",
      updated: "Updated",
    },

    actions: {
      print: "Print",
      save: "Save",
      share: "Share",
      report: "Report",
      edit: "Edit",
      delete: "Delete",
    },
  },

  ingredients: {
    title: "Ingredients",
    servings: "servings",
    adjust: "Adjust",
    shopingList: "Shopping list",
    addToList: "Add to list",
    removeFromList: "Remove from list",
    checkAll: "Check all",
    uncheckAll: "Uncheck all",
    
    units: {
      g: "g",
      kg: "kg",
      ml: "ml",
      l: "l",
      tsp: "tsp",
      tbsp: "tbsp",
      cup: "cup",
      piece: "pc",
      pinch: "pinch",
      taste: "to taste",
    },
    
    // Recipe detail page
    inFridge: "in fridge",
    missing: "missing",
    youHave: "you have",
    addMissingToFridge: "Add missing to fridge",
    addingToFridge: "Adding to fridge...",
    readyToCook: "Ready to cook!",
    cookNow: "Cook now",
    listEmpty: "Ingredient list coming soon",
    listEmptyDesc: "We're working on adding detailed recipe information",
  },

  // Recipe Match Cards (for /recipes page)
  match: {
    source: "Recipe from catalog",
    canCookNow: "Can cook now",
    missingIngredients: "Missing {count} {ingredientWord}",
    ingredientSingular: "ingredient",
    ingredientPlural: "ingredients",
    notInFridge: "Not in fridge",
    fromFridge: "From fridge",
    toBuy: "To buy",
    costToBuy: "Cost to buy",
    economy: "Economy",
    valueFromFridge: "Value from fridge",
    totalCost: "Total cost",
    wasteRiskSaved: "Saved from waste",
    cooking: "Cooking...",
    cook: "Cook",
    addToShoppingList: "Add to shopping list",
    missingWarning: "Missing {count} ingredients. Buy them to cook this recipe.",
    servingSingular: "serving",
    servingPlural: "servings",
    decreaseServings: "Decrease servings",
    increaseServings: "Increase servings",
    more: "more",
  },

  instructions: {
    title: "Instructions",
    step: "Step",
    timer: "Timer",
    startTimer: "Start timer",
    stopTimer: "Stop timer",
    markComplete: "Mark as complete",
    markIncomplete: "Mark as incomplete",
    previous: "Previous",
    next: "Next",
    finish: "Finish",
  },

  // Loading & Error states
  loading: {
    loadingRecipe: "Loading recipe...",
    loadingError: "Loading error",
    recipeNotFound: "Recipe not found",
  },

  nutrition: {
    title: "Nutrition facts",
    perServing: "Per serving",
    calories: "Calories",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    fiber: "Fiber",
    sugar: "Sugar",
    sodium: "Sodium",
    cholesterol: "Cholesterol",
    vitamins: "Vitamins",
    minerals: "Minerals",
  },

  reviews: {
    title: "Reviews",
    writeReview: "Write a review",
    rating: "Rating",
    comment: "Comment",
    commentPlaceholder: "Share your thoughts about this recipe...",
    submit: "Submit",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    helpful: "Helpful",
    notHelpful: "Not helpful",
    report: "Report",
    noReviews: "No reviews yet",
    beFirst: "Be the first to write a review!",
    
    filter: {
      all: "All",
      positive: "Positive",
      critical: "Critical",
      recent: "Recent",
    },
  },

  form: {
    createTitle: "Create recipe",
    editTitle: "Edit recipe",
    
    basic: {
      title: "Basic information",
      name: "Recipe name",
      namePlaceholder: "e.g. Spaghetti Carbonara",
      description: "Description",
      descriptionPlaceholder: "Short recipe description...",
      category: "Category",
      cuisine: "Cuisine",
      difficulty: "Difficulty level",
      servings: "Number of servings",
      prepTime: "Prep time (min)",
      cookTime: "Cook time (min)",
    },

    media: {
      title: "Photos and video",
      mainImage: "Main photo",
      additionalImages: "Additional photos",
      video: "Video link",
      upload: "Upload",
      remove: "Remove",
    },

    ingredients: {
      title: "Ingredients",
      add: "Add ingredient",
      remove: "Remove",
      name: "Name",
      amount: "Amount",
      unit: "Unit",
      notes: "Notes",
      group: "Group",
      addGroup: "Add group",
    },

    instructions: {
      title: "Instructions",
      add: "Add step",
      remove: "Remove",
      step: "Step",
      description: "Description",
      image: "Image (optional)",
      timer: "Timer (optional)",
      timerPlaceholder: "Time in minutes",
    },

    nutrition: {
      title: "Nutrition facts (optional)",
      calories: "Calories",
      protein: "Protein (g)",
      carbs: "Carbs (g)",
      fat: "Fat (g)",
      fiber: "Fiber (g)",
      sugar: "Sugar (g)",
      sodium: "Sodium (mg)",
    },

    tags: {
      title: "Tags",
      placeholder: "Add tags separated by commas",
      suggestions: "Suggested",
    },

    visibility: {
      title: "Visibility",
      public: "Public",
      publicDescription: "Visible to all users",
      private: "Private",
      privateDescription: "Visible only to you",
      unlisted: "Unlisted",
      unlistedDescription: "Available only via link",
    },

    actions: {
      saveDraft: "Save draft",
      preview: "Preview",
      publish: "Publish",
      update: "Update",
      cancel: "Cancel",
      delete: "Delete recipe",
    },
  },

  cooking: {
    title: "Cooking",
    loading: "Checking your fridge...",
    
    stats: {
      canCookNow: "Can cook now",
      almostReady: "Almost ready",
      needShopping: "Need shopping",
      basedOnFridge: "Based on your fridge, we show what you can cook right now",
    },
    
    sections: {
      canCook: {
        title: "Can cook now",
        description: "You have all ingredients",
      },
      almostCook: {
        title: "Almost ready",
        description: "Missing 1-2 ingredients",
      },
      needToBuy: {
        title: "Need shopping",
        description: "Missing more ingredients",
      },
    },
    
    empty: {
      title: "Your fridge is empty",
      description: "Add ingredients to your fridge to see what you can cook",
      action: "Go to fridge",
    },
    
    actions: {
      cookNow: "Cook now",
      viewRecipe: "View recipe",
      addToCart: "Add missing",
    },
  },

  // AI Recommendation Card
  recommendation: {
    title: "AI Recommendation",
    subtitle: "Best recipe for now",
    canCookNow: "You can cook now",
    missing: "Missing",
    missingIngredients: {
      one: "ingredient",
      few: "ingredients",
      many: "ingredients",
    },
    matchPercentage: "match",
    servings: "servings",
    servingsLabel: {
      one: "serving",
      few: "servings",
      many: "servings",
    },
    ingredients: "Ingredients",
    inFridge: "You have in fridge",
    needToBuy: "Need to buy",
    instructions: "Preparation method",
    economy: "Economy",
    costToBuy: "Cost to buy",
    total: "Total",
    costPerServing: "Cost per serving",
    budgetWarning: "That's {{percent}}% of your weekly budget",
    wasteSavings: "Savings (preventing waste)",
    whyThisRecipe: "Why this recipe?",
    whyExplanation: {
      hasInFridge: "you have {{count}} ingredients in fridge",
      coverage: "{{percent}}% coverage",
      canCookNow: "you can cook right away",
      needToBuy: "just need to buy {{count}} ingredients",
      quickPrep: "preparation takes only {{time}} minutes",
    },
    actions: {
      cook: "Cook",
      cooking: "Cooking...",
      addToCart: "Add to cart",
      save: "Save",
      saving: "Saving...",
      refresh: "Refresh",
      more: "more...",
    },
  },

  messages: {
    createSuccess: "Recipe created",
    createError: "Error creating recipe",
    updateSuccess: "Recipe updated",
    updateError: "Error updating recipe",
    deleteSuccess: "Recipe deleted",
    deleteError: "Error deleting recipe",
    saveSuccess: "Recipe saved",
    saveError: "Error saving recipe",
    reviewSuccess: "Review added",
    reviewError: "Error adding review",
  },
} as const;
