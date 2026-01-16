import type { Notification } from '@/hooks/useNotifications';

/**
 * Group similar notifications by ingredient and time window
 * 
 * Groups notifications if:
 * - Same ingredient (productName)
 * - Same type (fridge)
 * - Within 5 minutes of each other
 * 
 * Example:
 * Before:
 *   - Czosnek удалён (10:00)
 *   - Czosnek добавлен (10:01)
 *   - Czosnek удалён (10:03)
 * 
 * After:
 *   - Czosnek — 3 действия за 3 минуты (10:03)
 */

interface GroupedNotification extends Notification {
  groupedCount?: number;
  groupedActions?: string[];
  originalNotifications?: Notification[];
}

const TIME_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export function groupNotifications(notifications: Notification[]): GroupedNotification[] {
  if (notifications.length === 0) return [];

  // Sort by time (newest first)
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const grouped: GroupedNotification[] = [];
  const processed = new Set<string>();

  for (const notification of sorted) {
    if (processed.has(notification.id)) continue;

    // Only group fridge notifications with productName
    if (
      notification.type !== 'fridge' ||
      !notification.data?.productName
    ) {
      grouped.push(notification);
      processed.add(notification.id);
      continue;
    }

    // Find similar notifications in time window
    const similar = sorted.filter((n) => {
      if (processed.has(n.id)) return false;
      if (n.type !== 'fridge') return false;
      if (n.data?.productName !== notification.data?.productName) return false;

      const timeDiff = Math.abs(
        new Date(notification.createdAt).getTime() - new Date(n.createdAt).getTime()
      );

      return timeDiff <= TIME_WINDOW_MS;
    });

    if (similar.length <= 1) {
      // No grouping needed
      grouped.push(notification);
      processed.add(notification.id);
    } else {
      // Group similar notifications
      const actions = similar.map((n) => {
        const action = n.data?.action;
        switch (action) {
          case 'item_added':
            return 'добавлен';
          case 'item_deleted':
            return 'удалён';
          case 'item_expiring':
            return 'истекает';
          case 'item_expired':
            return 'истёк';
          default:
            return 'изменён';
        }
      });

      const uniqueActions = Array.from(new Set(actions));
      const timeDiffMinutes = Math.round(
        (new Date(similar[0].createdAt).getTime() -
          new Date(similar[similar.length - 1].createdAt).getTime()) /
          60000
      );

      const groupedNotification: GroupedNotification = {
        ...notification,
        groupedCount: similar.length,
        groupedActions: uniqueActions,
        originalNotifications: similar,
        message: `${notification.data.productName} — ${similar.length} действий за ${timeDiffMinutes} мин`,
      };

      grouped.push(groupedNotification);
      similar.forEach((n) => processed.add(n.id));
    }
  }

  return grouped;
}

/**
 * Check if notification should be grouped
 */
export function shouldGroupNotifications(notifications: Notification[]): boolean {
  // Only enable grouping if there are many fridge notifications
  const fridgeNotifications = notifications.filter((n) => n.type === 'fridge');
  return fridgeNotifications.length >= 5;
}

/**
 * Format grouped notification message
 */
export function formatGroupedMessage(
  productName: string,
  count: number,
  actions: string[],
  minutes: number
): string {
  const actionText = actions.length === 1 ? actions[0] : 'изменений';
  const timeText = minutes === 0 ? 'только что' : `за ${minutes} мин`;
  
  return `${productName} — ${count} ${actionText} ${timeText}`;
}
