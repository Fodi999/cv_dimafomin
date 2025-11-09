"use client";

import { ChatLayout } from "@/components/ChatLayout";
import { Button } from "@/components/ui/button";
import { 
  MessageSquarePlus, 
  History, 
  User, 
  Settings,
  Send,
  Paperclip
} from "lucide-react";

export default function ExamplePage() {
  return (
    <ChatLayout
      sidebar={
        <div className="p-4 space-y-2">
          {/* Sidebar Menu Items */}
          <Button variant="ghost" className="w-full justify-start gap-2">
            <MessageSquarePlus className="w-4 h-4" />
            <span>Новий чат</span>
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-2" disabled>
            <History className="w-4 h-4" />
            <span>Історія</span>
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-2">
            <User className="w-4 h-4" />
            <span>Профіль</span>
          </Button>

          <Button variant="ghost" className="w-full justify-start gap-2" disabled>
            <Settings className="w-4 h-4" />
            <span>Налаштування</span>
          </Button>
        </div>
      }
      footer={
        <div className="max-w-3xl mx-auto p-4">
          <div className="flex items-center gap-3 border-2 border-gray-200 rounded-2xl bg-white p-2">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Paperclip className="w-5 h-5 text-gray-400" />
            </Button>

            <input
              type="text"
              placeholder="Напишіть повідомлення..."
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
            />

            <Button size="icon" className="shrink-0 bg-orange-500 hover:bg-orange-600">
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">
            AI може помилятися. Перевіряйте важливу інформацію.
          </p>
        </div>
      }
    >
      {/* Main Content */}
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <header className="flex items-center justify-between py-4 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👨‍🍳</span>
            <h1 className="text-2xl font-bold text-gray-800">AI Кухар</h1>
          </div>

          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </header>

        {/* Chat Messages Area */}
        <div className="space-y-4 min-h-[60vh]">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-gray-600">
              Привіт! Я ваш AI-помічник на кухні. Що будемо готувати сьогодні?
            </p>
          </div>

          {/* Example Recipe Card */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              🍝 Спагетті Карбонара
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>⏱️ 20 хв</span>
                <span>•</span>
                <span>👥 2 порції</span>
                <span>•</span>
                <span>🔥 350 ккал</span>
              </div>

              <div className="bg-white/50 rounded-xl p-4">
                <h4 className="font-semibold mb-2">🥘 Інгредієнти</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Спагетті - 200г</li>
                  <li>• Бекон - 100г</li>
                  <li>• Яйця - 2 шт</li>
                  <li>• Пармезан - 50г</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}
