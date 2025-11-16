'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/src/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { BrainCircuit } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, role } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Если пользователь уже авторизован - редирект на дашборд
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/profile/dashboard');
      }
    }
  }, [isAuthenticated, role, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Валидация формы
      if (!email || !password) {
        setError(t.auth.login.required);
        setIsSubmitting(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError(t.auth.login.invalidEmail);
        setIsSubmitting(false);
        return;
      }

      // Вызов login из AuthContext
      await login(email, password);
      // Редирект происходит в AuthContext.login()
    } catch (err: any) {
      console.error('[LoginPage] Ошибка входа:', err);
      setError(err?.message || t.auth.login.loginFailed);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
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
            <h1 className="text-3xl font-bold text-white mb-2">{t.auth.login.welcome}</h1>
            <p className="text-white/80 text-sm">
              {t.auth.login.subtitle}
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

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email input */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  {t.auth.login.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth.login.emailPlaceholder}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-slate-700/30 border border-white/20 dark:border-slate-600/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  disabled={isSubmitting || isLoading}
                />
              </div>

              {/* Password input */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  {t.auth.login.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.auth.login.passwordPlaceholder}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 dark:bg-slate-700/30 border border-white/20 dark:border-slate-600/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  disabled={isSubmitting || isLoading}
                />
              </div>

              {/* Submit button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-3 mt-6 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    {t.auth.login.loading}
                  </>
                ) : (
                  t.auth.login.loginButton
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
                  {t.common.or}
                </span>
              </div>
            </div>

            {/* Register link */}
            <p className="text-center text-white/70 text-sm">
              {t.auth.login.noAccount}{' '}
              <Link
                href="/register"
                className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors"
              >
                {t.auth.login.registerLink}
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="bg-white/5 dark:bg-slate-900/50 px-6 py-4 text-center text-xs text-white/50 border-t border-white/10">
            <Link href="/" className="hover:text-white/80 transition-colors">
              {t.common.backHome}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
