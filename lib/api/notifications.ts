/**
 * Notifications API Client
 * 
 * Pure REST client with ZERO logic:
 * ✅ No transformations
 * ✅ No calculations
 * ✅ No state management
 * 
 * Just fetch and return what backend sends.
 */

import { apiFetch } from './base';
import type { NotificationGroup, UnreadCount, Notification } from '@/lib/types/notifications';

/**
 * Get all notifications grouped by level
 * 
 * GET /api/notifications
 * 
 * Returns:
 * {
 *   critical: Notification[],
 *   warning: Notification[],
 *   info: Notification[]
 * }
 */
export async function getNotifications(token: string): Promise<NotificationGroup> {
  const response = await apiFetch<NotificationGroup>('/notifications', { token });
  return response;
}

/**
 * Get unread notification counts
 * 
 * GET /api/notifications/unread-count
 * 
 * Returns:
 * {
 *   critical: number,
 *   warning: number,
 *   info: number,
 *   total: number  // critical + warning (for badge)
 * }
 */
export async function getUnreadCount(token: string): Promise<UnreadCount> {
  const response = await apiFetch<UnreadCount>('/notifications/unread-count', { token });
  return response;
}

/**
 * Mark notification as read (resolve)
 * 
 * POST /api/notifications/:id/resolve
 * 
 * After calling this:
 * 1. Notification.readAt will be set to current timestamp
 * 2. Unread count will decrease
 * 3. Badge will update automatically (if you refetch)
 */
export async function resolveNotification(id: string, token: string): Promise<void> {
  await apiFetch(`/notifications/${id}/resolve`, {
    method: 'POST',
    token
  });
}

/**
 * Mark all notifications as read
 * 
 * POST /api/notifications/resolve-all
 * 
 * Resolves all unread notifications at once.
 */
export async function resolveAllNotifications(token: string): Promise<void> {
  await apiFetch('/notifications/resolve-all', {
    method: 'POST',
    token
  });
}

/**
 * Export as object for consistency with other API modules
 */
export const notificationsApi = {
  getNotifications,
  getUnreadCount,
  resolveNotification,
  resolveAllNotifications
};
