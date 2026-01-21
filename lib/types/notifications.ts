/**
 * Notification System Type Definitions
 * 
 * Architecture: Backend = Brain, Frontend = Eyes
 * Frontend does NOT calculate importance - it only displays what backend says.
 * 
 * Contract with Backend:
 * - Backend sends NotificationLevel ("critical" | "warning" | "info")
 * - Frontend trusts backend 100% and displays accordingly
 * - No client-side logic, no transformations, no guessing
 */

/**
 * Notification importance level (determined by backend)
 */
export type NotificationLevel = "critical" | "warning" | "info";

/**
 * Notification status (lifecycle state)
 * 
 * 🎯 GOLDEN RULE 2025:
 * - active   → Show in UI (user must take action)
 * - resolved → NEVER show in UI (action taken, notification dies)
 * - expired  → NEVER show in UI (too old, auto-cleanup)
 */
export type NotificationStatus = "active" | "resolved" | "expired";

/**
 * Metadata for fridge-related notifications
 * Contains all info needed to link notification to fridge item
 */
export interface FridgeNotificationMeta {
  fridgeItemId: string;      // ID of the fridge item
  ingredientId: string;      // ID of the ingredient
  ingredientName: string;    // Localized ingredient name
  expiresAt: string;         // ISO 8601 expiry date
  daysLeft: number;          // Days until expiry (can be negative)
}

/**
 * Single notification
 * 
 * 🔔 2025 MODEL:
 * Notification = Action required NOW
 * If action done → status = resolved → notification disappears from UI forever
 */
export interface Notification {
  id: string;                     // Notification UUID
  level: NotificationLevel;       // Importance (critical/warning/info)
  status: NotificationStatus;     // Lifecycle state (active/resolved/expired)
  title: string;                  // Localized title
  message: string;                // Localized message
  meta: FridgeNotificationMeta;   // Fridge item metadata
  createdAt: string;              // ISO 8601 creation timestamp
  resolvedAt: string | null;      // ISO 8601 timestamp when resolved (null if active)
}

/**
 * Notifications grouped by level
 * Backend returns this structure for easy rendering
 * 
 * 🚨 CRITICAL: Backend MUST filter by status === "active"
 * Frontend receives ONLY active notifications
 */
export interface NotificationGroup {
  critical: Notification[];  // Urgent notifications (always visible, status=active)
  warning: Notification[];   // Important notifications (always visible, status=active)
  info: Notification[];      // Informational (collapsed by default, status=active)
}

/**
 * Unread notification counts by level
 * Used for badge display
 * 
 * 🎯 GOLDEN RULE: Badge shows ONLY active notifications
 * Backend counts WHERE status = 'active'
 */
export interface UnreadCount {
  critical: number;  // Number of active critical notifications
  warning: number;   // Number of active warning notifications
  info: number;      // Number of active info notifications
  total: number;     // Sum of critical + warning (info excluded from badge)
}

/**
 * ✅ CRITICAL RULES (2025 MODEL)
 * 
 * 1. Badge Count:
 *    badge.total = active.critical + active.warning
 *    ❌ DO NOT include info
 *    ❌ DO NOT include resolved
 *    ❌ DO NOT include expired
 * 
 * 2. UI Display:
 *    Show ONLY: notifications WHERE status = 'active'
 *    ❌ NEVER show resolved
 *    ❌ NEVER show expired
 *    ❌ NO history
 *    ❌ NO archive
 * 
 * 3. User Action:
 *    Click notification → POST /resolve → status = resolved → UI removes it
 *    "Mark all read" → POST /resolve-all → all status = resolved → UI empty
 * 
 * 4. Database Cleanup:
 *    Backend CRON: WHERE resolved_at > 30 days → DELETE
 *    Backend CRON: WHERE status = 'expired' → DELETE faster
 * 
 * 5. Maximum Notifications:
 *    Typical: 1-5 notifications
 *    Maximum: 10 in extreme cases
 *    ❌ NEVER 99+
 * 
 * 📌 PHILOSOPHY:
 * Notification = Action required NOW
 * Action done → Notification dies → UI clean
 * User reacts, not reads.
 */
