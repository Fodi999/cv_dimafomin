"use client";

import { useState, useEffect } from "react";
import { X, Hammer, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DevelopmentModalProps {
  title?: string;
  message?: string;
}

export default function DevelopmentModal({
  title,
  message,
}: DevelopmentModalProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Показываем модалку после монтирования компонента
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay - затемнённый фон */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-modal-appear overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Декоративный градиент сверху */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-sky-500" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-200"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full p-4">
                <Hammer className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2
            id="modal-title"
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3"
          >
            {title || t.common.devModal.title}
          </h2>

          {/* Message */}
          <p
            id="modal-description"
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
          >
            {message || t.common.devModal.message}
          </p>

          {/* Action Button */}
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            {t.common.close}
          </button>

          {/* Additional Info (optional) */}
          <p className="mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            {t.common.devModal.follow}
          </p>
        </div>
      </div>
    </div>
  );
}
