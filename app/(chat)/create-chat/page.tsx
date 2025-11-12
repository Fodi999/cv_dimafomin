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
import { AlertCircle } from "lucide-react";
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

      // Deduct tokens after successful response
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
    <div className="flex flex-col h-[calc(100vh-128px)] bg-white dark:bg-slate-950 overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <ChatHeader
        title={tr.chefMentor}
        chatHistory={chatHistory}
        sessionId={sessionId}
        onLoadChat={loadChat}
        onDeleteChat={deleteChat}
        onNewChat={startNewChat}
      />

      {/* Token Settings Sheet Panel */}
      <Sheet open={showTokenPanel} onOpenChange={setShowTokenPanel}>
        <SheetContent side="right" className="w-96 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span>💎</span>
              Параметры запиту
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            {/* Balance Card */}
            {user && (
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Ваш баланс</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {user.chefTokens || 0}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">CT</span>
                  </div>
                  <Button 
                    onClick={() => {
                      router.push('/academy/earn-tokens');
                      setShowTokenPanel(false);
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    size="sm"
                  >
                    Купити токени
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Request Type Selector */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Виберіть тип запиту
              </p>
              <div className="space-y-2">
                {AI_REQUEST_TYPES.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all border-2 ${
                        isSelected
                          ? 'bg-orange-50 dark:bg-orange-950 border-orange-400 dark:border-orange-700'
                          : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`font-semibold text-sm ${
                            isSelected 
                              ? 'text-orange-700 dark:text-orange-300' 
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {type.name}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {type.description}
                          </p>
                        </div>
                        <Badge 
                          variant={isSelected ? "default" : "secondary"}
                          className={isSelected ? "bg-orange-500 hover:bg-orange-600" : ""}
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
                className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg space-y-2"
              >
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-700 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                      Недостаточно токенов
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                      Нужно {AI_REQUEST_TYPES.find(t => t.id === selectedType)?.cost || 0} CT, 
                      у вас {user.chefTokens || 0} CT
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    router.push('/academy/earn-tokens');
                    setShowTokenPanel(false);
                  }}
                  size="sm"
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
                >
                  Купити
                </Button>
              </motion.div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Chat Area - Scrollable */}
      <main className="flex-1 overflow-y-auto px-4 py-3 flex flex-col space-y-2 max-w-4xl w-full mx-auto min-w-0">
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
      <div className="bg-white dark:bg-slate-900 border-t border-sky-200 dark:border-slate-800 flex-shrink-0 px-4 py-3 flex items-center gap-3">
        <div className="flex-1">
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
          />
        </div>
        
        {/* Token Button - Right Side */}
        {user && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTokenPanel(true)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all"
          >
            <span className="text-lg">💎</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">{user.chefTokens || 0}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">CT</span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
