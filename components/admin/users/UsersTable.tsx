"use client";

import { Eye, Edit, Shield, Ban, Unlock, MoreVertical, Trash2 } from "lucide-react";
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
import { useLanguage } from "@/contexts/LanguageContext";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "premium" | "admin";
  status: "active" | "blocked" | "pending"; // 🔥 Права пользователя
  joinedAt: string;
  lastActiveAt: string; // 🔥 Поведение (активность)
  phone?: string;
  ordersCount: number;
  totalSpent: number;
}

interface UserRowProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onToggleBlock: (user: User) => void;
  onDelete: (user: User) => void;
}

function UserRow({ user, onView, onEdit, onToggleBlock, onDelete }: UserRowProps) {
  const { t } = useLanguage();
  
  const getRoleBadge = (role: string) => {
    const variants = {
      user: { label: t.admin.users.roles.user, variant: "secondary" as const },
      premium: { label: t.admin.users.roles.premium, variant: "default" as const },
      admin: { label: t.admin.users.roles.admin, variant: "destructive" as const },
    };
    return variants[role as keyof typeof variants] || variants.user;
  };

  const getStatusBadge = (status: string) => {
    // 🔥 Status = права пользователя (один источник истины)
    const variants = {
      active: { 
        label: `🟢 ${t.admin.users.status.active}`, 
        variant: "default" as const,
        className: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      },
      blocked: { 
        label: `🔴 ${t.admin.users.status.blocked}`, 
        variant: "destructive" as const,
        className: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      },
      pending: { 
        label: `🟡 ${t.admin.users.status.pending}`, 
        variant: "secondary" as const,
        className: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
      },
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  // 🔥 Форматирование времени активности (НЕ статус!)
  const formatLastActive = (lastActiveAt: string) => {
    if (!lastActiveAt) return t.admin.users.table.lastActive;
    
    const now = new Date();
    const lastActive = new Date(lastActiveAt);
    const diffMs = now.getTime() - lastActive.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    // Translate time units based on language
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    return lastActive.toLocaleDateString();
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

      {/* Status - права пользователя */}
      <TableCell>
        <Badge 
          variant={statusBadge.variant}
          className={statusBadge.className}
        >
          {statusBadge.label}
        </Badge>
      </TableCell>

      {/* Last Activity - поведение (НЕ статус!) */}
      <TableCell>
        <div className="text-sm text-muted-foreground">
          {formatLastActive(user.lastActiveAt)}
        </div>
      </TableCell>

      {/* Stats */}
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="text-sm">{user.ordersCount} {t.admin.users.table.actions}</span>
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
              {t.admin.users.actions.view}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Edit className="w-4 h-4 mr-2" />
              {t.admin.users.actions.edit}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Shield className="w-4 h-4 mr-2" />
              {t.admin.users.table.role}
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
                  Unblock
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Block
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {t.admin.users.actions.delete}
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
  onDelete: (user: User) => void;
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
  onDelete,
}: UsersTableProps) {
  const { t } = useLanguage();
  
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
        <p className="text-muted-foreground mb-2">{t.admin.users.noResults}</p>
        <p className="text-sm text-muted-foreground">
          Try changing filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.admin.users.table.user}</TableHead>
            <TableHead>{t.admin.users.table.role}</TableHead>
            <TableHead>{t.admin.users.table.status}</TableHead>
            <TableHead>{t.admin.users.table.lastActive}</TableHead>
            <TableHead>Stats</TableHead>
            <TableHead className="text-right">{t.admin.users.table.actions}</TableHead>
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
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
