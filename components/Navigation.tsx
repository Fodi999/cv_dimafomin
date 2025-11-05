"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Search, Home, Briefcase, Award, Mail, User, Bell, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import AuthModal from "@/components/auth/AuthModal";
import Image from "next/image";

export default function Navigation() {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // Check if we're on academy pages (profile, dashboard, etc.)
  const isAcademyPage = pathname?.startsWith('/academy');
  
  const handleLogin = () => {
    setShowAuthModal(true);
  };
  
  const goToDashboard = () => {
    router.push("/academy/dashboard");
  };
  
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-md' 
            : 'bg-white/80 backdrop-blur-md'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-[1640px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo + Navigation Links */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <motion.button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#3BC864] to-[#C5E98A] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <span className="text-xl font-bold text-[#1E1A41] hidden sm:block">
                  Dima Fomin
                </span>
              </motion.button>

              {/* Navigation Icons (Desktop) - Hide on Academy pages */}
              {!isAcademyPage && (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 font-semibold text-[#1E1A41]"
                  >
                    <Home className="w-5 h-5" />
                    <span>{t.nav.home}</span>
                  </button>
                  <button
                    onClick={() => scrollToSection("portfolio")}
                    className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 text-[#1E1A41]"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span className="hidden lg:inline">{t.nav.portfolio}</span>
                  </button>
                  <button
                    onClick={() => scrollToSection("skills")}
                    className="px-4 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 text-[#1E1A41]"
                  >
                    <Award className="w-5 h-5" />
                    <span className="hidden lg:inline">{t.nav.skills}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Center: Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className={`flex-1 relative transition-all duration-200 ${
                searchFocused ? 'scale-105' : ''
              }`}>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.nav.search || "Пошук проєктів, навичок..."}
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 hover:bg-gray-200 focus:bg-white focus:shadow-lg transition-all outline-none text-[#1E1A41] placeholder-gray-500"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>

            {/* Right: Icons + Profile */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              {/* Notifications (only when authenticated) */}
              {isAuthenticated && (
                <>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                    <Bell className="w-6 h-6 text-gray-700" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
                    <MessageCircle className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}

              {/* User Profile or Login */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToDashboard}
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-2 pr-4 transition-colors"
                  >
                    {user?.avatar && (user.avatar.startsWith("http") || user.avatar.startsWith("blob:") || user.avatar.startsWith("data:")) ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-[#1E1A41]">
                      {user?.name.split(" ")[0]}
                    </span>
                  </button>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  size="sm"
                  className="rounded-full bg-[#3BC864] hover:bg-[#2da552] text-white px-6 hidden md:block"
                >
                  {t.nav.login || "Вхід"}
                </Button>
              )}

              {/* Mobile Menu */}
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.nav.search || "Пошук..."}
                className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 hover:bg-gray-200 focus:bg-white focus:shadow-lg transition-all outline-none text-[#1E1A41]"
              />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Spacer */}
      <div className="h-20 lg:h-20" />
      
      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
