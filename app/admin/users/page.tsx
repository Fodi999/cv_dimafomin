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
import { toast } from "sonner";

export default function AdminUsersPage() {
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
        role: selectedUserDetails.role,
        status: selectedUserDetails.status,
        joinedAt: selectedUserDetails.joinedAt,
        lastActiveAt: selectedUserDetails.lastActiveAt,
        phone: selectedUserDetails.phone,
        ordersCount: selectedUserDetails.stats.ordersCount,
        totalSpent: selectedUserDetails.stats.totalSpent,
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
      toast.error("Користувача не знайдено");
      return;
    }

    let success = false;

    // Check if role changed
    if (updates.role && originalUser.role !== updates.role) {
      success = await changeRole(userId, updates.role);
    }

    // Check if status changed
    if (updates.status && originalUser.status !== updates.status) {
      success = await changeStatus(userId, updates.status);
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
      refetch(); // Обновить список пользователей
      refetchStats(); // 🔥 Обновить статистику (KPI)
    }
  };

  const handleExport = () => {
    toast.info("Експорт користувачів (TODO: реалізація)");
  };

  // Convert AdminUser[] to User[] for table compatibility
  const displayUsers: User[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    joinedAt: user.joinedAt,
    lastActiveAt: user.lastActiveAt,
    phone: user.phone,
    ordersCount: user.stats?.ordersCount || 0,
    totalSpent: user.stats?.totalSpent || 0,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Управління користувачами
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Dashboard → що відбувається, Users → ким керуємо
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
        roleFilter={filters.role === "all" ? "all" : filters.role}
        onRoleChange={(value) =>
          updateFilters({
            role: value as "all" | "user" | "admin" | "superadmin",
          })
        }
        onExport={handleExport}
      />

      {/* Table */}
      <UsersTable
        users={displayUsers}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onToggleBlock={handleToggleBlock}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Dialog */}
      {userToDelete && (
        <UserDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
          userName={userToDelete.name}
          userEmail={userToDelete.email}
        />
      )}

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
    </div>
  );
}
