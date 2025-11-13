"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { RecipeCard } from "@/components/chat/RecipeCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { uploadApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertCircle, Gem, Wallet, Settings, AlertTriangle } from "lucide-react";
import { useState as useStateImport } from "react";

interface ChatMessage {
  role: "ai" | "user";
  content: string;
  timestamp: number;
  suggestedActions?: string[];
  cost?: number;
}

interface Recipe {
  title: string;
  description?: string;
  ingredients?: Array<{ name: string; quantity?: string; unit?: string }>;
  steps?: string[];
  servings?: number;
  timeMinutes?: number;
  difficulty?: string;
  imageUrl?: string;
}

interface ChatHistoryItem {
  id: string;
  timestamp: number;
  preview: string;
}

const AI_REQUEST_TYPES = [
  {
    id: 'recipe',
    name: 'Рецепт',
    description: 'Генерировать рецепт по названию',
    cost: 5,
  },
  {
    id: 'meal-idea',
    name: 'Ідея ужину',
    description: 'Идеи блюд по ингредиентам',
    cost: 10,
  },
  {
    id: 'technique',
    name: 'Техніка',
    description: 'Объяснить кулинарную технику',
    cost: 3,
  },
  {
    id: 'learning-plan',
    name: 'План обучения',
    description: 'Создать персональный курс',
    cost: 20,
  },
  {
    id: 'photo-check',
    name: 'Проверка фото',
    description: 'AI анализ вашего блюда',
    cost: 50,
  },
];

