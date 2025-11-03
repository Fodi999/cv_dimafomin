"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { LogIn, LogOut, User } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

export default function Navigation() {
  const { t } = useLanguage();
  const { user, isAuthenticated, login, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Check if we're on the home page
  const isHomePage = pathname === '/';
  
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
  
  const navLinks = [
    { id: "hero", label: t.nav.home },
    { id: "about", label: t.nav.about },
    { id: "portfolio", label: t.nav.portfolio },
    { id: "skills", label: t.nav.skills },
    { id: "experience", label: t.nav.experience },
    { id: "contact", label: t.nav.contact },
  ];
  const { scrollYProgress } = useScroll({
    container: typeof window !== "undefined" ? { current: document.documentElement } : undefined,
  });
  
  // Background is transparent initially on all pages, becomes solid on scroll
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["rgba(254, 249, 245, 0)", "rgba(254, 249, 245, 0.95)"]
  );
  const shadow = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 20px rgba(0,0,0,0.1)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map((link) => link.id);
      const scrollPosition = window.scrollY + 100;
      
      // Track if scrolled for text color
      setIsScrolled(window.scrollY > 50);

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    // Close mobile menu first
    setIsOpen(false);
    
    // Small delay to let menu close, especially important on mobile
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300"
        style={{
          backgroundColor,
          boxShadow: shadow,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.button
              onClick={() => scrollToSection("hero")}
              className={`text-2xl font-bold transition-colors cursor-pointer ${
                !isHomePage || isScrolled 
                  ? "text-[#1E1A41] hover:text-[#3BC864]" 
                  : "text-white hover:text-[#3BC864]"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Dima Fomin
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => (
                  <motion.button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeSection === link.id
                        ? "bg-[#3BC864] text-white shadow-lg"
                        : !isHomePage || isScrolled
                        ? "text-[#1E1A41] hover:bg-[#C5E98A]/30 hover:text-[#1E1A41]"
                        : "text-white hover:bg-white/10 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
              
              {/* Language Switcher */}
              <LanguageSwitcher />
              
              {/* Login/Logout Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToDashboard}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors hover:bg-white/10 ${
                      !isHomePage || isScrolled ? "text-[#1E1A41]" : "text-white"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className={`rounded-full ${
                      !isHomePage || isScrolled
                        ? "border-[#1E1A41] text-[#1E1A41] hover:bg-[#1E1A41] hover:text-white"
                        : "border-white text-white hover:bg-white hover:text-[#1E1A41]"
                    }`}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t.nav.logout || "Вихід"}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  size="sm"
                  className={`rounded-full ${
                    !isHomePage || isScrolled
                      ? "border-[#1E1A41] text-[#1E1A41] hover:bg-[#1E1A41] hover:text-white"
                      : "border-white text-white hover:bg-white hover:text-[#1E1A41]"
                  }`}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t.nav.login || "Вхід"}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-2 rounded-lg transition-colors ${
                !isHomePage || isScrolled
                  ? "text-[#1E1A41] hover:bg-[#C5E98A]/30"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-[#FEF9F5]/98 backdrop-blur-md"
        >
          <div className="px-4 py-6 space-y-3">
            {/* Language Switcher in Mobile */}
            <div className="flex justify-center mb-2">
              <LanguageSwitcher />
            </div>
            
            {navLinks.map((link, index) => (
              <motion.button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all ${
                  activeSection === link.id
                    ? "bg-[#3BC864] text-white shadow-lg"
                    : "text-[#1E1A41] hover:bg-[#C5E98A]/30"
                }`}
              >
                {link.label}
              </motion.button>
            ))}
            
            {/* Login/Logout Button in Mobile */}
            <div className="pt-3 border-t border-[#1E1A41]/10">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <button
                    onClick={goToDashboard}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-[#1E1A41] hover:bg-[#C5E98A]/30 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full border-[#1E1A41] text-[#1E1A41] hover:bg-[#1E1A41] hover:text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t.nav.logout}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  size="sm"
                  className="w-full border-[#1E1A41] text-[#1E1A41] hover:bg-[#1E1A41] hover:text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {t.nav.login}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-0" />
      
      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
