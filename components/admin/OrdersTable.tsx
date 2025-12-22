"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, ShoppingCart } from "lucide-react";

interface AdminOrder {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
  items: number;
}

interface OrdersTableProps {
  orders: AdminOrder[];
  onUpdateStatus?: (orderId: string, newStatus: string) => void;
}

const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode; label: string }> = {
  pending: {
    variant: "secondary",
    icon: <Clock className="w-4 h-4 mr-1" />,
    label: "⏳ В ожидании",
  },
  completed: {
    variant: "default",
    icon: <CheckCircle className="w-4 h-4 mr-1" />,
    label: "✅ Завершен",
  },
  failed: {
    variant: "destructive",
    icon: <AlertCircle className="w-4 h-4 mr-1" />,
    label: "❌ Ошибка",
  },
};

export function OrdersTable({
  orders,
  onUpdateStatus,
}: OrdersTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          <CardTitle>Заказы</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Заказа</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Товаров</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="font-medium">{order.userName}</TableCell>
                    <TableCell className="font-bold">
                      ${order.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{order.items} товар(ов)</TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className="flex items-center w-fit">
                        {status.icon}
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(order.date).toLocaleDateString("uk-UA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Заказы не найдены</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
