'use client';

import { useAuth } from '../../../src/contexts/AuthContext';
import { withAuth } from '../../../src/components/withAuth';
import { useRouter } from 'next/navigation';

function UserDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Выход
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Профиль */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Ваш профиль</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Имя</p>
                <p className="text-lg font-semibold text-gray-900">{user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Роль</p>
                <p className="text-lg font-semibold text-blue-600">👤 Пользователь</p>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Статистика</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Активные заказы</span>
                <span className="font-bold text-indigo-600">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Завершенные заказы</span>
                <span className="font-bold text-green-600">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Потрачено</span>
                <span className="font-bold text-red-600">$0</span>
              </div>
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔗 Навигация</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition">
                📦 Мои заказы
              </button>
              <button className="w-full text-left px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition">
                ❤️ Избранное
              </button>
              <button className="w-full text-left px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition">
                ⚙️ Настройки
              </button>
            </div>
          </div>
        </div>

        {/* Секция с контентом */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Добро пожаловать! 👋</h2>
          <p className="text-gray-600 leading-relaxed">
            Это личный кабинет пользователя. Здесь вы можете управлять своими заказами, 
            просматривать историю покупок и менять настройки аккаунта.
          </p>
          <p className="text-gray-600 mt-4 leading-relaxed">
            У вас есть доступ только к функциям пользователя. Администраторы имеют доступ 
            к дополнительной панели управления.
          </p>
        </div>
      </main>
    </div>
  );
}

// Экспортируем с HOC для защиты по ролям
export default withAuth(UserDashboardPage, { requiredRole: 'user' });
