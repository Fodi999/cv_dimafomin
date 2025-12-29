// API Response Types

export interface ProfileData {
  userId?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  role?: "student" | "instructor" | "admin";
  level?: number;
  xp?: number;
  chefTokens?: number;
  bio?: string;
  language?: string;
  location?: string;
  phone?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
}

export interface Transaction {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  reason: string;
  date: string;
}

export interface DashboardData {
  profile: ProfileData;
  courses?: any[];
  recipes?: any[];
  achievements?: any[];
  certificates?: any[];
  kitchenSimulator?: any;
  wallet?: {
    chefTokens: number;
    totalEarned: number;
    totalSpent: number;
    transactions?: Transaction[];
  };
  ranking?: {
    globalRank: number;
    totalUsers: number;
  };
}

export interface RecipeData {
  id: string;
  title: string;
  description?: string;
  ingredients: string[];
  steps: string[];
  category?: string;
  difficulty?: string;
  cookingTime?: number;
  servings?: number;
  price?: number;
  rating?: number;
  imageUrl?: string;
  authorId?: string;
  authorName?: string;
}

export interface CourseData {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty?: string;
  duration?: number;
  lessons?: any[];
  imageUrl?: string;
  language?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  level: number;
  totalXp: number;
  totalSales?: number;
  totalRevenue?: number;
  averageRating?: number;
  recipeCount?: number;
  achievementCount?: number;
  avatarUrl?: string;
}

export interface LeaderboardData {
  leaders: LeaderboardEntry[];
  total: number;
  sortBy: string;
}

export interface AuthResponse {
  token: string;
  userId?: string;
  user?: {
    id?: string;
    userId?: string;
    name?: string;
    email?: string;
    role?: "student" | "instructor" | "admin";
    level?: number;
    xp?: number;
    chefTokens?: number;
    avatarUrl?: string;
  };
}

export interface UploadResponse {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

// Recipe Post Types (Community Feed)

export interface RecipePostComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}

export interface RecipePostLike {
  userId: string;
  userName: string;
  createdAt: string;
}

export interface RecipePost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userLevel?: number;
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  steps: string[];
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  cookingTime?: number;
  servings?: number;
  likes: RecipePostLike[];
  likesCount: number;
  comments: RecipePostComment[];
  commentsCount: number;
  tokensEarned: number;
  createdAt: string;
  updatedAt?: string;
}

// Ingredient with brutto/netto data
export interface IngredientData {
  name: string;
  brutto?: number;        // вага в грамах до очищення (gross_weight)
  netto?: number;         // вага в грамах після очищення (net_weight)
  unit?: string;          // одиниця вимірювання (г, кг, мл, л, шт)
  calories?: number;      // калорії на 100г
  protein?: number;       // білки на 100г
  fat?: number;           // жири на 100г
  carbs?: number;         // вуглеводи на 100г
  totalCalories?: number; // загальна калорійність з урахуванням ваги
  cost?: number;          // ціна інгредієнта
}

export interface CreateRecipePostData {
  title: string;
  description: string;
  imageUrl?: string;
  ingredients: (string | IngredientData)[]; // підтримка обох форматів
  steps: string[];
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  cookingTime?: number;        // час приготування в хвилинах
  servings?: number;           // кількість порцій
  // Backend fields
  grossWeight?: number;        // загальна вага брутто (сума всіх інгредієнтів)
  netWeight?: number;          // загальна вага нетто
  calories?: number;           // загальна калорійність
  protein?: number;            // загальні білки
  fats?: number;               // загальні жири
  carbs?: number;              // загальні вуглеводи
  yield?: number;              // вихід готової страви в грамах
  cost?: number;               // загальна вартість
  tokensReward?: number;       // нагорода в токенах
}

// ==================== FRIDGE TYPES ====================

export interface CatalogIngredient {
  id: string;
  name: string;
  unit: string;
  category: string;
  defaultShelfLifeDays: number;
  i18nKey?: string; // ✅ Ключ для перевода (например, "ingredient.cucumber")
}

export interface IngredientSearchResponse {
  count: number;
  items: CatalogIngredient[];
}

// 🔥 Централизованные статусы для FridgeItem
export type FridgeItemStatus = 'ok' | 'warning' | 'critical' | 'expired';
export const ACTIVE_STATUSES: readonly FridgeItemStatus[] = ['ok', 'warning', 'critical'] as const;

export interface FridgeItem {
  id: string;
  ingredient: {
    name: string;
    category: string;
    i18nKey?: string; // ✅ Ключ для перевода (например, "ingredient.cucumber")
  };
  quantity: number;
  unit: string;
  arrivedAt?: string; // Дата добавления продукта (ISO 8601)
  expiresAt: string;
  daysLeft: number;
  status: FridgeItemStatus;
  totalPrice?: number; // Total price for this item (backend calculated)
  currency?: string; // Currency code (e.g., "PLN")
  pricePerUnit?: number; // Price per unit (user input or backend default)
}

export interface FridgeItemsResponse {
  items: FridgeItem[];
}

export interface AddFridgeItemData {
  ingredientId: string;
  quantity: number;
  unit: string;
  expiresAt?: string; // ISO 8601 date string (optional - calculated from defaultShelfLifeDays)
  pricePerUnit?: number; // Optional: price per unit (kg/l/szt) - LEGACY
  priceUnit?: string; // Optional: unit for pricing (kg, l, szt) - LEGACY
  priceInput?: {
    value: number; // e.g., 50 PLN
    per: "kg" | "l" | "szt"; // per kilogram/liter/piece
  };
}
