"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Ban, XCircle, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * ✅ 2026: Account Status Page
 * 
 * Показывается пользователям с status !== "active"
 * 
 * Статусы:
 * - pending: Ожидает активации
 * - suspended: Приостановлен
 * - blocked: Заблокирован
 */
export default function AccountStatusPage() {
  const { user, loading, signOut, reloadMe } = useAuth();
  const router = useRouter();

  // Если пользователь активный - редирект на главную
  useEffect(() => {
    if (!loading && user?.status === "active") {
      console.log("[Account Status] User is active, redirecting");
      router.replace("/marketplace");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Если нет пользователя - редирект на логин
    router.replace("/login");
    return null;
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="w-12 h-12 text-yellow-500" />,
          title: "Account Pending Activation",
          description: "Your account is awaiting approval",
          bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
          borderColor: "border-yellow-200 dark:border-yellow-900",
          textColor: "text-yellow-800 dark:text-yellow-300",
          badgeVariant: "secondary" as const,
          messages: [
            "Your account has been created successfully",
            "An administrator will review and activate your account soon",
            "You will receive an email notification once activated",
          ],
          actions: [
            "Check your email for verification",
            "Wait for admin approval",
            "Contact support if this takes too long",
          ],
        };

      case "suspended":
        return {
          icon: <AlertTriangle className="w-12 h-12 text-orange-500" />,
          title: "Account Suspended",
          description: "Your account has been temporarily suspended",
          bgColor: "bg-orange-50 dark:bg-orange-950/20",
          borderColor: "border-orange-200 dark:border-orange-900",
          textColor: "text-orange-800 dark:text-orange-300",
          badgeVariant: "destructive" as const,
          messages: [
            "Your account access has been temporarily suspended",
            "This may be due to a policy violation or security concern",
            "Please contact support for more information",
          ],
          actions: [
            "Review our Terms of Service",
            "Contact support to resolve the issue",
            "Wait for further instructions from our team",
          ],
        };

      case "blocked":
        return {
          icon: <Ban className="w-12 h-12 text-red-500" />,
          title: "Account Blocked",
          description: "Your account has been blocked",
          bgColor: "bg-red-50 dark:bg-red-950/20",
          borderColor: "border-red-200 dark:border-red-900",
          textColor: "text-red-800 dark:text-red-300",
          badgeVariant: "destructive" as const,
          messages: [
            "Your account has been blocked and cannot access the system",
            "This action was taken due to violation of our policies",
            "If you believe this is an error, please contact support",
          ],
          actions: [
            "Contact support immediately",
            "Review the reason for blocking",
            "Follow the appeal process if applicable",
          ],
        };

      default:
        return {
          icon: <XCircle className="w-12 h-12 text-gray-500" />,
          title: "Account Status Unknown",
          description: "Unable to determine account status",
          bgColor: "bg-gray-50 dark:bg-gray-950/20",
          borderColor: "border-gray-200 dark:border-gray-900",
          textColor: "text-gray-800 dark:text-gray-300",
          badgeVariant: "secondary" as const,
          messages: ["Please contact support for assistance"],
          actions: ["Contact support"],
        };
    }
  };

  const config = getStatusConfig(user.status);

  const handleRefresh = async () => {
    console.log("[Account Status] 🔄 Refreshing user data");
    await reloadMe();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Card className={`max-w-2xl w-full ${config.borderColor}`}>
        <CardHeader className={`${config.bgColor} border-b ${config.borderColor}`}>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {config.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className={config.textColor}>{config.title}</CardTitle>
                <Badge variant={config.badgeVariant}>{user.status}</Badge>
              </div>
              <CardDescription className={config.textColor}>
                {config.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* User Info */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Role:</span>
              <span className="font-medium capitalize">{user.role.replace(/_/g, " ")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={config.badgeVariant}>{user.status}</Badge>
            </div>
          </div>

          {/* Status Messages */}
          <div className="space-y-3">
            <h3 className="font-semibold">What happened?</h3>
            <ul className="space-y-2">
              {config.messages.map((message, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{message}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold">What can you do?</h3>
            <ul className="space-y-2">
              {config.actions.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">→</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Contact */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h3 className="font-semibold mb-2 text-sm">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Contact our support team for assistance:
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Email:</span>
                <a href="mailto:support@example.com" className="text-primary hover:underline">
                  support@example.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">User ID:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{user.id}</code>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex-1"
            >
              🔄 Refresh Status
            </Button>
            <Button
              onClick={signOut}
              variant="ghost"
              className="flex-1"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
