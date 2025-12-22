/**
 * Unified Notification System
 * 
 * Central provider for all notifications:
 * - Toast queue (short-lived)
 * - Current hint (persistent, one at a time)
 * - Inline validation (future)
 */

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { toast as sonnerToast } from "sonner";
import type { Notice, NoticeLevel, NoticeAction, ApiResponse } from "@/lib/notifications/types";
import { NoticeCatalog, type NoticeCatalogKey, getNotice } from "@/lib/notifications/catalog";

type NotificationContextType = {
  // Current hint (one at a time, shown in page content)
  currentHint: Notice | null;
  setHint: (notice: Notice | null) => void;
  clearHint: () => void;

  // Facade methods
  success: (title: string, description?: string, duration?: number) => void;
  error: (title: string, description?: string, duration?: number) => void;
  info: (title: string, description?: string, duration?: number) => void;
  warning: (title: string, description?: string, duration?: number) => void;
  hint: (notice: Notice) => void;
  
  // Smart API response handler
  fromApiResponse: <T = any>(
    response: ApiResponse<T>,
    context?: {
      onRetry?: () => void;
      onDismiss?: () => void;
    }
  ) => void;

  // Catalog shortcuts
  showCatalogNotice: (
    code: NoticeCatalogKey,
    overrides?: Partial<Notice>
  ) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [currentHint, setCurrentHint] = useState<Notice | null>(null);

  // Toast methods (using Sonner)
  const success = useCallback((title: string, description?: string, duration = 4000) => {
    sonnerToast.success(title, {
      description,
      duration,
    });
  }, []);

  const error = useCallback((title: string, description?: string, duration = 5000) => {
    sonnerToast.error(title, {
      description,
      duration,
    });
  }, []);

  const info = useCallback((title: string, description?: string, duration = 4000) => {
    sonnerToast.info(title, {
      description,
      duration,
    });
  }, []);

  const warning = useCallback((title: string, description?: string, duration = 5000) => {
    sonnerToast.warning(title, {
      description,
      duration,
    });
  }, []);

  // Hint method (persistent, shown in page)
  const hint = useCallback((notice: Notice) => {
    setCurrentHint(notice);
  }, []);

  const clearHint = useCallback(() => {
    setCurrentHint(null);
  }, []);

  const setHint = useCallback((notice: Notice | null) => {
    setCurrentHint(notice);
  }, []);

  // Smart API response handler
  const fromApiResponse = useCallback(<T = any>(
    response: ApiResponse<T>,
    context?: {
      onRetry?: () => void;
      onDismiss?: () => void;
    }
  ) => {
    // Success case - usually no notification needed
    if (response.success) {
      return;
    }

    // Determine notification type based on response
    const message = response.message || response.error || "Wystąpił błąd";

    // Case 1: Requires user action → HINT (persistent)
    if (response.requiresUserAction) {
      const notice: Notice = {
        kind: "hint",
        level: "info",
        title: "Wymaga działania",
        description: message,
        dismissible: true,
        actions: context?.onDismiss
          ? [
              {
                label: "Zamknij",
                onClick: context.onDismiss,
                variant: "ghost",
              },
            ]
          : undefined,
      };
      hint(notice);
      return;
    }

    // Case 2: Network/API error → TOAST (auto-dismiss)
    const isNetworkError = response.statusCode && response.statusCode >= 500;
    const isNotFound = response.statusCode === 404;

    if (isNetworkError) {
      error("Błąd serwera", message);
    } else if (isNotFound) {
      warning("Nie znaleziono", message);
    } else {
      // Generic error toast
      error("Błąd", message);
    }

    // Optionally add retry action
    if (context?.onRetry) {
      // Note: Sonner doesn't support actions well, so we log for now
      console.log("Retry available but not shown in toast UI");
    }
  }, [hint, error, warning]);

  // Catalog shortcut
  const showCatalogNotice = useCallback((
    code: NoticeCatalogKey,
    overrides?: Partial<Notice>
  ) => {
    const notice = getNotice(code, overrides);

    if (notice.kind === "toast") {
      // Use appropriate toast method
      switch (notice.level) {
        case "success":
          success(notice.title, notice.description);
          break;
        case "error":
          error(notice.title, notice.description);
          break;
        case "warning":
          warning(notice.title, notice.description);
          break;
        case "info":
        default:
          info(notice.title, notice.description);
          break;
      }
    } else if (notice.kind === "hint") {
      hint(notice);
    }
  }, [success, error, warning, info, hint]);

  const value: NotificationContextType = {
    currentHint,
    setHint,
    clearHint,
    success,
    error,
    info,
    warning,
    hint,
    fromApiResponse,
    showCatalogNotice,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * Facade hook - single entry point for all notifications
 */
export function useNotify() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotify must be used within NotificationProvider");
  }
  return context;
}
