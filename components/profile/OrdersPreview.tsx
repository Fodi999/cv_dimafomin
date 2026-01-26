"use client";

import { motion } from "framer-motion";
import { Package, ArrowRight, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Order, getOrderStatusConfig } from "@/lib/types/order";

interface OrdersPreviewProps {
  orders: Order[];
}

/**
 * Orders Preview Component
 * Shows last 3 orders with quick access
 */
export function OrdersPreview({ orders }: OrdersPreviewProps) {
  const router = useRouter();
  const previewOrders = orders.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (orders.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Мои заказы
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/orders")}
          >
            Все заказы <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {previewOrders.map((order) => {
            const statusConfig = getOrderStatusConfig(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{order.orderNumber}</span>
                    <Badge className={statusConfig.color}>
                      {statusConfig.icon} {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <span>{formatDate(order.date)}</span>
                    <span>{order.total.toFixed(2)} PLN</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/orders/${order.id}`);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
