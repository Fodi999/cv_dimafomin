"use client";

import { useState } from "react";
import { Bell, X, Sparkles, Refrigerator, ShoppingBag, AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications, type Notification } from "@/hooks/useNotifications";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Unified Notification Center
 * Shows AI, Fridge, Orders, System, Errors - all in one place
 */
export function NotificationCenter() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ai':
        return <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'fridge':
        return <Refrigerator className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'system':
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
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

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    await markAsRead(notification.id);

    // Handle click action based on type
    if (notification.type === 'fridge' && notification.data?.fridgeItemId) {
      // Navigate to fridge and highlight item
      router.push(`/fridge?highlight=${notification.data.fridgeItemId}`);
      setIsOpen(false);
    } else if (notification.type === 'ai' && notification.data?.link) {
      // Navigate to AI recommendation
      router.push(notification.data.link);
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
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Notifications {unreadCount > 0 && <span className="text-red-500">({unreadCount})</span>}
                </h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto max-h-96">
                {isLoading ? (
                  <div className="p-8 text-center text-slate-500">Loading...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <Bell className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                          !notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {getIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-slate-900 dark:text-white text-sm truncate">
                                {notification.title}
                              </p>
                              <Badge variant={getBadgeVariant(notification.type)} className="ml-2 text-xs">
                                {notification.type}
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
                                  Unread
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
                                  <span className="ml-2">• {notification.data.daysLeft} days left</span>
                                )}
                                {notification.data.price && (
                                  <span className="ml-2 text-red-600 dark:text-red-400">
                                    • {notification.data.price.toFixed(2)} PLN at risk
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
                    View all notifications
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
