"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Zap, Eye, EyeOff, Trash2, Check, X, CreditCard, Mail, Image, Brain } from "lucide-react";

interface IntegrationField {
  name: string;
  key: string;
  type: "password" | "text";
  placeholder: string;
}

interface Integration {
  id: string;
  name: string;
  Icon: React.ComponentType<{ size: number; className: string }>;
  description: string;
  features: string[];
  fields: IntegrationField[];
}

const integrations: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    Icon: CreditCard,
    description: "Обробка платежів і керування рахунками",
    features: ["Платежі", "Рахунки", "Повернення", "Касса"],
    fields: [
      {
        name: "API ключ",
        key: "stripe_api_key",
        type: "password",
        placeholder: "sk_live_••••••••••••••••",
      },
      {
        name: "API секрет",
        key: "stripe_secret",
        type: "password",
        placeholder: "sk_secret_••••••••••••••••",
      },
    ],
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    Icon: Mail,
    description: "Надсилання трансакційних листів",
    features: ["Email листи", "Шаблони", "Аналітика", "Список контактів"],
    fields: [
      {
        name: "API ключ",
        key: "sendgrid_api_key",
        type: "password",
        placeholder: "SG.••••••••••••••••",
      },
    ],
  },
  {
    id: "cloudinary",
    name: "Cloudinary",
    Icon: Image,
    description: "Управління зображеннями і медіа-контентом",
    features: ["Обробка зображень", "Видео", "Оптимізація", "CDN"],
    fields: [
      {
        name: "API ключ",
        key: "cloudinary_api_key",
        type: "password",
        placeholder: "••••••••••••••••",
      },
      {
        name: "Cloud Name",
        key: "cloudinary_cloud_name",
        type: "text",
        placeholder: "your-cloud-name",
      },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    Icon: Brain,
    description: "AI асистент для генерування рецептів",
    features: ["GPT-4", "Генерація текстів", "Класифікація", "Переклад"],
    fields: [
      {
        name: "API ключ",
        key: "openai_api_key",
        type: "password",
        placeholder: "sk-••••••••••••••••",
      },
      {
        name: "Organization ID",
        key: "openai_org_id",
        type: "text",
        placeholder: "org-••••••••••••••••",
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

  // Загружаем сохраненные ключи при монтировании
  useEffect(() => {
    const loaded: Record<string, string> = {};
    integrations.forEach((integration) => {
      integration.fields.forEach((field) => {
        const stored = getStoredKey(field.key);
        if (stored) {
          loaded[field.key] = stored;
        }
      });
    });
    setFormData(loaded);
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

  // Проверяем, подключена ли интеграция
  const isConnected = (integrationId: string): boolean => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (!integration) return false;
    return integration.fields.some((field) => getStoredKey(field.key));
  };

  const handleEdit = (integrationId: string) => {
    setEditingId(editingId === integrationId ? null : integrationId);
  };

  const handleSave = (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (!integration) return;

    integration.fields.forEach((field) => {
      const value = formData[field.key] || "";
      if (value.trim()) {
        storeKey(field.key, value);
      }
    });

    setEditingId(null);
  };

  const handleDelete = (integrationId: string) => {
    if (!confirm("Видалити ключи цієї інтеграції?")) return;

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
  };

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <Zap size={32} className="text-purple-600" />
          Інтеграції
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Підключіть зовнішні сервіси для розширення функціональності. Всі ключи зберігаються безпечно в браузері.
        </p>
      </div>

      {/* Warning */}
      <Card className="p-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          🔒 <strong>Безпека:</strong> API ключи зберігаються локально у вашому браузері. Ніколи не діліться ключами!
        </p>
      </Card>

      {/* Integrations Accordion */}
      <div className="space-y-3">
        {integrations.map((integration, idx) => {
          const connected = isConnected(integration.id);
          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="overflow-hidden bg-gradient-to-r from-sky-50/50 to-cyan-50/50 dark:from-sky-950/30 dark:to-cyan-950/30 border border-sky-100 dark:border-sky-900/50">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={integration.id} className="border-0">
                    <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="flex items-center gap-4 text-left flex-1">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <integration.Icon size={24} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {integration.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {integration.description}
                          </p>
                        </div>
                        {/* Desktop: Status badge */}
                        <div className="hidden sm:flex items-center gap-2 ml-4">
                          <Badge
                            className={
                              connected
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400"
                            }
                          >
                            {connected ? (
                              <span className="flex items-center gap-1">
                                <Check size={14} /> Підключено
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <X size={14} /> Відключено
                              </span>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 space-y-4 border-t border-slate-200 dark:border-slate-700">
                      {/* Features */}
                      <div>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                          Можливості:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {integration.features.map((feature) => (
                            <Badge
                              key={feature}
                              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                          Статус:
                        </p>
                        <Badge
                          className={
                            connected
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400"
                          }
                        >
                          {connected ? (
                            <span className="flex items-center gap-1">
                              <Check size={14} /> Підключено
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <X size={14} /> Відключено
                            </span>
                          )}
                        </Badge>
                      </div>

                      {/* API Keys Form */}
                      {editingId === integration.id ? (
                        <div className="space-y-3 py-3 border-t border-slate-200 dark:border-slate-700 pt-4">
                          {integration.fields.map((field) => (
                            <div key={field.key}>
                              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide block mb-1">
                                {field.name}
                              </label>
                              <Input
                                type={showKeys[field.key] ? "text" : field.type}
                                placeholder={field.placeholder}
                                value={formData[field.key] || ""}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    [field.key]: e.target.value,
                                  }))
                                }
                                className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                              />
                            </div>
                          ))}

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-3">
                            <Button
                              onClick={() => handleSave(integration.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check size={16} className="mr-1" />
                              Зберегти
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
                        <div className="space-y-2 py-3 border-t border-slate-200 dark:border-slate-700 pt-4">
                          {integration.fields.map((field) => {
                            const storedValue = getStoredKey(field.key);
                            return (
                              <div
                                key={field.key}
                                className="flex items-center justify-between py-2 px-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              >
                                <div>
                                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                    {field.name}
                                  </p>
                                  {storedValue ? (
                                    <p className="text-sm font-mono text-slate-600 dark:text-slate-400 mt-1">
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
                                    className="text-slate-600 dark:text-slate-400"
                                  >
                                    {showKeys[field.key] ? (
                                      <EyeOff size={16} />
                                    ) : (
                                      <Eye size={16} />
                                    )}
                                  </Button>
                                )}
                              </div>
                            );
                          })}

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-3">
                            <Button
                              onClick={() => handleEdit(integration.id)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Редагувати
                            </Button>
                            {connected && (
                              <Button
                                onClick={() => handleDelete(integration.id)}
                                variant="outline"
                                className="flex-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 size={16} className="mr-1" />
                                Видалити
                              </Button>
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
    </motion.div>
  );
}
