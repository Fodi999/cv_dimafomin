// API Response Types

export interface ProfileData {
  userId?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
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

export interface CreateRecipePostData {
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  steps: string[];
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  cookingTime?: number;
  servings?: number;
}
