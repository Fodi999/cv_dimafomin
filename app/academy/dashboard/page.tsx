"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download, TrendingUp, Award, Clock, User as UserIcon, Mail, MapPin, Edit, BookOpen, FileText, Trophy, Timer, Coins, Bot, ShoppingCart, ChefHat } from "lucide-react";
import Image from "next/image";
import DashboardCard from "@/components/academy/DashboardCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { academyApi } from "@/lib/api";
import type { DashboardData } from "@/lib/types";

export default function DashboardPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка авторизации и загрузка данных
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    // Загрузка данных с backend
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/");
          return;
        }
        
        if (!user?.id) {
          console.error("No user ID");
          return;
        }
        
        const data = await academyApi.getDashboard(user.id, token);
        setDashboardData(data);
        console.info("✅ Dashboard data loaded from API");
      } catch (error: any) {
        console.error("Error loading dashboard:", error);
        // Redirect to home if unauthorized
        if (error?.status === 401) {
          router.push("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, router, user]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#3BC864] mx-auto mb-4"></div>
          <p className="text-[#1E1A41]/70">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.profile) return null;

  // Extract data from dashboard
  const profile = dashboardData.profile;
  const courses = dashboardData.courses || [];
  const certificates = dashboardData.certificates || [];
  const achievements = dashboardData.achievements || [];
  const wallet = dashboardData.wallet;
  const ranking = dashboardData.ranking;

  const stats = [
    {
      title: t.academy?.dashboard?.completedCourses || "Пройдено курсів",
      value: courses.filter((c: any) => c.progress === 100).length.toString(),
      icon: "📚",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: t.academy?.dashboard?.certificates || "Сертифікати",
      value: certificates.length.toString(),
      icon: "📜",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: t.academy?.dashboard?.rating || "Рейтинг",
      value: ranking ? `#${ranking.globalRank}` : "#0",
      icon: "🏆",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: t.academy?.dashboard?.totalHours || "Годин навчання",
      value: Math.floor(courses.reduce((acc: number, c: any) => acc + (c.duration || 0), 0) / 60).toString(),
      icon: "⏱️",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1E1A41] mb-4 flex items-center gap-3">
          <ChefHat className="w-12 h-12 text-[#3BC864]" />
          {t.academy?.dashboard?.title || "Особистий кабінет"}
        </h1>
        <p className="text-lg text-[#1E1A41]/70">
          {t.academy?.dashboard?.subtitle || "Ваш прогрес та досягнення"}
        </p>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-[#3BC864]/20">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              {user?.avatar && (user.avatar.startsWith("http") || user.avatar.startsWith("blob:") || user.avatar.startsWith("data:")) ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                  {user?.name.split(" ")[1]?.charAt(0).toUpperCase() || ""}
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#1E1A41] mb-2 flex items-center gap-2">
                  <UserIcon className="w-6 h-6 text-[#3BC864]" />
                  {user?.name}
                </h2>
                
                <div className="space-y-1 text-[#1E1A41]/70">
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#3BC864]" />
                    {user?.email}
                  </p>
                  
                  {user?.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#3BC864]" />
                      {user.location}
                    </p>
                  )}
                </div>

                {user?.bio && (
                  <p className="mt-2 text-sm text-[#1E1A41]/60 max-w-md">
                    {user.bio}
                  </p>
                )}
              </div>

              {/* Edit Profile Button */}
              <Link
                href="/academy/profile"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3BC864] to-[#C5E98A] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium whitespace-nowrap h-fit"
              >
                <Edit className="w-4 h-4" />
                {t.academy?.profile?.edit || "Редагувати профіль"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-gradient-to-r from-[#3BC864] to-[#C5E98A] rounded-2xl shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">
              {t.academy?.dashboard?.level || "Рівень"} {profile?.level || 1}
            </h3>
            <p className="text-white/80">
              {profile?.xp || 0} / {(profile?.level || 1) * 1000} {t.academy?.dashboard?.xp || "XP"}
            </p>
          </div>
          <TrendingUp className="w-12 h-12 opacity-80" />
        </div>
        <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{
              width: `${((profile?.xp || 0) / ((profile?.level || 1) * 1000)) * 100}%`,
            }}
          />
        </div>
        <p className="text-xs text-white/70 mt-2">
          {((profile?.level || 1) * 1000) - (profile?.xp || 0)} {t.academy?.dashboard?.xp || "XP"} {t.academy?.dashboard?.xpToNext || "до наступного рівня"}
        </p>
      </div>

      {/* Stats Grid with ChefTokens */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {/* ChefTokens Balance */}
        <div className="p-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg text-white text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Coins className="w-8 h-8" />
            <p className="text-3xl font-bold">{wallet?.chefTokens || profile?.chefTokens || 0}</p>
          </div>
          <p className="text-sm opacity-90">{t.academy?.dashboard?.chefTokens || "ChefTokens"}</p>
        </div>

        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* Active Courses */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#1E1A41] mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-[#3BC864]" />
          {t.academy?.dashboard?.activeCourses || "Активні курси"}
        </h2>
        {courses && courses.length > 0 ? (
          <div className="space-y-4">
            {courses.map((course: any) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 bg-[#FEF9F5] rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1E1A41] mb-1">{course.title}</h3>
                  <p className="text-sm text-[#1E1A41]/60">
                    {t.academy?.dashboard?.progress || "Прогрес"}: {course.progress || 0}%
                  </p>
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden ml-4">
                  <div
                    className="h-full bg-gradient-to-r from-[#3BC864] to-[#C5E98A] transition-all duration-500"
                    style={{ width: `${course.progress || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
            <div className="mb-4 flex justify-center">
              <BookOpen className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-[#1E1A41] mb-2">
              {t.academy?.dashboard?.noActiveCourses || "Brak aktywnych kursów"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t.academy?.dashboard?.startLearning || "Rozpocznij swoją kulinarną podróż! Zapisz się na kurs i zacznij naukę."}
            </p>
            <Link
              href="/market"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3BC864] to-[#C5E98A] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
            >
              <ShoppingCart className="w-5 h-5" />
              {t.academy?.dashboard?.enrollInCourse || "Zapisz się na kurs"}
            </Link>
          </div>
        )}
      </div>

      {/* Certificates with PDF Download */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#1E1A41] mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-600" />
          {t.academy?.dashboard?.myCertificates || "Мої сертифікати"}
        </h2>
        <div className="space-y-3">
          {dashboardData.certificates?.map((cert) => (
            <div
              key={cert.id}
              className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-[#3BC864] transition-colors"
            >
              <div>
                <p className="font-semibold text-[#1E1A41]">{cert.courseName}</p>
                <p className="text-sm text-gray-500">
                  {t.academy?.dashboard?.issued || "Виданий"}: {cert.issuedDate}
                </p>
              </div>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}${cert.pdfUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#3BC864] text-white rounded-lg hover:bg-[#2fa352] transition-colors"
              >
                <Download className="w-4 h-4" />
                {t.academy?.dashboard?.downloadPdf || "Завантажити PDF"}
              </a>
            </div>
          )) || (
            <p className="text-center text-gray-500">Сертифікатів ще немає</p>
          )}
        </div>
      </div>



      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/academy/leaderboard"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          <Trophy className="w-5 h-5" />
          {t.academy?.dashboard?.viewRanking || "Переглянути рейтинг"}
        </Link>
        <Link
          href="/market"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          <ShoppingCart className="w-5 h-5" />
          {t.academy?.dashboard?.goToMarketplace || "Перейти до Marketplace"}
        </Link>
        <Link
          href="/academy/certificates"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          <FileText className="w-5 h-5" />
          {t.academy?.dashboard?.allCertificates || "Всі сертифікати"}
        </Link>
      </div>
    </div>
  );
}
