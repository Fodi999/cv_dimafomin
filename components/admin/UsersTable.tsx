"use client";

import { motion } from "framer-motion";
import { Trash2, Edit2, Shield, User } from "lucide-react";
import { useState } from "react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "instructor" | "student";
  level: number;
  createdAt: string;
}

interface UsersTableProps {
  users: AdminUser[];
  onUpdateRole?: (userId: string, newRole: string) => void;
  onDeleteUser?: (userId: string) => void;
}

export function UsersTable({
  users,
  onUpdateRole,
  onDeleteUser,
}: UsersTableProps) {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const roleConfig: Record<string, { color: string; label: string }> = {
    admin: { color: "bg-red-100 text-red-700", label: "👑 Админ" },
    instructor: { color: "bg-blue-100 text-blue-700", label: "🎓 Инструктор" },
    student: { color: "bg-green-100 text-green-700", label: "👤 Студент" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
          👥 Пользователи
        </h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Имя
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Роль
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">
                Уровень
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user, idx) => {
              const config = roleConfig[user.role] || roleConfig.student;

              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
                      {config.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    Уровень {user.level}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Изменить роль"
                      >
                        <Shield className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDeleteUser?.(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Удалить пользователя"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">Пользователи не найдены</p>
        </div>
      )}
    </motion.div>
  );
}
