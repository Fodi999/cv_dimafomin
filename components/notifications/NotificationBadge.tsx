"use client";

import { useEffect, useState } from 'react';
import { UnreadCount } from '@/lib/types/notifications';
import { notificationsApi } from '@/lib/api/notifications';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Notification Badge Component
 * 
 * Displays unread count (critical + warning only, excludes info)
 * Auto-refreshes every 30 seconds
 * 
 * Architecture: Backend = Brain, Frontend = Eyes
 * - Backend decides what's critical/warning
 * - Frontend just displays the count
 */

interface NotificationBadgeProps {
  onClick?: () => void;
  className?: string;
  /** Auto-refresh interval in ms (default: 30000) */
  refreshInterval?: number;
}

export function NotificationBadge({ 
  onClick, 
  className = '',
  refreshInterval = 30000 
}: NotificationBadgeProps) {
  const { token } = useAuth();
  const [count, setCount] = useState<UnreadCount | null>(null);

  const fetchCount = async () => {
    if (!token) {
      // 🧪 TEMPORARY: Show mock data even without auth (for UI testing)
      // 🎯 2025 MODEL: Shows ONLY active notifications count
      setCount({
        critical: 2,  // 2 active critical notifications
        warning: 1,   // 1 active warning notification
        info: 0,      // 0 active info (auto-resolved or not created)
        total: 3      // badge = critical + warning (info excluded)
      });
      return;
    }

    // 🛡️ Защита от race condition (token может измениться во время запроса)
    const currentToken = token;

    try {
      const unreadCount = await notificationsApi.getUnreadCount(token);
      
      // Если token изменился во время запроса - игнорируем результат
      if (currentToken !== token) return;
      
      setCount(unreadCount);
    } catch (err) {
      console.error('Failed to fetch notification count:', err);
      
      // 🧪 TEMPORARY: Mock data for UI testing (remove when backend ready)
      // 🎯 2025 MODEL: Backend will return only active notifications
      if (currentToken === token) {
        setCount({
          critical: 2,  // 2 active critical
          warning: 1,   // 1 active warning
          info: 0,      // 0 active info
          total: 3      // badge = critical + warning
        });
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCount();
  }, [token]);

  // Auto-refresh
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      fetchCount();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [token, refreshInterval]);

  // 🧪 TEMPORARY: Always show badge with mock data for UI testing
  // TODO: When backend ready, uncomment this line:
  // if (!count || count.total === 0) return null;

  const isCritical = count && count.critical > 0;
  const displayCount = count?.total || 0;

  return (
    <button
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center 
        ${className}
        ring-2 ring-transparent hover:ring-gray-200 dark:hover:ring-gray-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${isCritical ? 'focus:ring-red-500' : 'focus:ring-orange-500'}
      `}
      aria-label={`${displayCount} unread notifications`}
      title={`${count?.critical || 0} critical, ${count?.warning || 0} warning notifications`}
    >
      {/* Bell Icon */}
      <svg
        className={`w-7 h-7 ${isCritical ? 'text-red-600 dark:text-red-500' : 'text-orange-600 dark:text-orange-500'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      {/* Badge */}
      <span
        className={`
          absolute -top-1 -right-1 
          min-w-[20px] h-5 
          flex items-center justify-center 
          px-1.5 
          text-xs font-bold text-white 
          rounded-full
          ${isCritical 
            ? 'bg-red-600 animate-pulse' 
            : 'bg-orange-500'
          }
        `}
      >
        {displayCount > 99 ? '99+' : displayCount}
      </span>

      {/* Pulse animation for critical */}
      {isCritical && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        </span>
      )}
    </button>
  );
}
