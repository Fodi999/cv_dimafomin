"use client";

import { motion } from "framer-motion";
import { GraduationCap, Trophy, Users, Gift, Calendar, BookOpen, CheckCircle, ArrowRight, Camera } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EarnTokensPage() {
  const { t } = useLanguage();
  const earnTokens = (t.academy as any)?.earnTokens;

  const earnMethods = [
    {
      icon: BookOpen,
      title: earnTokens?.completeLessons || "Завершуйте уроки",
      description: earnTokens?.completeLessonsDesc || "Отримуйте 10-50 CT за кожен завершений урок",
      reward: "10-50 CT",
      color: "from-blue-500 to-cyan-500",
      emoji: "📚",
    },
    {
      icon: GraduationCap,
      title: earnTokens?.completeCourses || "Завершуйте курси",
      description: earnTokens?.completeCoursesDesc || "Отримуйте 100+ CT за завершення повного курсу",
      reward: "100+ CT",
      color: "from-purple-500 to-pink-500",
      emoji: "🎓",
    },
    {
      icon: Camera,
      title: earnTokens?.sharePosts || "Діліться рецептами",
      description: earnTokens?.sharePostsDesc || "Публікуйте свої кулінарні творіння та заробляйте 20-100+ CT",
      reward: "20-100+ CT",
      color: "from-pink-500 to-rose-500",
      link: "/academy/community",
      emoji: "📸",
    },
    {
      icon: Trophy,
      title: earnTokens?.achievements || "Здобувайте досягнення",
      description: earnTokens?.achievementsDesc || "Виконуйте спеціальні завдання та отримуйте бонусні токени",
      reward: "25-100 CT",
      color: "from-amber-500 to-orange-500",
      emoji: "🏆",
    },
    {
      icon: Calendar,
      title: earnTokens?.dailyBonus || "Щоденний бонус",
      description: earnTokens?.dailyBonusDesc || "Заходьте щодня та отримуйте 10 CT безкоштовно",
      reward: "10 CT/день",
      color: "from-green-500 to-emerald-500",
      emoji: "📅",
    },
    {
      icon: Users,
      title: earnTokens?.referrals || "Запрошуйте друзів",
      description: earnTokens?.referralsDesc || "Отримуйте 50 CT за кожного запрошеного друга",
      reward: "50 CT/друг",
      color: "from-rose-500 to-red-500",
      emoji: "👥",
    },
    {
      icon: Gift,
      title: earnTokens?.specialOffers || "Спеціальні пропозиції",
      description: earnTokens?.specialOffersDesc || "Беріть участь в акціях та конкурсах",
      reward: "До 500 CT",
      color: "from-indigo-500 to-blue-500",
      emoji: "🎁",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#1E1A41] mb-4 flex items-center justify-center gap-3">
          <GraduationCap className="w-12 h-12 text-[#3BC864]" />
          {earnTokens?.title || "Як заробити ChefTokens безкоштовно?"}
        </h1>
        <p className="text-lg text-[#1E1A41]/70 max-w-3xl mx-auto">
          {earnTokens?.subtitle || "Навчайтеся, виконуйте завдання та заробляйте токени для доступу до преміум контенту"}
        </p>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-12 p-6 bg-gradient-to-r from-[#3BC864]/10 to-[#C5E98A]/10 border-2 border-[#3BC864]/30 rounded-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#3BC864] rounded-xl">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#1E1A41] mb-2">
              Бонус для нових студентів!
            </h3>
            <p className="text-[#1E1A41]/70">
              {earnTokens?.bonusDesc || "Зареєструйтеся зараз і отримайте 100 ChefTokens на старт вашої кулінарної подорожі!"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Earn Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {earnMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-[#3BC864] transition-all"
            >
              {method.link ? (
                <Link href={method.link} className="block">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${method.color} mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#1E1A41] mb-2">
                    {method.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {method.description}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Винагорода:</span>
                      <span className="text-lg font-bold text-[#3BC864]">{method.reward}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm text-[#3BC864] font-semibold flex items-center gap-1">
                    Перейти →
                  </div>
                </Link>
              ) : (
                <>
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${method.color} mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#1E1A41] mb-2">
                    {method.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {method.description}
                  </p>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Винагорода:</span>
                      <span className="text-lg font-bold text-[#3BC864]">{method.reward}</span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center bg-gradient-to-r from-[#3BC864] to-[#C5E98A] rounded-2xl p-8 text-white"
      >
        <h2 className="text-3xl font-bold mb-4">
          {earnTokens?.ctaTitle || "Готові почати заробляти?"}
        </h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          {earnTokens?.ctaDesc || "Розпочніть своє навчання прямо зараз і почніть заробляти ChefTokens!"}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/market">
            <Button
              size="lg"
              className="bg-white text-[#3BC864] hover:bg-gray-100 font-semibold"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              {earnTokens?.browseCourses || "Переглянути курси"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          
          <Link href="/create-chat">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10"
            >
              {earnTokens?.goToDashboard || "Перейти до Dashboard"}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
