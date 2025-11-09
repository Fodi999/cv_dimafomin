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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if we're on academy pages (profile, dashboard, etc.)
  const isAcademyPage = pathname?.startsWith('/academy');
  
  const handleLogin = () => {
    setShowAuthModal(true);
  };
  
  const handleDashboardClick = () => {
    router.push("/create-chat");
  };  const handleLogout = () => {
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
        <div className="max-w-[1640px] mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Logo + Navigation Links */}
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Logo */}
              <motion.button
                onClick={() => router.push('/')}
                className="flex items-center gap-1.5 sm:gap-2 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#3BC864] to-[#C5E98A] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg sm:text-xl">D</span>
                </div>
                <span className="text-lg sm:text-xl font-bold text-[#1E1A41] hidden sm:block">
                  Dima Fomin
                </span>
              </motion.button>

              {/* Navigation Icons (Desktop) - Hide on Academy pages */}
              {!isAcademyPage && (
                <div className="hidden md:flex items-center gap-1 lg:gap-2">
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="px-3 lg:px-4 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 font-semibold text-[#1E1A41]"
                  >
                    <Home className="w-4 lg:w-5 h-4 lg:h-5" />
                    <span className="text-sm lg:text-base">{t.nav.home}</span>
                  </button>
                  <button
                    onClick={() => scrollToSection("portfolio")}
                    className="px-3 lg:px-4 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 text-[#1E1A41]"
                  >
                    <Briefcase className="w-4 lg:w-5 h-4 lg:h-5" />
                    <span className="hidden lg:inline text-sm lg:text-base">{t.nav.portfolio}</span>
                  </button>
                  <button
                    onClick={() => scrollToSection("skills")}
                    className="px-3 lg:px-4 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 text-[#1E1A41]"
                  >
                    <Award className="w-4 lg:w-5 h-4 lg:h-5" />
                    <span className="hidden lg:inline text-sm lg:text-base">{t.nav.skills}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Center: Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-6 xl:mx-8">
              <div className={`flex-1 relative transition-all duration-200 ${
                searchFocused ? 'scale-105' : ''
              }`}>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 lg:w-5 h-4 lg:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t.nav.search || "Пошук проєктів, навичок..."}
                  className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 rounded-full bg-gray-100 hover:bg-gray-200 focus:bg-white focus:shadow-lg transition-all outline-none text-[#1E1A41] placeholder-gray-500 text-sm lg:text-base"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>

            {/* Right: Icons + Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switcher - visible on all screens */}
              <div className="scale-90 sm:scale-100">
                <LanguageSwitcher />
              </div>

              {/* Notifications (only when authenticated) - show on mobile too but smaller */}
              {isAuthenticated && (
                <>
                  <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </button>
                  <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                  </button>
                </>
              )}

              {/* User Profile or Login */}
              {isAuthenticated ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={handleDashboardClick}
                    className="flex items-center gap-1.5 sm:gap-2 hover:bg-gray-100 rounded-full p-1.5 sm:p-2 sm:pr-4 transition-colors"
                  >
                    {user?.avatar && (user.avatar.startsWith("http") || user.avatar.startsWith("blob:") || user.avatar.startsWith("data:")) ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {user?.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-[#1E1A41]">
                      {user?.name.split(" ")[0]}
                    </span>
                  </button>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  size="sm"
                  className="rounded-full bg-[#3BC864] hover:bg-[#2da552] text-white px-4 sm:px-6 py-2 text-sm"
                >
                  {t.nav.login || "Вхід"}
                </Button>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors ml-1"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-3 sm:pb-4">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.nav.search || "Пошук..."}
                className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-full bg-gray-100 hover:bg-gray-200 focus:bg-white focus:shadow-lg transition-all outline-none text-[#1E1A41] text-sm"
              />
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                {/* Navigation Links - Only on home page */}
                {!isAcademyPage && (
                  <>
                    <button
                      onClick={() => {
                        scrollToSection("hero");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <Home className="w-5 h-5 text-[#3BC864]" />
                      <span className="font-medium text-[#1E1A41]">{t.nav.home}</span>
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection("portfolio");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <Briefcase className="w-5 h-5 text-[#3BC864]" />
                      <span className="font-medium text-[#1E1A41]">{t.nav.portfolio}</span>
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection("skills");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <Award className="w-5 h-5 text-[#3BC864]" />
                      <span className="font-medium text-[#1E1A41]">{t.nav.skills}</span>
                    </button>
                    <button
                      onClick={() => {
                        scrollToSection("contact");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <Mail className="w-5 h-5 text-[#3BC864]" />
                      <span className="font-medium text-[#1E1A41]">{t.nav.contact || "Контакти"}</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                  </>
                )}

                {/* User Actions */}
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        router.push("/create-chat");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <User className="w-5 h-5 text-[#3BC864]" />
                      <span className="font-medium text-[#1E1A41]">Профіль</span>
                    </button>
                    <button
                      onClick={() => {
                        router.push("/create-chat");
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <Award className="w-5 h-5 text-[#3BC864]" />
                      <span className="font-medium text-[#1E1A41]">Dashboard</span>
                    </button>
                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        router.push("/");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-left"
                    >
                      <X className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-600">Вийти</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#3BC864] hover:bg-[#2da552] transition-colors text-left"
                  >
                    <User className="w-5 h-5 text-white" />
                    <span className="font-medium text-white">{t.nav.login || "Вхід"}</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Spacer - Dynamic height based on menu state */}
      <div className={`transition-all duration-300 ${
        isMobileMenuOpen 
          ? 'h-32 sm:h-36 lg:h-20' 
          : 'h-32 sm:h-36 lg:h-20'
      }`} />
      
      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
