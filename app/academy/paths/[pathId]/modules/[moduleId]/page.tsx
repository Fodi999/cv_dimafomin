"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Coins,
  MessageSquare,
  Send,
  Lightbulb
} from "lucide-react";
import { getPathById, getModuleById } from "@/lib/academy/paths-data";
import type { ModuleTask } from "@/lib/academy/paths-data";

type TaskStatus = "pending" | "in-progress" | "completed";

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const pathId = params.pathId as string;
  const moduleId = params.moduleId as string;

  const path = getPathById(pathId);
  const module = getModuleById(pathId, moduleId);

  // State
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>(
    module?.tasks.map(() => "pending" as TaskStatus) || []
  );
  const [userResponse, setUserResponse] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "ai" | "user"; text: string }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [conversationTurn, setConversationTurn] = useState(0);

  if (!path || !module) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Moduł nie znaleziony
          </h1>
          <button
            onClick={() => router.push("/academy")}
            className="text-sky-600 hover:text-sky-700 font-medium"
          >
            ← Powrót do Akademii
          </button>
        </div>
      </div>
    );
  }

  const currentTask = module.tasks[currentTaskIndex];
  const isLastTask = currentTaskIndex === module.tasks.length - 1;
  const isModuleCompleted = taskStatuses.every(status => status === "completed");

  // Handle task submission
  const handleSubmitTask = async () => {
    if (!userResponse.trim() || isAiThinking) return;

    const userMessage = userResponse.trim();
    setUserResponse("");
    setIsAiThinking(true);

    // Add user message to conversation
    const updatedMessages = [...aiMessages, { role: "user" as const, text: userMessage }];
    setAiMessages(updatedMessages);

    try {
      // Call AI Mentor API
      const response = await fetch("/api/academy/ai/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathId,
          moduleId,
          taskId: currentTask.id,
          taskType: currentTask.type,
          userAnswer: userMessage,
          conversationHistory: updatedMessages.map(msg => ({
            role: msg.role === "user" ? "user" : "ai",
            message: msg.text
          })),
          aiPrompt: currentTask.aiPrompt,
          aiQuestions: currentTask.aiQuestions,
        }),
      });

      if (!response.ok) {
        throw new Error("AI response failed");
      }

      const data = await response.json();

      // Add AI response to conversation
      setAiMessages(prev => [...prev, { role: "ai", text: data.aiMessage }]);
      setConversationTurn(data.conversationTurn);

      // Check if task should be completed
      if (data.shouldCompleteTask) {
        const newStatuses = [...taskStatuses];
        newStatuses[currentTaskIndex] = "completed";
        setTaskStatuses(newStatuses);
        
        // Award tokens
        const tokensEarned = data.progressUpdate?.earnedTokens || currentTask.reward;
        setEarnedTokens(earnedTokens + tokensEarned);
        setShowFeedback(true);
      }
    } catch (error) {
      console.error("AI Mentor error:", error);
      // Fallback to local response
      const fallbackResponse = generateAIResponse(currentTask, userMessage);
      setAiMessages(prev => [...prev, { role: "ai", text: fallbackResponse }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Simple AI response generator (placeholder - later replace with real AI)
  const generateAIResponse = (task: ModuleTask, userText: string): string => {
    const responses: Record<string, string[]> = {
      "ai-question": [
        "Dobra obserwacja! A co sprawia, że ten produkt będzie lepszy od innych?",
        "Interesujące. Teraz pomyśl: jak wykorzystasz jego najlepsze cechy?",
        "Świetnie! Co jeszcze zwróciłeś uwagę przy wyborze?"
      ],
      "decision": [
        "Dobra decyzja! Co było kluczowe w tym wyborze?",
        "Rozumiem. A co by się stało, gdybyś wybrał inaczej?",
        "To przemyślane podejście. Widzę logikę w Twoim myśleniu."
      ],
      "analysis": [
        "Świetna analiza! Co jeszcze zauważyłeś?",
        "To ciekawe spostrzeżenie. Co z tego wynika?",
        "Doskonale! Teraz zastanów się, jak to wykorzystasz."
      ],
      "practice": [
        "Dobra decyzja! Widzę, że myślisz o jakości, nie tylko o cenie.",
        "To przemyślane podejście. Co Cię skłoniło do tej decyzji?",
        "Świetna analiza! Teraz zastosuj to w praktyce."
      ],
      "reflection": [
        "Cenna refleksja. To właśnie myślenie kucharza!",
        "Doskonale! Uczysz się przez analizę swoich decyzji.",
        "To klucz do rozwoju - świadome obserwacje."
      ]
    };

    const options = responses[task.type] || responses["ai-question"];
    return options[Math.floor(Math.random() * options.length)];
  };

  const handleNextTask = () => {
    setShowFeedback(false);
    setAiMessages([]);
    setConversationTurn(0);
    
    if (!isLastTask) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      const newStatuses = [...taskStatuses];
      newStatuses[currentTaskIndex + 1] = "in-progress";
      setTaskStatuses(newStatuses);
    }
  };

  const handleCompleteModule = () => {
    // В реальності - save to backend
    router.push(`/academy/paths/${pathId}`);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push(`/academy/paths/${pathId}`)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Powrót do ścieżki
        </motion.button>

        {/* Module Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-sm text-gray-500 dark:text-gray-500 mb-2">
            Moduł {module.number} / {path.totalModules}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {module.title}
          </h1>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Postęp modułu</span>
              <span>{taskStatuses.filter(s => s === "completed").length} / {module.tasks.length}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${(taskStatuses.filter(s => s === "completed").length / module.tasks.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Tokens earned */}
          {earnedTokens > 0 && (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
              <Coins className="w-5 h-5" />
              <span>+{earnedTokens} ChefTokens zdobyte</span>
            </div>
          )}
        </motion.div>

        {/* Key Idea */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 p-6 rounded-2xl border-2 border-sky-200 dark:border-sky-800 mb-8"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-1" />
            <div>
              <div className="text-sm font-semibold text-sky-900 dark:text-sky-300 mb-1">
                Kluczowa idea
              </div>
              <p className="text-gray-900 dark:text-white font-medium">
                {module.idea}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Module Intro */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
            {module.intro}
          </p>
        </motion.div>

        {/* Current Task */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 shadow-lg">
            
            {/* Task header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-1">
                    Zadanie {currentTaskIndex + 1} / {module.tasks.length}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentTask.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                <Coins className="w-4 h-4" />
                +{currentTask.reward}
              </div>
            </div>

            {/* Task description */}
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {currentTask.description}
            </p>

            {/* AI Dialog */}
            <div className="space-y-4 mb-6">
              {/* Initial AI prompt */}
              {aiMessages.length === 0 && currentTask.aiPrompt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {currentTask.aiPrompt.split('.')[0]}...
                    </p>
                  </div>
                </div>
              )}

              {/* AI conversation */}
              <AnimatePresence>
                {aiMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    {msg.role === "ai" && (
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`p-4 rounded-2xl flex-1 max-w-[80%] ${
                      msg.role === "ai" 
                        ? "bg-purple-50 dark:bg-purple-900/20" 
                        : "bg-sky-100 dark:bg-sky-900/30"
                    }`}>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {msg.text}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* AI Thinking indicator */}
                {isAiThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User input */}
            {!showFeedback && (
              <div className="space-y-3">
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Twoja odpowiedź..."
                  rows={4}
                  disabled={isAiThinking}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handleSubmitTask}
                  disabled={!userResponse.trim() || isAiThinking}
                  className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isAiThinking ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      AI myśli...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Wyślij odpowiedź
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Feedback card */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <h4 className="font-bold text-green-900 dark:text-green-300 mb-2">
                        Zadanie ukończone!
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-300">
                        Zdobyłeś <strong>+{currentTask.reward} ChefTokens</strong> za świadomą decyzję
                      </p>
                    </div>
                  </div>

                  {!isLastTask ? (
                    <button
                      onClick={handleNextTask}
                      className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Następne zadanie
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteModule}
                      className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Ukończ moduł (+{module.totalReward} ChefTokens)
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Why it matters */}
        {!isModuleCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-sky-600" />
              Dlaczego to ważne?
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Ta umiejętność oszczędza pieniądze i czas w realnej kuchni. 
              Szef kuchni myśli o produkcie, nie o przepisie — to właśnie się teraz uczysz.
            </p>
          </motion.div>
        )}

      </div>
    </main>
  );
}
