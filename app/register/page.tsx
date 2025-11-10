"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import { BrainCircuit, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: "", color: "bg-gray-400" };
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { strength: 1, label: "Слаба", color: "bg-red-500" };
    if (strength <= 3) return { strength: 2, label: "Середня", color: "bg-yellow-500" };
    return { strength: 3, label: "Сильна", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Будь ласка, заповніть всі поля");
        setIsSubmitting(false);
        return;
      }

      if (formData.name.length < 2) {
        setError("Ім'я повинно бути не менше 2 символів");
        setIsSubmitting(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Будь ласка, введіть коректну email адресу");
        setIsSubmitting(false);
        return;
      }

      if (formData.password.length < 8) {
        setError("Пароль повинен бути не менше 8 символів");
        setIsSubmitting(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Паролі не збігаються");
        setIsSubmitting(false);
        return;
      }

      // Call register method from UserContext
      await register(formData.name, formData.email, formData.password);

      // If successful, redirect to profile
      router.push("/profile");
    } catch (err: any) {
      console.error("Register error:", err);
      setError(
        err?.message || "Помилка при реєстрації. Спробуйте ще раз"
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-4 py-8">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card container */}
        <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl overflow-hidden">
          {/* Header section */}
          <div className="bg-gradient-to-r from-sky-500 to-cyan-500 dark:from-sky-600 dark:to-cyan-600 px-6 py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center mb-4"
            >
              <div className="p-3 bg-white/20 rounded-full">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Присоединяйтесь!</h1>
            <p className="text-white/80 text-sm">
              Створіть новий аккаунт та розпочніть свою подорож у світ кулінарії
            </p>
          </div>

          {/* Form section */}
          <div className="p-8">
            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name input */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Ваше ім'я
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Іван Коваленко"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-slate-700/30 border border-white/20 dark:border-slate-600/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  disabled={isSubmitting || isLoading}
                />
              </div>

              {/* Email input */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email адреса
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-slate-700/30 border border-white/20 dark:border-slate-600/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  disabled={isSubmitting || isLoading}
                />
              </div>

              {/* Password input */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Пароль
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-slate-700/30 border border-white/20 dark:border-slate-600/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  disabled={isSubmitting || isLoading}
                />
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 flex items-center gap-2"
                  >
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{
                          width: `${(passwordStrength.strength / 3) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-white/60">
                      {passwordStrength.label}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Confirm password input */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Підтвердьте пароль
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-slate-700/30 border border-white/20 dark:border-slate-600/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  disabled={isSubmitting || isLoading}
                />
                {formData.confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2"
                  >
                    {formData.password === formData.confirmPassword ? (
                      <div className="flex items-center gap-2 text-green-300 text-sm">
                        <Check className="w-4 h-4" />
                        Паролі збігаються
                      </div>
                    ) : (
                      <div className="text-red-300 text-sm">Паролі не збігаються</div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Requirements */}
              <div className="p-3 bg-white/5 dark:bg-slate-900/30 rounded-lg border border-white/10">
                <p className="text-xs text-white/60 font-semibold mb-2">Вимоги до пароля:</p>
                <ul className="space-y-1 text-xs text-white/50">
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        formData.password.length >= 8
                          ? "bg-green-400"
                          : "bg-white/30"
                      }`}
                    />
                    Мінімум 8 символів
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        /[A-Z]/.test(formData.password)
                          ? "bg-green-400"
                          : "bg-white/30"
                      }`}
                    />
                    Велика літера (A-Z)
                  </li>
                  <li className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        /[0-9]/.test(formData.password)
                          ? "bg-green-400"
                          : "bg-white/30"
                      }`}
                    />
                    Цифра (0-9)
                  </li>
                </ul>
              </div>

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={
                  isSubmitting ||
                  isLoading ||
                  !formData.name ||
                  !formData.email ||
                  formData.password.length < 8 ||
                  formData.password !== formData.confirmPassword
                }
                className="w-full py-3 mt-6 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Реєстрація у прогресі...
                  </>
                ) : (
                  "Зареєструватися"
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/10 dark:bg-slate-800/50 text-white/60">
                  або
                </span>
              </div>
            </div>

            {/* Login link */}
            <p className="text-center text-white/70 text-sm">
              Уже зареєстровані?{" "}
              <Link
                href="/login"
                className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors"
              >
                Увійти
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="bg-white/5 dark:bg-slate-900/50 px-6 py-4 text-center text-xs text-white/50 border-t border-white/10">
            <Link href="/" className="hover:text-white/80 transition-colors">
              ← Повернутися на головну
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
