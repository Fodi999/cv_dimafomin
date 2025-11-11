"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/src/lib/admin-api";
import { Search, Trash2, Eye, AlertCircle, RefreshCw, ShoppingCart, Clock, CheckCircle, DollarSign } from "lucide-react";

interface AdminOrder {
  id: string;
  orderId?: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  recipeId: string;
  recipeName: string;
  status: 'pending' | 'completed' | 'cancelled';
  totalAmount?: number;
  items?: Array<{
    recipeId: string;
    quantity: number;
    price: number;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[OrdersPage] 📥 Загрузка заказов...');
        
        const data = await adminApi.getRecentOrders();
        console.log('[OrdersPage] ✅ Получены заказы:', data);
        
        setOrders(Array.isArray(data) ? (data as any[]) : []);
      } catch (err) {
        console.error('[OrdersPage] ❌ Ошибка при загрузке заказов:', err);
        setError(err instanceof Error ? err.message : "Ошибка при загрузке заказов");
        
        // Mock-данные для тестирования
        setOrders([
          {
            id: '1',
            orderId: 'ORD-001',
            customerId: '1',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            recipeId: 'r1',
            recipeName: 'Суши Роллы',
            status: 'completed',
            totalAmount: 299.99,
            createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
            updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          },
          {
            id: '2',
            orderId: 'ORD-002',
            customerId: '2',
            customerName: 'Jane Smith',
            customerEmail: 'jane@example.com',
            recipeId: 'r2',
            recipeName: 'Васаби Шримп',
            status: 'pending',
            totalAmount: 349.99,
            createdAt: new Date(Date.now() - 12*60*60*1000).toISOString(),
            updatedAt: new Date(Date.now() - 12*60*60*1000).toISOString(),
          },
          {
            id: '3',
            orderId: 'ORD-003',
            customerId: '3',
            customerName: 'Mike Johnson',
            customerEmail: 'mike@example.com',
            recipeId: 'r3',
            recipeName: 'Инстант Лапша',
            status: 'pending',
            totalAmount: 89.99,
            createdAt: new Date(Date.now() - 6*60*60*1000).toISOString(),
            updatedAt: new Date(Date.now() - 6*60*60*1000).toISOString(),
          },
          {
            id: '4',
            orderId: 'ORD-004',
            customerId: '4',
            customerName: 'Sarah Williams',
            customerEmail: 'sarah@example.com',
            recipeId: 'r4',
            recipeName: 'Томатный Суп',
            status: 'cancelled',
            totalAmount: 159.99,
            createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
            updatedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.customerEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.recipeName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.orderId?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Вы уверены, что хотите удалить заказ "${orderNumber}"?`)) {
      return;
    }

    try {
      setActionInProgress(true);
      console.log('[OrdersPage] 🗑️  Удаление заказа:', orderId);
      
      // Здесь должен быть вызов API для удаления
      // await adminApi.deleteOrder(orderId);
      
      setOrders(orders.filter((o) => o.id !== orderId));
      console.log('[OrdersPage] ✅ Заказ удалён');
    } catch (err) {
      console.error('[OrdersPage] ❌ Ошибка при удалении:', err);
      alert('Ошибка при удалении заказа: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
    } finally {
      setActionInProgress(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    const status = newStatus as 'pending' | 'completed' | 'cancelled';
    
    try {
      setActionInProgress(true);
      console.log('[OrdersPage] 🔄 Обновление статуса:', orderId, status);
      
      await adminApi.updateOrderStatus(orderId, status);
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
        )
      );
      console.log('[OrdersPage] ✅ Статус обновлён');
    } catch (err) {
      console.error('[OrdersPage] ❌ Ошибка при обновлении статуса:', err);
      alert('Ошибка при обновлении статуса: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
    } finally {
      setActionInProgress(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка заказов...</p>
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
              <ShoppingCart className="w-6 sm:w-8 h-6 sm:h-8 flex-shrink-0" />
              <span className="truncate">Заказы</span>
            </h1>
            <p className="text-xs sm:text-base text-slate-300">
              Всего: <span className="font-bold">{orders.length}</span> | 
              Найдено: <span className="font-bold">{filteredOrders.length}</span>
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition flex items-center gap-2 text-sm sm:text-base whitespace-nowrap flex-shrink-0"
          >
            <RefreshCw className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden sm:inline">Обновить</span>
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

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 placeholder-slate-400 text-sm sm:text-base"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 font-medium text-sm sm:text-base"
        >
          <option value="all">Все статусы</option>
          <option value="pending">В ожидании</option>
          <option value="completed">Завершены</option>
          <option value="cancelled">Отменены</option>
        </select>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-900 text-sm">Номер</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900 text-sm">Клиент</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900 text-sm">Рецепт</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900 text-sm">Сумма</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900 text-sm">Статус</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900 text-sm">Дата</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-900 text-sm">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <p className="font-semibold text-slate-900 text-sm">{order.orderId || order.id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{order.customerName}</p>
                      <p className="text-xs text-slate-500">{order.customerEmail || '—'}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 text-sm">
                    {order.recipeName}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900 text-sm">
                    ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      disabled={actionInProgress}
                      className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer disabled:opacity-50 ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">В ожидании</option>
                      <option value="completed">Завершен</option>
                      <option value="cancelled">Отменён</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-xs sm:text-sm text-slate-600">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ru-RU') : '—'}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleDeleteOrder(order.id, order.orderId || order.id)}
                      disabled={actionInProgress}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 inline-flex"
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Eye className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <p className="text-slate-600 font-semibold">Заказы не найдены</p>
          </div>
        )}
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 text-sm">{order.orderId || order.id}</p>
                  <p className="text-xs text-slate-600 truncate">{order.customerName}</p>
                </div>
                <button
                  onClick={() => handleDeleteOrder(order.id, order.orderId || order.id)}
                  disabled={actionInProgress}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 flex-shrink-0"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Рецепт:</span>
                  <span className="font-medium text-slate-900">{order.recipeName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Сумма:</span>
                  <span className="font-semibold text-slate-900">${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  disabled={actionInProgress}
                  className={`w-full px-3 py-2 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer disabled:opacity-50 ${getStatusColor(order.status)}`}
                >
                  <option value="pending">В ожидании</option>
                  <option value="completed">Завершен</option>
                  <option value="cancelled">Отменён</option>
                </select>
                {order.createdAt && (
                  <p className="text-xs text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-lg">
            <Eye className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <p className="text-slate-600 font-semibold">Нет результатов</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
          <p className="text-slate-600 text-xs md:text-sm font-semibold mb-1 md:mb-2 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Всего
          </p>
          <p className="text-2xl md:text-3xl font-bold text-slate-900">
            {orders.length}
          </p>
          <p className="text-xs text-slate-500 mt-1 md:mt-2">
            За всё время
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
          <p className="text-slate-600 text-xs md:text-sm font-semibold mb-1 md:mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" /> В ожидании
          </p>
          <p className="text-2xl md:text-3xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'pending').length}
          </p>
          <p className="text-xs text-slate-500 mt-1 md:mt-2">
            Требуют действия
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
          <p className="text-slate-600 text-xs md:text-sm font-semibold mb-1 md:mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Завершены
          </p>
          <p className="text-2xl md:text-3xl font-bold text-green-600">
            {orders.filter(o => o.status === 'completed').length}
          </p>
          <p className="text-xs text-slate-500 mt-1 md:mt-2">
            {orders.length > 0 ? ((orders.filter(o => o.status === 'completed').length / orders.length) * 100).toFixed(0) : 0}%
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
          <p className="text-slate-600 text-xs md:text-sm font-semibold mb-1 md:mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Доход
          </p>
          <p className="text-2xl md:text-3xl font-bold text-slate-900 truncate">
            ${orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-1 md:mt-2">
            От всех заказов
          </p>
        </div>
      </div>
    </div>
  );
}
