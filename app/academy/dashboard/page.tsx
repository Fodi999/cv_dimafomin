"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardCard from "@/components/academy/DashboardCard";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();

  // Здесь будет проверка авторизации
  useEffect(() => {
    // TODO: Проверка токена авторизации
    // const token = localStorage.getItem('authToken');
    // if (!token) router.push('/');
  }, [router]);

  const stats = [
    {
      title: t.academy?.dashboard?.completedCourses || "Пройдено курсів",
      value: "5",
      icon: "📚",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: t.academy?.dashboard?.certificates || "Сертифікати",
      value: "3",
      icon: "📜",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: t.academy?.dashboard?.rating || "Рейтинг",
      value: "#12",
      icon: "🏆",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: t.academy?.dashboard?.totalHours || "Годин навчання",
      value: "48",
      icon: "⏱️",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1E1A41] mb-4">
          {t.academy?.dashboard?.title || "👨‍🍳 Особистий кабінет"}
        </h1>
        <p className="text-lg text-[#1E1A41]/70">
          {t.academy?.dashboard?.subtitle || "Ваш прогрес та досягнення"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* Active Courses */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#1E1A41] mb-6">
          {t.academy?.dashboard?.activeCourses || "Активні курси"}
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#FEF9F5] rounded-xl">
            <div>
              <h3 className="font-semibold text-[#1E1A41]">
                Майстер суші: професійний рівень
              </h3>
              <p className="text-sm text-[#1E1A41]/60">Прогрес: 65%</p>
            </div>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#3BC864] to-[#C5E98A] w-[65%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
