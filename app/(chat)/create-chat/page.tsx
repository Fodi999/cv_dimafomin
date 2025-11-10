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

interface ChatMessage {
  role: "ai" | "user";
  content: string;
  timestamp: number;
  suggestedActions?: string[];
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

export default function CreateRecipeChatPage() {
  const { language } = useLanguage();
  const { user } = useUser();
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

  const addAIMessage = (content: string | any) => {
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
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isAIThinking) return;

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
        addAIMessage(aiData);
      }
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

  const saveIngredientsToFridge = async () => {
    if (!generatedRecipe?.ingredients || generatedRecipe.ingredients.length === 0) {
      addAIMessage("Нет ингредиентов для сохранения");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
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
    <ResponsiveLayout
      sidebarWidth={0}
      sidebar={null}
      footer={
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
          onImageUpload={() => {}}
          onRemoveImage={() => setAttachedImage(null)}
          fileInputRef={fileInputRef}
        />
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />

      <ChatHeader title={tr.chefMentor} />

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left: Chat History Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-sky-200 dark:border-slate-800 overflow-hidden flex flex-col shadow-lg hidden lg:flex"
        >
          {/* History Header */}
          <div className="bg-gradient-to-r from-sky-500 to-cyan-500 p-5 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📚</span>
              <h2 className="text-lg font-bold">{tr.history}</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={startNewChat}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur text-white font-semibold py-2.5 rounded-lg transition border border-white/30 flex items-center justify-center gap-2 text-sm"
            >
              ✨ {tr.newChat}
            </motion.button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {chatHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex items-center justify-center text-center py-8"
              >
                <div>
                  <p className="text-4xl mb-2">🌟</p>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                    {tr.noHistory}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Почніть нову розмову
                  </p>
                </div>
              </motion.div>
            ) : (
              <>
                {chatHistory.map((chat, idx) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, y: -1 }}
                      onClick={() => loadChat(chat.id)}
                      className="w-full text-left p-3.5 rounded-xl bg-gradient-to-br from-white to-sky-100/50 dark:from-slate-800 dark:to-slate-800/50 hover:from-sky-100 hover:to-cyan-100/50 dark:hover:from-slate-700 dark:hover:to-slate-700/50 transition border border-sky-200/50 dark:border-slate-700 shadow-sm hover:shadow-md"
                    >
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                        {chat.preview}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                        <span>🕐</span>
                        {new Date(chat.timestamp).toLocaleDateString(
                          language as string === "uk" ? "uk-UA" : "pl-PL",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      onClick={() => {
                        if (confirm("Видалити цю розмову?")) {
                          deleteChat(chat.id);
                        }
                      }}
                      className="mt-2 w-full text-xs bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium py-1.5 rounded-lg transition flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100"
                    >
                      🗑️ {tr.deleteChat}
                    </motion.button>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </motion.div>

        {/* Right: Main Chat Area */}
        <main className="flex-1 max-w-3xl mx-auto px-4 py-6 flex flex-col space-y-4 min-w-0">
          {chatMessages.length === 0 && !isAIThinking && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                💡 {tr.exampleQueries}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickExamples.map((example) => (
                  <motion.button
                    key={example.text}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setUserInput(example.text);
                      setTimeout(() => handleSendMessage(), 50);
                    }}
                    className="bg-white/60 dark:bg-slate-800/50 border border-sky-200 dark:border-sky-700/50 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 font-medium"
                  >
                    {example.icon} {example.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

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
              className="mt-4"
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
      </div>
    </ResponsiveLayout>
  );
}
