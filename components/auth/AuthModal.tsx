"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useLanguage();
  const { login, register } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(loginForm.email, loginForm.password);
      onClose();
      // Redirect to chat/profile after successful login
      router.push("/create-chat");
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle different error types
      let errorMessage = "Błąd logowania. Sprawdź dane i spróbuj ponownie.";
      
      if (error.message === "Invalid credentials") {
        errorMessage = "Неправильний email або пароль. Спробуйте ще раз.";
      } else if (error.status === 401) {
        errorMessage = "Неправильний email або пароль.";
      } else if (error.status === 404) {
        errorMessage = "Користувача з таким email не знайдено.";
      } else if (error.status === 500) {
        errorMessage = "Помилка сервера. Спробуйте пізніше.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Паролі не співпадають. Перевірте і спробуйте ще раз.");
      return;
    }

    if (registerForm.password.length < 6) {
      setError("Пароль повинен містити мінімум 6 символів.");
      return;
    }

    setIsLoading(true);

    try {
      // Call register API with name, email, password
      await register(registerForm.name, registerForm.email, registerForm.password);
      onClose();
      // Redirect to chat/profile after successful registration
      router.push("/create-chat");
    } catch (error: any) {
      console.error("Register error:", error);
      
      // Handle different error types
      let errorMessage = "Błąd rejestracji. Spróbuj ponownie.";
      
      if (error.message?.includes("already exists") || error.status === 409) {
        errorMessage = "Користувач з таким email вже існує. Спробуйте увійти.";
      } else if (error.status === 400) {
        errorMessage = "Невірні дані. Перевірте правильність введеної інформації.";
      } else if (error.status === 500) {
        errorMessage = "Помилка сервера. Спробуйте пізніше.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#3BC864] to-[#C5E98A] p-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h2 className="text-2xl font-bold text-white">
                  {activeTab === "login"
                    ? t.auth?.loginTitle || "Zaloguj się"
                    : t.auth?.registerTitle || "Zarejestruj się"}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  {activeTab === "login"
                    ? t.auth?.loginSubtitle || "Witaj ponownie!"
                    : t.auth?.registerSubtitle || "Utwórz nowe konto"}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === "login"
                      ? "text-[#3BC864] border-b-2 border-[#3BC864]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t.auth?.loginTab || "Logowanie"}
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === "register"
                      ? "text-[#3BC864] border-b-2 border-[#3BC864]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t.auth?.registerTab || "Rejestracja"}
                </button>
              </div>

              {/* Forms */}
              <div className="p-6">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                      </div>
                      <button
                        onClick={() => setError(null)}
                        className="flex-shrink-0 text-red-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {activeTab === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.auth?.email || "Email"}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder={t.auth?.emailPlaceholder || "twoj@email.com"}
                          value={loginForm.email}
                          onChange={(e) =>
                            setLoginForm({ ...loginForm, email: e.target.value })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.auth?.password || "Hasło"}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) =>
                            setLoginForm({ ...loginForm, password: e.target.value })
                          }
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-gray-600">
                          {t.auth?.rememberMe || "Zapamiętaj mnie"}
                        </span>
                      </label>
                      <button
                        type="button"
                        className="text-[#3BC864] hover:underline"
                      >
                        {t.auth?.forgotPassword || "Zapomniałeś hasła?"}
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#3BC864] to-[#C5E98A] hover:opacity-90 text-white"
                    >
                      {isLoading
                        ? t.auth?.loading || "Ładowanie..."
                        : t.auth?.loginButton || "Zaloguj się"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.auth?.name || "Imię i nazwisko"}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder={t.auth?.namePlaceholder || "Jan Kowalski"}
                          value={registerForm.name}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, name: e.target.value })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.auth?.email || "Email"}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder={t.auth?.emailPlaceholder || "twoj@email.com"}
                          value={registerForm.email}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, email: e.target.value })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.auth?.password || "Hasło"}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={registerForm.password}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              password: e.target.value,
                            })
                          }
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t.auth?.confirmPassword || "Potwierdź hasło"}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={registerForm.confirmPassword}
                          onChange={(e) =>
                            setRegisterForm({
                              ...registerForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#3BC864] to-[#C5E98A] hover:opacity-90 text-white"
                    >
                      {isLoading
                        ? t.auth?.loading || "Ładowanie..."
                        : t.auth?.registerButton || "Zarejestruj się"}
                    </Button>
                  </form>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 text-center text-sm text-gray-500">
                {activeTab === "login" ? (
                  <p>
                    {t.auth?.noAccount || "Nie masz konta?"}{" "}
                    <button
                      onClick={() => setActiveTab("register")}
                      className="text-[#3BC864] hover:underline font-medium"
                    >
                      {t.auth?.registerNow || "Zarejestruj się"}
                    </button>
                  </p>
                ) : (
                  <p>
                    {t.auth?.haveAccount || "Masz już konto?"}{" "}
                    <button
                      onClick={() => setActiveTab("login")}
                      className="text-[#3BC864] hover:underline font-medium"
                    >
                      {t.auth?.loginNow || "Zaloguj się"}
                    </button>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