export default function CreateRecipeChatPage() {
  const { language } = useLanguage();
  const { user, refreshBalance } = useUser();
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    ingredients: false,
    steps: false,
  });
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [selectedType, setSelectedType] = useState('recipe');
  const [showTokenPanel, setShowTokenPanel] = useState(false);

  const translations = {
    uk: {
      chefMentor: "Шеф Діма",
      exampleQueries: "Приклади запитів:",
      typeHere: "Що будемо готувати сьогодні?",
      history: "Історія",
      newChat: "Нова розмова",
      deleteChat: "Видалити",
      noHistory: "Немає збережених розмов",
    },
    pl: {
      chefMentor: "Szef Dima",
      exampleQueries: "Przykładowe pytania:",
      typeHere: "Co dzisiaj gotujemy?",
      history: "Historia",
      newChat: "Nowa rozmowa",
      deleteChat: "Usuń",
      noHistory: "Brak zapisanych rozmów",
    },
  };

  const tr = translations[language as "uk" | "pl"] || translations.uk;

  const loadChatHistory = () => {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith("chat_"));
      const history = keys.map((key) => {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        return {
          id: key.replace("chat_", ""),
          timestamp: data.timestamp || 0,
          preview: data.preview || "Нова розмова",
        };
      });
      setChatHistory(history.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const loadChat = (chatId: string) => {
    try {
      const chatData = JSON.parse(localStorage.getItem(`chat_${chatId}`) || "{}");
      if (chatData.messages) {
        setChatMessages(chatData.messages);
        setGeneratedRecipe(chatData.recipe || null);
        setSessionId(chatId);
        setIsComplete(!!chatData.recipe);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  const deleteChat = (chatId: string) => {
    try {
      localStorage.removeItem(`chat_${chatId}`);
      loadChatHistory();
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const startNewChat = () => {
    const newSessionId = `session_${Date.now()}`;
    setSessionId(newSessionId);
    setChatMessages([]);
    setGeneratedRecipe(null);
    setIsComplete(false);
    setRecipeImage(null);
    initializeChat();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAIThinking, generatedRecipe]);

  useEffect(() => {
    if (sessionId && (chatMessages.length > 0 || generatedRecipe)) {
      const chatData = {
        messages: chatMessages,
        recipe: generatedRecipe,
        timestamp: Date.now(),
        preview: chatMessages.length > 0 ? chatMessages[chatMessages.length - 1].content.substring(0, 50) : "Нова розмова",
      };
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(chatData));
    }
  }, [chatMessages, generatedRecipe, sessionId]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    const newSessionId = sessionId || `session_${Date.now()}`;
    if (!sessionId) setSessionId(newSessionId);

    setIsAIThinking(true);
    try {
      const response = await fetch(
        "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai/chef-mentor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "Привіт! Почніть розповідати про страву, яку хочете готувати.",
            language: "ua",
          }),
        }
      );

      if (!response.ok) {
        addAIMessage("Привіт! Розкажіть, яку страву хочете приготувати? 🥘");
        return;
      }

      const data = await response.json();
      const aiData = data.data || data;
      if (aiData.sessionId) setSessionId(aiData.sessionId);
      if (aiData.message) addAIMessage(aiData);
    } catch (error) {
      addAIMessage("Привіт! Розкажіть, яку страву хочете приготувати? 🥘");
    } finally {
      setIsAIThinking(false);
    }
  };

  const addAIMessage = (content: string | any, cost?: number) => {
    let messageText = typeof content === "string" ? content : content.message;
    let suggestedActions: string[] | undefined;

    if (typeof messageText === "string" && messageText.startsWith("{")) {
      try {
        const parsed = JSON.parse(messageText);
        messageText = parsed.message || messageText;
      } catch (e) {
        // Not JSON
      }
    }

    if (typeof content === "object" && content.suggestedActions) {
      suggestedActions = content.suggestedActions;
    }

    setChatMessages((prev) => [
      ...prev,
      {
        role: "ai",
        content: messageText,
        timestamp: Date.now(),
        suggestedActions,
        cost,
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isAIThinking) return;

    const currentType = AI_REQUEST_TYPES.find((t) => t.id === selectedType);
    const cost = currentType?.cost || 0;

    // Check balance
    if (!user || (user.chefTokens || 0) < cost) {
      alert(`Недостаточно токенов! Нужно ${cost} CT, у вас ${user?.chefTokens || 0}`);
      return;
    }

    const message = userInput.trim();
    const imageData = attachedImage;
    if (imageData && !recipeImage) setRecipeImage(imageData);

    setUserInput("");
    setAttachedImage(null);
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: message, timestamp: Date.now() },
    ]);
    setIsAIThinking(true);

    try {
      const response = await fetch(
        "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai/chef-mentor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, image: imageData, language: "ua" }),
        }
      );

      if (!response.ok) {
        addAIMessage("Вибачте, сталася помилка. Спробуйте ще раз 🙏");
        return;
      }

      const data = await response.json();
      const aiData = data.data || data;

      if (aiData.sessionId && aiData.sessionId !== sessionId) {
        setSessionId(aiData.sessionId);
      }

      if (aiData.isComplete && aiData.recipe) {
        setGeneratedRecipe(aiData.recipe);
        setIsComplete(true);
      }

      if (aiData.message) {
        addAIMessage(aiData, cost);
      }

      // Deduct tokens immediately from UI (optimistic update)
      if (user) {
        user.chefTokens = (user.chefTokens || 0) - cost;
      }

      // Refresh balance from backend to sync
      await refreshBalance();
    } catch (error) {
      addAIMessage("Не вдалося отримати відповідь. Перевірте з'єднання 🙏");
    } finally {
      setIsAIThinking(false);
    }
  };

  const handleSuggestedAction = async (action: string) => {
    switch (action) {
      case "save_ingredients_to_fridge":
        await saveIngredientsToFridge();
        break;
      case "save_recipe":
        await handlePublish();
        break;
      case "generate_meal_plan":
        setUserInput("Помогите создать план питания на неделю");
        break;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const token = localStorage.getItem("token");
      
      // Upload to backend
      const uploadResponse = await uploadApi.uploadImageFile(file, token || undefined);
      
      // Set the image URL from response
      setAttachedImage(uploadResponse.url);
      
      console.log("✅ Image uploaded successfully:", uploadResponse.url);
    } catch (error) {
      console.error("Failed to upload image:", error);
      addAIMessage("❌ Ошибка загрузки фото. Попробуйте снова.");
    } finally {
      setUploadingImage(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const saveIngredientsToFridge = async () => {
    if (!generatedRecipe?.ingredients || generatedRecipe.ingredients.length === 0) {
      addAIMessage("Нет ингредиентов для сохранения");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        addAIMessage("Требуется авторизация");
        return;
      }

      setIsAIThinking(true);
      const response = await fetch(
        "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/ai/save-ingredients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ingredients: generatedRecipe.ingredients.map((ing) => ({
              name: ing.name,
              amount: parseInt(ing.quantity || "1") || 1,
              unit: ing.unit || "шт",
            })),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        addAIMessage(
          `✅ ${data.message || `Добавлено ${data.count} ингредиентов в холодильник!`}`
        );
      } else {
        const error = await response.json();
        addAIMessage(`❌ Ошибка: ${error.error || "Не удалось сохранить ингредиенты"}`);
      }
    } catch (error) {
      addAIMessage("❌ Ошибка при сохранении ингредиентов");
    } finally {
      setIsAIThinking(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedRecipe) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(generatedRecipe),
      });

      if (response.ok) {
        addAIMessage("✅ Рецепт опублікований!");
        resetRecipe();
      } else {
        addAIMessage("❌ Помилка публікації");
      }
    } catch (error) {
      addAIMessage("❌ Помилка публікації");
    }
  };

  const resetRecipe = () => {
    loadChatHistory();
    startNewChat();
  };

  const quickExamples = [
    { icon: "🍝", text: "Паста з грибами" },
    { icon: "🥗", text: "Легкий салат" },
    { icon: "🍰", text: "Щось солодке" },
    { icon: "🍜", text: "Азійська кухня" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white dark:bg-slate-950 overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="mt-16">
        <ChatHeader
          title={tr.chefMentor}
          chatHistory={chatHistory}
          sessionId={sessionId}
          onLoadChat={loadChat}
          onDeleteChat={deleteChat}
          onNewChat={startNewChat}
        />
      </div>

      {/* Token Settings Sheet Panel */}
      <Sheet open={showTokenPanel} onOpenChange={setShowTokenPanel}>
        <SheetContent side="right" className="w-96 overflow-y-auto bg-white dark:bg-slate-900 border-l border-sky-200 dark:border-slate-800 px-6">
          <SheetHeader className="border-b border-sky-200 dark:border-slate-800 pb-4">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Gem className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-800 dark:text-gray-100">Параметры запиту</span>
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6 mt-6 pr-2">
            {/* Balance Card */}
            {user && (
              <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950 dark:to-cyan-900 border border-sky-200 dark:border-sky-800 rounded-2xl p-5 shadow-sm">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Ваш баланс
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-sky-600 dark:text-sky-400">
                    {user.chefTokens || 0}
                  </span>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Chef Tokens</span>
                </div>
                <Button 
                  onClick={() => {
                    router.push('/academy/earn-tokens');
                    setShowTokenPanel(false);
                  }}
                  className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all"
                  size="sm"
                >
                  <Gem className="w-4 h-4 mr-2" />
                  Купити ще токенів
                </Button>
              </div>
            )}

            {/* Request Type Selector */}
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                Виберіть тип запиту
              </p>
              <div className="space-y-3">
                {AI_REQUEST_TYPES.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                        isSelected
                          ? 'bg-sky-100 dark:bg-sky-900/50 border-sky-400 dark:border-sky-600 shadow-md'
                          : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className={`font-bold text-sm ${
                            isSelected 
                              ? 'text-sky-700 dark:text-sky-300' 
                              : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {type.name}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {type.description}
                          </p>
                        </div>
                        <Badge 
                          className={`flex-shrink-0 font-bold ${
                            isSelected 
                              ? 'bg-sky-500 hover:bg-sky-600 text-white' 
                              : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {type.cost} CT
                        </Badge>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Balance Warning */}
            {user && (user.chefTokens || 0) < (AI_REQUEST_TYPES.find(t => t.id === selectedType)?.cost || 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-950/50 border-2 border-red-200 dark:border-red-800 rounded-xl space-y-3"
              >
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-800 dark:text-red-300">
                      Недостаточно токенов
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-2 leading-relaxed">
                      Для запиту потрібно <span className="font-bold">{AI_REQUEST_TYPES.find(t => t.id === selectedType)?.cost || 0} CT</span>, 
                      у вас є <span className="font-bold">{user.chefTokens || 0} CT</span>
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    router.push('/academy/earn-tokens');
                    setShowTokenPanel(false);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
                  size="sm"
                >
                  <Gem className="w-4 h-4 mr-2" />
                  Купити токенів
                </Button>
              </motion.div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Chat Area - Scrollable */}
      <main className="flex-1 overflow-y-auto px-4 py-3 flex flex-col space-y-2 max-w-4xl w-full mx-auto min-w-0 pb-32">
        <ChatMessages
          messages={chatMessages}
          isThinking={isAIThinking}
          chefName={tr.chefMentor}
          userAvatar={user?.avatar}
          userName={user?.name}
          onSuggestedAction={handleSuggestedAction}
        />

        {generatedRecipe && isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
            <RecipeCard
              recipe={generatedRecipe}
              recipeImage={recipeImage}
              expandedSections={expandedSections}
              onToggleSection={(section) =>
                setExpandedSections((prev) => ({
                  ...prev,
                  [section]: !prev[section],
                }))
              }
              onPublish={handlePublish}
              onModify={() => {
                setIsComplete(false);
                setGeneratedRecipe(null);
              }}
            />
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* Footer - Fixed Input */}
      <div className="bg-white dark:bg-slate-900 border-t border-sky-200 dark:border-slate-800 flex-shrink-0 px-4 py-2 flex items-center gap-1 fixed bottom-0 left-0 right-0 z-30">
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <ChatInput
            value={userInput}
            onChange={setUserInput}
            onSend={handleSendMessage}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isAIThinking}
            isComplete={isComplete}
            attachedImage={attachedImage}
            uploadingImage={uploadingImage}
            onImageUpload={handleImageUpload}
            onRemoveImage={() => setAttachedImage(null)}
            fileInputRef={fileInputRef}
            tokenCount={user?.chefTokens || 0}
            onTokenClick={() => setShowTokenPanel(true)}
          />
        </div>
      </div>
    </div>
  );
}
