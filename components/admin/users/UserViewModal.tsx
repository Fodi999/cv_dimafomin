"use client";

import { User, Mail, Phone, Calendar, Clock, Shield } from "lucide-react";
import { User as UserType } from "./UsersTable";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface UserViewModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserViewModal({
  user,
  isOpen,
  onClose,
}: UserViewModalProps) {
  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Щойно";
    if (diffInHours < 24) return `${diffInHours} год. тому`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} дн. тому`;
    return formatDate(dateString);
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      user: { label: "👤 Користувач", variant: "secondary" as const },
      premium: { label: "✨ Преміум", variant: "default" as const },
      admin: { label: "🛡️ Адміністратор", variant: "destructive" as const },
    };
    return variants[role as keyof typeof variants] || variants.user;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { label: "Активний", variant: "default" as const },
      inactive: { label: "Неактивний", variant: "secondary" as const },
      blocked: { label: "Заблокований", variant: "destructive" as const },
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const roleBadge = getRoleBadge(user.role);
  const statusBadge = getStatusBadge(user.status);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto w-full sm:max-w-md">
        <div className="px-6 pt-6">
          <SheetHeader>
            <SheetTitle>Перегляд користувача</SheetTitle>
          </SheetHeader>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Main Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Основна інформація
            </h4>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Роль</p>
                  <Badge variant={roleBadge.variant} className="mt-1">
                    {roleBadge.label}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div
                  className={`w-3 h-3 rounded-full ${
                    user.status === "active"
                      ? "bg-green-500"
                      : user.status === "blocked"
                        ? "bg-red-500"
                        : "bg-gray-400"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Статус</p>
                  <Badge variant={statusBadge.variant} className="mt-1">
                    {statusBadge.label}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Приєднався</p>
                  <p className="text-sm font-medium mt-1">
                    {formatDate(user.joinedAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    Остання активність
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {getRelativeTime(user.lastActiveAt)}
                  </p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Телефон</p>
                    <p className="text-sm font-medium mt-1">{user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Статистика
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                  Замовлень
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                  {user.ordersCount}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                  Витрачено
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                  ${user.totalSpent}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
