/**
 * USER SETTINGS TYPES
 * 
 * Comprehensive type definitions for user preferences and settings
 * Used by: Profile Settings, AI Mentor, Decision Engine, Rules Engine
 */

// ============================================
// 🧠 1. CORE SETTINGS
// ============================================

export type Language = "pl" | "en" | "ru";
export type TimeFormat = "24h" | "12h";
export type UnitSystem = "metric" | "kitchen"; // g/ml vs łyżki/szklanki

export interface CoreSettings {
  language: Language;
  timeFormat: TimeFormat;
  unitSystem: UnitSystem;
}

// ============================================
// 👨‍🍳 2. CULINARY PROFILE
// ============================================

export type SkillLevel = "beginner" | "intermediate" | "professional";

export type UserGoal =
  | "cook_faster" // Gotować szybciej
  | "save_money" // Oszczędzać pieniądze
  | "reduce_waste" // Mniej marnować jedzenie
  | "learn_cooking" // Uczyć się myślenia kucharza
  | "professional_growth"; // Rozwój zawodowy

export type DietType =
  | "none"
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "keto"
  | "paleo";

export interface CulinaryProfile {
  skillLevel: SkillLevel;
  goals: UserGoal[]; // Multiple goals allowed
  allergies: string[]; // ["mleko", "orzechy"]
  excludedProducts: string[]; // ["wieprzowina", "alkohol"]
  diet: DietType;
}

// ============================================
// 🤖 3. AI SETTINGS
// ============================================

export type MentorStyle =
  | "mentor" // Pytania, refleksja, Socratic method
  | "practical" // Konkret, kroki, szybko do celu
  | "analytical"; // Koszty, logika, analiza głęboka

export type AIInterventionLevel =
  | "questions_only" // Tylko pytania, bez odpowiedzi
  | "suggestions" // Sugestie + pytania
  | "suggestions_with_examples"; // Sugestie + przykłady + pytania

export interface AIPreferences {
  mentorStyle: MentorStyle;
  interventionLevel: AIInterventionLevel;
  // Academy completion criteria strictness
  strictness: "lenient" | "moderate" | "strict";
}

// ============================================
// 🍳 4. FRIDGE & PLANNING
// ============================================

export type Priority = "time" | "cost" | "freshness";

export interface FridgeSettings {
  // Automatic decisions
  autoSuggestRecipes: boolean; // proponuj przepisy z lodówki
  warnExpiring: boolean; // ostrzegaj przed psuciem
  showCheaperAlternatives: boolean; // pokazuj tańsze alternatywy
  
  // Priority order for Rules Engine
  priorities: Priority[]; // [0] = highest priority
}

// ============================================
// 💰 5. BUDGET SETTINGS
// ============================================

export type BudgetMode =
  | "passive" // Śledzenie pasywne
  | "active_warnings" // Aktywne ostrzeżenia
  | "economy_mode"; // Tryb oszczędny

export type Currency = "PLN" | "EUR" | "USD";

export interface BudgetSettings {
  mode: BudgetMode;
  currency: Currency;
  monthlyLimit?: number; // Optional budget limit
}

// ============================================
// 🔔 6. NOTIFICATIONS
// ============================================

export type NotificationChannel = "push" | "email" | "off";

export interface NotificationSettings {
  expiringProducts: NotificationChannel; // produkty się psują
  cookingTime: NotificationChannel; // czas na gotowanie
  academyProgress: NotificationChannel; // postęp w Akademii
  budgetExceeded: NotificationChannel; // przekroczony budżet
}

// ============================================
// 🧩 7. COMPLETE USER SETTINGS
// ============================================

export interface UserSettings {
  userId: string;
  core: CoreSettings;
  culinaryProfile: CulinaryProfile;
  aiPreferences: AIPreferences;
  fridge: FridgeSettings;
  budget: BudgetSettings;
  notifications: NotificationSettings;
  updatedAt: string;
}

