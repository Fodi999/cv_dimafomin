"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Users, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import RecipePostCard from "@/components/academy/RecipePostCard";
import { RecipePost } from "@/lib/types";

interface DiscussionsTabProps {
  filter: "all" | "trending";
  onFilterChange: (filter: "all" | "trending") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Mock data - будет заменено на API
const mockPosts: RecipePost[] = [
  {
    id: "1",
    userId: "1",
    userName: "Олена Петренко",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    userLevel: 15,
    title: "Класичне філадельфія рол",
    description: "М'який сир, лосось та огірок - ідеальне поєднання смаків. Цей рецепт допоможе вам приготувати справжні японські роли вдома!",
    imageUrl: "https://i.postimg.cc/B63F53xY/DSCF4622.jpg",
    ingredients: ["Рис для суші - 300г", "Норі - 5 аркушів", "Лосось свіжий - 200г", "Сир Філадельфія - 150г", "Огірок - 1шт"],
    steps: [
      "Зварити рис для суші згідно інструкції",
      "Розкласти норі на бамбуковому килимку",
      "Рівномірно розподілити рис по норі",
      "Викласти начинку: сир, лосось та огірок",
      "Акуратно згорнути рол за допомогою килимка",
      "Нарізати на 8 рівних частин"
    ],
    difficulty: "intermediate",
    cookingTime: 45,
    servings: 4,
    likes: [
      { userId: "user1", userName: "User 1", createdAt: "2024-11-01T10:05:00Z" },
      { userId: "user2", userName: "User 2", createdAt: "2024-11-01T11:00:00Z" }
    ],
    likesCount: 24,
    comments: [
      {
        id: "c1",
        postId: "1",
        userId: "user2",
        userName: "Анна Коваленко",
        userAvatar: "https://i.pravatar.cc/150?img=2",
        text: "Чудовий рецепт! Вийшло дуже смачно 🍣",
        createdAt: "2024-11-02T12:00:00Z"
      }
    ],
    commentsCount: 8,
    createdAt: "2024-11-01T10:00:00Z",
    tokensEarned: 24,
  },
  {
    id: "2",
    userId: "2",
    userName: "Марія Іваненко",
    userAvatar: "https://i.pravatar.cc/150?img=2",
    userLevel: 12,
    title: "Запечені роли в темпурі",
    description: "Хрустка скоринка та ніжна начинка - це неймовірно смачно!",
    imageUrl: "https://i.postimg.cc/ZKbct8yq/DSCF4592_Original.jpg",
    ingredients: ["Готові роли", "Темпурне тісто", "Панко", "Соєвий соус"],
    steps: [
      "Приготувати темпурне тісто",
      "Обвалять роли в тісті",
      "Обсипати панко",
      "Смажити до золотистої скоринки"
    ],
    difficulty: "advanced",
    cookingTime: 60,
    servings: 6,
    likes: [],
    likesCount: 18,
    comments: [],
    commentsCount: 5,
    createdAt: "2024-10-30T14:30:00Z",
    tokensEarned: 32,
  }
];

export default function DiscussionsTab({ filter, onFilterChange, searchQuery, onSearchChange }: DiscussionsTabProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<RecipePost[]>([]);
  const [currentUserId] = useState("1"); // TODO: Get from auth context

  useEffect(() => {
    // TODO: Replace with API call
    setPosts(mockPosts);
  }, [filter]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.some(like => like.userId === currentUserId);
        return {
          ...post,
          likes: isLiked
            ? post.likes.filter(like => like.userId !== currentUserId)
            : [...post.likes, { userId: currentUserId, userName: "Current User", createdAt: new Date().toISOString() }],
          likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: string, comment: string) => {
    console.log("Comment on post:", postId, comment);
    // TODO: Implement comment functionality
  };

  return (
    <div>
      {/* Search and Create */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Poszukaj dyskusji, autorów..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:shadow-lg transition-all outline-none border border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Create Button */}
        <button
          onClick={() => router.push("/assistant")}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3BC864] to-[#2da552] hover:opacity-90 text-white rounded-xl font-semibold shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Stwórz przepis</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => onFilterChange("all")}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
            filter === "all"
              ? "bg-[#3BC864] text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Wszystkie
          </span>
        </button>
        <button
          onClick={() => onFilterChange("trending")}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
            filter === "trending"
              ? "bg-[#3BC864] text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Popularne
          </span>
        </button>
      </div>

      {/* Vertical Feed with RecipePostCard */}
      <div className="space-y-6">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <RecipePostCard
              post={post}
              currentUserId={currentUserId}
              onLike={handleLike}
              onComment={handleComment}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Nie znaleziono dyskusji</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Spróbuj zmienić filtry lub zapytanie</p>
        </div>
      )}
    </div>
  );
}
