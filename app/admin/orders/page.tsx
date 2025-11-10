"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { adminApi } from "@/lib/api";
import { Search } from "lucide-react";

interface Order {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  items: any[];
}

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No authentication token");
          return;
        }

        const data = await adminApi.getOrders(token);
        setOrders(Array.isArray(data) ? data : (data as any).orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: string
  ) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      
      await adminApi.updateOrderStatus(orderId, newStatus, token);
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus as any } : o
        )
      );
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order status");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary/10 text-primary";
      case "pending":
        return "bg-secondary/30 text-foreground";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-foreground/10 text-foreground/60";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Загрузка заказов...</p>
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
          Управление заказами
        </h1>
        <p className="text-foreground/60">
          Всего заказов: {orders.length}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Поиск по имени, email или ID заказа..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-foreground/40"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-medium"
        >
          <option value="all">Все статусы</option>
          <option value="pending">В ожидании</option>
          <option value="completed">Завершено</option>
          <option value="cancelled">Отменено</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/10 border-b border-border">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  ID Заказа
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  Клиент
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  Email
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  Сумма
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  Статус
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  Дата
                </th>
                <th className="text-left py-4 px-6 font-semibold text-foreground/70">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-secondary/5 transition-colors"
                >
                  <td className="py-4 px-6">
                    <p className="font-medium text-foreground">
                      #{order.id.substring(0, 8).toUpperCase()}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-foreground">
                      {order.userName}
                    </p>
                  </td>
                  <td className="py-4 px-6 text-foreground/60">
                    {order.userEmail}
                  </td>
                  <td className="py-4 px-6 font-semibold text-foreground">
                    ${order.amount.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-lg text-sm font-medium border border-border focus:outline-none focus:ring-2 focus:ring-primary ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="pending">В ожидании</option>
                      <option value="completed">Завершено</option>
                      <option value="cancelled">Отменено</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground/60">
                    {new Date(order.createdAt).toLocaleDateString("uk-UA")}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {order.status === "pending"
                        ? "В ожидании"
                        : order.status === "completed"
                        ? "Завершено"
                        : "Отменено"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60">
              Заказы не найдены
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
