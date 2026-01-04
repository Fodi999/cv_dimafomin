"use client";

import { Eye, Edit, Shield, Ban, Unlock, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "premium" | "admin";
  status: "active" | "inactive" | "blocked";
  joinedAt: string;
  lastActiveAt: string;
  phone?: string;
  ordersCount: number;
  totalSpent: number;
}

interface UserRowProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onToggleBlock: (user: User) => void;
}

function UserRow({ user, onView, onEdit, onToggleBlock }: UserRowProps) {
  const getRoleBadge = (role: string) => {
    const variants = {
      user: { label: "Користувач", variant: "secondary" as const },
      premium: { label: "✨ Преміум", variant: "default" as const },
      admin: { label: "🛡️ Адмін", variant: "destructive" as const },
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
    <TableRow>
      {/* Avatar + Name */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{user.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Role */}
      <TableCell>
        <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
      </TableCell>

      {/* Status */}
      <TableCell>
        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
      </TableCell>

      {/* Stats */}
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="text-sm">{user.ordersCount} замовлень</span>
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            ${user.totalSpent}
          </span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(user)}>
              <Eye className="w-4 h-4 mr-2" />
              Переглянути
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Edit className="w-4 h-4 mr-2" />
              Редагувати
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Shield className="w-4 h-4 mr-2" />
              Змінити роль
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onToggleBlock(user)}
              className={
                user.status === "blocked" ? "text-green-600" : "text-red-600"
              }
            >
              {user.status === "blocked" ? (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Розблокувати
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Заблокувати
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onToggleBlock: (user: User) => void;
}

/**
 * Users table with shadcn/ui components
 * Desktop: table
 * Mobile: cards (TODO)
 */
export function UsersTable({
  users,
  isLoading,
  onView,
  onEdit,
  onToggleBlock,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-12 text-center">
        <p className="text-muted-foreground mb-2">Користувачів не знайдено</p>
        <p className="text-sm text-muted-foreground">
          Спробуйте змінити фільтри або пошуковий запит
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Користувач</TableHead>
            <TableHead>Роль</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Статистика</TableHead>
            <TableHead className="text-right">Дії</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onView={onView}
              onEdit={onEdit}
              onToggleBlock={onToggleBlock}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
