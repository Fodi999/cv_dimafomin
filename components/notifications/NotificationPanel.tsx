"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Info, CheckCircle, Refrigerator } from 'lucide-react';
import { NotificationGroup } from '@/lib/types/notifications';
import { notificationsApi } from '@/lib/api/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Notification Panel Component
 * 
 * 🎯 2025 MODEL: Displays ONLY active notifications
 * 
 * Shows:
 * - Critical: Always visible (red)
 * - Warning: Always visible (orange)
 * 
 * ❌ NEVER shows:
 * - Resolved notifications (status = resolved)
 * - Expired notifications (status = expired)
 * - History or archive
 * - Info level (auto-resolved quickly)
 * 
 * Philosophy:
 * Notification = Action required NOW
 * User clicks → status = resolved → notification disappears forever
 * 
 * Architecture: Backend = Brain, Frontend = Eyes
 * - Backend decides importance (critical/warning)
 * - Backend filters by status === "active"
 * - Frontend just displays what backend sends
 */

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { token } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationGroup | null>(null);
  const [loading, setLoading] = useState(true);
  // 🎯 2025: No infoExpanded state needed (info section removed)

  const fetchNotifications = async () => {
    if (!token) {
      // 🧪 TEMPORARY: Show mock data even without auth (for UI testing)
      // 🎯 2025 MODEL: Backend returns ONLY active notifications
      setNotifications({
        critical: [
          {
            id: 'mock_1',
            level: 'critical',
            status: 'active',
            title: 'Product Expiring Today!',
            message: 'Salmon expires in 1 day',
            meta: {
              fridgeItemId: 'item_123',
              ingredientId: 'ing_001',
              ingredientName: 'Salmon',
              expiresAt: new Date(Date.now() + 1 * 86400000).toISOString(),
              daysLeft: 1
            },
            resolvedAt: null,
            createdAt: new Date(Date.now() - 5 * 60000).toISOString()
          },
          {
            id: 'mock_2',
            level: 'critical',
            status: 'active',
            title: 'Product Expired!',
            message: 'Milk expired 2 days ago',
            meta: {
              fridgeItemId: 'item_456',
              ingredientId: 'ing_002',
              ingredientName: 'Milk',
              expiresAt: new Date(Date.now() - 2 * 86400000).toISOString(),
              daysLeft: -2
            },
            resolvedAt: null,
            createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
          }
        ],
        warning: [
          {
            id: 'mock_3',
            level: 'warning',
            status: 'active',
            title: 'Product Expiring Soon',
            message: 'Lettuce expires in 4 days',
            meta: {
              fridgeItemId: 'item_789',
              ingredientId: 'ing_003',
              ingredientName: 'Lettuce',
              expiresAt: new Date(Date.now() + 4 * 86400000).toISOString(),
              daysLeft: 4
            },
            resolvedAt: null,
            createdAt: new Date(Date.now() - 1 * 3600000).toISOString()
          }
        ],
        info: []  // 🎯 2025: Info notifications auto-resolve or not created
      });
      setLoading(false);
      return;
    }

    try {
      const data = await notificationsApi.getNotifications(token);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      
      // 🧪 TEMPORARY: Mock data for UI testing (remove when backend ready)
      // 🎯 2025 MODEL: Backend returns ONLY active notifications
      setNotifications({
        critical: [
          {
            id: 'mock_1',
            level: 'critical',
            status: 'active',
            title: 'Product Expiring Today!',
            message: 'Salmon expires in 1 day',
            meta: {
              fridgeItemId: 'item_123',
              ingredientId: 'ing_001',
              ingredientName: 'Salmon',
              expiresAt: new Date(Date.now() + 1 * 86400000).toISOString(),
              daysLeft: 1
            },
            resolvedAt: null,
            createdAt: new Date(Date.now() - 5 * 60000).toISOString()
          },
          {
            id: 'mock_2',
            level: 'critical',
            status: 'active',
            title: 'Product Expired!',
            message: 'Milk expired 2 days ago',
            meta: {
              fridgeItemId: 'item_456',
              ingredientId: 'ing_002',
              ingredientName: 'Milk',
              expiresAt: new Date(Date.now() - 2 * 86400000).toISOString(),
              daysLeft: -2
            },
            resolvedAt: null,
            createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
          }
        ],
        warning: [
          {
            id: 'mock_3',
            level: 'warning',
            status: 'active',
            title: 'Product Expiring Soon',
            message: 'Lettuce expires in 4 days',
            meta: {
              fridgeItemId: 'item_789',
              ingredientId: 'ing_003',
              ingredientName: 'Lettuce',
              expiresAt: new Date(Date.now() + 4 * 86400000).toISOString(),
              daysLeft: 4
            },
            resolvedAt: null,
            createdAt: new Date(Date.now() - 1 * 3600000).toISOString()
          }
        ],
        info: []  // 🎯 2025: Info notifications auto-resolve quickly
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchNotifications();
    }
  }, [isOpen, token]);

  const handleNotificationClick = async (id: string, fridgeItemId?: string) => {
    if (!token) return;

    try {
      // Mark as read
      await notificationsApi.resolveNotification(id, token);
      
      // Refetch to update UI
      await fetchNotifications();

      // Navigate to fridge item if available
      if (fridgeItemId) {
        router.push(`/fridge?highlight=${fridgeItemId}`);
        onClose();
      }
    } catch (err) {
      console.error('Failed to resolve notification:', err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!token) return;

    try {
      await notificationsApi.resolveAllNotifications(token);
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-l-4 border-red-500',
          icon: 'text-red-600 dark:text-red-400',
          badge: 'bg-red-600',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/20',
          border: 'border-l-4 border-orange-500',
          icon: 'text-orange-600 dark:text-orange-400',
          badge: 'bg-orange-500',
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-l-4 border-blue-500',
          icon: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-500',
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-l-4 border-gray-500',
          icon: 'text-gray-600 dark:text-gray-400',
          badge: 'bg-gray-500',
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h2>
          <div className="flex items-center gap-2">
            {/* 🎯 2025: Show button only if has active notifications (critical + warning) */}
            {notifications && (notifications.critical.length + notifications.warning.length) > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : !notifications || (notifications.critical.length + notifications.warning.length) === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No notifications
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                All clear! 🎉
              </p>
            </div>
          ) : (
            <>
              {/* Critical (always visible) */}
              {notifications.critical.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold">
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                    <span>Critical ({notifications.critical.length})</span>
                  </div>
                  {notifications.critical.map((notif) => {
                    const styles = getLevelStyles('critical');
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${styles.bg} ${styles.border} p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow ring-2 ring-red-500/20`}
                        onClick={() => handleNotificationClick(notif.id, notif.meta?.fridgeItemId)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={styles.icon}>
                            {notif.meta?.fridgeItemId ? <Refrigerator className="w-5 h-5" /> : getLevelIcon('critical')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {notif.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {formatDate(notif.createdAt)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Warning (always visible) */}
              {notifications.warning.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Warning ({notifications.warning.length})</span>
                  </div>
                  {notifications.warning.map((notif) => {
                    const styles = getLevelStyles('warning');
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${styles.bg} ${styles.border} p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow ring-2 ring-orange-500/20`}
                        onClick={() => handleNotificationClick(notif.id, notif.meta?.fridgeItemId)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={styles.icon}>
                            {notif.meta?.fridgeItemId ? <Refrigerator className="w-5 h-5" /> : getLevelIcon('warning')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {notif.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {formatDate(notif.createdAt)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* 
                🎯 2025 MODEL: NO INFO SECTION
                Info notifications auto-resolve quickly or don't exist
                UI shows ONLY critical + warning (action required NOW)
              */}
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}