// ============================================
// 📋 DEFAULT SETTINGS
// ============================================

export const DEFAULT_SETTINGS: Omit<UserSettings, "userId" | "updatedAt"> = {
  core: {
    language: "pl",
    timeFormat: "24h",
    unitSystem: "metric",
  },
  culinaryProfile: {
    skillLevel: "beginner",
    goals: ["learn_cooking"],
    allergies: [],
    excludedProducts: [],
    diet: "none",
  },
  aiPreferences: {
    mentorStyle: "mentor",
    interventionLevel: "suggestions",
    strictness: "moderate",
  },
  fridge: {
    autoSuggestRecipes: true,
    warnExpiring: true,
    showCheaperAlternatives: true,
    priorities: ["freshness", "cost", "time"],
  },
  budget: {
    mode: "passive",
    currency: "PLN",
  },
  notifications: {
    expiringProducts: "push",
    cookingTime: "push",
    academyProgress: "push",
    budgetExceeded: "push",
  },
};

// ============================================
// 🎨 UI LABELS (Polish)
// ============================================

export const SETTINGS_LABELS = {
  // Skill levels
  skillLevel: {
    beginner: "Początkujący",
    intermediate: "Średniozaawansowany",
    professional: "Profesjonalny kucharz",
  },
  
  // User goals
  goals: {
    cook_faster: "🍽️ Gotować szybciej",
    save_money: "💰 Oszczędzać pieniądze",
    reduce_waste: "🌱 Mniej marnować jedzenie",
    learn_cooking: "🧠 Uczyć się myślenia kucharza",
    professional_growth: "👨‍🍳 Rozwój zawodowy",
  },
  
  // Mentor styles
  mentorStyle: {
    mentor: "Mentor (pytania, refleksja)",
    practical: "Praktyk (konkret, kroki)",
    analytical: "Analityk (koszty, logika)",
  },
  
  // AI intervention levels
  interventionLevel: {
    questions_only: "Tylko pytania",
    suggestions: "Sugestie",
    suggestions_with_examples: "Sugestie + przykłady",
  },
  
  // Priorities
  priorities: {
    time: "⏱️ Czas",
    cost: "💰 Koszt",
    freshness: "🍃 Świeżość",
  },
  
  // Budget modes
  budgetMode: {
    passive: "Śledzenie pasywne",
    active_warnings: "Aktywne ostrzeżenia",
    economy_mode: "Tryb oszczędny",
  },
  
  // Notification channels
  notificationChannel: {
    push: "Push",
    email: "Email",
    off: "Wyłączone",
  },
};

// ============================================
// 🔧 HELPER FUNCTIONS
// ============================================

/**
 * Get AI Mentor strictness multiplier for completion criteria
 */
export function getStrictnessMultiplier(strictness: AIPreferences["strictness"]): number {
  switch (strictness) {
    case "lenient":
      return 0.7; // Accept 70% match
    case "moderate":
      return 1.0; // Standard criteria
    case "strict":
      return 1.3; // Require more evidence
  }
}

/**
 * Get priority score for Decision Engine
 */
export function getPriorityScore(
  priorities: Priority[],
  metric: Priority
): number {
  const index = priorities.indexOf(metric);
  if (index === -1) return 0;
  return 3 - index; // [0]=3pts, [1]=2pts, [2]=1pt
}

/**
 * Check if user has specific goal
 */
export function hasGoal(profile: CulinaryProfile, goal: UserGoal): boolean {
  return profile.goals.includes(goal);
}

/**
 * Get mentor greeting based on style
 */
export function getMentorGreeting(style: MentorStyle): string {
  switch (style) {
    case "mentor":
      return "Zastanówmy się razem...";
    case "practical":
      return "OK, zróbmy to krok po kroku.";
    case "analytical":
      return "Przeanalizujmy sytuację dokładnie.";
  }
}
