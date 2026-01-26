"use client";

import { useState } from "react";
import { UsersKPI } from "@/components/admin/users/UsersKPI";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { UsersTable, User } from "@/components/admin/users/UsersTable";
import { UserViewModal } from "@/components/admin/users/UserViewModal";
import { UserEditModal } from "@/components/admin/users/UserEditModal";
import { UserDeleteDialog } from "@/components/admin/users/UserDeleteDialog";
import {
  useAdminUsers,
  useAdminUserDetails,
  useAdminUserActions,
  useAdminUsersStats,
  useAdminDeleteUser,
} from "@/hooks/useAdminUsers";
import { Info, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext"; // ✅ Для проверки роли super_admin

// ✅ 2026: Auth роли (без маппинга - backend уже использует правильные роли)
type UserRole = "customer" | "home_chef" | "chef_staff" | "admin" | "super_admin";

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const { user: currentUser, reloadMe } = useAuth(); // ✅ Для проверки роли и перезагрузки
  // API Integration
  const { users, meta, isLoading, filters, updateFilters, refetch } =
    useAdminUsers();
  const { stats, isLoading: isStatsLoading, refetch: refetchStats } = useAdminUsersStats();
  const { changeRole, changeStatus } = useAdminUserActions();
  const { deleteUser } = useAdminDeleteUser();

  // Modals
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { user: selectedUserDetails, isLoading: isUserLoading } =
    useAdminUserDetails(selectedUserId);

  // Convert AdminUserDetails to User for modal compatibility

  const selectedUser: User | null = selectedUserDetails
    ? {
        id: selectedUserDetails.id,
        name: selectedUserDetails.name,
        email: selectedUserDetails.email,
        role: selectedUserDetails.role as UserRole, // ✅ 2026: Напрямую используем роль из backend
        status: selectedUserDetails.status,
        joinedAt: selectedUserDetails.joinedAt,
        lastActiveAt: selectedUserDetails.lastActiveAt,
        phone: selectedUserDetails.phone,
        ordersCount: selectedUserDetails.stats?.ordersCount || 0,
        totalSpent: selectedUserDetails.stats?.totalSpent || 0,
      }
    : null;

  // Handlers
  const handleView = (user: User) => {
    setSelectedUserId(user.id);
    setIsViewModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUserId(user.id);
    setIsEditModalOpen(true);
  };

  const handleSave = async (userId: string, updates: Partial<User>) => {
    // Find original user to compare changes
    const originalUser = users.find((u) => u.id === userId);

    if (!originalUser) {
      toast.error(t.admin.users.notFound);
      return;
    }

    let success = false;

    // Check if role changed
    if (updates.role && originalUser.role !== updates.role) {
      // ✅ 2026: Отправляем роль напрямую (без маппинга)
      success = await changeRole(userId, updates.role as any);
      
      // 🔥 КЛЮЧЕВО: Если админ меняет СВОЮ роль
      if (success && userId === currentUser?.id) {
        console.log("[AdminUsersPage] 🔄 Admin changed own role, reloading user data");
        await reloadMe();
        
        // ✅ Используем resolveUserRoute для определения маршрута
        const { resolveUserRoute } = await import("@/lib/auth/resolveUserRoute");
        const newRoute = resolveUserRoute(currentUser);
        window.location.href = newRoute; // Hard redirect для полного обновления UI
      }
    }

    // Check if status changed
    if (updates.status && originalUser.status !== updates.status) {
      success = await changeStatus(userId, updates.status);
      
      // 🔥 КЛЮЧЕВО: Если админ меняет СВОЙ статус
      if (success && userId === currentUser?.id) {
        console.log("[AdminUsersPage] 🔄 Admin changed own status, reloading user data");
        await reloadMe();
        
        // ✅ Перенаправляем на правильный маршрут
        const { resolveUserRoute } = await import("@/lib/auth/resolveUserRoute");
        const newRoute = resolveUserRoute(currentUser);
        window.location.href = newRoute; // Hard redirect
      }
    }

    if (success) {
      setIsEditModalOpen(false);
      setSelectedUserId(null);
      refetch(); // Refresh users list
    }
  };

  const handleToggleBlock = async (user: User) => {
    const newStatus = user.status === "blocked" ? "active" : "blocked";
    const success = await changeStatus(user.id, newStatus);

    if (success) {
      refetch(); // Refresh to get server state
    }
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    const success = await deleteUser(userToDelete.id);
    
    if (success) {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      refetch(); // Refresh users list
      refetchStats(); // Refresh stats
      toast.success("Користувача успішно видалено");
    }
  };

  const handleExport = () => {
    toast.info(t.admin.users.export);
  };

  // Convert AdminUser[] to User[] for table compatibility
  const displayUsers: User[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole, // ✅ 2026: Напрямую используем роль из backend
    status: user.status,
    joinedAt: user.joinedAt,
    lastActiveAt: user.lastActiveAt,
    phone: user.phone,
    ordersCount: user.stats?.ordersCount || 0,
    totalSpent: user.stats?.totalSpent || 0,
  }));

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 pb-safe">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {t.admin.users.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          {t.admin.users.subtitle}
        </p>
      </div>

      {/* KPI */}
      <UsersKPI stats={stats} isLoading={isStatsLoading} />

      {/* Filters */}
      <UsersFilters
        searchQuery={filters.search}
        onSearchChange={(value) => updateFilters({ search: value })}
        statusFilter={filters.status === "all" ? "all" : filters.status}
        onStatusChange={(value) =>
          updateFilters({
            status: value as "all" | "active" | "blocked" | "pending",
          })
        }
        roleFilter={filters.role === "all" ? "all" : filters.role === "superadmin" ? "super_admin" : filters.role}
        onRoleChange={(value) => {
          // Map frontend role to backend filter format
          const backendRole = value === "super_admin" ? "superadmin" : value;
          updateFilters({
            role: backendRole as "all" | "user" | "admin" | "superadmin",
          });
        }}
        onExport={handleExport}
      />

      {/* Table */}
      {displayUsers.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Пользователи появятся после регистрации</h3>
            <p className="text-muted-foreground">
              Вы можете управлять доступами и ролями здесь
            </p>
          </CardContent>
        </Card>
      ) : (
        <UsersTable
          users={displayUsers}
          isLoading={isLoading}
          onView={handleView}
          onEdit={handleEdit}
          onToggleBlock={handleToggleBlock}
          onDelete={currentUser?.role === "super_admin" ? handleDelete : undefined}
        />
      )}

      {/* Info Block - Связь с другими модулями */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Связь с другими модулями
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Auth</strong> (роли / блокировки), <strong>Activity Log</strong> (действия пользователей), 
                <strong> Settings</strong> (политики доступа). Удаление пользователей запрещено — только soft-block.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Modal */}
      <UserViewModal
        user={selectedUser}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUserId(null);
        }}
      />

      {/* Edit Modal */}
      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onSave={handleSave}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUserId(null);
        }}
      />

      {/* Delete Dialog */}
      <UserDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        userName={userToDelete?.name || ""}
        userEmail={userToDelete?.email || ""}
      />
    </div>
  );
}
