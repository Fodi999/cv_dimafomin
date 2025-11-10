"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Award,
  BookOpen,
  Heart,
  Mail,
  Calendar,
  Star,
  Flame,
  GraduationCap,
  Gem,
  LogOut,
  Edit2,
  Save,
  X,
  MapPin,
  Phone,
  Instagram,
  MessageCircle,
  AtSign,
  Coins,
  CreditCard,
  TrendingUp,
  Gift,
  DollarSign,
  ShoppingBag,
  Wallet,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { academyApi, walletApi } from "@/lib/api";
import AvatarUploader from "@/components/profile/AvatarUploader";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, logout } = useUser();
  const { language } = useLanguage();

  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: (user as any)?.bio || "",
    location: (user as any)?.location || "",
    phone: (user as any)?.phone || "",
    instagram: (user as any)?.instagram || "",
    telegram: (user as any)?.telegram || "",
    whatsapp: (user as any)?.whatsapp || "",
  });

  // Wallet & Purchase state
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [walletRetryCount, setWalletRetryCount] = useState(0);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [tokenAmount, setTokenAmount] = useState<number>(100);

  // Posts state
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "courses">("posts");
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hoveredPostId, setHoveredPostId] = useState<number | null>(null);

  // Mock stats
  const mockStats = {
    level: 12,
    totalXP: 2450,
    coinsBalance: 1250,
    coursesCompleted: 3,
    certificatesEarned: 2,
    recipesShared: 5,
    followers: 128,
  };

  // Mock recipes
  const mockRecipes = [
    {
      id: "1",
      title: "Класичні суші",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300&fit=crop",
      likes: 245,
      comments: 12,
    },
    {
      id: "2",
      title: "Темпура",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop",
      likes: 189,
      comments: 8,
    },
    {
      id: "3",
      title: "Рис з овочами",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop",
      likes: 156,
      comments: 5,
    },
    {
      id: "4",
      title: "Огірок з маслом",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=300&fit=crop",
      likes: 98,
      comments: 3,
    },
  ];

  // Translations
  const translations = {
    uk: {
      myProfile: "Мій Профіль",
      publications: "публікацій",
      followers: "підписників",
      following: "підписок",
      tokenBalance: "Баланс токенів",
      tokens: "токенів",
      earn: "Заробити",
      buy: "Купити",
      refresh: "Оновити баланс",
      startEarning: "Почніть заробляти токени!",
      startEarningDesc: "Виконуйте завдання, створюйте рецепти або купуйте токени",
      initializing: "Ініціалізація кошелька...",
      walletAvailable: "Кошелек буде доступний після завершення створення профілю",
      transactionHistory: "Історія транзакцій",
      bonus: "БОНУС",
      editProfile: "Редагувати профіль",
      toHome: "На головну",
      logout: "Вийти",
      created: "Створене",
      saved: "Збережене",
      courses: "Курси",
      noPostsYet: "Поки немає публікацій",
      noSavedYet: "Поки немає збережених",
      noCourses: "Курси скоро з'являться!",
      name: "Ім'я",
      aboutMe: "Про себе",
      location: "Місцезнаходження",
      phone: "Телефон",
      socialMedia: "Соціальні мережі",
      saveChanges: "Зберегти зміни",
      cancel: "Скасувати",
      saving: "Збереження...",
      loading: "Завантаження...",
      achievements: "Досягнення",
      dangerZone: "Небезпечна зона",
      logoutButton: "Вийти з облікового запису",
      myRecipes: "Мої рецепти",
    },
    pl: {
      myProfile: "Mój Profil",
      publications: "publikacji",
      followers: "obserwujących",
      following: "obserwowanych",
      tokenBalance: "Saldo tokenów",
      tokens: "tokenów",
      earn: "Zarobić",
      buy: "Kupić",
      refresh: "Odśwież saldo",
      startEarning: "Zacznij zarabiać tokeny!",
      startEarningDesc: "Wykonuj zadania, twórz przepisy lub kupuj tokeny",
      initializing: "Inicjalizacja portfela...",
      walletAvailable: "Portfel będzie dostępny po zakończeniu tworzenia profilu",
      transactionHistory: "Historia transakcji",
      bonus: "BONUS",
      editProfile: "Edytuj profil",
      toHome: "Na główną",
      logout: "Wyloguj",
      created: "Utworzone",
      saved: "Zapisane",
      courses: "Kursy",
      noPostsYet: "Brak publikacji",
      noSavedYet: "Brak zapisanych",
      noCourses: "Kursy wkrótce!",
      name: "Imię",
      aboutMe: "O mnie",
      location: "Lokalizacja",
      phone: "Telefon",
      socialMedia: "Media społecznościowe",
      saveChanges: "Zapisz zmiany",
      cancel: "Anuluj",
      saving: "Zapisywanie...",
      achievements: "Osiągnięcia",
      dangerZone: "Strefa zagrożenia",
      logoutButton: "Wyloguj",
      myRecipes: "Moje przepisy",
    },
  };

  const tr = translations[language as "uk" | "pl"] || translations.uk;

  // Load user data on mount
  useEffect(() => {
    // Update form data when user changes
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: (user as any)?.bio || "",
        location: (user as any)?.location || "",
        phone: (user as any)?.phone || "",
        instagram: (user as any)?.instagram || "",
        telegram: (user as any)?.telegram || "",
        whatsapp: (user as any)?.whatsapp || "",
      });

      loadWalletData();
      loadUserPosts();
    }
  }, [user, router]);

  const loadWalletData = async () => {
    if (!user?.id) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("⚠️ No auth token found, cannot load wallet data");
      // Use fallback from user object
      setWalletBalance((user as any)?.chefTokens || 0);
      setTransactions([]);
      return;
    }

    setLoadingWallet(true);
    try {
      console.log(`📡 Requesting wallet for userId: ${user.id}`);
      const walletData = await walletApi.getBalance(user.id, token);
      console.log("💰 Wallet data received:", walletData);

      const balance =
        (walletData as any)?.balance ||
        (walletData as any)?.chefTokens ||
        (walletData as any)?.tokens ||
        0;
      const txs = (walletData as any)?.transactions || [];

      setWalletBalance(balance);
      setTransactions(txs);

      console.log(
        `✅ Wallet loaded: ${balance} tokens, ${txs.length} transactions`
      );
    } catch (error: any) {
      console.error("⚠️ Error loading wallet data:", error.message);
      console.log("💾 Using fallback wallet data from user object");
      
      // Use fallback data from user object instead of failing
      setWalletBalance((user as any)?.chefTokens || 0);
      setTransactions([]);
      
      // Don't throw, just log - wallet is optional
    } finally {
      setLoadingWallet(false);
    }
  };

  const loadUserPosts = async () => {
    if (!user?.id) return;

    setLoadingPosts(true);
    try {
      const response = await academyApi.getUserPosts(user.id);
      const posts = Array.isArray(response)
        ? response
        : (response as any)?.posts || [];
      setUserPosts(posts);

      const saved = posts.filter((post: any) => post.saved);
      setSavedPosts(saved);
      
      console.log(`✅ User posts loaded: ${posts.length} posts`);
    } catch (error: any) {
      console.warn(`⚠️ Error loading user posts:`, error.message);
      // It's okay if posts fail to load - set empty arrays as fallback
      setUserPosts([]);
      setSavedPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      alert("Профіль оновлено!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Помилка оновлення профілю");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      bio: (user as any)?.bio || "",
      location: (user as any)?.location || "",
      phone: (user as any)?.phone || "",
      instagram: (user as any)?.instagram || "",
      telegram: (user as any)?.telegram || "",
      whatsapp: (user as any)?.whatsapp || "",
    });
    setIsEditing(false);
  };

  const handlePurchaseTokens = async () => {
    if (!user?.id) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    setIsSaving(true);
    try {
      await walletApi.purchaseTokens(user.id, tokenAmount, "card", token);
      await loadWalletData();
      setIsPurchaseModalOpen(false);
      alert(`Успішно куплено ${tokenAmount} токенів!`);
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      alert("Помилка покупки токенів. Спробуйте пізніше.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <p className="text-gray-600 dark:text-gray-300">Завантаження...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-gray-950 dark:to-gray-900">
      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-3xl flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Редагувати профіль
              </h2>
              <button
                onClick={handleCancelEdit}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <AvatarUploader
                    currentAvatar={user?.avatar}
                    userName={user?.name || "User"}
                    onUploadComplete={async (url) => {
                      await updateProfile({ avatar: url });
                      alert("Фото завантажено!");
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Натисніть на фото, щоб змінити
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  {tr.name}
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={tr.name}
                  className="text-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  {tr.aboutMe}
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder={tr.aboutMe}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.bio.length}/500 символів
                </p>
              </div>

              {/* Location & Phone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {tr.location}
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder={tr.location}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    {tr.phone}
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder={tr.phone}
                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {tr.socialMedia}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Instagram className="w-4 h-4 inline mr-1 text-pink-600" />
                      Instagram
                    </label>
                    <Input
                      value={formData.instagram}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          instagram: e.target.value,
                        })
                      }
                      placeholder="@username"
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <MessageCircle className="w-4 h-4 inline mr-1 text-blue-600" />
                      Telegram
                    </label>
                    <Input
                      value={formData.telegram}
                      onChange={(e) =>
                        setFormData({ ...formData, telegram: e.target.value })
                      }
                      placeholder="@username"
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <AtSign className="w-4 h-4 inline mr-1 text-green-600" />
                      WhatsApp
                    </label>
                    <Input
                      value={formData.whatsapp}
                      onChange={(e) =>
                        setFormData({ ...formData, whatsapp: e.target.value })
                      }
                      placeholder="+380 XX XXX XX XX"
                      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 rounded-b-3xl flex gap-3">
              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 h-12 text-lg"
              >
                <Save className="w-5 h-5 mr-2" />
                {isSaving ? tr.saving : tr.saveChanges}
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                disabled={isSaving}
                className="px-8 h-12"
              >
                {tr.cancel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Purchase Tokens Modal */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full"
          >
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Купити токени</h2>
              </div>
              <button
                onClick={() => setIsPurchaseModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Balance */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-2xl p-4 border-2 border-yellow-200 dark:border-yellow-700">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  Поточний баланс
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loadingWallet ? "..." : walletBalance} токенів
                </p>
              </div>

              {/* Amount Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Оберіть кількість токенів
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[100, 500, 1000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setTokenAmount(amount)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        tokenAmount === amount
                          ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {amount}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ${(amount / 10).toFixed(2)}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Або введіть свою кількість
                  </label>
                  <Input
                    type="number"
                    min="10"
                    step="10"
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(Number(e.target.value))}
                    className="text-lg font-semibold text-center dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    Токени:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {tokenAmount}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    Ціна за токен:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    $0.10
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">
                      Загальна сума:
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      ${(tokenAmount / 10).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-300">
                  <p className="font-semibold mb-1">Безпечна оплата</p>
                  <p className="text-blue-700 dark:text-blue-400">
                    Платіж буде оброблений через захищений шлюз
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 rounded-b-3xl flex gap-3">
              <Button
                onClick={handlePurchaseTokens}
                disabled={isSaving || tokenAmount < 10}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 h-12 text-lg shadow-md"
              >
                <Coins className="w-5 h-5 mr-2" />
                {isSaving
                  ? "Обробка..."
                  : `Купити за $${(tokenAmount / 10).toFixed(2)}`}
              </Button>
              <Button
                onClick={() => setIsPurchaseModalOpen(false)}
                variant="outline"
                disabled={isSaving}
                className="px-8 h-12"
              >
                {tr.cancel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-cyan-500 border-b sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              {tr.myProfile}
            </h1>
            <p className="text-sky-100">Переглядайте та управляйте своїм профілем</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Profile Header Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center text-white mb-4 shadow-lg">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name || "Користувач"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  @{user.name?.toLowerCase().replace(/\s+/g, "_") || "user"}
                </p>
                {(user as any)?.bio && (
                  <p className="text-gray-700 dark:text-gray-300 text-center mb-4 max-w-xs">
                    {(user as any).bio}
                  </p>
                )}
                {(user as any)?.location && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{(user as any).location}</span>
                  </div>
                )}
                <div className="flex gap-3 flex-wrap justify-center">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {tr.editProfile}
                  </Button>
                  <Button
                    onClick={() => router.push("/academy")}
                    variant="outline"
                  >
                    На головну
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-4 border-2 border-sky-200 dark:from-sky-950/20 dark:to-sky-900/20 dark:border-sky-700">
                  <p className="text-sm text-sky-700 dark:text-sky-300 font-semibold mb-1">
                    XP Очки
                  </p>
                  <p className="text-3xl font-bold text-sky-900 dark:text-sky-100">
                    {mockStats.totalXP}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 border-2 border-cyan-200 dark:from-cyan-950/20 dark:to-cyan-900/20 dark:border-cyan-700">
                  <p className="text-sm text-cyan-700 dark:text-cyan-300 font-semibold mb-1">
                    ChefTokens
                  </p>
                  <p className="text-3xl font-bold text-cyan-900 dark:text-cyan-100">
                    {loadingWallet ? "..." : walletBalance || mockStats.coinsBalance}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border-2 border-emerald-200 dark:from-emerald-950/20 dark:to-emerald-900/20 dark:border-emerald-700">
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold mb-1 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Курси
                  </p>
                  <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                    {mockStats.coursesCompleted}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border-2 border-amber-200 dark:from-amber-950/20 dark:to-amber-900/20 dark:border-amber-700">
                  <p className="text-sm text-amber-700 dark:text-amber-300 font-semibold mb-1 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Сертифікати
                  </p>
                  <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                    {mockStats.certificatesEarned}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-4 border-2 border-rose-200 dark:from-rose-950/20 dark:to-rose-900/20 dark:border-rose-700">
                  <p className="text-sm text-rose-700 dark:text-rose-300 font-semibold mb-1 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Рецепти
                  </p>
                  <p className="text-3xl font-bold text-rose-900 dark:text-rose-100">
                    {mockStats.recipesShared}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-xl p-4 border-2 border-sky-200 dark:from-sky-950/20 dark:to-sky-900/20 dark:border-sky-700">
                  <p className="text-sm text-sky-700 dark:text-sky-300 font-semibold mb-1 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Підписники
                  </p>
                  <p className="text-3xl font-bold text-sky-900 dark:text-sky-100">
                    {mockStats.followers}
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Section */}
            <div className="mt-8 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                {tr.tokenBalance}
              </h3>

              {/* Token Balance Card */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-2xl p-6 border-2 border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {tr.tokenBalance}
                    </p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">
                      {loadingWallet
                        ? "..."
                        : walletBalance || mockStats.coinsBalance}{" "}
                      <span className="text-lg text-gray-500 dark:text-gray-400">
                        {tr.tokens}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push("/academy/earn-tokens")}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    {tr.earn}
                  </Button>
                  <Button
                    onClick={() => setIsPurchaseModalOpen(true)}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  >
                    {tr.buy}
                  </Button>
                  <Button
                    onClick={() => {
                      setWalletRetryCount(0);
                      loadWalletData();
                    }}
                    size="sm"
                    variant="outline"
                    className="px-3"
                    title={tr.refresh}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Transaction History */}
              {transactions.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {tr.transactionHistory}
                  </h4>
                  <div className="space-y-2">
                    {transactions.slice(0, 5).map((tx: any, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                            {tx.type === "earned" ? (
                              <Coins className="w-5 h-5 text-yellow-600" />
                            ) : (
                              <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {tx.description || tx.reason}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(tx.createdAt || tx.date).toLocaleDateString(
                                "uk-UA"
                              )}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {tx.type === "earned" ? "+" : "-"}
                          {tx.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Контактна інформація
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Email
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Дата приєднання
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    15 листопада 2024
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Recipes */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-sky-600 dark:text-sky-400" />
                {tr.myRecipes}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group cursor-pointer border border-gray-200 dark:border-gray-700"
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
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {recipe.title}
                      </h3>

                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
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
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-500" />
                {tr.achievements}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { icon: Star, label: "Початківець", color: "text-sky-500" },
                  {
                    icon: Flame,
                    label: "Поціновувач",
                    color: "text-amber-500",
                  },
                  { icon: Award, label: "Майстер", color: "text-emerald-500" },
                  { icon: User, label: "Шеф", color: "text-sky-600" },
                  {
                    icon: GraduationCap,
                    label: "Учитель",
                    color: "text-blue-500",
                  },
                  { icon: Gem, label: "Експерт", color: "text-purple-500" },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all dark:shadow-sky-500/10 border border-gray-200 dark:border-gray-700"
                  >
                    <achievement.icon
                      className={`w-8 h-8 mx-auto mb-2 ${achievement.color}`}
                    />
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {achievement.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-700 rounded-2xl p-8">
              <h3 className="text-lg font-bold text-red-900 dark:text-red-400 mb-4">
                {tr.dangerZone}
              </h3>
              <Button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {tr.logoutButton}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
