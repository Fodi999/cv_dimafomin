"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Users, TrendingUp, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RecipePost } from "@/lib/types";

interface FeedTabProps {
  filter: "all" | "trending" | "following";
  onFilterChange: (filter: "all" | "trending" | "following") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Mock data - будет заменено на API
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
];

export default function FeedTab({ filter, onFilterChange, searchQuery, onSearchChange }: FeedTabProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<RecipePost[]>([]);

  useEffect(() => {
    // TODO: Replace with API call
    setPosts(mockFeedPosts);
  }, [filter]);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search and Create */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Poszukaj przepisów, autorów..."
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
        <button
          onClick={() => onFilterChange("following")}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
            filter === "following"
              ? "bg-[#3BC864] text-white shadow-lg"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <span className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Obserwowani
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
            <Link href={`/profile/${post.userId}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                          💬 {post.commentsCount}
                        </span>
                      </div>
                      <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
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
          <p className="text-gray-500 dark:text-gray-400 text-lg">Nie znaleziono przepisów</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Spróbuj zmienić filtry lub zapytanie</p>
        </div>
      )}
    </div>
  );
}
