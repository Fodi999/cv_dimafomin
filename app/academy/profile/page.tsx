"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Save, X, Mail, MapPin, Phone, User as UserIcon, Instagram, MessageCircle, AtSign, Globe, BookOpen, Award, Camera, Users, ChefHat, Calendar, Edit2, Eye, Settings, Heart, Bookmark, Share2, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import AvatarUploader from "@/components/profile/AvatarUploader";
import CreateRecipePost from "@/components/academy/CreateRecipePost";
import { useToast } from "@/components/ui/toast";
import { CreateRecipePostData } from "@/lib/types";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile, uploadAvatar, logout } = useUser();
  const { t } = useLanguage();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"private" | "public">("private"); // Перемикач режимів
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "courses">("posts");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
    phone: user?.phone || "",
    instagram: user?.instagram || "",
    telegram: user?.telegram || "",
    whatsapp: user?.whatsapp || "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Auto-switch from courses tab when entering public mode
  useEffect(() => {
    if (viewMode === "public" && activeTab === "courses") {
      setActiveTab("posts");
    }
  }, [viewMode, activeTab]);

  if (!user) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      showToast(t.academy?.profile?.profileUpdated || "Profile updated successfully!", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast(t.academy?.profile?.uploadError || "Error updating profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      location: user.location || "",
      phone: user.phone || "",
      instagram: user.instagram || "",
      telegram: user.telegram || "",
      whatsapp: user.whatsapp || "",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    showToast("Ви успішно вийшли з акаунту", "success");
    router.push("/");
  };

  const handleCreateRecipe = async (data: CreateRecipePostData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("❌ Необхідна авторизація", "error");
        return;
      }

      // Import API
      const { academyApi } = await import("@/lib/api");
      
      // Create post
      await academyApi.createPost(data, token);
      
      showToast("✅ Рецепт успішно створено!", "success");
      
      // TODO: Refresh posts list
      // You can add state management here to update the posts
    } catch (error) {
      console.error("Error creating recipe:", error);
      showToast("❌ Помилка створення рецепту", "error");
    }
  };

  // Mock user posts for Pinterest grid
  const userPosts = [
    { id: 1, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=500&fit=crop", title: "Мій перший рол", likes: 24, saved: false },
    { id: 2, image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=600&fit=crop", title: "Класичний нігірі", likes: 45, saved: false },
    { id: 3, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=400&fit=crop", title: "Темпура креветка", likes: 67, saved: true },
    { id: 4, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=550&fit=crop", title: "Філадельфія рол", likes: 89, saved: false },
    { id: 5, image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=450&fit=crop", title: "Саке сашімі", likes: 34, saved: false },
    { id: 6, image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=500&fit=crop", title: "Дракон рол", likes: 56, saved: true },
  ];

  const savedPosts = userPosts.filter(post => post.saved);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Container */}
      <ToastContainer />

      {/* Edit Modal */}
      {isEditing && viewMode === "private" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">Редагувати профіль</h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <AvatarUploader
                    currentAvatar={user.avatar}
                    userName={user.name}
                    onUploadComplete={async (url) => {
                      await updateProfile({ avatar: url });
                      showToast("Фото завантажено!", "success");
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500">Натисніть на фото, щоб змінити</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="w-4 h-4 inline mr-1" />
                  Ім'я
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ваше ім'я"
                  className="text-lg"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Про себе
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Розкажіть про себе..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 символів</p>
              </div>

              {/* Location & Phone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Місцезнаходження
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Київ, Україна"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Телефон
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+380 XX XXX XX XX"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Соціальні мережі</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Instagram className="w-4 h-4 inline mr-1 text-pink-600" />
                      Instagram
                    </label>
                    <Input
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MessageCircle className="w-4 h-4 inline mr-1 text-blue-600" />
                      Telegram
                    </label>
                    <Input
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <AtSign className="w-4 h-4 inline mr-1 text-green-600" />
                      WhatsApp
                    </label>
                    <Input
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+380 XX XXX XX XX"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-3xl flex gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 h-12 text-lg"
              >
                <Save className="w-5 h-5 mr-2" />
                {isSaving ? "Збереження..." : "Зберегти зміни"}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isSaving}
                className="px-8 h-12"
              >
                Скасувати
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Profile Header - Pinterest Style */}
      <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-8">
        {/* View Mode Toggle - Top Center */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-white rounded-full p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setViewMode("private")}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                viewMode === "private"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Особистий
            </button>
            <button
              onClick={() => setViewMode("public")}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                viewMode === "public"
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Публічний
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-4 sm:p-8 mb-6">
          {/* Avatar - Centered */}
          <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
            <div className="relative mb-3 sm:mb-4">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Name and Username */}
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
              {user.name}
            </h1>
            <p className="text-gray-500 text-sm sm:text-lg mb-1">@{user.name.toLowerCase().replace(/\s+/g, '_')}</p>
            
            {/* Bio */}
            {user.bio && (
              <p className="text-gray-700 text-sm sm:text-base max-w-xl mt-2 sm:mt-3 mb-3 sm:mb-4 px-4">
                {user.bio}
              </p>
            )}

            {/* Location */}
            {user.location && (
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{user.location}</span>
              </div>
            )}

            {/* Stats - Inline */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm mb-4 sm:mb-6">
              <div>
                <span className="font-bold text-gray-900">{userPosts.length}</span>
                <span className="text-gray-600 ml-1">публікацій</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">342</span>
                <span className="text-gray-600 ml-1">підписників</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">127</span>
                <span className="text-gray-600 ml-1">підписок</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3 flex-wrap justify-center">
              {viewMode === "private" ? (
                <>
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold bg-gradient-to-r from-[#3BC864] to-[#C5E98A] text-white hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>Створити рецепт</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-1.5 sm:gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Редагувати</span>
                  </button>
                  <Link
                    href="/academy/dashboard"
                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                    title="Війти"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Підписатись
                  </button>
                  <button className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Написати
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs - Pinterest Style */}
        <div className="border-b border-gray-200 mt-6">
          <div className="flex justify-center gap-8">
            <button
              onClick={() => setActiveTab("posts")}
              className={`py-4 px-2 font-semibold transition-all duration-300 relative ${
                activeTab === "posts"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Створене
              {activeTab === "posts" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`py-4 px-2 font-semibold transition-all duration-300 relative ${
                activeTab === "saved"
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Збережене
              {activeTab === "saved" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
            {viewMode === "private" && (
              <button
                onClick={() => setActiveTab("courses")}
                className={`py-4 px-2 font-semibold transition-all duration-300 relative ${
                  activeTab === "courses"
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Курси
                {activeTab === "courses" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content - Pinterest Masonry Grid */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {activeTab === "posts" && (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
              {userPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="break-inside-avoid mb-4 group cursor-pointer"
                  onMouseEnter={() => setHoveredId(post.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-auto object-cover"
                    />
                    
                    {/* Hover Overlay */}
                    <div 
                      className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                        hoveredId === post.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {/* Top Right Actions */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        >
                          <Bookmark className={`w-4 h-4 ${post.saved ? 'fill-gray-800 text-gray-800' : 'text-gray-800'}`} />
                        </button>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold text-sm mb-1">{post.title}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs hover:scale-110 transition-transform"
                          >
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs hover:scale-110 transition-transform"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {savedPosts.length > 0 ? (
                savedPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="break-inside-avoid mb-4 group cursor-pointer"
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 col-span-full">
                  <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Ще немає збережених рецептів</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-4">
              {/* Completed Course */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Майстер суші: професійний рівень</h3>
                      <p className="text-sm text-gray-600">Завершено: 15 жовтня 2024</p>
                    </div>
                  </div>
                  <div className="text-green-600 font-bold text-2xl">100%</div>
                </div>
                <div className="w-full bg-green-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: "100%" }} />
                </div>
              </motion.div>

              {/* In Progress Course */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-orange-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Японська кухня для початківців</h3>
                      <p className="text-sm text-gray-600">В процесі навчання</p>
                    </div>
                  </div>
                  <div className="text-orange-600 font-bold text-2xl">30%</div>
                </div>
                <div className="w-full bg-orange-200 h-3 rounded-full overflow-hidden">
                  <div className="bg-orange-600 h-3 rounded-full transition-all duration-500" style={{ width: "30%" }} />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Create Recipe Post Modal */}
      <CreateRecipePost
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreateRecipe}
      />
    </div>
  );
}
