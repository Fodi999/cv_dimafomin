'use client';

import { useEffect, useState } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

/**
 * ReloginNotification - показывает уведомление если токен не содержит sub
 * 
 * Показывается ОДИН РАЗ для каждого пользователя через localStorage флаг
 */
export default function ReloginNotification() {
  const { token, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Проверяем только в браузере
    if (typeof window === 'undefined' || !token) return;

    // Проверяем флаг "уведомление показано"
    const notificationShown = localStorage.getItem('relogin_notification_shown');
    if (notificationShown === 'true') {
      return; // Уже показывали
    }

    // Декодируем JWT и проверяем наличие sub
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (!payload.sub) {
        console.warn('⚠️ [ReloginNotification] Token missing sub - showing notification');
        setShouldShow(true);
        setIsVisible(true);
      } else {
        console.log('✅ [ReloginNotification] Token has sub - no notification needed');
        // Токен валидный, установить флаг что уведомление не нужно
        localStorage.setItem('relogin_notification_shown', 'true');
      }
    } catch (e) {
      console.error('❌ [ReloginNotification] Failed to decode JWT:', e);
    }
  }, [token]);

  const handleRelogin = () => {
    // Установить флаг что уведомление показано
    localStorage.setItem('relogin_notification_shown', 'true');
    
    // Очистить всё и перезагрузить
    console.log('🔄 [ReloginNotification] User clicked relogin');
    logout();
    window.location.href = '/';
  };

  const handleDismiss = () => {
    // Скрыть уведомление (но не устанавливать флаг - покажем снова при следующей загрузке)
    setIsVisible(false);
  };

  if (!shouldShow || !isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] max-w-md animate-in slide-in-from-top-5 duration-300">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-2xl border-2 border-white/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                Оновлення системи безпеки
              </h3>
              <p className="text-sm text-white/90">
                Необхідна повторна авторизація
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Закрити"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <p className="text-sm text-white/95">
            Ми оновили систему автентифікації для підвищення безпеки вашого акаунту.
          </p>
          <p className="text-sm text-white/95 font-medium">
            Будь ласка, вийдіть і увійдіть знову, щоб активувати нові функції:
          </p>
          <ul className="text-sm text-white/95 space-y-1 pl-4">
            <li>✅ AI Assistant</li>
            <li>✅ Персоналізовані рекомендації</li>
            <li>✅ Збереження контексту</li>
            <li>✅ Стабільна робота холодильника</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/10 flex gap-2">
          <Button
            onClick={handleRelogin}
            className="flex-1 bg-white text-red-600 hover:bg-white/90 font-bold"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Вийти і увійти знову
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            Пізніше
          </Button>
        </div>
      </div>
    </div>
  );
}
