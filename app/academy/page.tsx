"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Users, TrendingUp, Award, Zap, Target, GraduationCap, Trophy, Coins, Globe, BarChart3, Bot, ArrowRight, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AcademyPage() {
  const router = useRouter();

  const categories = [
    {
      icon: BookOpen,
      title: "Курсы",
      description: "От базовых техник до продвинутых рецептов.",
      link: "/academy/courses",
      color: "from-blue-500 to-cyan-500",
      count: "12+ программ обучения →",
    },
    {
      icon: Users,
      title: "Сообщество",
      description: "Обменивайтесь опытом, делитесь блюдами и вдохновляйтесь.",
      link: "/academy/community",
      color: "from-green-500 to-emerald-500",
      count: "2.3K участников →",
    },
    {
      icon: TrendingUp,
      title: "Рейтинг",
      description: "Растите в мастерстве, зарабатывайте ChefTokens и поднимайтесь в топ.",
      link: "/academy/leaderboard",
      color: "from-purple-500 to-pink-500",
      count: "Топ-100 учеников →",
    },
    {
      icon: Award,
      title: "Сертификация",
      description: "Получайте официальные сертификаты от Seafood Academy.",
      link: "/academy/certificates",
      color: "from-amber-500 to-orange-500",
      count: "Мои достижения →",
    },
    {
      icon: Zap,
      title: "Заработок токенов",
      description: "Выполняйте задания, проходите уроки — получайте ChefTokens.",
      link: "/academy/earn-tokens",
      color: "from-rose-500 to-red-500",
      count: "Ваш баланс →",
    },
    {
      icon: Target,
      title: "Глобальная стена",
      description: "Открывайте блюда и рецепты из разных стран.",
      link: "/academy/feed",
      color: "from-indigo-500 to-blue-500",
      count: "Мировое сообщество →",
    },
  ];

  const features = [
    { icon: GraduationCap, title: "Структурированные курсы", desc: "Материалы, уроки, практика и задания" },
    { icon: Bot, title: "AI-наставник Dima Fomin", desc: "Персональные подсказки и обучение в формате диалога" },
    { icon: Coins, title: "ChefTokens", desc: "Валюта обучения: получайте, тратьте, открывайте премиум-контент" },
    { icon: Globe, title: "Глобальное сообщество", desc: "Ученики из разных стран и уровней подготовки" },
    { icon: BarChart3, title: "Прогресс и статистика", desc: "Аналитика, достижения и путь роста" },
    { icon: Trophy, title: "Подход от шефа", desc: "Все знания основаны на опыте Dima Fomin в сфере морепродуктов" },
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950 dark:from-gray-950 dark:via-sky-950 dark:to-cyan-950 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full pt-32 pb-40"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/20 border border-sky-400/50 mb-8 dark:bg-sky-500/20 dark:border-sky-600/50"
          >
            <span className="text-sm font-semibold text-white leading-relaxed">
              Добро пожаловать в Seafood Academy
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-10 leading-tight text-white">
            Учись. Готовь. Расти вместе с AI.
          </h1>

          {/* Emotional subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 font-medium mb-6 max-w-3xl mx-auto leading-relaxed"
          >
            Учебная платформа по морепродуктам от шефа Dima Fomin
          </motion.p>

          {/* AI value proposition */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-lg text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Персональный AI-наставник, структурированные курсы и сообщество профессионалов. От основ до уровня ресторана.
          </motion.p>

          {/* ChefTokens value highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-2xl md:text-2xl font-semibold text-sky-300 mb-16 max-w-3xl mx-auto leading-relaxed"
          >
            Получайте ChefTokens за каждый урок и зарабатывайте на своём обучении
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/academy/courses" className="group">
              <Button className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-3 text-base rounded-lg border-2 border-white hover:border-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 w-full sm:w-auto">
                Начать обучение
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
              </Button>
            </Link>
            <Link href="/chat/create-chat" className="group">
              <Button className="bg-black text-white hover:bg-gray-900 border-2 border-white font-medium px-8 py-3 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 w-full sm:w-auto">
                Перейти в AI-наставник
                <Waves className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-20"
          >
            {[
              { number: "50+", label: "Рецептов" },
              { number: "1000+", label: "Учеников" },
              { number: "24/7", label: "AI-помощь" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-sky-300/40 shadow-md hover:shadow-lg hover:border-sky-300/60 transition-all duration-200"
              >
                <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300 mb-2">
                  {stat.number}
                </p>
                <p className="text-base md:text-lg text-gray-400 tracking-wide font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full py-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16 text-center">
            Что вы хотите изучать?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Link href={cat.link}>
                  <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl hover:bg-gray-800/80 transition-all cursor-pointer p-8 h-full group border border-sky-500/40 hover:border-sky-500/60">
                    <div className="flex flex-col h-full">
                      {/* Top section with icon and arrow */}
                      <div className="flex items-start justify-between mb-6">
                        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${cat.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-gray-400 group-hover:text-sky-300 transition-colors text-xl">
                          →
                        </span>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-6 leading-relaxed flex-grow">
                        {cat.description}
                      </p>

                      {/* Footer */}
                      <div className="pt-6 border-t border-sky-500/30">
                        <span className="text-xs font-semibold text-sky-300">
                          {cat.count}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full py-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16 text-center">
            Почему выбирают Seafood Academy
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:bg-gray-800/80 transition-all border border-sky-500/40 hover:border-sky-500/60"
                >
                  <div className="flex flex-col h-full">
                    <Icon className="w-8 h-8 text-sky-400 mb-4" />
                    <h3 className="text-lg md:text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-sm text-gray-300 leading-relaxed flex-grow">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full py-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-sky-600/80 via-cyan-600/80 to-sky-500/80 backdrop-blur-sm rounded-2xl p-12 md:p-20 text-white text-center shadow-2xl border border-sky-500/50">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
              Готовы начать своё обучение?
            </h2>
            <p className="text-base md:text-lg text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Присоединяйтесь к тем, кто уже прокачивает навыки в Seafood Academy
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/academy/courses" className="group">
                <Button className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-3 text-base rounded-lg border-2 border-white hover:border-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 w-full sm:w-auto">
                  Смотреть курсы
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
                </Button>
              </Link>
              <Link href="/academy/earn-tokens" className="group">
                <Button className="bg-black text-white hover:bg-gray-900 border-2 border-white font-medium px-8 py-3 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 w-full sm:w-auto">
                  Зарабатывать ChefTokens
                  <Coins className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
