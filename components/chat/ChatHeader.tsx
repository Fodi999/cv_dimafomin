"use client";

import { ChefHat } from "lucide-react";

interface ChatHeaderProps {
  title: string;
}

export function ChatHeader({ title }: ChatHeaderProps) {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-sky-100 dark:border-sky-800/50 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-sm">
          <ChefHat className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</h1>
      </div>
    </header>
  );
}
