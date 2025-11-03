"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Download, TrendingUp, Award, Clock, User as UserIcon, Mail, MapPin, Edit } from "lucide-react";
import Image from "next/image";
import DashboardCard from "@/components/academy/DashboardCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { academyApi } from "@/lib/api";

interface DashboardData {
  stats: {
    completedCourses: number;
    certificates: number;
    ranking: number;
    totalHours: number;
    walletBalance: number;
    currentLevel: number;
    xp: number;
    xpToNextLevel: number;
  };
  activeCourses: Array<{
    id: string;
    title: string;
    progress: number;
  }>;
  certificates: Array<{
    id: string;
    courseName: string;
    pdfUrl: string;
    issuedDate: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    level: string;
    rating: number;
  }>;
}

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
        
        // Try to load from real API
        try {
          const token = localStorage.getItem("authToken");
          if (!token) throw new Error("No auth token");
          
          // Use user ID from context
          if (!user?.id) throw new Error("No user ID");
          
          const data = await academyApi.getDashboard(user.id, token);
          setDashboardData(data as DashboardData);
          console.info("✅ Dashboard data loaded from API");
          return;
        } catch (apiError: any) {
          // API not available - this is expected during development
          if (process.env.NODE_ENV === 'development' && apiError?.status === 404) {
            console.info("ℹ️ Backend API not connected, using mock data");
          } else if (apiError?.message !== "No auth token") {
            console.warn("API error:", apiError);
          }
        }
        
        // Fallback to mock data if API fails
        setDashboardData({
          stats: {
            completedCourses: 5,
            certificates: 3,
            ranking: 12,
            totalHours: 48,
            walletBalance: 250,
            currentLevel: 5,
            xp: 2400,
            xpToNextLevel: 3000,
          },
          activeCourses: [
            { id: "1", title: "Майстер суші: професійний рівень", progress: 65 },
            { id: "2", title: "Японська кухня для початківців", progress: 30 },
          ],
          certificates: [
            {
              id: "1",
              courseName: "Основи суші",
              pdfUrl: "/certificates/sushi-basics.pdf",
              issuedDate: "2025-10-15",
            },
            {
              id: "2",
              courseName: "Сашимі техніка",
              pdfUrl: "/certificates/sashimi.pdf",
              issuedDate: "2025-09-20",
            },
          ],
          recommendations: [
            {
              id: "sushi-basics-2024",
              title: "Podstawy Sushi – Kurs dla Początkujących",
              level: "Початковий",
              rating: 5,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching dashboard:", error);
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

  if (!dashboardData || !dashboardData.stats) return null;

  const stats = [
    {
      title: t.academy?.dashboard?.completedCourses || "Пройдено курсів",
      value: dashboardData.stats.completedCourses?.toString() || "0",
      icon: "📚",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: t.academy?.dashboard?.certificates || "Сертифікати",
      value: dashboardData.stats.certificates?.toString() || "0",
      icon: "📜",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: t.academy?.dashboard?.rating || "Рейтинг",
      value: `#${dashboardData.stats.ranking || 0}`,
      icon: "🏆",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: t.academy?.dashboard?.totalHours || "Годин навчання",
      value: dashboardData.stats.totalHours?.toString() || "0",
      icon: "⏱️",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1E1A41] mb-4">
          {t.academy?.dashboard?.title || "👨‍🍳 Особистий кабінет"}
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
              {t.academy?.dashboard?.level || "Рівень"} {dashboardData.stats?.currentLevel || 1}
            </h3>
            <p className="text-white/80">
              {dashboardData.stats?.xp || 0} / {dashboardData.stats?.xpToNextLevel || 100} {t.academy?.dashboard?.xp || "XP"}
            </p>
          </div>
          <TrendingUp className="w-12 h-12 opacity-80" />
        </div>
        <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{
              width: `${((dashboardData.stats?.xp || 0) / (dashboardData.stats?.xpToNextLevel || 100)) * 100}%`,
            }}
          />
        </div>
        <p className="text-xs text-white/70 mt-2">
          {(dashboardData.stats?.xpToNextLevel || 100) - (dashboardData.stats?.xp || 0)} {t.academy?.dashboard?.xp || "XP"} {t.academy?.dashboard?.xpToNext || "до наступного рівня"}
        </p>
      </div>

      {/* Stats Grid with ChefTokens */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {/* ChefTokens Balance */}
        <div className="p-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg text-white text-center">
          <p className="text-3xl font-bold mb-1">🪙 {dashboardData.stats?.walletBalance || 0}</p>
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
        {dashboardData.activeCourses && dashboardData.activeCourses.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.activeCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 bg-[#FEF9F5] rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1E1A41] mb-1">{course.title}</h3>
                  <p className="text-sm text-[#1E1A41]/60">
                    {t.academy?.dashboard?.progress || "Прогрес"}: {course.progress}%
                  </p>
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden ml-4">
                  <div
                    className="h-full bg-gradient-to-r from-[#3BC864] to-[#C5E98A] transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
            <div className="mb-4 text-6xl">📚</div>
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
              🛒 {t.academy?.dashboard?.enrollInCourse || "Zapisz się na kurs"}
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

      {/* AI Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#1E1A41] mb-3 flex items-center gap-2">
          🤖 {t.academy?.dashboard?.aiRecommendations || "Рекомендації від Culinary AI"}
        </h2>
        <p className="text-gray-600 mb-6">
          {t.academy?.dashboard?.aiSubtitle || "На основі ваших результатів система пропонує наступний курс"}
        </p>
        {dashboardData.recommendations?.map((rec, index) => (
          <div
            key={rec.id || `rec-${index}`}
            className="p-6 bg-gradient-to-r from-pink-100 to-orange-50 rounded-xl border-2 border-orange-200"
          >
            <p className="font-bold text-lg text-[#1E1A41] mb-2">🍣 {rec.title}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{rec.level}</span>
              <span>
                {Array.from({ length: rec.rating }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </span>
            </div>
            <Link
              href={`/market/${rec.id}`}
              className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-[#3BC864] to-[#C5E98A] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {t.academy?.dashboard?.viewCourse || "Переглянути курс"}
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/academy/leaderboard"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          🏆 {t.academy?.dashboard?.viewRanking || "Переглянути рейтинг"}
        </Link>
        <Link
          href="/market"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          🛒 {t.academy?.dashboard?.goToMarketplace || "Перейти до Marketplace"}
        </Link>
        <Link
          href="/academy/certificates"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
        >
          📜 {t.academy?.dashboard?.allCertificates || "Всі сертифікати"}
        </Link>
      </div>
    </div>
  );
}
