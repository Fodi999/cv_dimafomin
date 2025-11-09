"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChefHat, User, Send, Clock, Users, Flame, Paperclip, X, ChevronDown, Menu, MessageSquarePlus, History, Settings, MapPin, Award, BookOpen, Heart, Bookmark, Share2, Save, Edit2, Phone, Mail, Instagram, MessageCircle, AtSign, Coins, CreditCard, TrendingUp, LogOut, Gift, DollarSign, ShoppingBag, Wallet, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ResponsiveLayout, SidebarItem } from "@/components/ResponsiveLayout";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { academyApi, walletApi } from "@/lib/api";
import AvatarUploader from "@/components/profile/AvatarUploader";

interface ChatMessage {
  role: "ai" | "user";
  content: string;
  timestamp: number;
}

export default function CreateRecipeChatPage() {
  const router = useRouter();
  const { user, updateProfile, uploadAvatar, logout } = useUser();
  const { t, language } = useLanguage();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [currentView, setCurrentView] = useState<"chat" | "profile">("profile");
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "courses">("posts");
  const [hoveredPostId, setHoveredPostId] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [tokenAmount, setTokenAmount] = useState<number>(100);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [walletRetryCount, setWalletRetryCount] = useState(0);
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
  const [userInput, setUserInput] = useState("");
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    ingredients: boolean;
    steps: boolean;
  }>({
    ingredients: false,
    steps: false
  });

  const toggleSection = (section: 'ingredients' | 'steps') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
      toChat: "До чату",
      toHome: "На головну",
      logout: "Війти",
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
      toChat: "Do czatu",
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
    }
  };

  const tr = translations[language as 'uk' | 'pl'] || translations.uk;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAIThinking, generatedRecipe]);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    setIsAIThinking(true);
    try {
      const response = await fetch("https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai/chef-mentor/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Початок",
          language: "ua"
        }),
      });

      const data = await response.json();
      
      console.log("🔍 Initialize Response:", JSON.stringify(data, null, 2));
      
      // Підтримка обох форматів
      let aiData;
      if (data.status === "success" && data.data) {
        aiData = data.data;
        console.log("✅ Init Format 1: {status, data}");
      } else if (data.message) {
        aiData = data;
        console.log("✅ Init Format 2: Direct object");
      } else {
        console.error("❌ Unknown init format:", data);
        addAIMessage("Привіт! Розкажіть, яку страву хочете приготувати? 🥘");
        return;
      }
      
      if (aiData.sessionId) {
        setSessionId(aiData.sessionId);
      }
      
      if (aiData.message) {
        addAIMessage(aiData.message);
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
      addAIMessage("Привіт! Розкажіть, яку страву хочете приготувати? 🥘");
    } finally {
      setIsAIThinking(false);
    }
  };

  const addAIMessage = (content: string | any) => {
    // Якщо прийшов об'єкт замість рядка, витягуємо message
    let messageText = content;
    
    if (typeof content === "object" && content !== null) {
      console.warn("⚠️ AI message is object, extracting text:", content);
      messageText = content.message || JSON.stringify(content, null, 2);
    }
    
    // Якщо message - це JSON string, розпарсимо його
    if (typeof messageText === "string" && messageText.startsWith("{")) {
      try {
        const parsed = JSON.parse(messageText);
        if (parsed.message) {
          console.log("🔄 Parsed JSON string to extract message");
          messageText = parsed.message;
        }
      } catch (e) {
        // Не JSON string, залишаємо як є
      }
    }
    
    console.log("💬 Adding AI message:", messageText);
    
    setChatMessages(prev => [...prev, {
      role: "ai",
      content: messageText,
      timestamp: Date.now()
    }]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, завантажте зображення");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Максимальний розмір файлу - 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Помилка завантаження фото");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeAttachedImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addUserMessage = (content: string) => {
    setChatMessages(prev => [...prev, {
      role: "user",
      content,
      timestamp: Date.now()
    }]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isAIThinking) return;

    const message = userInput.trim();
    const imageData = attachedImage;
    
    // Save image for later recipe publication
    if (imageData && !recipeImage) {
      setRecipeImage(imageData);
    }
    
    setUserInput("");
    setAttachedImage(null);
    addUserMessage(message);
    setIsAIThinking(true);

    try {
      const response = await fetch("https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai/chef-mentor/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionId,
          message: message,
          image: imageData,
          language: "ua"
        }),
      });

      const data = await response.json();

      console.log("🔍 RAW AI Response:", JSON.stringify(data, null, 2));

      // Backend може повертати різні структури:
      // 1. {status: "success", data: {message, recipe, isComplete}}
      // 2. {message, recipe, isComplete} напряму
      let aiData;
      
      if (data.status === "success" && data.data) {
        aiData = data.data;
        console.log("✅ Format 1: {status, data}");
      } else if (data.message) {
        aiData = data;
        console.log("✅ Format 2: Direct object");
      } else {
        console.error("❌ Unknown format:", data);
        addAIMessage("Вибачте, сталася помилка. Спробуйте ще раз 🙏");
        return;
      }
      
      console.log("📝 Extracted message:", aiData.message);
      
      // Витягуємо sessionId
      if (aiData.sessionId && aiData.sessionId !== sessionId) {
        setSessionId(aiData.sessionId);
        console.log("🔑 Session ID updated:", aiData.sessionId);
      }

      // Перевіряємо чи рецепт завершений
      if (aiData.isComplete && aiData.recipe) {
        console.log("✅ Recipe complete!", aiData.recipe);
        setGeneratedRecipe(aiData.recipe);
        setIsComplete(true);
        // НЕ додаємо message, бо показуємо recipe card
      } else {
        // Виводимо текст повідомлення ТІЛЬКИ якщо рецепт не завершений
        if (aiData.message) {
          addAIMessage(aiData.message);
        }
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      let errorMessage = "Не вдалося отримати відповідь. Перевірте з'єднання 🌐";
      if (error.message?.includes("AI service error")) {
        errorMessage = "🤖 AI сервіс тимчасово недоступний. Спробуйте через хвилину.";
      }
      
      addAIMessage(errorMessage);
    } finally {
      setIsAIThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePublish = async () => {
    if (!generatedRecipe) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(generatedRecipe),
      });

      if (response.ok) {
        const data = await response.json();
        const recipeId = data.data?.id || data.id;
        
        // Upload image if available
        if (recipeImage && recipeId) {
          try {
            await fetch(`https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai/recipes/${recipeId}/image`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl: recipeImage }),
            });
          } catch (imgError) {
            console.error("Error uploading image:", imgError);
            // Continue even if image upload fails
          }
        }
        
        router.push("/academy/feed");
      } else {
        alert("Помилка публікації рецепту");
      }
    } catch (error) {
      console.error("Error publishing recipe:", error);
      alert("Помилка публікації");
    }
  };

  // Load user posts when viewing profile
  useEffect(() => {
    if (currentView === "profile" && user?.id) {
      loadUserPosts();
    }
  }, [currentView, user?.id]);

  // Update formData when user changes
  useEffect(() => {
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
    }
  }, [user]);

  // Load wallet data and posts when user logs in or when switching to profile view
  useEffect(() => {
    if (user?.id && currentView === "profile") {
      console.log("🔄 Loading profile data for user:", user.id);
      loadWalletData();
      loadUserPosts();
    }
  }, [user?.id, currentView]);

  // Initial load on mount if user exists and we're on profile view
  useEffect(() => {
    if (user?.id) {
      console.log("🚀 Initial profile data load for user:", user.id);
      loadWalletData();
    }
  }, []);

  const loadUserPosts = async () => {
    if (!user?.id) return;
    
    setLoadingPosts(true);
    try {
      const response = await academyApi.getUserPosts(user.id);
      const posts = Array.isArray(response) ? response : (response as any)?.posts || [];
      setUserPosts(posts);
      
      // Filter saved posts
      const saved = posts.filter((post: any) => post.saved);
      setSavedPosts(saved);
    } catch (error: any) {
      console.error("Error loading user posts:", error);
      // If 404 or other error, just show empty state
      if (error.status === 404 || error.message?.includes('404')) {
        console.log("No posts found for user, showing empty state");
      }
      setUserPosts([]);
      setSavedPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadWalletData = async () => {
    if (!user?.id) return;
    
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("⚠️ No auth token found, cannot load wallet data");
      return;
    }
    
    setLoadingWallet(true);
    try {
      const walletData = await walletApi.getBalance(user.id, token);
      console.log("💰 Wallet data received:", walletData);
      
      // Backend returns: { balance: 100, transactions: [...] }
      const balance = (walletData as any)?.balance || (walletData as any)?.chefTokens || 0;
      const txs = (walletData as any)?.transactions || [];
      
      setWalletBalance(balance);
      setTransactions(txs);
      
      console.log(`✅ Wallet loaded: ${balance} tokens, ${txs.length} transactions`);
      
      // Check if user should have welcome bonus but doesn't
      if (balance === 0 && txs.length === 0) {
        console.warn("⚠️ User has empty wallet. This might be an old account or welcome bonus wasn't credited.");
        console.log("💡 User can earn tokens via /academy/earn-tokens or purchase them");
      }
    } catch (error: any) {
      console.error("Error loading wallet data:", error);
      
      // Handle specific errors
      if (error.status === 500 && error.message?.includes("Failed to create profile")) {
        console.warn("⚠️ Profile creation failed on backend. Using default values.");
        // Set default values for new users
        setWalletBalance(0);
        setTransactions([]);
        
        // Only retry if we haven't exceeded max retries
        if (walletRetryCount < 2) {
          setWalletRetryCount(prev => prev + 1);
          
          try {
            console.log(`🔄 Attempting to initialize profile (attempt ${walletRetryCount + 1}/2)...`);
            await academyApi.getProfile(user.id, token);
            console.log("✅ Profile initialized, retrying wallet load in 2s...");
            // Retry loading wallet after a short delay
            setTimeout(() => {
              console.log("🔄 Retrying wallet load...");
              loadWalletData();
            }, 2000);
          } catch (profileError) {
            console.error("❌ Could not initialize profile:", profileError);
            // Show user-friendly message
            console.warn("💡 Wallet will be available after profile is fully created");
          }
        } else {
          console.warn("⚠️ Max retry attempts reached. Wallet initialization failed.");
          // Reset retry count for next time
          setWalletRetryCount(0);
        }
      } else {
        // Use fallback from user object for other errors
        setWalletBalance((user as any)?.chefTokens || (user as any)?.tokensBalance || 0);
        setTransactions([]);
      }
    } finally {
      setLoadingWallet(false);
    }
  };

  const handlePurchaseTokens = async () => {
    if (!user?.id) return;
    
    const token = localStorage.getItem("authToken");
    if (!token) return;
    
    setIsSaving(true);
    try {
      await walletApi.purchaseTokens(user.id, tokenAmount, "card", token);
      await loadWalletData(); // Refresh balance
      setIsPurchaseModalOpen(false);
      alert(`Успішно куплено ${tokenAmount} токенів!`);
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      alert("Помилка покупки токенів. Спробуйте пізніше.");
    } finally {
      setIsSaving(false);
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

  return (
    <ResponsiveLayout
      sidebarWidth={256}
      sidebar={
        <div className="h-full flex flex-col">
          {/* Menu Items */}
          <div className="flex-1 space-y-1">
            <SidebarItem
              icon={<MessageSquarePlus className="w-4 h-4" />}
              label="Новий чат"
              active={currentView === "chat"}
              onClick={() => {
                setCurrentView("chat");
                // Очистити чат і почати новий
                setChatMessages([]);
                setGeneratedRecipe(null);
                setIsComplete(false);
                setRecipeImage(null);
                setSessionId(null);
                setExpandedSections({ ingredients: false, steps: false });
                initializeChat();
              }}
            />
            
            <div className="my-2 border-t border-gray-200" />
            
            <SidebarItem
              icon={<History className="w-4 h-4" />}
              label="Історія (скоро)"
              disabled
            />
            
            <SidebarItem
              icon={<Settings className="w-4 h-4" />}
              label="Налаштування"
              disabled
            />
          </div>

          {/* User Profile at Bottom */}
          <div className="border-t border-gray-200 pt-2 pb-2">
            <button
              onClick={() => setCurrentView("profile")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors group ${
                currentView === "profile" ? "bg-orange-100" : "hover:bg-orange-50"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-gray-800">Мій профіль</p>
                <p className="text-xs text-gray-500">Переглянути налаштування</p>
              </div>
            </button>
          </div>
        </div>
      }
      footer={
        currentView === "chat" ? (
          <div className="max-w-3xl mx-auto p-4 pb-6">
            {/* Image Preview */}
            {attachedImage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 flex items-center gap-3 bg-orange-50 p-3 rounded-xl border border-orange-200"
              >
                <img 
                  src={attachedImage} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded-lg border-2 border-orange-300 shadow-sm"
                />
                <span className="text-sm text-gray-600 flex-1">Прикріплено фото</span>
                <button
                  onClick={removeAttachedImage}
                  className="text-gray-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* Input Bar */}
            <div className="flex items-center gap-3 border-2 border-gray-200 rounded-2xl px-4 py-3 shadow-md bg-white focus-within:border-orange-400 focus-within:shadow-lg transition-all">
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {/* Paperclip Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isAIThinking || uploadingImage}
                className="text-gray-400 hover:text-orange-500 transition disabled:text-gray-300 p-2 rounded-lg hover:bg-orange-50 active:bg-orange-100"
                title="Прикріпити фото"
              >
                <Paperclip className="w-5 h-5" />
              </motion.button>

              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isComplete 
                  ? "Напишіть, що змінити або нову страву..." 
                  : "Що будемо готувати сьогодні?"
                }
                disabled={isAIThinking}
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 text-[15px]"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isAIThinking}
                className="text-orange-500 hover:text-orange-600 transition disabled:text-gray-300 p-2 rounded-lg hover:bg-orange-50 active:bg-orange-100"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Footer Info */}
            <p className="text-xs text-gray-400 mt-3 text-center">
              AI може помилятися. Перевіряйте важливу інформацію.
            </p>
          </div>
        ) : null
      }
    >
      {currentView === "chat" ? (
        <>
          {/* Header - Clean & Minimal */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-800">Шеф Діма</h1>
            </div>
          </header>

          {/* Main Chat Area */}
          <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col space-y-4">
        {/* Quick Examples - показуємо тільки якщо немає повідомлень */}
        {chatMessages.length === 0 && !isAIThinking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-3"
          >
            <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
              <span className="text-lg">💡</span>
              Приклади запитів:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { icon: "🍝", text: "Паста з грибами" },
                { icon: "🥗", text: "Легкий салат" },
                { icon: "🍰", text: "Щось солодке" },
                { icon: "🍜", text: "Азійська кухня" }
              ].map((example, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setUserInput(example.text);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all text-left"
                >
                  <span className="text-xl">{example.icon}</span>
                  <span className="text-sm text-gray-700 font-medium">{example.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {chatMessages.map((msg, index) => (
            <motion.div
              key={`${msg.timestamp}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] p-4 rounded-2xl leading-relaxed ${
                  msg.role === "ai"
                    ? "bg-white shadow-md border border-orange-50 text-gray-800"
                    : "bg-orange-50 text-gray-800 shadow-sm"
                }`}
              >
                {msg.role === "ai" && (
                  <div className="font-bold text-gray-900 mb-2 text-sm">
                    Шеф Діма
                  </div>
                )}
                <div className="whitespace-pre-wrap text-[#444] leading-[1.6]">{msg.content}</div>
              </div>

              {msg.role === "user" && (
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isAIThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white shadow-md border border-orange-50 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm font-medium">Шеф Діма друкує</span>
                <div className="flex gap-1">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-orange-400 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-orange-400 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-orange-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {generatedRecipe && isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Рецепт готовий!</h3>
            </div>

            {(recipeImage || generatedRecipe.imageUrl) && (
              <div className="mb-5 rounded-xl overflow-hidden shadow-md">
                <Image
                  src={recipeImage || generatedRecipe.imageUrl}
                  alt={generatedRecipe.title}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <h4 className="text-2xl font-bold text-gray-900 mb-3">{generatedRecipe.title}</h4>
            <p className="text-[#444] leading-[1.6] mb-5">{generatedRecipe.description}</p>

            <div className="flex gap-4 text-sm text-gray-600 mb-6 flex-wrap">
              {generatedRecipe.servings && (
                <span className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
                  <Users className="w-4 h-4 text-orange-600" />
                  {generatedRecipe.servings} порцій
                </span>
              )}
              {generatedRecipe.timeMinutes && (
                <span className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4 text-blue-600" />
                  {generatedRecipe.timeMinutes} хв
                </span>
              )}
              {generatedRecipe.difficulty && (
                <span className="flex items-center gap-1.5 bg-red-50 px-3 py-1.5 rounded-full">
                  <Flame className="w-4 h-4 text-red-600" />
                  {generatedRecipe.difficulty}
                </span>
              )}
            </div>

            {/* Інгредієнти - Accordion */}
            {generatedRecipe.ingredients && generatedRecipe.ingredients.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('ingredients')}
                  className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🥘</span>
                    <h5 className="text-lg font-bold text-gray-900">Інгредієнти</h5>
                    <span className="text-sm text-gray-500">
                      ({generatedRecipe.ingredients.length})
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      expandedSections.ingredients ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {expandedSections.ingredients && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-2 pt-3 px-3">
                        {generatedRecipe.ingredients.map((ingredient: any, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>
                              <span className="font-medium">{ingredient.name}</span>
                              {ingredient.quantity && (
                                <span className="text-gray-600">
                                  {' '}- {ingredient.quantity} {ingredient.unit}
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Кроки приготування - Accordion */}
            {generatedRecipe.steps && generatedRecipe.steps.length > 0 && (
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('steps')}
                  className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👨‍🍳</span>
                    <h5 className="text-lg font-bold text-gray-900">Приготування</h5>
                    <span className="text-sm text-gray-500">
                      ({generatedRecipe.steps.length} кроків)
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      expandedSections.steps ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {expandedSections.steps && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <ol className="space-y-3 pt-3 px-3">
                        {generatedRecipe.steps.map((step: string, idx: number) => (
                          <li key={idx} className="flex gap-3 text-gray-700">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="flex-1 leading-relaxed">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <Button
                onClick={handlePublish}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                Опублікувати рецепт
              </Button>
              <Button
                onClick={() => {
                  setGeneratedRecipe(null);
                  setIsComplete(false);
                  setRecipeImage(null);
                  setExpandedSections({
                    ingredients: false,
                    steps: false
                  });
                  // Прокручуємо до останнього повідомлення
                  setTimeout(() => {
                    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                variant="outline"
                className="px-6 py-3 rounded-xl border-2 hover:bg-gray-50 transition-all active:scale-95"
              >
                Змінити
              </Button>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
          </main>
        </>
      ) : (
        <>
          {/* Edit Profile Modal */}
          {isEditing && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl flex items-center justify-between z-10">
                  <h2 className="text-2xl font-bold text-gray-900">Редагувати профіль</h2>
                  <button
                    onClick={handleCancelEdit}
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
                        currentAvatar={user?.avatar}
                        userName={user?.name || "User"}
                        onUploadComplete={async (url) => {
                          await updateProfile({ avatar: url });
                          alert("Фото завантажено!");
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-500">Натисніть на фото, щоб змінити</p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      {tr.name}
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={tr.name}
                      className="text-lg"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <BookOpen className="w-4 h-4 inline mr-1" />
                      {tr.aboutMe}
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder={tr.aboutMe}
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
                        {tr.location}
                      </label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder={tr.location}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        {tr.phone}
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={tr.phone}
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{tr.socialMedia}</h3>
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
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
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
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200">
                    <p className="text-sm text-gray-600 mb-1">Поточний баланс</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loadingWallet ? "..." : walletBalance} токенів
                    </p>
                  </div>

                  {/* Amount Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Оберіть кількість токенів
                    </label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[100, 500, 1000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setTokenAmount(amount)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            tokenAmount === amount
                              ? "border-orange-500 bg-orange-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <p className="text-2xl font-bold text-gray-900">{amount}</p>
                          <p className="text-xs text-gray-500">${(amount / 10).toFixed(2)}</p>
                        </button>
                      ))}
                    </div>
                    
                    {/* Custom Amount */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Або введіть свою кількість</label>
                      <Input
                        type="number"
                        min="10"
                        step="10"
                        value={tokenAmount}
                        onChange={(e) => setTokenAmount(Number(e.target.value))}
                        className="text-lg font-semibold text-center"
                      />
                    </div>
                  </div>

                  {/* Price Display */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Токени:</span>
                      <span className="font-semibold text-gray-900">{tokenAmount}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Ціна за токен:</span>
                      <span className="font-semibold text-gray-900">$0.10</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">Загальна сума:</span>
                        <span className="text-2xl font-bold text-orange-600">
                          ${(tokenAmount / 10).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Безпечна оплата</p>
                      <p className="text-blue-700">Платіж буде оброблений через захищений шлюз</p>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-3xl flex gap-3">
                  <Button
                    onClick={handlePurchaseTokens}
                    disabled={isSaving || tokenAmount < 10}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 h-12 text-lg shadow-md"
                  >
                    <Coins className="w-5 h-5 mr-2" />
                    {isSaving ? "Обробка..." : `Купити за $${(tokenAmount / 10).toFixed(2)}`}
                  </Button>
                  <Button
                    onClick={() => setIsPurchaseModalOpen(false)}
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

          {/* Profile Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-800">{tr.myProfile}</h1>
            </div>
          </header>

          {/* Profile Content */}
          <main className="flex-1 w-full bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              {/* Profile Card - Pinterest Style */}
              <div className="bg-white rounded-3xl shadow-sm p-6">
                {/* Avatar - Centered */}
                <div className="flex flex-col items-center text-center mb-6">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-24 h-24 rounded-full shadow-lg mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg mb-4">
                      <span className="text-white text-3xl font-bold">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}

                  {/* Name and Username */}
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {user?.name || "Користувач"}
                  </h1>
                  <p className="text-gray-500 mb-1">
                    @{user?.name?.toLowerCase().replace(/\s+/g, '_') || "user"}
                  </p>
                  
                  {/* Bio */}
                  {user?.bio && (
                    <p className="text-gray-700 text-sm max-w-xl mt-3 mb-4">
                      {user.bio}
                    </p>
                  )}

                  {/* Location */}
                  {user?.location && (
                    <div className="flex items-center gap-2 text-gray-600 mb-6">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{user.location}</span>
                    </div>
                  )}

                  {/* Stats - Inline */}
                  <div className="flex items-center justify-center gap-6 text-sm mb-6">
                    <div>
                      <span className="font-bold text-gray-900">{userPosts.length}</span>
                      <span className="text-gray-600 ml-1">{tr.publications}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">{(user as any)?.followers || 0}</span>
                      <span className="text-gray-600 ml-1">{tr.followers}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">{(user as any)?.following || 0}</span>
                      <span className="text-gray-600 ml-1">{tr.following}</span>
                    </div>
                  </div>

                  {/* Token Balance Card */}
                  <div className="max-w-md mx-auto mb-6">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200 shadow-sm">
                      {walletBalance === 0 && transactions.length === 0 && !loadingWallet && (
                        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-blue-800 font-medium mb-1">
                                {tr.startEarning}
                              </p>
                              <p className="text-xs text-blue-600">
                                {tr.startEarningDesc}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {walletRetryCount > 0 && walletRetryCount < 2 && (
                        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 text-blue-700 animate-spin" />
                            <p className="text-xs text-blue-700">
                              {tr.initializing} ({walletRetryCount}/2)
                            </p>
                          </div>
                        </div>
                      )}
                      {walletRetryCount >= 2 && walletBalance === 0 && (
                        <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center justify-center gap-2">
                            <AlertCircle className="w-4 h-4 text-orange-700" />
                            <p className="text-xs text-orange-700">
                              {tr.walletAvailable}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
                            <Coins className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 font-medium">{tr.tokenBalance}</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {loadingWallet ? (
                                <span className="animate-pulse">...</span>
                              ) : (
                                walletBalance || (user as any)?.chefTokens || (user as any)?.tokensBalance || 0
                              )}
                              <span className="text-sm text-gray-500 ml-1 font-normal">{tr.tokens}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => router.push("/academy/earn-tokens")}
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
                        >
                          {tr.earn}
                        </Button>
                        <Button
                          onClick={() => setIsPurchaseModalOpen(true)}
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-md"
                        >
                          {tr.buy}
                        </Button>
                        <Button
                          onClick={() => {
                            console.log("🔄 Manual wallet reload requested");
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
                  </div>

                  {/* Recent Transactions */}
                  {transactions.length > 0 && (
                    <div className="max-w-md mx-auto mb-6">
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-gray-600" />
                            <h3 className="font-semibold text-gray-900">Історія транзакцій</h3>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {transactions.slice(0, 5).map((transaction: any, idx: number) => (
                            <div key={idx} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    transaction.type === 'earned' 
                                      ? 'bg-green-100 text-green-600' 
                                      : 'bg-red-100 text-red-600'
                                  }`}>
                                    {transaction.type === 'earned' ? '+' : '-'}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 text-sm">
                                      {transaction.reason || (transaction.type === 'earned' ? 'Зароблено' : 'Витрачено')}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(transaction.date).toLocaleDateString('uk-UA')}
                                    </p>
                                  </div>
                                </div>
                                <div className={`font-bold ${
                                  transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transaction History */}
                  {transactions.length > 0 && (
                    <div className="max-w-md mx-auto mb-6">
                      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-gray-600" />
                            <h3 className="font-semibold text-gray-900">{tr.transactionHistory}</h3>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {transactions.slice(0, 5).map((tx: any) => {
                            const isBonus = tx.type === 'bonus';
                            const isEarned = tx.type === 'earned';
                            const isSpent = tx.type === 'spent' || tx.type === 'purchase';
                            const isPositive = isBonus || isEarned || tx.amount > 0;
                            
                            // Icon component based on transaction type
                            const TransactionIcon = isBonus ? Gift : isEarned ? Coins : isSpent ? ShoppingBag : Wallet;
                            const iconColor = isBonus ? 'text-orange-600' : isEarned ? 'text-green-600' : isSpent ? 'text-blue-600' : 'text-gray-600';
                            const iconBg = isBonus ? 'bg-orange-100' : isEarned ? 'bg-green-100' : isSpent ? 'bg-blue-100' : 'bg-gray-100';
                            
                            return (
                              <div 
                                key={tx.id} 
                                className={`px-4 py-3 transition-colors ${
                                  isBonus 
                                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100' 
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
                                      <TransactionIcon className={`w-5 h-5 ${iconColor}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm font-medium truncate ${
                                        isBonus ? 'text-orange-900' : 'text-gray-900'
                                      }`}>
                                        {tx.description || tx.reason || 'Транзакція'}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-gray-500">
                                          {new Date(tx.createdAt || tx.date).toLocaleDateString('uk-UA', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </p>
                                        {isBonus && (
                                          <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full font-semibold">
                                            {tr.bonus}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`text-lg font-bold flex-shrink-0 ${
                                    isPositive ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {isPositive ? '+' : '-'}{Math.abs(tx.amount)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap justify-center">
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      {tr.editProfile}
                    </Button>
                    <Button 
                      onClick={() => setCurrentView("chat")}
                      variant="outline"
                    >
                      {tr.toChat}
                    </Button>
                    <Button 
                      onClick={() => router.push("/")}
                      variant="outline"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {tr.toHome}
                    </Button>
                    <Button 
                      onClick={() => {
                        logout();
                        router.push("/");
                      }}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {tr.logout}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 bg-white rounded-t-3xl">
                <div className="flex justify-center gap-8 px-6">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`py-4 px-2 font-semibold transition-all duration-300 relative ${
                      activeTab === "posts" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tr.created}
                    {activeTab === "posts" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("saved")}
                    className={`py-4 px-2 font-semibold transition-all duration-300 relative ${
                      activeTab === "saved" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tr.saved}
                    {activeTab === "saved" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("courses")}
                    className={`py-4 px-2 font-semibold transition-all duration-300 relative ${
                      activeTab === "courses" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tr.courses}
                    {activeTab === "courses" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content - Pinterest Masonry Grid */}
              <div className="bg-white rounded-b-3xl p-6">
                {loadingPosts ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
                    <p className="text-gray-500 mt-4">Завантаження...</p>
                  </div>
                ) : (
                  <>
                    {activeTab === "posts" && (
                      userPosts.length > 0 ? (
                        <div className="columns-2 md:columns-3 gap-4">
                          {userPosts.map((post, index) => (
                            <motion.div
                              key={post.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: index * 0.05 }}
                              className="break-inside-avoid mb-4 group cursor-pointer"
                              onMouseEnter={() => setHoveredPostId(post.id)}
                              onMouseLeave={() => setHoveredPostId(null)}
                            >
                              <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                                <img
                                  src={post.image || post.imageUrl || "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=500&fit=crop"}
                                  alt={post.title}
                                  className="w-full h-auto object-cover"
                                />
                                
                                {/* Hover Overlay */}
                                <div 
                                  className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                                    hoveredPostId === post.id ? 'opacity-100' : 'opacity-0'
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
                                        <span>{post.likes || 0}</span>
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
                      ) : (
                        <div className="text-center py-12">
                          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">{tr.noPostsYet}</p>
                          <Button 
                            onClick={() => setCurrentView("chat")}
                            className="mt-4"
                          >
                            Створити перший рецепт
                          </Button>
                        </div>
                      )
                    )}

                {activeTab === "saved" && (
                  <div className="columns-2 md:columns-3 gap-4">
                    {savedPosts.length > 0 ? (
                      savedPosts.map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
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
                        <p className="text-gray-500">{tr.noSavedYet}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "courses" && (
                  <div className="space-y-4">
                    {/* Completed Course */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
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
                      animate={{ opacity: 1, y: 0 }}
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
                  </>
                )}
              </div>
            </div>
          </main>
        </>
      )}
    </ResponsiveLayout>
  );
}
