/**
 * Profile translations (EN)
 */

export const profile = {
  // Profile Page (Dashboard)
  page: {
    title: "Profile",
    backButton: "Back",
    subtitle: "💼 Your kitchen management center",
    loading: "Loading profile...",
    notLoggedIn: "You must be logged in to view profile",
    loginButton: "Log in",
    editProfile: "Edit profile",
    editShort: "Edit",
    settings: "Settings",
    settingsShort: "Settings",
  },

  // KPI Cards (Hero Metrics)
  kpi: {
    savedMoney: {
      label: "💰 Saved",
      thisMonth: "This month",
      currency: "PLN",
    },
    cookedRecipes: {
      label: "Cooked",
      unit: "recipes",
    },
    fridgeItems: {
      label: "In fridge",
      unit: "products",
    },
    chefTokens: {
      label: "ChefTokens",
      unit: "CT",
    },
  },

  // Progress & Level
  progress: {
    level: "Level",
    levelNumber: "Level {level}",
    xpProgress: "{current} / {max} XP",
    toNextLevel: "{percent}% to next level",
  },

  // Weekly Budget
  budget: {
    title: "Weekly budget",
    spent: "{spent} / {total} PLN",
    remaining: "✅ Great! {amount} PLN remaining",
    overBudget: "⚠️ Over budget by {amount} PLN",
  },

  // Tabs
  tabs: {
    overview: "Overview",
    stats: "Statistics",
    resources: "Resources",
  },

  // Overview Tab
  overview: {
    lastActions: "Recent activities",
    noActions: "No recent activities",
    whatNext: "What's next?",
  },

  // Activity Types
  activities: {
    dishCooked: "Cooked: {dish}",
    productAdded: "Added: {product}",
    recipesSaved: "Saved recipe: {recipe}",
    courseCompleted: "Completed course: {course}",
  },

  // Collective Insight (AI-mediated social layer)
  collectiveInsight: {
    title: "🧠 How other chefs at your stage think",
    subtitle: "Anonymous observations based on other users' decisions",
    footer: "Anonymously aggregated from community activity",
    insights: [
      "Many level 1 users are now focusing more on managing their fridge than on new recipes.",
      "There's often a need to simplify techniques rather than complicate them.",
      "This is a good time to start controlling costs without losing flavor.",
    ],
  },

  header: {
    title: "Profile",
    subtitle: "Manage your account and settings",
    editProfile: "Edit profile",
    viewPublicProfile: "View public profile",
  },

  info: {
    name: "Name",
    email: "Email",
    phone: "Phone",
    bio: "Bio",
    bioPlaceholder: "Tell us about yourself...",
    location: "Location",
    locationPlaceholder: "City, country",
    website: "Website",
    websitePlaceholder: "https://your-website.com",
    joined: "Joined",
    save: "Save changes",
    cancel: "Cancel",
  },

  avatar: {
    upload: "Upload photo",
    change: "Change photo",
    remove: "Remove photo",
    uploading: "Uploading...",
    uploadSuccess: "Photo uploaded",
    uploadError: "Upload error",
    maxSize: "Maximum size: 5MB",
    allowedFormats: "Allowed formats: JPG, PNG, GIF",
  },

  settings: {
    title: "Settings",
    subtitle: "Simple settings. Smart action.",
    backButton: "Back",
    loading: "Loading settings...",
    saving: "Saving...",
    
    // Sections
    sections: {
      core: {
        label: "Core",
        description: "Language, time, units",
      },
      ai: {
        label: "AI & Mentor",
        description: "Assistant style",
      },
      notifications: {
        label: "Notifications",
        description: "Important reminders",
      },
    },
    
    general: {
      title: "General",
      language: "Language",
      languageDescription: "Affects: UI, texts, AI responses, hints, errors",
      timeFormat: "Time Format",
      timeFormatDescription: "Choose time display format",
      timeFormat12h: "12-hour",
      timeFormat24h: "24-hour",
      units: "Units",
      unitsDescription: "Important for recipes and AI",
      unitsMetric: "Metric (g, ml)",
      unitsKitchen: "Imperial (cups, oz)",
      theme: "Theme",
      themeDescription: "Choose light or dark theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      timezone: "Timezone",
      timezoneDescription: "Select your timezone",
      autoSave: "Changes are saved automatically and applied immediately",
    },

    notifications: {
      title: "Notifications",
      emailNotifications: "Email notifications",
      emailNotificationsDescription: "Receive updates via email",
      pushNotifications: "Push notifications",
      pushNotificationsDescription: "Receive browser notifications",
      courseUpdates: "Course updates",
      courseUpdatesDescription: "Notifications about new courses and materials",
      marketingEmails: "Marketing emails",
      marketingEmailsDescription: "Receive promotional messages and news",
    },

    privacy: {
      title: "Privacy",
      publicProfile: "Public profile",
      publicProfileDescription: "Your profile will be visible to other users",
      showEmail: "Show email",
      showEmailDescription: "Your email will be visible in public profile",
      showActivity: "Show activity",
      showActivityDescription: "Your activity will be visible to others",
    },

    security: {
      title: "Security",
      changePassword: "Change password",
      currentPassword: "Current password",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      twoFactor: "Two-factor authentication",
      twoFactorDescription: "Extra security layer for your account",
      enable: "Enable",
      disable: "Disable",
      sessions: "Active sessions",
      sessionsDescription: "Manage devices logged into your account",
      logoutAll: "Log out all devices",
    },

    danger: {
      title: "Danger zone",
      deleteAccount: "Delete account",
      deleteAccountDescription: "Permanently delete your account and all data",
      deleteButton: "Delete account",
      deleteConfirm: "Are you sure you want to delete your account?",
      deleteWarning: "This action is irreversible. All your data will be permanently deleted.",
      typeToConfirm: "Type 'DELETE' to confirm",
    },
  },

  health: {
    title: "Health data",
    subtitle: "Help us personalize nutrition recommendations",
    
    basic: {
      title: "Basic information",
      age: "Age",
      agePlaceholder: "Your age",
      gender: "Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      preferNotToSay: "Prefer not to say",
      height: "Height",
      heightPlaceholder: "cm",
      weight: "Weight",
      weightPlaceholder: "kg",
    },

    activity: {
      title: "Activity level",
      sedentary: "Sedentary",
      sedentaryDescription: "Little or no physical activity",
      light: "Light activity",
      lightDescription: "Exercise 1-3 times per week",
      moderate: "Moderate activity",
      moderateDescription: "Exercise 3-5 times per week",
      active: "Active",
      activeDescription: "Exercise 6-7 times per week",
      veryActive: "Very active",
      veryActiveDescription: "Intense exercise daily",
    },

    goals: {
      title: "Nutrition goals",
      loseWeight: "Lose weight",
      maintainWeight: "Maintain weight",
      gainWeight: "Gain weight",
      buildMuscle: "Build muscle",
      improveHealth: "Improve health",
      other: "Other",
    },

    dietary: {
      title: "Dietary preferences",
      vegetarian: "Vegetarian",
      vegan: "Vegan",
      pescatarian: "Pescatarian",
      glutenFree: "Gluten-free",
      dairyFree: "Dairy-free",
      nutFree: "Nut-free",
      halal: "Halal",
      kosher: "Kosher",
      other: "Other",
    },

    allergies: {
      title: "Allergies and intolerances",
      placeholder: "List your allergies separated by commas",
      common: "Common allergens",
      peanuts: "Peanuts",
      treeNuts: "Tree nuts",
      milk: "Milk",
      eggs: "Eggs",
      fish: "Fish",
      shellfish: "Shellfish",
      soy: "Soy",
      wheat: "Wheat",
      sesame: "Sesame",
    },
  },

  stats: {
    title: "Statistics",
    recipesCreated: "Recipes created",
    recipesShared: "Recipes shared",
    coursesCompleted: "Courses completed",
    tokensEarned: "Tokens earned",
    totalPoints: "Total points",
    rank: "Rank",
    achievements: "Achievements",
    badges: "Badges",
    
    // Stats Tab Charts & Data
    budgetChart: {
      title: "Budget (last 4 weeks)",
      spent: "Spent",
      budget: "Budget",
      week: "Week {number}",
    },
    wasteChart: {
      title: "Food waste",
      trend: "Trend:",
      trendDown: "Decreasing ✓",
      trendUp: "Increasing",
      trendStable: "Stable",
    },
    cookedVsConsumed: {
      title: "Cooked vs Consumed",
      cooked: "Cooked",
      consumed: "Consumed",
      efficiency: "{percent}% efficiency",
    },
    categoryChart: {
      title: "Spending by category",
    },
    waste: {
      title: "Product waste",
      great: "Great result! 🎉",
      good: "Good job 👍",
      canImprove: "Can improve ♻️",
      wastedProducts: "products wasted",
    },
    topRecipes: {
      title: "Most cooked",
      cooked: "{count}× cooked",
      noData: "No data",
    },
    topCategories: {
      title: "Categories with highest spending",
      noData: "No data",
    },
  },

  messages: {
    updateSuccess: "Profile updated",
    updateError: "Profile update error",
    passwordChangeSuccess: "Password changed",
    passwordChangeError: "Password change error",
    deleteSuccess: "Account deleted",
    deleteError: "Account deletion error",
    uploadSuccess: "Photo uploaded",
    uploadError: "Photo upload error",
  },
} as const;
