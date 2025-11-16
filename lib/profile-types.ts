// profile-types.ts — типи для профілю користувача та транзакцій

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
  followers?: number;
  following?: number;
  chefTokens?: number;
  tokensBalance?: number;
}

export interface Transaction {
  id: string;
  type: 'bonus' | 'earned' | 'spent' | 'purchase';
  amount: number;
  description?: string;
  reason?: string;
  date?: string;
  createdAt?: string;
}

export interface Post {
  id: number;
  title: string;
  image?: string;
  imageUrl?: string;
  description?: string;
  likes?: number;
  saved?: boolean;
}

export interface FormData {
  name: string;
  email: string;
  bio: string;
  location: string;
  phone: string;
  instagram: string;
  telegram: string;
  whatsapp: string;
}

export type TabType = 'overview' | 'stats' | 'content' | 'wallet' | 'edit' | 'posts' | 'saved' | 'courses';
export type ViewType = 'chat' | 'profile';
