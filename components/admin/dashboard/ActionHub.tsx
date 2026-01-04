"use client";

import Link from "next/link";
import { ArrowRight, Users, Shield, Activity, ChefHat, Carrot, BookOpen, Languages, Brain, Zap, Settings, Lock } from "lucide-react";

/**
 * Action Hub - быстрые переходы
 * Визуальный дубликат меню, но:
 * - Быстрее
 * - Понятнее
 * - Без вложенности
 */

interface ActionGroup {
  title: string;
  icon: React.ReactNode;
  color: string;
  links: Array<{ label: string; href: string }>;
}

function ActionGroupCard({ title, icon, color, links }: ActionGroup) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>

      <div className="space-y-2">
        {links.map((link, idx) => (
          <Link
            key={idx}
            href={link.href}
            className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors group"
          >
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {link.label}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ActionHub() {
  const groups: ActionGroup[] = [
    {
      title: "👥 Пользователи",
      icon: <Users className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-50 dark:bg-blue-900/20",
      links: [
        { label: "Пользователи", href: "/admin/users" },
        { label: "Роли и доступы", href: "/admin/users/roles" },
        { label: "Журнал активности", href: "/admin/activity-log" },
      ],
    },
    {
      title: "🍽️ Контент",
      icon: <BookOpen className="w-5 h-5 text-purple-600" />,
      color: "bg-purple-50 dark:bg-purple-900/20",
      links: [
        { label: "Каталог", href: "/admin/catalog" },
        { label: "Курсы", href: "/admin/courses" },
        { label: "Локализация", href: "/admin/localization" },
      ],
    },
    {
      title: "🤖 AI",
      icon: <Brain className="w-5 h-5 text-cyan-600" />,
      color: "bg-cyan-50 dark:bg-cyan-900/20",
      links: [
        { label: "Сценарии", href: "/admin/ai-scenarios" },
        { label: "Промпты", href: "/admin/prompts" },
      ],
    },
    {
      title: "⚙️ Настройки",
      icon: <Settings className="w-5 h-5 text-gray-600" />,
      color: "bg-gray-50 dark:bg-gray-700/20",
      links: [
        { label: "Общие", href: "/admin/settings" },
        { label: "Безопасность", href: "/admin/settings/security" },
      ],
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        🧭 Быстрые переходы
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {groups.map((group, idx) => (
          <ActionGroupCard key={idx} {...group} />
        ))}
      </div>
    </div>
  );
}
