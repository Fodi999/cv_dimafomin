"use client";

import { useState, useEffect } from "react";
import { Bell, X, Sparkles, Refrigerator, ShoppingBag, AlertCircle, CheckCircle, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications, type Notification } from "@/hooks/useNotifications";
import { useNotificationRefetch } from "@/contexts/NotificationRefetchContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Unified Notification Center
 * Shows AI, Fridge, Orders, System, Errors - all in one place
 */
export function NotificationCenter() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, refetch, refetchUnreadCount } = useNotifications();
  const { registerRefetch } = useNotificationRefetch();

  // 🆕 Register refetch function for global access
  useEffect(() => {
    registerRefetch(() => {
      refetch();
      refetchUnreadCount();
    });
  }, [registerRefetch, refetch, refetchUnreadCount]);

  // 🆕 Get icon & color based on notification action
  const getIconAndColor = (notification: Notification) => {
    const action = notification.data?.action;
    
    // Fridge-specific actions
    if (notification.type === 'fridge') {
      if (action === 'item_deleted') {
        return {
          icon: <Trash2 className="w-5 h-5" />,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-l-red-500'
        };
      }
      if (action === 'item_added') {
        return {
          icon: <Plus className="w-5 h-5" />,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-l-green-500'
        };
      }
      // Default fridge (expiry warnings)
      return {
        icon: <Refrigerator className="w-5 h-5" />,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-l-blue-500'
      };
    }
    
    // Other types
    switch (notification.type) {
      case 'ai':
        return {
          icon: <Sparkles className="w-5 h-5" />,
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
          borderColor: 'border-l-purple-500'
        };
      case 'order':
        return {
          icon: <ShoppingBag className="w-5 h-5" />,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-l-green-500'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-l-red-500'
        };
      default:
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-l-gray-500'
        };
    }
  };

  const getBadgeVariant = (type: Notification['type']) => {
    switch (type) {
      case 'ai':
        return 'default';
      case 'fridge':
        return 'secondary';
      case 'order':
        return 'outline';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t?.common?.notifications?.time?.justNow || "Just now";
    if (diffMins < 60) return t?.common?.notifications?.time?.minutesAgo?.replace('{{count}}', diffMins.toString()) || `${diffMins}m ago`;
    if (diffHours < 24) return t?.common?.notifications?.time?.hoursAgo?.replace('{{count}}', diffHours.toString()) || `${diffHours}h ago`;
    if (diffDays < 7) return t?.common?.notifications?.time?.daysAgo?.replace('{{count}}', diffDays.toString()) || `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    await markAsRead(notification.id);

    // Handle click action based on type
    if (notification.type === 'fridge') {
      // Always navigate to fridge for fridge notifications
      if (notification.data?.fridgeItemId) {
        // Try to highlight item (will work if item still exists)
        router.push(`/fridge?highlight=${notification.data.fridgeItemId}`);
      } else {
        // No specific item, just go to fridge page
        router.push('/fridge');
      }
      setIsOpen(false);
    } else if (notification.type === 'ai' && notification.data?.link) {
      // Navigate to AI recommendation
      router.push(notification.data.link);
      setIsOpen(false);
    } else if (notification.type === 'order') {
      // Navigate to orders (future)
      router.push('/orders');
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />

        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-12 w-96 max-h-[32rem] bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {t?.common?.notifications?.title || "Notifications"}
                  </h3>
                  {unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-red-500 text-white text-xs font-bold rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    {t?.common?.notifications?.markAllRead || "Mark all read"}
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto max-h-96">
                {isLoading ? (
                  <div className="p-8 text-center text-slate-500">{t?.common?.loading || "Loading..."}</div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>{t?.common?.notifications?.empty || "No notifications"}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {notifications.map((notification) => {
                      const { icon, color, bgColor, borderColor } = getIconAndColor(notification);
                      
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => handleNotificationClick(notification)}
                          className={`
                            p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer
                            border-l-4 ${borderColor}
                            ${!notification.isRead ? bgColor : ""}
                          `}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon with color */}
                            <div className={`flex-shrink-0 mt-1 ${color}`}>
                              {icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                                  {notification.title}
                                </p>
                                <Badge variant={getBadgeVariant(notification.type)} className="ml-2 text-xs">
                                  {t?.common?.notifications?.types?.[notification.type] || notification.type}
                                </Badge>
                              </div>

                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 line-clamp-2">
                              {notification.message}
                            </p>

                            {/* Metadata */}
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>{formatTime(notification.createdAt)}</span>
                              {!notification.isRead && (
                                <span className="flex items-center gap-1">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  {t?.common?.notifications?.unread || "Unread"}
                                </span>
                              )}
                            </div>

                            {/* AI/Fridge specific data */}
                            {notification.data && (
                              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                                {notification.data.productName && (
                                  <span className="font-medium">{notification.data.productName}</span>
                                )}
                                {notification.data.daysLeft !== undefined && (
                                  <span className="ml-2">
                                    • {t?.common?.notifications?.fridge?.daysLeft?.replace('{{count}}', notification.data.daysLeft.toString()) || `${notification.data.daysLeft} days left`}
                                  </span>
                                )}
                                {notification.data.price && (
                                  <span className="ml-2 text-red-600 dark:text-red-400">
                                    • {t?.common?.notifications?.fridge?.priceAtRisk?.replace('{{price}}', notification.data.price.toFixed(2)) || `${notification.data.price.toFixed(2)} PLN at risk`}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      router.push('/notifications');
                      setIsOpen(false);
                    }}
                    className="w-full text-sm"
                  >
                    {t?.common?.notifications?.viewAll || "View all notifications"}
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
