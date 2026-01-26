"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Lock, UserCheck } from "lucide-react";

/**
 * Roles & Access Page - RBAC Management
 * 
 * Manages:
 * - User roles (admin, superadmin, moderator, support)
 * - Access permissions
 * - Role assignments
 */
export default function RolesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          Роли и доступы
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Управление ролями пользователей и правами доступа
        </p>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Super Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Полный доступ</div>
            <p className="text-xs text-muted-foreground mt-1">
              Все функции системы
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Администратор</div>
            <p className="text-xs text-muted-foreground mt-1">
              Управление контентом и операциями
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Moderator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Модератор</div>
            <p className="text-xs text-muted-foreground mt-1">
              Модерация контента
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Поддержка</div>
            <p className="text-xs text-muted-foreground mt-1">
              Помощь пользователям
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder Content */}
      <Card>
        <CardHeader>
          <CardTitle>Управление ролями</CardTitle>
          <CardDescription>
            Функционал управления ролями будет добавлен в следующих версиях
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Здесь будет интерфейс для назначения ролей пользователям и настройки прав доступа.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
