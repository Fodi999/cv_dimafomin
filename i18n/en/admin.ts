/**
 * Admin translations (EN)
 */

export const admin = {
  dashboard: {
    title: "Admin Dashboard",
    subtitle: "Manage the platform",
    overview: "Overview",
    analytics: "Analytics",
    
    stats: {
      totalUsers: "Total users",
      activeUsers: "Active users",
      totalRecipes: "Total recipes",
      totalCourses: "Total courses",
      tokensInCirculation: "Tokens in circulation",
      revenue: "Revenue",
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
    
    table: {
      id: "ID",
      name: "Name",
      email: "Email",
      role: "Role",
      status: "Status",
      registered: "Registered",
      lastActive: "Last active",
      actions: "Actions",
    },
    
    roles: {
      admin: "Administrator",
      moderator: "Moderator",
      chef: "Chef",
      user: "User",
      guest: "Guest",
    },
    
    status: {
      active: "Active",
      inactive: "Inactive",
      suspended: "Suspended",
      banned: "Banned",
    },
    
    actions: {
      view: "View",
      edit: "Edit",
      suspend: "Suspend",
      ban: "Ban",
      delete: "Delete",
      sendEmail: "Send email",
      resetPassword: "Reset password",
      viewActivity: "View activity",
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
    title: "System settings",
    subtitle: "Configure the platform",
    
    general: {
      title: "General",
      siteName: "Site name",
      siteDescription: "Site description",
      language: "Default language",
      timezone: "Timezone",
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
