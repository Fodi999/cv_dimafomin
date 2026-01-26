/**
 * Settings Page - Настройки
 * Route: /admin/settings
 * Purpose: Глобальные параметры системы (system-level settings)
 * Features: Общие, Email, Уведомления, API, Безопасность
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Bell,
  Mail,
  Key,
  Lock,
  Save,
  RotateCcw,
  Settings,
  HelpCircle,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

type SettingsTab = "general" | "email" | "notifications" | "api" | "security";

interface GeneralSettings {
  appName: string;
  appDescription: string;
  timezone: string;
  language: "pl" | "en" | "ru";
  theme: "light" | "dark" | "system";
  currency: "PLN" | "EUR" | "USD";
  dateFormat: "DD.MM.YYYY" | "YYYY-MM-DD";
  measurementUnits: "metric" | "imperial";
}

interface EmailSettings {
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
}

interface NotificationSettings {
  orders: { email: boolean; inApp: boolean };
  payments: { email: boolean; inApp: boolean };
  losses: { email: boolean; inApp: boolean };
  security: { email: boolean; inApp: boolean };
}

interface ApiSettings {
  enabled: boolean;
  apiKey: string;
}

interface SecuritySettings {
  twoFactorRequired: boolean;
  sessionTimeout: number; // minutes
}

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [showApiKey, setShowApiKey] = useState(false);

  // Initial settings
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    appName: "ChefOS",
    appDescription: "Intelligent culinary platform for business owners",
    timezone: "Europe/Warsaw",
    language: language,
    theme: "system",
    currency: "PLN",
    dateFormat: "DD.MM.YYYY",
    measurementUnits: "metric",
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    senderName: "ChefOS",
    senderEmail: "noreply@chefos.com",
    replyToEmail: "support@chefos.com",
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    orders: { email: true, inApp: true },
    payments: { email: true, inApp: true },
    losses: { email: true, inApp: false },
    security: { email: true, inApp: true },
  });

  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    enabled: false,
    apiKey: "sk_live_••••••••••••••••••••••••••••••••",
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorRequired: false,
    sessionTimeout: 60,
  });

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSave = () => {
    // TODO: Save settings to backend
    setHasUnsavedChanges(false);
    toast.success("Настройки сохранены успешно!");
  };

  const handleReset = () => {
    // Reset only unsaved changes, not saved data
    setGeneralSettings({
      appName: "ChefOS",
      appDescription: "Intelligent culinary platform for business owners",
      timezone: "Europe/Warsaw",
      language: language,
      theme: "system",
      currency: "PLN",
      dateFormat: "DD.MM.YYYY",
      measurementUnits: "metric",
    });
    setHasUnsavedChanges(false);
    toast.info("Несохранённые изменения отменены");
  };

  const updateGeneralSettings = (updates: Partial<GeneralSettings>) => {
    setGeneralSettings((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Settings className="h-7 w-7 text-purple-600 dark:text-purple-400" />
          Настройки
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Глобальные параметры системы: название, язык, валюта, политики безопасности
        </p>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as SettingsTab)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="flex-shrink-0">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              Общие
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Уведомления
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Key className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              Безопасность
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="flex-1 overflow-y-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Общие настройки</CardTitle>
                <CardDescription>
                  Название системы, язык интерфейса, валюта, формат дат и единицы измерения
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* App Name */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="appName">Название приложения</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Отображается в заголовке, письмах и уведомлениях</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="appName"
                      value={generalSettings.appName}
                      onChange={(e) =>
                        updateGeneralSettings({ appName: e.target.value })
                      }
                    />
                  </div>

                  {/* Timezone */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="timezone">Часовой пояс</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Используется для заказов, списаний, отчетов и логов</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="timezone"
                      value={generalSettings.timezone}
                      onChange={(e) =>
                        updateGeneralSettings({ timezone: e.target.value })
                      }
                      placeholder="Europe/Warsaw"
                    />
                  </div>

                  {/* App Description */}
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="appDescription">Описание приложения</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Используется для email footer, marketplace (позже) и meta-данных</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      id="appDescription"
                      value={generalSettings.appDescription}
                      onChange={(e) =>
                        updateGeneralSettings({ appDescription: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  {/* Language */}
                  <div className="space-y-2">
                    <Label htmlFor="language">Язык интерфейса (UI)</Label>
                    <Select
                      value={generalSettings.language}
                      onValueChange={(value) => {
                        const newLang = value as "pl" | "en" | "ru";
                        setLanguage(newLang);
                        updateGeneralSettings({ language: newLang });
                      }}
                    >
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pl">Polski</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ru">Русский</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Theme */}
                  <div className="space-y-2">
                    <Label htmlFor="theme">Тема</Label>
                    <Select
                      value={generalSettings.theme}
                      onValueChange={(value) =>
                        updateGeneralSettings({
                          theme: value as "light" | "dark" | "system",
                        })
                      }
                    >
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System (auto)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <Label htmlFor="currency">Валюта системы</Label>
                    <Select
                      value={generalSettings.currency}
                      onValueChange={(value) =>
                        updateGeneralSettings({
                          currency: value as "PLN" | "EUR" | "USD",
                        })
                      }
                    >
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLN">PLN (Złoty)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                        <SelectItem value="USD">USD (Dollar)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Используется в экономике, списаниях, закупках и отчетах
                    </p>
                  </div>

                  {/* Date Format */}
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Формат дат</Label>
                    <Select
                      value={generalSettings.dateFormat}
                      onValueChange={(value) =>
                        updateGeneralSettings({
                          dateFormat: value as "DD.MM.YYYY" | "YYYY-MM-DD",
                        })
                      }
                    >
                      <SelectTrigger id="dateFormat">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD.MM.YYYY">DD.MM.YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Measurement Units */}
                  <div className="md:col-span-2 space-y-2">
                    <Label>Единицы измерения (база)</Label>
                    <RadioGroup
                      value={generalSettings.measurementUnits}
                      onValueChange={(value) =>
                        updateGeneralSettings({
                          measurementUnits: value as "metric" | "imperial",
                        })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="metric" id="metric" />
                        <Label htmlFor="metric" className="cursor-pointer">
                          Metric (g, ml, kg)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="imperial" id="imperial" />
                        <Label htmlFor="imperial" className="cursor-pointer">
                          Imperial (oz, lb)
                        </Label>
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      Особенно важно для рецептов
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save changes
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="gap-2 text-muted-foreground"
                    disabled={!hasUnsavedChanges}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset unsaved changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="flex-1 overflow-y-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Email настройки</CardTitle>
                <CardDescription>
                  Конфигурация отправителя и шаблонов писем
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Sender name</Label>
                    <Input
                      id="senderName"
                      value={emailSettings.senderName}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, senderName: e.target.value })
                      }
                      placeholder="ChefOS"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">Sender email</Label>
                    <Input
                      id="senderEmail"
                      type="email"
                      value={emailSettings.senderEmail}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, senderEmail: e.target.value })
                      }
                      placeholder="noreply@chefos.com"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="replyToEmail">Reply-to email</Label>
                    <Input
                      id="replyToEmail"
                      type="email"
                      value={emailSettings.replyToEmail}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, replyToEmail: e.target.value })
                      }
                      placeholder="support@chefos.com"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Email footer preview (read-only)</Label>
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {emailSettings.senderName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {generalSettings.appDescription}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        Reply to: {emailSettings.replyToEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="flex-1 overflow-y-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Уведомления</CardTitle>
                <CardDescription>
                  Настройка каналов уведомлений для различных событий
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Orders */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Заказы</h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="orders-email">Email</Label>
                    <Switch
                      id="orders-email"
                      checked={notificationSettings.orders.email}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          orders: { ...notificationSettings.orders, email: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="orders-inapp">In-app</Label>
                    <Switch
                      id="orders-inapp"
                      checked={notificationSettings.orders.inApp}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          orders: { ...notificationSettings.orders, inApp: checked },
                        })
                      }
                    />
                  </div>
                </div>

                {/* Payments */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold">Платежи</h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payments-email">Email</Label>
                    <Switch
                      id="payments-email"
                      checked={notificationSettings.payments.email}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          payments: { ...notificationSettings.payments, email: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payments-inapp">In-app</Label>
                    <Switch
                      id="payments-inapp"
                      checked={notificationSettings.payments.inApp}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          payments: { ...notificationSettings.payments, inApp: checked },
                        })
                      }
                    />
                  </div>
                </div>

                {/* Losses */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold">Списания</h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="losses-email">Email</Label>
                    <Switch
                      id="losses-email"
                      checked={notificationSettings.losses.email}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          losses: { ...notificationSettings.losses, email: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="losses-inapp">In-app</Label>
                    <Switch
                      id="losses-inapp"
                      checked={notificationSettings.losses.inApp}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          losses: { ...notificationSettings.losses, inApp: checked },
                        })
                      }
                    />
                  </div>
                </div>

                {/* Security */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold">Безопасность</h4>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="security-email">Email</Label>
                    <Switch
                      id="security-email"
                      checked={notificationSettings.security.email}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          security: { ...notificationSettings.security, email: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="security-inapp">In-app</Label>
                    <Switch
                      id="security-inapp"
                      checked={notificationSettings.security.inApp}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          security: { ...notificationSettings.security, inApp: checked },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api" className="flex-1 overflow-y-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle>API настройки</CardTitle>
                <CardDescription>
                  Управление API ключами и доступом
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="api-enabled">API enabled</Label>
                    <p className="text-xs text-muted-foreground">
                      Включить доступ к API для внешних интеграций
                    </p>
                  </div>
                  <Switch
                    id="api-enabled"
                    checked={apiSettings.enabled}
                    onCheckedChange={(checked) =>
                      setApiSettings({ ...apiSettings, enabled: checked })
                    }
                  />
                </div>

                {apiSettings.enabled && (
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="api-key">Read-only API key</Label>
                    <div className="relative">
                      <Input
                        id="api-key"
                        type={showApiKey ? "text" : "password"}
                        value={apiSettings.apiKey}
                        readOnly
                        className="pr-10 font-mono"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      disabled
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate (disabled пока)
                    </Button>
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="flex-1 overflow-y-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Безопасность</CardTitle>
                <CardDescription>
                  Глобальные политики безопасности и аутентификации
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="2fa-required">2FA required</Label>
                    <p className="text-xs text-muted-foreground">
                      Требовать двухфакторную аутентификацию для всех администраторов
                    </p>
                  </div>
                  <Switch
                    id="2fa-required"
                    checked={securitySettings.twoFactorRequired}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactorRequired: checked,
                      })
                    }
                  />
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Label htmlFor="session-timeout">Session timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: parseInt(e.target.value) || 60,
                      })
                    }
                    min={5}
                    max={1440}
                  />
                  <p className="text-xs text-muted-foreground">
                    Автоматический выход из системы после неактивности
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <Label>Allowed IPs (future)</Label>
                  <Input
                    placeholder="192.168.1.1, 10.0.0.0/8"
                    disabled
                    className="bg-slate-50 dark:bg-slate-800"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ограничение доступа по IP-адресам (в разработке)
                  </p>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
