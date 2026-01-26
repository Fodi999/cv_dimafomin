"use client";

import { motion } from "framer-motion";
import { Eye, Package } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Order, getOrderStatusConfig } from "@/lib/types/order";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();
  const statusConfig = getOrderStatusConfig(order.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleViewDetails = () => {
    router.push(`/orders/${order.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          {/* Top Row: Order Number, Date, Status */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">
                {order.orderNumber}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(order.date)}
              </p>
            </div>
            <Badge className={statusConfig.color}>
              {statusConfig.icon} {statusConfig.label}
            </Badge>
          </div>

          {/* Content: Items Count and Total */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Package className="w-4 h-4" />
              <span>
                {order.itemsCount} {order.itemsCount === 1 ? "товар" : "товаров"}
              </span>
            </div>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {order.total.toFixed(2)} PLN
            </p>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleViewDetails}
          >
            <Eye className="w-4 h-4 mr-2" />
            Детали заказа
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
