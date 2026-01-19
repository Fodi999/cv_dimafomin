"use client";

import Link from "next/link";
import { ArrowRight, Users, Shield, Activity, ChefHat, Carrot, BookOpen, Languages, Brain, Zap, Settings, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
    <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-xl transition-all duration-300">
      {/* Decorative background */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-xl shadow-lg ${color}`}>
            {icon}
          </div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">{title}</h3>
        </div>

        <div className="space-y-0.5">
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="flex items-center justify-between px-3 py-2 hover:bg-primary/5 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 group border border-transparent hover:border-primary/20"
            >
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary">
                {link.label}
              </span>
              <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-primary transition-all group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ActionHub() {
  const { t } = useLanguage();
  
  const groups: ActionGroup[] = [
    {
      title: t.admin.dashboard.actionHub.users.title,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      color: "bg-blue-50 dark:bg-blue-900/20",
      links: [
        { label: t.admin.dashboard.actionHub.users.viewAll, href: "/admin/users" },
        { label: t.admin.dashboard.actionHub.users.activity, href: "/admin/activity-log" },
      ],
    },
    {
      title: t.admin.dashboard.actionHub.content.title,
      icon: <BookOpen className="w-5 h-5 text-purple-600" />,
      color: "bg-purple-50 dark:bg-purple-900/20",
      links: [
        { label: t.admin.dashboard.actionHub.content.recipes, href: "/admin/catalog/recipes-list" },
        { label: t.admin.dashboard.actionHub.content.ingredients, href: "/admin/catalog/products" },
      ],
    },
    {
      title: t.admin.dashboard.actionHub.system.title,
      icon: <Settings className="w-5 h-5 text-gray-600" />,
      color: "bg-gray-50 dark:bg-gray-700/20",
      links: [
        { label: t.admin.dashboard.actionHub.system.settings, href: "/admin/settings" },
      ],
    },
  ];

  return (
    <div>
      <div className="mb-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {t.admin.dashboard.actionHub.title}
        </h2>
        <p className="text-xs text-muted-foreground">
          Szybki dostęp do kluczowych funkcji
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {groups.map((group, idx) => (
          <ActionGroupCard key={idx} {...group} />
        ))}
      </div>
    </div>
  );
}
