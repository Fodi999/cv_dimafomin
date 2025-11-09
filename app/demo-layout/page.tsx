"use client";

import { ResponsiveLayout, SidebarItem } from "@/components/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquarePlus, 
  History, 
  User, 
  Settings,
  Send,
  Paperclip,
  ChefHat
} from "lucide-react";

export default function DemoPage() {
  return (
    <ResponsiveLayout
      sidebarWidth={256} // Custom width
      sidebar={
        <div className="space-y-1">
          <SidebarItem
            icon={<MessageSquarePlus className="w-4 h-4" />}
            label="Новий чат"
            active
            onClick={() => console.log("New chat")}
          />
          
          <SidebarItem
            icon={<History className="w-4 h-4" />}
            label="Історія чатів"
            disabled
          />

          <div className="my-2 border-t border-gray-200" />

          <SidebarItem
            icon={<User className="w-4 h-4" />}
            label="Мій профіль"
            onClick={() => console.log("Profile")}
          />

          <SidebarItem
            icon={<Settings className="w-4 h-4" />}
            label="Налаштування"
            disabled
          />
        </div>
      }
      footer={
        <div className="max-w-4xl mx-auto p-4 pb-6">
          {/* Input Area */}
          <div className="flex items-center gap-3 border-2 border-gray-200 rounded-2xl bg-white p-2 shadow-sm hover:border-orange-300 transition-colors">
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0 hover:bg-orange-50"
            >
              <Paperclip className="w-5 h-5 text-gray-400" />
            </Button>

            <input
              type="text"
              placeholder="Що будемо готувати сьогодні?"
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 px-2"
            />

            <Button 
              size="icon" 
              className="shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md"
            >
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
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">AI Кухар</h1>
              <p className="text-sm text-gray-500">Ваш особистий кулінарний помічник</p>
            </div>
          </div>

          {/* User Avatar */}
          <Button variant="ghost" size="icon" className="rounded-full">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </Button>
        </header>

        {/* Chat Messages */}
        <div className="space-y-6 min-h-[60vh]">
          {/* Welcome Message */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <ChefHat className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-gray-700">
                    Привіт! Я ваш AI-помічник на кухні. Що будемо готувати сьогодні? 
                    Я можу допомогти з рецептами, порадами з приготування та багато іншого! 👨‍🍳
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Recipe Card */}
          <Card className="shadow-md hover:shadow-xl transition-all border-orange-200">
            <CardHeader className="bg-gradient-to-br from-orange-50 to-yellow-50 border-b border-orange-100">
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">🍝</span>
                <span>Спагетті Карбонара</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>⏱️</span>
                  <span>20 хвилин</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span>2 порції</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔥</span>
                  <span>350 ккал</span>
                </div>
              </div>

              {/* Ingredients */}
              <div className="bg-orange-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🥘</span>
                  <span>Інгредієнти</span>
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Спагетті - 200г</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Бекон (або панчетта) - 100г</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Яйця - 2 шт</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Пармезан (тертий) - 50г</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Чорний перець - за смаком</span>
                  </li>
                </ul>
              </div>

              {/* Cooking Steps */}
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span>👨‍🍳</span>
                  <span>Приготування</span>
                </h4>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600 shrink-0">1.</span>
                    <span>Відваріть спагетті до стану al dente в підсоленій воді.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600 shrink-0">2.</span>
                    <span>Обсмажте бекон на сковороді до золотистого кольору.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600 shrink-0">3.</span>
                    <span>Збийте яйця з пармезаном і перцем у мисці.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600 shrink-0">4.</span>
                    <span>Додайте спагетті до бекону, зніміть з вогню і швидко перемішайте з яєчною сумішшю.</span>
                  </li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                  Готувати
                </Button>
                <Button variant="outline" className="flex-1">
                  Змінити
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
