"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Zap, Copy, ExternalLink, Check, X, Loader2, CreditCard, Mail, Image, Cpu } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: "connected" | "disconnected" | "error";
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
  features: string[];
}

const mockIntegrations: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Обробка платежів і керування рахунками",
    icon: CreditCard,
    status: "connected",
    apiKey: "sk_live_••••••••••••••••",
    apiSecret: "sk_secret_••••••••••••••••",
    features: ["Платежі", "Рахунки", "Повернення", "Касса"],
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    description: "Надсилання трансакційних листів",
    icon: Mail,
    status: "connected",
    apiKey: "SG.••••••••••••••••",
    features: ["Email листи", "Шаблони", "Аналітика", "Список контактів"],
  },
  {
    id: "cloudinary",
    name: "Cloudinary",
    description: "Управління зображеннями і медіа-контентом",
    icon: Image,
    status: "disconnected",
    features: ["Обробка зображень", "Видео", "Оптимізація", "CDN"],
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "AI асистент для генерування рецептів",
    icon: Cpu,
    status: "disconnected",
    apiKey: "sk_••••••••••••••••",
    features: ["GPT-4", "Генерація текстів", "Класифікація", "Переклад"],
  },
];

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((int) =>
          int.id === id ? { ...int, status: "connected" } : int
        )
      );
      setTestingId(null);
      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 2000);
    }, 2000);
  };

  const handleDisconnect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === id ? { ...int, status: "disconnected" } : int
      )
    );
  };

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 2000);
    }, 1500);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      connected: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-400", label: "Підключено" },
      disconnected: { bg: "bg-slate-50 dark:bg-slate-900/20", text: "text-slate-700 dark:text-slate-400", label: "Відключено" },
      error: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400", label: "Помилка" },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <div className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1`}>
        <div className={`w-2 h-2 rounded-full ${status === "connected" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-slate-400"}`} />
        {config.label}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Інтеграції
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Підключіть зовнішні сервіси для розширення функціональності
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
        <Zap size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          Всі ключи зберігаються в зашифрованому вигляді. Майте доступ тільки до необхідних ключів для безпеки.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 space-y-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <integration.icon size={32} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {integration.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <StatusBadge status={integration.status} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Можливості:
                </p>
                <div className="flex flex-wrap gap-2">
                  {integration.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {integration.status === "connected" && integration.apiKey && (
                <div className="space-y-3 border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      API ключ
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={integration.apiKey}
                        readOnly
                        className="flex-1 text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>

                  {integration.apiSecret && (
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        API секрет
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={integration.apiSecret}
                          readOnly
                          type="password"
                          className="flex-1 text-xs"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Copy size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {integration.status === "disconnected" && (
                <div className="space-y-3 border-t border-slate-200 dark:border-slate-700 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                      API ключ
                    </label>
                    <Input
                      placeholder={`Введіть API ключ для ${integration.name}`}
                      type="password"
                      className="w-full"
                    />
                  </div>
                  {(integration.id === "stripe" || integration.id === "openai") && (
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        API секрет
                      </label>
                      <Input
                        placeholder={`Введіть API секрет`}
                        type="password"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                {integration.status === "connected" ? (
                  <>
                    <Button
                      onClick={() => handleTestConnection(integration.id)}
                      disabled={testingId === integration.id}
                      variant="outline"
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      {testingId === integration.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Тестування...
                        </>
                      ) : successId === integration.id ? (
                        <>
                          <Check size={16} className="text-green-500" />
                          Успішно!
                        </>
                      ) : (
                        "Тестувати"
                      )}
                    </Button>
                    <Button
                      onClick={() => handleDisconnect(integration.id)}
                      variant="outline"
                      className="flex-1"
                    >
                      Відключити
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => handleConnect(integration.id)}
                      disabled={testingId === integration.id}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                    >
                      {testingId === integration.id ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Підключення...
                        </>
                      ) : (
                        "Підключити"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink size={16} />
                    </Button>
                  </>
                )}
              </div>

              {integration.webhookUrl && integration.status === "connected" && (
                <div className="text-xs bg-slate-50 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700">
                  <p className="font-medium text-slate-900 dark:text-white mb-1">
                    Webhook URL:
                  </p>
                  <code className="text-slate-600 dark:text-slate-400 break-all">
                    {integration.webhookUrl}
                  </code>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {successId && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
        >
          <Check size={18} />
          Дія виконана успішно!
        </motion.div>
      )}
    </motion.div>
  );
}
