'use client';

import { useAuth } from '@/src/contexts/AuthContext';
import { withAuth } from '@/src/components/withAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'recipes' | 'settings'>('overview');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">⚙️</div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-slate-400">Управление системой</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-300">
                  👤 {user?.name || 'Администратор'}
                </p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium"
              >
                Выход
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800 rounded-lg p-1 w-fit">
          {(['overview', 'users', 'recipes', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {tab === 'overview' && '📊 Обзор'}
              {tab === 'users' && '👥 Пользователи'}
              {tab === 'recipes' && '🍳 Рецепты'}
              {tab === 'settings' && '⚙️ Настройки'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Всего пользователей" value="1,234" change="+12%" icon="👥" color="blue" />
              <StatCard title="Активные рецепты" value="567" change="+23%" icon="🍳" color="green" />
              <StatCard title="Завершённые курсы" value="789" change="+18%" icon="📚" color="purple" />
              <StatCard title="Доход (месяц)" value="$45K" change="+15%" icon="💰" color="yellow" />
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="mr-2">📝</span> Последняя активность
              </h2>
              <div className="space-y-4">
                <ActivityItem 
                  title="Новый пользователь зарегистрирован"
                  description="john.doe@example.com"
                  time="5 минут назад"
                  icon="✨"
                />
                <ActivityItem 
                  title="Новый рецепт опубликован"
                  description="'Пицца Маргарита' - от chef_mario"
                  time="25 минут назад"
                  icon="🍕"
                />
                <ActivityItem 
                  title="Курс завершён"
                  description="user_anna завершила 'Основы кулинарии'"
                  time="1 час назад"
                  icon="🎓"
                />
                <ActivityItem 
                  title="Система обновлена"
                  description="Выполнено обновление security patch v2.1.0"
                  time="3 часа назад"
                  icon="🔄"
                />
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="mr-2">👥</span> Управление пользователями
              </h2>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium">
                + Добавить пользователя
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-slate-300 font-semibold">Имя</th>
                    <th className="px-4 py-3 text-slate-300 font-semibold">Email</th>
                    <th className="px-4 py-3 text-slate-300 font-semibold">Роль</th>
                    <th className="px-4 py-3 text-slate-300 font-semibold">Статус</th>
                    <th className="px-4 py-3 text-slate-300 font-semibold">Действие</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  <UserTableRow 
                    name="John Doe"
                    email="john@example.com"
                    role="student"
                    status="active"
                  />
                  <UserTableRow 
                    name="Jane Smith"
                    email="jane@example.com"
                    role="instructor"
                    status="active"
                  />
                  <UserTableRow 
                    name="Mike Johnson"
                    email="mike@example.com"
                    role="student"
                    status="inactive"
                  />
                  <UserTableRow 
                    name="Sarah Williams"
                    email="sarah@example.com"
                    role="student"
                    status="active"
                  />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="mr-2">🍳</span> Управление рецептами
              </h2>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium">
                + Добавить рецепт
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <RecipeCard 
                title="Паста Карбонара"
                author="chef_mario"
                rating={4.8}
                status="published"
              />
              <RecipeCard 
                title="Пицца Маргарита"
                author="chef_luigi"
                rating={4.6}
                status="published"
              />
              <RecipeCard 
                title="Борщ украинский"
                author="chef_ivan"
                rating={4.9}
                status="draft"
              />
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="mr-2">🔧</span> Основные настройки
              </h2>
              
              <div className="space-y-4">
                <SettingItem label="Название сайта" value="Sushi Chef Academy" />
                <SettingItem label="Email поддержки" value="support@sushichef.com" />
                <SettingItem label="Часовой пояс" value="UTC+3 (Moscow)" />
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="mr-2">🔐</span> Безопасность
              </h2>
              
              <div className="space-y-4">
                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-left font-medium">
                  🔑 Изменить пароль
                </button>
                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-left font-medium">
                  📋 Просмотр логов доступа
                </button>
                <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-left font-medium">
                  🔒 Управление сессиями
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Экспортируем с HOC для защиты по ролям (только админ)
export default withAuth(AdminDashboardPage, { requiredRole: 'admin' });

// ============ Helper Components ============

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    yellow: 'from-yellow-600 to-yellow-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow-lg p-6 text-white border border-opacity-20 border-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className="text-xs mt-2 opacity-75">↑ {change}</p>
        </div>
        <div className="text-4xl opacity-20">{icon}</div>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  icon: string;
}

function ActivityItem({ title, description, time, icon }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition">
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
      <span className="text-xs text-slate-500 whitespace-nowrap ml-4">{time}</span>
    </div>
  );
}

interface UserTableRowProps {
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

function UserTableRow({ name, email, role, status }: UserTableRowProps) {
  const roleEmoji = {
    student: '👤',
    instructor: '👨‍🏫',
    admin: '👑',
  };

  const statusColor = status === 'active' ? 'text-green-400' : 'text-red-400';
  const statusLabel = status === 'active' ? 'Активен' : 'Неактивен';

  return (
    <tr>
      <td className="px-4 py-3 text-white font-medium">{name}</td>
      <td className="px-4 py-3 text-slate-300">{email}</td>
      <td className="px-4 py-3 text-slate-300">
        {roleEmoji[role as keyof typeof roleEmoji]} {role}
      </td>
      <td className="px-4 py-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
          {statusLabel}
        </span>
      </td>
      <td className="px-4 py-3">
        <button className="text-purple-400 hover:text-purple-300 font-medium transition">
          Редактировать
        </button>
      </td>
    </tr>
  );
}

interface RecipeCardProps {
  title: string;
  author: string;
  rating: number;
  status: 'published' | 'draft';
}

function RecipeCard({ title, author, rating, status }: RecipeCardProps) {
  const statusColor = status === 'published' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200';
  const statusLabel = status === 'published' ? 'Опубликовано' : 'Черновик';

  return (
    <div className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition border border-slate-600">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColor}`}>
          {statusLabel}
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-3">👨‍🍳 {author}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-yellow-400 mr-1">⭐</span>
          <span className="text-white font-semibold">{rating}</span>
        </div>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition">
          Просмотр
        </button>
      </div>
    </div>
  );
}

interface SettingItemProps {
  label: string;
  value: string;
}

function SettingItem({ label, value }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition">
      <div>
        <p className="text-slate-300 text-sm">{label}</p>
        <p className="text-white font-semibold">{value}</p>
      </div>
      <button className="text-purple-400 hover:text-purple-300 font-medium transition">
        Изменить
      </button>
    </div>
  );
}
