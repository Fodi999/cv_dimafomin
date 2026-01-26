/**
 * Integrations Page - Інтеграції
 * Route: /admin/integrations
 * Purpose: Панель подключения внешних систем для расширения функциональности
 * Features: Stripe, SendGrid, Cloudinary, OpenAI с управлением ключами и статусами
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Zap,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  CreditCard,
  Mail,
  Image,
  Brain,
  Info,
  CheckCircle2,
  Loader2,
} from "lucide-react";

type IntegrationStatus = "disconnected" | "connected" | "error";
type Environment = "sandbox" | "production";

interface IntegrationField {
  name: string;
  key: string;
  type: "password" | "text";
  placeholder: string;
  required?: boolean;
}

interface Integration {
  id: string;
  name: string;
  Icon: React.ComponentType<{ size: number; className: string }>;
  description: string;
  fields: IntegrationField[];
  hasEnvironment?: boolean; // Для Stripe
  hasWarning?: string; // Для OpenAI
}

const integrations: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    Icon: CreditCard,
    description: "Платежи, подписки, чеки",
    hasEnvironment: true,
    fields: [
      {
        name: "Public Key",
        key: "stripe_public_key",
        type: "text",
        placeholder: "pk_live_••••••••••••••••",
        required: true,
      },
      {
        name: "Secret Key",
        key: "stripe_secret_key",
        type: "password",
        placeholder: "sk_live_••••••••••••••••",
        required: true,
      },
    ],
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    Icon: Mail,
    description: "Транзакционные письма и уведомления",
    fields: [
      {
        name: "API Key",
        key: "sendgrid_api_key",
        type: "password",
        placeholder: "SG.••••••••••••••••",
        required: true,
      },
      {
        name: "Sender Email",
        key: "sendgrid_sender_email",
        type: "text",
        placeholder: "noreply@example.com",
        required: false,
      },
    ],
  },
  {
    id: "cloudinary",
    name: "Cloudinary",
    Icon: Image,
    description: "Изображения блюд и медиа рецептов",
    fields: [
      {
        name: "Cloud Name",
        key: "cloudinary_cloud_name",
        type: "text",
        placeholder: "your-cloud-name",
        required: true,
      },
      {
        name: "API Key",
        key: "cloudinary_api_key",
        type: "password",
        placeholder: "••••••••••••••••",
        required: true,
      },
      {
        name: "API Secret",
        key: "cloudinary_api_secret",
        type: "password",
        placeholder: "••••••••••••••••",
        required: true,
      },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    Icon: Brain,
    description: "AI-ассистент, генерация рецептов, рекомендации",
    hasWarning: "Генерація AI може створювати витрати",
    fields: [
      {
        name: "API Key",
        key: "openai_api_key",
        type: "password",
        placeholder: "sk-••••••••••••••••",
        required: true,
      },
    ],
  },
];

// Утилита для маскирования ключей
const maskKey = (key: string): string => {
  if (!key) return "";
  const visible = key.slice(-4);
  return `••••••••${visible}`;
};

export default function IntegrationsPage() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [statuses, setStatuses] = useState<Record<string, IntegrationStatus>>({});
  const [environments, setEnvironments] = useState<Record<string, Environment>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});

  // Загружаем сохраненные данные при монтировании
  useEffect(() => {
    const loaded: Record<string, string> = {};
    const loadedStatuses: Record<string, IntegrationStatus> = {};
    const loadedEnvironments: Record<string, Environment> = {};

    integrations.forEach((integration) => {
      integration.fields.forEach((field) => {
        const stored = getStoredKey(field.key);
        if (stored) {
          loaded[field.key] = stored;
        }
      });

      // Проверяем статус
      const hasAllRequired = integration.fields
        .filter((f) => f.required)
        .every((f) => getStoredKey(f.key));
      loadedStatuses[integration.id] = hasAllRequired ? "connected" : "disconnected";

      // Загружаем environment для Stripe
      if (integration.hasEnvironment) {
        const storedEnv = localStorage.getItem(`integration_${integration.id}_environment`);
        loadedEnvironments[integration.id] = (storedEnv as Environment) || "sandbox";
      }
    });

    setFormData(loaded);
    setStatuses(loadedStatuses);
    setEnvironments(loadedEnvironments);
  }, []);

  // Утилита для получения ключа из localStorage
  const getStoredKey = (key: string): string => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(`integration_${key}`) || "";
  };

  // Утилита для сохранения ключа в localStorage
  const storeKey = (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    if (value.trim()) {
      localStorage.setItem(`integration_${key}`, value);
    }
  };

  // Утилита для удаления ключа
  const removeKey = (key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`integration_${key}`);
  };

  // Проверяем статус интеграции
  const getStatus = (integrationId: string): IntegrationStatus => {
    return statuses[integrationId] || "disconnected";
  };

  const handleConnect = (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (!integration) return;

    // Проверяем обязательные поля
    const hasAllRequired = integration.fields
      .filter((f) => f.required)
      .every((f) => {
        const value = formData[f.key] || getStoredKey(f.key);
        return value && value.trim();
      });

    if (!hasAllRequired) {
      setEditingId(integrationId);
      return;
    }

    // Сохраняем все поля
    integration.fields.forEach((field) => {
      const value = formData[field.key] || getStoredKey(field.key);
      if (value && value.trim()) {
        storeKey(field.key, value);
      }
    });

    // Сохраняем environment для Stripe
    if (integration.hasEnvironment && environments[integrationId]) {
      localStorage.setItem(`integration_${integrationId}_environment`, environments[integrationId]);
    }

    setStatuses((prev) => ({ ...prev, [integrationId]: "connected" }));
    setEditingId(null);
  };

  const handleTest = async (integrationId: string) => {
    setTesting((prev) => ({ ...prev, [integrationId]: true }));

    // Mock проверка подключения
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const integration = integrations.find((i) => i.id === integrationId);
    if (!integration) return;

    const hasAllRequired = integration.fields
      .filter((f) => f.required)
      .every((f) => getStoredKey(f.key));

    if (hasAllRequired) {
      // Mock: случайно может быть ошибка
      const isError = Math.random() > 0.7;
      setStatuses((prev) => ({
        ...prev,
        [integrationId]: isError ? "error" : "connected",
      }));
    } else {
      setStatuses((prev) => ({ ...prev, [integrationId]: "disconnected" }));
    }

    setTesting((prev) => ({ ...prev, [integrationId]: false }));
  };

  const handleDisconnect = (integrationId: string) => {
    if (!confirm("Відключити цю інтеграцію?")) return;

    const integration = integrations.find((i) => i.id === integrationId);
    if (!integration) return;

    integration.fields.forEach((field) => {
      removeKey(field.key);
      setFormData((prev) => {
        const updated = { ...prev };
        delete updated[field.key];
        return updated;
      });
    });

    setStatuses((prev) => ({ ...prev, [integrationId]: "disconnected" }));
    setEditingId(null);
  };

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Підключено
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400">
            <AlertCircle className="w-3 h-3 mr-1" />
            Помилка
          </Badge>
        );
      case "disconnected":
      default:
        return (
          <Badge className="bg-slate-100 dark:bg-slate-900/20 text-slate-700 dark:text-slate-400">
            <X className="w-3 h-3 mr-1" />
            Відключено
          </Badge>
        );
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Zap className="h-7 w-7 text-purple-600 dark:text-purple-400" />
          Інтеграції
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Підключіть зовнішні сервіси для розширення функціональності
        </p>
      </div>

      {/* Security Banner */}
      <Card className="flex-shrink-0 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>🔐 Безпека:</strong> API-ключі зберігаються локально у вашому браузері або у зашифрованому сховищі.
            ChefOS ніколи не передає ключі третім сторонам.
          </p>
        </CardContent>
      </Card>

      {/* Integrations List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {integrations.map((integration, idx) => {
          const status = getStatus(integration.id);
          const isEditing = editingId === integration.id;
          const isTesting = testing[integration.id] || false;

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="overflow-hidden">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={integration.id} className="border-0">
                    <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="flex items-center gap-4 text-left flex-1 w-full">
                        {/* Left: Icon + Name + Description */}
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <integration.Icon size={24} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {integration.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {integration.description}
                          </p>
                        </div>

                        {/* Right: Status */}
                        <div className="hidden sm:flex items-center gap-2">
                          {getStatusBadge(status)}
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-6 py-4 space-y-4 border-t">
                      {/* Warning для OpenAI */}
                      {integration.hasWarning && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                          <p className="text-sm text-amber-800 dark:text-amber-200 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {integration.hasWarning}
                          </p>
                        </div>
                      )}

                      {/* Environment для Stripe */}
                      {integration.hasEnvironment && (
                        <div className="space-y-2">
                          <Label>Environment</Label>
                          <RadioGroup
                            value={environments[integration.id] || "sandbox"}
                            onValueChange={(value) =>
                              setEnvironments((prev) => ({
                                ...prev,
                                [integration.id]: value as Environment,
                              }))
                            }
                            disabled={status === "connected"}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="sandbox" id={`${integration.id}-sandbox`} />
                              <Label htmlFor={`${integration.id}-sandbox`} className="cursor-pointer">
                                Sandbox
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="production" id={`${integration.id}-production`} />
                              <Label htmlFor={`${integration.id}-production`} className="cursor-pointer">
                                Production
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}

                      {/* Status Indicator */}
                      <div>
                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2 block">
                          Статус:
                        </Label>
                        {getStatusBadge(status)}
                      </div>

                      {/* API Fields */}
                      {isEditing ? (
                        <div className="space-y-3 pt-3 border-t">
                          {integration.fields.map((field) => (
                            <div key={field.key} className="space-y-2">
                              <Label htmlFor={field.key}>
                                {field.name}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              <div className="relative">
                                <Input
                                  id={field.key}
                                  type={showKeys[field.key] ? "text" : field.type}
                                  placeholder={field.placeholder}
                                  value={formData[field.key] || getStoredKey(field.key) || ""}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      [field.key]: e.target.value,
                                    }))
                                  }
                                />
                                {field.type === "password" && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                    onClick={() => toggleShowKey(field.key)}
                                  >
                                    {showKeys[field.key] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-3">
                            <Button
                              onClick={() => handleConnect(integration.id)}
                              className="flex-1"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Підключити
                            </Button>
                            <Button
                              onClick={() => setEditingId(null)}
                              variant="outline"
                              className="flex-1"
                            >
                              Скасувати
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-3 border-t">
                          {integration.fields.map((field) => {
                            const storedValue = getStoredKey(field.key);
                            return (
                              <div
                                key={field.key}
                                className="flex items-center justify-between py-2 px-3 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                    {field.name}
                                  </p>
                                  {storedValue ? (
                                    <p className="text-sm font-mono text-slate-600 dark:text-slate-400 mt-1 truncate">
                                      {showKeys[field.key] ? storedValue : maskKey(storedValue)}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                                      Не встановлено
                                    </p>
                                  )}
                                </div>
                                {storedValue && (
                                  <Button
                                    onClick={() => toggleShowKey(field.key)}
                                    size="sm"
                                    variant="ghost"
                                    className="ml-2"
                                  >
                                    {showKeys[field.key] ? (
                                      <EyeOff className="w-4 h-4" />
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            );
                          })}

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-3">
                            {status === "disconnected" ? (
                              <Button
                                onClick={() => setEditingId(integration.id)}
                                className="flex-1"
                              >
                                Підключити
                              </Button>
                            ) : (
                              <>
                                <Button
                                  onClick={() => handleTest(integration.id)}
                                  variant="outline"
                                  className="flex-1"
                                  disabled={isTesting}
                                >
                                  {isTesting ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Перевірка...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 mr-2" />
                                      Перевірити підключення
                                    </>
                                  )}
                                </Button>
                                <Button
                                  onClick={() => handleDisconnect(integration.id)}
                                  variant="outline"
                                  className="flex-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Відключити
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Block - Связь с другими модулями */}
      <Card className="flex-shrink-0 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                Связь с другими модулями
              </p>
              <p className="text-xs text-purple-800 dark:text-purple-200">
                <strong>Ассистент</strong> (OpenAI), <strong>Экономика</strong> (Stripe), 
                <strong> Заказы</strong> (Stripe), <strong>Контент</strong> (Cloudinary), 
                <strong> Уведомления</strong> (SendGrid).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
