"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Users, TrendingUp, Filter, Search } from "lucide-react";
import { RecipePost } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import RecipePostCard from "@/components/academy/RecipePostCard";
import CreateRecipePost from "@/components/academy/CreateRecipePost";

export default function CommunityPage() {
  const { t } = useLanguage();
  const community = (t.academy as any)?.community;

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState<RecipePost[]>([]);
  const [filter, setFilter] = useState<"all" | "trending" | "following">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId] = useState("user123"); // TODO: Get from auth context

  // Mock data - replace with API call
  const mockPosts: RecipePost[] = [
    {
      id: "1",
      userId: "user456",
      userName: "Ольга Петренко",
      userAvatar: undefined,
      userLevel: 5,
      title: "Ідеальні суші з лососем",
      description: "Мій перший досвід приготування суші вдома! Використала рецепт з курсу 'Мистецтво Суші з Нуля' і вийшло неймовірно смачно 🍣",
      imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
      ingredients: [
        "Рис для суші - 300г",
        "Лосось свіжий - 200г",
        "Норі (водорості) - 5 листів",
        "Рисовий оцет - 50мл",
        "Васабі, імбир, соєвий соус",
      ],
      steps: [
        "Відварити рис для суші згідно інструкції",
        "Додати рисовий оцет та перемішати",
        "Нарізати лосось тонкими смужками",
        "Розкласти норі на бамбуковій циновці",
        "Рівномірно розподілити рис по норі",
        "Викласти начинку та згорнути ролл",
        "Нарізати на 8 частин гострим ножем",
      ],
      category: "Суші",
      difficulty: "beginner",
      cookingTime: 45,
      servings: 4,
      likes: [
        { userId: "user123", userName: "Current User", createdAt: "2024-11-05T10:30:00Z" },
        { userId: "user789", userName: "Іван Коваль", createdAt: "2024-11-05T11:00:00Z" },
      ],
      likesCount: 12,
      comments: [
        {
          id: "c1",
          postId: "1",
          userId: "user789",
          userName: "Іван Коваль",
          userAvatar: undefined,
          text: "Виглядає дуже апетитно! Обов'язково спробую приготувати за вашим рецептом 😋",
          createdAt: "2024-11-05T11:00:00Z",
        },
      ],
      commentsCount: 5,
      tokensEarned: 25,
      createdAt: "2024-11-05T10:00:00Z",
    },
    {
      id: "2",
      userId: "user789",
      userName: "Андрій Сидоренко",
      userAvatar: undefined,
      userLevel: 8,
      title: "Рамен з курячим бульйоном",
      description: "Сьогодні вирішив приготувати справжній японський рамен! Процес довгий, але результат того вартий 🍜✨",
      imageUrl: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800",
      ingredients: [
        "Курячий бульйон - 1.5л",
        "Локшина рамен - 400г",
        "Яйця - 4 шт",
        "Куряче філе - 300г",
        "Зелена цибуля, норі, кунжут",
      ],
      steps: [
        "Приготувати насичений курячий бульйон (4-6 годин)",
        "Маринувати курку в соєвому соусі",
        "Зварити яйця всмятку (6.5 хвилин)",
        "Відварити локшину",
        "Зібрати рамен: бульйон + локшина + топінги",
      ],
      category: "Рамен",
      difficulty: "intermediate",
      cookingTime: 360,
      servings: 4,
      likes: [],
      likesCount: 8,
      comments: [],
      commentsCount: 2,
      tokensEarned: 30,
      createdAt: "2024-11-04T18:00:00Z",
    },
  ];

  useEffect(() => {
    // Load posts (in real app - fetch from API)
    setPosts(mockPosts);
  }, []);

  const handleCreatePost = async (data: any) => {
    console.log("Creating post:", data);
    
    // TODO: Send to API
    // const response = await fetch('/api/community/posts', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    // });

    // Mock: Add to posts
    const newPost: RecipePost = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: "Ви",
      userLevel: 3,
      ...data,
      likes: [],
      likesCount: 0,
      comments: [],
      commentsCount: 0,
      tokensEarned: 20,
      createdAt: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes.some((like) => like.userId === currentUserId);
          
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter((like) => like.userId !== currentUserId)
              : [...post.likes, { userId: currentUserId, userName: "Current User", createdAt: new Date().toISOString() }],
            likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
          };
        }
        return post;
      })
    );
  };

  const handleComment = (postId: string, text: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: Date.now().toString(),
            postId,
            userId: currentUserId,
            userName: "Ви",
            userAvatar: undefined,
            text,
            createdAt: new Date().toISOString(),
          };

          return {
            ...post,
            comments: [...post.comments, newComment],
            commentsCount: post.commentsCount + 1,
          };
        }
        return post;
      })
    );
  };

  const filteredPosts = posts.filter((post) => {
    if (searchQuery) {
      return (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#1E1A41] mb-2 flex items-center gap-3">
              <Users className="w-10 h-10 text-[#3BC864]" />
              {community?.title || "Спільнота Шефів"}
            </h1>
            <p className="text-lg text-gray-600">
              {community?.subtitle || "Діліться своїми кулінарними творіннями та натхненням"}
            </p>
          </div>

          <Button
            onClick={() => setShowCreatePost(true)}
            size="lg"
            className="bg-gradient-to-r from-[#3BC864] to-[#C5E98A] hover:opacity-90"
          >
            <Plus className="w-5 h-5 mr-2" />
            {community?.createPost || "Створити пост"}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200">
            <p className="text-sm text-purple-700 font-semibold">
              {community?.totalPosts || "Всього постів"}
            </p>
            <p className="text-2xl font-bold text-purple-900">{posts.length}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border-2 border-blue-200">
            <p className="text-sm text-blue-700 font-semibold">
              {community?.activeChefs || "Активних шефів"}
            </p>
            <p className="text-2xl font-bold text-blue-900">156</p>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border-2 border-amber-200">
            <p className="text-sm text-amber-700 font-semibold">
              {community?.tokensEarned || "Токенів зароблено"}
            </p>
            <p className="text-2xl font-bold text-amber-900">2,340</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={community?.searchPlaceholder || "Шукати рецепти..."}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#3BC864] focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                filter === "all"
                  ? "bg-[#3BC864] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {community?.all || "Всі"}
            </button>
            <button
              onClick={() => setFilter("trending")}
              className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                filter === "trending"
                  ? "bg-[#3BC864] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              {community?.trending || "Популярні"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RecipePostCard
                post={post}
                currentUserId={currentUserId}
                onLike={handleLike}
                onComment={handleComment}
              />
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20">
            <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">
              {community?.noPosts || "Постів ще немає. Будьте першим!"}
            </p>
            <Button
              onClick={() => setShowCreatePost(true)}
              className="mt-6 bg-gradient-to-r from-[#3BC864] to-[#C5E98A]"
            >
              <Plus className="w-5 h-5 mr-2" />
              {community?.createFirstPost || "Створити перший пост"}
            </Button>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreateRecipePost
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
