"use client";

import { Eye, Edit, Shield, Ban, Unlock, MoreVertical, User as UserIcon, Crown } from "lucide-react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { motion } from "framer-motion";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  status: "active" | "blocked" | "pending"; // 🔥 Права пользователя
  joinedAt: string;
  lastActiveAt: string; // 🔥 Поведение (активность)
  phone?: string;
  ordersCount: number;
  totalSpent: number;
}

interface UserCardProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onToggleBlock: (user: User) => void;
  index: number;
}

// 📱 Mobile Card Component
function UserCard({ user, onView, onEdit, onToggleBlock, index }: UserCardProps) {
  const { t } = useLanguage();
  
  const getRoleBadge = (role: string) => {
    const variants = {
      user: { 
        label: t.admin.users.roles.user, 
        variant: "secondary" as const,
        icon: <UserIcon className="w-3 h-3 text-gray-600 dark:text-gray-400" />,
        tooltip: "Права доступа: обычный пользователь"
      },
      admin: { 
        label: t.admin.users.roles.admin, 
        variant: "default" as const,
        icon: <Shield className="w-3 h-3 text-blue-600 dark:text-blue-500" />,
        tooltip: "Права доступа: админ кухни / бизнеса"
      },
      super_admin: { 
        label: "👑 Super Admin", 
        variant: "destructive" as const,
        icon: <Crown className="w-3 h-3 text-purple-600 dark:text-purple-500" />,
        tooltip: "Права доступа: владелец платформы"
      },
    };
    return variants[role as keyof typeof variants] || variants.user;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { 
        label: t.admin.users.status.active, 
        variant: "default" as const,
        className: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      },
      blocked: { 
        label: t.admin.users.status.blocked, 
        variant: "destructive" as const,
        className: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      },
      pending: { 
        label: t.admin.users.status.pending, 
        variant: "secondary" as const,
        className: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
      },
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const formatLastActive = (lastActiveAt: string) => {
    if (!lastActiveAt) return t.admin.users.table.lastActive;
    
    const now = new Date();
    const lastActive = new Date(lastActiveAt);
    const diffMs = now.getTime() - lastActive.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'min' : 'mins'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    return lastActive.toLocaleDateString();
  };

  const roleBadge = getRoleBadge(user.role);
  const statusBadge = getStatusBadge(user.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4"
    >
      {/* Header: Avatar + Name + Actions */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
            {user.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
              className={user.status === "blocked" ? "text-green-600" : "text-red-600"}
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Badges: Role + Status */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={roleBadge.variant} className="text-xs flex items-center gap-1 cursor-help">
                {roleBadge.icon}
                {roleBadge.label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{roleBadge.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Badge variant={statusBadge.variant} className={`text-xs ${statusBadge.className}`}>
          {statusBadge.label}
        </Badge>
      </div>

      {/* Activity / Revenue */}
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div>
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            {t.admin.users.table.lastActive}
          </p>
          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mt-0.5">
            {formatLastActive(user.lastActiveAt)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Activity / Revenue</p>
          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mt-0.5">
            {user.ordersCount} заказов
          </p>
          <p className="text-xs font-semibold text-green-600 dark:text-green-400">
            ${user.totalSpent}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

interface UserRowProps {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onToggleBlock: (user: User) => void;
}

function UserRow({ user, onView, onEdit, onToggleBlock }: UserRowProps) {
  const { t } = useLanguage();
  
  const getRoleBadge = (role: string) => {
    const variants = {
      user: { 
        label: t.admin.users.roles.user, 
        variant: "secondary" as const,
        tooltip: "Права доступа: обычный пользователь"
      },
      admin: { 
        label: t.admin.users.roles.admin, 
        variant: "default" as const,
        tooltip: "Права доступа: админ кухни / бизнеса"
      },
      super_admin: { 
        label: "👑 Super Admin", 
        variant: "destructive" as const,
        tooltip: "Права доступа: владелец платформы"
      },
    };
    return variants[role as keyof typeof variants] || variants.user;
  };

  const getStatusBadge = (status: string) => {
    // 🔥 Status = права пользователя (один источник истины)
    const variants = {
      active: { 
        label: t.admin.users.status.active, 
        variant: "default" as const,
        className: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
      },
      blocked: { 
        label: t.admin.users.status.blocked, 
        variant: "destructive" as const,
        className: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      },
      pending: { 
        label: t.admin.users.status.pending, 
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={roleBadge.variant} className="cursor-help">
                {roleBadge.label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{roleBadge.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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

      {/* Activity / Revenue */}
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="text-sm">{user.ordersCount} заказов</span>
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
 * Mobile: cards (<768px)
 * Desktop: table (≥768px)
 */
export function UsersTable({
  users,
  isLoading,
  onView,
  onEdit,
  onToggleBlock,
}: UsersTableProps) {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {/* Mobile skeleton */}
        <div className="md:hidden space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border p-3">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
        
        {/* Desktop skeleton */}
        <div className="hidden md:block rounded-lg border bg-card">
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
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 sm:p-12 text-center">
        <p className="text-sm sm:text-base text-muted-foreground mb-2">
          {t.admin.users.noResults}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Try changing filters or search query
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 📱 Mobile: Card View */}
      <div className="md:hidden space-y-3">
        {users.map((user, index) => (
          <UserCard
            key={user.id}
            user={user}
            onView={onView}
            onEdit={onEdit}
            onToggleBlock={onToggleBlock}
            index={index}
          />
        ))}
      </div>

      {/* 🖥️ Desktop: Table View */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.users.table.user}</TableHead>
              <TableHead>{t.admin.users.table.role}</TableHead>
              <TableHead>{t.admin.users.table.status}</TableHead>
              <TableHead>{t.admin.users.table.lastActive}</TableHead>
              <TableHead>Activity / Revenue</TableHead>
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
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
