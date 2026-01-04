"use client";

import { useState } from "react";
import { UsersKPI } from "@/components/admin/users/UsersKPI";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { UsersTable, User } from "@/components/admin/users/UsersTable";
import { UserViewModal } from "@/components/admin/users/UserViewModal";
import { UserEditModal } from "@/components/admin/users/UserEditModal";

// Mock data (TODO: Replace with API)
const mockUsers: User[] = [
  {
    id: "1",
    name: "Олександр Коваленко",
    email: "alex.kovalenko@example.com",
    role: "admin",
    status: "active",
    joinedAt: "2024-01-15T10:00:00Z",
    lastActiveAt: "2024-06-20T14:30:00Z",
    phone: "+380501234567",
    ordersCount: 45,
    totalSpent: 1250,
  },
  {
    id: "2",
    name: "Марія Шевченко",
    email: "maria.shevchenko@example.com",
    role: "premium",
    status: "active",
    joinedAt: "2024-02-20T12:00:00Z",
    lastActiveAt: "2024-06-21T09:15:00Z",
    phone: "+380502345678",
    ordersCount: 32,
    totalSpent: 890,
  },
  {
    id: "3",
    name: "Іван Петренко",
    email: "ivan.petrenko@example.com",
    role: "user",
    status: "active",
    joinedAt: "2024-03-10T08:00:00Z",
    lastActiveAt: "2024-06-15T16:45:00Z",
    ordersCount: 12,
    totalSpent: 340,
  },
  {
    id: "4",
    name: "Анна Мельник",
    email: "anna.melnyk@example.com",
    role: "premium",
    status: "inactive",
    joinedAt: "2024-01-05T14:00:00Z",
    lastActiveAt: "2024-05-30T11:20:00Z",
    phone: "+380503456789",
    ordersCount: 28,
    totalSpent: 720,
  },
  {
    id: "5",
    name: "Дмитро Бойко",
    email: "dmitro.boyko@example.com",
    role: "user",
    status: "blocked",
    joinedAt: "2024-04-12T09:00:00Z",
    lastActiveAt: "2024-06-01T13:00:00Z",
    ordersCount: 3,
    totalSpent: 85,
  },
];

export default function AdminUsersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Modals
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Handlers
  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSave = (userId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      )
    );
    // TODO: Call API to save changes
    console.log("Saving user updates:", userId, updates);
  };

  const handleToggleBlock = (user: User) => {
    const newStatus = user.status === "blocked" ? "active" : "blocked";
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, status: newStatus } : u
      )
    );
    // TODO: Call API
    console.log(`User ${user.id} status changed to ${newStatus}`);
  };

  const handleExport = () => {
    // TODO: Export to CSV
    console.log("Exporting users to CSV...");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Управління користувачами
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Перегляд, редагування та модерація користувачів системи
          </p>
        </div>

        {/* KPI Cards */}
        <UsersKPI />

        {/* Filters */}
        <UsersFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
          onExport={handleExport}
        />

        {/* Table */}
        <UsersTable
          users={filteredUsers}
          isLoading={isLoading}
          onView={handleView}
          onEdit={handleEdit}
          onToggleBlock={handleToggleBlock}
        />

        {/* Modals */}
        <UserViewModal
          user={selectedUser}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}
        />

        <UserEditModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
