"use client";

import { ChefHat, TrendingDown, DollarSign, Brain, ArrowRight, Code, Database, Cloud, Cpu, Instagram } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  
  if (!t?.about) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors">
            <ChefHat className="w-6 h-6" />
            <span className="font-bold text-xl">ChefOS</span>
          </Link>
          <Link 
            href="/auth/login"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            {t.about.cta.login}
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
            ChefOS
          </h1>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">
            Умная кулинарная платформа
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              ChefOS — интеллектуальная кулинарная платформа, которая помогает готовить <strong>осознанно, экономично и системно</strong>.
            </p>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              Платформа объединяет AI-рекомендации, управление продуктами, рецепты и расчёт себестоимости в единую экосистему для дома и кухни.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Начать пользоваться
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#business"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Для бизнеса
            </a>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl hover:shadow-3xl transition-shadow border border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8 text-center">
            ChefOS помогает
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                <ChefHat className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50 mb-2">
                  Готовить из того, что уже есть
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  AI подбирает рецепты на основе продуктов в вашем холодильнике
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50 mb-2">
                  Снижать пищевые потери
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Отслеживайте сроки годности и используйте продукты вовремя
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50 mb-2">
                  Контролировать себестоимость блюд
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Точный расчёт стоимости каждого блюда на основе актуальных цен
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50 mb-2">
                  Принимать решения на основе данных
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Не интуиция, а факты: статистика, аналитика, прогнозы
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Creator Section */}
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-3xl p-8 sm:p-12 border border-orange-200/50 dark:border-orange-800/50">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-8 text-center">
            Создатель
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-orange-300 dark:border-orange-700 shadow-xl">
              <Image
                src="https://i.postimg.cc/V5QZwGRX/IMG_4239.jpg"
                alt="Dima Fomin"
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                Dima Fomin
              </h3>
              <p className="text-lg text-orange-600 dark:text-orange-400 font-semibold mb-2">
                Chef / Full-stack разработчик
              </p>
              <span className="inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300">
                20+ лет реального шеф-опыта
              </span>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                Создатель ChefOS. Профессиональный повар с более чем 20-летним международным опытом и соло full-stack разработчик.
                Я разрабатываю кулинарные системы на стыке реальной кухни, инженерного мышления и AI.
              </p>
            </div>
          </div>
        </section>

        {/* Business Section */}
        <section id="business" className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-3xl p-8 sm:p-12 border border-blue-200/50 dark:border-blue-800/50">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6 text-center">
            ChefOS для вашего бизнеса
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              ChefOS можно адаптировать под конкретный бизнес или кухню.
              Я лично разрабатываю и настраиваю платформу под реальные процессы: продукты, рецепты, закупки и себестоимость.
            </p>
            
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-4">
                Чем я могу помочь:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                  <span className="text-gray-700 dark:text-gray-300">настройка ChefOS под ваш формат кухни</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                  <span className="text-gray-700 dark:text-gray-300">адаптация логики под ваше меню и процессы</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                  <span className="text-gray-700 dark:text-gray-300">автоматизация работы с продуктами и рецептами</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                  <span className="text-gray-700 dark:text-gray-300">внедрение AI-подсказок для оптимизации кухни</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                  <span className="text-gray-700 dark:text-gray-300">консультации на основе реального шеф-опыта</span>
                </li>
              </ul>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 italic text-center">
              Прямое взаимодействие с автором продукта — без менеджеров, агентств и искажений требований.
            </p>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 text-center">
            Технологии
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frontend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Frontend</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Современный frontend с фокусом на UX и производительность
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Next.js 16</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>

            {/* Backend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Backend</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Высокопроизводительный backend с надёжным хранением данных
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Go</li>
                <li>• PostgreSQL</li>
              </ul>
            </div>

            {/* AI & Infrastructure */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-6 h-6 text-purple-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">AI & Infrastructure</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                AI-интеграция и современная облачная инфраструктура
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• OpenAI API</li>
                <li>• Vercel</li>
                <li>• Koyeb</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Готовы обсудить ваш проект?
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90">
            Если вы хотите внедрить ChefOS или создать решение под вашу кухню — свяжитесь со мной, и мы обсудим задачи и формат работы.
          </p>
          <div className="flex flex-col items-center gap-4">
            <a
              href="mailto:fodi85999@gmail.com?subject=ChefOS: Обсуждение проекта"
              className="inline-flex items-center gap-3 bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              Связаться / обсудить проект
              <ArrowRight className="w-6 h-6" />
            </a>
            <div className="flex items-center gap-4">
              <a
                href="mailto:fodi85999@gmail.com"
                className="text-base opacity-90 hover:opacity-100 transition-opacity"
              >
                fodi85999@gmail.com
              </a>
              <span className="text-white/50">•</span>
              <a
                href="https://www.instagram.com/fodifood?igsh=aXZqbjZmNWhsNzNn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base opacity-90 hover:opacity-100 transition-opacity"
              >
                <Instagram className="w-5 h-5" />
                @fodifood
              </a>
            </div>
          </div>
          <p className="text-sm mt-4 opacity-80">
            Бесплатное обсуждение, без обязательств
          </p>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2025-2026 ChefOS by Dima Fomin. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
