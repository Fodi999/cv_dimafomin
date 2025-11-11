"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { adminApi } from "@/src/lib/admin-api";
import { Search, Trash2, Plus, Eye, AlertCircle, Coins, TrendingUp, Users, BarChart3 } from "lucide-react";

interface TokenBank {
  id: string;
  userId: string;
  userName?: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  lastTransaction?: string;
}

export default function TokenBankPage() {
  const { user } = useUser();
  const [tokenBanks, setTokenBanks] = useState<TokenBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionInProgress, setActionInProgress] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [allocateAmount, setAllocateAmount] = useState("");
  const [allocateReason, setAllocateReason] = useState("bonus");

  useEffect(() => {
    fetchTokenBanks();
    fetchTokenStats();
  }, []);

  const mockTokenBanks: TokenBank[] = [
    {
      id: "1",
      userId: "user-001",
      userName: "Александр Петров",
      balance: 1250,
      totalEarned: 5000,
      totalSpent: 3750,
      lastTransaction: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: "2",
      userId: "user-002",
      userName: "Мария Иванова",
      balance: 3500,
      totalEarned: 8000,
      totalSpent: 4500,
      lastTransaction: new Date(Date.now() - 1 * 3600000).toISOString(),
    },
    {
      id: "3",
      userId: "user-003",
      userName: "Сергей Смирнов",
      balance: 750,
      totalEarned: 2000,
      totalSpent: 1250,
      lastTransaction: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    {
      id: "4",
      userId: "user-004",
      userName: "Елена Кузнецова",
      balance: 2100,
      totalEarned: 6000,
      totalSpent: 3900,
      lastTransaction: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
    {
      id: "5",
      userId: "user-005",
      userName: "Дмитрий Морозов",
      balance: 4200,
      totalEarned: 9500,
      totalSpent: 5300,
      lastTransaction: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
  ];

  const fetchTokenBanks = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[TokenBankPage] Загрузка токин-банков...');
      
      const data = await adminApi.getTokenBanks();
      console.log('[TokenBankPage] Получены токин-банки:', data);
      
      setTokenBanks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[TokenBankPage] Ошибка при загрузке токин-банков:', err);
      console.log('[TokenBankPage] Используются тестовые данные');
      setTokenBanks(mockTokenBanks);
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenStats = async () => {
    try {
      const data = await adminApi.getTokenStats();
      console.log('[TokenBankPage] Статистика токинов:', data);
      setStats(data);
    } catch (err) {
      console.error('[TokenBankPage] Ошибка при загрузке статистики:', err);
      console.log('[TokenBankPage] Используются тестовые статистические данные');
    }
  };

  const filteredTokenBanks = tokenBanks.filter(
    (tb) =>
      (tb.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (tb.userId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleAllocateTokens = async () => {
    if (!selectedUserId || !allocateAmount) {
      alert('Заполните все поля');
      return;
    }

    try {
      setActionInProgress(true);
      console.log('[TokenBankPage] Выделение токинов:', selectedUserId, allocateAmount);
      
      await adminApi.allocateTokens(selectedUserId, parseInt(allocateAmount), allocateReason);
      
      setTokenBanks(
        tokenBanks.map((tb) =>
          tb.userId === selectedUserId
            ? { ...tb, balance: tb.balance + parseInt(allocateAmount) }
            : tb
        )
      );
      
      setShowAllocateModal(false);
      setSelectedUserId(null);
      setAllocateAmount("");
      console.log('[TokenBankPage] ✅ Токины выделены');
    } catch (err) {
      console.error('[TokenBankPage] ❌ Ошибка при выделении токинов:', err);
      alert('Ошибка при выделении токинов: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
    } finally {
      setActionInProgress(false);
    }
  };

  const handleRevokeTokens = async (userId: string, amount: number) => {
    if (!confirm(`Вы уверены, что хотите отозвать ${amount} токинов?`)) {
      return;
    }

    try {
      setActionInProgress(true);
      console.log('[TokenBankPage] Отзыв токинов:', userId, amount);
      
      await adminApi.revokeTokens(userId, amount, "admin_revoke");
      
      setTokenBanks(
        tokenBanks.map((tb) =>
          tb.userId === userId
            ? { ...tb, balance: Math.max(0, tb.balance - amount) }
            : tb
        )
      );
      
      console.log('[TokenBankPage] ✅ Токины отозваны');
    } catch (err) {
      console.error('[TokenBankPage] ❌ Ошибка при отзыве токинов:', err);
      alert('Ошибка при отзыве токинов: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
    } finally {
      setActionInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка токин-банков...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg sm:rounded-xl p-4 sm:p-8 text-white border border-purple-500">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-4xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
              <Coins className="w-6 sm:w-10 h-6 sm:h-10 flex-shrink-0" />
              <span className="truncate">Токины</span>
            </h1>
            <p className="text-xs sm:text-base text-purple-100">
              Всего: <span className="font-bold">{tokenBanks.length}</span> | 
              Найдено: <span className="font-bold">{filteredTokenBanks.length}</span>
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-3 sm:px-4 py-2 bg-purple-500 hover:bg-purple-700 text-white rounded-lg font-semibold transition text-sm sm:text-base whitespace-nowrap flex-shrink-0"
          >
            Обновить
          </button>
        </div>
      </div>

      {/* Info Alert - Mock Data */}
      {!error && tokenBanks.length === mockTokenBanks.length && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-blue-900 text-sm">Используются тестовые данные</p>
            <p className="text-xs text-blue-700 mt-0.5">Эндпоинты API не реализованы на бэкенде</p>
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
          className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-foreground placeholder-foreground/40 text-sm sm:text-base"
        />
      </div>

      {/* Token Banks Table - Desktop */}
      <div className="hidden md:block bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-lg text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Пользователь</th>
                <th className="px-4 py-3 text-left">Баланс</th>
                <th className="px-4 py-3 text-left">Заработано</th>
                <th className="px-4 py-3 text-left">Потрачено</th>
                <th className="px-4 py-3 text-left">Последняя</th>
                <th className="px-4 py-3 text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokenBanks.map((tb) => (
                <tr key={tb.userId} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {tb.userName || tb.userId || '—'}
                  </td>
                  <td className="px-4 py-3 font-bold text-purple-600">
                    {tb.balance || 0} 🪙
                  </td>
                  <td className="px-4 py-3 text-green-600 font-semibold text-sm">
                    +{tb.totalEarned || 0}
                  </td>
                  <td className="px-4 py-3 text-red-600 font-semibold text-sm">
                    -{tb.totalSpent || 0}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    {tb.lastTransaction ? new Date(tb.lastTransaction).toLocaleDateString('ru-RU') : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUserId(tb.userId);
                          setShowAllocateModal(true);
                        }}
                        disabled={actionInProgress}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                        title="Выделить"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRevokeTokens(tb.userId, Math.floor((tb.balance || 0) * 0.1))}
                        disabled={actionInProgress || (tb.balance || 0) === 0}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Отозвать"
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

        {filteredTokenBanks.length === 0 && (
          <div className="text-center py-12">
            <Eye className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <p className="text-slate-600 font-semibold">Не найдено</p>
          </div>
        )}
      </div>

      {/* Token Banks Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {filteredTokenBanks.length > 0 ? (
          filteredTokenBanks.map((tb) => (
            <div
              key={tb.userId}
              className="bg-card border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 truncate text-sm">
                    {tb.userName || tb.userId || '—'}
                  </p>
                  <p className="text-xs text-slate-600">ID: {tb.userId}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-purple-50 rounded p-2">
                  <p className="text-xs text-purple-600 font-semibold">Баланс</p>
                  <p className="text-lg font-bold text-purple-600">{tb.balance || 0}</p>
                </div>
                <div className="bg-green-50 rounded p-2">
                  <p className="text-xs text-green-600 font-semibold">+Заработано</p>
                  <p className="text-lg font-bold text-green-600">{tb.totalEarned || 0}</p>
                </div>
                <div className="bg-red-50 rounded p-2">
                  <p className="text-xs text-red-600 font-semibold">-Потрачено</p>
                  <p className="text-lg font-bold text-red-600">{tb.totalSpent || 0}</p>
                </div>
              </div>

              {tb.lastTransaction && (
                <p className="text-xs text-slate-600 px-2">
                  {new Date(tb.lastTransaction).toLocaleString('ru-RU')}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedUserId(tb.userId);
                    setShowAllocateModal(true);
                  }}
                  disabled={actionInProgress}
                  className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition disabled:opacity-50 font-semibold text-sm flex items-center justify-center gap-2"
                  title="Выделить"
                >
                  <Plus className="w-4 h-4" />
                  Дать
                </button>
                <button
                  onClick={() => handleRevokeTokens(tb.userId, Math.floor((tb.balance || 0) * 0.1))}
                  disabled={actionInProgress || (tb.balance || 0) === 0}
                  className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50 font-semibold text-sm flex items-center justify-center gap-2"
                  title="Отозвать"
                >
                  <Trash2 className="w-4 h-4" />
                  Отозвать
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <Eye className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <p className="text-slate-600 font-semibold">Не найдено</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
          <p className="text-slate-600 text-xs md:text-sm font-semibold mb-1 md:mb-2 flex items-center gap-2">
            <Coins className="w-4 h-4" /> Общий баланс
          </p>
          <p className="text-2xl md:text-3xl font-bold text-purple-600">
            {tokenBanks.reduce((sum, tb) => sum + (tb.balance || 0), 0)}
          </p>
          <p className="text-xs text-slate-500 mt-1 md:mt-2">
            В обращении
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
          <p className="text-slate-600 text-xs md:text-sm font-semibold mb-1 md:mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Всего заработано
          </p>
          <p className="text-2xl md:text-3xl font-bold text-green-600">
            {tokenBanks.reduce((sum, tb) => sum + (tb.totalEarned || 0), 0)}
          </p>
          <p className="text-xs text-slate-500 mt-1 md:mt-2">
            За всё время
          </p>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-slate-200 p-4 md:p-6">
          <p className="text-slate-600 text-xs md:text-sm font-semibold mb-1 md:mb-2 flex items-center gap-2">
            <Users className="w-4 h-4" /> Активных
          </p>
          <p className="text-2xl md:text-3xl font-bold text-slate-900">
            {tokenBanks.filter(tb => (tb.balance || 0) > 0).length}
          </p>
          <p className="text-xs text-slate-500 mt-1 md:mt-2">
            С положительным балансом
          </p>
        </div>
      </div>

      {/* Allocate Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Выделить токины</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Количество
                </label>
                <input
                  type="number"
                  value={allocateAmount}
                  onChange={(e) => setAllocateAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 sm:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Причина
                </label>
                <select
                  value={allocateReason}
                  onChange={(e) => setAllocateReason(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm sm:text-base"
                >
                  <option value="bonus">Бонус</option>
                  <option value="reward">Награда</option>
                  <option value="promo">Промо</option>
                  <option value="refund">Возврат</option>
                  <option value="admin">Административное</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 mt-6">
              <button
                onClick={() => setShowAllocateModal(false)}
                className="flex-1 px-3 sm:px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold transition text-sm sm:text-base"
              >
                Отмена
              </button>
              <button
                onClick={handleAllocateTokens}
                disabled={actionInProgress}
                className="flex-1 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition disabled:opacity-50 text-sm sm:text-base"
              >
                Выделить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
