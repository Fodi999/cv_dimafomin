/**
 * Admin translations (EN)
 */

export const admin = {
  dashboard: {
    title: "Admin Dashboard",
    subtitle: "Manage the platform",
    overview: "Overview",
    analytics: "Analytics",
    
    kpi: {
      users: {
        title: "Users",
        total: "Total",
        activeToday: "Active today",
        growth: "Growth",
        viewAll: "View all users",
      },
      content: {
        title: "Content",
        recipes: "Recipes",
        products: "Products",
        courses: "Courses",
        viewAll: "View catalog",
      },
      ai: {
        title: "AI",
        queries: "Queries",
        accuracy: "Accuracy",
        tokens: "Tokens",
        viewAll: "AI Stats",
      },
      system: {
        title: "System",
        uptime: "Uptime",
        errors: "Errors",
        users: "Users",
        viewAll: "Monitoring",
      },
    },
    
    stats: {
      totalUsers: "Total users",
      activeUsers: "Active users",
      totalRecipes: "Total recipes",
      totalCourses: "Total courses",
      tokensInCirculation: "Tokens in circulation",
      revenue: "Revenue",
    },
    
    actionHub: {
      title: "Quick Actions",
      users: {
        title: "Users",
        viewAll: "All users",
        roles: "Role management",
        activity: "Activity",
      },
      content: {
        title: "Content",
        recipes: "Recipes",
        ingredients: "Ingredients",
        courses: "Courses",
      },
      ai: {
        title: "AI",
        translations: "Translations",
        mentor: "Mentor",
        automation: "Automation",
      },
      system: {
        title: "System",
        settings: "Settings",
        security: "Security",
      },
    },
    
    systemNotifications: {
      title: "System Notifications",
      rolesChanged: "Roles changed",
      localizationUpdated: "Localization updated",
      hoursAgo: "hours ago",
      hourAgo: "hour ago",
    },
    
    quickActions: {
      title: "Quick actions",
      createUser: "Add user",
      createRecipe: "Add recipe",
      createCourse: "Add course",
      sendNotification: "Send notification",
      viewReports: "View reports",
    },
  },

  users: {
    title: "Users",
    subtitle: "Manage user accounts",
    search: "Search users...",
    filter: "Filter",
    sort: "Sort",
    export: "Export users (TODO: implementation)",
    notFound: "User not found",
    noResults: "No users found",
    
    kpi: {
      totalUsers: "Total users",
      activeUsers: "Active users",
      premiumUsers: "Premium users",
      growth: "Growth",
      noPremium: "No premium users yet",
    },
    
    table: {
      id: "ID",
      name: "Name",
      email: "Email",
      role: "Role",
      status: "Status",
      registered: "Registered",
      lastActive: "Last active",
      actions: "Actions",
      user: "User",
    },
    
    roles: {
      admin: "🔑 Administrator",
      moderator: "Moderator",
      premium: "⭐ Premium",
      chef: "Chef",
      user: "👤 User",
      guest: "Guest",
    },
    
    status: {
      all: "All",
      active: "Active",
      inactive: "Inactive",
      suspended: "Suspended",
      banned: "Banned",
      blocked: "Blocked",
      pending: "Pending",
    },
    
    actions: {
      view: "View",
      edit: "Edit",
      editUser: "Edit user",
      viewUser: "View user",
      suspend: "Suspend",
      ban: "Ban",
      delete: "Delete",
      deleteUser: "Delete user?",
      confirmDelete: "Are you sure you want to delete user",
      deleteWarning: "This action is irreversible. Delete only if absolutely necessary.",
      deleteConsequences: "All user data will be deleted",
      sendEmail: "Send email",
      resetPassword: "Reset password",
      viewActivity: "View activity",
      cancel: "Cancel",
      save: "Save",
      adminWarning: "⚠️ Warning: You are granting administrator rights",
      blockWarning: "⚠️ Warning: User will not be able to log in to the system",
    },
  },

  recipes: {
    title: "Recipes",
    subtitle: "Manage recipes",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    reported: "Reported",
    
    actions: {
      approve: "Approve",
      reject: "Reject",
      feature: "Feature",
      unfeature: "Unfeature",
      delete: "Delete",
      viewReports: "View reports",
    },
  },

  courses: {
    title: "Courses",
    subtitle: "Manage courses",
    draft: "Drafts",
    published: "Published",
    archived: "Archived",
    
    actions: {
      publish: "Publish",
      unpublish: "Unpublish",
      archive: "Archive",
      delete: "Delete",
      edit: "Edit",
      viewStudents: "View students",
    },
  },

  catalog: {
    title: "Catalog",
    subtitle: "Manage products and recipes",
    
    products: {
      title: "Products",
      subtitle: "Manage ingredient catalog",
      addProduct: "Add product",
      editProduct: "Edit product",
      deleteProduct: "Delete product",
      noProducts: "No products found",
      search: "Search",
      searchPlaceholder: "Search by name (any language)...",
      
      table: {
        name: "Name",
        category: "Category",
        unit: "Unit",
        usedIn: "Used in",
        actions: "Actions",
        recipes: "products",
      },
      
      categories: {
        all: "All categories",
        meat: "Meat",
        fish: "Fish",
        vegetables: "Vegetables",
        fruits: "Fruits",
        dairy: "Dairy products",
        grains: "Grains",
        condiment: "Condiments",
        spices: "Spices",
        other: "Other",
      },
      
      form: {
        name: "Product name",
        namePlaceholder: "e.g. Watermelon, Arbuz, Арбуз",
        nameRequired: "Product name is required",
        category: "Category",
        unit: "Unit of measurement",
        description: "Enter product name in any language. AI will translate automatically.",
        successMessage: "Product added and translated by AI",
        errorMessage: "Failed to create product",
        save: "Save",
        cancel: "Cancel",
      },
      
      deleteDialog: {
        title: "Delete ingredient?",
        titleBlocked: "Cannot delete ingredient",
        description: "Are you sure you want to delete ingredient",
        descriptionBlocked: "Ingredient {name} is used in recipes and cannot be deleted.",
        warning: "Warning!",
        warningMessage: "This action cannot be undone. The ingredient will be permanently deleted.",
        blockedTitle: "Deletion blocked",
        blockedMessage: "This ingredient is used in <strong>{count} recipes</strong>. First remove it from all recipes or update recipes to use a different ingredient.",
        cancel: "Cancel",
        cancelBlocked: "Understood",
        confirm: "Yes, delete",
      },
    },
    
    recipes: {
      title: "Recipes",
      subtitle: "Manage recipe catalog",
      
      deleteDialog: {
        title: "Delete recipe?",
        description: "Are you sure you want to delete recipe",
        createdAt: "Created:",
        viewsWarning: "Warning!",
        viewsMessage: "This recipe has been viewed {count} times. Users may have it saved. After deletion, it will be impossible to restore the recipe.",
        irreversibleTitle: "Irreversible action",
        irreversibleMessage: "The recipe will be deleted forever. All data, including ingredients, cooking steps, and images will be lost.",
        cancel: "Cancel",
        confirm: "Yes, delete forever",
      },
    },
  },

  moderation: {
    title: "Moderation",
    subtitle: "Review reported content",
    reports: "Reports",
    pending: "Pending",
    resolved: "Resolved",
    
    reportTypes: {
      spam: "Spam",
      inappropriate: "Inappropriate content",
      copyright: "Copyright violation",
      misinformation: "Misinformation",
      other: "Other",
    },
    
    actions: {
      review: "Review",
      approve: "Approve",
      remove: "Remove",
      warn: "Warn",
      ban: "Ban",
      dismiss: "Dismiss report",
    },
  },

  analytics: {
    title: "Analytics",
    subtitle: "Statistics and reports",
    
    metrics: {
      pageViews: "Page views",
      uniqueVisitors: "Unique visitors",
      bounceRate: "Bounce rate",
      avgSessionDuration: "Avg session duration",
      conversion: "Conversion",
      retention: "Retention",
    },
    
    charts: {
      userGrowth: "User growth",
      recipeCreation: "Recipe creation",
      courseCompletion: "Course completion",
      tokenUsage: "Token usage",
      revenue: "Revenue",
    },
    
    periods: {
      today: "Today",
      week: "This week",
      month: "This month",
      year: "This year",
      custom: "Custom",
    },
  },

  settings: {
    title: "Settings",
    subtitle: "Manage your system parameters",
    
    tabs: {
      general: "General",
      email: "Email",
      notifications: "Notifications",
      api: "API",
      security: "Security",
    },
    
    general: {
      title: "General",
      appName: "App name",
      appDescription: "App description",
      siteName: "Site name",
      siteDescription: "Site description",
      language: "Language",
      timezone: "Timezone",
      theme: "Theme",
      maintenance: "Maintenance mode",
    },
    
    features: {
      title: "Features",
      registration: "Registration",
      comments: "Comments",
      reviews: "Reviews",
      aiMentor: "AI-Mentor",
      tokens: "ChefTokens",
    },
    
    limits: {
      title: "Limits",
      maxRecipesPerUser: "Max recipes per user",
      maxFileSize: "Max file size",
      maxAIRequests: "Max AI requests per day",
      rateLimit: "Rate limit",
    },
    
    notifications: {
      title: "Notifications",
      emailNotifications: "Email notifications",
      pushNotifications: "Push notifications",
      adminAlerts: "Admin alerts",
    },
  },

  messages: {
    userUpdated: "User updated",
    userDeleted: "User deleted",
    recipeApproved: "Recipe approved",
    recipeRejected: "Recipe rejected",
    coursePublished: "Course published",
    reportResolved: "Report resolved",
    settingsSaved: "Settings saved",
    actionFailed: "Action failed",
    confirmAction: "Are you sure you want to perform this action?",
  },
} as const;
