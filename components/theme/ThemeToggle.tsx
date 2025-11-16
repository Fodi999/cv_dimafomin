"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";

/**
 * ThemeToggle - Компонент для переключения темы
 * 
 * Примеры:
 * ```tsx
 * // Простой toggle между light и dark
 * <ThemeToggle />
 * 
 * // С меню выбора
 * <ThemeTogglMenu />
 * ```
 */

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Предотвращаем hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        disabled
      />
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </Button>
  );
}

/**
 * ThemeToggleMenu - Компонент для выбора темы из меню
 * 
 * Отображает все доступные опции: System, Light, Dark
 */

export function ThemeToggleMenu() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themes: Array<{ value: "system" | "light" | "dark"; label: string; icon: React.ReactNode }> = [
    {
      value: "system",
      label: "System",
      icon: <Sun className="size-4" />,
    },
    {
      value: "light",
      label: "Light",
      icon: <Sun className="size-4" />,
    },
    {
      value: "dark",
      label: "Dark",
      icon: <Moon className="size-4" />,
    },
  ];

  return (
    <div className="flex gap-1 p-1 bg-bg-muted rounded-lg dark:bg-bg-muted/50">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
            transition-all duration-200
            ${
              theme === t.value
                ? "bg-primary text-white shadow-md"
                : "text-text-secondary hover:bg-primary/10 dark:hover:bg-primary/20"
            }
          `}
          title={`Switch to ${t.label} theme`}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Примеры использования:
 * 
 * // В Navigation компоненте:
 * import { ThemeToggle } from "@/components/theme/ThemeToggle";
 * 
 * export function Navigation() {
 *   return (
 *     <nav className="flex items-center justify-between p-4">
 *       <span>My App</span>
 *       <ThemeToggle />
 *     </nav>
 *   );
 * }
 * 
 * // Или с полным меню:
 * <ThemeToggleMenu />
 */
