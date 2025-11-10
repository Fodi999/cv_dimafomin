"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { adminApi } from "@/lib/api";
import { Search, Trash2, Shield } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  active: boolean;
}

export default function UsersPage() {
  const { user } = useUser();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No authentication token");
          return;
        }

        const data = await adminApi.getUsers(token);
        setUsers(Array.isArray(data) ? data : (data as any).users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      await adminApi.deleteUser(userId, token);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      await adminApi.updateUserRole(userId, newRole, token);
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update user role");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-4">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Управление пользователями
        </h1>
        <p className="text-foreground/60">
          Всего пользователей: {users.length}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
        <input
          type="text"
          placeholder="Поиск по имени или email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-foreground/40"
        />
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/10 border-b border-border">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  Имя
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  Email
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  Роль
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  Статус
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  Регистрация
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-secondary/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <p className="font-medium text-foreground">
                      {u.name}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-foreground/70">
                    {u.email}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                      className="px-3 py-1 rounded-lg bg-secondary/20 text-foreground text-sm font-medium border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.active
                          ? "bg-primary/10 text-primary"
                          : "bg-foreground/10 text-foreground/60"
                      }`}
                    >
                      {u.active ? "Активен" : "Неактивен"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground/70">
                    {new Date(u.createdAt).toLocaleDateString("uk-UA")}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">
              Пользователи не найдены
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
