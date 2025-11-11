'use client';

import { useAuth } from '../../../src/contexts/AuthContext';
import { withAuth } from '../../../src/components/withAuth';
import { useRouter } from 'next/navigation';

function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">⚙️ Администраторская панель</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Выход
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Карточка администратора */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Администратор</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Имя</p>
                <p className="text-lg font-semibold text-gray-900">{user?.name || 'Admin'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Роль</p>
                <p className="text-lg font-semibold text-purple-600">🔐 Администратор</p>
              </div>
            </div>
          </div>

          {/* Статистика пользователей */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-sm font-semibold mb-2 opacity-90">Всего пользователей</h3>
            <p className="text-4xl font-bold">1,234</p>
            <p className="text-sm mt-2 opacity-75">↑ 12% за этот месяц</p>
          </div>

          {/* Статистика заказов */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-sm font-semibold mb-2 opacity-90">Активные заказы</h3>
            <p className="text-4xl font-bold">567</p>
            <p className="text-sm mt-2 opacity-75">↑ 23% за этот месяц</p>
          </div>

          {/* Статистика доходов */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-sm font-semibold mb-2 opacity-90">Общий доход</h3>
            <p className="text-4xl font-bold">$89K</p>
            <p className="text-sm mt-2 opacity-75">↑ 18% за этот месяц</p>
          </div>
        </div>

        {/* Управление */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Управление системой</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-6 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition text-left">
              <h3 className="font-bold text-gray-900 text-lg">👥 Пользователи</h3>
              <p className="text-sm text-gray-600 mt-2">Управление учетными записями и ролями</p>
            </button>

            <button className="p-6 bg-green-50 hover:bg-green-100 rounded-lg transition text-left">
              <h3 className="font-bold text-gray-900 text-lg">📦 Заказы</h3>
              <p className="text-sm text-gray-600 mt-2">Просмотр и управление заказами</p>
            </button>

            <button className="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-left">
              <h3 className="font-bold text-gray-900 text-lg">📊 Отчёты</h3>
              <p className="text-sm text-gray-600 mt-2">Аналитика и статистика</p>
            </button>

            <button className="p-6 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition text-left">
              <h3 className="font-bold text-gray-900 text-lg">⚙️ Настройки</h3>
              <p className="text-sm text-gray-600 mt-2">Конфигурация системы</p>
            </button>

            <button className="p-6 bg-red-50 hover:bg-red-100 rounded-lg transition text-left">
              <h3 className="font-bold text-gray-900 text-lg">🔔 Уведомления</h3>
              <p className="text-sm text-gray-600 mt-2">Управление оповещениями</p>
            </button>

            <button className="p-6 bg-purple-50 hover:bg-purple-100 rounded-lg transition text-left">
              <h3 className="font-bold text-gray-900 text-lg">🛡️ Безопасность</h3>
              <p className="text-sm text-gray-600 mt-2">Журналы и доступ</p>
            </button>
          </div>
        </div>

        {/* Последняя активность */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">📝 Последняя активность</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Новый пользователь зарегистрирован</p>
                <p className="text-sm text-gray-600">john@example.com</p>
              </div>
              <span className="text-sm text-gray-500">5 минут назад</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Новый заказ создан</p>
                <p className="text-sm text-gray-600">Заказ #12345 на сумму $199</p>
              </div>
              <span className="text-sm text-gray-500">15 минут назад</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Пользователь изменил профиль</p>
                <p className="text-sm text-gray-600">jane@example.com</p>
              </div>
              <span className="text-sm text-gray-500">1 час назад</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Экспортируем с HOC для защиты по ролям (только админ)
export default withAuth(AdminDashboardPage, { requiredRole: 'admin' });
