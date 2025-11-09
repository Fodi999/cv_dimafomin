// ChatInterface.tsx - Main chat interface component

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, Salad, Cake, Flame, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { RecipeCard } from "./RecipeCard";
import { useChat } from "@/hooks/useChat";
import { useRecipeGeneration } from "@/hooks/useRecipeGeneration";

export function ChatInterface() {
  const { language } = useLanguage();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [userInput, setUserInput] = useState("");
  
  // Custom hooks
  const {
    chatMessages,
    isAIThinking,
    sendMessage,
  } = useChat({ language, autoInitialize: true });

  const {
    generatedRecipe,
    recipeImage,
    attachedImage,
    uploadingImage,
    isComplete,
    expandedSections,
    fileInputRef,
    handleImageUpload,
    removeAttachedImage,
    toggleSection,
    setRecipeFromAI,
    markRecipeComplete,
    publishRecipe,
    resetRecipe,
  } = useRecipeGeneration();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAIThinking, generatedRecipe]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isAIThinking) return;

    const message = userInput.trim();
    const imageData = attachedImage;
    
    setUserInput("");
    
    const aiResponse = await sendMessage(message, imageData);
    
    // Check if recipe is complete
    if (aiResponse?.isComplete && aiResponse?.recipe) {
      console.log("✅ Recipe complete!", aiResponse.recipe);
      setRecipeFromAI(aiResponse.recipe);
      markRecipeComplete();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleModifyRecipe = () => {
    resetRecipe();
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const quickExamples = [
    { icon: <Flame className="w-5 h-5" />, text: "Паста з грибами" },
    { icon: <Salad className="w-5 h-5" />, text: "Легкий салат" },
    { icon: <Cake className="w-5 h-5" />, text: "Щось солодке" },
    { icon: <Flame className="w-5 h-5" />, text: "Азійська кухня" }
  ];

  return (
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
        {/* Quick Examples - only show if no messages */}
        {chatMessages.length === 0 && !isAIThinking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-3"
          >
            <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Приклади запитів:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickExamples.map((example, idx) => (
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
                  <div className="text-orange-600">{example.icon}</div>
                  <span className="text-sm text-gray-700 font-medium">{example.text}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat Messages */}
        <AnimatePresence>
          {chatMessages.map((msg, index) => (
            <ChatMessage
              key={`${msg.timestamp}-${index}`}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
              index={index}
            />
          ))}
        </AnimatePresence>

        {/* AI Thinking Indicator */}
        {isAIThinking && <TypingIndicator />}

        {/* Generated Recipe Card */}
        {generatedRecipe && isComplete && (
          <RecipeCard
            recipe={generatedRecipe}
            recipeImage={recipeImage}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onPublish={publishRecipe}
            onModify={handleModifyRecipe}
          />
        )}

        <div ref={chatEndRef} />
      </main>
    </>
  );
}
