/**
 * Пример компонента, использующего авторизацию
 */

'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { api } from '../utils/api';

/**
 * Компонент для использования где угодно в приложении
 * Показывает информацию о пользователе и предоставляет кнопку выхода
 */
export function UserMenu() {
  const { user, role, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
      >
        👤 {user.name}
        <span className="text-xs bg-indigo-800 px-2 py-1 rounded">
          {role === 'admin' ? '⚙️ Admin' : '👤 User'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
          <div className="p-4 border-b">
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition"
          >
            🚪 Выход
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Пример компонента, доступного только админам
 */
export function AdminPanel() {
  const { role } = useAuth();

  // Если пользователь не админ, не показываем панель
  if (role !== 'admin') {
    return null;
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
      <h3 className="font-bold text-purple-900 mb-2">⚙️ Администраторские функции</h3>
      <div className="space-y-2">
        <button className="w-full text-left px-3 py-2 bg-white hover:bg-purple-100 rounded transition">
          👥 Управление пользователями
        </button>
        <button className="w-full text-left px-3 py-2 bg-white hover:bg-purple-100 rounded transition">
          📊 Статистика
        </button>
        <button className="w-full text-left px-3 py-2 bg-white hover:bg-purple-100 rounded transition">
          🔧 Настройки
        </button>
      </div>
    </div>
  );
}

/**
 * Пример компонента с использованием API
 */
export function DataFetcher() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  const fetchData = async () => {
    if (!isAuthenticated) {
      setError('Требуется авторизация');
      return;
    }

    try {
      setLoading(true);
      setError('');
      // Токен подставляется автоматически
      const response = await api.get('/api/data');
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <button
        onClick={fetchData}
        disabled={loading || !isAuthenticated}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg"
      >
        {loading ? 'Загрузка...' : 'Загрузить данные'}
      </button>

      {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">{error}</div>}

      {data && (
        <div className="mt-4 p-3 bg-green-50 text-green-700 rounded">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
