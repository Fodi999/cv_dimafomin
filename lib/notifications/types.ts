/**
 * Unified Notification System Types
 * 
 * This defines a single contract for all notifications in the app:
 * - Toast: short-lived status updates (success/error)
 * - Hint: persistent content suggestions (what to do next)
 * - Inline: form validation errors
 */

export type NoticeKind = "toast" | "hint" | "inline";

export type NoticeLevel = "success" | "info" | "warning" | "error";

export type NoticeAction = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "ghost";
};

export type Notice = {
  kind: NoticeKind;
  level: NoticeLevel;
  title: string;
  description?: string;
  code?: string; // e.g., NO_RECIPES, FETCH_FAILED
  actions?: NoticeAction[];
  dismissible?: boolean;
  duration?: number; // for toasts (ms), undefined = auto-calculate
};

/**
 * API Response shape that can be converted to Notice
 */
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  requiresUserAction?: boolean;
  statusCode?: number;
};
