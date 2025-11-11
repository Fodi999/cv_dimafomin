"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { adminApi } from "@/src/lib/admin-api";
import { Search, Trash2, Shield, UserPlus, Eye, AlertCircle, Users, Mail, CheckCircle, Activity, Calendar, Settings } from "lucide-react";

interface AdminUser {
  id: string;
  name?: string;
  email?: string;
  role?: 'student' | 'instructor' | 'admin';
  level?: number;
  xp?: number;
  chefTokens?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function UsersPage() {
  const { user } = useUser();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[UsersPage] Загрузка пользователей...');
        
        const data = await adminApi.getUsers();
        console.log('[UsersPage] Получены пользователи:', data);
        if (Array.isArray(data) && data.length > 0) {
          console.log('[UsersPage] Первый пользователь структура:', JSON.stringify(data[0], null, 2));
        }
        
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('[UsersPage] Ошибка при загрузке пользователей:', err);
        setError(err instanceof Error ? err.message : "Ошибка при загрузке пользователей");
        
        // Mock-данные для тестирования
        setUsers([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'student',
            level: 5,
            xp: 2450,
            chefTokens: 1250,
            createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'instructor',
            level: 12,
            xp: 5890,
            chefTokens: 3450,
            createdAt: new Date(Date.now() - 60*24*60*60*1000).toISOString(),
          },
          {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            role: 'student',
            level: 3,
            xp: 890,
            chefTokens: 450,
            createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      (u.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить пользователя "${userName}"?`)) {
      return;
    }

    try {
      setActionInProgress(true);
      console.log('[UsersPage] Удаление пользователя:', userId);
      
      await adminApi.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      console.log('[UsersPage] ✅ Пользователь удалён');
    } catch (err) {
      console.error('[UsersPage] ❌ Ошибка при удалении:', err);
      alert('Ошибка при удалении пользователя: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
    } finally {
      setActionInProgress(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'student' | 'instructor' | 'admin') => {
    try {
      setActionInProgress(true);
      console.log('[UsersPage] Обновление роли:', userId, newRole);
      
      await adminApi.updateUserRole(userId, newRole);
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
      console.log('[UsersPage] ✅ Роль обновлена');
    } catch (err) {
      console.error('[UsersPage] ❌ Ошибка при обновлении роли:', err);
      alert('Ошибка при обновлении роли: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
    } finally {
      setActionInProgress(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'instructor':
        return 'bg-blue-100 text-blue-700';
      case 'student':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleEmoji = (role: string) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'instructor':
        return '👨‍🏫';
      case 'student':
        return '👤';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white border border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
              <Users className="w-6 sm:w-8 h-6 sm:h-8 flex-shrink-0" /> 
              <span className="truncate">Пользователи</span>
            </h1>
            <p className="text-xs sm:text-base text-slate-300">
              Всего: <span className="font-bold">{users.length}</span> | 
              Найдено: <span className="font-bold">{filteredUsers.length}</span>
            </p>
          </div>
          <button className="px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition flex items-center gap-2 text-sm sm:text-base whitespace-nowrap flex-shrink-0">
            <UserPlus className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden sm:inline">Добавить</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-red-900 text-sm">Ошибка при загрузке</p>
            <p className="text-xs text-red-700 mt-1">Используются тестовые данные</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-foreground/40 flex-shrink-0" />
        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-foreground/40 text-sm sm:text-base"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Имя</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Роль</th>
                <th className="px-4 py-3 text-left">Статус</th>
                <th className="px-4 py-3 text-left">Регистрация</th>
                <th className="px-4 py-3 text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {u.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs sm:text-sm">
                    {u.email || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role || 'student'}
                      onChange={(e) => handleUpdateRole(u.id, e.target.value as 'student' | 'instructor' | 'admin')}
                      disabled={actionInProgress}
                      className={`px-3 py-1 rounded text-xs sm:text-sm font-medium border focus:outline-none cursor-pointer disabled:opacity-50 ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700 border-red-300' :
                        u.role === 'instructor' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                        'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-green-600 font-medium text-xs sm:text-sm">
                    ✓
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs sm:text-sm">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("ru-RU") : "—"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDeleteUser(u.id, u.name || 'Пользователь')}
                      disabled={actionInProgress}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition disabled:opacity-50 inline-flex"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Eye className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <p className="text-slate-600 font-semibold">Пользователи не найдены</p>
          </div>
        )}
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-card border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 truncate">{u.name || '—'}</p>
                  <p className="text-xs text-slate-600 truncate">{u.email || '—'}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(u.id, u.name || 'Пользователь')}
                  disabled={actionInProgress}
                  className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition flex-shrink-0"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={u.role || 'student'}
                  onChange={(e) => handleUpdateRole(u.id, e.target.value as 'student' | 'instructor' | 'admin')}
                  disabled={actionInProgress}
                  className={`px-2 py-1 rounded text-xs font-medium border focus:outline-none cursor-pointer disabled:opacity-50 flex-1 min-w-[100px] ${
                    u.role === 'admin' ? 'bg-red-100 text-red-700 border-red-300' :
                    u.role === 'instructor' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                    'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium whitespace-nowrap">
                  ✓ Активен
                </span>
              </div>

              {u.createdAt && (
                <p className="text-xs text-slate-600">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {new Date(u.createdAt).toLocaleDateString("ru-RU")}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <Eye className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <p className="text-slate-600 font-semibold">Нет результатов</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
          <p className="text-slate-600 text-xs md:text-sm font-semibold mb-1 md:mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" /> Студентов
          </p>
          <p className="text-2xl md:text-3xl font-bold text-slate-900">
            {users.filter(u => u.role === 'student').length}
          </p>
          <p className="text-xs text-slate-500 mt-1 md:mt-2">
            {users.length > 0 ? ((users.filter(u => u.role === 'student').length / users.length) * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
          <p className="text-slate-600 text-xs md:text-sm font-semibold mb-1 md:mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Инструкторов
          </p>
          <p className="text-2xl md:text-3xl font-bold text-slate-900">
            {users.filter(u => u.role === 'instructor').length}
          </p>
          <p className="text-xs text-slate-500 mt-1 md:mt-2">
            {users.length > 0 ? ((users.filter(u => u.role === 'instructor').length / users.length) * 100).toFixed(1) : 0}%
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
          <p className="text-slate-600 text-xs md:text-sm font-semibold mb-1 md:mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Администраторов
          </p>
          <p className="text-2xl md:text-3xl font-bold text-slate-900">
            {users.filter(u => u.role === 'admin').length}
          </p>
          <p className="text-xs text-slate-500 mt-1 md:mt-2">
            {users.length > 0 ? ((users.filter(u => u.role === 'admin').length / users.length) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
}
