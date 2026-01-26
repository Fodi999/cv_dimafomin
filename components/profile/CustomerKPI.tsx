"use client";

import { motion } from "framer-motion";
import { Package, Clock, Heart, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Order, getOrderStatusConfig } from "@/lib/types/order";

interface CustomerKPIProps {
  totalOrders: number;
  lastOrder?: Order;
  activeOrders: number;
  favoriteDishes: number;
}

/**
 * Customer KPI Cards
 * Shows: My Orders, In Progress, Favorites
 */
export function CustomerKPI({
  totalOrders,
  lastOrder,
  activeOrders,
  favoriteDishes,
}: CustomerKPIProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Мои заказы */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/40 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/orders")}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Package className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-green-300/80 font-medium">Мои заказы</p>
              <p className="text-3xl font-bold text-white">{totalOrders}</p>
              {lastOrder && (
                <div className="pt-2 border-t border-green-500/20">
                  <p className="text-xs text-green-300/60">
                    Последний: {lastOrder.orderNumber}
                  </p>
                  <p className="text-xs text-green-300/60">
                    {formatDate(lastOrder.date)} • {getOrderStatusConfig(lastOrder.status).label}
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 text-green-300 hover:text-white hover:bg-green-500/20"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/orders");
              }}
            >
              Посмотреть заказы <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* В обработке */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/40 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/orders")}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-purple-300/80 font-medium">В обработке</p>
              <p className="text-3xl font-bold text-white">{activeOrders}</p>
              <p className="text-xs text-purple-300/60">
                Активные заказы
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 text-purple-300 hover:text-white hover:bg-purple-500/20"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/orders");
              }}
            >
              Отследить <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Избранное */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/40 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/marketplace")}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Heart className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-blue-300/80 font-medium">Избранное</p>
              <p className="text-3xl font-bold text-white">{favoriteDishes}</p>
              <p className="text-xs text-blue-300/60">
                Сохранённых блюд
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 text-blue-300 hover:text-white hover:bg-blue-500/20"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/marketplace");
              }}
            >
              Перейти в маркетплейс <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
