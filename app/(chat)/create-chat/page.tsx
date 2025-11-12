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
      <ChatHeader
        title={tr.chefMentor}
        chatHistory={chatHistory}
        sessionId={sessionId}
        onLoadChat={loadChat}
        onDeleteChat={deleteChat}
        onNewChat={startNewChat}
      />

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
      <div className="bg-white dark:bg-slate-900 border-t border-sky-200 dark:border-slate-800 flex-shrink-0">
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
    </div>
  );
}
