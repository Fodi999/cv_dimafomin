"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

/**
 * ThemeProvider - Управляет темой приложения с CSS Variables
 * 
 * Примеры использования:
 * ```tsx
 * <ThemeProvider defaultTheme="system">
 *   <App />
 * </ThemeProvider>
 * 
 * // В компоненте:
 * const { theme, setTheme } = useTheme();
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme-preference",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Определяем какая тема на самом деле используется (light или dark)
  const resolvedTheme: "light" | "dark" = (() => {
    if (theme === "system") {
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return "light";
    }
    return theme;
  })();

  // Применяем тему к DOM
  const applyTheme = (newTheme: Theme) => {
    if (typeof window === "undefined") return;

    const resolved = newTheme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : newTheme;

    const htmlElement = document.documentElement;

    if (resolved === "dark") {
      htmlElement.classList.add("dark");
      htmlElement.setAttribute("data-theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      htmlElement.setAttribute("data-theme", "light");
    }

    // Сохраняем в localStorage
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }

    setThemeState(newTheme);
  };

  // Инициализируем тему при загрузке
  useEffect(() => {
    // Пытаемся загрузить сохранённую тему
    const saved = localStorage.getItem(storageKey) as Theme | null;
    if (saved) {
      applyTheme(saved);
    } else {
      applyTheme(defaultTheme);
    }
    setMounted(true);
  }, []);

  // Следим за изменением системной темы
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      applyTheme("system");
    };

    try {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } catch {
      // Fallback for older browsers
      return undefined;
    }
  }, [theme]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: applyTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme - Hook для управления темой
 * 
 * ```tsx
 * const { theme, setTheme } = useTheme();
 * 
 * <button onClick={() => setTheme("dark")}>Dark Mode</button>
 * ```
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
