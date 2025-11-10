"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, TrendingUp, Users, Heart, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import type { RecipePost } from "@/lib/types";

// Mock global feed data
const mockFeedPosts: RecipePost[] = [
  {
    id: "1",
    userId: "1",
    userName: "Олена Петренко",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    userLevel: 15,
    title: "Класичне філадельфія рол",
    description: "М'який сир, лосось та огірок - ідеальне поєднання смаків",
    imageUrl: "https://i.postimg.cc/B63F53xY/DSCF4622.jpg",
    ingredients: ["Рис", "Норі", "Лосось", "Філадельфія", "Огірок"],
    steps: ["Зварити рис", "Розкласти норі", "Додати начинку", "Згорнути рол"],
    difficulty: "intermediate",
    cookingTime: 45,
    servings: 4,
    likes: [],
    likesCount: 24,
    comments: [],
    commentsCount: 8,
    createdAt: "2024-11-01T10:00:00Z",
    tokensEarned: 24,
  },
  {
    id: "2",
    userId: "1",
    userName: "Олена Петренко",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    userLevel: 15,
    title: "Нігірі з тунцем",
    description: "Свіжий тунець на рисовій подушці",
    imageUrl: "https://i.postimg.cc/ZKbct8yq/DSCF4592_Original.jpg",
    ingredients: ["Рис", "Тунець", "Васабі"],
    steps: ["Сформувати рис", "Покласти тунець", "Подавати з васабі"],
    difficulty: "beginner",
    cookingTime: 30,
    servings: 2,
    likes: [],
    likesCount: 18,
    comments: [],
    commentsCount: 4,
    createdAt: "2024-10-28T14:30:00Z",
    tokensEarned: 32,
  },
  {
    id: "3",
    userId: "2",
    userName: "Андрій Коваль",
    userAvatar: "https://i.pravatar.cc/150?img=12",
    userLevel: 5,
    title: "Мій перший рамен",
    description: "Насичений бульйон з локшиною та м'ясом",
    imageUrl: "https://i.postimg.cc/13DKhv5k/2020-08-31-10-30-38-203.jpg",
    ingredients: ["Локшина", "Бульйон", "М'ясо", "Яйце", "Зелена цибуля"],
    steps: ["Приготувати бульйон", "Зварити локшину", "Зібрати страву"],
    difficulty: "intermediate",
    cookingTime: 120,
    servings: 2,
    likes: [],
    likesCount: 12,
    comments: [],
    commentsCount: 6,
    createdAt: "2024-10-25T18:00:00Z",
    tokensEarned: 20,
  },
];

export default function FeedPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState<RecipePost[]>(mockFeedPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "trending" | "following">("all");

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-[1640px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1E1A41] mb-2">
            Глобальна стіна рецептів
          </h1>
          <p className="text-gray-600">
            Відкривайте рецепти від кухарів зі всього світу
          </p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Пошук рецептів, авторів..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 hover:bg-gray-200 focus:bg-white focus:shadow-lg transition-all outline-none text-[#1E1A41]"
            />
          </div>

          {/* Create Button */}
          {isAuthenticated && (
            <button
              onClick={() => router.push("/create-chat")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3BC864] hover:bg-[#2da552] text-white rounded-full font-semibold shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Створити рецепт</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              filter === "all"
                ? "bg-[#3BC864] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Всі рецепти
            </span>
          </button>
          <button
            onClick={() => setFilter("trending")}
            className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              filter === "trending"
                ? "bg-[#3BC864] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Популярні
            </span>
          </button>
          <button
            onClick={() => setFilter("following")}
            className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
              filter === "following"
                ? "bg-[#3BC864] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Підписки
            </span>
          </button>
        </div>

        {/* Pinterest Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              className="break-inside-avoid mb-4 cursor-pointer group"
            >
              <Link href={`/academy/user/${post.userId}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* User Info */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                        {post.userAvatar ? (
                          <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                            {post.userName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-white font-semibold text-sm drop-shadow-lg">
                        {post.userName}
                      </span>
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-semibold text-sm mb-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-white/90 line-clamp-2 mb-3">
                        {post.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likesCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.commentsCount}
                          </span>
                        </div>
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          +{post.tokensEarned} CT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Рецептів не знайдено</p>
            <p className="text-gray-400 text-sm mt-2">Спробуйте змінити фільтри або пошуковий запит</p>
          </div>
        )}
      </div>
    </div>
  );
}
