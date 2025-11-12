"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingCart, Coins, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  totalUsers?: number;
  activeUsers?: number;
  totalOrders?: number;
  totalTokensEarned?: number;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  change,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  color: string;
}) => (
  <Card className={`border-l-4 ${color}`}>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div className="p-2 bg-muted rounded-lg">{Icon}</div>
      </div>
    </CardHeader>
    <CardContent>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        {change && (
          <p className="text-xs text-muted-foreground mt-2">{change}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

export function DashboardStats({
  totalUsers = 0,
  activeUsers = 0,
  totalOrders = 0,
  totalTokensEarned = 0,
}: DashboardStatsProps) {
  const activeUserPercent = totalUsers > 0 
    ? Math.round((activeUsers / totalUsers) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        icon={<Users className="w-4 h-4" />}
        label="Всего пользователей"
        value={totalUsers.toLocaleString()}
        change={`${activeUserPercent}% активны`}
        color="border-l-blue-500"
      />
      <StatCard
        icon={<ShoppingCart className="w-4 h-4" />}
        label="Всего заказов"
        value={totalOrders.toLocaleString()}
        change={"+12% этот месяц"}
        color="border-l-green-500"
      />
      <StatCard
        icon={<Coins className="w-4 h-4" />}
        label="Выдано токенов"
        value={totalTokensEarned.toLocaleString()}
        change={"+8% эта неделя"}
        color="border-l-orange-500"
      />
      <StatCard
        icon={<TrendingUp className="w-4 h-4" />}
        label="Выручка"
        value="$45,231"
        change={"+23% YoY"}
        color="border-l-purple-500"
      />
    </div>
  );
}
