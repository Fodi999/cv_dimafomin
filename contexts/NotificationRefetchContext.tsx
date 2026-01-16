"use client";

import { createContext, useContext, useCallback, useRef } from 'react';

/**
 * Global context for triggering notification refetch
 * Used after actions like: add item, delete item, discard item
 */
interface NotificationRefetchContextType {
  triggerRefetch: () => void;
  registerRefetch: (fn: () => void) => void;
}

const NotificationRefetchContext = createContext<NotificationRefetchContextType | null>(null);

export function NotificationRefetchProvider({ children }: { children: React.ReactNode }) {
  const refetchFnRef = useRef<(() => void) | null>(null);

  const registerRefetch = useCallback((fn: () => void) => {
    refetchFnRef.current = fn;
  }, []);

  const triggerRefetch = useCallback(() => {
    if (refetchFnRef.current) {
      refetchFnRef.current();
    }
  }, []);

  return (
    <NotificationRefetchContext.Provider value={{ triggerRefetch, registerRefetch }}>
      {children}
    </NotificationRefetchContext.Provider>
  );
}

export function useNotificationRefetch() {
  const context = useContext(NotificationRefetchContext);
  if (!context) {
    // Graceful fallback: return no-op functions
    return {
      triggerRefetch: () => {},
      registerRefetch: () => {},
    };
  }
  return context;
}
