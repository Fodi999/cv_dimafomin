"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader, AlertCircle } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsGrid } from "@/components/profile/StatsCard";
import { WalletSummary } from "@/components/profile/WalletSummary";
import { userApi } from "@/lib/api";
import { ProfileData } from "@/lib/types";

interface UserProfile extends ProfileData {
  maxXp?: number;
  coursesCount?: number;
  followers?: number;
  following?: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const hasRedirectedRef = useRef(false); // ✅ useRef вместо state чтобы не вызывать re-render
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development (when backend API returns 404)
  const mockProfile: UserProfile = {
    name: "Демо Пользователь",
    email: "demo@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
    bio: "Профессиональный шеф-повар 👨‍🍳",
    location: "Москва, Россия 🇷🇺",
    level: 5,
    xp: 2450,
    maxXp: 5000,
    chefTokens: 1500,
    coursesCount: 3,
    followers: 42,
    following: 28,
  };

  const mockWallet = {
    balance: 1500,
    currency: "tokens",
    totalEarned: 8500,
    totalSpent: 5000,
    earnings: {
      coursesCompleted: 2500,
      quizzesCompleted: 1500,
      bonuses: 2500,
      referrals: 1000,
    },
    spending: {
      courseEnrollments: 3000,
      premiumFeatures: 1500,
      rewards: 500,
    },
    transactionCount: 12,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          // ⏱️ Only redirect once to prevent infinite loops
          if (!hasRedirectedRef.current) {
            console.log("[ProfileDashboard] Токен не найден, редирект на /login");
            hasRedirectedRef.current = true; // ✅ Просто устанавливаем флаг, без re-render
            router.replace("/login");
          }
          return;
        }

        console.log("[ProfileDashboard] Загрузка данных с token:", token.substring(0, 20) + "...");

        // Параллельная загрузка профиля и кошелька (оба endpoint работают ✅)
        const [profileResult, walletResult] = await Promise.all([
          fetch("https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/user/profile", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then(res => res.json())
            .catch(err => {
              console.warn("[ProfileDashboard] Ошибка загрузки профиля:", err.message);
              return null;
            }),
          fetch("https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/user/wallet", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then(res => res.json())
            .catch(err => {
              console.warn("[ProfileDashboard] Ошибка загрузки кошелька:", err.message);
              return null;
            }),
        ]);

        const profileData = profileResult?.data;
        const walletData = walletResult?.data;

        if (profileData) {
          console.log("[ProfileDashboard] Профиль загружен:", profileData);
          
          const finalProfile: UserProfile = {
            name: profileData.name || mockProfile.name,
            email: profileData.email || mockProfile.email,
            avatarUrl: profileData.avatarUrl || mockProfile.avatarUrl,
            bio: mockProfile.bio,
            location: mockProfile.location,
            level: profileData.level || mockProfile.level,
            xp: profileData.xp || mockProfile.xp,
            maxXp: 5000,
            chefTokens: profileData.walletBalance || walletData?.balance || 0,
            coursesCount: profileData.completedCourses || 0,
            followers: mockProfile.followers,
            following: mockProfile.following,
          };
          
          setProfile(finalProfile);
        } else {
          console.log("[ProfileDashboard] Профиль не загружен, используем mock");
          setProfile(mockProfile);
        }

        if (walletData) {
          console.log("[ProfileDashboard] Кошелек загружен:", walletData);
          
          const finalWallet = {
            balance: walletData.balance || 0,
            currency: walletData.currency || "tokens",
            totalEarned: walletData.totalEarned || 0,
            totalSpent: walletData.totalSpent || 0,
            earnings: walletData.earnings || mockWallet.earnings,
            spending: walletData.spending || mockWallet.spending,
            transactionCount: walletData.transactionCount || 0,
          };
          
          setWallet(finalWallet);
        } else {
          console.log("[ProfileDashboard] Кошелек не загружен, используем mock");
          setWallet(mockWallet);
        }

        setLoading(false);
      } catch (err: any) {
        console.error("[ProfileDashboard] Неожиданная ошибка:", err);
        setError(err.message || "Ошибка при загрузке профиля");
        setProfile(mockProfile);
        setWallet(mockWallet);
        setLoading(false);
      }
    };

    loadData();
  }, []); // ✅ Пустой array - эффект вызывается только один раз на монтировании

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-sky-600 dark:text-sky-400"
        >
          <Loader className="w-12 h-12" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-md text-center"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Ошибка
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors"
          >
            Вернуться на вход
          </button>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">
          Профиль не найден
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-12">
          <ProfileHeader
            name={profile.name || "Пользователь"}
            email={profile.email || ""}
            avatar={profile.avatarUrl}
            bio={profile.bio}
            location={profile.location}
            followers={profile.followers}
            following={profile.following}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Stats & Courses */}
          <div className="lg:col-span-2 space-y-6">
            <StatsGrid
              level={profile.level}
              xp={profile.xp}
              maxXp={profile.maxXp}
              balance={profile.chefTokens}
              coursesCount={profile.coursesCount}
            />

            {/* Courses Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">
                📚 Мои курсы
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                Вы записаны на {profile.coursesCount} курс(а)
              </p>
            </motion.div>
          </div>

          {/* Wallet */}
          <div className="lg:col-span-1">
            <WalletSummary
              balance={profile.chefTokens}
              earned={15000}
              spent={10000}
              pending={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
