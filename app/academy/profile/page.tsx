"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Settings,
  LogOut,
  Edit,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";

export default function ProfilePage() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    bio: "Люблю готувати суші та ділитися рецептами з друзями",
    avatar: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const mockStats = {
    level: 12,
    totalXP: 2450,
    coinsBalance: 1250,
    coursesCompleted: 5,
    certificatesEarned: 3,
    recipesShared: 18,
    followers: 245,
    following: 132,
  };

  const mockRecipes = [
    {
      id: "1",
      title: "Філадельфія рол",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300",
      likes: 24,
      comments: 8,
    },
    {
      id: "2",
      title: "Нігірі з тунцем",
      image: "https://images.unsplash.com/photo-1564489551835-92c06c840c50?w=300&h=300",
      likes: 18,
      comments: 4,
    },
    {
      id: "3",
      title: "Рамен з м'ясом",
      image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=300&h=300",
      likes: 32,
      comments: 12,
    },
    {
      id: "4",
      title: "Мастерклас суші",
      image: "https://images.unsplash.com/photo-1580959375944-abd7e991f971?w=300&h=300",
      likes: 45,
      comments: 18,
    },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Мій профіль</h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Редагувати
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt={formData.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-16 h-16" />
                )}
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {formData.fullName || "Користувач"}
                </h2>
                <div className="flex items-center justify-center gap-2 text-purple-600 font-semibold mb-4">
                  <TrendingUp className="w-4 h-4" />
                  Рівень {mockStats.level}
                </div>
                <p className="text-gray-600 text-sm mb-4">{formData.bio}</p>

                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                    className="w-full"
                  >
                    Зберегти
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
                <p className="text-sm text-blue-700 font-semibold mb-1">XP Очки</p>
                <p className="text-3xl font-bold text-blue-900">{mockStats.totalXP}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                <p className="text-sm text-purple-700 font-semibold mb-1">
                  ChefTokens
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {mockStats.coinsBalance}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                <p className="text-sm text-green-700 font-semibold mb-1 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Курси
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {mockStats.coursesCompleted}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border-2 border-amber-200">
                <p className="text-sm text-amber-700 font-semibold mb-1 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Сертифікати
                </p>
                <p className="text-3xl font-bold text-amber-900">
                  {mockStats.certificatesEarned}
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border-2 border-pink-200">
                <p className="text-sm text-pink-700 font-semibold mb-1 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Рецепти
                </p>
                <p className="text-3xl font-bold text-pink-900">
                  {mockStats.recipesShared}
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border-2 border-cyan-200">
                <p className="text-sm text-cyan-700 font-semibold mb-1 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Підписники
                </p>
                <p className="text-3xl font-bold text-cyan-900">
                  {mockStats.followers}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Контактна інформація</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{formData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Дата приєднання</p>
                  <p className="font-medium text-gray-900">15 листопада 2024</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Recipes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-600" />
            Мої рецепти
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

                  {/* Actions Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-3">
                      <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
                        <Heart className="w-5 h-5 text-red-500" />
                      </button>
                      <button className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors">
                        <Share2 className="w-5 h-5 text-blue-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                    {recipe.title}
                  </h3>

                  <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {recipe.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {recipe.comments}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-500" />
            Досягнення
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { emoji: "🌟", label: "Початківець" },
              { emoji: "⭐", label: "Поціновувач" },
              { emoji: "🏆", label: "Майстер" },
              { emoji: "👨‍🍳", label: "Шеф" },
              { emoji: "🎓", label: "Учитель" },
              { emoji: "💎", label: "Експерт" },
            ].map((achievement, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-2">{achievement.emoji}</div>
                <p className="text-xs font-semibold text-gray-900">
                  {achievement.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-red-50 border-2 border-red-200 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-red-900 mb-4">Небезпечна зона</h3>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Вийти з облікового запису
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
