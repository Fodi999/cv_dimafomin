"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIPromptGeneratorProps {
  onGenerate: (prompt: string) => void;
  generating: boolean;
}

export default function AIPromptGenerator({
  onGenerate,
  generating,
}: AIPromptGeneratorProps) {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-600 rounded-xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            🤖 AI Генератор рецептів
          </h3>
          <p className="text-sm text-gray-600">
            Опишіть страву - AI створить рецепт автоматично
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder="Наприклад: 'Філадельфія з лососем та огірком'"
          className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900 placeholder-gray-400"
          disabled={generating}
        />
        <Button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Генерую...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Згенерувати
            </>
          )}
        </Button>
      </div>

      {generating && (
        <div className="mt-4 flex items-center gap-3 text-purple-700">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
          <p className="text-sm font-medium">
            AI створює ваш рецепт... Це може зайняти 10-20 секунд
          </p>
        </div>
      )}
    </div>
  );
}
