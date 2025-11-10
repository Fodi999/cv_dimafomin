"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Users, TrendingUp, Award, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AcademyPage() {
  const router = useRouter();

  const categories = [
    {
      icon: BookOpen,
      title: "Курси",
      description: "Навчайтеся від основ до просунутих прийомів",
      link: "/academy/courses",
      color: "from-blue-500 to-cyan-500",
      count: "12+ курсів",
    },
    {
      icon: Users,
      title: "Спільнота",
      description: "Діліться рецептами та натхненням з друзями",
      link: "/academy/community",
      color: "from-green-500 to-emerald-500",
      count: "2.3K учасників",
    },
    {
      icon: TrendingUp,
      title: "Рейтинг",
      description: "Змагайтеся та набирайте досвід",
      link: "/academy/leaderboard",
      color: "from-purple-500 to-pink-500",
      count: "Top 100 список",
    },
    {
      icon: Award,
      title: "Сертифікати",
      description: "Підтвердіть свої навички офіційно",
      link: "/academy/certificates",
      color: "from-amber-500 to-orange-500",
      count: "Мої сертифікати",
    },
    {
      icon: Zap,
      title: "Заробити токени",
      description: "Виконуйте завдання та заробляйте",
      link: "/academy/earn-tokens",
      color: "from-rose-500 to-red-500",
      count: "ChefTokens",
    },
    {
      icon: Target,
      title: "Глобальна стіна",
      description: "Відкривайте рецепти зі всього світу",
      link: "/academy/feed",
      color: "from-indigo-500 to-blue-500",
      count: "Світова спільнота",
    },
  ];

  const features = [
    { emoji: "🎓", title: "Структуровані курси", desc: "З уроками, тестами та проектами" },
    { emoji: "🏆", title: "Програма дипломування", desc: "Отримайте офіційний сертифікат" },
    { emoji: "💰", title: "Заробіток токенів", desc: "Закуповуйте преміум контент" },
    { emoji: "🌍", title: "Глобальна спільнота", desc: "Мільйони учасників світу" },
    { emoji: "📊", title: "Слідкуйте прогресом", desc: "Детальна статистика та аналітика" },
    { emoji: "🤖", title: "AI асистент", desc: "Персональний тренер для вас" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4 pt-12 mb-16"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Академія суші
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Шиф-школа для всіх рівнів. Навчайтеся, мистецтво готування суші, подорожуйте по світовій кухні та станьте експертом.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/academy/courses">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
                Почати навчання
              </Button>
            </Link>
            <Link href="/academy/feed">
              <Button size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold">
                Переглянути рецепти
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12">
          {[
            { label: "Користувачів", value: "50K+" },
            { label: "Курсів", value: "120+" },
            { label: "Рецептів", value: "2.5K+" },
            { label: "Дипломів", value: "15K+" },
            { label: "Токенів", value: "1M+" },
            { label: "Країн", value: "180+" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-2xl font-bold text-purple-600">{stat.value}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Categories Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto px-4 mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Що вас цікавить?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer p-6 h-full group">
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${cat.color} mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {cat.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs font-semibold text-purple-600">
                        {cat.count}
                      </span>
                      <span className="text-gray-400 group-hover:text-purple-600 transition-colors">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-6xl mx-auto px-4 mb-16"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Чому вибирати Академію?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="text-3xl mb-3">{feature.emoji}</div>
              <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Готові почати свою подорож?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Приєднайтесь до тисяч учасників, які вже вивчають мистецтво готування суші
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/academy/courses">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                Переглянути курси
              </Button>
            </Link>
            <Link href="/academy/earn-tokens">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-semibold">
                Заробити токени
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
