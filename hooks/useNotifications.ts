import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  userId: string;
  type: 'ai' | 'fridge' | 'order' | 'system' | 'error';
  title: string;
  message: string;
  data?: {
    fridgeItemId?: string;
    productName?: string;
    daysLeft?: number;
    price?: number;
    link?: string;
    action?: 'item_added' | 'item_deleted' | 'item_expired' | 'item_expiring'; // 🆕 Action type
  };
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationFilters {
  page: number;
  limit: number;
  unread?: boolean;
  type?: Notification['type'];
}

/**
 * Hook for managing notifications
 * Unified center for AI, fridge, orders, errors
 */
export function useNotifications(filters: Partial<NotificationFilters> = {}) {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  const defaultFilters: NotificationFilters = {
    page: 1,
    limit: 20,
    ...filters,
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: defaultFilters.page.toString(),
        limit: defaultFilters.limit.toString(),
      });

      if (defaultFilters.unread !== undefined) {
        queryParams.append('unread', defaultFilters.unread.toString());
      }
      if (defaultFilters.type) {
        queryParams.append('type', defaultFilters.type);
      }

      const response = await fetch(`/api/notifications?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      setNotifications(data.data || []);
      setMeta(data.meta || null);
    } catch (error) {
      console.error('[useNotifications] Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token, defaultFilters.page, defaultFilters.limit, defaultFilters.unread, defaultFilters.type]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/notifications/unread-count', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch unread count');

      const data = await response.json();
      setUnreadCount(data.data?.count || 0);
    } catch (error) {
      console.error('[useNotifications] Unread count error:', error);
    }
  }, [token]);

  // Mark as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!token) return false;

    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to mark as read');

      // Update local state
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      return true;
    } catch (error) {
      console.error('[useNotifications] Mark as read error:', error);
      return false;
    }
  }, [token]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    if (!token) return false;

    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to mark all as read');

      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);

      return true;
    } catch (error) {
      console.error('[useNotifications] Mark all as read error:', error);
      return false;
    }
  }, [token]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  // Poll for new notifications (every 3 minutes when page is visible)
  useEffect(() => {
    const pollInterval = 180000; // 3 minutes

    const poll = () => {
      // Only poll if page is visible
      if (document.visibilityState === 'visible') {
        fetchUnreadCount();
      }
    };

    const interval = setInterval(poll, pollInterval);

    // Also poll when page becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchUnreadCount();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    meta,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
    refetchUnreadCount: fetchUnreadCount, // 🆕 Exposed for manual refetch
  };
}
